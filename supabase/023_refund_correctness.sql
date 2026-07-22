-- Teknon Solutions — migration 023: refund correctness (ledger + locking)
-- Run after 022_gst_invoicing.sql. Idempotent.
--
-- Fixes two bugs found in a production review:
--  1. recordRefund() treated its `refundedAmount` argument as an absolute
--     total to overwrite payments.refunded_amount with. The admin-triggered
--     path (api/admin/refund-payment.js) computed and passed a true
--     cumulative total, but the webhook path (api/razorpay-webhook.js)
--     passed Razorpay's own per-refund-event amount — not cumulative — so a
--     payment's second-or-later refund silently corrupted refunded_amount
--     back down to that single event's amount instead of the true running
--     total. A `refunds` ledger table (one row per real Razorpay refund
--     transaction, keyed on razorpay_refund_id) makes the total always a
--     derived SUM(), naturally correct regardless of which caller reports
--     it or how many times the same refund event is redelivered.
--  2. api/admin/refund-payment.js's own refund-remaining check was a
--     classic check-then-act race: read the payment row, compute what's
--     left refundable, THEN call Razorpay — two concurrent requests for the
--     same payment could both read the same stale remaining amount and both
--     get a real refund issued at Razorpay before either write-back
--     happened. `refund_locked_at` is a simple mutex: a single conditional
--     UPDATE (atomic at the database level, same pattern already used by
--     recordPayment's claim-via-WHERE-status='created') claims the lock
--     before the Razorpay call is made; a concurrent second request's claim
--     UPDATE matches zero rows and is rejected before it can touch Razorpay
--     at all.

alter table public.payments add column if not exists refund_locked_at timestamptz;

create table if not exists public.refunds (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references public.payments(id) on delete restrict,
  razorpay_refund_id text not null unique,
  amount integer not null,
  created_at timestamptz not null default now()
);

alter table public.refunds enable row level security;

drop policy if exists "refunds: staff read" on public.refunds;
create policy "refunds: staff read"
  on public.refunds for select
  using (public.is_active_role('admin') or public.is_active_role('faculty'));

create index if not exists refunds_payment_idx on public.refunds (payment_id);

-- Idempotent on razorpay_refund_id (ON CONFLICT DO NOTHING): the same
-- Razorpay refund event landing twice (admin-triggered write + the
-- webhook's independent notification of that same refund, or a redelivered
-- webhook) is a no-op on the second call, not a double-count. Row-locks the
-- payment for the duration of the recompute, so two DIFFERENT refunds on
-- the same payment landing concurrently serialize instead of one clobbering
-- the other's SUM().
create or replace function public.record_refund(p_razorpay_payment_id text, p_razorpay_refund_id text, p_amount integer)
returns table (refunded_amount integer, status text)
language plpgsql
security definer
as $$
declare
  v_payment_id uuid;
  v_total_amount integer;
  v_new_total integer;
  v_status text;
begin
  select id, amount into v_payment_id, v_total_amount
  from public.payments
  where razorpay_payment_id = p_razorpay_payment_id
  for update;

  if v_payment_id is null then
    return;
  end if;

  insert into public.refunds (payment_id, razorpay_refund_id, amount)
  values (v_payment_id, p_razorpay_refund_id, p_amount)
  on conflict (razorpay_refund_id) do nothing;

  select coalesce(sum(r.amount), 0) into v_new_total
  from public.refunds r
  where r.payment_id = v_payment_id;

  v_status := case when v_new_total >= v_total_amount then 'refunded' else 'partially_refunded' end;

  update public.payments p
  set refunded_amount = v_new_total,
      status = v_status,
      refunded_at = now(),
      razorpay_refund_id = p_razorpay_refund_id,
      refund_locked_at = null
  where p.id = v_payment_id;

  return query select v_new_total, v_status;
end;
$$;

grant execute on function public.record_refund(text, text, integer) to service_role;

-- Teknon Solutions — migration 012: payments (Razorpay)
-- Run after 011_fix_profiles_rls_recursion.sql. Idempotent.
--
-- Every row is written server-side via api/create-order.js and
-- api/verify-payment.js / api/razorpay-webhook.js using the service_role
-- key (bypasses RLS by design — same pattern as enquiries). The amount is
-- always resolved server-side from a fixed tier→price map, never taken
-- from the client, so this table can't record a tampered price.

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  tier text not null check (tier in ('starter', 'professional', 'advanced')),
  amount integer not null, -- paise (smallest INR unit) — e.g. 199900 = ₹1,999
  currency text not null default 'INR',
  razorpay_order_id text not null,
  razorpay_payment_id text unique,
  status text not null default 'created' check (status in ('created', 'paid', 'failed')),
  created_at timestamptz not null default now()
);

alter table public.payments enable row level security;

create index if not exists payments_status_idx on public.payments (status);
create index if not exists payments_created_at_idx on public.payments (created_at desc);
create index if not exists payments_email_idx on public.payments (email);
create index if not exists payments_order_id_idx on public.payments (razorpay_order_id);

-- Only staff can read payment records from the client. All writes happen
-- server-side with the service_role key, so no client insert/update policy
-- exists (and shouldn't) — matches the enquiries table's design.
drop policy if exists "payments: staff read" on public.payments;
create policy "payments: staff read"
  on public.payments for select
  using (public.is_active_role('admin') or public.is_active_role('faculty'));

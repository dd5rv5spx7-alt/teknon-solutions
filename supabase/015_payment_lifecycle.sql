-- Teknon Solutions — migration 015: payment lifecycle (created/failed/refunds)
-- Run after 014_rate_limiting.sql. Idempotent.
--
-- Every write path previously hardcoded status: 'paid' — 'created' and
-- 'failed' were allowed by the original check constraint but nothing ever
-- actually wrote them, so a customer who filled the checkout form but never
-- completed payment left zero trace anywhere (not even the admin payments
-- list), and a declined payment only ever produced an email, never a
-- queryable row. api/create-order.js now writes a 'created' row up front;
-- api/verify-payment.js and api/razorpay-webhook.js claim and flip it to
-- 'paid' (or a new payment.failed handler flips it to 'failed'). This also
-- adds refund tracking, entirely missing before — a refund issued from the
-- Razorpay dashboard previously kept counting as revenue in this system
-- forever, with no way to reconcile short of manually cross-checking
-- Razorpay's own dashboard.

alter table public.payments drop constraint if exists payments_status_check;
alter table public.payments add constraint payments_status_check
  check (status in ('created', 'paid', 'failed', 'refunded', 'partially_refunded'));

alter table public.payments add column if not exists refunded_amount integer not null default 0;
alter table public.payments add column if not exists refunded_at timestamptz;
alter table public.payments add column if not exists razorpay_refund_id text;

create index if not exists payments_razorpay_order_id_unique_created_idx
  on public.payments (razorpay_order_id)
  where status = 'created';
-- ^ speeds up the "claim this order's created row" lookup in api/_lib/payments.js,
-- scoped to only the (small, transient) set of not-yet-completed orders.

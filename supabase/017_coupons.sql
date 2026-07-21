-- Teknon Solutions — migration 017: coupon / discount codes
-- Run after 016_abandoned_checkout.sql. Idempotent.
--
-- api/create-order.js already resolves the charge amount entirely
-- server-side from a fixed tier→price map (api/_lib/pricing.js) — the
-- browser only ever sends a tier key, never an amount, specifically so
-- checkout can't be tricked into charging less than the real price. A
-- coupon is layered on top of that same threat model: the browser sends a
-- coupon *code*, never a discount amount, and the actual discount is always
-- looked up and applied here, server-side, against this table.

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type text not null check (discount_type in ('percent', 'amount')),
  -- percent: 1-100. amount: paise, must be less than the cheapest applicable tier.
  discount_value integer not null check (discount_value > 0),
  -- null = applies to every tier; otherwise a subset of ('starter','professional','advanced').
  applicable_tiers text[],
  usage_limit integer, -- null = unlimited
  times_used integer not null default 0,
  expires_at timestamptz, -- null = never expires
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.coupons enable row level security;

drop policy if exists "coupons: admin manages" on public.coupons;
create policy "coupons: admin manages"
  on public.coupons for all
  using (public.is_active_role('admin'))
  with check (public.is_active_role('admin'));
-- No public/anon policy at all, intentionally — validation happens
-- server-side via the service_role key in api/create-order.js, the same way
-- pricing itself is never exposed to client-side trust decisions.

create index if not exists coupons_code_idx on public.coupons (code);

-- Track what was actually applied to each payment, so a later dispute or
-- reconciliation doesn't require cross-referencing Razorpay's raw amount
-- against what the coupon *should* have discounted.
alter table public.payments add column if not exists coupon_code text;
alter table public.payments add column if not exists discount_amount integer not null default 0;

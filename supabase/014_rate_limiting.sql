-- Teknon Solutions — migration 014: durable rate limiting
-- Run after 013_database_hygiene.sql. Idempotent.
--
-- api/_lib/rateLimit.js's in-memory limiter only throttles a single warm
-- serverless instance — it resets on cold start and isn't shared across
-- concurrent instances/regions, so it was already self-documented as a
-- known limitation. Two audit findings called this out concretely: the
-- public enquiry form's auto-reply can be triggered repeatedly (from the
-- business's own verified mailbox, to any address) by a distributed caller,
-- and /api/create-order has no real ceiling either. This adds a small
-- counter table + atomic increment function so every /api route's rate
-- limit is enforced from one shared, durable source instead of
-- per-instance memory — using the Supabase project already in place here,
-- no new external service required.

create table if not exists public.rate_limit_counters (
  key text primary key,
  count integer not null default 1,
  updated_at timestamptz not null default now()
);

alter table public.rate_limit_counters enable row level security;
-- No client-facing policies at all, intentionally — every access is
-- server-side via the service_role key (same pattern as payments/enquiries;
-- there is no legitimate reason for a browser to read or write this table).

create index if not exists rate_limit_counters_updated_at_idx on public.rate_limit_counters (updated_at);

-- Atomic increment-and-return via a single upsert, so two concurrent
-- requests from the same IP in the same window can't both read a stale
-- count and both squeak under the limit (a classic TOCTOU bug a plain
-- select-then-update would have).
create or replace function public.increment_rate_limit(p_key text)
returns integer
language sql
security definer
as $$
  insert into public.rate_limit_counters (key, count, updated_at)
  values (p_key, 1, now())
  on conflict (key) do update
    set count = public.rate_limit_counters.count + 1, updated_at = now()
  returning count;
$$;

grant execute on function public.increment_rate_limit(text) to service_role;

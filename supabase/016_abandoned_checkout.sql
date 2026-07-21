-- Teknon Solutions — migration 016: abandoned-checkout recovery
-- Run after 015_payment_lifecycle.sql. Idempotent.
--
-- Tracks whether a "finish enrolling" nudge has already been sent for a
-- payment that's stuck in 'created' (order started, never completed) — so
-- the daily digest cron (which now also sends these) doesn't re-nudge the
-- same abandoned checkout every day forever.

alter table public.payments add column if not exists nudge_sent_at timestamptz;

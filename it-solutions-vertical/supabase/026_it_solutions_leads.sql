-- Teknon Solutions — migration 026: IT Solutions leads on public.enquiries
-- Run after 025_case_insensitive_payment_email_rls.sql. Idempotent.
--
-- The new /it-solutions "Request a Quote" flow reuses the existing
-- /api/enquiry pipeline instead of standing up a parallel table/endpoint.
-- This migration is additive only — nullable columns plus a check
-- constraint, no drops, no rewrites of existing data. The
-- `add column ... not null default 'student'` backfills every existing row
-- via Postgres's metadata-only default fast path (PG 11+): the default is
-- recorded in catalog metadata and applied lazily on read, so this does not
-- rewrite the table regardless of its size. The existing RLS policies on
-- public.enquiries ("enquiries: staff read", "enquiries: staff update",
-- "enquiries: student reads own") already cover every row regardless of
-- these new columns, so none of them need to change.

alter table public.enquiries
  add column if not exists lead_type text not null default 'student'
    check (lead_type in ('student', 'business')),
  add column if not exists company text,
  add column if not exists service_interested text,
  add column if not exists preferred_timeline text;

create index if not exists enquiries_lead_type_idx on public.enquiries (lead_type);

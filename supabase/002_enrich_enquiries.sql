-- Teknon Solutions — migration 002: enrich enquiries
-- Run AFTER schema.sql, once, in the Supabase SQL Editor.
-- Safe to re-run: every statement is idempotent.

-- New columns: lead-qualifying info + submission metadata
alter table public.enquiries add column if not exists college text;
alter table public.enquiries add column if not exists year text;
alter table public.enquiries add column if not exists source_page text default '/';
alter table public.enquiries add column if not exists ip_address text;
alter table public.enquiries add column if not exists user_agent text;

-- Expand the status workflow: new → read → replied → enrolled, or archived
-- (archived = soft delete; we keep the row so nothing is silently lost)
alter table public.enquiries drop constraint if exists enquiries_status_check;
alter table public.enquiries add constraint enquiries_status_check
  check (status in ('new', 'read', 'replied', 'enrolled', 'archived'));

-- Existing rows using the old vocabulary ('contacted', 'closed') map onto the new one
update public.enquiries set status = 'replied' where status = 'contacted';
update public.enquiries set status = 'archived' where status = 'closed';

-- Speeds up the admin dashboard's search/filter/date-range queries
create index if not exists enquiries_status_idx on public.enquiries (status);
create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
create index if not exists enquiries_email_idx on public.enquiries (email);

-- Teknon Solutions — migration 021: CMS for marketing content
-- Run after 020_assignments.sql. Idempotent.
--
-- Named in CLAUDE.md's admin spec — the largest gap the audit found between
-- CLAUDE.md's stated scope and what shipped: every marketing section except
-- the blog required a code change + redeploy to edit. Scoped deliberately
-- narrow per the audit's own recommendation ("a structured JSON-per-section
-- editor is enough... avoid a full page-builder"): one generic table, admin
-- write / public read, wired into the two highest-churn, lowest-risk
-- sections (FAQ, Testimonials) rather than every section. Pricing is
-- intentionally NOT wired to this — its tier keys/amounts must stay in
-- lockstep with api/_lib/pricing.js's server-side source of truth, and a
-- loosely-typed CMS edit there risks a real mismatch between what's shown
-- and what Razorpay actually charges.

create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  content jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id) on delete set null
);

alter table public.site_content enable row level security;

drop policy if exists "site_content: public reads" on public.site_content;
create policy "site_content: public reads"
  on public.site_content for select
  using (true);
-- Public, unauthenticated read by design — this is exactly the content the
-- marketing site already shows every visitor via siteData.js; the CMS just
-- makes it editable without a redeploy, not more private than it was.

drop policy if exists "site_content: admin writes" on public.site_content;
create policy "site_content: admin writes"
  on public.site_content for all
  using (public.is_active_role('admin'))
  with check (public.is_active_role('admin'));

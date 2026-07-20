-- Teknon Solutions — migration 011: fix infinite recursion in profiles RLS
-- Run after 010_blog.sql. Idempotent.
--
-- Bug: "profiles: admin reads all", "profiles: faculty reads all", and
-- "profiles: admin updates all" each check the actor's own role via a
-- subquery on public.profiles — the SAME table the policy is attached to.
-- Under certain query shapes (observed when selecting role+status together
-- instead of role alone) Postgres re-evaluates this table's own RLS
-- policies while evaluating that subquery, which references the table
-- again, forming a cycle: "infinite recursion detected in policy for
-- relation \"profiles\"" (Postgres error 42P17). This broke every
-- authenticated read of profiles.role/status once the app started
-- selecting both columns together.
--
-- Fix: move the self-check into a SECURITY DEFINER function. Functions
-- marked SECURITY DEFINER run with the privileges of their owner and do
-- NOT re-trigger RLS on the tables they query internally, which breaks
-- the cycle.

create or replace function public.is_active_role(check_role text)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = check_role and status = 'active'
  );
$$;

drop policy if exists "profiles: admin reads all" on public.profiles;
create policy "profiles: admin reads all"
  on public.profiles for select
  using (public.is_active_role('admin'));

drop policy if exists "profiles: faculty reads all" on public.profiles;
create policy "profiles: faculty reads all"
  on public.profiles for select
  using (public.is_active_role('faculty'));

drop policy if exists "profiles: admin updates all" on public.profiles;
create policy "profiles: admin updates all"
  on public.profiles for update
  using (public.is_active_role('admin'));

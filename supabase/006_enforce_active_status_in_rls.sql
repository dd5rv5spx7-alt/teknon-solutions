-- Teknon Solutions — migration 006: make "Deactivate" actually revoke access
-- Run after 005_fix_role_trigger_service_role.sql. Idempotent.
--
-- Bug: the `status` column (active/inactive) that AdminPeople.jsx's
-- "Deactivate" button sets was never checked by any RLS policy. A
-- deactivated admin/faculty account could still read the full profiles
-- roster and all enquiries — deactivation was cosmetic only at the
-- database layer.
--
-- Fix: every policy that grants cross-user access based on the ACTOR's
-- role now also requires the actor's own profile status = 'active'. A
-- user's own "read own profile" policy is left unchanged — a deactivated
-- user should still be able to see their own row (so the app can show
-- them a clear "your account has been deactivated" message).
--
-- Note: this does not prevent a deactivated user from *authenticating*
-- (Supabase Auth sign-in is separate from RLS) — it removes their ability
-- to *read/write data* as admin/faculty. Fully blocking sign-in would
-- additionally require banning the auth.users row via the Admin API.

drop policy if exists "profiles: admin reads all" on public.profiles;
create policy "profiles: admin reads all"
  on public.profiles for select
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin' and p.status = 'active')
  );

drop policy if exists "profiles: faculty reads all" on public.profiles;
create policy "profiles: faculty reads all"
  on public.profiles for select
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'faculty' and p.status = 'active')
  );

drop policy if exists "profiles: admin updates all" on public.profiles;
create policy "profiles: admin updates all"
  on public.profiles for update
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin' and p.status = 'active')
  );

drop policy if exists "enquiries: staff read" on public.enquiries;
create policy "enquiries: staff read"
  on public.enquiries for select
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'faculty') and p.status = 'active')
  );

drop policy if exists "enquiries: staff update" on public.enquiries;
create policy "enquiries: staff update"
  on public.enquiries for update
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'faculty') and p.status = 'active')
  );

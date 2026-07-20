-- Teknon Solutions — migration 003: people admin (Students & Faculty management)
-- Run AFTER schema.sql (and 002_enrich_enquiries.sql if you ran that). Idempotent.

alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists status text not null default 'active' check (status in ('active', 'inactive'));

-- profiles has no email of its own yet on installs older than this migration —
-- backfill it from auth.users (accessible here; not accessible to the app itself).
alter table public.profiles add column if not exists email text;
update public.profiles p set email = u.email from auth.users u where p.id = u.id and p.email is null;

-- Keep new signups' email in sync too.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'student');
  return new;
end;
$$ language plpgsql security definer;

-- Faculty can see the full roster too (they need to see their students), not just their own row.
drop policy if exists "profiles: faculty reads all" on public.profiles;
create policy "profiles: faculty reads all"
  on public.profiles for select
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'faculty')
  );

-- Only admins can change someone else's role or active/inactive status. Faculty can view,
-- not edit — account management stays admin-only.
drop policy if exists "profiles: admin updates all" on public.profiles;
create policy "profiles: admin updates all"
  on public.profiles for update
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists profiles_status_idx on public.profiles (status);

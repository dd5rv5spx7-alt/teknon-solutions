-- Teknon Solutions — migration 004: student self-service
-- Run after 003_people_admin.sql. Idempotent.

-- Students (and everyone) can update their OWN profile row — but a trigger below
-- blocks anyone but an admin from changing role/status through this path, so a
-- student can't just PATCH their own row to role:'admin'.
drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own"
  on public.profiles for update
  using (auth.uid() = id);

create or replace function public.prevent_role_status_self_escalation()
returns trigger as $$
declare
  actor_role text;
begin
  if new.role is distinct from old.role or new.status is distinct from old.status then
    select role into actor_role from public.profiles where id = auth.uid();
    if actor_role is distinct from 'admin' then
      raise exception 'Only admins can change role or status.';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_profile_update_guard on public.profiles;
create trigger on_profile_update_guard
  before update on public.profiles
  for each row execute procedure public.prevent_role_status_self_escalation();

-- A logged-in student can see enquiry rows matching their own account email —
-- their own submission history, nothing belonging to anyone else.
drop policy if exists "enquiries: student reads own" on public.enquiries;
create policy "enquiries: student reads own"
  on public.enquiries for select
  using (email = (auth.jwt() ->> 'email'));

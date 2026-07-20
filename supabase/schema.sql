-- Teknon Solutions — Supabase schema
-- Run this once in your Supabase project's SQL Editor (Dashboard → SQL Editor → New query).
-- Safe to re-run: uses IF NOT EXISTS / OR REPLACE where possible.

-- ─────────────────────────────────────────────────────────────────────────
-- profiles: one row per authenticated user, linked to Supabase's built-in
-- auth.users table. This is where roles live — auth.users itself only
-- handles login credentials/sessions, never business data.
--
-- Already ran this file before on a project that predates phone/status?
-- Don't re-run this — run 003_people_admin.sql instead.
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  role text not null default 'student' check (role in ('admin', 'faculty', 'student', 'guest')),
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Everyone can read their own profile (needed so the app can check its own role).
drop policy if exists "profiles: read own" on public.profiles;
create policy "profiles: read own"
  on public.profiles for select
  using (auth.uid() = id);

-- Admins can read every profile.
drop policy if exists "profiles: admin reads all" on public.profiles;
create policy "profiles: admin reads all"
  on public.profiles for select
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Faculty can see the full roster too (they need to see their students).
drop policy if exists "profiles: faculty reads all" on public.profiles;
create policy "profiles: faculty reads all"
  on public.profiles for select
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'faculty')
  );

-- Only admins can change someone's role or active/inactive status.
drop policy if exists "profiles: admin updates all" on public.profiles;
create policy "profiles: admin updates all"
  on public.profiles for update
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists profiles_status_idx on public.profiles (status);

-- Users can update their own row (name/phone) — but the trigger below stops
-- anyone but an admin from changing role/status this way, even on their own row.
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

-- Auto-create a profile row the moment someone signs up, defaulting to 'student'.
-- You'll manually promote your own account to 'admin' after creating it (see README).
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'student');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────
-- enquiries: every contact-form submission, stored server-side via
-- /api/enquiry using the service_role key (bypasses RLS by design — the
-- public form has no logged-in user, so it can't satisfy a user-scoped policy).
--
-- Already ran this file before on a project that predates college/year/
-- source_page/ip_address/user_agent? Don't re-run this — run
-- 002_enrich_enquiries.sql instead, it migrates an existing table safely.
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  program text,
  college text,
  year text,
  message text,
  source_page text default '/',
  ip_address text,
  user_agent text,
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'enrolled', 'archived')),
  created_at timestamptz not null default now()
);

alter table public.enquiries enable row level security;

create index if not exists enquiries_status_idx on public.enquiries (status);
create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
create index if not exists enquiries_email_idx on public.enquiries (email);

-- Only admins and faculty can read enquiries from the client. The insert
-- itself happens server-side with the service_role key, which bypasses RLS,
-- so no public insert policy is needed (and shouldn't exist).
drop policy if exists "enquiries: staff read" on public.enquiries;
create policy "enquiries: staff read"
  on public.enquiries for select
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'faculty'))
  );

drop policy if exists "enquiries: staff update" on public.enquiries;
create policy "enquiries: staff update"
  on public.enquiries for update
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'faculty'))
  );

-- A logged-in student can see enquiries matching their own account email —
-- their own submission history, nothing belonging to anyone else.
drop policy if exists "enquiries: student reads own" on public.enquiries;
create policy "enquiries: student reads own"
  on public.enquiries for select
  using (email = (auth.jwt() ->> 'email'));

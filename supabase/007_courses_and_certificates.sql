-- Teknon Solutions — migration 007: courses catalog + certificates
-- Run after 006_enforce_active_status_in_rls.sql. Idempotent.
--
-- Backs two of the modules CLAUDE.md's spec calls for that didn't exist in
-- the database yet: a real, admin-managed course catalog (visible to
-- students in the student portal — the public marketing site's Courses
-- section still uses its own static content, unchanged), and certificates
-- admins can issue and students can view/print their own.

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  description text,
  duration text,
  price text,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.courses enable row level security;

drop policy if exists "courses: public reads published" on public.courses;
create policy "courses: public reads published"
  on public.courses for select
  using (is_published = true);

drop policy if exists "courses: staff read all" on public.courses;
create policy "courses: staff read all"
  on public.courses for select
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'faculty') and p.status = 'active')
  );

drop policy if exists "courses: admin writes" on public.courses;
create policy "courses: admin writes"
  on public.courses for all
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin' and p.status = 'active')
  )
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin' and p.status = 'active')
  );

create index if not exists courses_published_idx on public.courses (is_published);
create index if not exists courses_category_idx on public.courses (category);

-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  -- Denormalized on purpose: a certificate's course name must stay fixed
  -- even if the course catalog entry it referenced is later edited/removed.
  course_title text not null,
  certificate_number text not null unique,
  issued_by uuid references public.profiles(id),
  issued_at timestamptz not null default now()
);

alter table public.certificates enable row level security;

drop policy if exists "certificates: student reads own" on public.certificates;
create policy "certificates: student reads own"
  on public.certificates for select
  using (auth.uid() = student_id);

drop policy if exists "certificates: staff read all" on public.certificates;
create policy "certificates: staff read all"
  on public.certificates for select
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'faculty') and p.status = 'active')
  );

drop policy if exists "certificates: admin writes" on public.certificates;
create policy "certificates: admin writes"
  on public.certificates for all
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin' and p.status = 'active')
  )
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin' and p.status = 'active')
  );

create index if not exists certificates_student_idx on public.certificates (student_id);

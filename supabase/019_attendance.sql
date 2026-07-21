-- Teknon Solutions — migration 019: attendance tracking
-- Run after 018_batches.sql. Idempotent.
--
-- Named in CLAUDE.md's student-dashboard spec and, per the audit that
-- prompted this batch of migrations, "a constant parent/student question in
-- the Indian training-institute market and a natural gate for certificate
-- eligibility and faculty accountability." That last phrase is why writes
-- here are admin-OR-faculty, a deliberate deviation from this codebase's
-- usual admin-only write pattern (courses/certificates/blog) — faculty are
-- the ones actually running a batch's sessions, so an admin-only
-- restriction would make the feature unusable day to day.

create table if not exists public.attendance_sessions (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.batches(id) on delete restrict,
  session_date date not null,
  topic text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (batch_id, session_date)
);

alter table public.attendance_sessions enable row level security;

drop policy if exists "attendance_sessions: staff read all" on public.attendance_sessions;
create policy "attendance_sessions: staff read all"
  on public.attendance_sessions for select
  using (public.is_active_role_any(array['admin', 'faculty']));

drop policy if exists "attendance_sessions: staff writes" on public.attendance_sessions;
create policy "attendance_sessions: staff writes"
  on public.attendance_sessions for all
  using (public.is_active_role_any(array['admin', 'faculty']))
  with check (public.is_active_role_any(array['admin', 'faculty']));

create index if not exists attendance_sessions_batch_idx on public.attendance_sessions (batch_id);

-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.attendance_records (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.attendance_sessions(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  status text not null check (status in ('present', 'absent', 'late')),
  marked_at timestamptz not null default now(),
  unique (session_id, student_id)
);

alter table public.attendance_records enable row level security;

drop policy if exists "attendance_records: student reads own" on public.attendance_records;
create policy "attendance_records: student reads own"
  on public.attendance_records for select
  using (auth.uid() = student_id);

drop policy if exists "attendance_records: staff read all" on public.attendance_records;
create policy "attendance_records: staff read all"
  on public.attendance_records for select
  using (public.is_active_role_any(array['admin', 'faculty']));

drop policy if exists "attendance_records: staff writes" on public.attendance_records;
create policy "attendance_records: staff writes"
  on public.attendance_records for all
  using (public.is_active_role_any(array['admin', 'faculty']))
  with check (public.is_active_role_any(array['admin', 'faculty']));

create index if not exists attendance_records_session_idx on public.attendance_records (session_id);
create index if not exists attendance_records_student_idx on public.attendance_records (student_id);

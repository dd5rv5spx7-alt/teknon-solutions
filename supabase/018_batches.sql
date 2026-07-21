-- Teknon Solutions — migration 018: batch/cohort calendar
-- Run after 017_coupons.sql. Idempotent.
--
-- Courses (007) were catalog entries only — no concept of a scheduled
-- offering with a start date, mode, or seat count, which structurally
-- blocked any "next batch starts Aug 4, 3 seats left" urgency messaging or
-- an actual roster of who's in which cohort. This adds that layer on top
-- of the existing course catalog without changing it.

create table if not exists public.batches (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete restrict,
  name text not null, -- e.g. "Feb 2026 Batch"
  start_date date not null,
  end_date date,
  mode text not null default 'online' check (mode in ('online', 'offline', 'hybrid')),
  capacity integer,
  created_at timestamptz not null default now()
);

alter table public.batches enable row level security;

drop policy if exists "batches: public reads published" on public.batches;
create policy "batches: public reads published"
  on public.batches for select
  using (
    exists (select 1 from public.courses c where c.id = course_id and c.is_published = true)
  );

drop policy if exists "batches: staff read all" on public.batches;
create policy "batches: staff read all"
  on public.batches for select
  using (public.is_active_role_any(array['admin', 'faculty']));

drop policy if exists "batches: admin writes" on public.batches;
create policy "batches: admin writes"
  on public.batches for all
  using (public.is_active_role('admin'))
  with check (public.is_active_role('admin'));

create index if not exists batches_course_idx on public.batches (course_id);
create index if not exists batches_start_date_idx on public.batches (start_date);

-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.batch_enrollments (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.batches(id) on delete restrict,
  student_id uuid not null references public.profiles(id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  unique (batch_id, student_id)
);

alter table public.batch_enrollments enable row level security;

drop policy if exists "batch_enrollments: student reads own" on public.batch_enrollments;
create policy "batch_enrollments: student reads own"
  on public.batch_enrollments for select
  using (auth.uid() = student_id);

drop policy if exists "batch_enrollments: staff read all" on public.batch_enrollments;
create policy "batch_enrollments: staff read all"
  on public.batch_enrollments for select
  using (public.is_active_role_any(array['admin', 'faculty']));

drop policy if exists "batch_enrollments: admin writes" on public.batch_enrollments;
create policy "batch_enrollments: admin writes"
  on public.batch_enrollments for all
  using (public.is_active_role('admin'))
  with check (public.is_active_role('admin'));

create index if not exists batch_enrollments_batch_idx on public.batch_enrollments (batch_id);
create index if not exists batch_enrollments_student_idx on public.batch_enrollments (student_id);

-- Seats-remaining lookup for the public marketing site. A plain view would
-- either inherit the view-owner's full-table access (leaking every batch,
-- published or not, and letting anon see raw enrollment rows) or, with
-- security_invoker on, apply the QUERYING user's RLS to batch_enrollments —
-- which has no anon-read policy at all, so every count would come back 0.
-- A SECURITY DEFINER function (same pattern as verify_certificate in 008)
-- does the aggregation itself with elevated privilege, filters to published
-- courses explicitly, and only ever returns a count — never who's enrolled.
create or replace function public.batch_availability()
returns table (
  batch_id uuid,
  course_id uuid,
  name text,
  start_date date,
  end_date date,
  mode text,
  capacity integer,
  enrolled_count bigint,
  seats_remaining integer
)
language sql
security definer
set search_path = public
stable
as $$
  select
    b.id, b.course_id, b.name, b.start_date, b.end_date, b.mode, b.capacity,
    count(e.id) as enrolled_count,
    case when b.capacity is not null then greatest(b.capacity - count(e.id)::integer, 0) end as seats_remaining
  from public.batches b
  join public.courses c on c.id = b.course_id
  left join public.batch_enrollments e on e.batch_id = b.id
  where c.is_published = true
  group by b.id;
$$;

grant execute on function public.batch_availability() to anon, authenticated;

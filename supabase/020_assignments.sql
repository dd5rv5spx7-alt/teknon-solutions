-- Teknon Solutions — migration 020: assignments
-- Run after 019_attendance.sql. Idempotent.
--
-- Named in CLAUDE.md for both the admin and student dashboards. The
-- adjacent infrastructure (course_modules/course_lessons, lesson_progress)
-- already existed, making this a natural extension rather than a new
-- subsystem — visibility follows the exact same "published course" rule
-- course_lessons already uses (009_learning_portal.sql), and it's scoped to
-- a course rather than a batch so it doesn't depend on batch enrollment
-- (018) existing for a student to see their coursework.

create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete restrict,
  title text not null,
  description text,
  due_date timestamptz,
  max_score integer,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.assignments enable row level security;

drop policy if exists "assignments: public read if course published" on public.assignments;
create policy "assignments: public read if course published"
  on public.assignments for select
  using (
    exists (select 1 from public.courses c where c.id = course_id and c.is_published = true)
  );

drop policy if exists "assignments: staff read all" on public.assignments;
create policy "assignments: staff read all"
  on public.assignments for select
  using (public.is_active_role_any(array['admin', 'faculty']));

drop policy if exists "assignments: staff writes" on public.assignments;
create policy "assignments: staff writes"
  on public.assignments for all
  using (public.is_active_role_any(array['admin', 'faculty']))
  with check (public.is_active_role_any(array['admin', 'faculty']));

create index if not exists assignments_course_idx on public.assignments (course_id);

-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.assignment_submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete restrict,
  student_id uuid not null references public.profiles(id) on delete cascade,
  submission_text text,
  submission_url text,
  status text not null default 'submitted' check (status in ('submitted', 'graded')),
  grade integer,
  feedback text,
  graded_by uuid references public.profiles(id) on delete set null,
  graded_at timestamptz,
  submitted_at timestamptz not null default now(),
  unique (assignment_id, student_id)
);

alter table public.assignment_submissions enable row level security;

drop policy if exists "assignment_submissions: student reads own" on public.assignment_submissions;
create policy "assignment_submissions: student reads own"
  on public.assignment_submissions for select
  using (auth.uid() = student_id);

-- A student can create and edit their own submission (e.g. resubmit before
-- it's graded) but never touch grade/feedback/status directly — those
-- columns are only ever written by staff, enforced below with a trigger
-- rather than relying on the UI to simply not offer the field.
drop policy if exists "assignment_submissions: student writes own" on public.assignment_submissions;
create policy "assignment_submissions: student writes own"
  on public.assignment_submissions for insert
  with check (auth.uid() = student_id);

drop policy if exists "assignment_submissions: student updates own" on public.assignment_submissions;
create policy "assignment_submissions: student updates own"
  on public.assignment_submissions for update
  using (auth.uid() = student_id);

drop policy if exists "assignment_submissions: staff read all" on public.assignment_submissions;
create policy "assignment_submissions: staff read all"
  on public.assignment_submissions for select
  using (public.is_active_role_any(array['admin', 'faculty']));

drop policy if exists "assignment_submissions: staff writes" on public.assignment_submissions;
create policy "assignment_submissions: staff writes"
  on public.assignment_submissions for all
  using (public.is_active_role_any(array['admin', 'faculty']))
  with check (public.is_active_role_any(array['admin', 'faculty']));

create index if not exists assignment_submissions_assignment_idx on public.assignment_submissions (assignment_id);
create index if not exists assignment_submissions_student_idx on public.assignment_submissions (student_id);

-- Belt-and-suspenders: the "student updates own" policy above lets a
-- student UPDATE their own row (needed so they can revise submission_text
-- before grading), but a raw REST PATCH could otherwise set grade/status/
-- feedback on their own submission too — RLS alone can't restrict which
-- *columns* a policy applies to. This trigger blocks any non-staff actor
-- from changing those columns, independent of whatever the UI sends.
create or replace function public.prevent_self_grading()
returns trigger as $$
begin
  if auth.role() = 'service_role' then
    return new;
  end if;
  if (new.grade is distinct from old.grade
      or new.status is distinct from old.status
      or new.feedback is distinct from old.feedback
      or new.graded_by is distinct from old.graded_by
      or new.graded_at is distinct from old.graded_at)
     and not public.is_active_role_any(array['admin', 'faculty']) then
    raise exception 'Only staff can grade a submission.';
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_submission_update_guard on public.assignment_submissions;
create trigger on_submission_update_guard
  before update on public.assignment_submissions
  for each row execute procedure public.prevent_self_grading();

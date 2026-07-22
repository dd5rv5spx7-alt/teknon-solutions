-- Teknon Solutions — migration 013: database hygiene
-- Run after 012_payments.sql. Idempotent.
--
-- A batch of structural fixes found during a full-codebase audit:
--  1. Two redundant indexes removed.
--  2. certificates.issued_by no longer blocks deleting a staff member who
--     has ever issued a certificate.
--  3. Certificates denormalize the student's name at issuance (the same
--     treatment 007 already gives course_title, for the same reason: a
--     certificate is a proof-of-completion record and must stay fixed even
--     if the thing it references — the student's own editable profile name
--     — changes later). App code (AdminCertificates.jsx) now supplies this
--     at insert time.
--  4. profiles.email can no longer be self-edited by the row owner outside
--     admin/service_role — previously only role/status were protected by
--     the anti-escalation trigger, leaving email as an unguarded identity
--     field any authenticated user could PATCH via the REST API directly.
--  5. courses/certificates/course_modules/course_lessons/blog_posts's ~14
--     duplicated inline "is this caller an active admin/faculty" checks now
--     call the single recursion-safe helper introduced in 011, instead of
--     each re-implementing the same subquery — one source of truth for that
--     check instead of fourteen copies that can individually drift.
--  6. course_modules/course_lessons/lesson_progress's foreign keys no
--     longer CASCADE-delete: deleting a course that still has modules (or a
--     module that still has lessons, or a lesson with recorded student
--     progress) now fails with a clear error instead of silently destroying
--     every module/lesson/progress row underneath it in one click. An
--     empty, never-used course/module can still be deleted freely — this
--     only blocks deletion once there's real content or progress attached.

-- ── 1. Redundant indexes ────────────────────────────────────────────────
drop index if exists public.blog_posts_slug_idx; -- redundant with the inline `slug ... unique` column constraint
drop index if exists public.lesson_progress_student_idx; -- redundant with the (student_id, lesson_id) unique composite

-- ── 2. certificates.issued_by: SET NULL instead of blocking deletes ─────
do $$
declare
  con record;
begin
  for con in
    select conname from pg_constraint
    where conrelid = 'public.certificates'::regclass
      and confrelid = 'public.profiles'::regclass
      and contype = 'f'
      and conname like '%issued_by%'
  loop
    execute format('alter table public.certificates drop constraint %I', con.conname);
  end loop;
end $$;

alter table public.certificates
  add constraint certificates_issued_by_fkey
  foreign key (issued_by) references public.profiles(id) on delete set null;

-- ── 3. Denormalize student_name onto certificates ───────────────────────
alter table public.certificates add column if not exists student_name text;

update public.certificates c
set student_name = coalesce(p.full_name, p.email, 'Unknown Student')
from public.profiles p
where c.student_id = p.id and c.student_name is null;

-- Safe after the backfill above — every existing row now has a value, and
-- app code supplies one on every new insert going forward.
alter table public.certificates alter column student_name set not null;

create or replace function public.verify_certificate(cert_number text)
returns table (
  certificate_number text,
  course_title text,
  issued_at timestamptz,
  student_name text
)
language sql
security definer
set search_path = public
stable
as $$
  select c.certificate_number, c.course_title, c.issued_at, c.student_name
  from public.certificates c
  where c.certificate_number = cert_number
  limit 1;
$$;

-- ── 4. Protect profiles.email the same way role/status are protected ───
create or replace function public.prevent_role_status_self_escalation()
returns trigger as $$
declare
  actor_role text;
begin
  if auth.role() = 'service_role' then
    return new;
  end if;

  if new.role is distinct from old.role
     or new.status is distinct from old.status
     or new.email is distinct from old.email then
    select role into actor_role from public.profiles where id = auth.uid();
    if actor_role is distinct from 'admin' then
      raise exception 'Only admins can change role, status, or email.';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- ── 5. Consolidate role/status checks onto is_active_role() ────────────
-- is_active_role(text) (from 011) covers the single-role case; this covers
-- the "admin OR faculty" case used throughout 007/009/010.
create or replace function public.is_active_role_any(check_roles text[])
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = any(check_roles) and status = 'active'
  );
$$;

drop policy if exists "courses: staff read all" on public.courses;
create policy "courses: staff read all"
  on public.courses for select
  using (public.is_active_role_any(array['admin', 'faculty']));

drop policy if exists "courses: admin writes" on public.courses;
create policy "courses: admin writes"
  on public.courses for all
  using (public.is_active_role('admin'))
  with check (public.is_active_role('admin'));

drop policy if exists "certificates: staff read all" on public.certificates;
create policy "certificates: staff read all"
  on public.certificates for select
  using (public.is_active_role_any(array['admin', 'faculty']));

drop policy if exists "certificates: admin writes" on public.certificates;
create policy "certificates: admin writes"
  on public.certificates for all
  using (public.is_active_role('admin'))
  with check (public.is_active_role('admin'));

drop policy if exists "modules: staff read all" on public.course_modules;
create policy "modules: staff read all"
  on public.course_modules for select
  using (public.is_active_role_any(array['admin', 'faculty']));

drop policy if exists "modules: admin writes" on public.course_modules;
create policy "modules: admin writes"
  on public.course_modules for all
  using (public.is_active_role('admin'))
  with check (public.is_active_role('admin'));

drop policy if exists "lessons: staff read all" on public.course_lessons;
create policy "lessons: staff read all"
  on public.course_lessons for select
  using (public.is_active_role_any(array['admin', 'faculty']));

drop policy if exists "lessons: admin writes" on public.course_lessons;
create policy "lessons: admin writes"
  on public.course_lessons for all
  using (public.is_active_role('admin'))
  with check (public.is_active_role('admin'));

drop policy if exists "progress: staff read all" on public.lesson_progress;
create policy "progress: staff read all"
  on public.lesson_progress for select
  using (public.is_active_role_any(array['admin', 'faculty']));

drop policy if exists "blog: staff read all" on public.blog_posts;
create policy "blog: staff read all"
  on public.blog_posts for select
  using (public.is_active_role_any(array['admin', 'faculty']));

drop policy if exists "blog: admin writes" on public.blog_posts;
create policy "blog: admin writes"
  on public.blog_posts for all
  using (public.is_active_role('admin'))
  with check (public.is_active_role('admin'));

-- ── 6. Don't let a one-click course delete cascade away real content ───
do $$
declare
  con record;
begin
  for con in
    select conname from pg_constraint
    where conrelid = 'public.course_modules'::regclass
      and confrelid = 'public.courses'::regclass
      and contype = 'f'
  loop
    execute format('alter table public.course_modules drop constraint %I', con.conname);
  end loop;
end $$;
alter table public.course_modules
  add constraint course_modules_course_id_fkey
  foreign key (course_id) references public.courses(id) on delete restrict;

do $$
declare
  con record;
begin
  for con in
    select conname from pg_constraint
    where conrelid = 'public.course_lessons'::regclass
      and confrelid = 'public.course_modules'::regclass
      and contype = 'f'
  loop
    execute format('alter table public.course_lessons drop constraint %I', con.conname);
  end loop;
end $$;
alter table public.course_lessons
  add constraint course_lessons_module_id_fkey
  foreign key (module_id) references public.course_modules(id) on delete restrict;

do $$
declare
  con record;
begin
  for con in
    select conname from pg_constraint
    where conrelid = 'public.lesson_progress'::regclass
      and confrelid = 'public.course_lessons'::regclass
      and contype = 'f'
  loop
    execute format('alter table public.lesson_progress drop constraint %I', con.conname);
  end loop;
end $$;
alter table public.lesson_progress
  add constraint lesson_progress_lesson_id_fkey
  foreign key (lesson_id) references public.course_lessons(id) on delete restrict;

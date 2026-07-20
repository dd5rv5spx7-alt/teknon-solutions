-- Teknon Solutions — migration 009: learning portal (modules, lessons, progress)
-- Run after 008_certificate_verification.sql. Idempotent.

create table if not exists public.course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.course_modules enable row level security;

drop policy if exists "modules: public read if course published" on public.course_modules;
create policy "modules: public read if course published"
  on public.course_modules for select
  using (
    exists (select 1 from public.courses c where c.id = course_id and c.is_published = true)
  );

drop policy if exists "modules: staff read all" on public.course_modules;
create policy "modules: staff read all"
  on public.course_modules for select
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'faculty') and p.status = 'active')
  );

drop policy if exists "modules: admin writes" on public.course_modules;
create policy "modules: admin writes"
  on public.course_modules for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin' and p.status = 'active'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin' and p.status = 'active'));

create index if not exists course_modules_course_idx on public.course_modules (course_id);

-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.course_lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.course_modules(id) on delete cascade,
  title text not null,
  content text,
  video_url text,
  resource_url text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.course_lessons enable row level security;

drop policy if exists "lessons: public read if course published" on public.course_lessons;
create policy "lessons: public read if course published"
  on public.course_lessons for select
  using (
    exists (
      select 1 from public.course_modules m
      join public.courses c on c.id = m.course_id
      where m.id = module_id and c.is_published = true
    )
  );

drop policy if exists "lessons: staff read all" on public.course_lessons;
create policy "lessons: staff read all"
  on public.course_lessons for select
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'faculty') and p.status = 'active')
  );

drop policy if exists "lessons: admin writes" on public.course_lessons;
create policy "lessons: admin writes"
  on public.course_lessons for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin' and p.status = 'active'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin' and p.status = 'active'));

create index if not exists course_lessons_module_idx on public.course_lessons (module_id);

-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.course_lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (student_id, lesson_id)
);

alter table public.lesson_progress enable row level security;

drop policy if exists "progress: student reads own" on public.lesson_progress;
create policy "progress: student reads own"
  on public.lesson_progress for select
  using (auth.uid() = student_id);

drop policy if exists "progress: student writes own" on public.lesson_progress;
create policy "progress: student writes own"
  on public.lesson_progress for insert
  with check (auth.uid() = student_id);

drop policy if exists "progress: student deletes own" on public.lesson_progress;
create policy "progress: student deletes own"
  on public.lesson_progress for delete
  using (auth.uid() = student_id);

drop policy if exists "progress: staff read all" on public.lesson_progress;
create policy "progress: staff read all"
  on public.lesson_progress for select
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'faculty') and p.status = 'active')
  );

create index if not exists lesson_progress_student_idx on public.lesson_progress (student_id);
create index if not exists lesson_progress_lesson_idx on public.lesson_progress (lesson_id);

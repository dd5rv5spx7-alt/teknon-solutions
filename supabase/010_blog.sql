-- Teknon Solutions — migration 010: blog CMS
-- Run after 009_learning_portal.sql. Idempotent.

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  featured_image text,
  category text,
  tags text[] not null default '{}',
  author_name text,
  meta_title text,
  meta_description text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.blog_posts enable row level security;

drop policy if exists "blog: public reads published" on public.blog_posts;
create policy "blog: public reads published"
  on public.blog_posts for select
  using (is_published = true);

drop policy if exists "blog: staff read all" on public.blog_posts;
create policy "blog: staff read all"
  on public.blog_posts for select
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'faculty') and p.status = 'active')
  );

drop policy if exists "blog: admin writes" on public.blog_posts;
create policy "blog: admin writes"
  on public.blog_posts for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin' and p.status = 'active'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin' and p.status = 'active'));

create unique index if not exists blog_posts_slug_idx on public.blog_posts (slug);
create index if not exists blog_posts_published_idx on public.blog_posts (is_published, published_at desc);
create index if not exists blog_posts_category_idx on public.blog_posts (category);

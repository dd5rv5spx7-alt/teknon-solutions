-- Teknon Solutions — migration 008: public certificate verification
-- Run after 007_courses_and_certificates.sql. Idempotent.
--
-- The public /verify-certificate page needs to look up a certificate by its
-- exact number without a login. A broad "anyone can SELECT certificates"
-- RLS policy would let anyone list/enumerate every certificate ever issued
-- (student names included) via the REST API, not just look up the one they
-- have the number for. Instead, this is a SECURITY DEFINER function called
-- via RPC: it only ever returns the single row matching an exact
-- certificate_number, and only the fields needed to display a verification
-- result — nothing that enables browsing the full table.

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
  select c.certificate_number, c.course_title, c.issued_at, p.full_name
  from public.certificates c
  join public.profiles p on p.id = c.student_id
  where c.certificate_number = cert_number
  limit 1;
$$;

grant execute on function public.verify_certificate(text) to anon, authenticated;

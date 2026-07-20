-- Teknon Solutions — migration 005: fix role/status trigger for service_role writes
-- Run after 004_student_self_service.sql. Idempotent.
--
-- Bug: prevent_role_status_self_escalation() resolves the actor's role via
-- auth.uid(), which is NULL when a write comes from the service_role key
-- (no user JWT in that context). api/admin/create-person.js uses the
-- service_role key to PATCH a new user's role to 'faculty'/'student' right
-- after signup — that PATCH was being silently blocked by this trigger,
-- so every admin-assigned role was defaulting back to 'student'.
--
-- Fix: let a service_role write through unconditionally (it's already a
-- trusted, server-side-only credential — same trust level as bypassing RLS).

create or replace function public.prevent_role_status_self_escalation()
returns trigger as $$
declare
  actor_role text;
begin
  if auth.role() = 'service_role' then
    return new;
  end if;

  if new.role is distinct from old.role or new.status is distinct from old.status then
    select role into actor_role from public.profiles where id = auth.uid();
    if actor_role is distinct from 'admin' then
      raise exception 'Only admins can change role or status.';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

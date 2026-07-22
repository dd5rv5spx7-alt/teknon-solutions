-- Teknon Solutions — migration 025: case-insensitive payment email RLS
-- Run after 024_gst_billing_state.sql. Idempotent.
--
-- The "student reads own payments by email" policy (022) compared
-- auth.jwt() ->> 'email' to payments.email with plain case-sensitive
-- equality. api/create-order.js now normalizes email to lowercase before
-- storing it (matching api/admin/create-person.js's existing convention),
-- but a Supabase Auth session's JWT email claim reflects however the user
-- typed it at signup/login — which may not be lowercase — and could
-- silently lock a student out of their own invoice. lower() on both sides
-- removes the dependency on either side happening to already be normalized.

drop policy if exists "payments: student reads own by email" on public.payments;
create policy "payments: student reads own by email"
  on public.payments for select
  using (lower(auth.jwt() ->> 'email') = lower(email));

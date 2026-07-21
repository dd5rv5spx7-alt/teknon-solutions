-- Teknon Solutions — migration 022: GST-compliant invoicing
-- Run after 021_cms.sql. Idempotent.
--
-- The previous "receipt" email was a plain confirmation — no GSTIN, no
-- sequential invoice number, no HSN/SAC code, no CGST/SGST/IGST breakdown.
-- For a GST-registered business, Rule 46 of the CGST Rules requires all of
-- those on every tax invoice — a real compliance gap, not just a missing
-- nicety, once the business is GST-registered. IMPORTANT: the SAC code and
-- GST rate below (999293 / 18%) are a reasonable default for commercial
-- training services, not a substitute for your own accountant confirming
-- them — this migration and the invoice view both surface them as
-- plainly-visible constants specifically so they're easy to correct in one
-- place if your accountant says otherwise (see api/_lib/gst.js and
-- src/components/InvoiceModal.jsx).

alter table public.payments add column if not exists gstin text;
alter table public.payments add column if not exists billing_name text;
alter table public.payments add column if not exists billing_address text;
alter table public.payments add column if not exists invoice_number text unique;

create sequence if not exists public.invoice_number_seq start 1;

-- Assigns a sequential invoice number the moment a payment first becomes
-- 'paid' — covers both write paths in api/_lib/payments.js: a fresh INSERT
-- with status='paid' (the fallback path) and an UPDATE that flips an
-- existing 'created' row to 'paid' (the normal claim path).
create or replace function public.assign_invoice_number()
returns trigger as $$
begin
  if new.status = 'paid' and new.invoice_number is null then
    new.invoice_number := 'INV-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.invoice_number_seq')::text, 5, '0');
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_payment_assign_invoice on public.payments;
create trigger on_payment_assign_invoice
  before insert or update on public.payments
  for each row execute procedure public.assign_invoice_number();

-- Lets a logged-in student view (and print) their own invoice. payments has
-- no student_id / auth link at all — checkout has always been guest-style,
-- matched only by email, and this doesn't change that. Matching on the
-- JWT's own email claim instead of adding a new column means a student who
-- pays without being logged in (or logs in with a different account later)
-- can still see the invoice once they sign in with the same email, without
-- requiring any change to the checkout flow itself.
drop policy if exists "payments: student reads own by email" on public.payments;
create policy "payments: student reads own by email"
  on public.payments for select
  using (auth.jwt() ->> 'email' = email);

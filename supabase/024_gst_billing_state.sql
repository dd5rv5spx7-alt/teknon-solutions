-- Teknon Solutions — migration 024: capture buyer state for GST correctness
-- Run after 023_refund_correctness.sql. Idempotent.
--
-- computeGstSplit() (api/_lib/gst.js, mirrored in src/components/
-- InvoiceModal.jsx) had no real signal for which state the buyer is in when
-- no GSTIN was supplied, and defaulted that case to inter-state (IGST) —
-- but most individual B2C customers never provide a GSTIN at all, so nearly
-- every consumer invoice was silently misclassified regardless of the
-- buyer's actual location. This column captures the buyer's declared state
-- at checkout (now a required field, not gated behind the optional "I need
-- a GST invoice" toggle, since every payment gets a tax invoice per
-- migration 022's assign_invoice_number trigger) so the split has a real
-- basis instead of a GSTIN-presence proxy.

alter table public.payments add column if not exists billing_state text;

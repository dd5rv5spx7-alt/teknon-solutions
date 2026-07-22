// GST constants and computation for tax invoices — used by api/create-order.js
// (validation) and the invoice view (src/components/InvoiceModal.jsx, which
// duplicates the pure constants/math below since it renders client-side —
// see the comment there). Kept in one file so both sides can be corrected
// together if your accountant says the rate or SAC code should be different.
//
// SAC 999293 = "Commercial training and coaching services" under India's
// Services Accounting Code. GST_RATE 18% is the standard rate for most
// services, including commercial training. Neither of these is a
// substitute for your own accountant confirming them for your specific
// registration — they're deliberately isolated here as named constants
// instead of scattered magic numbers so there's exactly one place to
// correct if they're wrong.
export const SAC_CODE = '999293';
export const GST_RATE_PERCENT = 18;
// Andhra Pradesh's GST state code — A Teknon Solutions is based in
// Rajahmundry, AP (see index.html's address). A GSTIN starting with this
// code is intra-state (CGST+SGST split); anything else is inter-state (IGST).
export const SELLER_STATE_CODE = '37';

const GSTIN_RE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

export function isValidGstin(gstin) {
  return GSTIN_RE.test(String(gstin || '').trim().toUpperCase());
}

// amount is the paise actually charged (net of any coupon discount) — GST
// is computed on what was actually paid, not the tier's list price.
//
// State resolution: a GSTIN's first two digits ARE its registered state
// code and are legally authoritative for a B2B invoice, so a valid GSTIN
// always wins. Most buyers never provide one though (individual B2C
// checkout, not a business claiming input tax credit) — for those,
// billingState (collected as a required field at checkout, see
// CheckoutModal.jsx) is the only real signal of where the buyer actually
// is. Previously this fell back to treating "no GSTIN" as inter-state
// unconditionally, which misclassified the large majority of consumer
// invoices regardless of the buyer's actual state.
export function computeGstSplit(amount, gstin, billingState) {
  const gstinStateCode = gstin ? String(gstin).slice(0, 2) : null;
  const stateCode = gstinStateCode || billingState || null;
  const isIntraState = stateCode === SELLER_STATE_CODE;
  // The charged amount is treated as GST-inclusive (standard practice for
  // consumer-facing pricing in India) — back out the base amount rather
  // than adding GST on top, so the invoice total always matches what was
  // actually charged.
  const baseAmount = Math.round((amount * 100) / (100 + GST_RATE_PERCENT));
  const totalTax = amount - baseAmount;
  if (isIntraState) {
    const half = Math.round(totalTax / 2);
    return { baseAmount, cgst: half, sgst: totalTax - half, igst: 0, isIntraState: true };
  }
  return { baseAmount, cgst: 0, sgst: 0, igst: totalTax, isIntraState: false };
}

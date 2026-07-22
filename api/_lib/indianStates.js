// Valid India GST state/UT codes, for validating the billing_state a
// checkout submits. Mirrors src/data/indianStates.js — duplicated because
// api/ and src/ are separate bundles (same reason api/_lib/gst.js's
// constants are duplicated in src/components/InvoiceModal.jsx).
export const INDIAN_STATE_CODES = new Set([
  '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
  '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
  '21', '22', '23', '24', '26', '27', '29', '30', '31', '32',
  '33', '34', '35', '36', '37', '38', '97',
]);

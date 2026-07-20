// Authoritative tier pricing (amounts in paise — the smallest INR unit,
// as Razorpay's API requires). The client only ever sends a tier *key*;
// the price is always resolved here, server-side. Never trust an amount
// supplied by the client — that's how someone pays ₹1 for the Advanced
// tier by editing a request. Keep the displayed prices in
// src/data/siteData.js's PRICING array in sync with these if they change.
export const TIER_PRICES = {
  starter: { amount: 199900, label: 'Starter (2-week program)' },
  professional: { amount: 399900, label: 'Professional (4-week program)' },
  advanced: { amount: 699900, label: 'Advanced (8-week program)' },
};

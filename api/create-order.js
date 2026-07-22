// POST /api/create-order
// Creates a Razorpay order for one of the fixed course tiers. The amount is
// always resolved server-side from TIER_PRICES — the client only sends a
// tier key, never a price, so this endpoint can't be tricked into creating
// an order for less than the real amount. A coupon code, if supplied,
// follows the same rule: the browser sends a code, never a discount value —
// see api/_lib/coupons.js.

import { getClientIp, isRateLimited } from './_lib/rateLimit.js';
import { safeParse } from './_lib/http.js';
import { TIER_PRICES } from './_lib/pricing.js';
import { validateCoupon } from './_lib/coupons.js';
import { isValidGstin } from './_lib/gst.js';
import { INDIAN_STATE_CODES } from './_lib/indianStates.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 8 }; // 8 order attempts / 10 min / IP
const MAX_BODY_BYTES = 5_000;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const contentLength = Number(req.headers['content-length'] || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return res.status(413).json({ ok: false, error: 'Request body too large' });
  }

  const ip = getClientIp(req);
  if (await isRateLimited(ip, RATE_LIMIT, 'create-order')) {
    return res.status(429).json({ ok: false, error: 'Too many requests — please try again in a few minutes.' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {};
  const { tier, name, email, phone } = body;
  const billingState = body.billing_state ? String(body.billing_state).trim() : '';
  const rawCouponCode = body.coupon_code ? String(body.coupon_code).trim().toUpperCase().slice(0, 50) : '';
  // GST details are optional — only students who need a business invoice fill these in.
  const gstin = body.gstin ? String(body.gstin).trim().toUpperCase().slice(0, 15) : null;
  const billingName = body.billing_name ? String(body.billing_name).trim().slice(0, 200) : null;
  const billingAddress = body.billing_address ? String(body.billing_address).trim().slice(0, 500) : null;

  const tierInfo = TIER_PRICES[tier];
  if (!tierInfo) {
    return res.status(400).json({ ok: false, error: 'Invalid tier' });
  }

  const errors = [];
  if (!name || String(name).trim().length < 2) errors.push('name');
  if (!email || !EMAIL_RE.test(String(email).trim())) errors.push('email');
  if (!phone || String(phone).replace(/\D/g, '').length < 10) errors.push('phone');
  if (!INDIAN_STATE_CODES.has(billingState)) errors.push('billing_state');
  if (errors.length) {
    return res.status(400).json({ ok: false, error: 'Invalid or missing fields', fields: errors });
  }
  if (gstin && !isValidGstin(gstin)) {
    return res.status(400).json({ ok: false, error: 'That GSTIN doesn’t look valid — double-check the 15-character format.' });
  }

  // Lowercased consistently, same as api/admin/create-person.js — the RLS
  // policy letting a student read their own payments by email (migration
  // 022/025) compares against auth.jwt()'s email claim, and an inconsistent
  // case here would silently lock a student out of their own invoice.
  const cleanEmail = String(email).trim().toLowerCase();

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return res.status(500).json({ ok: false, error: 'Payments are not configured yet on this deployment.' });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let discountAmount = 0;
  let appliedCouponCode = null;
  if (rawCouponCode) {
    if (!supabaseUrl || !serviceKey) {
      return res.status(400).json({ ok: false, error: 'Coupons aren’t available on this deployment.' });
    }
    const validation = await validateCoupon(supabaseUrl, serviceKey, rawCouponCode, tier, tierInfo.amount);
    if (validation.error) {
      return res.status(400).json({ ok: false, error: validation.error });
    }
    discountAmount = validation.discountAmount;
    appliedCouponCode = rawCouponCode;
  }
  const finalAmount = tierInfo.amount - discountAmount;

  let order;
  try {
    const orderRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: finalAmount,
        currency: 'INR',
        receipt: `teknon_${tier}_${Date.now()}`,
        notes: {
          tier,
          name: String(name).trim().slice(0, 200),
          email: cleanEmail,
          phone: String(phone).trim().slice(0, 30),
          coupon_code: appliedCouponCode || '',
          discount_amount: String(discountAmount),
          billing_state: billingState,
          gstin: gstin || '',
          billing_name: billingName || '',
          billing_address: billingAddress || '',
        },
      }),
    });
    if (!orderRes.ok) {
      const text = await orderRes.text().catch(() => '');
      throw new Error(`Razorpay order create failed: ${orderRes.status} ${text.slice(0, 200)}`);
    }
    order = await orderRes.json();
  } catch (err) {
    return res.status(502).json({ ok: false, error: 'Could not create payment order. Please try again.' });
  }

  // Best-effort: record the order immediately as 'created', before any
  // payment has happened. Without this, a customer who fills the checkout
  // form and never completes Razorpay's widget leaves zero trace anywhere —
  // no lead, no admin visibility. A failure here doesn't block checkout;
  // api/verify-payment.js and api/razorpay-webhook.js both fall back to
  // inserting a fresh row directly if no 'created' row exists to claim.
  if (supabaseUrl && serviceKey) {
    try {
      await fetch(`${supabaseUrl}/rest/v1/payments`, {
        method: 'POST',
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          name: String(name).trim().slice(0, 200),
          email: cleanEmail,
          phone: String(phone).trim().slice(0, 30),
          tier,
          amount: finalAmount,
          currency: 'INR',
          razorpay_order_id: order.id,
          status: 'created',
          coupon_code: appliedCouponCode,
          discount_amount: discountAmount,
          billing_state: billingState,
          gstin,
          billing_name: billingName,
          billing_address: billingAddress,
        }),
      });
    } catch (err) {
      console.error('create-order: could not record created-order row', err);
    }
  }

  return res.status(200).json({
    ok: true,
    order_id: order.id,
    amount: order.amount,
    currency: order.currency,
    key_id: keyId, // public identifier — required by Razorpay's client-side checkout, safe to expose
    discount_amount: discountAmount,
  });
}

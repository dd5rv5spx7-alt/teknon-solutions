// POST /api/verify-payment
// Called by the client after Razorpay's checkout reports success. Never
// trusts that "success" on its own, and — critically — never trusts
// anything the client claims about WHAT was paid for either. Two separate
// checks:
//   1. Signature: recompute HMAC-SHA256(order_id|payment_id) and compare to
//      what was provided. Only Razorpay and this server know the secret, so
//      a match proves order_id+payment_id is a genuine, captured Razorpay
//      transaction.
//   2. Content: that signature says nothing about which tier/amount was
//      paid — it's mathematically independent of both. So tier/name/email/
//      phone are never taken from the request body. Instead, once the
//      signature checks out, the order is fetched back from Razorpay's own
//      API and `order.notes` (written authoritatively by api/create-order.js
//      at order-creation time, before any payment happened) is the only
//      source of truth for what gets recorded and emailed. Without this, a
//      real ₹1,999 Starter payment's genuine order_id/payment_id/signature
//      could be resubmitted with a claimed tier of 'advanced' and get
//      recorded — and emailed to the admin — as a ₹6,999 Advanced payment.

import { getClientIp, isRateLimited } from './_lib/rateLimit.js';
import { safeParse } from './_lib/http.js';
import { TIER_PRICES } from './_lib/pricing.js';
import { sendEmail, isEmailConfigured } from './_lib/email.js';
import { TEAM_EMAIL, adminPaymentEmailHtml, studentPaymentEmailHtml } from './_lib/emailTemplates.js';
import { recordPayment } from './_lib/payments.js';
import { verifyOrderPaymentSignature } from './_lib/razorpaySignature.js';

const MAX_BODY_BYTES = 5_000;
const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 20 }; // 20 verify attempts / 10 min / IP

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
  if (await isRateLimited(ip, RATE_LIMIT, 'verify-payment')) {
    return res.status(429).json({ ok: false, error: 'Too many requests — please try again in a few minutes.' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {};
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ ok: false, error: 'Missing payment verification fields' });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return res.status(500).json({ ok: false, error: 'Payments are not configured yet on this deployment.' });
  }

  // 1. Signature check — see api/_lib/razorpaySignature.js (tested in
  // tests/razorpaySignature.test.js) for why the shape check comes first.
  const signatureValid = verifyOrderPaymentSignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    providedSignature: razorpay_signature,
    keySecret,
  });
  if (!signatureValid) {
    return res.status(400).json({ ok: false, error: 'Payment could not be verified.' });
  }

  // 2. Content check. Fetch the order back from Razorpay itself — this is
  // the only place tier/name/email/phone come from. The client's request
  // body is not read for any of these, so there's nothing to tamper with.
  let order;
  try {
    const orderRes = await fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(String(razorpay_order_id))}`, {
      headers: { Authorization: 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64') },
    });
    if (!orderRes.ok) throw new Error(`Razorpay order fetch failed: ${orderRes.status}`);
    order = await orderRes.json();
  } catch (err) {
    console.error('verify-payment: could not fetch order from Razorpay', err);
    return res.status(502).json({ ok: false, error: 'Could not verify this payment. Please contact us with your payment ID.' });
  }

  const tier = order.notes?.tier;
  const tierInfo = TIER_PRICES[tier];
  // A coupon (api/_lib/coupons.js) can legitimately reduce order.amount
  // below tierInfo.amount — order.notes.discount_amount records exactly how
  // much, written authoritatively by api/create-order.js at order-creation
  // time, so the expected amount is tierInfo.amount minus that, not
  // tierInfo.amount itself.
  const discountAmount = Math.max(0, Number(order.notes?.discount_amount) || 0);
  const expectedAmount = tierInfo ? tierInfo.amount - discountAmount : null;
  if (!tierInfo || order.amount !== expectedAmount) {
    // Order exists and is signed genuinely, but its own recorded amount
    // doesn't match what that tier (net of any coupon) should cost — treat
    // as unverifiable rather than guess.
    console.error('verify-payment: order tier/amount mismatch', { order_id: razorpay_order_id, tier, orderAmount: order.amount, expectedAmount });
    return res.status(400).json({ ok: false, error: 'Could not verify payment details.' });
  }

  const clean = {
    name: String(order.notes?.name || 'Unknown').trim().slice(0, 200),
    email: String(order.notes?.email || '').trim().slice(0, 200),
    phone: String(order.notes?.phone || '').trim().slice(0, 30),
    tier,
    amount: order.amount,
    currency: 'INR',
    razorpay_order_id: String(razorpay_order_id).slice(0, 100),
    razorpay_payment_id: String(razorpay_payment_id).slice(0, 100),
    status: 'paid',
    coupon_code: order.notes?.coupon_code || null,
    discount_amount: discountAmount,
    gstin: order.notes?.gstin || null,
    billing_name: order.notes?.billing_name || null,
    billing_address: order.notes?.billing_address || null,
  };

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const dbConfigured = Boolean(supabaseUrl && serviceKey);
  // Whichever of verify-payment / the Razorpay webhook is the FIRST to
  // successfully claim or insert this payment "wins" and owns sending the
  // receipt emails — see the comment in api/_lib/payments.js for how that's
  // made race-safe even if both requests land at the same instant.
  let stored = false;
  let isNewPayment = !dbConfigured; // no DB to dedupe against → always treat as new

  if (dbConfigured) {
    const result = await recordPayment(supabaseUrl, serviceKey, clean);
    stored = result.stored;
    isNewPayment = result.isNewPayment;
    if (!stored) {
      console.error('verify-payment: could not record payment', clean.razorpay_payment_id);
    }
  } else {
    console.error('verify-payment: Supabase not configured — a verified payment was not stored anywhere', clean.razorpay_payment_id);
  }

  if (isEmailConfigured() && isNewPayment) {
    const subjectSafeName = clean.name.replace(/[\r\n]+/g, ' ');
    try {
      await sendEmail({
        to: TEAM_EMAIL,
        subject: `💳 Payment received — ${subjectSafeName} (${tierInfo.label})`,
        html: adminPaymentEmailHtml(clean, tierInfo),
      });
      await sendEmail({
        to: clean.email,
        bcc: TEAM_EMAIL,
        subject: 'Payment confirmed — A Teknon Solutions',
        html: studentPaymentEmailHtml(clean, tierInfo),
      });
    } catch (err) {
      // Same reasoning — a failed receipt email doesn't undo a verified payment.
      console.error('verify-payment: email send failed', err);
    }
  } else if (!isEmailConfigured()) {
    console.error('verify-payment: email not configured — no receipt was sent for', clean.razorpay_payment_id);
  }

  return res.status(200).json({ ok: true, stored });
}


// POST /api/admin/refund-payment
// Admin-only. Issues a real refund via Razorpay's Refunds API for a payment
// already recorded in our own payments table, then records the refund
// locally so AdminPayments reflects it immediately rather than waiting on
// the refund.processed webhook (which also fires and calls the same
// recording helper — idempotent, so that's a harmless second write, not a
// duplicate).

import { getClientIp, isRateLimited } from '../_lib/rateLimit.js';
import { safeParse } from '../_lib/http.js';
import { recordRefund } from '../_lib/payments.js';

const RATE_LIMIT = { windowMs: 60 * 60 * 1000, max: 20 }; // 20 refunds / hour / IP
const MAX_BODY_BYTES = 2_000;

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
  if (await isRateLimited(ip, RATE_LIMIT, 'refund-payment')) {
    return res.status(429).json({ ok: false, error: 'Too many requests — please try again later.' });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({ ok: false, error: 'Supabase is not configured on the server yet.' });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return res.status(500).json({ ok: false, error: 'Payments are not configured yet on this deployment.' });
  }

  // ── Verify the caller is a real, currently-valid, active admin ──
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) {
    return res.status(401).json({ ok: false, error: 'Not signed in.' });
  }
  let callerId;
  try {
    const whoRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { apikey: serviceKey, Authorization: `Bearer ${token}` },
    });
    if (!whoRes.ok) throw new Error('Invalid session');
    callerId = (await whoRes.json()).id;
  } catch {
    return res.status(401).json({ ok: false, error: 'Your session has expired — please sign in again.' });
  }
  try {
    const roleRes = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${callerId}&select=role,status`, {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
    });
    const [callerProfile] = roleRes.ok ? await roleRes.json() : [];
    if (callerProfile?.role !== 'admin' || callerProfile?.status !== 'active') {
      return res.status(403).json({ ok: false, error: 'Only active admins can issue refunds.' });
    }
  } catch {
    return res.status(500).json({ ok: false, error: 'Could not verify your permissions.' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {};
  const paymentRowId = String(body.payment_id || '');
  const requestedAmount = body.amount != null ? Number(body.amount) : null;
  if (!paymentRowId) {
    return res.status(400).json({ ok: false, error: 'Missing payment_id' });
  }
  if (requestedAmount != null && (!Number.isInteger(requestedAmount) || requestedAmount <= 0)) {
    return res.status(400).json({ ok: false, error: 'Invalid refund amount' });
  }

  // Look up the real payment row — the razorpay_payment_id and amount to
  // refund always come from our own database, never trusted from the
  // client, so a tampered request can't refund a different payment ID or
  // more than what was actually charged minus what's already been refunded.
  let payment;
  try {
    const payRes = await fetch(`${supabaseUrl}/rest/v1/payments?id=eq.${encodeURIComponent(paymentRowId)}&select=*`, {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
    });
    const rows = payRes.ok ? await payRes.json() : [];
    payment = rows[0];
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Could not look up this payment.' });
  }
  if (!payment || !payment.razorpay_payment_id) {
    return res.status(404).json({ ok: false, error: 'Payment not found.' });
  }
  if (payment.status !== 'paid' && payment.status !== 'partially_refunded') {
    return res.status(400).json({ ok: false, error: `Can't refund a payment with status "${payment.status}".` });
  }

  const remaining = payment.amount - (payment.refunded_amount || 0);
  const refundAmount = requestedAmount ?? remaining;
  if (refundAmount > remaining) {
    return res.status(400).json({ ok: false, error: `Only ₹${(remaining / 100).toFixed(2)} remains refundable on this payment.` });
  }

  let refund;
  try {
    const refundRes = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(payment.razorpay_payment_id)}/refund`, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: refundAmount }),
    });
    if (!refundRes.ok) {
      const text = await refundRes.text().catch(() => '');
      throw new Error(`Razorpay refund failed: ${refundRes.status} ${text.slice(0, 200)}`);
    }
    refund = await refundRes.json();
  } catch (err) {
    console.error('refund-payment: Razorpay refund call failed', err);
    return res.status(502).json({ ok: false, error: 'Could not process the refund with Razorpay. Please try again.' });
  }

  const totalRefunded = (payment.refunded_amount || 0) + refundAmount;
  await recordRefund(supabaseUrl, serviceKey, {
    razorpayPaymentId: payment.razorpay_payment_id,
    refundId: refund.id,
    refundedAmount: totalRefunded,
    totalAmount: payment.amount,
  });

  return res.status(200).json({ ok: true, refund_id: refund.id, refunded_amount: totalRefunded });
}

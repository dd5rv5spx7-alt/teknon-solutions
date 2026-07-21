// POST /api/create-order
// Creates a Razorpay order for one of the fixed course tiers. The amount is
// always resolved server-side from TIER_PRICES — the client only sends a
// tier key, never a price, so this endpoint can't be tricked into creating
// an order for less than the real amount.

import { getClientIp, isRateLimited } from './_lib/rateLimit.js';
import { safeParse } from './_lib/http.js';
import { TIER_PRICES } from './_lib/pricing.js';

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
  if (isRateLimited(ip, RATE_LIMIT)) {
    return res.status(429).json({ ok: false, error: 'Too many requests — please try again in a few minutes.' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {};
  const { tier, name, email, phone } = body;

  const tierInfo = TIER_PRICES[tier];
  if (!tierInfo) {
    return res.status(400).json({ ok: false, error: 'Invalid tier' });
  }

  const errors = [];
  if (!name || String(name).trim().length < 2) errors.push('name');
  if (!email || !EMAIL_RE.test(String(email).trim())) errors.push('email');
  if (!phone || String(phone).replace(/\D/g, '').length < 10) errors.push('phone');
  if (errors.length) {
    return res.status(400).json({ ok: false, error: 'Invalid or missing fields', fields: errors });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return res.status(500).json({ ok: false, error: 'Payments are not configured yet on this deployment.' });
  }

  let order;
  try {
    const orderRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: tierInfo.amount,
        currency: 'INR',
        receipt: `teknon_${tier}_${Date.now()}`,
        notes: {
          tier,
          name: String(name).trim().slice(0, 200),
          email: String(email).trim().slice(0, 200),
          phone: String(phone).trim().slice(0, 30),
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

  return res.status(200).json({
    ok: true,
    order_id: order.id,
    amount: order.amount,
    currency: order.currency,
    key_id: keyId, // public identifier — required by Razorpay's client-side checkout, safe to expose
  });
}


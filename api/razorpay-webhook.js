// POST /api/razorpay-webhook
// Reliability backstop for /api/verify-payment: if a customer pays but
// closes the tab before the client-side verify call fires (network drop,
// browser crash, etc.), this webhook — configured directly in the Razorpay
// dashboard, delivered straight from Razorpay's servers — still records the
// payment. Idempotent on razorpay_payment_id, so if both paths fire for the
// same payment, the second write is a safe no-op rather than a duplicate.
//
// Needs the RAW request body to verify the signature (JSON.stringify of a
// parsed body is not guaranteed byte-identical to what Razorpay actually
// sent), so body parsing is disabled for this route.

import crypto from 'node:crypto';
import { TIER_PRICES } from './_lib/pricing.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

const SIGNATURE_RE = /^[0-9a-f]{64}$/i;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }

  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    // Not configured — nothing we can safely verify, so don't process. This
    // is a backstop; the primary path (verify-payment) still works fine
    // without a webhook configured.
    return res.status(200).json({ ok: true, skipped: true });
  }

  let rawBody;
  try {
    rawBody = await readRawBody(req);
  } catch (err) {
    console.error('razorpay-webhook: failed to read request body', err);
    return res.status(400).json({ ok: false, error: 'Could not read request body' });
  }

  const providedSig = String(req.headers['x-razorpay-signature'] || '');
  if (!SIGNATURE_RE.test(providedSig)) {
    return res.status(400).json({ ok: false, error: 'Invalid signature' });
  }

  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  const valid = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(providedSig));
  if (!valid) {
    return res.status(400).json({ ok: false, error: 'Invalid signature' });
  }

  let event;
  try {
    event = JSON.parse(rawBody.toString('utf8'));
  } catch {
    return res.status(400).json({ ok: false, error: 'Malformed payload' });
  }

  if (event.event !== 'payment.captured') {
    return res.status(200).json({ ok: true, ignored: event.event });
  }

  const payment = event.payload?.payment?.entity;
  const tier = payment?.notes?.tier;
  const tierInfo = TIER_PRICES[tier];
  if (!payment || !tierInfo) {
    console.error('razorpay-webhook: payment.captured with unrecognized tier/payload shape', tier);
    return res.status(200).json({ ok: true, ignored: 'unrecognized tier or payload shape' });
  }

  const clean = {
    name: String(payment.notes?.name || payment.email || 'Unknown').slice(0, 200),
    email: String(payment.notes?.email || payment.email || '').slice(0, 200),
    phone: String(payment.notes?.phone || payment.contact || '').slice(0, 30),
    tier,
    amount: tierInfo.amount,
    currency: 'INR',
    razorpay_order_id: String(payment.order_id || '').slice(0, 100),
    razorpay_payment_id: String(payment.id || '').slice(0, 100),
    status: 'paid',
  };

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (supabaseUrl && serviceKey) {
    try {
      const dbRes = await fetch(`${supabaseUrl}/rest/v1/payments?on_conflict=razorpay_payment_id`, {
        method: 'POST',
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=ignore-duplicates,return=minimal',
        },
        body: JSON.stringify(clean),
      });
      if (!dbRes.ok) {
        const text = await dbRes.text().catch(() => '');
        console.error('razorpay-webhook: Supabase write failed', dbRes.status, text.slice(0, 500));
      }
    } catch (err) {
      // Best-effort — Razorpay retries webhook deliveries on failure anyway.
      console.error('razorpay-webhook: Supabase write threw', err);
    }
  } else {
    console.error('razorpay-webhook: Supabase not configured — a captured payment was not stored anywhere', clean.razorpay_payment_id);
  }

  return res.status(200).json({ ok: true });
}

// Buffers chunks as Buffers and concatenates once at the end. Concatenating
// via `data += chunk` instead would coerce each Buffer to a string
// independently (implicit per-chunk toString('utf8')), which can corrupt a
// multi-byte UTF-8 character that happens to be split across two chunks —
// and a corrupted body produces a signature mismatch for an otherwise
// completely genuine webhook delivery.
function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => {
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

// POST /api/razorpay-webhook
// Reliability backstop for /api/verify-payment: if a customer pays but
// closes the tab before the client-side verify call fires (network drop,
// browser crash, etc.), this webhook — configured directly in the Razorpay
// dashboard, delivered straight from Razorpay's servers — still records the
// payment. Idempotent per event (see api/_lib/payments.js), so if both
// paths fire for the same payment, the second write is a safe no-op rather
// than a duplicate. Also the only path that ever hears about payment.failed
// and refund.processed — verify-payment.js only ever runs after a success.
//
// Needs the RAW request body to verify the signature (JSON.stringify of a
// parsed body is not guaranteed byte-identical to what Razorpay actually
// sent), so body parsing is disabled for this route.

import crypto from 'node:crypto';
import { TIER_PRICES } from './_lib/pricing.js';
import { sendEmail, isEmailConfigured } from './_lib/email.js';
import {
  TEAM_EMAIL,
  emailRow,
  internalEmailHtml,
  ADMIN_URL,
  adminPaymentEmailHtml,
  studentPaymentEmailHtml,
} from './_lib/emailTemplates.js';
import { recordPayment, recordFailedPayment, recordRefund } from './_lib/payments.js';

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

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const dbConfigured = Boolean(supabaseUrl && serviceKey);

  if (event.event === 'payment.failed') {
    const payment = event.payload?.payment?.entity;
    if (dbConfigured) await recordFailedPayment(supabaseUrl, serviceKey, payment?.order_id);
    await notifyPaymentFailed(payment);
    return res.status(200).json({ ok: true });
  }

  if (event.event === 'refund.processed' || event.event === 'refund.created') {
    // refund.created fires immediately (refund initiated); refund.processed
    // fires once it's actually settled. Recording on both is harmless —
    // recordRefund() is a plain update keyed on razorpay_payment_id, so a
    // second delivery just overwrites with the same (or updated) amount.
    const refund = event.payload?.refund?.entity;
    const razorpayPaymentId = refund?.payment_id;
    if (dbConfigured && razorpayPaymentId) {
      await recordRefund(supabaseUrl, serviceKey, {
        razorpayPaymentId,
        refundId: refund.id,
        refundedAmount: refund.amount,
        totalAmount: await lookupPaymentAmount(supabaseUrl, serviceKey, razorpayPaymentId),
      });
    }
    return res.status(200).json({ ok: true });
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

  // Trust what Razorpay says was actually captured (payment.amount), never
  // what the currently-deployed pricing.js says a tier costs right now — a
  // price edited between order-creation and this webhook firing must never
  // change what gets recorded for an already-completed transaction. A
  // coupon (api/_lib/coupons.js) can also legitimately make the captured
  // amount less than tierInfo.amount — payment.notes.discount_amount
  // records exactly how much, written authoritatively by
  // api/create-order.js. If the captured amount doesn't match tier price
  // minus that discount, something's wrong (stale price map, tampered
  // notes) — money still moved, so record it rather than silently drop it,
  // but flag it for a human to check rather than trusting the mismatch.
  const discountAmount = Math.max(0, Number(payment.notes?.discount_amount) || 0);
  if (payment.amount !== tierInfo.amount - discountAmount) {
    console.error('razorpay-webhook: captured amount does not match current tier price — recording amount as-captured for manual review', {
      payment_id: payment.id,
      tier,
      capturedAmount: payment.amount,
      expectedAmount: tierInfo.amount - discountAmount,
    });
  }

  const clean = {
    name: String(payment.notes?.name || payment.email || 'Unknown').slice(0, 200),
    email: String(payment.notes?.email || payment.email || '').slice(0, 200),
    phone: String(payment.notes?.phone || payment.contact || '').slice(0, 30),
    tier,
    amount: payment.amount,
    currency: 'INR',
    razorpay_order_id: String(payment.order_id || '').slice(0, 100),
    razorpay_payment_id: String(payment.id || '').slice(0, 100),
    coupon_code: payment.notes?.coupon_code || null,
    discount_amount: discountAmount,
    status: 'paid',
  };

  let isNewPayment = !dbConfigured;

  if (dbConfigured) {
    const result = await recordPayment(supabaseUrl, serviceKey, clean);
    isNewPayment = result.isNewPayment;
    if (!result.stored) {
      console.error('razorpay-webhook: could not record payment', clean.razorpay_payment_id);
    }
  } else {
    console.error('razorpay-webhook: Supabase not configured — a captured payment was not stored anywhere', clean.razorpay_payment_id);
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
      console.error('razorpay-webhook: email send failed', err);
    }
  }

  return res.status(200).json({ ok: true });
}

async function lookupPaymentAmount(supabaseUrl, serviceKey, razorpayPaymentId) {
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/payments?razorpay_payment_id=eq.${encodeURIComponent(razorpayPaymentId)}&select=amount`,
      { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } }
    );
    if (!res.ok) return Infinity; // unknown → treat as partial refund rather than wrongly marking fully refunded
    const rows = await res.json();
    return rows[0]?.amount ?? Infinity;
  } catch {
    return Infinity;
  }
}

// A customer whose card gets declined or who abandons the checkout mid-payment
// never reaches verify-payment.js at all (there's no "success" to report from
// the browser) — this webhook event is the only signal the business gets.
// One quiet admin-only alert turns a payment.failed into a lead the team can
// personally follow up with, instead of a lost sale nobody ever sees.
async function notifyPaymentFailed(payment) {
  if (!payment || !isEmailConfigured()) return;
  const tierInfo = TIER_PRICES[payment.notes?.tier] || null;
  try {
    await sendEmail({
      to: TEAM_EMAIL,
      subject: `⚠️ Payment failed — ${String(payment.notes?.name || payment.email || 'Unknown').replace(/[\r\n]+/g, ' ')}`,
      html: internalEmailHtml({
        emoji: '⚠️',
        title: 'Payment Failed',
        ctaHref: ADMIN_URL,
        ctaLabel: 'Open in admin dashboard',
        rows: [
          emailRow('Name', payment.notes?.name),
          emailRow('Email', payment.notes?.email || payment.email),
          emailRow('Phone', payment.notes?.phone || payment.contact),
          emailRow('Program', tierInfo?.label || payment.notes?.tier),
          emailRow('Error', payment.error_description),
          emailRow('Razorpay Payment ID', payment.id),
        ],
      }),
    });
  } catch (err) {
    console.error('razorpay-webhook: payment.failed alert email failed', err);
  }
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

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
import { sendEmail, isEmailConfigured, escapeHtml } from './_lib/email.js';
import { emailRow, internalEmailHtml, customerEmailHtml, WHATSAPP_HREF, ADMIN_URL, rupees } from './_lib/emailTemplates.js';

const TEAM_EMAIL = 'info@ateknonsolutions.com';

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

  if (event.event === 'payment.failed') {
    await notifyPaymentFailed(event.payload?.payment?.entity);
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
  const dbConfigured = Boolean(supabaseUrl && serviceKey);
  // See the matching comment in api/verify-payment.js: whichever of the two
  // paths first inserts this razorpay_payment_id owns sending the receipt
  // emails, so a customer who closes the tab right after paying (webhook is
  // the only path that ever fires) still gets one, and a customer whose
  // browser call *does* land doesn't get two.
  let isNewPayment = !dbConfigured;

  if (dbConfigured) {
    try {
      const dbRes = await fetch(`${supabaseUrl}/rest/v1/payments?on_conflict=razorpay_payment_id`, {
        method: 'POST',
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=ignore-duplicates,return=representation',
        },
        body: JSON.stringify(clean),
      });
      if (dbRes.ok) {
        const inserted = await dbRes.json().catch(() => []);
        isNewPayment = Array.isArray(inserted) && inserted.length > 0;
      } else {
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

function adminPaymentEmailHtml(p, tierInfo) {
  return internalEmailHtml({
    emoji: '💳',
    title: 'Payment Received',
    ctaHref: ADMIN_URL,
    rows: [
      emailRow('Name', p.name),
      emailRow('Email', p.email),
      emailRow('Phone', p.phone),
      emailRow('Program', tierInfo.label),
      emailRow('Amount', rupees(p.amount)),
      emailRow('Razorpay Payment ID', p.razorpay_payment_id),
      emailRow('Razorpay Order ID', p.razorpay_order_id),
    ],
  });
}

function studentPaymentEmailHtml(p, tierInfo) {
  return customerEmailHtml({
    greetingName: p.name,
    whatsappHref: WHATSAPP_HREF,
    bodyHtml: `
        <p style="color:#5B6B8C;font-size:14px;line-height:1.6;">
          Your payment of <b style="color:#0B1F4D;">${rupees(p.amount)}</b> for the
          <b style="color:#0B1F4D;">${escapeHtml(tierInfo.label)}</b> program is confirmed. Our team
          will reach out shortly with your batch details and next steps.
        </p>
        <p style="color:#5B6B8C;font-size:14px;line-height:1.6;">
          Keep this email as your receipt — payment ID <code style="color:#0B1F4D;">${escapeHtml(p.razorpay_payment_id)}</code>.
        </p>`,
  });
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

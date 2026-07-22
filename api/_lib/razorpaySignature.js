// Pure signature-verification functions, extracted so they're unit-testable
// in isolation from the HTTP handlers that use them (api/verify-payment.js,
// api/razorpay-webhook.js). These are the two functions standing between a
// genuine Razorpay payment and a tampered one — see tests/razorpaySignature.test.js.

import crypto from 'node:crypto';

// A HMAC-SHA256 hex digest is always exactly this shape.
const SIGNATURE_RE = /^[0-9a-f]{64}$/i;

// Used by api/verify-payment.js: the signature the client's checkout
// callback reports, over `${order_id}|${payment_id}`.
export function verifyOrderPaymentSignature({ orderId, paymentId, providedSignature, keySecret }) {
  const provided = String(providedSignature || '');
  // Validate hex-digest shape BEFORE timingSafeEqual — that function throws
  // (rather than returning false) on mismatched buffer byte lengths, and JS
  // string .length (UTF-16 code units) is not the same thing as UTF-8 byte
  // length for non-ASCII input, so a naive length pre-check can itself be
  // bypassed into an uncaught crash. A regex on the expected fixed hex shape
  // sidesteps that entirely.
  if (!SIGNATURE_RE.test(provided)) return false;

  const expected = crypto.createHmac('sha256', keySecret).update(`${orderId}|${paymentId}`).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(provided));
}

// Used by api/razorpay-webhook.js: the signature Razorpay sends in the
// x-razorpay-signature header, over the raw request body.
export function verifyWebhookSignature({ rawBody, providedSignature, secret }) {
  const provided = String(providedSignature || '');
  if (!SIGNATURE_RE.test(provided)) return false;

  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(provided));
}

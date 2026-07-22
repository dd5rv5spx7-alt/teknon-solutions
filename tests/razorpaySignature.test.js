import { describe, it, expect } from 'vitest';
import crypto from 'node:crypto';
import { verifyOrderPaymentSignature, verifyWebhookSignature } from '../api/_lib/razorpaySignature.js';

function hmac(secret, payload) {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

describe('verifyOrderPaymentSignature', () => {
  const keySecret = 'test_key_secret';
  const orderId = 'order_ABC123';
  const paymentId = 'pay_XYZ789';

  it('accepts a genuine signature', () => {
    const providedSignature = hmac(keySecret, `${orderId}|${paymentId}`);
    expect(verifyOrderPaymentSignature({ orderId, paymentId, providedSignature, keySecret })).toBe(true);
  });

  it('rejects a signature computed with the wrong secret', () => {
    const providedSignature = hmac('wrong_secret', `${orderId}|${paymentId}`);
    expect(verifyOrderPaymentSignature({ orderId, paymentId, providedSignature, keySecret })).toBe(false);
  });

  it('rejects a signature for a tampered order/payment id', () => {
    const providedSignature = hmac(keySecret, `${orderId}|${paymentId}`);
    expect(
      verifyOrderPaymentSignature({ orderId, paymentId: 'pay_OTHER', providedSignature, keySecret })
    ).toBe(false);
  });

  it('rejects a non-hex-digest signature without throwing', () => {
    expect(() =>
      verifyOrderPaymentSignature({ orderId, paymentId, providedSignature: 'not-a-signature', keySecret })
    ).not.toThrow();
    expect(
      verifyOrderPaymentSignature({ orderId, paymentId, providedSignature: 'not-a-signature', keySecret })
    ).toBe(false);
  });

  it('rejects a signature of the wrong length without throwing timingSafeEqual', () => {
    const shortSig = hmac(keySecret, `${orderId}|${paymentId}`).slice(0, 10);
    expect(
      verifyOrderPaymentSignature({ orderId, paymentId, providedSignature: shortSig, keySecret })
    ).toBe(false);
  });

  it('rejects a missing signature', () => {
    expect(
      verifyOrderPaymentSignature({ orderId, paymentId, providedSignature: undefined, keySecret })
    ).toBe(false);
  });

  it('rejects an uppercase signature even though the shape check allows it', () => {
    // SIGNATURE_RE is case-insensitive (Razorpay always sends lowercase), but
    // timingSafeEqual compares raw bytes, so a same-value-different-case
    // signature still fails to match the lowercase digest crypto produces.
    const providedSignature = hmac(keySecret, `${orderId}|${paymentId}`).toUpperCase();
    expect(verifyOrderPaymentSignature({ orderId, paymentId, providedSignature, keySecret })).toBe(false);
  });
});

describe('verifyWebhookSignature', () => {
  const secret = 'test_webhook_secret';
  const rawBody = '{"event":"payment.captured","payload":{}}';

  it('accepts a genuine signature over the raw body', () => {
    const providedSignature = hmac(secret, rawBody);
    expect(verifyWebhookSignature({ rawBody, providedSignature, secret })).toBe(true);
  });

  it('rejects a signature computed with the wrong secret', () => {
    const providedSignature = hmac('wrong_secret', rawBody);
    expect(verifyWebhookSignature({ rawBody, providedSignature, secret })).toBe(false);
  });

  it('rejects a signature for a tampered body', () => {
    const providedSignature = hmac(secret, rawBody);
    const tamperedBody = rawBody.replace('payment.captured', 'refund.processed');
    expect(verifyWebhookSignature({ rawBody: tamperedBody, providedSignature, secret })).toBe(false);
  });

  it('rejects a non-hex-digest signature without throwing', () => {
    expect(() => verifyWebhookSignature({ rawBody, providedSignature: '<script>', secret })).not.toThrow();
    expect(verifyWebhookSignature({ rawBody, providedSignature: '<script>', secret })).toBe(false);
  });

  it('rejects a missing signature', () => {
    expect(verifyWebhookSignature({ rawBody, providedSignature: undefined, secret })).toBe(false);
  });
});

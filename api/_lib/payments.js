// Shared payment-recording logic used by api/verify-payment.js (browser-
// confirmed path) and api/razorpay-webhook.js (reliability-backstop path).
// Both paths can independently observe the same successful payment — this
// makes recording it idempotent and tells the caller whether IT was the one
// that actually recorded it (so only one path ever sends the receipt
// emails). Prefixed with an underscore so Vercel doesn't treat this file as
// its own route.
//
// Claim strategy: api/create-order.js writes a 'created' row up front, with
// razorpay_order_id known but razorpay_payment_id still null (a payment
// doesn't have an ID yet at order-creation time). Recording a captured
// payment is then an UPDATE ... WHERE status = 'created', guarded so only
// the first caller to reach it can flip that row to 'paid' — Postgres
// serializes concurrent UPDATEs on the same row, so the second caller's
// WHERE clause simply won't match anymore once the first has committed and
// moved that row out of 'created'. If no 'created' row exists (e.g.
// create-order's own insert failed, or this payment predates that row
// existing at all), this falls back to inserting a fresh 'paid' row
// directly, deduplicated on the razorpay_payment_id unique constraint —
// the same mechanism used before this file existed.
export async function recordPayment(supabaseUrl, serviceKey, clean) {
  try {
    const updateRes = await fetch(
      `${supabaseUrl}/rest/v1/payments?razorpay_order_id=eq.${encodeURIComponent(clean.razorpay_order_id)}&status=eq.created`,
      {
        method: 'PATCH',
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          razorpay_payment_id: clean.razorpay_payment_id,
          status: 'paid',
          name: clean.name,
          email: clean.email,
          phone: clean.phone,
        }),
      }
    );
    if (updateRes.ok) {
      const updated = await updateRes.json().catch(() => []);
      if (Array.isArray(updated) && updated.length > 0) {
        return { stored: true, isNewPayment: true };
      }
      // Zero rows matched — either no 'created' row exists for this order,
      // or another request already claimed it. Fall through to the insert
      // path below, which is itself safely deduplicated.
    } else {
      const text = await updateRes.text().catch(() => '');
      console.error('recordPayment: claim update failed', updateRes.status, text.slice(0, 500));
    }
  } catch (err) {
    console.error('recordPayment: claim update threw', err);
  }

  try {
    const insertRes = await fetch(`${supabaseUrl}/rest/v1/payments?on_conflict=razorpay_payment_id`, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=ignore-duplicates,return=representation',
      },
      body: JSON.stringify(clean),
    });
    if (insertRes.ok) {
      const inserted = await insertRes.json().catch(() => []);
      return { stored: true, isNewPayment: Array.isArray(inserted) && inserted.length > 0 };
    }
    const text = await insertRes.text().catch(() => '');
    console.error('recordPayment: fallback insert failed', insertRes.status, text.slice(0, 500));
    return { stored: false, isNewPayment: false };
  } catch (err) {
    console.error('recordPayment: fallback insert threw', err);
    return { stored: false, isNewPayment: false };
  }
}

// Flips a 'created' row to 'failed' (payment.failed webhook event) — a
// customer who never completes checkout is now a queryable, filterable
// lead in AdminPayments instead of leaving no trace at all.
export async function recordFailedPayment(supabaseUrl, serviceKey, razorpayOrderId) {
  if (!razorpayOrderId) return;
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/payments?razorpay_order_id=eq.${encodeURIComponent(razorpayOrderId)}&status=eq.created`,
      {
        method: 'PATCH',
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ status: 'failed' }),
      }
    );
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('recordFailedPayment: update failed', res.status, text.slice(0, 500));
    }
  } catch (err) {
    console.error('recordFailedPayment: update threw', err);
  }
}

// Records one real Razorpay refund transaction against the matching payment
// row (resolved by razorpay_payment_id) via the record_refund() DB function
// (see supabase/023_refund_correctness.sql). `refundedAmount` here is THIS
// refund's own amount — a delta, never a caller-computed cumulative total.
// The function itself maintains a refunds ledger keyed on razorpay_refund_id
// and derives the true cumulative refunded_amount as SUM(ledger rows), so
// it's safe for both callers (the admin-triggered path and the webhook
// path, which can both observe the same refund) to pass the same shape
// regardless of how many refunds preceded this one or how many times the
// same refund event is redelivered — insertion is idempotent on
// razorpay_refund_id, so a duplicate call is a harmless no-op recompute.
// Returns { refunded_amount, status } on success, or null if the write
// didn't happen (payment not found, or the request failed).
export async function recordRefund(supabaseUrl, serviceKey, { razorpayPaymentId, refundId, refundedAmount }) {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/record_refund`, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        p_razorpay_payment_id: razorpayPaymentId,
        p_razorpay_refund_id: refundId,
        p_amount: refundedAmount,
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('recordRefund: rpc failed', res.status, text.slice(0, 500));
      return null;
    }
    const rows = await res.json().catch(() => []);
    return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.error('recordRefund: rpc threw', err);
    return null;
  }
}

// Releases the refund_locked_at mutex claimed by api/admin/refund-payment.js
// before it called out to Razorpay, for the failure paths where no refund
// actually happened (so the payment doesn't stay stuck "in progress").
export async function releaseRefundLock(supabaseUrl, serviceKey, paymentRowId) {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/payments?id=eq.${encodeURIComponent(paymentRowId)}`, {
      method: 'PATCH',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ refund_locked_at: null }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('releaseRefundLock: update failed', res.status, text.slice(0, 500));
    }
  } catch (err) {
    console.error('releaseRefundLock: update threw', err);
  }
}

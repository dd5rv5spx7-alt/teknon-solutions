// Coupon validation — used only by api/create-order.js. The browser only
// ever sends a coupon *code*; the discount itself is always looked up and
// computed here, server-side, against the coupons table (never trusted
// from the client), matching the same threat model pricing.js already
// applies to the base tier price.

const MIN_CHARGE_PAISE = 100; // Razorpay's practical floor — never let a coupon discount an order to ₹0

export async function validateCoupon(supabaseUrl, serviceKey, code, tier, baseAmount) {
  let coupon;
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/coupons?code=eq.${encodeURIComponent(code)}&select=*`,
      { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } }
    );
    if (!res.ok) return { error: 'Could not validate that coupon. Please try again.' };
    [coupon] = await res.json();
  } catch {
    return { error: 'Could not validate that coupon. Please try again.' };
  }

  if (!coupon || !coupon.active) {
    return { error: 'That coupon code is not valid.' };
  }
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return { error: 'That coupon has expired.' };
  }
  if (coupon.usage_limit != null && coupon.times_used >= coupon.usage_limit) {
    return { error: 'That coupon has already been fully redeemed.' };
  }
  if (coupon.applicable_tiers && coupon.applicable_tiers.length > 0 && !coupon.applicable_tiers.includes(tier)) {
    return { error: 'That coupon doesn’t apply to this program.' };
  }

  const rawDiscount =
    coupon.discount_type === 'percent'
      ? Math.round((baseAmount * coupon.discount_value) / 100)
      : coupon.discount_value;
  const discountAmount = Math.min(rawDiscount, baseAmount - MIN_CHARGE_PAISE);
  if (discountAmount <= 0) {
    return { error: 'That coupon can’t be applied to this program.' };
  }

  // Best-effort usage increment — a coupon's usage_limit is a promotional
  // control, not a financial guarantee, so a rare race under concurrent
  // redemptions (two people using the last slot at the same instant) isn't
  // worth the complexity of a fully atomic claim the way payment recording
  // needs to be.
  try {
    await fetch(`${supabaseUrl}/rest/v1/coupons?id=eq.${coupon.id}`, {
      method: 'PATCH',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ times_used: coupon.times_used + 1 }),
    });
  } catch (err) {
    console.error('validateCoupon: could not increment times_used', err);
  }

  return { discountAmount };
}

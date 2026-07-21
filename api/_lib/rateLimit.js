// Rate limiter with a durable, shared backing store when Supabase is
// configured (see supabase/014_rate_limiting.sql) — falls back to an
// in-memory fixed-window counter otherwise, so local dev and any
// deployment without Supabase set up still get *some* throttling.
// Prefixed with an underscore so Vercel doesn't treat this file as its own
// route.

const buckets = new Map(); // "scope:ip" -> array of request timestamps (ms), in-memory fallback only

export function getClientIp(req) {
  return (
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

// scope identifies the caller (e.g. 'enquiry', 'create-order') so different
// endpoints don't share one IP's quota — required now that this shares one
// backing store across every route, unlike the old purely in-memory version
// where each Vercel function's isolated process memory made that implicit.
export async function isRateLimited(ip, { windowMs, max }, scope) {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (supabaseUrl && serviceKey) {
    try {
      return await supabaseIsRateLimited(supabaseUrl, serviceKey, ip, { windowMs, max }, scope);
    } catch (err) {
      console.error('rateLimit: durable check failed, falling back to in-memory for this request', err);
      // Fall through — a DB hiccup shouldn't take down the endpoint it's
      // meant to be protecting; in-memory still catches a single-instance burst.
    }
  }
  return inMemoryIsRateLimited(ip, { windowMs, max }, scope);
}

async function supabaseIsRateLimited(supabaseUrl, serviceKey, ip, { windowMs, max }, scope) {
  const windowStart = Math.floor(Date.now() / windowMs) * windowMs;
  const key = `${scope}:${ip}:${windowStart}`;
  const res = await fetch(`${supabaseUrl}/rest/v1/rpc/increment_rate_limit`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ p_key: key }),
  });
  if (!res.ok) throw new Error(`increment_rate_limit failed: ${res.status}`);
  const count = await res.json();
  return count > max;
}

function inMemoryIsRateLimited(ip, { windowMs, max }, scope) {
  const bucketKey = `${scope}:${ip}`;
  const now = Date.now();
  const timestamps = (buckets.get(bucketKey) || []).filter((t) => now - t < windowMs);
  timestamps.push(now);
  buckets.set(bucketKey, timestamps);
  return timestamps.length > max;
}

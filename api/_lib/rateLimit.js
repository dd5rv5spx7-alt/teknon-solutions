// In-memory sliding-window rate limiter, keyed by client IP.
//
// LIMITATION: this state lives in the serverless function's process memory,
// so it resets on cold start and is not shared across concurrent instances
// or regions. It stops a single script hammering a warm instance, but is
// not a substitute for a distributed limiter (e.g. Upstash Redis) if you
// need real guarantees at scale. Prefixed with an underscore so Vercel
// doesn't treat this file as its own route.

const buckets = new Map(); // ip -> array of request timestamps (ms)

export function getClientIp(req) {
  return (
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

export function isRateLimited(ip, { windowMs, max }) {
  const now = Date.now();
  const timestamps = (buckets.get(ip) || []).filter((t) => now - t < windowMs);
  timestamps.push(now);
  buckets.set(ip, timestamps);
  return timestamps.length > max;
}

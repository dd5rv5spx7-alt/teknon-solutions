// POST /api/verify-certificate
// Was previously called directly from the browser via
// `supabase.rpc('verify_certificate', ...)` using the public anon key —
// that bypasses this app's own rate limiter entirely (it's a raw REST RPC
// call to Supabase, not a request to anything under /api), so a scripted
// caller could brute-force certificate numbers straight against Supabase
// and harvest every issued certificate's student name. Routing it through
// this endpoint instead applies the same rate limiting every other public
// endpoint in this app already gets.

import { getClientIp, isRateLimited } from './_lib/rateLimit.js';
import { safeParse } from './_lib/http.js';

const MAX_BODY_BYTES = 2_000;
const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 15 }; // 15 lookups / 10 min / IP
const CERT_NUMBER_RE = /^[A-Za-z0-9-]{1,64}$/;

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
  if (await isRateLimited(ip, RATE_LIMIT, 'verify-certificate')) {
    return res.status(429).json({ ok: false, error: 'Too many attempts — please try again in a few minutes.' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {};
  const certNumber = String(body.cert_number || '').trim();
  if (!certNumber || !CERT_NUMBER_RE.test(certNumber)) {
    return res.status(400).json({ ok: false, error: 'Invalid certificate number.' });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) {
    return res.status(500).json({ ok: false, error: 'Verification is not configured yet on this deployment.' });
  }

  try {
    const rpcRes = await fetch(`${supabaseUrl}/rest/v1/rpc/verify_certificate`, {
      method: 'POST',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cert_number: certNumber }),
    });
    if (!rpcRes.ok) throw new Error(`Supabase RPC failed: ${rpcRes.status}`);
    const data = await rpcRes.json();
    return res.status(200).json({ ok: true, result: Array.isArray(data) && data.length > 0 ? data[0] : null });
  } catch (err) {
    console.error('verify-certificate: RPC call failed', err);
    return res.status(502).json({ ok: false, error: 'Something went wrong verifying that certificate. Please try again.' });
  }
}

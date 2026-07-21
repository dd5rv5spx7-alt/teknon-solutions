// POST /api/admin/create-person
// Creates a real Supabase Auth account for a student or faculty member and
// sends them an invite email (via Supabase's built-in auth email) so THEY
// set their own password — the admin never sees or transmits a password.
//
// Requires the caller to already be signed in as an admin. The request must
// include an Authorization header with the caller's Supabase access token;
// the frontend adds this automatically (see AdminPeople.jsx).

import { getClientIp, isRateLimited } from '../_lib/rateLimit.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT = { windowMs: 60 * 60 * 1000, max: 10 }; // 10 invites / hour / IP

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const ip = getClientIp(req);
  if (isRateLimited(ip, RATE_LIMIT)) {
    return res.status(429).json({ ok: false, error: 'Too many requests — please try again later.' });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({ ok: false, error: 'Supabase is not configured on the server yet.' });
  }

  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) {
    return res.status(401).json({ ok: false, error: 'Not signed in.' });
  }

  // ── Verify the caller is a real, currently-valid, admin user ──
  let callerId;
  try {
    const whoRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { apikey: serviceKey, Authorization: `Bearer ${token}` },
    });
    if (!whoRes.ok) throw new Error('Invalid session');
    const who = await whoRes.json();
    callerId = who.id;
  } catch (err) {
    return res.status(401).json({ ok: false, error: 'Your session has expired — please sign in again.' });
  }

  try {
    const roleRes = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${callerId}&select=role,status`, {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
    });
    const [callerProfile] = roleRes.ok ? await roleRes.json() : [];
    // A deactivated admin's Supabase session can stay valid for a while after
    // another admin flips their status to 'inactive' — this endpoint uses the
    // service_role key, so it bypasses RLS and must replicate the same
    // active-status check the RLS layer already enforces everywhere else
    // (see supabase/006_enforce_active_status_in_rls.sql), or a deactivated
    // admin could keep minting new accounts until their token expires.
    if (callerProfile?.role !== 'admin' || callerProfile?.status !== 'active') {
      return res.status(403).json({ ok: false, error: 'Only active admins can add people.' });
    }
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Could not verify your permissions.' });
  }

  // ── Validate input ──
  const { email, full_name, role, phone } = req.body || {};
  if (!email || !EMAIL_RE.test(String(email).trim())) {
    return res.status(400).json({ ok: false, error: 'A valid email is required.' });
  }
  if (!full_name || String(full_name).trim().length < 2) {
    return res.status(400).json({ ok: false, error: 'Full name is required.' });
  }
  // Admin accounts are intentionally never created through this UI — see README.
  if (!['student', 'faculty'].includes(role)) {
    return res.status(400).json({ ok: false, error: "Role must be 'student' or 'faculty'." });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const cleanName = String(full_name).trim().slice(0, 200);
  const cleanPhone = phone ? String(phone).trim().slice(0, 30) : null;

  // ── Create the account and send them an invite email to set their own password ──
  try {
    const inviteRes = await fetch(`${supabaseUrl}/auth/v1/invite`, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: cleanEmail, data: { full_name: cleanName } }),
    });
    const inviteData = await inviteRes.json();
    if (!inviteRes.ok) {
      // Supabase returns 422 if the email already has an account — surface that clearly.
      const msg = inviteData?.msg || inviteData?.error_description || 'Could not create the account.';
      return res.status(inviteRes.status === 422 ? 409 : 500).json({ ok: false, error: msg });
    }

    const newUserId = inviteData.id;

    // The signup trigger already created a profiles row defaulting to role='student'.
    // Update it with the requested role and contact info.
    const updateRes = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${newUserId}`, {
      method: 'PATCH',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ role, phone: cleanPhone, full_name: cleanName }),
    });
    if (!updateRes.ok) {
      return res.status(200).json({
        ok: true,
        warning: 'Account created and invite sent, but the role/phone update failed — set it manually in the People list.',
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Something went wrong creating the account.' });
  }
}

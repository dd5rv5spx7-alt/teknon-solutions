// POST /api/admin/send-certificate-email
// Admin-only. AdminCertificates.jsx inserts the certificate row directly
// (RLS already protects that write — see supabase/007_courses_and_certificates.sql),
// then calls this endpoint just to send the "your certificate is ready"
// email, since sending mail needs to happen server-side. A student
// previously only found out a certificate existed by happening to check
// their own dashboard.

import { getClientIp, isRateLimited } from '../_lib/rateLimit.js';
import { safeParse } from '../_lib/http.js';
import { sendEmail, isEmailConfigured, escapeHtml } from '../_lib/email.js';
import { customerEmailHtml, WHATSAPP_HREF, TEAM_EMAIL } from '../_lib/emailTemplates.js';

const RATE_LIMIT = { windowMs: 60 * 60 * 1000, max: 60 }; // 60 / hour / IP — an admin issuing a batch of certificates

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const ip = getClientIp(req);
  if (await isRateLimited(ip, RATE_LIMIT, 'send-certificate-email')) {
    return res.status(429).json({ ok: false, error: 'Too many requests — please try again later.' });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({ ok: false, error: 'Supabase is not configured on the server yet.' });
  }

  // ── Verify the caller is a real, currently-valid, active admin ──
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) {
    return res.status(401).json({ ok: false, error: 'Not signed in.' });
  }
  let callerId;
  try {
    const whoRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { apikey: serviceKey, Authorization: `Bearer ${token}` },
    });
    if (!whoRes.ok) throw new Error('Invalid session');
    callerId = (await whoRes.json()).id;
  } catch {
    return res.status(401).json({ ok: false, error: 'Your session has expired — please sign in again.' });
  }
  try {
    const roleRes = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${callerId}&select=role,status`, {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
    });
    const [callerProfile] = roleRes.ok ? await roleRes.json() : [];
    if (callerProfile?.role !== 'admin' || callerProfile?.status !== 'active') {
      return res.status(403).json({ ok: false, error: 'Only active admins can send this.' });
    }
  } catch {
    return res.status(500).json({ ok: false, error: 'Could not verify your permissions.' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {};
  const studentEmail = String(body.email || '').trim();
  const studentName = String(body.student_name || 'there').trim();
  const courseTitle = String(body.course_title || '').trim();
  const certificateNumber = String(body.certificate_number || '').trim();
  if (!studentEmail || !courseTitle || !certificateNumber) {
    return res.status(400).json({ ok: false, error: 'Missing certificate details.' });
  }

  if (!isEmailConfigured()) {
    return res.status(200).json({ ok: true, skipped: 'Email not configured' });
  }

  try {
    await sendEmail({
      to: studentEmail,
      bcc: TEAM_EMAIL,
      subject: `🎓 Your certificate is ready — ${courseTitle}`,
      html: customerEmailHtml({
        greetingName: studentName,
        whatsappHref: WHATSAPP_HREF,
        bodyHtml: `
            <p style="color:#5B6B8C;font-size:14px;line-height:1.6;">
              Congratulations! Your certificate for <b style="color:#0B1F4D;">${escapeHtml(courseTitle)}</b>
              is ready. Sign in to your student dashboard to view and print it.
            </p>
            <p style="color:#5B6B8C;font-size:14px;line-height:1.6;">
              Certificate number: <code style="color:#0B1F4D;">${escapeHtml(certificateNumber)}</code> —
              anyone can verify it&rsquo;s genuine at
              <a href="https://ateknonsolutions.com/verify-certificate" style="color:#1E5EFF;">ateknonsolutions.com/verify-certificate</a>.
            </p>`,
      }),
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('send-certificate-email: send failed', err);
    return res.status(500).json({ ok: false, error: 'Could not send the certificate email.' });
  }
}

// POST /api/enquiry
// Validates a contact-form submission, checks for a very recent duplicate,
// stores it in Supabase (if configured), and sends a notification + auto-reply
// via Resend (if configured). Degrades gracefully: if only one of Supabase/
// Resend is set up, that half still works and the response says exactly what
// happened rather than silently failing.

import { getClientIp, isRateLimited } from './_lib/rateLimit.js';
import { sendEmail, escapeHtml } from './_lib/email.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TEAM_EMAIL = 'info@ateknonsolutions.com';
const DEDUPE_WINDOW_MS = 2 * 60 * 1000; // reject a second identical-email submit within 2 minutes
const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 5 }; // 5 submissions / 10 min / IP
const MAX_BODY_BYTES = 20_000; // real payloads top out around 3KB; this is generous headroom

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
  if (isRateLimited(ip, RATE_LIMIT)) {
    return res.status(429).json({ ok: false, error: 'Too many requests — please try again in a few minutes.' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {};
  const { name, email, phone, program, college, year, message, source, _gotcha } = body;

  // Honeypot: a field real visitors never see or fill in (hidden via CSS on the form).
  // If it has a value, whatever submitted this isn't a human — pretend success, do nothing.
  if (_gotcha) {
    return res.status(200).json({ ok: true });
  }

  const errors = [];
  if (!name || String(name).trim().length < 2) errors.push('name');
  if (!email || !EMAIL_RE.test(String(email).trim())) errors.push('email');
  if (!phone || String(phone).replace(/\D/g, '').length < 10) errors.push('phone');
  if (errors.length) {
    return res.status(400).json({ ok: false, error: 'Invalid or missing fields', fields: errors });
  }

  const userAgent = req.headers['user-agent'] || null;

  const clean = {
    name: String(name).trim().slice(0, 200),
    email: String(email).trim().slice(0, 200),
    phone: String(phone).trim().slice(0, 30),
    program: program ? String(program).trim().slice(0, 200) : null,
    college: college ? String(college).trim().slice(0, 200) : null,
    year: year ? String(year).trim().slice(0, 50) : null,
    message: message ? String(message).trim().slice(0, 2000) : null,
    source_page: source ? String(source).trim().slice(0, 200) : '/',
    ip_address: ip,
    user_agent: userAgent ? String(userAgent).slice(0, 500) : null,
  };

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const result = { ok: true, stored: false, emailed: false, duplicate: false, warnings: [] };

  if (supabaseUrl && serviceKey) {
    // ── Duplicate check: same email submitted in the last two minutes? ──
    try {
      const since = new Date(Date.now() - DEDUPE_WINDOW_MS).toISOString();
      const dupeCheck = await fetch(
        `${supabaseUrl}/rest/v1/enquiries?email=eq.${encodeURIComponent(clean.email)}&created_at=gte.${since}&select=id`,
        { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } }
      );
      const existing = dupeCheck.ok ? await dupeCheck.json() : [];
      if (existing.length > 0) {
        result.duplicate = true;
        result.stored = true; // the earlier one is already stored — nothing new to do
        return res.status(200).json(result);
      }
    } catch (err) {
      // If the dupe check itself fails, don't block a real submission over it — just proceed.
    }

    // ── Store in Supabase (service_role key, server-side only, bypasses RLS by design) ──
    try {
      const dbRes = await fetch(`${supabaseUrl}/rest/v1/enquiries`, {
        method: 'POST',
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(clean),
      });
      if (!dbRes.ok) throw new Error(`Supabase insert failed: ${dbRes.status}`);
      result.stored = true;
    } catch (err) {
      result.warnings.push('Could not store enquiry in the database.');
    }
  } else {
    result.warnings.push('Supabase not configured — enquiry was not stored, only emailed.');
  }

  // ── Email via Resend ──
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const now = new Date();
    try {
      await sendEmail(resendKey, {
        to: TEAM_EMAIL,
        // Subject lines aren't run through escapeHtml (there's no HTML to
        // escape), but embedded CR/LF could otherwise inject extra headers
        // into the outgoing email — strip them.
        subject: `🚀 New Enquiry Received — ${clean.name.replace(/[\r\n]+/g, ' ')}`,
        html: adminEmailHtml({ ...clean, submittedAt: now }),
      });
      await sendEmail(resendKey, {
        to: clean.email,
        bcc: TEAM_EMAIL, // a copy of every email the system sends lands at info@ too
        subject: 'Thank you for contacting A Teknon Solutions',
        html: studentEmailHtml(clean),
      });
      result.emailed = true;
    } catch (err) {
      result.warnings.push('Could not send confirmation email.');
    }
  } else {
    result.warnings.push('Resend not configured — no email was sent.');
  }

  if (!result.stored && !result.emailed) {
    return res.status(500).json({
      ok: false,
      error: 'Neither Supabase nor Resend is configured yet — nothing was saved. See .env.example.',
    });
  }

  return res.status(200).json(result);
}

function adminEmailHtml(e) {
  const row = (label, value) => `
    <tr>
      <td style="padding:8px 14px;color:#5B6B8C;font-size:13px;font-family:sans-serif;white-space:nowrap;">${label}</td>
      <td style="padding:8px 14px;color:#0B1F4D;font-size:13px;font-family:sans-serif;">${escapeHtml(value || '—')}</td>
    </tr>`;
  return `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;">
      <div style="background:linear-gradient(135deg,#0B1F4D,#071633);padding:24px 28px;border-radius:16px 16px 0 0;">
        <p style="color:#fff;font-size:18px;font-weight:700;margin:0;">🚀 New Enquiry Received</p>
        <p style="color:rgba(255,255,255,0.6);font-size:12px;margin:4px 0 0;">A Teknon Solutions</p>
      </div>
      <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #eef1f6;border-top:none;border-radius:0 0 16px 16px;overflow:hidden;">
        ${row('Name', e.name)}
        ${row('Email', e.email)}
        ${row('Phone', e.phone)}
        ${row('College', e.college)}
        ${row('Year', e.year)}
        ${row('Program', e.program)}
        ${row('Message', e.message)}
        ${row('Date', e.submittedAt.toLocaleDateString('en-IN'))}
        ${row('Time', e.submittedAt.toLocaleTimeString('en-IN'))}
        ${row('IP', e.ip_address)}
        ${row('User agent', e.user_agent)}
      </table>
      <p style="text-align:center;margin-top:16px;">
        <a href="https://ateknonsolutions.com/admin" style="display:inline-block;background:#1E5EFF;color:#fff;text-decoration:none;font-size:13px;font-weight:600;padding:10px 20px;border-radius:100px;">
          Open in admin dashboard
        </a>
      </p>
    </div>`;
}

function studentEmailHtml(e) {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
      <div style="background:linear-gradient(135deg,#0B1F4D,#071633);padding:28px;border-radius:16px 16px 0 0;text-align:center;">
        <p style="color:#fff;font-size:20px;font-weight:800;margin:0;letter-spacing:-0.02em;">A TEKNON SOLUTIONS</p>
        <p style="color:#7DB8FF;font-size:11px;letter-spacing:0.3em;margin:4px 0 0;">LEARN. BUILD. GROW.</p>
      </div>
      <div style="background:#fff;border:1px solid #eef1f6;border-top:none;border-radius:0 0 16px 16px;padding:28px;">
        <p style="color:#0B1F4D;font-size:15px;">Hello ${escapeHtml(e.name)},</p>
        <p style="color:#5B6B8C;font-size:14px;line-height:1.6;">
          Thank you for contacting A Teknon Solutions. We've received your enquiry
          ${e.program ? `about the <b style="color:#0B1F4D;">${escapeHtml(e.program)}</b> program` : ''}
          and our team will contact you shortly — usually within 24 hours.
        </p>
        <p style="color:#5B6B8C;font-size:14px;line-height:1.6;">
          Meanwhile, feel free to reply to this email if you have any questions, or reach us
          directly on WhatsApp for a faster response.
        </p>
        <p style="text-align:center;margin:22px 0;">
          <a href="https://wa.me/918897571616" style="display:inline-block;background:#1E5EFF;color:#fff;text-decoration:none;font-size:13px;font-weight:600;padding:11px 24px;border-radius:100px;">
            Message us on WhatsApp
          </a>
        </p>
        <p style="color:#0B1F4D;font-size:14px;margin-top:24px;">Regards,<br/>Team A Teknon Solutions</p>
      </div>
      <p style="text-align:center;color:#9AA7C2;font-size:11px;margin-top:14px;">
        A Teknon Solutions · Rajahmundry, Andhra Pradesh · ateknonsolutions.com
      </p>
    </div>`;
}

function safeParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return {};
  }
}

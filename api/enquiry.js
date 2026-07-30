// POST /api/enquiry
// Validates a contact-form submission, checks for a very recent duplicate,
// stores it in Supabase (if configured), and sends a notification + auto-reply
// via Titan Mail SMTP (if configured). Degrades gracefully: if only one of
// Supabase/SMTP is set up, that half still works and the response says
// exactly what happened rather than silently failing.

import { getClientIp, isRateLimited } from './_lib/rateLimit.js';
import { safeParse } from './_lib/http.js';
import { sendEmail, isEmailConfigured, escapeHtml } from './_lib/email.js';
import { emailRow, internalEmailHtml, customerEmailHtml, WHATSAPP_HREF, ADMIN_URL, TEAM_EMAIL } from './_lib/emailTemplates.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
  if (await isRateLimited(ip, RATE_LIMIT, 'enquiry')) {
    return res.status(429).json({ ok: false, error: 'Too many requests — please try again in a few minutes.' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {};
  const { name, email, phone, program, college, year, message, source, company, service_interested, preferred_timeline, lead_type, _gotcha } = body;

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
  // Coerced, never a hard validation error — keeps the existing Contact.jsx
  // form (which never sends lead_type) working completely unmodified.
  const cleanLeadType = lead_type === 'business' ? 'business' : 'student';

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
    lead_type: cleanLeadType,
    company: company ? String(company).trim().slice(0, 200) : null,
    service_interested: service_interested ? String(service_interested).trim().slice(0, 200) : null,
    preferred_timeline: preferred_timeline ? String(preferred_timeline).trim().slice(0, 100) : null,
  };

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const result = { ok: true, stored: false, emailed: false, duplicate: false, warnings: [] };

  if (supabaseUrl && serviceKey) {
    // ── Duplicate check: same email submitted in the last two minutes? ──
    try {
      const since = new Date(Date.now() - DEDUPE_WINDOW_MS).toISOString();
      const dupeCheck = await fetch(
        `${supabaseUrl}/rest/v1/enquiries?email=eq.${encodeURIComponent(clean.email)}&lead_type=eq.${encodeURIComponent(clean.lead_type)}&created_at=gte.${since}&select=id`,
        { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } }
      );
      if (!dupeCheck.ok) {
        const text = await dupeCheck.text().catch(() => '');
        console.error('enquiry: dupe check failed', dupeCheck.status, text.slice(0, 300));
      }
      const existing = dupeCheck.ok ? await dupeCheck.json() : [];
      if (existing.length > 0) {
        result.duplicate = true;
        result.stored = true; // the earlier one is already stored — nothing new to do
        return res.status(200).json(result);
      }
    } catch (err) {
      // If the dupe check itself fails, don't block a real submission over it — just proceed.
      console.error('enquiry: dupe check threw', err);
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
      if (!dbRes.ok) {
        const text = await dbRes.text().catch(() => '');
        // Logged, not just swallowed into a generic warning — a missing column
        // (e.g. an unrun migration) and an auth failure (wrong service_role
        // key) both look identical to the client otherwise, and this is the
        // only place either one is ever surfaced.
        console.error('enquiry: Supabase insert failed', dbRes.status, text.slice(0, 500));
        throw new Error(`Supabase insert failed: ${dbRes.status}`);
      }
      result.stored = true;
    } catch (err) {
      result.warnings.push('Could not store enquiry in the database.');
    }
  } else {
    result.warnings.push('Supabase not configured — enquiry was not stored, only emailed.');
  }

  // ── Email via Titan Mail SMTP ──
  if (isEmailConfigured()) {
    const now = new Date();
    try {
      await sendEmail({
        to: TEAM_EMAIL,
        // Subject lines aren't run through escapeHtml (there's no HTML to
        // escape), but embedded CR/LF could otherwise inject extra headers
        // into the outgoing email — strip them.
        subject: clean.lead_type === 'business'
          ? `💼 New IT Solutions Enquiry — ${clean.name.replace(/[\r\n]+/g, ' ')}`
          : `🚀 New Enquiry Received — ${clean.name.replace(/[\r\n]+/g, ' ')}`,
        html: adminEmailHtml({ ...clean, submittedAt: now }),
      });
      await sendEmail({
        to: clean.email,
        bcc: TEAM_EMAIL, // a copy of every email the system sends lands at info@ too
        subject: 'Thank you for contacting A Teknon Solutions',
        html: studentEmailHtml(clean),
      });
      result.emailed = true;
    } catch (err) {
      console.error('enquiry: email send failed', err);
      result.warnings.push('Could not send confirmation email.');
    }
  } else {
    result.warnings.push('Email is not configured — no email was sent.');
  }

  if (!result.stored && !result.emailed) {
    return res.status(500).json({
      ok: false,
      error: 'Neither Supabase nor email is configured yet — nothing was saved. See .env.example.',
    });
  }

  return res.status(200).json(result);
}

function adminEmailHtml(e) {
  const isBusiness = e.lead_type === 'business';
  return internalEmailHtml({
    emoji: isBusiness ? '💼' : '🚀',
    title: isBusiness ? 'New IT Solutions Enquiry' : 'New Enquiry Received',
    ctaHref: ADMIN_URL,
    rows: [
      emailRow('Name', e.name),
      emailRow('Email', e.email),
      emailRow('Phone', e.phone),
      emailRow('College', e.college),
      emailRow('Year', e.year),
      emailRow('Program', e.program),
      ...(isBusiness
        ? [
            emailRow('Company', e.company),
            emailRow('Service interested', e.service_interested),
            emailRow('Preferred timeline', e.preferred_timeline),
          ]
        : []),
      emailRow('Message', e.message),
      emailRow('Date', e.submittedAt.toLocaleDateString('en-IN')),
      emailRow('Time', e.submittedAt.toLocaleTimeString('en-IN')),
      emailRow('IP', e.ip_address),
      emailRow('User agent', e.user_agent),
    ],
  });
}

function studentEmailHtml(e) {
  const isBusiness = e.lead_type === 'business';
  return customerEmailHtml({
    greetingName: e.name,
    whatsappHref: WHATSAPP_HREF,
    bodyHtml: isBusiness
      ? `
        <p style="color:#5B6B8C;font-size:14px;line-height:1.6;">
          Thank you for reaching out to A Teknon Solutions about IT Solutions. Our team
          will review your requirements and follow up shortly to discuss scope and next steps.
        </p>
        <p style="color:#5B6B8C;font-size:14px;line-height:1.6;">
          Meanwhile, feel free to reply to this email if you have any questions, or reach us
          directly on WhatsApp for a faster response.
        </p>`
      : `
        <p style="color:#5B6B8C;font-size:14px;line-height:1.6;">
          Thank you for contacting A Teknon Solutions. We've received your enquiry
          ${e.program ? `about the <b style="color:#0B1F4D;">${escapeHtml(e.program)}</b> program` : ''}
          and our team will contact you shortly — usually within 24 hours.
        </p>
        <p style="color:#5B6B8C;font-size:14px;line-height:1.6;">
          Meanwhile, feel free to reply to this email if you have any questions, or reach us
          directly on WhatsApp for a faster response.
        </p>`,
  });
}


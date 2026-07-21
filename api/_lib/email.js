// Shared email sender — SMTP via nodemailer, used by api/enquiry.js, the
// payment endpoints, and api/cron/daily-digest.js. Prefixed with an
// underscore so Vercel doesn't treat this file as its own route.
//
// The mailbox behind info@ateknonsolutions.com is used directly as the
// outgoing SMTP relay — mail is sent from the business's real mailbox, so it
// lands in that mailbox's own Sent folder and replies go straight to the
// inbox that's already checked daily, instead of needing a separate sender
// domain verified with a third-party ESP.
//
// IMPORTANT — verify before relying on this in production: this only
// inherits the domain's SPF/DKIM automatically if SMTP_HOST is the mail
// provider the domain's DNS actually authorizes. A live DNS check on
// ateknonsolutions.com found MX + SPF pointing at secureserver.net (GoDaddy),
// not titan.email — if that's still true when you read this, sending
// through smtp.titan.email will likely fail SPF/DKIM alignment and, with
// DMARC published at p=quarantine, land payment receipts and enquiry
// confirmations in spam (or get rejected outright). Confirm which service
// actually hosts info@ateknonsolutions.com's mailbox before setting
// SMTP_HOST/SMTP_USER/SMTP_PASSWORD — see README.md section 4.5.

import nodemailer from 'nodemailer';

let cachedTransporter;
let cachedKey; // invalidate the cache if env vars change between cold starts sharing a warm instance

export function isEmailConfigured() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

function getTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  if (!user || !pass) return null;

  const key = `${user}:${process.env.SMTP_HOST}:${process.env.SMTP_PORT}`;
  if (cachedTransporter && cachedKey === key) return cachedTransporter;

  const host = process.env.SMTP_HOST || 'smtp.titan.email';
  const port = Number(process.env.SMTP_PORT || 465);
  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // Titan's 465 is implicit TLS; 587 would need STARTTLS instead
    auth: { user, pass },
  });
  cachedKey = key;
  return cachedTransporter;
}

export async function sendEmail({ to, bcc, subject, html }) {
  const transporter = getTransporter();
  if (!transporter) throw new Error('SMTP is not configured');

  const fromName = process.env.SMTP_FROM_NAME || 'A Teknon Solutions';
  await transporter.sendMail({
    from: `${fromName} <${process.env.SMTP_USER}>`,
    to,
    ...(bcc ? { bcc } : {}),
    subject,
    html,
    // HTML-only mail (no plain-text part) is a well-known spam-scoring
    // signal — every template here is our own trusted markup, so a plain
    // tag-strip is a safe, cheap way to always ship a text alternative
    // alongside it rather than relying on each call site to hand-author one.
    text: htmlToText(html),
  });
}

function htmlToText(html) {
  return String(html)
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<\/(p|div|tr|h[1-6])>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

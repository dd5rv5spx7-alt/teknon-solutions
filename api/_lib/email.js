// Shared email sender — SMTP via Titan Mail (nodemailer), used by
// api/enquiry.js, the payment endpoints, and api/cron/daily-digest.js.
// Prefixed with an underscore so Vercel doesn't treat this file as its own
// route.
//
// Titan Mail (the mailbox behind info@ateknonsolutions.com) is used directly
// as the outgoing SMTP relay — mail is sent from the business's real
// mailbox, so it lands in that mailbox's own Sent folder, replies go
// straight to the inbox that's already checked daily, and it inherits
// Titan's existing SPF/DKIM for the domain instead of needing a separate
// sender domain verified with a third-party ESP.

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
  });
}

export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Shared Resend sender + HTML escaping, used by api/enquiry.js and the
// payment endpoints. Prefixed with an underscore so Vercel doesn't treat
// this file as its own route.

export async function sendEmail(apiKey, { to, bcc, subject, html }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'A Teknon Solutions <onboarding@resend.dev>', // swap for a verified domain sender once you add one in Resend
      to,
      ...(bcc ? { bcc } : {}),
      subject,
      html,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Resend error ${res.status}: ${text}`);
  }
  return res.json();
}

export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

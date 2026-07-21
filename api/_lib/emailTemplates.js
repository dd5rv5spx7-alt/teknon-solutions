// Shared HTML fragments for outgoing emails — one brand header/footer and
// one label/value row builder, reused by api/enquiry.js, api/verify-payment.js,
// api/razorpay-webhook.js, and api/cron/daily-digest.js so every email the
// site sends looks like it came from the same system. Prefixed with an
// underscore so Vercel doesn't treat this file as its own route.

import { escapeHtml } from './email.js';

export function emailRow(label, value) {
  return `
    <tr>
      <td style="padding:8px 14px;color:#5B6B8C;font-size:13px;font-family:sans-serif;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="padding:8px 14px;color:#0B1F4D;font-size:13px;font-family:sans-serif;">${escapeHtml(value || '—')}</td>
    </tr>`;
}

// Internal notification wrapper — for emails landing in the team's own inbox
// (new enquiry, payment received, payment failed, daily digest).
export function internalEmailHtml({ emoji, title, rows, ctaHref, ctaLabel }) {
  return `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;">
      <div style="background:linear-gradient(135deg,#0B1F4D,#071633);padding:24px 28px;border-radius:16px 16px 0 0;">
        <p style="color:#fff;font-size:18px;font-weight:700;margin:0;">${emoji} ${escapeHtml(title)}</p>
        <p style="color:rgba(255,255,255,0.6);font-size:12px;margin:4px 0 0;">A Teknon Solutions</p>
      </div>
      <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #eef1f6;border-top:none;border-radius:${ctaHref ? '0 0 0 0' : '0 0 16px 16px'};overflow:hidden;">
        ${rows.join('')}
      </table>
      ${
        ctaHref
          ? `<div style="background:#fff;border:1px solid #eef1f6;border-top:none;border-radius:0 0 16px 16px;padding:0 0 20px;">
               <p style="text-align:center;margin:16px 0 0;">
                 <a href="${ctaHref}" style="display:inline-block;background:#1E5EFF;color:#fff;text-decoration:none;font-size:13px;font-weight:600;padding:10px 20px;border-radius:100px;">
                   ${escapeHtml(ctaLabel || 'Open in admin dashboard')}
                 </a>
               </p>
             </div>`
          : ''
      }
    </div>`;
}

// Outward-facing wrapper — for emails landing in a customer/student's inbox
// (enquiry confirmation, payment receipt).
export function customerEmailHtml({ greetingName, bodyHtml, whatsappHref }) {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
      <div style="background:linear-gradient(135deg,#0B1F4D,#071633);padding:28px;border-radius:16px 16px 0 0;text-align:center;">
        <p style="color:#fff;font-size:20px;font-weight:800;margin:0;letter-spacing:-0.02em;">A TEKNON SOLUTIONS</p>
        <p style="color:#7DB8FF;font-size:11px;letter-spacing:0.3em;margin:4px 0 0;">LEARN. BUILD. GROW.</p>
      </div>
      <div style="background:#fff;border:1px solid #eef1f6;border-top:none;border-radius:0 0 16px 16px;padding:28px;">
        <p style="color:#0B1F4D;font-size:15px;">Hello ${escapeHtml(greetingName)},</p>
        ${bodyHtml}
        ${
          whatsappHref
            ? `<p style="text-align:center;margin:22px 0;">
                 <a href="${whatsappHref}" style="display:inline-block;background:#1E5EFF;color:#fff;text-decoration:none;font-size:13px;font-weight:600;padding:11px 24px;border-radius:100px;">
                   Message us on WhatsApp
                 </a>
               </p>`
            : ''
        }
        <p style="color:#0B1F4D;font-size:14px;margin-top:24px;">Regards,<br/>Team A Teknon Solutions</p>
      </div>
      <p style="text-align:center;color:#9AA7C2;font-size:11px;margin-top:14px;">
        A Teknon Solutions · Rajahmundry, Andhra Pradesh · ateknonsolutions.com
      </p>
    </div>`;
}

export const WHATSAPP_HREF = 'https://wa.me/918897571616';
export const ADMIN_URL = 'https://ateknonsolutions.com/admin';

export function rupees(paise) {
  return `₹${(paise / 100).toLocaleString('en-IN')}`;
}

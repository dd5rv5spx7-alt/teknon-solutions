// GET /api/cron/daily-digest
// Triggered once a day by Vercel Cron (see vercel.json's "crons" entry).
// Summarizes the last 24 hours of enquiries and payments into a single
// admin email, so the team knows what happened overnight without keeping
// the admin dashboard open.
//
// Vercel automatically sends `Authorization: Bearer <CRON_SECRET>` on every
// cron invocation once a CRON_SECRET env var exists on the project — that's
// what keeps this endpoint from being triggered by anyone who finds the URL.

import { sendEmail, isEmailConfigured } from '../_lib/email.js';
import { emailRow, internalEmailHtml, ADMIN_URL, rupees, TEAM_EMAIL } from '../_lib/emailTemplates.js';
import { TIER_PRICES } from '../_lib/pricing.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const provided = req.headers['authorization'] || '';
    if (provided !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ ok: false, error: 'Unauthorized' });
    }
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return res.status(200).json({ ok: true, skipped: 'Supabase not configured' });
  }
  if (!isEmailConfigured()) {
    return res.status(200).json({ ok: true, skipped: 'Email not configured' });
  }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [enquiries, payments] = await Promise.all([
    fetchRows(supabaseUrl, serviceKey, `enquiries?select=id,name,program&created_at=gte.${since}`),
    fetchRows(supabaseUrl, serviceKey, `payments?select=tier,amount,status&created_at=gte.${since}`),
  ]);

  if (enquiries.length === 0 && payments.length === 0) {
    // Nothing happened in the last 24h — skip sending an empty digest so the
    // team's inbox isn't full of "0 enquiries, 0 payments" noise every morning.
    return res.status(200).json({ ok: true, skipped: 'nothing to report' });
  }

  const paid = payments.filter((p) => p.status === 'paid');
  const revenue = paid.reduce((sum, p) => sum + p.amount, 0);
  const byTier = paid.reduce((acc, p) => {
    acc[p.tier] = (acc[p.tier] || 0) + 1;
    return acc;
  }, {});
  const tierSummary =
    Object.entries(byTier)
      .map(([tier, count]) => `${count}× ${TIER_PRICES[tier]?.label || tier}`)
      .join(', ') || 'none';

  try {
    await sendEmail({
      to: TEAM_EMAIL,
      subject: `📊 Daily digest — ${enquiries.length} enquiries, ${paid.length} payments`,
      html: internalEmailHtml({
        emoji: '📊',
        title: 'Daily Digest',
        ctaHref: ADMIN_URL,
        ctaLabel: 'Open in admin dashboard',
        rows: [
          emailRow('New enquiries (24h)', String(enquiries.length)),
          emailRow('Payments received (24h)', String(paid.length)),
          emailRow('Revenue (24h)', rupees(revenue)),
          emailRow('By program', tierSummary),
        ],
      }),
    });
  } catch (err) {
    console.error('daily-digest: email send failed', err);
    return res.status(500).json({ ok: false, error: 'Digest email failed to send' });
  }

  return res.status(200).json({ ok: true, enquiries: enquiries.length, payments: paid.length });
}

async function fetchRows(supabaseUrl, serviceKey, path) {
  try {
    const dbRes = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
    });
    if (!dbRes.ok) return [];
    return await dbRes.json();
  } catch {
    return [];
  }
}

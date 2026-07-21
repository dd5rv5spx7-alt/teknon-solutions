// GET /api/health — quick way to confirm the backend deployed correctly and
// see which integrations have credentials set, without exposing the values.
export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    time: new Date().toISOString(),
    email_configured: Boolean(process.env.SMTP_USER && process.env.SMTP_PASSWORD),
    supabase_configured: Boolean(
      (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL) && process.env.SUPABASE_SERVICE_ROLE_KEY
    ),
    razorpay_configured: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
  });
}

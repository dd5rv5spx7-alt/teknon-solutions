// GET /api/health — quick way to confirm the backend deployed correctly and
// see which integrations have credentials set, without exposing the values.
export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    time: new Date().toISOString(),
    resend_configured: Boolean(process.env.RESEND_API_KEY),
    supabase_configured: Boolean(
      (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL) && process.env.SUPABASE_SERVICE_ROLE_KEY
    ),
  });
}

// GET /api/whoami — returns the signed-in caller's verified identity and role.
//
// Reference implementation for @supabase/server: verifies the caller's JWT
// against the project's JWKS (no manual fetch-to-/auth/v1/user round trip
// like api/admin/create-person.js does) and hands back an RLS-scoped client
// already bound to that user via ctx.supabase.
//
// Runs on Vercel's Edge Runtime — @supabase/server's withSupabase wrapper
// speaks the standard Fetch API (Request/Response), not Node's (req, res).
export const config = { runtime: 'edge' };

import { withSupabase } from '@supabase/server';

export default {
  fetch: withSupabase({ auth: 'user' }, async (_req, ctx) => {
    const { data: profile, error } = await ctx.supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', ctx.userClaims.sub)
      .single();

    if (error) {
      return Response.json({ ok: false, error: 'Could not load profile.' }, { status: 500 });
    }

    return Response.json({
      ok: true,
      id: ctx.userClaims.sub,
      email: ctx.userClaims.email,
      role: profile?.role ?? null,
      full_name: profile?.full_name ?? null,
    });
  }),
};

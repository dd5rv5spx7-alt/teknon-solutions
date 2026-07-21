import { useEffect, useState } from 'react';

// Reads an admin-editable override from the site_content table (see
// supabase/021_cms.sql) for the given section, falling back to the
// hardcoded default from siteData.js if Supabase isn't configured, no
// override row exists yet, or the fetch fails for any reason — the
// marketing site must never break or show empty content just because a CMS
// row is missing. Returns the *default* synchronously on first render (no
// loading flash of empty content) and swaps in the override if one loads.
//
// Deliberately a raw fetch to Supabase's REST API, NOT the @supabase/
// supabase-js client — this hook is used by FAQ.jsx/Testimonials.jsx,
// which are statically imported into the public marketing bundle (not
// lazy). Importing the JS SDK here pulled the whole ~215KB client back into
// that eager bundle, undoing the fix in src/routes/ that moved it behind
// /admin, /student, /reset-password. A single unauthenticated GET doesn't
// need the SDK — same pattern the /api serverless functions already use.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export default function useSiteContent(sectionKey, fallback) {
  const [content, setContent] = useState(fallback);

  useEffect(() => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;
    let cancelled = false;
    fetch(`${SUPABASE_URL}/rest/v1/site_content?section_key=eq.${encodeURIComponent(sectionKey)}&select=content`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((rows) => {
        if (!cancelled && rows?.[0]?.content) setContent(rows[0].content);
      })
      .catch(() => {
        // Swallow — the fallback already rendered, and a CMS fetch failing
        // is not something a site visitor should ever see surfaced as an error.
      });
    return () => {
      cancelled = true;
    };
  }, [sectionKey]);

  return content;
}

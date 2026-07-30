// GET /api/sitemap — served at /sitemap.xml via the rewrite in vercel.json.
// Static routes are hardcoded; every published blog post is appended
// dynamically from Supabase with its real updated_at as <lastmod>, so a new
// post is announced to crawlers automatically instead of needing someone to
// hand-edit a static sitemap.xml file on every publish (the old approach —
// it only ever listed 3 URLs and never individual posts).

const SITE_URL = 'https://www.ateknonsolutions.com';

const STATIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/blog', changefreq: 'weekly', priority: '0.8' },
  { path: '/verify-certificate', changefreq: 'monthly', priority: '0.3' },
  { path: '/it-solutions', changefreq: 'monthly', priority: '0.7' },
];

export default async function handler(req, res) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = STATIC_ROUTES.map(
    (r) => `  <url>\n    <loc>${SITE_URL}${r.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`
  );

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  if (supabaseUrl && anonKey) {
    try {
      // blog_posts has no updated_at column (only created_at/published_at —
      // see supabase/010_blog.sql) — selecting a column that doesn't exist
      // makes PostgREST reject the whole query with a 400, which silently
      // dropped every blog post from this sitemap until this was caught.
      const postsRes = await fetch(
        `${supabaseUrl}/rest/v1/blog_posts?is_published=eq.true&select=slug,published_at`,
        { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } }
      );
      if (postsRes.ok) {
        const posts = await postsRes.json();
        posts.forEach((p) => {
          const lastmod = (p.published_at || today).slice(0, 10);
          urls.push(
            `  <url>\n    <loc>${SITE_URL}/blog/${encodeURIComponent(p.slug)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`
          );
        });
      } else {
        const text = await postsRes.text().catch(() => '');
        console.error('sitemap: blog_posts query failed', postsRes.status, text.slice(0, 300));
      }
    } catch (err) {
      console.error('sitemap: failed to fetch blog posts', err);
      // Fall through — the static routes above still make a valid sitemap.
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;

  // Cache-Control for this path is already set globally in vercel.json's
  // headers block (kept as one source of truth for that policy).
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  return res.status(200).send(xml);
}

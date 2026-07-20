import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Loader2, ArrowRight } from 'lucide-react';
import Seo from '../components/Seo.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import WhatsAppButton from '../components/WhatsAppButton.jsx';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .then(({ data }) => {
        setPosts(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-navy transition-colors duration-300">
      <Seo
        title="Blog | A Teknon Solutions"
        description="Practical guidance, tutorials and updates for students building a career in tech — from A Teknon Solutions."
        path="/blog"
      />
      <Navbar />
      <main className="pt-40 pb-28">
        <div className="container-px mx-auto max-w-8xl">
          <div className="max-w-2xl mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-royal/10 dark:bg-accent/15 text-royal dark:text-accent text-xs font-mono uppercase tracking-wide mb-4">
              <Newspaper size={13} /> Blog
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-navy dark:text-white tracking-tight">
              Career Tips, Tutorials &amp; Updates
            </h1>
            <p className="mt-3 text-slatesoft dark:text-white/60">
              Practical guidance for students building a career in tech.
            </p>
          </div>

          {loading && (
            <div className="flex items-center gap-2 text-slatesoft dark:text-white/50 text-sm">
              <Loader2 size={16} className="animate-spin" /> Loading…
            </div>
          )}

          {!loading && posts.length === 0 && (
            <p className="text-sm text-slatesoft dark:text-white/50">No posts published yet — check back soon.</p>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p) => (
              <Link
                key={p.id}
                to={`/blog/${p.slug}`}
                className="group rounded-2xl border border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.04] overflow-hidden hover:border-royal/30 hover:-translate-y-1 transition-all duration-300"
              >
                {p.featured_image ? (
                  <img
                    src={p.featured_image}
                    alt={p.title}
                    loading="lazy"
                    className="w-full aspect-[16/9] object-cover"
                  />
                ) : (
                  <div className="w-full aspect-[16/9] bg-grad-navy grid place-items-center">
                    <Newspaper size={28} className="text-white/30" />
                  </div>
                )}
                <div className="p-5">
                  {p.category && (
                    <span className="text-[11px] font-mono uppercase tracking-wide text-royal dark:text-accent">{p.category}</span>
                  )}
                  <h2 className="mt-1.5 font-display font-bold text-navy dark:text-white leading-snug group-hover:text-royal dark:group-hover:text-accent transition-colors">
                    {p.title}
                  </h2>
                  {p.excerpt && (
                    <p className="mt-2 text-sm text-slatesoft dark:text-white/50 line-clamp-2">{p.excerpt}</p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-royal dark:text-accent">
                    Read more <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

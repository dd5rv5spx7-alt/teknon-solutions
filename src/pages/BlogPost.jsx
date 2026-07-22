import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Calendar, User } from 'lucide-react';
import Seo from '../components/Seo.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import WhatsAppButton from '../components/WhatsAppButton.jsx';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      setNotFound(true);
      return;
    }
    setLoading(true);
    setNotFound(false);
    setLoadError(false);
    supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          setLoadError(true);
        } else if (data) {
          setPost(data);
        } else {
          setNotFound(true);
        }
        setLoading(false);
      })
      // A network-level failure rejects rather than resolving with {error} —
      // without this the spinner would spin forever instead of ever
      // reaching an error state.
      .catch(() => {
        setLoadError(true);
        setLoading(false);
      });
  }, [slug]);

  return (
    <div className="min-h-screen bg-white dark:bg-navy transition-colors duration-300">
      {/* Always render Seo — regardless of loading/not-found state — so the
          canonical/title/robots tags always match what's actually on screen.
          Previously this only rendered when `post` was truthy: a client-side
          nav from a valid post to an invalid slug left the PREVIOUS post's
          title/canonical/OG tags stuck in the DOM (Helmet doesn't reset tags
          when no instance re-renders), and an invalid slug was a soft-404 —
          HTTP 200 with no noindex, since the SPA catch-all in vercel.json
          returns 200 for every non-file route. */}
      {post ? (
        <Seo
          title={`${post.meta_title || post.title} | A Teknon Solutions`}
          description={post.meta_description || post.excerpt || `Read "${post.title}" on the A Teknon Solutions blog.`}
          path={`/blog/${slug}`}
          image={post.featured_image || undefined}
          type="article"
          articlePublishedTime={post.published_at || undefined}
          articleAuthor={post.author_name || undefined}
          jsonLd={{
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.meta_description || post.excerpt || undefined,
            image: post.featured_image || undefined,
            datePublished: post.published_at || undefined,
            dateModified: post.updated_at || post.published_at || undefined,
            author: post.author_name ? { '@type': 'Person', name: post.author_name } : undefined,
            publisher: {
              '@type': 'Organization',
              name: 'A Teknon Solutions',
              logo: { '@type': 'ImageObject', url: `${window.location.origin}/og-image.png` },
            },
            mainEntityOfPage: { '@type': 'WebPage', '@id': `${window.location.origin}/blog/${slug}` },
          }}
        />
      ) : notFound ? (
        <Seo
          title="Post not found | A Teknon Solutions"
          description="This blog post may have been unpublished or the link is incorrect."
          path={`/blog/${slug}`}
          noindex
        />
      ) : loadError ? (
        <Seo
          title="Couldn't load this post | A Teknon Solutions"
          description="This blog post couldn't be loaded right now."
          path={`/blog/${slug}`}
          noindex
        />
      ) : (
        <Seo title="Loading… | A Teknon Solutions" description="Loading this post." path={`/blog/${slug}`} noindex />
      )}
      <Navbar />
      <main className="pt-40 pb-28">
        <div className="container-px mx-auto max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-slatesoft dark:text-white/60 hover:text-royal dark:hover:text-accent transition-colors mb-8">
            <ArrowLeft size={15} /> Back to blog
          </Link>

          {loading && (
            <div className="flex items-center gap-2 text-slatesoft dark:text-white/50 text-sm">
              <Loader2 size={16} className="animate-spin" /> Loading…
            </div>
          )}

          {!loading && notFound && (
            <div className="text-center py-20">
              <p className="font-display font-bold text-xl text-navy dark:text-white">Post not found</p>
              <p className="mt-2 text-sm text-slatesoft dark:text-white/50">
                This post may have been unpublished or the link is incorrect.
              </p>
            </div>
          )}

          {!loading && loadError && (
            <div className="text-center py-20">
              <p className="font-display font-bold text-xl text-navy dark:text-white">Couldn&rsquo;t load this post</p>
              <p className="mt-2 text-sm text-slatesoft dark:text-white/50">
                Something went wrong on our end — please refresh or try again shortly.
              </p>
            </div>
          )}

          {!loading && post && (
            <article>
              {post.category && (
                <span className="inline-block text-[11px] font-mono uppercase tracking-wide text-royal dark:text-accent mb-3">
                  {post.category}
                </span>
              )}
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-navy dark:text-white tracking-tight mb-4">
                {post.title}
              </h1>
              <div className="flex items-center gap-5 text-xs text-slatesoft dark:text-white/40 mb-8">
                {post.author_name && (
                  <span className="inline-flex items-center gap-1.5">
                    <User size={13} /> {post.author_name}
                  </span>
                )}
                {post.published_at && (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={13} /> {new Date(post.published_at).toLocaleDateString()}
                  </span>
                )}
              </div>

              {post.featured_image && (
                <img
                  src={post.featured_image}
                  alt={post.title}
                  // This sits right under the title/meta as the first real
                  // content image — almost always the LCP element on this
                  // route, so unlike below-the-fold images it should load
                  // eagerly rather than lazily.
                  loading="eager"
                  fetchPriority="high"
                  className="w-full aspect-[16/9] object-cover rounded-2xl mb-8"
                />
              )}

              {post.content && (
                <div className="text-navy/80 dark:text-white/75 leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </div>
              )}

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-navy/8 dark:border-white/10">
                  {post.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-mist dark:bg-white/5 text-slatesoft dark:text-white/50">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

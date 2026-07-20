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

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      setNotFound(true);
      return;
    }
    setLoading(true);
    setNotFound(false);
    supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setPost(data);
        } else {
          setNotFound(true);
        }
        setLoading(false);
      });
  }, [slug]);

  return (
    <div className="min-h-screen bg-white dark:bg-navy transition-colors duration-300">
      {post && (
        <Seo
          title={`${post.meta_title || post.title} | A Teknon Solutions`}
          description={post.meta_description || post.excerpt || `Read "${post.title}" on the A Teknon Solutions blog.`}
          path={`/blog/${slug}`}
          image={post.featured_image || undefined}
        />
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
                  loading="lazy"
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

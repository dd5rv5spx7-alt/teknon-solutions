import React, { useEffect, useMemo, useState } from 'react';
import { Newspaper, Plus, X, Loader2, Search, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { supabase } from '../lib/supabaseClient.js';
import useFocusTrap from '../components/admin/useFocusTrap.js';

const EMPTY_FORM = {
  title: '', slug: '', excerpt: '', content: '', featured_image: '',
  category: '', tags: '', author_name: '', meta_title: '', meta_description: '', is_published: false,
};

function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function AdminBlog() {
  const { role: myRole } = useAuth();
  const isAdmin = myRole === 'admin';

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  function fetchPosts() {
    setLoading(true);
    supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setPosts(data ?? []);
        setLoading(false);
      });
  }

  async function togglePublished(post) {
    setUpdatingId(post.id);
    const nowPublishing = !post.is_published;
    const patch = {
      is_published: nowPublishing,
      published_at: nowPublishing && !post.published_at ? new Date().toISOString() : post.published_at,
    };
    const { error } = await supabase.from('blog_posts').update(patch).eq('id', post.id);
    if (!error) {
      setPosts((list) => list.map((p) => (p.id === post.id ? { ...p, ...patch } : p)));
    }
    setUpdatingId(null);
  }

  async function deletePost(id) {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    setUpdatingId(id);
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (!error) setPosts((list) => list.filter((p) => p.id !== id));
    setUpdatingId(null);
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) => p.title?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q));
  }, [posts, search]);

  return (
    <>
      {!isAdmin && (
        <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-800 dark:text-amber-200 mb-8">
          You're signed in as faculty — you can view posts, but only admins can add, edit, or
          remove them.
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slatesoft dark:text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, category…"
            aria-label="Search posts"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-navy/10 dark:border-white/15 bg-white dark:bg-white/5 text-navy dark:text-white text-sm placeholder:text-slatesoft dark:placeholder:text-white/55 focus:border-royal/50"
          />
        </div>
        {isAdmin && (
          <button
            onClick={() => setEditing({ ...EMPTY_FORM })}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-grad-primary text-white text-sm font-semibold hover:brightness-110 transition-all shrink-0"
          >
            <Plus size={15} /> Add Post
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-slatesoft dark:text-white/50 text-sm">
          <Loader2 size={16} className="animate-spin" /> Loading…
        </div>
      )}
      {error && <p className="text-sm text-red-500">Couldn&rsquo;t load posts: {error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <p className="text-sm text-slatesoft dark:text-white/50">No posts match.</p>
      )}

      {filtered.length > 0 && (
        <div className="rounded-2xl border border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.04] divide-y divide-navy/5 dark:divide-white/5 overflow-hidden">
          {filtered.map((p) => (
            <div key={p.id} className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4">
              <div className="w-9 h-9 grid place-items-center rounded-lg bg-royal/10 dark:bg-accent/15 text-royal dark:text-accent shrink-0">
                <Newspaper size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-navy dark:text-white truncate">
                  {p.title}
                  {!p.is_published && (
                    <span className="ml-2 text-[11px] font-mono text-slatesoft dark:text-white/40 align-middle">DRAFT</span>
                  )}
                </p>
                <p className="text-xs text-slatesoft dark:text-white/50 truncate">
                  /blog/{p.slug} {p.category ? `· ${p.category}` : ''}
                </p>
              </div>
              {isAdmin && (
                <div className="flex flex-wrap gap-2 shrink-0">
                  <ActionBtn
                    icon={p.is_published ? EyeOff : Eye}
                    label={p.is_published ? 'Unpublish' : 'Publish'}
                    onClick={() => togglePublished(p)}
                    disabled={updatingId === p.id}
                  />
                  <ActionBtn icon={Pencil} label="Edit" onClick={() => setEditing({ ...p, tags: (p.tags || []).join(', ') })} disabled={updatingId === p.id} />
                  <ActionBtn icon={Trash2} label="Delete" onClick={() => deletePost(p.id)} disabled={updatingId === p.id} danger />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {editing && (
        <PostModal
          post={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            fetchPosts();
          }}
        />
      )}
    </>
  );
}

function PostModal({ post, onClose, onSaved }) {
  const isNew = !post.id;
  const [form, setForm] = useState(post);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const dialogRef = useFocusTrap(onClose);

  function handleTitleChange(value) {
    setForm((f) => ({ ...f, title: value, slug: slugTouched ? f.slug : slugify(value) }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const payload = {
      title: form.title.trim(),
      slug: slugify(form.slug || form.title),
      excerpt: form.excerpt?.trim() || null,
      content: form.content?.trim() || null,
      featured_image: form.featured_image?.trim() || null,
      category: form.category?.trim() || null,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      author_name: form.author_name?.trim() || null,
      meta_title: form.meta_title?.trim() || null,
      meta_description: form.meta_description?.trim() || null,
      is_published: form.is_published ?? false,
      published_at: form.is_published ? form.published_at || new Date().toISOString() : form.published_at || null,
    };
    const { error } = isNew
      ? await supabase.from('blog_posts').insert(payload)
      : await supabase.from('blog_posts').update(payload).eq('id', post.id);
    setSubmitting(false);
    if (error) setError(error.message);
    else onSaved();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="post-modal-title"
        className="w-full max-w-lg rounded-3xl bg-white dark:bg-navy p-7 shadow-card-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 id="post-modal-title" className="font-display font-bold text-lg text-navy dark:text-white">
            {isNew ? 'Add Post' : 'Edit Post'}
          </h2>
          <button onClick={onClose} aria-label="Close" className="text-slatesoft dark:text-white/50 hover:text-navy dark:hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Title">
            <input type="text" required value={form.title} onChange={(e) => handleTitleChange(e.target.value)} className="modal-input" placeholder="5 Skills Every Junior Developer Needs" />
          </Field>
          <Field label="Slug (URL)">
            <input
              type="text"
              required
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setForm((f) => ({ ...f, slug: e.target.value }));
              }}
              className="modal-input"
              placeholder="5-skills-every-junior-developer-needs"
            />
          </Field>
          <Field label="Excerpt">
            <textarea rows={2} value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} className="modal-input resize-none" placeholder="One or two sentences shown on the blog listing." />
          </Field>
          <Field label="Content">
            <textarea rows={8} value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} className="modal-input resize-none" placeholder="Full post content (plain text/paragraphs)." />
          </Field>
          <Field label="Featured image URL">
            <input type="url" value={form.featured_image} onChange={(e) => setForm((f) => ({ ...f, featured_image: e.target.value }))} className="modal-input" placeholder="https://…" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <input type="text" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="modal-input" placeholder="Career Tips" />
            </Field>
            <Field label="Author name">
              <input type="text" value={form.author_name} onChange={(e) => setForm((f) => ({ ...f, author_name: e.target.value }))} className="modal-input" placeholder="A Teknon Solutions Team" />
            </Field>
          </div>
          <Field label="Tags (comma separated)">
            <input type="text" value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} className="modal-input" placeholder="career, internships, react" />
          </Field>
          <Field label="SEO meta title (optional)">
            <input type="text" value={form.meta_title} onChange={(e) => setForm((f) => ({ ...f, meta_title: e.target.value }))} className="modal-input" />
          </Field>
          <Field label="SEO meta description (optional)">
            <textarea rows={2} value={form.meta_description} onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))} className="modal-input resize-none" />
          </Field>
          <label className="flex items-center gap-2 text-sm text-navy dark:text-white">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))}
              className="rounded border-navy/20"
            />
            Published (visible on the public blog)
          </label>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="btn-glow w-full bg-grad-primary text-white font-semibold px-6 py-3 rounded-xl hover:brightness-110 transition-all disabled:opacity-60"
          >
            {submitting ? 'Saving…' : isNew ? 'Add Post' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

// The label previously sat as a plain sibling of the control with no
// htmlFor/id or nesting — visually a label, but with no programmatic
// association a screen reader could use to announce it. Cloning the id onto
// the single input/select/textarea child (when there is one) restores that
// without touching every call site.
function Field({ label, children }) {
  const id = React.useId();
  const associable = React.isValidElement(children) && ['input', 'select', 'textarea'].includes(children.type);
  return (
    <div>
      <label htmlFor={associable ? id : undefined} className="block text-xs font-semibold text-navy dark:text-white mb-1.5">
        {label}
      </label>
      {associable ? React.cloneElement(children, { id }) : children}
    </div>
  );
}

function ActionBtn({ icon: Icon, label, onClick, disabled, danger }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors disabled:opacity-50 ${
        danger
          ? 'border-red-500/30 text-red-500 hover:bg-red-500/10'
          : 'border-navy/10 dark:border-white/15 text-navy dark:text-white hover:border-royal/40'
      }`}
    >
      <Icon size={13} /> {label}
    </button>
  );
}

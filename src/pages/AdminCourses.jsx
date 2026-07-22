import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen, Plus, X, Loader2, Search, Pencil, Trash2, Eye, EyeOff,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { supabase } from '../lib/supabaseClient.js';
import useFocusTrap from '../components/admin/useFocusTrap.js';

const EMPTY_FORM = { title: '', category: '', description: '', duration: '', price: '', is_published: true };

export default function AdminCourses() {
  const { role: myRole } = useAuth();
  const isAdmin = myRole === 'admin';

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {...course} = edit

  useEffect(() => {
    fetchCourses();
  }, []);

  function fetchCourses() {
    setLoading(true);
    supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setCourses(data ?? []);
        setLoading(false);
      });
  }

  async function togglePublished(course) {
    setUpdatingId(course.id);
    const { error } = await supabase
      .from('courses')
      .update({ is_published: !course.is_published })
      .eq('id', course.id);
    if (!error) {
      setCourses((list) => list.map((c) => (c.id === course.id ? { ...c, is_published: !c.is_published } : c)));
    }
    setUpdatingId(null);
  }

  async function deleteCourse(id) {
    if (!window.confirm('Delete this course? This cannot be undone. (Blocked if it still has modules — remove those first, or Unpublish instead to just hide it.)')) return;
    setUpdatingId(id);
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) {
      window.alert(`Couldn't delete this course: ${error.message}`);
    } else {
      setCourses((list) => list.filter((c) => c.id !== id));
    }
    setUpdatingId(null);
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter(
      (c) => c.title?.toLowerCase().includes(q) || c.category?.toLowerCase().includes(q)
    );
  }, [courses, search]);

  return (
    <>
      {!isAdmin && (
        <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-800 dark:text-amber-200 mb-8">
          You're signed in as faculty — you can view the catalog, but only admins can add, edit, or
          remove courses.
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
            aria-label="Search courses"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-navy/10 dark:border-white/15 bg-white dark:bg-white/5 text-navy dark:text-white text-sm placeholder:text-slatesoft dark:placeholder:text-white/55 focus:outline-hidden focus:border-royal/50"
          />
        </div>
        {isAdmin && (
          <button
            onClick={() => setEditing({ ...EMPTY_FORM })}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-grad-primary text-white text-sm font-semibold hover:brightness-110 transition-all shrink-0"
          >
            <Plus size={15} /> Add Course
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-slatesoft dark:text-white/50 text-sm">
          <Loader2 size={16} className="animate-spin" /> Loading…
        </div>
      )}
      {error && <p className="text-sm text-red-500">Couldn&rsquo;t load courses: {error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <p className="text-sm text-slatesoft dark:text-white/50">No courses match.</p>
      )}

      {filtered.length > 0 && (
        <div className="rounded-2xl border border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.04] divide-y divide-navy/5 dark:divide-white/5 overflow-hidden">
          {filtered.map((c) => (
            <div key={c.id} className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4">
              <div className="w-9 h-9 grid place-items-center rounded-lg bg-royal/10 dark:bg-accent/15 text-royal dark:text-accent shrink-0">
                <BookOpen size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-navy dark:text-white truncate">
                  {c.title}
                  {!c.is_published && (
                    <span className="ml-2 text-[11px] font-mono text-slatesoft dark:text-white/40 align-middle">DRAFT</span>
                  )}
                </p>
                <p className="text-xs text-slatesoft dark:text-white/50 truncate">
                  {c.category || '—'} {c.duration ? `· ${c.duration}` : ''} {c.price ? `· ${c.price}` : ''}
                </p>
              </div>
              {isAdmin && (
                <div className="flex flex-wrap gap-2 shrink-0">
                  <ActionBtn
                    icon={c.is_published ? EyeOff : Eye}
                    label={c.is_published ? 'Unpublish' : 'Publish'}
                    onClick={() => togglePublished(c)}
                    disabled={updatingId === c.id}
                  />
                  <ActionBtn icon={Pencil} label="Edit" onClick={() => setEditing(c)} disabled={updatingId === c.id} />
                  <ActionBtn icon={Trash2} label="Delete" onClick={() => deleteCourse(c.id)} disabled={updatingId === c.id} danger />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {editing && (
        <CourseModal
          course={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            fetchCourses();
          }}
        />
      )}
    </>
  );
}

function CourseModal({ course, onClose, onSaved }) {
  const isNew = !course.id;
  const [form, setForm] = useState({
    title: course.title || '',
    category: course.category || '',
    description: course.description || '',
    duration: course.duration || '',
    price: course.price || '',
    is_published: course.is_published ?? true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const dialogRef = useFocusTrap(onClose);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const payload = { ...form, title: form.title.trim() };
    const { error } = isNew
      ? await supabase.from('courses').insert(payload)
      : await supabase.from('courses').update(payload).eq('id', course.id);
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
        aria-labelledby="course-modal-title"
        className="w-full max-w-md rounded-3xl bg-white dark:bg-navy p-7 shadow-card-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 id="course-modal-title" className="font-display font-bold text-lg text-navy dark:text-white">
            {isNew ? 'Add Course' : 'Edit Course'}
          </h2>
          <button onClick={onClose} aria-label="Close" className="text-slatesoft dark:text-white/50 hover:text-navy dark:hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Title">
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="modal-input"
              placeholder="Full Stack Web Development"
            />
          </Field>
          <Field label="Category">
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="modal-input"
              placeholder="Web Development"
            />
          </Field>
          <Field label="Description">
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="modal-input resize-none"
              placeholder="Frontend, backend and databases, end to end."
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Duration">
              <input
                type="text"
                value={form.duration}
                onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                className="modal-input"
                placeholder="4 Weeks"
              />
            </Field>
            <Field label="Price">
              <input
                type="text"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                className="modal-input"
                placeholder="₹3,999"
              />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm text-navy dark:text-white">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))}
              className="rounded border-navy/20"
            />
            Published (visible to students)
          </label>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="btn-glow w-full bg-grad-primary text-white font-semibold px-6 py-3 rounded-xl hover:brightness-110 transition-all disabled:opacity-60"
          >
            {submitting ? 'Saving…' : isNew ? 'Add Course' : 'Save Changes'}
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

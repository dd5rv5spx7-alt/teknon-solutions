import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Layers, Plus, X, Loader2, Pencil, Trash2, PlayCircle, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { supabase } from '../lib/supabaseClient.js';

export default function AdminCourseContent() {
  const { role: myRole } = useAuth();
  const isAdmin = myRole === 'admin';

  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [modules, setModules] = useState([]);
  const [lessonsByModule, setLessonsByModule] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingModule, setEditingModule] = useState(null); // null closed, {} new, {...} edit
  const [editingLesson, setEditingLesson] = useState(null); // { moduleId, lesson: {} | {...} }

  useEffect(() => {
    supabase
      .from('courses')
      .select('id, title')
      .order('title', { ascending: true })
      .then(({ data }) => setCourses(data ?? []));
  }, []);

  useEffect(() => {
    if (!courseId) {
      setModules([]);
      setLessonsByModule({});
      return;
    }
    fetchContent();
  }, [courseId]);

  async function fetchContent() {
    setLoading(true);
    setError('');
    const { data: moduleData, error: moduleError } = await supabase
      .from('course_modules')
      .select('*')
      .eq('course_id', courseId)
      .order('position', { ascending: true });

    if (moduleError) {
      setError(moduleError.message);
      setLoading(false);
      return;
    }
    setModules(moduleData ?? []);

    const moduleIds = (moduleData ?? []).map((m) => m.id);
    if (moduleIds.length === 0) {
      setLessonsByModule({});
      setLoading(false);
      return;
    }

    const { data: lessonData, error: lessonError } = await supabase
      .from('course_lessons')
      .select('*')
      .in('module_id', moduleIds)
      .order('position', { ascending: true });

    if (lessonError) {
      setError(lessonError.message);
      setLoading(false);
      return;
    }
    const grouped = {};
    (lessonData ?? []).forEach((l) => {
      grouped[l.module_id] = grouped[l.module_id] || [];
      grouped[l.module_id].push(l);
    });
    setLessonsByModule(grouped);
    setLoading(false);
  }

  async function deleteModule(id) {
    if (!window.confirm('Delete this module? This cannot be undone. (Blocked if it still has lessons — delete those first.)')) return;
    const { error } = await supabase.from('course_modules').delete().eq('id', id);
    if (error) {
      window.alert(`Couldn't delete this module: ${error.message}`);
      return;
    }
    fetchContent();
  }

  async function deleteLesson(id) {
    if (!window.confirm('Delete this lesson? This cannot be undone. (Blocked if any student has recorded progress on it.)')) return;
    const { error } = await supabase.from('course_lessons').delete().eq('id', id);
    if (error) {
      window.alert(`Couldn't delete this lesson: ${error.message}`);
      return;
    }
    fetchContent();
  }

  const selectedCourseTitle = useMemo(
    () => courses.find((c) => c.id === courseId)?.title,
    [courses, courseId]
  );

  return (
    <>
      {!isAdmin && (
        <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-800 dark:text-amber-200 mb-8">
          You're signed in as faculty — you can view course curriculum here, but only admins can
          edit it.
        </div>
      )}

      <div className="mb-6">
        <label className="block text-xs font-semibold text-navy dark:text-white mb-1.5">Course</label>
        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="modal-input max-w-md"
        >
          <option value="">Select a course to manage its curriculum…</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {!courseId && (
        <p className="text-sm text-slatesoft dark:text-white/50">
          Pick a course above to add modules and lessons to it.
        </p>
      )}

      {courseId && (
        <>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-lg text-navy dark:text-white">{selectedCourseTitle}</h2>
            {isAdmin && (
              <button
                onClick={() => setEditingModule({ position: modules.length })}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-grad-primary text-white text-sm font-semibold hover:brightness-110 transition-all shrink-0"
              >
                <Plus size={15} /> Add Module
              </button>
            )}
          </div>

          {loading && (
            <div className="flex items-center gap-2 text-slatesoft dark:text-white/50 text-sm">
              <Loader2 size={16} className="animate-spin" /> Loading…
            </div>
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}
          {!loading && !error && modules.length === 0 && (
            <p className="text-sm text-slatesoft dark:text-white/50">No modules yet.</p>
          )}

          <div className="space-y-4">
            {modules.map((m) => (
              <div key={m.id} className="rounded-2xl border border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.04] overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 bg-mist/60 dark:bg-white/[0.02]">
                  <div className="w-9 h-9 grid place-items-center rounded-lg bg-royal/10 dark:bg-accent/15 text-royal dark:text-accent shrink-0">
                    <Layers size={16} />
                  </div>
                  <p className="text-sm font-semibold text-navy dark:text-white flex-1 truncate">{m.title}</p>
                  {isAdmin && (
                    <div className="flex gap-2 shrink-0">
                      <ActionBtn icon={Plus} label="Add Lesson" onClick={() => setEditingLesson({ moduleId: m.id, lesson: { position: (lessonsByModule[m.id] || []).length } })} />
                      <ActionBtn icon={Pencil} label="Edit" onClick={() => setEditingModule(m)} />
                      <ActionBtn icon={Trash2} label="Delete" onClick={() => deleteModule(m.id)} danger />
                    </div>
                  )}
                </div>

                <div className="divide-y divide-navy/5 dark:divide-white/5">
                  {(lessonsByModule[m.id] || []).length === 0 && (
                    <p className="px-5 py-4 text-sm text-slatesoft dark:text-white/40">No lessons in this module yet.</p>
                  )}
                  {(lessonsByModule[m.id] || []).map((l) => (
                    <div key={l.id} className="flex items-center gap-3 px-5 py-3.5">
                      {l.video_url ? (
                        <PlayCircle size={15} className="text-royal dark:text-accent shrink-0" />
                      ) : (
                        <FileText size={15} className="text-slatesoft dark:text-white/40 shrink-0" />
                      )}
                      <p className="text-sm text-navy dark:text-white/85 flex-1 truncate">{l.title}</p>
                      {isAdmin && (
                        <div className="flex gap-2 shrink-0">
                          <ActionBtn icon={Pencil} label="Edit" onClick={() => setEditingLesson({ moduleId: m.id, lesson: l })} />
                          <ActionBtn icon={Trash2} label="Delete" onClick={() => deleteLesson(l.id)} danger />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {editingModule && (
        <ModuleModal
          courseId={courseId}
          module={editingModule}
          onClose={() => setEditingModule(null)}
          onSaved={() => {
            setEditingModule(null);
            fetchContent();
          }}
        />
      )}

      {editingLesson && (
        <LessonModal
          moduleId={editingLesson.moduleId}
          lesson={editingLesson.lesson}
          onClose={() => setEditingLesson(null)}
          onSaved={() => {
            setEditingLesson(null);
            fetchContent();
          }}
        />
      )}
    </>
  );
}

function useFocusTrap(onClose) {
  const dialogRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    previouslyFocused.current = document.activeElement;
    const focusable = dialogRef.current.querySelectorAll(
      'input, select, textarea, button, [href], [tabindex]:not([tabindex="-1"])'
    );
    focusable[0]?.focus();

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && focusable.length > 0) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused.current?.focus?.();
    };
  }, [onClose]);

  return dialogRef;
}

function ModuleModal({ courseId, module: mod, onClose, onSaved }) {
  const isNew = !mod.id;
  const [title, setTitle] = useState(mod.title || '');
  const [position, setPosition] = useState(mod.position ?? 0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const dialogRef = useFocusTrap(onClose);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const payload = { title: title.trim(), position: Number(position) || 0, course_id: courseId };
    const { error } = isNew
      ? await supabase.from('course_modules').insert(payload)
      : await supabase.from('course_modules').update(payload).eq('id', mod.id);
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
        aria-labelledby="module-modal-title"
        className="w-full max-w-md rounded-3xl bg-white dark:bg-navy p-7 shadow-card-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 id="module-modal-title" className="font-display font-bold text-lg text-navy dark:text-white">
            {isNew ? 'Add Module' : 'Edit Module'}
          </h2>
          <button onClick={onClose} aria-label="Close" className="text-slatesoft dark:text-white/50 hover:text-navy dark:hover:text-white">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-navy dark:text-white mb-1.5">Module title</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="modal-input" placeholder="Getting Started" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy dark:text-white mb-1.5">Order (lower shows first)</label>
            <input type="number" value={position} onChange={(e) => setPosition(e.target.value)} className="modal-input" />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-glow w-full bg-grad-primary text-white font-semibold px-6 py-3 rounded-xl hover:brightness-110 transition-all disabled:opacity-60">
            {submitting ? 'Saving…' : isNew ? 'Add Module' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

function LessonModal({ moduleId, lesson, onClose, onSaved }) {
  const isNew = !lesson.id;
  const [form, setForm] = useState({
    title: lesson.title || '',
    content: lesson.content || '',
    video_url: lesson.video_url || '',
    resource_url: lesson.resource_url || '',
    position: lesson.position ?? 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const dialogRef = useFocusTrap(onClose);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const payload = {
      title: form.title.trim(),
      content: form.content.trim() || null,
      video_url: form.video_url.trim() || null,
      resource_url: form.resource_url.trim() || null,
      position: Number(form.position) || 0,
      module_id: moduleId,
    };
    const { error } = isNew
      ? await supabase.from('course_lessons').insert(payload)
      : await supabase.from('course_lessons').update(payload).eq('id', lesson.id);
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
        aria-labelledby="lesson-modal-title"
        className="w-full max-w-md rounded-3xl bg-white dark:bg-navy p-7 shadow-card-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 id="lesson-modal-title" className="font-display font-bold text-lg text-navy dark:text-white">
            {isNew ? 'Add Lesson' : 'Edit Lesson'}
          </h2>
          <button onClick={onClose} aria-label="Close" className="text-slatesoft dark:text-white/50 hover:text-navy dark:hover:text-white">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-navy dark:text-white mb-1.5">Lesson title</label>
            <input type="text" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="modal-input" placeholder="Setting up your environment" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy dark:text-white mb-1.5">Notes / content</label>
            <textarea rows={4} value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} className="modal-input resize-none" placeholder="What this lesson covers…" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy dark:text-white mb-1.5">Video URL (optional)</label>
            <input type="url" value={form.video_url} onChange={(e) => setForm((f) => ({ ...f, video_url: e.target.value }))} className="modal-input" placeholder="https://youtube.com/embed/…" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy dark:text-white mb-1.5">Resource / download URL (optional)</label>
            <input type="url" value={form.resource_url} onChange={(e) => setForm((f) => ({ ...f, resource_url: e.target.value }))} className="modal-input" placeholder="https://…" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy dark:text-white mb-1.5">Order (lower shows first)</label>
            <input type="number" value={form.position} onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))} className="modal-input" />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-glow w-full bg-grad-primary text-white font-semibold px-6 py-3 rounded-xl hover:brightness-110 transition-all disabled:opacity-60">
            {submitting ? 'Saving…' : isNew ? 'Add Lesson' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

function ActionBtn({ icon: Icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
        danger
          ? 'border-red-500/30 text-red-500 hover:bg-red-500/10'
          : 'border-navy/10 dark:border-white/15 text-navy dark:text-white hover:border-royal/40'
      }`}
    >
      <Icon size={13} />
    </button>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
import { FileCheck2, Plus, X, Loader2, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { supabase } from '../lib/supabaseClient.js';
import useFocusTrap from '../components/admin/useFocusTrap.js';

const EMPTY_FORM = { course_id: '', title: '', description: '', due_date: '', max_score: '' };

export default function AdminAssignments() {
  const { role: myRole } = useAuth();
  const canWrite = myRole === 'admin' || myRole === 'faculty';

  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [grading, setGrading] = useState(null); // assignment row, or null

  useEffect(() => {
    supabase.from('courses').select('id, title').order('title', { ascending: true }).then(({ data }) => setCourses(data ?? []));
    fetchAssignments();
  }, []);

  function fetchAssignments() {
    setLoading(true);
    supabase
      .from('assignments')
      .select('*, courses(title)')
      .order('created_at', { ascending: false })
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setAssignments(data ?? []);
        setLoading(false);
      });
  }

  async function deleteAssignment(id) {
    if (!window.confirm('Delete this assignment? Blocked if any student has submitted work for it.')) return;
    const { error: err } = await supabase.from('assignments').delete().eq('id', id);
    if (!err) setAssignments((list) => list.filter((a) => a.id !== id));
    else window.alert(`Couldn't delete this assignment: ${err.message}`);
  }

  const filtered = useMemo(() => (courseId ? assignments.filter((a) => a.course_id === courseId) : assignments), [assignments, courseId]);

  return (
    <>
      <h1 className="font-display font-bold text-2xl text-navy dark:text-white mb-5 flex items-center gap-2">
        <FileCheck2 size={22} /> Assignments
      </h1>
      {!canWrite && (
        <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-800 dark:text-amber-200 mb-6">
          You don&rsquo;t have permission to create or grade assignments.
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <select value={courseId} onChange={(e) => setCourseId(e.target.value)} aria-label="Filter by course" className="modal-input flex-1">
          <option value="">All courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        {canWrite && (
          <button
            onClick={() => setEditing({ ...EMPTY_FORM })}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-grad-primary text-white text-sm font-semibold hover:brightness-110 transition-all shrink-0"
          >
            <Plus size={15} /> Add Assignment
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-slatesoft dark:text-white/50 text-sm">
          <Loader2 size={16} className="animate-spin" /> Loading…
        </div>
      )}
      {error && <p className="text-sm text-red-500">Couldn&rsquo;t load assignments: {error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <p className="text-sm text-slatesoft dark:text-white/50">No assignments yet.</p>
      )}

      {filtered.length > 0 && (
        <div className="rounded-2xl border border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.04] divide-y divide-navy/5 dark:divide-white/5 overflow-hidden">
          {filtered.map((a) => (
            <div key={a.id} className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4">
              <div className="w-9 h-9 grid place-items-center rounded-lg bg-royal/10 dark:bg-accent/15 text-royal dark:text-accent shrink-0">
                <FileCheck2 size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-navy dark:text-white truncate">{a.title}</p>
                <p className="text-xs text-slatesoft dark:text-white/50 truncate">
                  {a.courses?.title || 'Unknown course'}
                  {a.due_date ? ` · due ${new Date(a.due_date).toLocaleDateString()}` : ''}
                  {a.max_score ? ` · out of ${a.max_score}` : ''}
                </p>
              </div>
              {canWrite && (
                <div className="flex flex-wrap gap-2 shrink-0">
                  <ActionBtn icon={FileCheck2} label="Submissions" onClick={() => setGrading(a)} />
                  <ActionBtn icon={Pencil} label="Edit" onClick={() => setEditing(a)} />
                  <ActionBtn icon={Trash2} label="Delete" onClick={() => deleteAssignment(a.id)} danger />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {editing && (
        <AssignmentModal
          assignment={editing}
          courses={courses}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            fetchAssignments();
          }}
        />
      )}

      {grading && <SubmissionsModal assignment={grading} onClose={() => setGrading(null)} />}
    </>
  );
}

function AssignmentModal({ assignment, courses, onClose, onSaved }) {
  const isNew = !assignment.id;
  const [form, setForm] = useState({
    course_id: assignment.course_id || '',
    title: assignment.title || '',
    description: assignment.description || '',
    due_date: assignment.due_date ? assignment.due_date.slice(0, 10) : '',
    max_score: assignment.max_score ?? '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const dialogRef = useFocusTrap(onClose);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.course_id || !form.title.trim()) return;
    setSubmitting(true);
    setError('');
    const payload = {
      course_id: form.course_id,
      title: form.title.trim(),
      description: form.description.trim() || null,
      due_date: form.due_date ? new Date(form.due_date).toISOString() : null,
      max_score: form.max_score === '' ? null : parseInt(form.max_score, 10),
    };
    const { error: err } = isNew
      ? await supabase.from('assignments').insert(payload)
      : await supabase.from('assignments').update(payload).eq('id', assignment.id);
    setSubmitting(false);
    if (err) setError(err.message);
    else onSaved();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="assignment-modal-title"
        className="w-full max-w-md rounded-3xl bg-white dark:bg-navy p-7 shadow-card-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 id="assignment-modal-title" className="font-display font-bold text-lg text-navy dark:text-white">
            {isNew ? 'Add Assignment' : 'Edit Assignment'}
          </h2>
          <button onClick={onClose} aria-label="Close" className="text-slatesoft dark:text-white/50 hover:text-navy dark:hover:text-white">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Course">
            <select required value={form.course_id} onChange={(e) => setForm((f) => ({ ...f, course_id: e.target.value }))} className="modal-input">
              <option value="" disabled>
                Select a course
              </option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Title">
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="modal-input"
              placeholder="Build a REST API"
            />
          </Field>
          <Field label="Description">
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="modal-input resize-none"
              placeholder="What the student needs to submit and how it'll be graded."
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Due date">
              <input type="date" value={form.due_date} onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))} className="modal-input" />
            </Field>
            <Field label="Max score">
              <input
                type="number"
                min="1"
                value={form.max_score}
                onChange={(e) => setForm((f) => ({ ...f, max_score: e.target.value }))}
                className="modal-input"
                placeholder="100"
              />
            </Field>
          </div>
          {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="btn-glow w-full bg-grad-primary text-white font-semibold px-6 py-3 rounded-xl hover:brightness-110 transition-all disabled:opacity-60"
          >
            {submitting ? 'Saving…' : isNew ? 'Add Assignment' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

function SubmissionsModal({ assignment, onClose }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [gradingId, setGradingId] = useState(null);
  const [gradeDraft, setGradeDraft] = useState({});
  const [gradeError, setGradeError] = useState('');
  const dialogRef = useFocusTrap(onClose);

  useEffect(() => {
    supabase
      .from('assignment_submissions')
      .select('*, profiles!student_id(full_name, email)')
      .eq('assignment_id', assignment.id)
      .order('submitted_at', { ascending: false })
      .then(({ data, error: err }) => {
        if (err) setLoadError(err.message);
        else setSubmissions(data ?? []);
        setLoading(false);
      });
  }, [assignment.id]);

  async function saveGrade(sub) {
    const draft = gradeDraft[sub.id] || {};
    setGradingId(sub.id);
    setGradeError('');
    const {
      data: { user },
    } = await supabase.auth.getUser();
    // A grade of 0 is meaningful and distinct from "leave the existing
    // grade alone" — parseInt(...)||null would collapse a real 0 to null,
    // so this checks Number.isNaN explicitly instead.
    const parsedGrade = draft.grade !== undefined ? parseInt(draft.grade, 10) : NaN;
    const grade = draft.grade !== undefined && !Number.isNaN(parsedGrade) ? parsedGrade : sub.grade;
    const { error } = await supabase
      .from('assignment_submissions')
      .update({
        status: 'graded',
        grade,
        feedback: draft.feedback !== undefined ? draft.feedback : sub.feedback,
        graded_by: user?.id,
        graded_at: new Date().toISOString(),
      })
      .eq('id', sub.id);
    setGradingId(null);
    if (error) {
      setGradeError(`Couldn't save this grade: ${error.message}`);
      return;
    }
    setSubmissions((list) =>
      list.map((s) => (s.id === sub.id ? { ...s, status: 'graded', grade, feedback: draft.feedback ?? s.feedback } : s))
    );
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="submissions-modal-title"
        className="w-full max-w-lg rounded-3xl bg-white dark:bg-navy p-7 shadow-card-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 id="submissions-modal-title" className="font-display font-bold text-lg text-navy dark:text-white">
            {assignment.title} — Submissions
          </h2>
          <button onClick={onClose} aria-label="Close" className="text-slatesoft dark:text-white/50 hover:text-navy dark:hover:text-white">
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-slatesoft dark:text-white/50 text-sm">
            <Loader2 size={16} className="animate-spin" /> Loading…
          </div>
        ) : loadError ? (
          <p role="alert" className="text-sm text-red-500">Couldn&rsquo;t load submissions: {loadError}</p>
        ) : submissions.length === 0 ? (
          <p className="text-sm text-slatesoft dark:text-white/50">No submissions yet.</p>
        ) : (
          <div className="space-y-4">
            {gradeError && <p role="alert" className="text-sm text-red-500">{gradeError}</p>}
            {submissions.map((s) => (
              <div key={s.id} className="rounded-xl border border-navy/8 dark:border-white/10 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-navy dark:text-white">{s.profiles?.full_name || s.profiles?.email}</p>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold ${
                      s.status === 'graded' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-gold/15 text-amber-600 dark:text-gold'
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
                {s.submission_text && <p className="text-sm text-slatesoft dark:text-white/60 whitespace-pre-wrap mb-2">{s.submission_text}</p>}
                {s.submission_url && (
                  <a
                    href={s.submission_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-royal dark:text-accent hover:underline mb-2"
                  >
                    <ExternalLink size={12} /> View submission link
                  </a>
                )}
                <div className="flex gap-2 items-end mt-2">
                  <div className="w-24">
                    <label htmlFor={`grade-${s.id}`} className="block text-[11px] font-semibold text-navy dark:text-white mb-1">Grade</label>
                    <input
                      id={`grade-${s.id}`}
                      type="number"
                      defaultValue={s.grade ?? ''}
                      onChange={(e) => setGradeDraft((d) => ({ ...d, [s.id]: { ...d[s.id], grade: e.target.value } }))}
                      className="modal-input py-1.5 text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor={`feedback-${s.id}`} className="block text-[11px] font-semibold text-navy dark:text-white mb-1">Feedback</label>
                    <input
                      id={`feedback-${s.id}`}
                      type="text"
                      defaultValue={s.feedback ?? ''}
                      onChange={(e) => setGradeDraft((d) => ({ ...d, [s.id]: { ...d[s.id], feedback: e.target.value } }))}
                      className="modal-input py-1.5 text-sm"
                    />
                  </div>
                  <button
                    onClick={() => saveGrade(s)}
                    disabled={gradingId === s.id}
                    className="px-3 py-2 rounded-lg bg-grad-primary text-white text-xs font-semibold hover:brightness-110 transition-all disabled:opacity-50 shrink-0"
                  >
                    {gradingId === s.id ? '…' : 'Save'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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

function ActionBtn({ icon: Icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
        danger
          ? 'border-red-500/30 text-red-500 hover:bg-red-500/10'
          : 'border-navy/10 dark:border-white/15 text-navy dark:text-white hover:border-royal/40'
      }`}
    >
      <Icon size={13} /> {label}
    </button>
  );
}

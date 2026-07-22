import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, Plus, X, Loader2, Search, Pencil, Trash2, Users, UserPlus, UserMinus } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { supabase } from '../lib/supabaseClient.js';

const MODE_LABELS = { online: 'Online', offline: 'Offline', hybrid: 'Hybrid' };
const EMPTY_FORM = { course_id: '', name: '', start_date: '', end_date: '', mode: 'online', capacity: '' };

function fmtDate(d) {
  return d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
}

export default function AdminBatches() {
  const { role: myRole } = useAuth();
  const isAdmin = myRole === 'admin';

  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollCounts, setEnrollCounts] = useState({}); // batch_id -> count
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [managingEnrollment, setManagingEnrollment] = useState(null); // batch row, or null
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    supabase.from('courses').select('id, title').order('title', { ascending: true }).then(({ data }) => setCourses(data ?? []));
    fetchBatches();
  }, []);

  function fetchBatches() {
    setLoading(true);
    supabase
      .from('batches')
      .select('*, courses(title)')
      .order('start_date', { ascending: false })
      .then(async ({ data, error: err }) => {
        if (err) {
          setError(err.message);
          setLoading(false);
          return;
        }
        setBatches(data ?? []);
        const { data: enrollments } = await supabase.from('batch_enrollments').select('batch_id');
        const counts = {};
        (enrollments ?? []).forEach((e) => {
          counts[e.batch_id] = (counts[e.batch_id] || 0) + 1;
        });
        setEnrollCounts(counts);
        setLoading(false);
      });
  }

  async function deleteBatch(id) {
    if (!window.confirm('Delete this batch? Blocked if any students are enrolled — remove them from the batch first.')) return;
    setUpdatingId(id);
    const { error: err } = await supabase.from('batches').delete().eq('id', id);
    if (!err) setBatches((list) => list.filter((b) => b.id !== id));
    else window.alert(`Couldn't delete this batch: ${err.message}`);
    setUpdatingId(null);
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return batches;
    return batches.filter((b) => b.name?.toLowerCase().includes(q) || b.courses?.title?.toLowerCase().includes(q));
  }, [batches, search]);

  return (
    <>
      {!isAdmin && (
        <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-800 dark:text-amber-200 mb-8">
          You're signed in as faculty — you can view batches, but only admins can add, edit,
          remove, or enroll students.
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slatesoft dark:text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search batch name, course…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-navy/10 dark:border-white/15 bg-white dark:bg-white/5 text-navy dark:text-white text-sm placeholder:text-slatesoft dark:placeholder:text-white/55 focus:outline-hidden focus:border-royal/50"
          />
        </div>
        {isAdmin && (
          <button
            onClick={() => setEditing({ ...EMPTY_FORM })}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-grad-primary text-white text-sm font-semibold hover:brightness-110 transition-all shrink-0"
          >
            <Plus size={15} /> Add Batch
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-slatesoft dark:text-white/50 text-sm">
          <Loader2 size={16} className="animate-spin" /> Loading…
        </div>
      )}
      {error && <p className="text-sm text-red-500">Couldn&rsquo;t load batches: {error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <p className="text-sm text-slatesoft dark:text-white/50">
          {batches.length === 0 ? 'No batches yet — add one to start scheduling cohorts.' : 'No batches match.'}
        </p>
      )}

      {filtered.length > 0 && (
        <div className="rounded-2xl border border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.04] divide-y divide-navy/5 dark:divide-white/5 overflow-hidden">
          {filtered.map((b) => {
            const enrolled = enrollCounts[b.id] || 0;
            const seatsLeft = b.capacity != null ? Math.max(b.capacity - enrolled, 0) : null;
            return (
              <div key={b.id} className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4">
                <div className="w-9 h-9 grid place-items-center rounded-lg bg-royal/10 dark:bg-accent/15 text-royal dark:text-accent shrink-0">
                  <CalendarDays size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-navy dark:text-white truncate">
                    {b.name} <span className="text-slatesoft dark:text-white/40 font-normal">· {b.courses?.title || 'Unknown course'}</span>
                  </p>
                  <p className="text-xs text-slatesoft dark:text-white/50 truncate">
                    {fmtDate(b.start_date)} – {fmtDate(b.end_date)} · {MODE_LABELS[b.mode] || b.mode} ·{' '}
                    {enrolled} enrolled{seatsLeft != null ? ` · ${seatsLeft} seats left` : ''}
                  </p>
                </div>
                {isAdmin && (
                  <div className="flex flex-wrap gap-2 shrink-0">
                    <ActionBtn icon={Users} label="Enrollments" onClick={() => setManagingEnrollment(b)} disabled={updatingId === b.id} />
                    <ActionBtn icon={Pencil} label="Edit" onClick={() => setEditing(b)} disabled={updatingId === b.id} />
                    <ActionBtn icon={Trash2} label="Delete" onClick={() => deleteBatch(b.id)} disabled={updatingId === b.id} danger />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {editing && (
        <BatchModal
          batch={editing}
          courses={courses}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            fetchBatches();
          }}
        />
      )}

      {managingEnrollment && (
        <EnrollmentModal
          batch={managingEnrollment}
          onClose={() => {
            setManagingEnrollment(null);
            fetchBatches();
          }}
        />
      )}
    </>
  );
}

function BatchModal({ batch, courses, onClose, onSaved }) {
  const isNew = !batch.id;
  const [form, setForm] = useState({
    course_id: batch.course_id || '',
    name: batch.name || '',
    start_date: batch.start_date || '',
    end_date: batch.end_date || '',
    mode: batch.mode || 'online',
    capacity: batch.capacity ?? '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const dialogRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    previouslyFocused.current = document.activeElement;
    const focusable = dialogRef.current.querySelectorAll('input, select, button, [href], [tabindex]:not([tabindex="-1"])');
    focusable[0]?.focus();
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused.current?.focus?.();
    };
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.course_id || !form.name.trim() || !form.start_date) return;
    setSubmitting(true);
    setError('');
    const payload = {
      course_id: form.course_id,
      name: form.name.trim(),
      start_date: form.start_date,
      end_date: form.end_date || null,
      mode: form.mode,
      capacity: form.capacity === '' ? null : parseInt(form.capacity, 10),
    };
    const { error: err } = isNew
      ? await supabase.from('batches').insert(payload)
      : await supabase.from('batches').update(payload).eq('id', batch.id);
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
        aria-labelledby="batch-modal-title"
        className="w-full max-w-md rounded-3xl bg-white dark:bg-navy p-7 shadow-card-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 id="batch-modal-title" className="font-display font-bold text-lg text-navy dark:text-white">
            {isNew ? 'Add Batch' : 'Edit Batch'}
          </h2>
          <button onClick={onClose} aria-label="Close" className="text-slatesoft dark:text-white/50 hover:text-navy dark:hover:text-white">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Course">
            <select
              required
              value={form.course_id}
              onChange={(e) => setForm((f) => ({ ...f, course_id: e.target.value }))}
              className="modal-input"
            >
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
          <Field label="Batch name">
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="modal-input"
              placeholder="Feb 2026 Batch"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start date">
              <input
                type="date"
                required
                value={form.start_date}
                onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))}
                className="modal-input"
              />
            </Field>
            <Field label="End date">
              <input
                type="date"
                value={form.end_date}
                onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))}
                className="modal-input"
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Mode">
              <select value={form.mode} onChange={(e) => setForm((f) => ({ ...f, mode: e.target.value }))} className="modal-input">
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </Field>
            <Field label="Capacity">
              <input
                type="number"
                min="1"
                value={form.capacity}
                onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
                className="modal-input"
                placeholder="Unlimited"
              />
            </Field>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="btn-glow w-full bg-grad-primary text-white font-semibold px-6 py-3 rounded-xl hover:brightness-110 transition-all disabled:opacity-60"
          >
            {submitting ? 'Saving…' : isNew ? 'Add Batch' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

function EnrollmentModal({ batch, onClose }) {
  const [enrolled, setEnrolled] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');
  const dialogRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    previouslyFocused.current = document.activeElement;
    const focusable = dialogRef.current.querySelectorAll('input, select, button, [href], [tabindex]:not([tabindex="-1"])');
    focusable[0]?.focus();
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused.current?.focus?.();
    };
  }, [onClose]);

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function fetchAll() {
    setLoading(true);
    Promise.all([
      supabase
        .from('batch_enrollments')
        .select('id, student_id, profiles!student_id(full_name, email)')
        .eq('batch_id', batch.id),
      supabase.from('profiles').select('id, full_name, email').eq('role', 'student').order('full_name', { ascending: true }),
    ]).then(([enrollRes, studentsRes]) => {
      if (enrollRes.error) setError(enrollRes.error.message);
      setEnrolled(enrollRes.data ?? []);
      setAllStudents(studentsRes.data ?? []);
      setLoading(false);
    });
  }

  const enrolledIds = new Set(enrolled.map((e) => e.student_id));
  const available = allStudents.filter((s) => !enrolledIds.has(s.id));

  async function addStudent() {
    if (!addingId) return;
    setBusyId(addingId);
    setError('');
    const { error: err } = await supabase.from('batch_enrollments').insert({ batch_id: batch.id, student_id: addingId });
    setBusyId(null);
    if (err) setError(err.message);
    else {
      setAddingId('');
      fetchAll();
    }
  }

  async function removeStudent(enrollmentId) {
    setBusyId(enrollmentId);
    const { error: err } = await supabase.from('batch_enrollments').delete().eq('id', enrollmentId);
    setBusyId(null);
    if (err) setError(err.message);
    else fetchAll();
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="enrollment-modal-title"
        className="w-full max-w-md rounded-3xl bg-white dark:bg-navy p-7 shadow-card-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 id="enrollment-modal-title" className="font-display font-bold text-lg text-navy dark:text-white">
            {batch.name} — Enrollments
          </h2>
          <button onClick={onClose} aria-label="Close" className="text-slatesoft dark:text-white/50 hover:text-navy dark:hover:text-white">
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-slatesoft dark:text-white/50 text-sm">
            <Loader2 size={16} className="animate-spin" /> Loading…
          </div>
        ) : (
          <>
            <div className="flex gap-2 mb-4">
              <select value={addingId} onChange={(e) => setAddingId(e.target.value)} className="modal-input flex-1">
                <option value="">Select a student to enroll…</option>
                {available.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.full_name || s.email} ({s.email})
                  </option>
                ))}
              </select>
              <button
                onClick={addStudent}
                disabled={!addingId || busyId === addingId}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-grad-primary text-white text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-50 shrink-0"
              >
                <UserPlus size={15} /> Add
              </button>
            </div>

            {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

            {enrolled.length === 0 ? (
              <p className="text-sm text-slatesoft dark:text-white/50">No students enrolled yet.</p>
            ) : (
              <div className="rounded-xl border border-navy/8 dark:border-white/10 divide-y divide-navy/5 dark:divide-white/5 overflow-hidden">
                {enrolled.map((e) => (
                  <div key={e.id} className="flex items-center gap-3 px-4 py-2.5">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-navy dark:text-white truncate">
                        {e.profiles?.full_name || e.profiles?.email || 'Unknown'}
                      </p>
                    </div>
                    <button
                      onClick={() => removeStudent(e.id)}
                      disabled={busyId === e.id}
                      title="Remove from batch"
                      className="text-slatesoft dark:text-white/40 hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      <UserMinus size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-navy dark:text-white mb-1.5">{label}</label>
      {children}
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

import React, { useEffect, useMemo, useState } from 'react';
import { ClipboardCheck, Plus, Loader2, Check, X as XIcon, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { supabase } from '../lib/supabaseClient.js';

const STATUS_OPTIONS = [
  { value: 'present', label: 'Present', icon: Check, color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' },
  { value: 'late', label: 'Late', icon: Clock, color: 'bg-gold/15 text-amber-600 dark:text-gold border-gold/30' },
  { value: 'absent', label: 'Absent', icon: XIcon, color: 'bg-red-500/10 text-red-600 dark:text-red-300 border-red-500/30' },
];

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

export default function AdminAttendance() {
  const { role: myRole } = useAuth();
  const canWrite = myRole === 'admin' || myRole === 'faculty';

  const [batches, setBatches] = useState([]);
  const [batchId, setBatchId] = useState('');
  const [sessions, setSessions] = useState([]);
  const [sessionId, setSessionId] = useState('');
  const [roster, setRoster] = useState([]); // [{student_id, full_name, email, status}]
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [newSessionDate, setNewSessionDate] = useState('');
  const [newSessionTopic, setNewSessionTopic] = useState('');
  const [creatingSession, setCreatingSession] = useState(false);

  useEffect(() => {
    supabase
      .from('batches')
      .select('id, name, courses(title)')
      .order('start_date', { ascending: false })
      .then(({ data }) => setBatches(data ?? []));
  }, []);

  useEffect(() => {
    if (!batchId) {
      setSessions([]);
      setSessionId('');
      return;
    }
    fetchSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchId]);

  useEffect(() => {
    if (!sessionId) {
      setRoster([]);
      return;
    }
    fetchRoster();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  function fetchSessions() {
    supabase
      .from('attendance_sessions')
      .select('id, session_date, topic')
      .eq('batch_id', batchId)
      .order('session_date', { ascending: false })
      .then(({ data }) => {
        setSessions(data ?? []);
        setSessionId(data?.[0]?.id || '');
      });
  }

  async function fetchRoster() {
    setLoading(true);
    setError('');
    const [{ data: enrollments, error: enrollErr }, { data: records }] = await Promise.all([
      supabase.from('batch_enrollments').select('student_id, profiles!student_id(full_name, email)').eq('batch_id', batchId),
      supabase.from('attendance_records').select('student_id, status').eq('session_id', sessionId),
    ]);
    if (enrollErr) {
      setError(enrollErr.message);
      setLoading(false);
      return;
    }
    const statusByStudent = {};
    (records ?? []).forEach((r) => {
      statusByStudent[r.student_id] = r.status;
    });
    setRoster(
      (enrollments ?? []).map((e) => ({
        student_id: e.student_id,
        name: e.profiles?.full_name || e.profiles?.email || 'Unknown',
        status: statusByStudent[e.student_id] || null,
      }))
    );
    setLoading(false);
  }

  async function markStatus(studentId, status) {
    setRoster((list) => list.map((r) => (r.student_id === studentId ? { ...r, status } : r)));
    setSaving(true);
    const { error: err } = await supabase
      .from('attendance_records')
      .upsert({ session_id: sessionId, student_id: studentId, status }, { onConflict: 'session_id,student_id' });
    setSaving(false);
    if (err) setError(err.message);
  }

  async function createSession(e) {
    e.preventDefault();
    if (!newSessionDate) return;
    setCreatingSession(true);
    setError('');
    const { data, error: err } = await supabase
      .from('attendance_sessions')
      .insert({ batch_id: batchId, session_date: newSessionDate, topic: newSessionTopic.trim() || null })
      .select()
      .single();
    setCreatingSession(false);
    if (err) {
      setError(err.message);
      return;
    }
    setNewSessionDate('');
    setNewSessionTopic('');
    fetchSessions();
    setSessionId(data.id);
  }

  const presentCount = useMemo(() => roster.filter((r) => r.status === 'present' || r.status === 'late').length, [roster]);

  return (
    <>
      <h1 className="font-display font-bold text-2xl text-navy dark:text-white mb-5 flex items-center gap-2">
        <ClipboardCheck size={22} /> Attendance
      </h1>
      {!canWrite && (
        <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-800 dark:text-amber-200 mb-6">
          You don&rsquo;t have permission to mark attendance.
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        <div>
          <label className="block text-xs font-semibold text-navy dark:text-white mb-1.5">Batch</label>
          <select value={batchId} onChange={(e) => setBatchId(e.target.value)} className="modal-input">
            <option value="">Select a batch…</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} · {b.courses?.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-navy dark:text-white mb-1.5">Session</label>
          <select value={sessionId} onChange={(e) => setSessionId(e.target.value)} disabled={!batchId || sessions.length === 0} className="modal-input disabled:opacity-50">
            {sessions.length === 0 && <option value="">No sessions yet</option>}
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {fmtDate(s.session_date)}
                {s.topic ? ` — ${s.topic}` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {batchId && canWrite && (
        <form onSubmit={createSession} className="flex flex-col sm:flex-row gap-2 mb-6 items-end">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-navy dark:text-white mb-1.5">New session date</label>
            <input type="date" required value={newSessionDate} onChange={(e) => setNewSessionDate(e.target.value)} className="modal-input" />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-navy dark:text-white mb-1.5">Topic (optional)</label>
            <input
              type="text"
              value={newSessionTopic}
              onChange={(e) => setNewSessionTopic(e.target.value)}
              placeholder="e.g. React hooks"
              className="modal-input"
            />
          </div>
          <button
            type="submit"
            disabled={creatingSession}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-grad-primary text-white text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-50 shrink-0"
          >
            <Plus size={15} /> New Session
          </button>
        </form>
      )}

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      {!batchId && <p className="text-sm text-slatesoft dark:text-white/50">Select a batch to take attendance.</p>}
      {batchId && sessions.length === 0 && !error && (
        <p className="text-sm text-slatesoft dark:text-white/50">No sessions yet for this batch — add one above.</p>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-slatesoft dark:text-white/50 text-sm">
          <Loader2 size={16} className="animate-spin" /> Loading roster…
        </div>
      )}

      {!loading && sessionId && roster.length > 0 && (
        <>
          <p className="text-xs text-slatesoft dark:text-white/50 mb-3">
            {presentCount}/{roster.length} present {saving && '· saving…'}
          </p>
          <div className="rounded-2xl border border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.04] divide-y divide-navy/5 dark:divide-white/5 overflow-hidden">
            {roster.map((r) => (
              <div key={r.student_id} className="flex items-center gap-3 px-5 py-3.5">
                <p className="text-sm font-medium text-navy dark:text-white flex-1 truncate">{r.name}</p>
                <div className="flex gap-1.5">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={!canWrite}
                      onClick={() => markStatus(r.student_id, opt.value)}
                      title={opt.label}
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors disabled:opacity-40 ${
                        r.status === opt.value ? opt.color : 'border-navy/10 dark:border-white/15 text-slatesoft dark:text-white/40'
                      }`}
                    >
                      <opt.icon size={12} /> {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {!loading && sessionId && roster.length === 0 && (
        <p className="text-sm text-slatesoft dark:text-white/50">No students enrolled in this batch yet — enroll them from Admin → Batches.</p>
      )}
    </>
  );
}

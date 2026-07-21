import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Award, Plus, X, Loader2, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { supabase } from '../lib/supabaseClient.js';

function generateCertificateNumber() {
  const year = new Date().getFullYear();
  // Was Math.floor(Math.random() * 900000 + 100000) — only ~900,000 possible
  // values per year, generated with a non-cryptographic PRNG, brute-forceable
  // against the public verification endpoint within a year's keyspace.
  // crypto.randomUUID() gives a cryptographically random source; 10 hex
  // chars is 16^10 (~1.1 * 10^12) possible values per year.
  const rand = crypto.randomUUID().replace(/-/g, '').slice(0, 10).toUpperCase();
  return `TS-${year}-${rand}`;
}

export default function AdminCertificates() {
  const { role: myRole, session } = useAuth();
  const isAdmin = myRole === 'admin';

  const [certificates, setCertificates] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showIssue, setShowIssue] = useState(false);

  useEffect(() => {
    fetchCertificates();
    if (isAdmin) fetchStudents();
  }, [isAdmin]);

  function fetchCertificates() {
    setLoading(true);
    supabase
      .from('certificates')
      .select('*, profiles!student_id(full_name, email)')
      .order('issued_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setCertificates(data ?? []);
        setLoading(false);
      });
  }

  function fetchStudents() {
    supabase
      .from('profiles')
      .select('id, full_name, email')
      .eq('role', 'student')
      .order('full_name', { ascending: true })
      .then(({ data }) => setStudents(data ?? []));
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return certificates;
    return certificates.filter(
      (c) =>
        c.course_title?.toLowerCase().includes(q) ||
        c.certificate_number?.toLowerCase().includes(q) ||
        c.student_name?.toLowerCase().includes(q)
    );
  }, [certificates, search]);

  return (
    <>
      {!isAdmin && (
        <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-800 dark:text-amber-200 mb-8">
          You're signed in as faculty — you can view issued certificates, but only admins can issue
          new ones.
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slatesoft dark:text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student, course, certificate number…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-navy/10 dark:border-white/15 bg-white dark:bg-white/5 text-navy dark:text-white text-sm placeholder:text-slatesoft dark:placeholder:text-white/55 focus:outline-none focus:border-royal/50"
          />
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowIssue(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-grad-primary text-white text-sm font-semibold hover:brightness-110 transition-all shrink-0"
          >
            <Plus size={15} /> Issue Certificate
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-slatesoft dark:text-white/50 text-sm">
          <Loader2 size={16} className="animate-spin" /> Loading…
        </div>
      )}
      {error && <p className="text-sm text-red-500">Couldn&rsquo;t load certificates: {error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <p className="text-sm text-slatesoft dark:text-white/50">No certificates issued yet.</p>
      )}

      {filtered.length > 0 && (
        <div className="rounded-2xl border border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.04] divide-y divide-navy/5 dark:divide-white/5 overflow-hidden">
          {filtered.map((c) => (
            <div key={c.id} className="flex items-center gap-3 px-5 py-4">
              <div className="w-9 h-9 grid place-items-center rounded-lg bg-gold/15 text-amber-600 dark:text-gold shrink-0">
                <Award size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-navy dark:text-white truncate">
                  {c.student_name || 'Unknown student'}
                </p>
                <p className="text-xs text-slatesoft dark:text-white/50 truncate">
                  {c.course_title} · {c.profiles?.email || '—'}
                </p>
              </div>
              <span className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-royal/10 dark:bg-accent/15 text-royal dark:text-accent">
                {c.certificate_number}
              </span>
              <span className="hidden sm:block text-xs text-slatesoft dark:text-white/40 shrink-0 w-24 text-right">
                {new Date(c.issued_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {showIssue && (
        <IssueCertificateModal
          students={students}
          issuerId={session?.user?.id}
          onClose={() => setShowIssue(false)}
          onIssued={() => {
            setShowIssue(false);
            fetchCertificates();
          }}
        />
      )}
    </>
  );
}

function IssueCertificateModal({ students, issuerId, onClose, onIssued }) {
  const [studentId, setStudentId] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId || !courseTitle.trim()) return;
    setSubmitting(true);
    setError('');
    // Denormalized at issuance time, same treatment already given to
    // course_title: a certificate is a proof-of-completion record, so its
    // student_name must stay fixed even if that student later edits their
    // own profile's full_name.
    const student = students.find((s) => s.id === studentId);
    const { error } = await supabase.from('certificates').insert({
      student_id: studentId,
      student_name: student?.full_name || student?.email || 'Unknown',
      course_title: courseTitle.trim(),
      certificate_number: generateCertificateNumber(),
      issued_by: issuerId,
    });
    setSubmitting(false);
    if (error) setError(error.message);
    else onIssued();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="issue-cert-title"
        className="w-full max-w-md rounded-3xl bg-white dark:bg-navy p-7 shadow-card-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 id="issue-cert-title" className="font-display font-bold text-lg text-navy dark:text-white">
            Issue Certificate
          </h2>
          <button onClick={onClose} aria-label="Close" className="text-slatesoft dark:text-white/50 hover:text-navy dark:hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-navy dark:text-white mb-1.5">Student</label>
            <select
              required
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="modal-input"
            >
              <option value="" disabled>
                Select a student
              </option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.full_name || s.email} ({s.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy dark:text-white mb-1.5">Course / program title</label>
            <input
              type="text"
              required
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              className="modal-input"
              placeholder="Full Stack Web Development"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="btn-glow w-full bg-grad-primary text-white font-semibold px-6 py-3 rounded-xl hover:brightness-110 transition-all disabled:opacity-60"
          >
            {submitting ? 'Issuing…' : 'Issue Certificate'}
          </button>
        </form>
      </div>
    </div>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User, Mail, Phone, Save, Loader2, Inbox, BookOpen, Award, Printer, X } from 'lucide-react';
import Logo from '../components/Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { supabase } from '../lib/supabaseClient.js';

export default function StudentDashboard() {
  const { session, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ full_name: '', phone: '' });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [enquiries, setEnquiries] = useState([]);
  const [loadingEnquiries, setLoadingEnquiries] = useState(true);

  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const [certificates, setCertificates] = useState([]);
  const [loadingCertificates, setLoadingCertificates] = useState(true);
  const [viewingCert, setViewingCert] = useState(null);

  useEffect(() => {
    if (!session?.user?.id) return;
    supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setProfile(data);
          setForm({ full_name: data.full_name || '', phone: data.phone || '' });
        }
        setLoadingProfile(false);
      });

    supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setEnquiries(data ?? []);
        setLoadingEnquiries(false);
      });

    supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setCourses(data ?? []);
        setLoadingCourses(false);
      });

    supabase
      .from('certificates')
      .select('*')
      .eq('student_id', session.user.id)
      .order('issued_at', { ascending: false })
      .then(({ data }) => {
        setCertificates(data ?? []);
        setLoadingCertificates(false);
      });
  }, [session?.user?.id]);

  async function saveProfile(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: form.full_name, phone: form.phone })
      .eq('id', session.user.id);
    setSaving(false);
    if (!error) {
      setProfile((p) => ({ ...p, ...form }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  }

  return (
    <div className="min-h-screen bg-mist dark:bg-navy-deep">
      <header className="bg-white dark:bg-navy border-b border-navy/8 dark:border-white/10">
        <div className="container-px mx-auto max-w-8xl h-20 flex items-center justify-between">
          <Logo />
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 text-sm font-semibold text-navy dark:text-white hover:text-royal dark:hover:text-accent transition-colors"
          >
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </header>

      <main className="container-px mx-auto max-w-8xl py-12">
        <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-800 dark:text-amber-200 mb-8">
          Profile, Courses and Certificates are real below. Assignments, Downloads, Attendance, and
          Notifications from CLAUDE.md's full spec aren't built yet. Progress <em>is</em> tracked —
          open a course's Continue Learning link to see per-lesson completion.
        </div>

        <h1 className="font-display font-bold text-2xl text-navy dark:text-white mb-1">
          Hi{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''} 👋
        </h1>
        <p className="text-sm text-slatesoft dark:text-white/50 mb-8">{session?.user?.email}</p>

        {/* Profile */}
        <div className="rounded-2xl border border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.04] p-6 mb-6">
          <h2 className="text-sm font-semibold text-navy dark:text-white mb-4 flex items-center gap-2">
            <User size={15} /> Your profile
          </h2>
          {loadingProfile ? (
            <div className="flex items-center gap-2 text-slatesoft dark:text-white/50 text-sm">
              <Loader2 size={15} className="animate-spin" /> Loading…
            </div>
          ) : (
            <form onSubmit={saveProfile} className="space-y-4">
              <div>
                <label htmlFor="student-fullname" className="block text-xs font-semibold text-navy dark:text-white mb-1.5">
                  Full name
                </label>
                <input
                  id="student-fullname"
                  type="text"
                  value={form.full_name}
                  onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-navy/10 dark:border-white/15 bg-mist dark:bg-white/5 text-navy dark:text-white text-sm focus:border-royal/50"
                />
              </div>
              <div>
                <label htmlFor="student-email" className="block text-xs font-semibold text-navy dark:text-white mb-1.5 flex items-center gap-1.5">
                  <Mail size={12} /> Email
                </label>
                <input
                  id="student-email"
                  type="email"
                  value={session?.user?.email || ''}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl border border-navy/10 dark:border-white/15 bg-mist/60 dark:bg-white/[0.03] text-slatesoft dark:text-white/40 text-sm"
                />
                <p className="text-[11px] text-slatesoft dark:text-white/35 mt-1">
                  Contact A Teknon Solutions to change the email on your account.
                </p>
              </div>
              <div>
                <label htmlFor="student-phone" className="block text-xs font-semibold text-navy dark:text-white mb-1.5 flex items-center gap-1.5">
                  <Phone size={12} /> Phone
                </label>
                <input
                  id="student-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-navy/10 dark:border-white/15 bg-mist dark:bg-white/5 text-navy dark:text-white text-sm focus:border-royal/50"
                  placeholder="+91 00000 00000"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-grad-primary text-white text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-60"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {saved ? 'Saved!' : saving ? 'Saving…' : 'Save changes'}
              </button>
            </form>
          )}
        </div>

        {/* Course catalog */}
        <div className="rounded-2xl border border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.04] p-6 mb-6">
          <h2 className="text-sm font-semibold text-navy dark:text-white mb-4 flex items-center gap-2">
            <BookOpen size={15} /> Courses
          </h2>
          {loadingCourses ? (
            <div className="flex items-center gap-2 text-slatesoft dark:text-white/50 text-sm">
              <Loader2 size={15} className="animate-spin" /> Loading…
            </div>
          ) : courses.length === 0 ? (
            <p className="text-sm text-slatesoft dark:text-white/50">No courses published yet.</p>
          ) : (
            <div className="space-y-3">
              {courses.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-3 border-b border-navy/5 dark:border-white/5 pb-3 last:border-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-navy dark:text-white truncate">{c.title}</p>
                    {c.description && (
                      <p className="text-xs text-slatesoft dark:text-white/50 mt-0.5 truncate">{c.description}</p>
                    )}
                    <p className="text-xs text-slatesoft dark:text-white/40 mt-1">
                      {c.category || '—'} {c.duration ? `· ${c.duration}` : ''} {c.price ? `· ${c.price}` : ''}
                    </p>
                  </div>
                  <Link
                    to={`/student/learn/${c.id}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-grad-primary text-white hover:brightness-110 transition-all shrink-0"
                  >
                    Continue Learning
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Certificates */}
        <div className="rounded-2xl border border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.04] p-6 mb-6">
          <h2 className="text-sm font-semibold text-navy dark:text-white mb-4 flex items-center gap-2">
            <Award size={15} /> Your certificates
          </h2>
          {loadingCertificates ? (
            <div className="flex items-center gap-2 text-slatesoft dark:text-white/50 text-sm">
              <Loader2 size={15} className="animate-spin" /> Loading…
            </div>
          ) : certificates.length === 0 ? (
            <p className="text-sm text-slatesoft dark:text-white/50">
              No certificates issued yet — these appear here once a program is completed.
            </p>
          ) : (
            <div className="space-y-3">
              {certificates.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-3 border-b border-navy/5 dark:border-white/5 pb-3 last:border-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-navy dark:text-white truncate">{c.course_title}</p>
                    <p className="text-xs text-slatesoft dark:text-white/40">
                      {c.certificate_number} · {new Date(c.issued_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setViewingCert(c)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-navy/10 dark:border-white/15 text-navy dark:text-white hover:border-royal/40 transition-colors shrink-0"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Their own enquiry history */}
        <div className="rounded-2xl border border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.04] p-6">
          <h2 className="text-sm font-semibold text-navy dark:text-white mb-4 flex items-center gap-2">
            <Inbox size={15} /> Your enquiries
          </h2>
          {loadingEnquiries ? (
            <div className="flex items-center gap-2 text-slatesoft dark:text-white/50 text-sm">
              <Loader2 size={15} className="animate-spin" /> Loading…
            </div>
          ) : enquiries.length === 0 ? (
            <p className="text-sm text-slatesoft dark:text-white/50">
              No enquiries found under {session?.user?.email}. If you submitted the contact form
              with a different email, it won&rsquo;t show up here — enquiries are matched by email.
            </p>
          ) : (
            <div className="space-y-3">
              {enquiries.map((e) => (
                <div key={e.id} className="flex items-center justify-between gap-3 border-b border-navy/5 dark:border-white/5 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-navy dark:text-white">{e.program || 'General enquiry'}</p>
                    <p className="text-xs text-slatesoft dark:text-white/40">{new Date(e.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-royal/10 dark:bg-accent/15 text-royal dark:text-accent capitalize">
                    {e.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {viewingCert && (
        <CertificateModal
          certificate={viewingCert}
          studentName={profile?.full_name || session?.user?.email}
          onClose={() => setViewingCert(null)}
        />
      )}
    </div>
  );
}

function CertificateModal({ certificate, studentName, onClose }) {
  const dialogRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    previouslyFocused.current = document.activeElement;
    const focusable = dialogRef.current.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
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

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="certificate-modal-title"
        className="w-full max-w-lg rounded-3xl bg-white dark:bg-navy p-7 shadow-card-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 id="certificate-modal-title" className="font-display font-bold text-lg text-navy dark:text-white">
            Certificate
          </h2>
          <button onClick={onClose} aria-label="Close" className="text-slatesoft dark:text-white/50 hover:text-navy dark:hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="certificate-print-area rounded-2xl border-2 border-royal/20 dark:border-accent/30 bg-grad-navy p-8 text-center">
          <p className="font-mono text-[11px] tracking-[0.3em] text-white/50 mb-6">A TEKNON SOLUTIONS</p>
          <p className="text-xs uppercase tracking-wide text-white/50 mb-2">Certificate of Completion</p>
          <p className="font-display font-extrabold text-2xl text-white mb-4">{studentName}</p>
          <p className="text-sm text-white/70 mb-1">has successfully completed</p>
          <p className="font-display font-bold text-lg text-accent mb-6">{certificate.course_title}</p>
          <div className="flex items-center justify-center gap-6 text-xs text-white/50 font-mono">
            <span>{certificate.certificate_number}</span>
            <span>{new Date(certificate.issued_at).toLocaleDateString()}</span>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-grad-primary text-white text-sm font-semibold hover:brightness-110 transition-all"
        >
          <Printer size={15} /> Print / Save as PDF
        </button>
      </div>
    </div>
  );
}

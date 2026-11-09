import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import {
  LogOut, User, Mail, Phone, Save, Loader2, BookOpen, Award, Printer, X,
  CalendarCheck, FileCheck2, Send, Receipt, GraduationCap, Clock, CheckCircle2,
  AlertCircle, Sparkles, ArrowRight, ExternalLink, ShieldCheck, ChevronRight,
  TrendingUp, Laptop
} from 'lucide-react';
import InvoiceModal from '../components/InvoiceModal.jsx';
import Logo from '../components/Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';
import {
  MOCK_STUDENT_PROFILE,
  MOCK_STUDENT_COURSES,
  MOCK_ATTENDANCE,
  MOCK_ASSIGNMENTS,
  MOCK_CERTIFICATES,
  MOCK_PAYMENTS,
} from '../data/mockPortalData.js';

export default function StudentDashboard() {
  const { session, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Profile state
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ full_name: '', phone: '', college: '', year: '' });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Course state
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // Certificates
  const [certificates, setCertificates] = useState([]);
  const [loadingCertificates, setLoadingCertificates] = useState(true);
  const [viewingCert, setViewingCert] = useState(null);

  // Attendance
  const [attendance, setAttendance] = useState([]);
  const [loadingAttendance, setLoadingAttendance] = useState(true);

  // Payments & Invoices
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [viewingInvoice, setViewingInvoice] = useState(null);

  // Assignments
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [draftByAssignment, setDraftByAssignment] = useState({});
  const [submittingId, setSubmittingId] = useState(null);
  const [submitErrors, setSubmitErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState({});

  const headingRef = useRef(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  // Fetch or mock data
  useEffect(() => {
    if (!session?.user?.id) return;

    if (!isSupabaseConfigured || !supabase) {
      // Use rich mock data resilience layer
      setProfile(MOCK_STUDENT_PROFILE);
      setForm({
        full_name: MOCK_STUDENT_PROFILE.full_name,
        phone: MOCK_STUDENT_PROFILE.phone,
        college: MOCK_STUDENT_PROFILE.college,
        year: MOCK_STUDENT_PROFILE.year,
      });
      setLoadingProfile(false);

      setCourses(MOCK_STUDENT_COURSES);
      setLoadingCourses(false);

      setAttendance(MOCK_ATTENDANCE);
      setLoadingAttendance(false);

      setAssignments(MOCK_ASSIGNMENTS);
      const subMap = {};
      MOCK_ASSIGNMENTS.forEach((a) => {
        if (a.status !== 'pending') {
          subMap[a.id] = {
            id: `sub-${a.id}`,
            status: a.status === 'reviewed' ? 'graded' : a.status,
            grade: a.score,
            feedback: a.feedback,
            submission_url: a.submission_url,
          };
        }
      });
      setSubmissions(subMap);
      setLoadingAssignments(false);

      setCertificates(MOCK_CERTIFICATES);
      setLoadingCertificates(false);

      setPayments(
        MOCK_PAYMENTS.map((p) => ({
          id: p.id,
          amount: p.amount * 100, // stored in paise
          refunded_amount: 0,
          description: p.description,
          created_at: p.date,
          status: p.status,
          invoice_number: p.invoice_number,
        }))
      );
      setLoadingPayments(false);
      return;
    }

    // Live Supabase flow
    supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setProfile(data);
          setForm({
            full_name: data.full_name || '',
            phone: data.phone || '',
            college: data.college || '',
            year: data.year || '',
          });
        } else {
          setProfile(MOCK_STUDENT_PROFILE);
          setForm({
            full_name: MOCK_STUDENT_PROFILE.full_name,
            phone: MOCK_STUDENT_PROFILE.phone,
            college: MOCK_STUDENT_PROFILE.college,
            year: MOCK_STUDENT_PROFILE.year,
          });
        }
        setLoadingProfile(false);
      });

    supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setCourses(data && data.length > 0 ? data : MOCK_STUDENT_COURSES);
        setLoadingCourses(false);
      });

    supabase
      .from('certificates')
      .select('*')
      .eq('student_id', session.user.id)
      .order('issued_at', { ascending: false })
      .then(({ data }) => {
        setCertificates(data && data.length > 0 ? data : MOCK_CERTIFICATES);
        setLoadingCertificates(false);
      });

    supabase
      .from('payments')
      .select('*')
      .in('status', ['paid', 'refunded', 'partially_refunded'])
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setPayments(
          data && data.length > 0
            ? data
            : MOCK_PAYMENTS.map((p) => ({
                id: p.id,
                amount: p.amount * 100,
                refunded_amount: 0,
                description: p.description,
                created_at: p.date,
                status: p.status,
                invoice_number: p.invoice_number,
              }))
        );
        setLoadingPayments(false);
      });

    supabase
      .from('attendance_records')
      .select('status, attendance_sessions(session_date, topic, batches(name))')
      .eq('student_id', session.user.id)
      .order('session_date', { foreignTable: 'attendance_sessions', ascending: false })
      .then(({ data }) => {
        setAttendance(data && data.length > 0 ? data : MOCK_ATTENDANCE);
        setLoadingAttendance(false);
      });

    supabase
      .from('assignments')
      .select('*, courses(title)')
      .order('due_date', { ascending: true, nullsFirst: false })
      .then(async ({ data: assignmentData }) => {
        if (assignmentData && assignmentData.length > 0) {
          setAssignments(assignmentData);
          const ids = assignmentData.map((a) => a.id);
          const { data: subData } = await supabase
            .from('assignment_submissions')
            .select('*')
            .eq('student_id', session.user.id)
            .in('assignment_id', ids);
          const byAssignment = {};
          (subData ?? []).forEach((s) => {
            byAssignment[s.assignment_id] = s;
          });
          setSubmissions(byAssignment);
        } else {
          setAssignments(MOCK_ASSIGNMENTS);
        }
        setLoadingAssignments(false);
      });
  }, [session?.user?.id]);

  async function submitAssignment(assignmentId) {
    const draft = draftByAssignment[assignmentId] || {};
    if (!draft.text?.trim() && !draft.url?.trim()) return;

    setSubmittingId(assignmentId);
    setSubmitErrors((prev) => ({ ...prev, [assignmentId]: '' }));
    setSubmitSuccess((prev) => ({ ...prev, [assignmentId]: '' }));

    if (!isSupabaseConfigured || !supabase) {
      setTimeout(() => {
        setSubmissions((prev) => ({
          ...prev,
          [assignmentId]: {
            id: `sub-${Date.now()}`,
            assignment_id: assignmentId,
            student_id: session?.user?.id,
            submission_text: draft.text?.trim() || null,
            submission_url: draft.url?.trim() || null,
            status: 'submitted',
          },
        }));
        setSubmittingId(null);
        setSubmitSuccess((prev) => ({ ...prev, [assignmentId]: 'Assignment submitted successfully!' }));
      }, 500);
      return;
    }

    const payload = {
      assignment_id: assignmentId,
      student_id: session.user.id,
      submission_text: draft.text?.trim() || null,
      submission_url: draft.url?.trim() || null,
    };
    const { data, error } = await supabase
      .from('assignment_submissions')
      .upsert(payload, { onConflict: 'assignment_id,student_id' })
      .select()
      .single();
    setSubmittingId(null);
    if (!error) {
      setSubmissions((prev) => ({ ...prev, [assignmentId]: data }));
      setSubmitSuccess((prev) => ({ ...prev, [assignmentId]: 'Assignment submitted successfully!' }));
    } else {
      setSubmitErrors((prev) => ({ ...prev, [assignmentId]: 'Could not submit. Please try again.' }));
    }
  }

  async function saveProfile(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setSaveError('');

    if (!isSupabaseConfigured || !supabase) {
      setTimeout(() => {
        setProfile((p) => ({ ...p, ...form }));
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }, 400);
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: form.full_name, phone: form.phone, college: form.college, year: form.year })
      .eq('id', session.user.id);
    setSaving(false);
    if (!error) {
      setProfile((p) => ({ ...p, ...form }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      setSaveError('Could not save your changes. Please try again.');
    }
  }

  // Attendance metrics
  const attendanceStats = useMemo(() => {
    if (!attendance || attendance.length === 0) return { attended: 0, total: 0, rate: 100 };
    const total = attendance.length;
    const attended = attendance.filter((a) => a.status === 'present' || a.status === 'late').length;
    const rate = Math.round((attended / total) * 100);
    return { attended, total, rate };
  }, [attendance]);

  const studentName = profile?.full_name || session?.user?.user_metadata?.full_name || 'Student';
  const firstName = studentName.split(' ')[0];
  const studentTrack = profile?.track || 'Full Stack Web Development';
  const studentBatch = profile?.batch_name || 'Batch 2026-A';
  const studentIdNumber = profile?.student_id || 'TS-2026-STU-042';

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'courses', label: 'My Courses', icon: BookOpen, badge: courses.length },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck, badge: `${attendanceStats.rate}%` },
    { id: 'assignments', label: 'Assignments', icon: FileCheck2, badge: assignments.length },
    { id: 'certificates', label: 'Certificates', icon: Award, badge: certificates.length },
    { id: 'payments', label: 'Invoices & Fees', icon: Receipt },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div id="student-dashboard-root" className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-800 dark:text-slate-200 transition-colors duration-200">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#0d1424]/90 backdrop-blur-md border-b border-slate-200 dark:border-white/10">
        <div className="container-px mx-auto max-w-7xl h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
            <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-200 dark:border-white/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-royal dark:text-accent bg-royal/10 dark:bg-accent/15 px-2.5 py-1 rounded-full">
                Student Learning Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">{studentName}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{studentIdNumber}</span>
            </div>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all border border-slate-200 dark:border-white/10"
              title="Sign out of student portal"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container-px mx-auto max-w-7xl py-6 sm:py-10 space-y-8">
        {/* Student Identity Hero Card */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-royal via-indigo-900 to-navy text-white p-6 sm:p-8 shadow-card-lg border border-white/10">
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4 sm:gap-5">
              <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-display font-extrabold text-2xl sm:text-3xl text-white shadow-inner">
                {firstName.charAt(0)}
                <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-indigo-950" title="Active Student" />
              </div>

              <div>
                <div className="flex items-center gap-2.5 flex-wrap mb-1">
                  <h1
                    ref={headingRef}
                    tabIndex={-1}
                    className="font-display font-bold text-2xl sm:text-3xl text-white focus:outline-none"
                  >
                    Welcome back, {firstName}! 👋
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    <CheckCircle2 size={12} /> Active Enrolled
                  </span>
                </div>
                <p className="text-sm text-white/80 flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-white">{studentTrack}</span>
                  <span className="text-white/40">·</span>
                  <span>{studentBatch}</span>
                  <span className="text-white/40">·</span>
                  <span className="font-mono text-xs text-white/70">{session?.user?.email}</span>
                </p>
              </div>
            </div>

            {/* Quick Hero Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setActiveTab('courses')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-navy font-semibold text-sm hover:bg-slate-100 hover:shadow-lg transition-all"
              >
                <Laptop size={16} /> Continue Learning
              </button>
            </div>
          </div>
        </section>

        {/* Executive KPI Stats Bar */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="rounded-2xl p-5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-royal dark:text-accent flex items-center justify-center shrink-0">
              <BookOpen size={22} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Courses</p>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white mt-0.5">
                {courses.length} <span className="text-xs font-normal text-slate-500">Active</span>
              </h2>
            </div>
          </div>

          <div className="rounded-2xl p-5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CalendarCheck size={22} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Attendance</p>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white mt-0.5">
                {attendanceStats.rate}% <span className="text-xs font-normal text-emerald-600 dark:text-emerald-400 font-mono">Good</span>
              </h2>
            </div>
          </div>

          <div className="rounded-2xl p-5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <FileCheck2 size={22} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Assignments</p>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white mt-0.5">
                {Object.keys(submissions).length}/{assignments.length} <span className="text-xs font-normal text-slate-500">Done</span>
              </h2>
            </div>
          </div>

          <div className="rounded-2xl p-5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Award size={22} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Certificates</p>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white mt-0.5">
                {certificates.length} <span className="text-xs font-normal text-slate-500">Verified</span>
              </h2>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="border-b border-slate-200 dark:border-white/10 pb-1">
          <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1" aria-label="Student Portal Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-royal text-white shadow-sm dark:bg-accent dark:text-navy'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span
                      className={`ml-1 px-2 py-0.5 rounded-full text-xs font-mono font-medium ${
                        isActive
                          ? 'bg-white/20 text-white dark:bg-navy/20 dark:text-navy'
                          : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </section>

        {/* Tab Content Panes */}

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column: Current Course Progress */}
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-3xl p-6 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">Active Curriculum</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Continue from your last completed module</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('courses')}
                      className="text-xs font-semibold text-royal dark:text-accent hover:underline inline-flex items-center gap-1"
                    >
                      View all ({courses.length}) <ChevronRight size={14} />
                    </button>
                  </div>

                  {loadingCourses ? (
                    <div className="flex items-center gap-2 py-8 text-slate-400 text-sm">
                      <Loader2 size={16} className="animate-spin" /> Loading courses…
                    </div>
                  ) : courses.length === 0 ? (
                    <p className="text-sm text-slate-500 py-6">No enrolled courses yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {courses.slice(0, 2).map((c) => (
                        <div
                          key={c.id}
                          className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/[0.02] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[11px] font-semibold font-mono uppercase px-2 py-0.5 rounded bg-blue-500/10 text-royal dark:text-accent">
                                {c.category || 'Technology'}
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {c.completed_lessons ? `${c.completed_lessons}/${c.total_lessons || 30} lessons` : 'Self-paced'}
                              </span>
                            </div>
                            <h3 className="font-semibold text-base text-slate-900 dark:text-white truncate">{c.title}</h3>
                            {c.progress !== undefined && (
                              <div className="w-full max-w-md pt-1">
                                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                                  <span>Progress</span>
                                  <span className="font-semibold font-mono text-royal dark:text-accent">{c.progress}%</span>
                                </div>
                                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-gradient-to-r from-royal to-indigo-500"
                                    style={{ width: `${c.progress}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                          <Link
                            to={`/student/learn/${c.id}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-royal dark:bg-accent text-white dark:text-navy hover:brightness-110 transition-all shrink-0 shadow-sm"
                          >
                            <Laptop size={14} /> Resume Track
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Upcoming Live Sessions & Attendance Preview */}
                <div className="rounded-3xl p-6 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">Recent Attendance Logs</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Classroom & interactive laboratory sessions</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('attendance')}
                      className="text-xs font-semibold text-royal dark:text-accent hover:underline inline-flex items-center gap-1"
                    >
                      Full history <ChevronRight size={14} />
                    </button>
                  </div>

                  {attendance.length === 0 ? (
                    <p className="text-sm text-slate-500 py-4">No attendance sessions logged yet.</p>
                  ) : (
                    <div className="divide-y divide-slate-100 dark:divide-white/5">
                      {attendance.slice(0, 4).map((a, i) => {
                        const dateStr = a.date || a.attendance_sessions?.session_date;
                        const topicStr = a.session_topic || a.attendance_sessions?.topic || 'Curriculum Practical Session';
                        const status = a.status;
                        return (
                          <div key={i} className="py-3 flex items-center justify-between gap-3 text-sm">
                            <div className="min-w-0">
                              <p className="font-medium text-slate-900 dark:text-white truncate">{topicStr}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                                <Clock size={12} /> {dateStr ? new Date(dateStr).toLocaleDateString() : 'Recent'}
                              </p>
                            </div>
                            <span
                              className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold capitalize shrink-0 ${
                                status === 'present'
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                  : status === 'late'
                                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                  : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                              }`}
                            >
                              {status}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Next Deadlines & Verified Certificates */}
              <div className="space-y-6">
                {/* Pending Assignment Alert */}
                <div className="rounded-3xl p-6 bg-gradient-to-br from-indigo-50/50 to-blue-50/30 dark:from-white/[0.04] dark:to-white/[0.01] border border-blue-200/50 dark:border-white/10 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 text-royal dark:text-accent font-semibold text-sm">
                    <Sparkles size={16} /> Mentorship & Practical
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">Upcoming Project Milestones</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                    Submit your code repository link and project writeup to unlock code review from your mentor.
                  </p>
                  <button
                    onClick={() => setActiveTab('assignments')}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-royal dark:bg-accent text-white dark:text-navy text-xs font-semibold hover:brightness-110 transition-all"
                  >
                    Go to Assignments <ArrowRight size={14} />
                  </button>
                </div>

                {/* Verified Credential Highlight */}
                {certificates.length > 0 && (
                  <div className="rounded-3xl p-6 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                        <Award size={18} className="text-amber-500" /> Issued Credentials
                      </h3>
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        Verified
                      </span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-2">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {certificates[0].title || 'Certificate of Completion'}
                      </p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        {certificates[0].program_name || certificates[0].course_title}
                      </p>
                      <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                        ID: {certificates[0].cert_number || certificates[0].certificate_number}
                      </p>
                      <div className="pt-2 flex gap-2">
                        <button
                          onClick={() => setViewingCert(certificates[0])}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-royal text-white dark:bg-accent dark:text-navy text-xs font-semibold hover:brightness-110"
                        >
                          <Printer size={13} /> View Certificate
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Help & Academic Guidance Card */}
                <div className="rounded-3xl p-6 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-sm">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-royal dark:text-accent" /> Need Assistance?
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                    Have doubts about your course, schedule, or certifications? Reach out directly to your faculty coordinator.
                  </p>
                  <a
                    href="https://wa.me/918897571616?text=Hi%20ATS%20Faculty%20Coordinator,%20I%20have%20a%20query%20regarding%20my%20internship"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  >
                    Chat with Academic Mentor <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. COURSES TAB */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">Enrolled Programs & Courses</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Track lessons, access projects, and earn course certificates</p>
              </div>
            </div>

            {loadingCourses ? (
              <div className="flex items-center gap-2 py-12 text-slate-400 text-sm">
                <Loader2 size={16} className="animate-spin" /> Loading courses…
              </div>
            ) : courses.length === 0 ? (
              <div className="rounded-3xl p-10 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 text-center">
                <BookOpen size={36} className="mx-auto text-slate-400 mb-3" />
                <p className="text-base font-semibold text-slate-900 dark:text-white">No courses currently enrolled</p>
                <p className="text-xs text-slate-500 mt-1">Explore available programs on the main website.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {courses.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 p-6 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-royal/10 dark:bg-accent/15 text-royal dark:text-accent">
                          {c.category || 'Engineering'}
                        </span>
                        {c.batch && (
                          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{c.batch}</span>
                        )}
                      </div>

                      <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2">{c.title}</h3>
                      {c.description && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                          {c.description}
                        </p>
                      )}

                      <div className="space-y-2 mb-6 pt-2">
                        <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
                          <span>Syllabus Completion</span>
                          <span className="font-mono font-bold text-royal dark:text-accent">{c.progress || 0}%</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-royal to-blue-500"
                            style={{ width: `${c.progress || 0}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                          {c.completed_lessons || 0} of {c.total_lessons || 30} lessons completed
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {c.instructor ? `Mentor: ${c.instructor}` : 'Industry Mentor'}
                      </span>
                      <Link
                        to={`/student/learn/${c.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-royal dark:bg-accent text-white dark:text-navy hover:brightness-110 transition-all shadow-sm"
                      >
                        <Laptop size={14} /> Continue Learning
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. ATTENDANCE TAB */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">Classroom & Lab Attendance</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {attendanceStats.attended} of {attendanceStats.total} total sessions attended ({attendanceStats.rate}%)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                  Requirement: 80% Min.
                </span>
              </div>
            </div>

            {loadingAttendance ? (
              <div className="flex items-center gap-2 py-12 text-slate-400 text-sm">
                <Loader2 size={16} className="animate-spin" /> Loading attendance records…
              </div>
            ) : attendance.length === 0 ? (
              <div className="rounded-3xl p-10 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 text-center">
                <CalendarCheck size={36} className="mx-auto text-slate-400 mb-3" />
                <p className="text-base font-semibold text-slate-900 dark:text-white">No attendance recorded yet</p>
                <p className="text-xs text-slate-500 mt-1">
                  Attendance logs are updated by your mentors after each session.
                </p>
              </div>
            ) : (
              <div className="rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        <th className="py-4 px-6">Date</th>
                        <th className="py-4 px-6">Session Topic</th>
                        <th className="py-4 px-6">Batch / Faculty</th>
                        <th className="py-4 px-6 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {attendance.map((a, i) => {
                        const dateStr = a.date || a.attendance_sessions?.session_date;
                        const topicStr = a.session_topic || a.attendance_sessions?.topic || 'Curriculum Session';
                        const batchOrFaculty = a.faculty || a.attendance_sessions?.batches?.name || 'A Teknon Solutions';
                        const status = a.status;
                        return (
                          <tr key={i} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors">
                            <td className="py-4 px-6 font-mono text-xs text-slate-600 dark:text-slate-300">
                              {dateStr ? new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                            </td>
                            <td className="py-4 px-6 font-medium text-slate-900 dark:text-white">{topicStr}</td>
                            <td className="py-4 px-6 text-xs text-slate-500 dark:text-slate-400">{batchOrFaculty}</td>
                            <td className="py-4 px-6 text-right">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-semibold capitalize ${
                                  status === 'present'
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                    : status === 'late'
                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                    : 'bg-red-500/10 text-red-600 dark:text-red-400'
                                }`}
                              >
                                {status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. ASSIGNMENTS TAB */}
        {activeTab === 'assignments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">Assignments & Code Tasks</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Submit GitHub repos or project writeups for faculty code review</p>
              </div>
            </div>

            {loadingAssignments ? (
              <div className="flex items-center gap-2 py-12 text-slate-400 text-sm">
                <Loader2 size={16} className="animate-spin" /> Loading assignments…
              </div>
            ) : assignments.length === 0 ? (
              <div className="rounded-3xl p-10 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 text-center">
                <FileCheck2 size={36} className="mx-auto text-slate-400 mb-3" />
                <p className="text-base font-semibold text-slate-900 dark:text-white">No assignments assigned yet</p>
                <p className="text-xs text-slate-500 mt-1">Practical tasks will appear here as your batch progresses.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {assignments.map((a) => {
                  const sub = submissions[a.id];
                  const isGraded = sub?.status === 'graded';
                  return (
                    <div
                      key={a.id}
                      className="rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 p-6 shadow-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">{a.title}</h3>
                            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                              {a.courses?.title || a.course_title}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                            <span>Due: {a.due_date ? new Date(a.due_date).toLocaleDateString() : 'Self-Paced'}</span>
                            {a.max_score && <span>· Max Score: {a.max_score} pts</span>}
                          </p>
                        </div>

                        {sub && (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-mono font-semibold shrink-0 self-start ${
                              isGraded
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                            }`}
                          >
                            {isGraded ? `Graded: ${sub.grade ?? 'A'}${a.max_score ? `/${a.max_score}` : ''}` : 'Under Mentor Review'}
                          </span>
                        )}
                      </div>

                      {a.description && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-white/[0.02] p-3.5 rounded-xl border border-slate-100 dark:border-white/5">
                          {a.description}
                        </p>
                      )}

                      {/* Mentor Feedback Box */}
                      {sub?.feedback && (
                        <div className="p-4 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 text-xs">
                          <p className="font-semibold text-emerald-800 dark:text-emerald-300 mb-1 flex items-center gap-1.5">
                            <CheckCircle2 size={14} /> Mentor Review & Feedback:
                          </p>
                          <p className="text-slate-700 dark:text-slate-200">{sub.feedback}</p>
                          {sub.submission_url && (
                            <a
                              href={sub.submission_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-mono text-royal dark:text-accent hover:underline mt-2"
                            >
                              Submitted Link: {sub.submission_url} <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      )}

                      {/* Submission Form */}
                      {!isGraded && (
                        <div className="pt-2 border-t border-slate-100 dark:border-white/10 space-y-3">
                          <div className="grid sm:grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="Notes, methodology or explanation…"
                              defaultValue={sub?.submission_text || ''}
                              onChange={(e) =>
                                setDraftByAssignment((d) => ({
                                  ...d,
                                  [a.id]: { ...d[a.id], text: e.target.value },
                                }))
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-xs focus:border-royal"
                            />
                            <input
                              type="url"
                              placeholder="GitHub repository or live demo link…"
                              defaultValue={sub?.submission_url || ''}
                              onChange={(e) =>
                                setDraftByAssignment((d) => ({
                                  ...d,
                                  [a.id]: { ...d[a.id], url: e.target.value },
                                }))
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-xs focus:border-royal"
                            />
                          </div>

                          <div className="flex items-center justify-between gap-3">
                            <button
                              onClick={() => submitAssignment(a.id)}
                              disabled={submittingId === a.id}
                              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-royal dark:bg-accent text-white dark:text-navy text-xs font-semibold hover:brightness-110 transition-all disabled:opacity-50"
                            >
                              {submittingId === a.id ? (
                                <>
                                  <Loader2 size={13} className="animate-spin" /> Submitting…
                                </>
                              ) : (
                                <>
                                  <Send size={13} /> {sub ? 'Update Submission' : 'Submit Assignment'}
                                </>
                              )}
                            </button>

                            {submitSuccess[a.id] && (
                              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                {submitSuccess[a.id]}
                              </span>
                            )}
                            {submitErrors[a.id] && (
                              <span className="text-xs text-red-500 font-medium">{submitErrors[a.id]}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 5. CERTIFICATES TAB */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">Professional Certificates</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Verifiable credentials issued upon completion of internships and courses</p>
              </div>
            </div>

            {loadingCertificates ? (
              <div className="flex items-center gap-2 py-12 text-slate-400 text-sm">
                <Loader2 size={16} className="animate-spin" /> Loading certificates…
              </div>
            ) : certificates.length === 0 ? (
              <div className="rounded-3xl p-10 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 text-center">
                <Award size={36} className="mx-auto text-slate-400 mb-3" />
                <p className="text-base font-semibold text-slate-900 dark:text-white">No certificates issued yet</p>
                <p className="text-xs text-slate-500 mt-1">
                  Certificates appear here automatically once you pass all assessments and complete attendance.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {certificates.map((c) => {
                  const certNo = c.cert_number || c.certificate_number || 'TS-2026-CERT';
                  const title = c.program_name || c.course_title;
                  const date = c.issued_at ? new Date(c.issued_at).toLocaleDateString() : '2026';
                  return (
                    <div
                      key={c.id}
                      className="rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 p-6 shadow-sm space-y-4 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            Verified Credential
                          </span>
                          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{date}</span>
                        </div>
                        <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-1">{title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Certificate ID: {certNo}</p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-3">
                        <Link
                          to={`/verify-certificate?id=${certNo}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-royal dark:text-accent hover:underline"
                        >
                          Verify Online <ExternalLink size={12} />
                        </Link>
                        <button
                          onClick={() => setViewingCert(c)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-royal text-white dark:bg-accent dark:text-navy text-xs font-semibold hover:brightness-110 transition-all shadow-sm"
                        >
                          <Printer size={13} /> View & Print
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 6. PAYMENTS & INVOICES TAB */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">Fee Receipts & GST Invoices</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Download official tax invoices for your academic records</p>
              </div>
            </div>

            {loadingPayments ? (
              <div className="flex items-center gap-2 py-12 text-slate-400 text-sm">
                <Loader2 size={16} className="animate-spin" /> Loading invoices…
              </div>
            ) : payments.length === 0 ? (
              <div className="rounded-3xl p-10 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 text-center">
                <Receipt size={36} className="mx-auto text-slate-400 mb-3" />
                <p className="text-base font-semibold text-slate-900 dark:text-white">No payments on record</p>
                <p className="text-xs text-slate-500 mt-1">Receipts for course enrollments will appear here.</p>
              </div>
            ) : (
              <div className="rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        <th className="py-4 px-6">Invoice #</th>
                        <th className="py-4 px-6">Description</th>
                        <th className="py-4 px-6">Date</th>
                        <th className="py-4 px-6">Amount</th>
                        <th className="py-4 px-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {payments.map((p) => {
                        const netAmount = ((p.amount - (p.refunded_amount || 0)) / 100).toLocaleString('en-IN');
                        const dateStr = p.created_at ? new Date(p.created_at).toLocaleDateString() : '—';
                        return (
                          <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors">
                            <td className="py-4 px-6 font-mono text-xs text-slate-700 dark:text-slate-300">
                              {p.invoice_number || `ATS-INV-${p.id.slice(0, 8)}`}
                            </td>
                            <td className="py-4 px-6 font-medium text-slate-900 dark:text-white">{p.description || 'Program Enrollment Fee'}</td>
                            <td className="py-4 px-6 text-xs text-slate-500 dark:text-slate-400">{dateStr}</td>
                            <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">₹{netAmount}</td>
                            <td className="py-4 px-6 text-right">
                              <button
                                onClick={() => setViewingInvoice(p)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-royal text-white dark:bg-accent dark:text-navy hover:brightness-110 transition-all shadow-sm"
                              >
                                <Receipt size={13} /> View Invoice
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 7. PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                <User size={20} className="text-royal dark:text-accent" /> Academic Profile
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Keep your contact details up to date for official certificate issuance and placement notifications.
              </p>

              {loadingProfile ? (
                <div className="flex items-center gap-2 text-slate-400 text-sm py-8">
                  <Loader2 size={16} className="animate-spin" /> Loading profile…
                </div>
              ) : (
                <form onSubmit={saveProfile} className="space-y-4">
                  <div>
                    <label htmlFor="student-fullname" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Full Legal Name (as on Degree/Certificates)
                    </label>
                    <input
                      id="student-fullname"
                      type="text"
                      value={form.full_name}
                      onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-sm focus:border-royal"
                    />
                  </div>

                  <div>
                    <label htmlFor="student-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Mail size={12} /> Registered Email
                    </label>
                    <input
                      id="student-email"
                      type="email"
                      value={session?.user?.email || ''}
                      disabled
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.03] text-slate-500 dark:text-slate-400 text-sm cursor-not-allowed"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">To change registered email, please reach out to ATS admin.</p>
                  </div>

                  <div>
                    <label htmlFor="student-phone" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Phone size={12} /> Mobile / WhatsApp Number
                    </label>
                    <input
                      id="student-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-sm focus:border-royal"
                      placeholder="+91 98480 00000"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="student-college" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <GraduationCap size={12} /> College / University
                      </label>
                      <input
                        id="student-college"
                        type="text"
                        value={form.college}
                        onChange={(e) => setForm((f) => ({ ...f, college: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-sm focus:border-royal"
                        placeholder="e.g. JNTUK Kakinada"
                      />
                    </div>
                    <div>
                      <label htmlFor="student-year" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Academic Year / Status
                      </label>
                      <input
                        id="student-year"
                        type="text"
                        value={form.year}
                        onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-sm focus:border-royal"
                        placeholder="e.g. 3rd Year / Graduate"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-royal dark:bg-accent text-white dark:text-navy text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-60 shadow-sm"
                    >
                      {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                      {saved ? 'Saved Successfully!' : saving ? 'Saving…' : 'Save Profile Changes'}
                    </button>
                    {saved && <span className="text-xs text-emerald-600 font-medium">Changes updated.</span>}
                  </div>
                  {saveError && <p className="text-xs text-red-500">{saveError}</p>}
                </form>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Certificate Viewer Modal */}
      {viewingCert && (
        <CertificateModal
          certificate={viewingCert}
          studentName={viewingCert.student_name || profile?.full_name || session?.user?.email}
          onClose={() => setViewingCert(null)}
        />
      )}

      {/* Invoice Viewer Modal */}
      {viewingInvoice && <InvoiceModal payment={viewingInvoice} onClose={() => setViewingInvoice(null)} />}
    </div>
  );
}

const MODAL_TRANSITION_MS = 200;

function CertificateModal({ certificate, studentName, onClose }) {
  const dialogRef = useRef(null);
  const previouslyFocused = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf2);
    });
    return () => cancelAnimationFrame(raf1);
  }, []);

  function requestClose() {
    setVisible(false);
    setTimeout(onClose, MODAL_TRANSITION_MS);
  }

  useEffect(() => {
    const root = document.getElementById('student-dashboard-root');
    if (root) root.inert = true;
    return () => {
      if (root) root.inert = false;
    };
  }, []);

  useEffect(() => {
    previouslyFocused.current = document.activeElement;
    const focusable = dialogRef.current?.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
    focusable?.[0]?.focus();

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        requestClose();
        return;
      }
      if (e.key === 'Tab' && focusable && focusable.length > 0) {
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
  }, []);

  const courseTitle = certificate.program_name || certificate.course_title || 'Professional Technology Internship';
  const certNumber = certificate.cert_number || certificate.certificate_number || 'TS-2026-CERT';
  const issueDate = certificate.issued_at ? new Date(certificate.issued_at).toLocaleDateString() : '2026';

  return createPortal(
    <div
      className={`fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-200 ease-out ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={requestClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="certificate-modal-title"
        className={`w-full max-w-lg rounded-3xl bg-white dark:bg-[#0f172a] p-6 sm:p-8 shadow-card-lg border border-slate-200 dark:border-white/10 transition-all duration-200 ease-out ${
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 id="certificate-modal-title" className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Award size={18} className="text-amber-500" /> Certificate of Completion
          </h2>
          <button
            onClick={requestClose}
            aria-label="Close"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Certificate Card Render */}
        <div className="print-area rounded-2xl border-2 border-royal/30 dark:border-accent/40 bg-gradient-to-br from-[#0c1427] to-[#162344] p-8 text-center text-white relative overflow-hidden shadow-inner">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl pointer-events-none" />
          <p className="font-mono text-[11px] tracking-[0.35em] text-white/60 mb-5 uppercase">
            ATS GROUP OF COMPANIES
          </p>
          <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-2">
            Certificate of Completion
          </p>
          <p className="font-display font-extrabold text-2xl text-white mb-3">
            {studentName}
          </p>
          <p className="text-xs text-white/70 mb-1">has successfully completed all requirements for</p>
          <p className="font-display font-bold text-base text-accent mb-6 leading-snug">
            {courseTitle}
          </p>

          <div className="pt-4 border-t border-white/15 flex items-center justify-between text-xs text-white/60 font-mono">
            <span>ID: {certNumber}</span>
            <span>Issued: {issueDate}</span>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={() => window.print()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-royal text-white dark:bg-accent dark:text-navy text-sm font-semibold hover:brightness-110 transition-all shadow-sm"
          >
            <Printer size={15} /> Print / Save PDF
          </button>
          <button
            onClick={requestClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

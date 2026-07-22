import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, Circle, ChevronLeft, ChevronRight,
  Loader2, Download, ExternalLink, PlayCircle,
} from 'lucide-react';
import Logo from '../components/Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { supabase } from '../lib/supabaseClient.js';

function youtubeEmbedUrl(url) {
  if (!url) return null;
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/);
  return watchMatch ? `https://www.youtube.com/embed/${watchMatch[1]}` : null;
}

export default function StudentLearn() {
  const { courseId } = useParams();
  const { session } = useAuth();

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]); // flat, ordered
  const [completedIds, setCompletedIds] = useState(new Set());
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [marking, setMarking] = useState(false);
  const [markError, setMarkError] = useState('');

  const headingRef = useRef(null);

  useEffect(() => {
    if (!courseId || !session?.user?.id) return;
    fetchAll();
  }, [courseId, session?.user?.id]);

  // SPA nav from the dashboard (or a direct link) into this route never
  // moves focus on its own — send it to the course heading once content
  // actually exists, same as a full-page navigation would.
  useEffect(() => {
    if (!loading && course) {
      headingRef.current?.focus();
    }
  }, [loading, course]);

  async function fetchAll() {
    setLoading(true);
    setError('');

    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();
    if (courseError) {
      setError('Could not load this course.');
      setLoading(false);
      return;
    }
    setCourse(courseData);

    const { data: moduleData } = await supabase
      .from('course_modules')
      .select('*')
      .eq('course_id', courseId)
      .order('position', { ascending: true });
    setModules(moduleData ?? []);

    const moduleIds = (moduleData ?? []).map((m) => m.id);
    let lessonData = [];
    if (moduleIds.length > 0) {
      const { data } = await supabase
        .from('course_lessons')
        .select('*')
        .in('module_id', moduleIds)
        .order('position', { ascending: true });
      lessonData = data ?? [];
    }
    setLessons(lessonData);

    const lessonIds = lessonData.map((l) => l.id);
    let progress = [];
    if (lessonIds.length > 0) {
      const { data } = await supabase
        .from('lesson_progress')
        .select('lesson_id')
        .eq('student_id', session.user.id)
        .in('lesson_id', lessonIds);
      progress = data ?? [];
    }
    const completed = new Set(progress.map((p) => p.lesson_id));
    setCompletedIds(completed);

    const firstIncomplete = lessonData.find((l) => !completed.has(l.id));
    setSelectedLessonId((firstIncomplete || lessonData[0])?.id ?? null);

    setLoading(false);
  }

  const selectedLesson = useMemo(() => lessons.find((l) => l.id === selectedLessonId), [lessons, selectedLessonId]);
  const selectedIndex = useMemo(() => lessons.findIndex((l) => l.id === selectedLessonId), [lessons, selectedLessonId]);
  const progressPct = lessons.length > 0 ? Math.round((completedIds.size / lessons.length) * 100) : 0;

  useEffect(() => {
    setMarkError('');
  }, [selectedLessonId]);

  async function markComplete() {
    if (!selectedLesson || completedIds.has(selectedLesson.id)) return;
    setMarking(true);
    setMarkError('');
    const { error } = await supabase.from('lesson_progress').insert({
      student_id: session.user.id,
      lesson_id: selectedLesson.id,
    });
    setMarking(false);
    if (!error) {
      setCompletedIds((prev) => new Set(prev).add(selectedLesson.id));
    } else {
      setMarkError('Could not mark this lesson complete. Please try again.');
    }
  }

  function goTo(offset) {
    const nextIndex = selectedIndex + offset;
    if (nextIndex >= 0 && nextIndex < lessons.length) {
      setSelectedLessonId(lessons[nextIndex].id);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-mist dark:bg-navy-deep">
        <div className="flex items-center gap-2 text-slatesoft dark:text-white/50 text-sm">
          <Loader2 size={16} className="animate-spin" /> Loading…
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen grid place-items-center bg-mist dark:bg-navy-deep text-center px-6">
        <div>
          <p className="text-sm text-red-500 mb-4">{error || 'Course not found.'}</p>
          <Link to="/student" className="text-sm font-semibold text-royal dark:text-accent hover:underline">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const embedUrl = youtubeEmbedUrl(selectedLesson?.video_url);

  return (
    <div className="min-h-screen bg-mist dark:bg-navy-deep">
      <header className="bg-white dark:bg-navy border-b border-navy/8 dark:border-white/10">
        <div className="container-px mx-auto max-w-8xl h-20 flex items-center justify-between">
          <div className="flex items-center gap-6 min-w-0">
            <Logo />
            <Link to="/student" className="inline-flex items-center gap-1.5 text-sm font-medium text-slatesoft dark:text-white/60 hover:text-navy dark:hover:text-white transition-colors shrink-0">
              <ArrowLeft size={15} /> Dashboard
            </Link>
          </div>
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <div className="w-32 h-1.5 rounded-full bg-navy/10 dark:bg-white/10 overflow-hidden">
              <div className="h-full bg-royal dark:bg-accent rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="text-xs font-mono text-slatesoft dark:text-white/50">{progressPct}%</span>
          </div>
        </div>
      </header>

      <div className="container-px mx-auto max-w-8xl py-8 grid lg:grid-cols-[300px_1fr] gap-6">
        {/* Curriculum sidebar */}
        <aside className="rounded-2xl border border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.04] p-4 h-fit lg:sticky lg:top-24">
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="font-display font-bold text-base text-navy dark:text-white px-2 mb-3 focus:outline-none"
          >
            {course.title}
          </h1>
          {lessons.length === 0 && (
            <p className="text-sm text-slatesoft dark:text-white/50 px-2">No lessons published yet.</p>
          )}
          <div className="space-y-4">
            {modules.map((m) => {
              const moduleLessons = lessons.filter((l) => l.module_id === m.id);
              return (
                <div key={m.id}>
                  <p className="px-2 text-xs font-mono uppercase tracking-wide text-slatesoft dark:text-white/40 mb-1.5">{m.title}</p>
                  {moduleLessons.length === 0 ? (
                    <p className="px-2 text-xs text-slatesoft dark:text-white/40 italic">No lessons yet</p>
                  ) : (
                    <div className="space-y-0.5">
                      {moduleLessons.map((l) => {
                        const isActive = l.id === selectedLessonId;
                        const isDone = completedIds.has(l.id);
                        return (
                          <button
                            key={l.id}
                            onClick={() => setSelectedLessonId(l.id)}
                            className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left text-sm transition-colors ${
                              isActive
                                ? 'bg-royal/10 dark:bg-accent/15 text-royal dark:text-accent font-semibold'
                                : 'text-navy/80 dark:text-white/70 hover:bg-mist dark:hover:bg-white/5'
                            }`}
                          >
                            {isDone ? (
                              <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                            ) : (
                              <Circle size={15} className="text-slatesoft/40 dark:text-white/25 shrink-0" />
                            )}
                            <span className="truncate">{l.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Lesson content */}
        <div className="rounded-2xl border border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.04] p-6 sm:p-8">
          {!selectedLesson ? (
            <p className="text-sm text-slatesoft dark:text-white/50">Select a lesson from the sidebar to get started.</p>
          ) : (
            <>
              <h2 className="font-display font-bold text-xl text-navy dark:text-white mb-4">{selectedLesson.title}</h2>

              {embedUrl ? (
                <div className="aspect-video rounded-xl overflow-hidden mb-5 bg-black">
                  <iframe
                    src={embedUrl}
                    title={selectedLesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              ) : selectedLesson.video_url ? (
                <a
                  href={selectedLesson.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mb-5 px-4 py-2.5 rounded-xl border border-navy/10 dark:border-white/15 text-sm font-semibold text-navy dark:text-white hover:border-royal/40 transition-colors"
                >
                  <PlayCircle size={16} /> Watch video <ExternalLink size={13} />
                </a>
              ) : null}

              {selectedLesson.content && (
                <p className="text-sm text-navy/80 dark:text-white/70 leading-relaxed whitespace-pre-wrap mb-5">
                  {selectedLesson.content}
                </p>
              )}

              {selectedLesson.resource_url && (
                <a
                  href={selectedLesson.resource_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mb-6 px-4 py-2.5 rounded-xl border border-navy/10 dark:border-white/15 text-sm font-semibold text-navy dark:text-white hover:border-royal/40 transition-colors"
                >
                  <Download size={15} /> Download resource
                </a>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-navy/5 dark:border-white/10">
                <div className="flex gap-2">
                  <button
                    onClick={() => goTo(-1)}
                    disabled={selectedIndex <= 0}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-navy/10 dark:border-white/15 text-sm font-semibold text-navy dark:text-white hover:border-royal/40 transition-colors disabled:opacity-40"
                  >
                    <ChevronLeft size={15} /> Previous
                  </button>
                  <button
                    onClick={() => goTo(1)}
                    disabled={selectedIndex >= lessons.length - 1}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-navy/10 dark:border-white/15 text-sm font-semibold text-navy dark:text-white hover:border-royal/40 transition-colors disabled:opacity-40"
                  >
                    Next <ChevronRight size={15} />
                  </button>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <button
                    onClick={markComplete}
                    disabled={marking || completedIds.has(selectedLesson.id)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-grad-primary text-white text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-60"
                  >
                    <CheckCircle2 size={15} />
                    {completedIds.has(selectedLesson.id) ? 'Completed' : marking ? 'Marking…' : 'Mark Complete'}
                  </button>
                  {markError && (
                    <p role="alert" className="text-xs text-red-500 dark:text-red-400">
                      {markError}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

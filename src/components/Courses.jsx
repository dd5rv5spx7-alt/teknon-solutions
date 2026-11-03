import React, { useMemo, useState } from 'react';
import { Search, Code2, ArrowUpRight, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';
import SectionHeading from './SectionHeading.jsx';
import useInView from '../hooks/useInView.js';
import { COURSES, COURSE_CATEGORIES } from '../data/siteData.js';

// Curriculum tags to enrich course cards
const COURSE_TAGS = {
  'Python Development': ['Python 3.x', 'OOP', 'Automation', 'Libraries'],
  'Full Stack Web Development': ['React 19', 'Node.js', 'PostgreSQL', 'Tailwind'],
  'Frontend Development': ['React', 'TypeScript', 'Responsive UI', 'Vite'],
  'Backend Development': ['Express', 'REST APIs', 'Auth', 'Databases'],
  'Java Programming': ['Core Java', 'OOP', 'Collections', 'Enterprise'],
  'Flutter App Development': ['Dart', 'Cross-Platform', 'iOS & Android', 'State'],
  'React Development': ['Hooks', 'Modern SPA', 'Component Architecture'],
  'Node.js': ['Async JS', 'REST APIs', 'Serverless', 'Microservices'],
  'Cybersecurity': ['Network Defense', 'Threat Analysis', 'Protocols'],
  'Ethical Hacking': ['Penetration Testing', 'OWASP Top 10', 'Audits'],
  'AI & Machine Learning': ['ML Models', 'Python ML', 'Generative AI', 'Pipelines'],
  'Cloud Computing': ['AWS Architecture', 'Cloud Storage', 'IAM & VPC'],
  'Data Structures & Algorithms': ['Problem Solving', 'Time Complexity', 'Interviews'],
  'Interview Preparation': ['Mock Interviews', 'Resume Polish', 'HR Strategy'],
  'Git & GitHub': ['Version Control', 'Pull Requests', 'Team Collaboration'],
  'DevOps': ['Docker', 'CI/CD Pipelines', 'Linux Server Admin'],
};

export default function Courses() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [ref, isInView] = useInView();

  const filtered = useMemo(() => {
    return COURSES.filter((course) => {
      const matchesCategory = category === 'All' || course.category === category;
      const matchesQuery =
        course.title.toLowerCase().includes(query.trim().toLowerCase()) ||
        course.desc.toLowerCase().includes(query.trim().toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <section id="courses" className="py-28 sm:py-32 bg-mist/50 dark:bg-navy-deep relative overflow-hidden">
      <div className="container-px mx-auto max-w-8xl">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            index="06"
            label="Featured Curriculums"
            title="Pick a Course, Build Live Projects"
            subtitle="Every course is paired with practical lab sessions, mentorship, and a production portfolio project."
          />

          <div className="relative w-full sm:w-80">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slatesoft dark:text-white/40" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses or skills..."
              aria-label="Search courses"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-navy/10 dark:border-white/15 bg-white dark:bg-white/5 text-navy dark:text-white placeholder:text-slatesoft dark:placeholder:text-white/55 text-sm focus:border-royal/50 transition-colors shadow-sm"
            />
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="mt-8 flex flex-wrap gap-2">
          {COURSE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wide border transition-all duration-200 ${
                category === cat
                  ? 'bg-grad-primary text-white border-transparent shadow-glow-sm scale-[1.02]'
                  : 'bg-white dark:bg-white/5 border-navy/10 dark:border-white/10 text-slatesoft dark:text-white/70 hover:border-royal/40 hover:text-royal dark:hover:text-accent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Course Cards Grid */}
        <div ref={ref} className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((course, i) => {
            const tags = COURSE_TAGS[course.title] || ['Practical Labs', 'Project Work', 'Certification'];

            return (
              <a
                href="#contact"
                key={course.title}
                className={`reveal ${isInView ? 'in-view' : ''} reveal-delay-${(i % 6) + 1} group rounded-2xl border border-navy/10 dark:border-white/10 p-6 hover:border-royal/40 hover:shadow-card-lg transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-white/[0.03] flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="w-11 h-11 grid place-items-center rounded-xl bg-royal/10 dark:bg-accent/15 text-royal dark:text-accent group-hover:bg-grad-primary group-hover:text-white transition-colors duration-300">
                      <Code2 size={19} />
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-royal dark:text-accent font-semibold bg-royal/5 dark:bg-accent/10 px-2.5 py-1 rounded-md">
                      {course.category}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display font-bold text-navy dark:text-white text-lg group-hover:text-royal dark:group-hover:text-accent transition-colors">
                    {course.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slatesoft dark:text-white/60 leading-relaxed">
                    {course.desc}
                  </p>

                  {/* Syllabus / Tech Chips */}
                  <div className="mt-4 pt-4 border-t border-navy/5 dark:border-white/10 flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-mist dark:bg-white/5 text-navy/70 dark:text-white/60 font-mono text-[10px] tracking-wide"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3 flex items-center justify-between text-xs font-semibold text-royal dark:text-accent group-hover:underline">
                  <span className="inline-flex items-center gap-1.5">
                    <BookOpen size={13} /> Inquire for Curriculum
                  </span>
                  <ArrowUpRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </div>
              </a>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-full text-center py-20 bg-white dark:bg-white/5 rounded-2xl border border-navy/10 dark:border-white/10 p-8">
              <p className="text-base text-navy dark:text-white font-semibold">
                No courses match &ldquo;{query}&rdquo; in this category.
              </p>
              <p className="text-xs text-slatesoft dark:text-white/50 mt-1">
                Try searching for Python, Full Stack, Java, AI, or clear your filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setCategory('All');
                }}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-grad-primary text-white text-xs font-semibold hover:brightness-110 transition-all"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

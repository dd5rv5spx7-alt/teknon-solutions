import React, { useMemo, useState } from 'react';
import { Search, Code2, ArrowUpRight } from 'lucide-react';
import SectionHeading from './SectionHeading.jsx';
import useInView from '../hooks/useInView.js';
import { COURSES, COURSE_CATEGORIES } from '../data/siteData.js';

export default function Courses() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [ref, isInView] = useInView();

  const filtered = useMemo(() => {
    return COURSES.filter((course) => {
      const matchesCategory = category === 'All' || course.category === category;
      const matchesQuery = course.title.toLowerCase().includes(query.trim().toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <section id="courses" className="py-28 sm:py-32 bg-white dark:bg-navy">
      <div className="container-px mx-auto max-w-8xl">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            index="06"
            label="Featured courses"
            title="Pick a Course, Start Building"
            subtitle="Every course pairs theory with a real project — filter by what you want to learn."
          />

          <div className="relative w-full sm:w-72">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slatesoft dark:text-white/40" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-navy/10 dark:border-white/15 bg-mist dark:bg-white/5 text-navy dark:text-white placeholder:text-slatesoft dark:placeholder:text-white/55 text-sm focus:outline-none focus:border-royal/50 transition-colors"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2.5">
          {COURSE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wide border transition-colors ${
                category === cat
                  ? 'bg-grad-primary text-white border-transparent'
                  : 'border-navy/10 dark:border-white/15 text-slatesoft dark:text-white/60 hover:border-royal/40 hover:text-royal dark:hover:text-accent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div ref={ref} className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((course, i) => (
            <a
              href="#contact"
              key={course.title}
              className={`reveal ${isInView ? 'in-view' : ''} reveal-delay-${(i % 6) + 1} group rounded-2xl border border-navy/8 dark:border-white/10 p-6 hover:border-royal/30 hover:shadow-card transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-white/[0.03]`}
            >
              <div className="flex items-start justify-between">
                <span className="w-10 h-10 grid place-items-center rounded-xl bg-royal/10 dark:bg-accent/15 text-royal dark:text-accent">
                  <Code2 size={17} />
                </span>
                <ArrowUpRight
                  size={17}
                  className="text-slatesoft/50 dark:text-white/30 group-hover:text-royal dark:group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                />
              </div>
              <span className="mt-4 inline-block font-mono text-[10px] uppercase tracking-wide text-slatesoft dark:text-white/40">
                {course.category}
              </span>
              <h3 className="mt-1.5 font-display font-bold text-navy dark:text-white text-[15px]">
                {course.title}
              </h3>
              <p className="mt-2 text-sm text-slatesoft dark:text-white/55 leading-relaxed">{course.desc}</p>
            </a>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-slatesoft dark:text-white/50">
              No courses match &ldquo;{query}&rdquo; in this category yet — try a different search.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

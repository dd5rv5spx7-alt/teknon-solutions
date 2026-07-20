import React from 'react';
import SectionHeading from './SectionHeading.jsx';
import useInView from '../hooks/useInView.js';
import { STUDENT_BENEFITS } from '../data/siteData.js';

export default function Benefits() {
  const [ref, isInView] = useInView();

  return (
    <section className="py-28 sm:py-32 bg-mist dark:bg-navy-deep">
      <div className="container-px mx-auto max-w-8xl">
        <SectionHeading
          index="07"
          label="Student benefits"
          title="Everything That Comes With Enrolling"
          align="center"
        />

        <div ref={ref} className="mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {STUDENT_BENEFITS.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`reveal ${isInView ? 'in-view' : ''} reveal-delay-${(i % 6) + 1} flex flex-col items-center text-center gap-3 rounded-2xl bg-white dark:bg-white/[0.04] border border-navy/8 dark:border-white/10 px-5 py-7 hover:border-royal/30 hover:-translate-y-1 transition-all duration-300`}
              >
                <span className="w-12 h-12 grid place-items-center rounded-xl bg-royal/10 dark:bg-accent/15 text-royal dark:text-accent">
                  <Icon size={20} strokeWidth={2.1} />
                </span>
                <span className="text-sm font-semibold text-navy dark:text-white leading-snug">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

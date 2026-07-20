import React from 'react';
import { GraduationCap } from 'lucide-react';
import SectionHeading from './SectionHeading.jsx';
import useInView from '../hooks/useInView.js';
import { ABOUT_HIGHLIGHTS } from '../data/siteData.js';

export default function About() {
  const [gridRef, gridInView] = useInView();
  const [cardsRef, cardsInView] = useInView();

  return (
    <section id="about" className="relative py-28 sm:py-32 bg-white dark:bg-navy overflow-hidden">
      <div className="container-px mx-auto max-w-8xl">
        <div className="grid lg:grid-cols-2 gap-14 items-start">
          <div>
            <SectionHeading index="01" label="Who we are" title="Who We Are" />

            <p className="mt-6 text-slatesoft dark:text-white/65 leading-relaxed text-base sm:text-lg max-w-xl">
              A Teknon Solutions is an IT education and training provider dedicated to transforming
              students into industry-ready professionals. Our programs combine expert mentorship,
              practical experience, live projects, and career guidance to prepare learners for
              success in today&rsquo;s technology-driven world.
            </p>

            <div ref={gridRef} className="mt-9 grid sm:grid-cols-2 gap-3.5 max-w-xl">
              {ABOUT_HIGHLIGHTS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className={`reveal ${gridInView ? 'in-view' : ''} reveal-delay-${Math.min(i + 1, 6)} flex items-center gap-3 rounded-xl border border-navy/8 dark:border-white/10 px-4 py-3.5 bg-mist/60 dark:bg-white/5`}
                  >
                    <span className="w-9 h-9 shrink-0 grid place-items-center rounded-lg bg-royal/10 dark:bg-accent/15 text-royal dark:text-accent">
                      <Icon size={17} strokeWidth={2.2} />
                    </span>
                    <span className="text-sm font-semibold text-navy dark:text-white">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:pl-6 lg:pt-16">
            <div className="rounded-3xl bg-grad-navy p-8 shadow-card-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-dot-grid opacity-30" aria-hidden="true" />
              <div className="relative">
                <span className="w-14 h-14 rounded-2xl bg-grad-primary grid place-items-center font-display font-extrabold text-white text-xl shadow-glow-lg">
                  WA
                </span>
                <p className="mt-6 text-white/85 text-lg leading-relaxed font-display font-medium">
                  &ldquo;We built A Teknon Solutions to close the gap academics leave open &mdash;
                  real mentors, real projects, real career outcomes.&rdquo;
                </p>
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="font-semibold text-white">William Carie Amudala</p>
                  <p className="font-mono text-xs tracking-wide text-white/50 mt-0.5">
                    Founder &amp; CEO, A Teknon Solutions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div ref={cardsRef} className="mt-10 grid sm:grid-cols-2 gap-6">
          <div className={`reveal ${cardsInView ? 'in-view' : ''} rounded-2xl border border-navy/8 dark:border-white/10 p-7 bg-mist/50 dark:bg-white/5`}>
            <span className="eyebrow text-royal dark:text-accent">
              <GraduationCap size={14} /> Mission
            </span>
            <p className="mt-3 text-navy dark:text-white/80 leading-relaxed">
              Empowering students with industry-ready skills through practical internships, expert
              mentorship, real-world projects, and career-focused training.
            </p>
          </div>
          <div className={`reveal reveal-delay-2 ${cardsInView ? 'in-view' : ''} rounded-2xl border border-navy/8 dark:border-white/10 p-7 bg-mist/50 dark:bg-white/5`}>
            <span className="eyebrow text-royal dark:text-accent">
              <GraduationCap size={14} /> Vision
            </span>
            <p className="mt-3 text-navy dark:text-white/80 leading-relaxed">
              To become India&rsquo;s most trusted technology education platform by helping
              students bridge the gap between academics and industry.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

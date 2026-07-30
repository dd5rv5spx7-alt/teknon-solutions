import React from 'react';
import { Info } from 'lucide-react';
import SectionHeading from '../SectionHeading.jsx';
import useInView from '../../hooks/useInView.js';
import { SOLUTIONS_CASE_STUDIES } from '../../data/solutionsData.js';

function CaseStudyCard({ study, index, isInView }) {
  return (
    <div
      className={`reveal ${isInView ? 'in-view' : ''} reveal-delay-${(index % 6) + 1} rounded-2xl border border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.04] p-6 sm:p-7 flex flex-col`}
    >
      <span className="w-fit inline-flex items-center gap-1.5 mb-4 px-3 py-1 rounded-full bg-gold/15 text-amber-600 dark:text-gold text-[11px] font-bold tracking-wide">
        <Info size={12} strokeWidth={2.5} />
        {study.badge}
      </span>

      <h3 className="font-display font-bold text-lg text-navy dark:text-white">{study.title}</h3>

      <div className="mt-5 space-y-4 flex-1">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-slatesoft dark:text-white/40">Problem</span>
          <p className="mt-1.5 text-sm text-slatesoft dark:text-white/60 leading-relaxed">{study.problem}</p>
        </div>
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-slatesoft dark:text-white/40">Solution</span>
          <p className="mt-1.5 text-sm text-slatesoft dark:text-white/60 leading-relaxed">{study.solution}</p>
        </div>
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-slatesoft dark:text-white/40">Result</span>
          <p className="mt-1.5 text-sm text-slatesoft dark:text-white/60 leading-relaxed">{study.result}</p>
        </div>
      </div>
    </div>
  );
}

export default function SolutionsCaseStudies() {
  const [ref, isInView] = useInView();

  return (
    <section className="py-28 sm:py-32 bg-mist dark:bg-navy-deep">
      <div className="container-px mx-auto max-w-8xl">
        <SectionHeading
          index="05"
          label="Proof, not promises"
          title="Systems We've Actually Built"
          subtitle="A look at real systems running in our own production stack — a preview of the craft behind a client engagement."
        />

        <div ref={ref} className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SOLUTIONS_CASE_STUDIES.map((study, i) => (
            <CaseStudyCard key={study.title} study={study} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}

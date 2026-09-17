import React from 'react';
import SectionHeading from '../SectionHeading';
import useInView from '../../hooks/useInView';
import { DM_CASE_STUDIES } from '../../data/digitalMarketingData';

const CaseStudyCard = ({ study, index }) => {
  const [ref, isInView] = useInView();

  return (
    <div
      ref={ref}
      className={`reveal ${isInView ? 'in-view' : ''} rounded-2xl border border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.04] p-6 sm:p-8 flex flex-col h-full shadow-card hover:shadow-card-lg transition-shadow duration-300`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span className="inline-block px-3 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-full bg-gold/20 text-yellow-600 dark:text-gold border border-gold/30">
          Sample Case Study
        </span>
        <span className="text-xs sm:text-sm text-slatesoft dark:text-white/60 font-medium">
          {study.industry}
        </span>
      </div>

      <h3 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-navy dark:text-white mb-8">
        {study.client}
      </h3>

      <div className="flex-1 flex flex-col gap-6">
        <div>
          <span className="block text-xs font-bold uppercase tracking-wider text-royal dark:text-accent mb-2">
            Challenge
          </span>
          <p className="text-sm sm:text-base text-slatesoft dark:text-white/70">
            {study.challenge}
          </p>
        </div>

        <div className="h-px w-full bg-navy/5 dark:bg-white/5"></div>

        <div>
          <span className="block text-xs font-bold uppercase tracking-wider text-royal dark:text-accent mb-2">
            Strategy
          </span>
          <p className="text-sm sm:text-base text-slatesoft dark:text-white/70">
            {study.strategy}
          </p>
        </div>

        <div className="h-px w-full bg-navy/5 dark:bg-white/5"></div>

        <div>
          <span className="block text-xs font-bold uppercase tracking-wider text-royal dark:text-accent mb-2">
            Execution
          </span>
          <p className="text-sm sm:text-base text-slatesoft dark:text-white/70">
            {study.execution}
          </p>
        </div>

        <div className="h-px w-full bg-navy/5 dark:bg-white/5"></div>

        <div>
          <span className="block text-xs font-bold uppercase tracking-wider text-royal dark:text-accent mb-2">
            Result
          </span>
          <p className="text-sm sm:text-base text-navy dark:text-white font-medium">
            {study.result}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function DMCaseStudies() {
  return (
    <section id="dm-cases" className="py-28 sm:py-32 bg-mist dark:bg-navy-deep relative overflow-hidden">
      <div className="container-px mx-auto max-w-8xl relative z-10">
        <SectionHeading
          index="09"
          label="Case studies"
          title="Real-World Applications"
          subtitle="See how digital strategy comes together in practice."
          align="center"
        />

        <div className="mt-16 sm:mt-24 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {DM_CASE_STUDIES.map((study, index) => (
            <CaseStudyCard key={index} study={study} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

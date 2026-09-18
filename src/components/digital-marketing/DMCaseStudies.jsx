import React from 'react';
import SectionHeading from '../SectionHeading';
import useInView from '../../hooks/useInView';
import { DM_CASE_STUDIES } from '../../data/digitalMarketingData';
import { Target, Compass, Zap, CheckCircle2, Tag } from 'lucide-react';

const CaseStudyCard = ({ study, index }) => {
  const [ref, isInView] = useInView();

  return (
    <div
      ref={ref}
      className={`reveal ${isInView ? 'in-view' : ''} rounded-3xl border border-navy/10 dark:border-white/10 bg-white dark:bg-white/[0.04] p-6 sm:p-8 flex flex-col justify-between h-full shadow-card hover:shadow-card-lg transition-all duration-300 relative`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div>
        {/* Header badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider rounded-md bg-gold/15 text-yellow-700 dark:text-gold border border-gold/30">
            Sample Case Study
          </span>
          <span className="text-xs font-semibold text-slatesoft dark:text-white/60">
            {study.industry}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-navy dark:text-white mb-4">
          {study.client}
        </h3>

        {/* Services tags */}
        {study.services && study.services.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {study.services.map((svc, sIdx) => (
              <span
                key={sIdx}
                className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-royal/8 dark:bg-accent/10 text-royal dark:text-accent"
              >
                <Tag size={10} />
                {svc}
              </span>
            ))}
          </div>
        )}

        {/* Breakdown sections */}
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="p-3.5 rounded-xl bg-navy/[0.02] dark:bg-white/[0.02] border border-navy/5 dark:border-white/5">
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-navy/70 dark:text-white/70 mb-1.5 font-mono">
              <Target size={13} className="text-rose-500" />
              Challenge
            </span>
            <p className="text-slatesoft dark:text-white/70 leading-relaxed">
              {study.challenge}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-navy/[0.02] dark:bg-white/[0.02] border border-navy/5 dark:border-white/5">
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-navy/70 dark:text-white/70 mb-1.5 font-mono">
              <Compass size={13} className="text-royal dark:text-accent" />
              Strategy
            </span>
            <p className="text-slatesoft dark:text-white/70 leading-relaxed">
              {study.strategy}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-navy/[0.02] dark:bg-white/[0.02] border border-navy/5 dark:border-white/5">
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-navy/70 dark:text-white/70 mb-1.5 font-mono">
              <Zap size={13} className="text-amber-500" />
              Execution
            </span>
            <p className="text-slatesoft dark:text-white/70 leading-relaxed">
              {study.execution}
            </p>
          </div>
        </div>
      </div>

      {/* Outcome Container */}
      <div className="mt-6 pt-4 border-t border-navy/8 dark:border-white/10">
        <div className="p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-emerald-950 dark:text-emerald-200">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">
            <CheckCircle2 size={13} />
            Outcome
          </div>
          <p className="text-xs sm:text-sm font-medium leading-relaxed">
            {study.outcome || study.result}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function DMCaseStudies() {
  return (
    <section id="dm-cases" className="py-24 sm:py-32 bg-mist dark:bg-navy-deep relative overflow-hidden">
      <div className="container-px mx-auto max-w-7xl relative z-10">
        <SectionHeading
          index="09"
          label="Selected work"
          title="Selected Case Studies"
          subtitle="Real-world strategy and execution frameworks applied to business growth."
          align="center"
        />

        <div className="mt-14 sm:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {DM_CASE_STUDIES.map((study, index) => (
            <CaseStudyCard key={index} study={study} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

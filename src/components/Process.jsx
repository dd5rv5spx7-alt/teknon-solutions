import React from 'react';
import SectionHeading from './SectionHeading.jsx';
import useInView from '../hooks/useInView.js';
import { PROCESS_STEPS } from '../data/siteData.js';

function StepRow({ step, isLast, isInView, delay }) {
  const Icon = step.icon;
  return (
    <div className={`reveal ${isInView ? 'in-view' : ''} ${delay} relative flex gap-6 pb-12 last:pb-0`}>
      {!isLast && (
        <span
          className="absolute left-[27px] top-14 bottom-0 w-px bg-gradient-to-b from-white/25 to-white/5"
          aria-hidden="true"
        />
      )}
      <span className="relative shrink-0 w-14 h-14 rounded-2xl glass grid place-items-center text-accent">
        <Icon size={22} strokeWidth={2} />
      </span>
      <div className="pt-1.5">
        <span className="font-mono text-xs tracking-[0.2em] text-white/40">STEP {step.step}</span>
        <h3 className="mt-1 font-display font-bold text-xl text-white">{step.title}</h3>
        <p className="mt-1.5 text-white/60 leading-relaxed max-w-md">{step.desc}</p>
      </div>
    </div>
  );
}

export default function Process() {
  const [ref, isInView] = useInView();

  return (
    <section className="py-28 sm:py-32 bg-grad-navy relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-grid opacity-30" aria-hidden="true" />
      <div className="relative container-px mx-auto max-w-8xl grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-16">
        <div>
          <SectionHeading
            index="05"
            label="How it works"
            title="Your Training Process, Start to Finish"
            subtitle="Six steps stand between where you are now and a portfolio you're proud of."
            light
          />
        </div>

        <div ref={ref}>
          {PROCESS_STEPS.map((step, i) => (
            <StepRow
              key={step.step}
              step={step}
              isLast={i === PROCESS_STEPS.length - 1}
              isInView={isInView}
              delay={`reveal-delay-${Math.min(i + 1, 6)}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import useInView from '../hooks/useInView.js';
import useCountUp from '../hooks/useCountUp.js';
import { STATS } from '../data/siteData.js';

function StatCard({ value, suffix, label, isInView, delayClass }) {
  const count = useCountUp(value, { start: isInView, duration: 1500 });
  return (
    <div className={`text-center px-4 py-2 reveal ${isInView ? 'in-view' : ''} ${delayClass}`}>
      <div className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
        {count}
        <span className="text-accent">{suffix}</span>
      </div>
      <div className="mt-1.5 font-mono text-[11px] sm:text-xs tracking-wider uppercase text-white/55">
        {label}
      </div>
    </div>
  );
}

export default function Stats() {
  const [ref, isInView] = useInView({ threshold: 0.3 });

  return (
    <div className="relative z-10 -mt-24 sm:-mt-28">
      <div className="container-px mx-auto max-w-8xl">
        <div
          ref={ref}
          className="bg-grad-navy rounded-3xl shadow-card-lg px-6 sm:px-10 py-9 sm:py-11 grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 border border-white/10"
        >
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} {...stat} isInView={isInView} delayClass={`reveal-delay-${i + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

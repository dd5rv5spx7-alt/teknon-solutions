import React from 'react';
import SectionHeading from './SectionHeading.jsx';
import useInView from '../hooks/useInView.js';
import { TECHNOLOGIES } from '../data/siteData.js';

function getInitials(name) {
  const words = name.split(/[\s/]+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function TechPill({ name }) {
  return (
    <span className="group inline-flex items-center gap-2.5 rounded-full border border-navy/10 dark:border-white/10 bg-white dark:bg-white/5 pl-1.5 pr-4 py-1.5 hover:border-royal/40 hover:shadow-soft transition-all duration-200 hover:-translate-y-0.5">
      <span className="w-7 h-7 shrink-0 grid place-items-center rounded-full bg-grad-primary text-white text-[10px] font-mono font-bold">
        {getInitials(name)}
      </span>
      <span className="text-sm font-medium text-navy dark:text-white/85 whitespace-nowrap">{name}</span>
    </span>
  );
}

function TechGroup({ title, items, isInView, delay }) {
  return (
    <div className={`reveal ${isInView ? 'in-view' : ''} ${delay}`}>
      <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-slatesoft dark:text-white/40 mb-4">
        {title}
      </h3>
      <div className="flex flex-wrap gap-3">
        {items.map((name) => (
          <TechPill key={name} name={name} />
        ))}
      </div>
    </div>
  );
}

export default function Technologies() {
  const [ref, isInView] = useInView();

  return (
    <section id="technologies" className="py-28 sm:py-32 bg-mist dark:bg-navy-deep">
      <div className="container-px mx-auto max-w-8xl">
        <SectionHeading
          index="04"
          label="Tech we teach"
          title="Learn In-Demand Technologies"
          subtitle="A stack that mirrors what real product and engineering teams use every day."
        />

        <div ref={ref} className="mt-14 space-y-10">
          <TechGroup title="Programming Languages" items={TECHNOLOGIES.languages} isInView={isInView} delay="reveal-delay-1" />
          <TechGroup title="Frameworks & Tools" items={TECHNOLOGIES.tools} isInView={isInView} delay="reveal-delay-2" />
          <TechGroup title="Emerging Tech" items={TECHNOLOGIES.emerging} isInView={isInView} delay="reveal-delay-3" />
        </div>
      </div>
    </section>
  );
}

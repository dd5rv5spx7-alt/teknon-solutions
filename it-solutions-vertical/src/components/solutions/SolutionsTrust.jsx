import React from 'react';
import SectionHeading from '../SectionHeading.jsx';
import useInView from '../../hooks/useInView.js';
import { SOLUTIONS_TRUST_POINTS } from '../../data/solutionsData.js';

function TrustCard({ item, index, isInView }) {
  const Icon = item.icon;
  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--x', `${((e.clientX - r.left) / r.width) * 100}%`);
    e.currentTarget.style.setProperty('--y', `${((e.clientY - r.top) / r.height) * 100}%`);
  };
  return (
    <div
      onMouseMove={handleMove}
      className={`reveal ${isInView ? 'in-view' : ''} reveal-delay-${(index % 6) + 1} spotlight edge-accent group relative rounded-2xl border border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.04] p-6 hover:border-royal/30 hover:shadow-card transition-all duration-300 hover:-translate-y-1`}
    >
      <span className="w-11 h-11 grid place-items-center rounded-xl bg-royal/10 dark:bg-accent/15 text-royal dark:text-accent group-hover:bg-grad-primary group-hover:text-white transition-colors duration-300">
        <Icon size={19} strokeWidth={2.1} />
      </span>
      <h3 className="mt-4 font-display font-bold text-navy dark:text-white text-[15px]">
        {item.title}
      </h3>
      <p className="mt-2 text-sm text-slatesoft dark:text-white/60 leading-relaxed">{item.desc}</p>
    </div>
  );
}

export default function SolutionsTrust() {
  const [ref, isInView] = useInView();

  return (
    <section className="py-28 sm:py-32 bg-mist dark:bg-navy-deep">
      <div className="container-px mx-auto max-w-8xl">
        <SectionHeading
          index="04"
          label="Why work with us"
          title="Built to Be a Partner, Not Just a Vendor"
          subtitle="The same principles that shape our training programs shape how we run client engagements."
        />

        <div ref={ref} className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SOLUTIONS_TRUST_POINTS.map((item, i) => (
            <TrustCard key={item.title} item={item} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import SectionHeading from '../SectionHeading.jsx';
import useInView from '../../hooks/useInView.js';
import { SOLUTIONS_SERVICES } from '../../data/solutionsData.js';

function ServiceCard({ service, index, isInView }) {
  const Icon = service.icon;
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
        {service.name}
      </h3>
      <p className="mt-2 text-sm text-slatesoft dark:text-white/60 leading-relaxed">{service.description}</p>
    </div>
  );
}

export default function ServiceGrid() {
  const [ref, isInView] = useInView();

  return (
    <section id="services" className="py-28 sm:py-32 bg-white dark:bg-navy">
      <div className="container-px mx-auto max-w-8xl">
        <SectionHeading
          index="01"
          label="Services"
          title="What We Can Build for You"
          subtitle="Development, security, and cloud engineering services, delivered by the team behind our own production stack."
        />

        <div ref={ref} className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SOLUTIONS_SERVICES.map((service, i) => (
            <ServiceCard key={service.name} service={service} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}

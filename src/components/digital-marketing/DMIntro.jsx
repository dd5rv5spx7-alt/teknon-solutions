import React from 'react';
import SectionHeading from '../SectionHeading';
import useInView from '../../hooks/useInView';
import { DM_INTRO_PILLARS } from '../../data/digitalMarketingData';

export default function DMIntro() {
  const [ref, isInView] = useInView();

  return (
    <section id="dm-intro" className="py-28 sm:py-32 bg-white dark:bg-navy">
      <div className="container-px mx-auto max-w-8xl">
        <SectionHeading 
          label="Why It Matters"
          title="Why Digital Presence Matters."
          subtitle="We bring strategy, creativity, technology and digital execution together to help businesses build a stronger online presence."
          align="center"
        />

        <div 
          ref={ref}
          className={`mt-16 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 reveal ${isInView ? 'in-view' : ''}`}
        >
          {DM_INTRO_PILLARS.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={index}
                className="rounded-2xl border border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.04] p-6 sm:p-7 hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-navy/5 text-royal dark:bg-white/10 dark:text-accent shrink-0">
                  {Icon && <Icon className="w-6 h-6" />}
                </div>
                <h3 className="font-display font-bold text-lg text-navy dark:text-white mb-2">
                  {pillar.label || pillar.title}
                </h3>
                <p className="text-navy-light/70 dark:text-white/60 text-sm leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

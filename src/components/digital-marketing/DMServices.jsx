import React from 'react';
import SectionHeading from '../SectionHeading.jsx';
import useInView from '../../hooks/useInView.js';
import { DM_SERVICES } from '../../data/digitalMarketingData.js';

export default function DMServices() {
  const [ref, isInView] = useInView();

  return (
    <section id="dm-services" className="py-28 sm:py-32 bg-mist dark:bg-navy-deep">
      <div className="container-px mx-auto max-w-8xl">
        <SectionHeading 
          index="01" 
          label="What we do" 
          title="Full-Spectrum Digital Services" 
          subtitle="Every capability reinforces the next to maximize your market presence." 
          align="center" 
        />

        <div 
          ref={ref} 
          className={`reveal ${isInView ? 'in-view' : ''} mt-16 flex flex-wrap justify-center gap-6`}
        >
          {DM_SERVICES.map((service, idx) => {
            return (
              <div
                key={idx}
                className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] rounded-2xl border border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.04] p-6 sm:p-7 hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col items-start"
              >
                <div className="w-12 h-12 rounded-xl bg-royal/10 dark:bg-accent/15 grid place-items-center text-royal dark:text-accent mb-5">
                  {service.icon && <service.icon size={22} strokeWidth={1.8} />}
                </div>
                <h3 className="font-display font-bold text-base text-navy dark:text-white mb-2">
                  {service.name}
                </h3>
                <p className="text-slatesoft dark:text-white/60 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

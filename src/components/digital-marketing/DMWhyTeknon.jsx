import React from 'react';
import SectionHeading from '../SectionHeading';
import useInView from '../../hooks/useInView';
import { DM_WHY_TEKNON } from '../../data/digitalMarketingData';

const DMWhyTeknon = () => {
  const [ref, isInView] = useInView();

  return (
    <section id="dm-why" className="py-28 sm:py-32 bg-mist dark:bg-navy-deep">
      <div className="container-px mx-auto max-w-8xl">
        <SectionHeading
          index="07"
          label="Why us"
          title="Why Teknon Solutions?"
          subtitle="What makes working with us different."
          align="center"
        />

        <div
          ref={ref}
          className={`mt-16 sm:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 reveal ${
            isInView ? 'in-view' : ''
          }`}
        >
          {DM_WHY_TEKNON?.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.04] p-6 sm:p-8"
            >
              {item.icon && (
                <div className="mb-6 w-12 h-12 flex items-center justify-center rounded-xl bg-royal/10 dark:bg-accent/10 text-royal dark:text-accent">
                  <item.icon size={24} />
                </div>
              )}
              <h3 className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-navy dark:text-white mb-3">
                {item.title}
              </h3>
              <p className="text-slatesoft dark:text-white/70 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DMWhyTeknon;

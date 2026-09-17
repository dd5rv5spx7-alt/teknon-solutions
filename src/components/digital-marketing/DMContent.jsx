import React from 'react';
import SectionHeading from '../SectionHeading';
import useInView from '../../hooks/useInView';
import { DM_CONTENT_TYPES } from '../../data/digitalMarketingData';

const DMContent = () => {
  const [ref, isInView] = useInView();

  return (
    <section id="dm-content" className="py-28 sm:py-32 bg-white dark:bg-navy relative overflow-hidden">
      <div className="container-px mx-auto max-w-8xl relative z-10">
        <SectionHeading
          index="04"
          label="Content"
          title="Content That Makes People Stop Scrolling."
          subtitle="From static posts to cinematic reels — every piece is designed to capture attention and communicate your brand."
          align="center"
        />

        <div 
          ref={ref} 
          className={`reveal ${isInView ? 'in-view' : ''} mt-16 lg:mt-20 grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8`}
        >
          {DM_CONTENT_TYPES.map((content, idx) => {
            const Icon = content.icon;
            return (
              <div 
                key={idx}
                className="group relative rounded-2xl border border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.02] p-6 sm:p-10 flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-card hover:-translate-y-1 overflow-hidden"
              >
                {/* Subtle gradient background on hover */}
                <div className="absolute inset-0 bg-grad-primary opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 mb-6 flex items-center justify-center rounded-2xl bg-mist dark:bg-white/5 text-navy dark:text-white group-hover:text-royal dark:group-hover:text-accent transition-colors duration-300">
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-navy dark:text-white">
                    {content.label}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DMContent;

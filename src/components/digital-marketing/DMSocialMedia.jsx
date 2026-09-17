import React from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';
import SectionHeading from '../SectionHeading.jsx';
import useInView from '../../hooks/useInView.js';
import { DM_SOCIAL_WORKFLOW } from '../../data/digitalMarketingData.js';

export default function DMSocialMedia() {
  const [ref, isInView] = useInView();

  const days = [
    { label: 'Mon', height: '40%' },
    { label: 'Tue', height: '60%' },
    { label: 'Wed', height: '45%' },
    { label: 'Thu', height: '80%' },
    { label: 'Fri', height: '90%' },
    { label: 'Sat', height: '30%' },
    { label: 'Sun', height: '20%' },
  ];

  return (
    <section id="dm-social" className="py-28 sm:py-32 bg-white dark:bg-navy">
      <div className="container-px mx-auto max-w-8xl">
        <SectionHeading 
          index="02" 
          label="Social media" 
          title="Your Social Media Should Work for Your Business." 
          subtitle="Our social media team manages the process from strategy through execution." 
          align="left" 
        />

        <div ref={ref} className="mt-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-8 mb-20">
            {DM_SOCIAL_WORKFLOW.map((step, idx) => (
              <React.Fragment key={idx}>
                <div 
                  className={`reveal ${isInView ? 'in-view' : ''} flex-1 w-full rounded-2xl border border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.04] p-6 sm:p-8 flex flex-col items-center text-center`}
                  style={{ transitionDelay: `${idx * 150}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-royal/10 dark:bg-accent/15 grid place-items-center text-royal dark:text-accent mb-4">
                    {step.icon && typeof step.icon !== 'string' ? (
                      <step.icon className="w-6 h-6" />
                    ) : null}
                  </div>
                  <h4 className="font-display font-bold text-base text-navy dark:text-white mb-2">{step.title}</h4>
                  <p className="text-slatesoft dark:text-white/60 text-xs leading-relaxed">{step.description}</p>
                </div>
                {idx < DM_SOCIAL_WORKFLOW.length - 1 && (
                  <div 
                    className={`reveal ${isInView ? 'in-view' : ''} flex-shrink-0 text-navy/20 dark:text-white/20`}
                    style={{ transitionDelay: `${idx * 150 + 75}ms` }}
                  >
                    <ArrowRight className="hidden lg:block w-8 h-8" />
                    <ArrowDown className="block lg:hidden w-8 h-8" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className={`reveal ${isInView ? 'in-view' : ''} max-w-4xl mx-auto rounded-2xl bg-navy dark:bg-navy-deep p-8 shadow-glow-lg border border-white/10`} style={{ transitionDelay: '600ms' }}>
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/10">
              <h3 className="font-display font-bold text-xl text-white">Engagement Overview</h3>
              <span className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs font-mono font-medium tracking-wide">SAMPLE DASHBOARD</span>
            </div>
            
            <div className="h-64 flex items-end justify-between gap-2 sm:gap-6 pt-4">
              {days.map((day, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div className="w-full relative flex items-end justify-center h-full group">
                    <div 
                      className="w-full max-w-[3rem] rounded-t-lg bg-grad-primary opacity-80 group-hover:opacity-100 transition-all duration-300"
                      style={{ height: day.height }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-navy text-xs font-bold py-1 px-2 rounded whitespace-nowrap shadow-md">
                        {day.height}
                      </div>
                    </div>
                  </div>
                  <span className="mt-4 text-white/60 text-xs sm:text-sm font-medium">{day.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

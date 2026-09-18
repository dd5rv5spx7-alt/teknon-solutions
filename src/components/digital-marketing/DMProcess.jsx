import React from 'react';
import SectionHeading from '../SectionHeading';
import useInView from '../../hooks/useInView';
import { DM_PROCESS_STEPS } from '../../data/digitalMarketingData';
import * as LucideIcons from 'lucide-react';

const ProcessStep = ({ step, index }) => {
  const [ref, isInView] = useInView();
  const Icon = typeof step.icon === 'function' ? step.icon : (LucideIcons[step.icon] || LucideIcons.Circle);
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`reveal ${isInView ? 'in-view' : ''} relative flex flex-col md:flex-row md:justify-between w-full mb-12 sm:mb-16 last:mb-0`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Mobile timeline line */}
      <div className="absolute left-[23px] top-12 bottom-[-3rem] md:hidden w-[2px] bg-navy/10 dark:bg-white/10 z-0 last:bottom-0"></div>

      {/* Desktop Left Side */}
      <div className={`hidden md:block w-[45%] ${!isEven ? 'text-right pr-8' : 'pr-8'}`}>
        {!isEven && (
          <div className="rounded-2xl border border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.04] p-6 sm:p-8 shadow-card text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-royal/10 text-royal dark:bg-accent/10 dark:text-accent">
                <Icon size={24} />
              </div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-navy dark:text-white">
                {step.title}
              </h3>
            </div>
            <p className="text-slatesoft dark:text-white/70 font-sans leading-relaxed">
              {step.description || step.desc}
            </p>
          </div>
        )}
      </div>

      {/* Center Marker */}
      <div className="relative z-10 flex flex-col items-center flex-shrink-0 md:mx-auto">
        <div className="w-12 h-12 rounded-full bg-grad-primary text-white font-display font-bold grid place-items-center shadow-card-lg relative z-10">
          {index + 1}
        </div>
      </div>

      {/* Mobile & Desktop Right Side */}
      <div className="flex-1 pl-6 pt-2 md:pt-0 md:pl-0 md:w-[45%] md:flex-none">
        <div className={`${!isEven ? 'md:hidden' : ''} md:pl-8`}>
          <div className="rounded-2xl border border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.04] p-6 sm:p-8 shadow-card text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-royal/10 text-royal dark:bg-accent/10 dark:text-accent">
                <Icon size={24} />
              </div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-navy dark:text-white">
                {step.title}
              </h3>
            </div>
            <p className="text-slatesoft dark:text-white/70 font-sans leading-relaxed">
              {step.description || step.desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DMProcess() {
  return (
    <section id="dm-process" className="py-28 sm:py-32 bg-white dark:bg-navy overflow-hidden">
      <div className="container-px mx-auto max-w-8xl">
        <SectionHeading
          index="08"
          label="How we work"
          title="Our Process"
          subtitle="Six clear steps from discovery to growth."
          align="center"
        />
        
        <div className="relative mt-16 sm:mt-24 max-w-5xl mx-auto">
          {/* Desktop vertical line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-navy/10 dark:bg-white/10 -translate-x-1/2"></div>
          
          <div className="relative flex flex-col">
            {DM_PROCESS_STEPS.map((step, index) => (
              <ProcessStep key={index} step={step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

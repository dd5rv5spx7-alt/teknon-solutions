import React from 'react';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '../SectionHeading.jsx';
import useInView from '../../hooks/useInView.js';
import { DM_WEBSITE_TYPES, DM_WEBSITE_HIGHLIGHTS } from '../../data/digitalMarketingData.js';

const DMWebDev = () => {
  const [ref, isInView] = useInView();

  return (
    <section id="dm-webdev" className="py-28 sm:py-32 bg-mist dark:bg-navy-deep">
      <div className="container-px mx-auto max-w-8xl">
        <SectionHeading 
          index="05"
          label="Websites"
          title="Your Website Is Your Digital Headquarters."
          subtitle="We build modern, responsive websites that convert visitors into customers."
          align="left"
        />

        <div ref={ref} className={`mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 reveal ${isInView ? 'in-view' : ''}`}>
          
          {/* Left Column: Types */}
          <div className="space-y-6">
            <h3 className="font-display font-bold text-2xl text-navy dark:text-white">What We Build</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DM_WEBSITE_TYPES.map((type, idx) => (
                <div key={idx} className="rounded-2xl border border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.04] p-6 shadow-sm flex items-start gap-4">
                  <span className="text-royal/60 dark:text-accent/60 font-mono font-bold text-xl">{String(idx + 1).padStart(2, '0')}</span>
                  <div>
                    <h4 className="font-display font-bold text-navy dark:text-white text-lg">{type.title}</h4>
                    <p className="mt-1 text-sm text-slatesoft dark:text-white/70">{type.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Highlights */}
          <div className="space-y-6">
            <h3 className="font-display font-bold text-2xl text-navy dark:text-white">Our Standards</h3>
            <div className="grid grid-cols-2 gap-4">
              {DM_WEBSITE_HIGHLIGHTS.map((highlight, idx) => (
                <div key={idx} className="rounded-xl border border-navy/5 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] p-5 flex flex-col items-center text-center gap-3 transition-colors hover:bg-white dark:hover:bg-white/[0.04]">
                  <div className="w-10 h-10 rounded-full bg-navy/5 dark:bg-white/10 flex items-center justify-center text-royal dark:text-accent">
                    <highlight.icon size={20} strokeWidth={2} />
                  </div>
                  <span className="font-medium text-navy dark:text-white text-sm">{highlight.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="mt-16 flex justify-center">
          <a href="#dm-enquiry" className="btn-glow bg-grad-primary text-white px-8 py-4 rounded-full font-bold inline-flex items-center gap-2 hover:shadow-glow-lg transition-all">
            Build My Website
            <ArrowRight size={20} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default DMWebDev;

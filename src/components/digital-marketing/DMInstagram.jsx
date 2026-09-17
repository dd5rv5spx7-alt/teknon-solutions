import React from 'react';
import { Check } from 'lucide-react';
import SectionHeading from '../SectionHeading';
import useInView from '../../hooks/useInView';
import { DM_INSTAGRAM_FEATURES } from '../../data/digitalMarketingData';

const DMInstagram = () => {
  const [ref, isInView] = useInView();

  return (
    <section id="dm-instagram" className="py-28 sm:py-32 bg-mist dark:bg-navy-deep relative overflow-hidden">
      <div className="container-px mx-auto max-w-8xl relative z-10">
        <SectionHeading
          index="03"
          label="Instagram"
          title="Your Instagram. Built Like a Brand."
          subtitle="We don't simply create an Instagram account. We create a professional digital storefront that represents your business."
          align="left"
        />

        <div 
          ref={ref} 
          className={`reveal ${isInView ? 'in-view' : ''} mt-16 lg:mt-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center`}
        >
          {/* Left Column - Visual Comparison */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-royal/5 dark:bg-royal/10 blur-3xl rounded-full -z-10 pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-4 items-center justify-center">
              {/* Before Mockup */}
              <div className="relative w-full max-w-[240px] sm:w-[220px] rounded-3xl border border-navy/10 dark:border-white/10 bg-white dark:bg-navy p-4 shadow-card">
                <div className="absolute -top-3 -left-3 z-10 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-red-200 dark:border-red-800/50">
                  Before
                </div>
                
                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-700/50" />
                  <div className="flex-1 space-y-2">
                    <div className="w-full h-3 bg-slate-200 dark:bg-slate-700/50 rounded" />
                    <div className="w-2/3 h-3 bg-slate-200 dark:bg-slate-700/50 rounded" />
                  </div>
                </div>
                {/* Bio */}
                <div className="space-y-1.5 mb-6">
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800/50 rounded" />
                  <div className="w-5/6 h-2 bg-slate-100 dark:bg-slate-800/50 rounded" />
                  <div className="w-4/6 h-2 bg-slate-100 dark:bg-slate-800/50 rounded" />
                </div>
                {/* Grid */}
                <div className="grid grid-cols-3 gap-1">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-square bg-slate-100 dark:bg-slate-800/50 rounded-sm" />
                  ))}
                </div>
              </div>

              {/* Arrow on mobile (down) or desktop (right) */}
              <div className="text-slate-300 dark:text-slate-600 sm:rotate-0 rotate-90">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* After Mockup */}
              <div className="relative w-full max-w-[240px] sm:w-[220px] rounded-3xl border border-navy/10 dark:border-white/10 bg-white dark:bg-navy p-4 shadow-card-lg sm:-mt-8">
                <div className="absolute -top-3 -right-3 z-10 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-green-200 dark:border-green-800/50">
                  After
                </div>
                
                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-grad-primary p-[2px]">
                    <div className="w-full h-full rounded-full border-2 border-white dark:border-navy bg-navy dark:bg-navy-deep" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="w-full h-3 bg-navy/80 dark:bg-white/80 rounded" />
                    <div className="w-2/3 h-3 bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                </div>
                {/* Bio */}
                <div className="space-y-1.5 mb-4">
                  <div className="w-full h-2 bg-slate-800/60 dark:bg-slate-300/60 rounded" />
                  <div className="w-5/6 h-2 bg-slate-800/60 dark:bg-slate-300/60 rounded" />
                  <div className="w-4/6 h-2 bg-royal/60 dark:bg-accent/60 rounded" />
                </div>
                {/* Highlights */}
                <div className="flex justify-between mb-4 px-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
                  ))}
                </div>
                {/* Grid */}
                <div className="grid grid-cols-3 gap-1">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={`aspect-square rounded-sm ${i % 2 === 0 ? 'bg-royal/10 dark:bg-royal/20' : 'bg-slate-100 dark:bg-slate-800/50'}`} />
                  ))}
                </div>
              </div>
            </div>
            
            <p className="text-center text-xs font-mono text-slatesoft dark:text-white/40 mt-8 uppercase tracking-widest">
              Demo Example
            </p>
          </div>

          {/* Right Column - Features List */}
          <div className="flex flex-col justify-center">
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-navy dark:text-white mb-8">
              A Complete Brand Setup.
            </h3>
            <ul className="space-y-5">
              {DM_INSTAGRAM_FEATURES.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 mt-1 w-6 h-6 rounded-full bg-royal/10 dark:bg-accent/10 flex items-center justify-center group-hover:bg-royal group-hover:dark:bg-accent transition-colors duration-300">
                    <Check className="w-3.5 h-3.5 text-royal dark:text-accent group-hover:text-white transition-colors duration-300" />
                  </div>
                  <span className="text-base sm:text-lg text-slatesoft dark:text-white/70">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DMInstagram;

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

        {/* ── 6 Full-Width Website Types Cards ─────────────── */}
        <div ref={ref} className={`mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 reveal ${isInView ? 'in-view' : ''}`}>
          {DM_WEBSITE_TYPES.map((type, idx) => {
            const Icon = type.icon;
            const number = String(idx + 1).padStart(2, '0');
            const badges = [
              'Enterprise Trust & Structure',
              'Local Lead Generation',
              'High-Converting Single Page',
              'Catalogue & Payment Ready',
              'Visual Impact Showcase',
              'Bespoke Business Workflows'
            ];
            return (
              <div 
                key={idx} 
                className="group rounded-3xl border border-navy/10 dark:border-white/10 bg-white dark:bg-white/[0.04] p-7 shadow-sm hover:shadow-card-lg hover:border-royal/30 dark:hover:border-accent/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-royal/10 dark:bg-accent/15 grid place-items-center text-royal dark:text-accent group-hover:scale-110 transition-transform">
                      <Icon size={22} strokeWidth={2} />
                    </div>
                    <span className="text-royal/60 dark:text-accent/60 font-mono font-extrabold text-base bg-navy/5 dark:bg-white/10 px-3 py-1 rounded-full">
                      {number}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-navy dark:text-white mb-2.5 group-hover:text-royal dark:group-hover:text-accent transition-colors">
                    {type.title}
                  </h3>
                  <p className="text-sm text-slatesoft dark:text-white/65 leading-relaxed">
                    {type.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-navy/5 dark:border-white/5 flex items-center justify-between">
                  <span className="text-xs font-mono text-slatesoft/80 dark:text-white/50">
                    {badges[idx]}
                  </span>
                  <ArrowRight size={14} className="text-royal dark:text-accent opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Our Standards Ribbon ─────────────── */}
        <div className={`mt-14 reveal ${isInView ? 'in-view' : ''}`}>
          <div className="rounded-2xl border border-navy/8 dark:border-white/10 bg-white/70 dark:bg-white/[0.02] p-6 backdrop-blur-sm">
            <p className="text-center text-xs font-mono uppercase tracking-widest text-slatesoft dark:text-white/50 mb-5 font-semibold">
              // Built Into Every Website We Deploy
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {DM_WEBSITE_HIGHLIGHTS.map((highlight, idx) => (
                <div key={idx} className="flex flex-col items-center text-center gap-2 p-3 rounded-xl hover:bg-white dark:hover:bg-white/5 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-royal/10 dark:bg-accent/15 flex items-center justify-center text-royal dark:text-accent shrink-0">
                    <highlight.icon size={18} strokeWidth={2} />
                  </div>
                  <span className="text-xs font-semibold text-navy dark:text-white leading-tight">
                    {highlight.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Desktop & Mobile Responsive Preview Showcase ─────────────── */}
        <div className={`mt-16 reveal ${isInView ? 'in-view' : ''}`}>
          <div className="relative mx-auto max-w-5xl rounded-3xl bg-navy dark:bg-navy-deep border border-navy/10 dark:border-white/10 p-4 sm:p-8 shadow-card-lg overflow-hidden">
            {/* Background ambient glow */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-royal/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center mb-6">
              <span className="eyebrow text-accent">// Responsive Architecture</span>
              <h4 className="text-white font-display font-bold text-xl sm:text-2xl mt-1">
                Engineered for High Performance on Every Screen
              </h4>
            </div>

            <div className="relative flex flex-col md:flex-row items-center justify-center gap-6">
              {/* Desktop Browser Mockup */}
              <div className="w-full md:w-[72%] rounded-2xl bg-navy-deep/95 border border-white/15 shadow-2xl overflow-hidden">
                {/* Browser Top Bar */}
                <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                  </div>
                  <div className="mx-auto flex items-center gap-2 px-4 py-1 rounded-full bg-white/8 border border-white/10 text-white/50 text-[11px] font-mono">
                    <span className="text-emerald-400">🔒</span> https://yourbrand.com
                  </div>
                  <div className="w-10" />
                </div>

                {/* Simulated Webpage Body */}
                <div className="p-5 sm:p-7 space-y-5 bg-gradient-to-b from-navy-deep to-[#051126]">
                  {/* Mini Web Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-grad-primary flex items-center justify-center text-[10px] text-white font-bold">A</div>
                      <span className="text-white font-display font-bold text-xs tracking-wide">BrandHQ</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-4 text-white/50 text-[11px]">
                      <span>Services</span>
                      <span>Case Studies</span>
                      <span>About</span>
                    </div>
                    <span className="px-3 py-1 rounded-md bg-grad-primary text-white text-[10px] font-bold">Contact</span>
                  </div>

                  {/* Mini Hero */}
                  <div className="py-4 text-center max-w-md mx-auto space-y-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-accent/15 text-accent text-[10px] font-mono font-semibold border border-accent/20">
                      Faster • Higher Conversions
                    </span>
                    <h5 className="text-white font-display font-bold text-lg sm:text-xl leading-tight">
                      Elevate Your Business With Next-Gen Web Design
                    </h5>
                    <p className="text-white/60 text-xs">
                      Speed-optimized architectures built for search engine dominance and user retention.
                    </p>
                  </div>

                  {/* Mini 3-Card Grid */}
                  <div className="grid grid-cols-3 gap-2.5 pt-1">
                    {[
                      { title: 'Sub-second Load', sub: '< 0.8s LCP' },
                      { title: 'SEO Optimized', sub: 'Top 3 Visibility' },
                      { title: 'Mobile First', sub: '100% Adaptive' },
                    ].map((item, i) => (
                      <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
                        <p className="text-white font-semibold text-[11px]">{item.title}</p>
                        <p className="text-accent text-[10px] font-mono mt-0.5">{item.sub}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile Phone Mockup (Overlapping) */}
              <div className="w-48 sm:w-56 shrink-0 rounded-[2.2rem] border-4 border-slate-700 bg-navy-deep shadow-2xl overflow-hidden -mt-6 md:-mt-0 md:-ml-8 z-10">
                {/* Mobile Speaker / Island Bar */}
                <div className="flex justify-center pt-2 pb-1 bg-black/40">
                  <div className="w-16 h-3 rounded-full bg-slate-800" />
                </div>
                <div className="p-3.5 space-y-3 bg-[#051126]">
                  {/* Mobile header */}
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-white font-bold text-[10px]">BrandHQ</span>
                    <div className="w-4 h-3 flex flex-col justify-between">
                      <div className="w-full h-0.5 bg-white/60 rounded" />
                      <div className="w-full h-0.5 bg-white/60 rounded" />
                    </div>
                  </div>
                  {/* Mobile hero */}
                  <div className="space-y-1 py-1">
                    <p className="text-white font-display font-bold text-xs leading-snug">
                      Digital Brand Experience
                    </p>
                    <p className="text-white/50 text-[9px] leading-tight">
                      Designed for mobile conversion.
                    </p>
                  </div>
                  {/* Mobile CTA */}
                  <div className="w-full py-1.5 rounded-lg bg-grad-primary text-center text-white text-[10px] font-bold shadow-sm">
                    Get Started
                  </div>
                  {/* Mobile cards */}
                  <div className="space-y-1.5 pt-1">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-[9px] text-white/70">
                      ⚡ 99+ Mobile Performance
                    </div>
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-[9px] text-emerald-400 font-mono">
                      ✓ Instant Lead Capture
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex justify-center">
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

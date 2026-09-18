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
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-royal/5 dark:bg-royal/10 blur-3xl rounded-full -z-10 pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-4 items-center justify-center">
              {/* Before Mockup */}
              <div className="relative w-full max-w-[250px] sm:w-[230px] rounded-3xl border border-red-500/20 bg-white dark:bg-navy p-4 shadow-card">
                <div className="absolute -top-3 -left-2 z-10 bg-red-500/10 text-red-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-red-500/30">
                  Before: Amateur
                </div>
                
                {/* Header */}
                <div className="flex items-center gap-3 mb-3 pt-1">
                  <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700/60 grid place-items-center text-slate-400 text-xs font-mono">
                    ?
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">biz_account_19</p>
                    <p className="text-[10px] text-slate-400">No category set</p>
                  </div>
                </div>

                {/* Bio */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 mb-3 space-y-0.5">
                  <p>Welcome to our page</p>
                  <p>DM for orders or info</p>
                  <p className="text-red-400/80 italic">No link · No contact info</p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-3 gap-1">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-square bg-slate-200 dark:bg-slate-800/60 rounded-md grid place-items-center text-[9px] text-slate-400">
                      IMG
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrow on mobile (down) or desktop (right) */}
              <div className="text-slate-300 dark:text-slate-600 sm:rotate-0 rotate-90 shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* After Mockup */}
              <div className="relative w-full max-w-[260px] sm:w-[245px] rounded-3xl border border-emerald-500/30 bg-white dark:bg-navy-deep p-4 shadow-card-lg sm:-mt-6 ring-1 ring-emerald-500/20">
                <div className="absolute -top-3 -right-2 z-10 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  After: ATS Brand
                </div>
                
                {/* Header */}
                <div className="flex items-center gap-3 mb-3 pt-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-amber-400 p-[1.5px] shrink-0">
                    <div className="w-full h-full rounded-full bg-navy flex items-center justify-center text-[10px] font-extrabold text-white">
                      ATS
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-bold text-navy dark:text-white">YourBrand.Official</p>
                      <span className="text-royal dark:text-accent text-[10px]">✓</span>
                    </div>
                    <p className="text-[10px] font-mono text-royal dark:text-accent font-semibold">Digital Brand · Agency</p>
                  </div>
                </div>

                {/* Strategic Bio */}
                <div className="p-2.5 rounded-xl bg-royal/5 dark:bg-accent/5 border border-royal/10 dark:border-accent/10 text-[10px] text-navy/80 dark:text-white/80 mb-3 space-y-0.5">
                  <p className="font-semibold">⚡ Turning Attention Into Inbound Leads</p>
                  <p>📍 Tech Hub · Open Monday-Saturday</p>
                  <p className="text-royal dark:text-accent font-bold">👉 Tap link to book consultation</p>
                </div>

                {/* Highlights */}
                <div className="flex justify-between mb-3 px-1">
                  {['Services', 'Results', 'Reviews', 'Team'].map((h, i) => (
                    <div key={i} className="flex flex-col items-center gap-0.5">
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-white/10 border border-royal/30 flex items-center justify-center text-[9px] text-royal dark:text-accent font-bold">
                        ★
                      </div>
                      <span className="text-[8px] text-slatesoft dark:text-white/60">{h}</span>
                    </div>
                  ))}
                </div>

                {/* 6 Branded Posts Grid */}
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { label: 'REEL', bg: 'from-pink-500/30 to-purple-600/30' },
                    { label: 'DECK', bg: 'from-royal/40 to-blue-600/40' },
                    { label: 'REEL', bg: 'from-purple-600/30 to-royal/30' },
                    { label: 'POST', bg: 'from-navy to-slate-800' },
                    { label: 'REEL', bg: 'from-amber-500/30 to-pink-500/30' },
                    { label: 'CASE', bg: 'from-royal/30 to-emerald-500/30' },
                  ].map((p, i) => (
                    <div 
                      key={i} 
                      className={`aspect-square rounded-md bg-gradient-to-br ${p.bg} border border-white/10 flex items-center justify-center text-[8px] font-mono font-bold text-white/90`}
                    >
                      {p.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <p className="text-center text-xs font-mono text-slatesoft dark:text-white/40 mt-8 uppercase tracking-widest">
              // Conceptual Profile Transformation
            </p>
          </div>

          {/* Right Column - 9-Point Setup Breakdown */}
          <div className="flex flex-col justify-center">
            <span className="eyebrow text-royal dark:text-accent mb-2">// Full Brand Architecture</span>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-navy dark:text-white mb-6">
              Complete Brand Setup &amp; Aesthetic Optimization
            </h3>
            <p className="text-slatesoft dark:text-white/65 text-sm leading-relaxed mb-8">
              We audit your positioning, restructure your bio hierarchy, configure custom highlight decks, and deploy a turnkey content framework built for commercial credibility.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Profile Setup & Optimization', desc: 'Category structuring, SEO username & clean handles' },
                { title: 'Strategic Bio Architecture', desc: 'Value proposition, social proof hooks & CTA links' },
                { title: 'Highlight Story Decks', desc: 'Custom branded vector covers & structured story categories' },
                { title: 'Brand Aesthetic Kit', desc: 'Harmonized color palettes, fonts & Canva/Figma templates' },
                { title: 'Content Pillar Blueprint', desc: 'Audience-tested educational, social proof & commercial tracks' },
                { title: 'Reels Strategy & Direction', desc: 'Viral scripting hooks, trending audio & caption styling' },
                { title: 'Call-to-Action Optimization', desc: 'Direct WhatsApp and lead form routing in bio' },
                { title: 'Link-in-Bio Landing Page', desc: 'Custom high-speed portal showcasing services & contacts' },
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-white dark:bg-white/[0.03] border border-navy/8 dark:border-white/10 hover:border-royal/30 transition-all">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-500 grid place-items-center shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="font-display font-bold text-xs sm:text-sm text-navy dark:text-white">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-slatesoft dark:text-white/60 text-xs pl-7 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DMInstagram;

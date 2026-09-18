import React from 'react';
import { 
  ArrowRight, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Globe, 
  CheckCircle,
  Share2,
  Search,
  Sparkles,
  Smartphone,
  Laptop,
  Flame,
  ShieldCheck
} from 'lucide-react';
import useInView from '../../hooks/useInView';

const TRUST_BADGES = [
  'Social Media', 'Websites', 'SEO',
];

const BAR_DATA = [
  { h: 32, label: 'M' }, { h: 58, label: 'T' }, { h: 44, label: 'W' },
  { h: 82, label: 'T' }, { h: 96, label: 'F' }, { h: 68, label: 'S' }, { h: 52, label: 'S' },
];

export default function DMHero() {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <section className="relative overflow-hidden bg-grad-navy pt-28 pb-24 sm:pt-36 sm:pb-32">
      {/* Ambient background glows */}
      <div className="absolute inset-0 bg-dot-grid opacity-30" aria-hidden="true" />
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-royal/20 rounded-full blur-[120px]" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-accent/15 rounded-full blur-[110px]" aria-hidden="true" />

      <div className="container-px mx-auto max-w-8xl relative z-10">
        <div
          ref={ref}
          className={`grid lg:grid-cols-12 gap-12 lg:gap-8 items-center reveal ${isInView ? 'in-view' : ''}`}
        >
          {/* LEFT COLUMN (6 cols) */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <span className="eyebrow text-accent mb-6">DIGITAL GROWTH SERVICES</span>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-[3.35rem] leading-[1.09] tracking-tight text-white mb-6 text-balance">
              Turn Your Business Into a{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-[#7DB8FF]">
                Digital Brand.
              </span>
            </h1>
            <p className="text-lg text-white/70 mb-8 max-w-lg leading-relaxed">
              Build a stronger online presence with social media, premium content,
              websites, branding and digital marketing — all under one team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10 w-full sm:w-auto">
              <a
                href="#dm-enquiry"
                className="btn-glow inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-semibold bg-grad-primary transition-all hover:brightness-110 hover:scale-[1.02]"
              >
                Get a Free Consultation <ArrowRight size={18} />
              </a>
              <a
                href="#dm-services"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-white font-medium border border-white/20 hover:bg-white/8 transition-colors"
              >
                Explore Our Services
              </a>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {TRUST_BADGES.map((badge) => (
                <span key={badge} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/8 border border-white/12 text-white/75 text-xs font-medium backdrop-blur-sm">
                  <CheckCircle size={12} className="text-accent shrink-0" /> {badge}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN (6 cols) — Laptop + Mobile UI + 4 Floating Badges */}
          <div className="lg:col-span-6 relative hidden lg:block select-none">
            {/* Subtle glow behind device cluster */}
            <div className="absolute inset-0 bg-royal/15 rounded-full blur-3xl pointer-events-none" />

            {/* ── 4 Floating Metric Badges ──────────────────────── */}
            {/* Badge 1: SOCIAL MEDIA + Reach */}
            <div 
              className="absolute -top-6 left-6 z-30 rounded-2xl bg-white/10 dark:bg-navy-deep/90 border border-white/20 p-3 shadow-card-lg backdrop-blur-md flex items-center gap-3 animate-floatSlow"
              style={{ animationDelay: '0s' }}
            >
              <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 grid place-items-center shrink-0">
                <Share2 size={15} />
              </div>
              <div>
                <p className="text-[9px] font-mono tracking-wider text-white/50 uppercase font-bold">Social Media</p>
                <p className="text-xs font-display font-extrabold text-white">+ Reach</p>
              </div>
            </div>

            {/* Badge 2: WEBSITE + Enquiries */}
            <div 
              className="absolute -top-4 right-4 z-30 rounded-2xl bg-white/10 dark:bg-navy-deep/90 border border-white/20 p-3 shadow-card-lg backdrop-blur-md flex items-center gap-3 animate-float"
              style={{ animationDelay: '0.8s' }}
            >
              <div className="w-8 h-8 rounded-xl bg-royal/20 text-accent grid place-items-center shrink-0">
                <Globe size={15} />
              </div>
              <div>
                <p className="text-[9px] font-mono tracking-wider text-white/50 uppercase font-bold">Website</p>
                <p className="text-xs font-display font-extrabold text-white">+ Enquiries</p>
              </div>
            </div>

            {/* Badge 3: SEO + Visibility */}
            <div 
              className="absolute bottom-6 -left-8 z-30 rounded-2xl bg-white/10 dark:bg-navy-deep/90 border border-white/20 p-3 shadow-card-lg backdrop-blur-md flex items-center gap-3 animate-float"
              style={{ animationDelay: '1.4s' }}
            >
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 grid place-items-center shrink-0">
                <Search size={15} />
              </div>
              <div>
                <p className="text-[9px] font-mono tracking-wider text-white/50 uppercase font-bold">SEO</p>
                <p className="text-xs font-display font-extrabold text-amber-300">+ Visibility</p>
              </div>
            </div>

            {/* Badge 4: CONTENT + Engagement */}
            <div 
              className="absolute -bottom-5 right-12 z-30 rounded-2xl bg-white/10 dark:bg-navy-deep/90 border border-white/20 p-3 shadow-card-lg backdrop-blur-md flex items-center gap-3 animate-floatSlow"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-400/20 text-emerald-300 grid place-items-center shrink-0">
                <Sparkles size={15} />
              </div>
              <div>
                <p className="text-[9px] font-mono tracking-wider text-white/50 uppercase font-bold">Content</p>
                <p className="text-xs font-display font-extrabold text-emerald-300">+ Engagement</p>
              </div>
            </div>

            {/* ── Central Laptop Mockup Frame ──────────────────────── */}
            <div className="relative mx-auto max-w-[500px] rounded-2xl bg-slate-900 border border-white/15 p-2.5 shadow-card-lg">
              {/* Laptop screen header */}
              <div className="rounded-t-xl bg-navy-deep/90 border-b border-white/10 px-3 py-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 px-2.5 py-0.5 rounded-md bg-white/5 text-[9px] font-mono text-white/50">
                    https://atsdigital.growth/live-hub
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[9px] font-bold font-mono border border-emerald-500/20">
                  ● LIVE
                </span>
              </div>

              {/* Screen Body */}
              <div className="bg-navy-deep/95 p-4 rounded-b-xl">
                {/* Metric Strip */}
                <div className="grid grid-cols-3 gap-2 mb-3.5">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/8">
                    <p className="text-[8px] font-mono uppercase text-white/40">Impressions</p>
                    <p className="font-display font-bold text-sm text-emerald-400 mt-0.5">+247%</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/8">
                    <p className="text-[8px] font-mono uppercase text-white/40">Engagement</p>
                    <p className="font-display font-bold text-sm text-accent mt-0.5">+89%</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/8">
                    <p className="text-[8px] font-mono uppercase text-white/40">Web Leads</p>
                    <p className="font-display font-bold text-sm text-amber-400 mt-0.5">3.4×</p>
                  </div>
                </div>

                {/* Conversion Velocity Chart */}
                <div className="rounded-xl bg-white/4 border border-white/8 p-3 mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-mono text-white/50">Weekly Campaign Velocity</span>
                    <span className="text-[9px] font-mono text-accent font-bold">Active Funnel</span>
                  </div>
                  <div className="flex items-end justify-between gap-2 h-14">
                    {BAR_DATA.map((bar, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                        <div 
                          className="w-full rounded-t bg-gradient-to-t from-royal to-accent opacity-80"
                          style={{ height: `${bar.h}%` }}
                        />
                        <span className="text-white/30 text-[7px] font-mono">{bar.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Overlapping Smartphone Frame ─────────────────────── */}
            <div className="absolute -right-6 bottom-4 z-20 w-44 rounded-3xl bg-slate-950 border-2 border-white/20 p-2 shadow-2xl backdrop-blur-md">
              <div className="rounded-2xl bg-navy-deep p-2.5 text-white">
                {/* Mobile camera notch */}
                <div className="mx-auto w-12 h-2.5 rounded-full bg-black/60 mb-2" />
                
                {/* Mini Instagram Profile Header */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-amber-400 p-[1.5px] shrink-0">
                    <div className="w-full h-full rounded-full bg-navy flex items-center justify-center text-[9px] font-bold text-white">
                      ATS
                    </div>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-bold leading-none truncate">@yourbrand</p>
                    <p className="text-[8px] text-white/50 font-mono mt-0.5">Brand Page</p>
                  </div>
                </div>

                {/* Highlight Story Rings */}
                <div className="flex gap-1.5 mb-2.5 px-0.5">
                  {['Services', 'Work', 'Reviews'].map((h, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-0.5">
                      <div className="w-6 h-6 rounded-full border border-royal/60 bg-white/10 flex items-center justify-center text-[7px] text-accent">
                        ★
                      </div>
                      <span className="text-[6px] text-white/60">{h}</span>
                    </div>
                  ))}
                </div>

                {/* Recent Reel Post Tile */}
                <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-royal/50 to-navy p-2 flex flex-col justify-end h-16 border border-white/10">
                  <span className="text-[7px] font-bold text-white/90">Viral Hook Reel</span>
                  <div className="flex items-center justify-between text-[7px] text-white/60 mt-0.5">
                    <span>▶ 24.8K views</span>
                    <span className="text-emerald-400 font-bold">♥ 1.4K</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}



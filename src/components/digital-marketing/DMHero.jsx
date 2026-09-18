import React from 'react';
import { ArrowRight, TrendingUp, Users, BarChart3, Globe, CheckCircle } from 'lucide-react';
import useInView from '../../hooks/useInView';

const METRIC_CARDS = [
  { icon: TrendingUp, label: 'Reach Growth', value: '+247%', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { icon: Users,     label: 'Engagement',   value: '+89%',  color: 'text-accent',       bg: 'bg-accent/10'     },
  { icon: Globe,     label: 'Web Traffic',  value: '↑ 3.4×', color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { icon: BarChart3, label: 'Google Rank',  value: 'Top 3', color: 'text-amber-400',    bg: 'bg-amber-400/10'  },
];

const TRUST_BADGES = [
  'Social Media', 'Websites', 'SEO',
];

const BAR_DATA = [
  { h: 30, label: 'M' }, { h: 55, label: 'T' }, { h: 42, label: 'W' },
  { h: 78, label: 'T' }, { h: 91, label: 'F' }, { h: 65, label: 'S' }, { h: 48, label: 'S' },
];

export default function DMHero() {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <section className="relative overflow-hidden bg-grad-navy pt-28 pb-24 sm:pt-36 sm:pb-32">
      <div className="absolute inset-0 bg-dot-grid opacity-30" aria-hidden="true" />
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-royal/20 rounded-full blur-[120px]" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[100px]" aria-hidden="true" />

      <div className="container-px mx-auto max-w-8xl relative z-10">
        <div
          ref={ref}
          className={`grid lg:grid-cols-2 gap-16 lg:gap-12 items-center reveal ${isInView ? 'in-view' : ''}`}
        >
          {/* LEFT COLUMN */}
          <div className="flex flex-col items-start">
            <span className="eyebrow text-accent mb-6">DIGITAL GROWTH SERVICES</span>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.09] tracking-tight text-white mb-6 text-balance">
              Turn Your Business Into a{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-[#7DB8FF]">
                Digital Brand.
              </span>
            </h1>
            <p className="text-lg text-white/65 mb-8 max-w-lg leading-relaxed">
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
            <div className="flex flex-wrap gap-2">
              {TRUST_BADGES.map((badge) => (
                <span key={badge} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/8 border border-white/12 text-white/60 text-xs font-medium">
                  <CheckCircle size={11} className="text-accent shrink-0" /> {badge}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN — CSS Dashboard Visual */}
          <div className="relative hidden lg:block">
            {/* Main dashboard card */}
            <div className="rounded-3xl bg-navy-deep/80 border border-white/10 backdrop-blur-sm p-6 shadow-card-lg">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-white/40 text-[10px] font-mono uppercase tracking-wider mb-0.5">Digital Growth Dashboard</p>
                  <h3 className="text-white font-display font-bold">Performance Overview</h3>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-400/15 text-emerald-400 text-xs font-bold font-mono border border-emerald-400/20">● LIVE</span>
              </div>

              {/* Metric cards */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {METRIC_CARDS.map((m, i) => (
                  <div key={i} className={`rounded-xl bg-white/5 border border-white/8 p-3.5 flex items-center gap-3 reveal ${isInView ? 'in-view' : ''}`}
                    style={{ transitionDelay: `${200 + i * 80}ms` }}>
                    <div className={`w-9 h-9 rounded-lg ${m.bg} grid place-items-center shrink-0`}>
                      <m.icon size={16} className={m.color} />
                    </div>
                    <div>
                      <p className="text-white/40 text-[9px] font-mono">{m.label}</p>
                      <p className={`font-display font-bold text-sm ${m.color}`}>{m.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bar chart */}
              <div className="rounded-xl bg-white/4 border border-white/8 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/40 text-[10px] font-mono">Weekly Engagement</span>
                  <span className="text-accent text-[10px] font-mono font-bold">+34% vs last week</span>
                </div>
                <div className="flex items-end justify-between gap-1.5 h-20">
                  {BAR_DATA.map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-royal to-accent opacity-75 hover:opacity-100 transition-opacity"
                        style={{ height: isInView ? `${bar.h}%` : '0%', transition: `height 0.9s cubic-bezier(0.16,1,0.3,1) ${400 + i * 60}ms` }}
                      />
                      <span className="text-white/25 text-[8px] font-mono">{bar.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating card — Instagram preview */}
            <div className="absolute -left-12 top-1/3 w-44 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4 shadow-card-lg animate-floatSlow" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 shrink-0" />
                <div>
                  <p className="text-white text-xs font-semibold leading-tight">@yourbrand</p>
                  <p className="text-white/40 text-[9px]">Instagram</p>
                </div>
              </div>
              <div className="w-full h-14 rounded-lg bg-gradient-to-br from-royal/40 to-accent/20 mb-2 flex items-center justify-center">
                <span className="text-white/30 text-[9px] font-mono">Brand Post</span>
              </div>
              <div className="flex gap-3 text-white/40 text-[9px]">♥ 284 &nbsp;💬 36</div>
            </div>

            {/* Floating card — Lead growth */}
            <div className="absolute -right-8 bottom-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4 shadow-card-lg animate-float" style={{ animationDelay: '1s' }}>
              <p className="text-white/40 text-[9px] font-mono mb-1">Monthly Leads</p>
              <p className="text-emerald-400 font-display font-bold text-xl">+127%</p>
              <div className="mt-2 flex items-end gap-0.5 h-6">
                {[4, 7, 5, 9, 8, 12, 11].map((v, i) => (
                  <div key={i} className="flex-1 rounded-sm bg-emerald-400/60" style={{ height: `${v * 2}px` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



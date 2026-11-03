import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Megaphone, TrendingUp, Search, Smartphone, Globe, Sparkles } from 'lucide-react';
import useInView from '../hooks/useInView.js';

export default function DMHomeBanner() {
  const [ref, isInView] = useInView();

  const PILLARS = [
    { icon: TrendingUp, label: 'Social & Reels', stat: '+280% Reach' },
    { icon: Search, label: 'Google 3-Pack SEO', stat: 'Local Dominance' },
    { icon: Smartphone, label: 'Web Architecture', stat: 'Sub-Second Speed' },
    { icon: Globe, label: 'Brand & Content', stat: 'Full Creative Suite' },
  ];

  return (
    <section className="py-20 sm:py-24 bg-gradient-to-br from-navy-deep via-navy to-navy-deep overflow-hidden relative border-y border-white/10">
      <div className="absolute inset-0 bg-dot-grid opacity-30" aria-hidden="true" />
      <div className="absolute -top-24 -right-24 w-[400px] h-[400px] bg-royal/20 rounded-full blur-[120px]" aria-hidden="true" />
      <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[120px]" aria-hidden="true" />

      <div
        ref={ref}
        className={`relative container-px mx-auto max-w-8xl reveal ${isInView ? 'in-view' : ''}`}
      >
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Heading, Value Prop, CTA */}
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/20 text-accent text-xs font-mono font-bold uppercase tracking-wider mb-5">
              <Megaphone size={13} />
              ATS Digital Solutions &bull; Agency Division
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-[2.6rem] tracking-tight text-white leading-tight text-balance">
              Turn Your Business Into a{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-[#7DB8FF] to-white">
                Digital Brand
              </span>
            </h2>
            <p className="mt-4 text-white/70 text-base sm:text-lg leading-relaxed max-w-xl">
              From viral reels and Google Maps 3-Pack SEO to custom web applications and full brand systems — ATS Digital Solutions scales your online reach and customer acquisition.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/digital-marketing"
                className="btn-glow group inline-flex items-center gap-2 bg-grad-primary text-white font-semibold px-7 py-3.5 rounded-xl hover:brightness-110 transition-all shadow-glow-sm"
              >
                <span>Explore Digital Marketing</span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/digital-marketing#dm-services"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/20 text-white font-medium hover:bg-white/10 transition-colors text-sm"
              >
                <span>View Agency Services</span>
              </Link>
            </div>
          </div>

          {/* Right Column: 4 Capability Cards Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
            {PILLARS.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-4 sm:p-5 hover:border-accent/40 transition-all hover:-translate-y-1"
                >
                  <span className="w-10 h-10 rounded-xl bg-accent/15 text-accent grid place-items-center mb-3">
                    <Icon size={18} />
                  </span>
                  <p className="text-xs font-mono uppercase tracking-wider text-accent font-bold">
                    {p.stat}
                  </p>
                  <p className="text-sm font-semibold text-white mt-1">
                    {p.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

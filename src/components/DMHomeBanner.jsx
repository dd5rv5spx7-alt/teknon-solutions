import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Megaphone } from 'lucide-react';
import useInView from '../hooks/useInView.js';

export default function DMHomeBanner() {
  const [ref, isInView] = useInView();

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-navy via-navy-deep to-navy overflow-hidden relative">
      <div className="absolute inset-0 bg-dot-grid opacity-30" aria-hidden="true" />
      <div className="absolute -top-20 -right-20 w-[300px] h-[300px] bg-royal/15 rounded-full blur-[100px]" aria-hidden="true" />

      <div
        ref={ref}
        className={`relative container-px mx-auto max-w-8xl reveal ${isInView ? 'in-view' : ''}`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10">
          <div className="flex-1">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold tracking-wide mb-4">
              <Megaphone size={14} />
              NEW
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-white">
              Digital Growth Services
            </h2>
            <p className="mt-3 text-white/65 text-base leading-relaxed max-w-xl">
              Build your digital presence with social media, content, websites, branding and marketing &mdash; all under one team.
            </p>
          </div>

          <Link
            to="/digital-marketing"
            className="btn-glow group inline-flex items-center gap-2 bg-grad-primary text-white font-semibold px-7 py-3.5 rounded-xl hover:brightness-110 transition-all shrink-0"
          >
            Explore Digital Marketing
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function SolutionsHero() {
  return (
    <section id="solutions-home" className="relative overflow-hidden bg-grad-navy pt-32 pb-32 sm:pt-40 sm:pb-40">
      <div className="absolute inset-0 bg-dot-grid opacity-40" aria-hidden="true" />
      <div className="absolute -top-24 -left-24 w-[420px] h-[420px] bg-royal/20 rounded-full blur-[110px]" aria-hidden="true" />
      <div className="absolute top-1/3 -right-32 w-[380px] h-[380px] bg-accent/20 rounded-full blur-[110px]" aria-hidden="true" />

      <div className="relative container-px mx-auto max-w-8xl text-center">
        <span className="eyebrow text-accent justify-center">
          <span aria-hidden="true">//</span> IT Solutions
        </span>

        <h1 className="mt-5 mx-auto font-display font-extrabold text-4xl sm:text-5xl md:text-[3.4rem] leading-[1.08] tracking-tight text-white text-balance max-w-3xl">
          IT Solutions for{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-[#7DB8FF]">
            Growing Businesses
          </span>
        </h1>

        <p className="mt-6 mx-auto text-lg text-white/70 leading-relaxed max-w-2xl">
          Website & software development, cybersecurity, and cloud engineering — built by the team
          that teaches this stack.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#quote"
            className="btn-glow group inline-flex items-center gap-2 bg-grad-primary text-white font-semibold px-7 py-3.5 rounded-xl hover:brightness-110 transition-all"
          >
            Request a Quote
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}

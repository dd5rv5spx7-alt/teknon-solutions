import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';

export default function CTA() {
  return (
    <section className="relative py-24 sm:py-28 bg-grad-navy overflow-hidden">
      <div className="absolute inset-0 bg-dot-grid opacity-30" aria-hidden="true" />
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[560px] h-[280px] bg-royal/25 blur-[110px] rounded-full" aria-hidden="true" />

      <div className="relative container-px mx-auto max-w-4xl text-center">
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight text-balance">
          Start Your Tech Journey Today
        </h2>
        <p className="mt-5 text-white/70 text-lg leading-relaxed max-w-2xl mx-auto">
          Join A Teknon Solutions and gain real-world experience through practical internships,
          expert mentorship, and industry-focused training. Build your skills, create an
          impressive portfolio, earn certifications, and prepare for a successful career in
          technology.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#contact"
            className="btn-glow group inline-flex items-center gap-2 bg-grad-primary text-white font-semibold px-7 py-3.5 rounded-xl hover:brightness-110 transition-all"
          >
            Enroll Now
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 glass text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/15 transition-colors"
          >
            <Calendar size={18} />
            Book a Free Career Counseling Session
          </a>
        </div>
      </div>
    </section>
  );
}

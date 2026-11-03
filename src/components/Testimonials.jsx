import React, { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star, CheckCircle2, Award, Users, StarHalf } from 'lucide-react';
import SectionHeading from './SectionHeading.jsx';
import useSiteContent from '../hooks/useSiteContent.js';
import { TESTIMONIALS } from '../data/siteData.js';

function getInitials(name) {
  if (!name) return 'TS';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const rawTestimonials = useSiteContent('testimonials', TESTIMONIALS);
  const testimonials = rawTestimonials.length > 0 ? rawTestimonials : TESTIMONIALS;

  const next = useCallback(() => setIndex((i) => (i + 1) % testimonials.length), [testimonials.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length), [testimonials.length]);

  useEffect(() => {
    if (paused) return undefined;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [paused, next]);

  const active = testimonials[index % testimonials.length];
  const initials = getInitials(active.name);

  return (
    <section className="py-28 sm:py-32 bg-grad-navy relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-grid opacity-30" aria-hidden="true" />
      <div className="absolute top-1/4 -left-32 w-[350px] h-[350px] bg-royal/15 rounded-full blur-[100px]" aria-hidden="true" />
      <div className="absolute bottom-1/4 -right-32 w-[350px] h-[350px] bg-accent/15 rounded-full blur-[100px]" aria-hidden="true" />

      <div className="relative container-px mx-auto max-w-8xl">
        <SectionHeading
          index="08"
          label="Student Reviews"
          title="What Our Students Say"
          align="center"
          light
          subtitle="Real feedback from students and professionals who trained with Teknon Solutions."
        />

        <div
          className="mt-14 max-w-3xl mx-auto"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {/* Main Testimonial Glass Card */}
          <div className="glass rounded-3xl p-8 sm:p-12 text-center relative border border-white/15 shadow-2xl backdrop-blur-xl">
            <Quote size={36} className="mx-auto text-accent opacity-80" />

            {/* Star Rating */}
            <div className="flex justify-center gap-1.5 mt-5">
              {Array.from({ length: active.rating || 5 }).map((_, i) => (
                <Star key={i} size={17} className="fill-gold text-gold" />
              ))}
            </div>

            {/* Testimonial Quote */}
            <p className="mt-6 text-lg sm:text-xl text-white font-display leading-relaxed text-balance">
              &ldquo;{active.quote}&rdquo;
            </p>

            {/* Student Info & Verified Badge */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-center">
              {/* Avatar with Initials */}
              <div className="w-12 h-12 rounded-full bg-grad-primary text-white font-display font-extrabold flex items-center justify-center text-sm ring-4 ring-white/10 shadow-glow-sm mb-3">
                {initials}
              </div>

              <div className="flex items-center gap-2">
                <p className="font-semibold text-white text-base">{active.name}</p>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full font-medium">
                  <CheckCircle2 size={12} /> Verified Graduate
                </span>
              </div>
              <p className="font-mono text-xs text-white/55 mt-1">{active.role}</p>
            </div>
          </div>

          {/* Navigation Stepper & Controls */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous testimonial"
              className="w-11 h-11 grid place-items-center rounded-full border border-white/15 text-white hover:bg-white/10 hover:border-accent transition-all"
            >
              <ChevronLeft size={19} />
            </button>

            <div className="flex flex-col items-center gap-2 w-44">
              <div className="h-1.5 w-full rounded-full bg-white/15 overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-500"
                  style={{ width: `${((index + 1) / testimonials.length) * 100}%` }}
                />
              </div>
              <span className="font-mono text-[11px] text-white/50 tracking-wider">
                {String(index + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')} &bull; Tap to cycle
              </span>
            </div>

            <button
              type="button"
              onClick={next}
              aria-label="Next testimonial"
              className="w-11 h-11 grid place-items-center rounded-full border border-white/15 text-white hover:bg-white/10 hover:border-accent transition-all"
            >
              <ChevronRight size={19} />
            </button>
          </div>

          {/* Quick Select Dots */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Jump to review ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === i ? 'w-6 bg-accent' : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Social Proof Metrics */}
        <div className="mt-16 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.03]">
            <p className="font-display font-extrabold text-2xl text-white">500+</p>
            <p className="text-xs text-white/55 font-mono mt-1">Students Trained</p>
          </div>
          <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.03]">
            <p className="font-display font-extrabold text-2xl text-accent">4.9 / 5.0</p>
            <p className="text-xs text-white/55 font-mono mt-1">Average Student Rating</p>
          </div>
          <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.03]">
            <p className="font-display font-extrabold text-2xl text-white">50+</p>
            <p className="text-xs text-white/55 font-mono mt-1">Live Projects Built</p>
          </div>
          <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.03]">
            <p className="font-display font-extrabold text-2xl text-emerald-400">100%</p>
            <p className="text-xs text-white/55 font-mono mt-1">Practical Learning</p>
          </div>
        </div>
      </div>
    </section>
  );
}

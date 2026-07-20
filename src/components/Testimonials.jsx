import React, { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import SectionHeading from './SectionHeading.jsx';
import { TESTIMONIALS } from '../data/siteData.js';

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setIndex((i) => (i + 1) % TESTIMONIALS.length), []);
  const prev = useCallback(() => setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length), []);

  useEffect(() => {
    if (paused) return undefined;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [paused, next]);

  const active = TESTIMONIALS[index];

  return (
    <section className="py-28 sm:py-32 bg-grad-navy relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-grid opacity-30" aria-hidden="true" />
      <div className="relative container-px mx-auto max-w-8xl">
        <SectionHeading
          index="08"
          label="Testimonials"
          title="What Our Students Say"
          align="center"
          light
        />

        <div
          className="mt-14 max-w-3xl mx-auto"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="glass rounded-3xl p-8 sm:p-12 text-center">
            <Quote size={34} className="mx-auto text-accent" />

            <div className="flex justify-center gap-1 mt-6">
              {Array.from({ length: active.rating }).map((_, i) => (
                <Star key={i} size={16} className="fill-gold text-gold" />
              ))}
            </div>

            <p className="mt-6 text-lg sm:text-xl text-white font-display leading-relaxed text-balance">
              &ldquo;{active.quote}&rdquo;
            </p>

            <div className="mt-8">
              <p className="font-semibold text-white">{active.name}</p>
              <p className="font-mono text-xs text-white/45 mt-1">{active.role}</p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous testimonial"
              className="w-11 h-11 grid place-items-center rounded-full border border-white/15 text-white hover:bg-white/10 transition-colors"
            >
              <ChevronLeft size={19} />
            </button>

            <div className="flex flex-col items-center gap-2 w-40">
              <div className="h-1 w-full rounded-full bg-white/15 overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-500"
                  style={{ width: `${((index + 1) / TESTIMONIALS.length) * 100}%` }}
                />
              </div>
              <span className="font-mono text-[11px] text-white/45 tracking-wide">
                {String(index + 1).padStart(2, '0')} / {String(TESTIMONIALS.length).padStart(2, '0')}
              </span>
            </div>

            <button
              type="button"
              onClick={next}
              aria-label="Next testimonial"
              className="w-11 h-11 grid place-items-center rounded-full border border-white/15 text-white hover:bg-white/10 transition-colors"
            >
              <ChevronRight size={19} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

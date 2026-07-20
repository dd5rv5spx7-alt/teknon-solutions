import React from 'react';
import { ArrowRight, PlayCircle } from 'lucide-react';
import CodeWindow from './CodeWindow.jsx';

const FLOATING_TAGS = [
  { label: 'Python', dot: 'bg-[#FFD43B]', pos: '-top-6 -left-8', delay: '0s' },
  { label: 'React', dot: 'bg-[#61DAFB]', pos: 'top-1/3 -right-10', delay: '1.4s' },
  { label: 'AWS', dot: 'bg-[#FF9900]', pos: '-bottom-7 left-10', delay: '2.6s' },
];

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-grad-navy pt-32 pb-40 sm:pt-40 sm:pb-48"
    >
      <div className="absolute inset-0 bg-dot-grid opacity-40" aria-hidden="true" />
      <div className="absolute -top-24 -left-24 w-[420px] h-[420px] bg-royal/20 rounded-full blur-[110px]" aria-hidden="true" />
      <div className="absolute top-1/3 -right-32 w-[380px] h-[380px] bg-accent/20 rounded-full blur-[110px]" aria-hidden="true" />

      <div className="relative container-px mx-auto max-w-8xl grid lg:grid-cols-2 gap-16 lg:gap-10 items-center">
        <div>
          <span className="eyebrow text-accent">
            <span aria-hidden="true">//</span> Learn. Build. Grow.
          </span>

          <h1 className="mt-5 font-display font-extrabold text-4xl sm:text-5xl md:text-[3.4rem] leading-[1.08] tracking-tight text-white text-balance">
            Learn. Build. Grow.
            <br />
            with{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-[#7DB8FF]">
              A Teknon Solutions.
            </span>
          </h1>

          <p className="mt-6 text-lg text-white/70 leading-relaxed max-w-xl">
            Transform your career with industry-oriented internships, practical training, live
            projects, expert mentorship, and interview preparation.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="btn-glow group inline-flex items-center gap-2 bg-grad-primary text-white font-semibold px-7 py-3.5 rounded-xl hover:brightness-110 transition-all"
            >
              Enroll Now
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#programs"
              className="inline-flex items-center gap-2 glass text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/15 transition-colors"
            >
              <PlayCircle size={18} />
              Explore Programs
            </a>
          </div>

          <div className="mt-10 flex items-center gap-3 text-white/50 text-sm font-mono">
            <span className="flex -space-x-2">
              {['#1E5EFF', '#2F80ED', '#5FA8FF'].map((c) => (
                <span
                  key={c}
                  className="w-7 h-7 rounded-full border-2 border-navy-deep"
                  style={{ backgroundColor: c }}
                />
              ))}
            </span>
            500+ students already building with us
          </div>
        </div>

        <div className="relative">
          {FLOATING_TAGS.map((tag) => (
            <span
              key={tag.label}
              className={`hidden md:inline-flex absolute ${tag.pos} items-center gap-2 glass px-3.5 py-2 rounded-full text-xs font-mono text-white/80 animate-floatSlow z-10`}
              style={{ animationDelay: tag.delay }}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${tag.dot}`} />
              {tag.label}
            </span>
          ))}
          <CodeWindow />
        </div>
      </div>
    </section>
  );
}

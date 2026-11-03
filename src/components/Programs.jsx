import React from 'react';
import { ArrowRight, Check, Sparkles, Code2, Layers, Award, Users, Clock, ShieldCheck } from 'lucide-react';
import SectionHeading from './SectionHeading.jsx';
import useInView from '../hooks/useInView.js';
import { PROGRAMS } from '../data/siteData.js';

export default function Programs() {
  const [ref, isInView] = useInView();

  return (
    <section id="programs" className="py-28 sm:py-32 bg-white dark:bg-navy relative overflow-hidden">
      <div className="container-px mx-auto max-w-8xl">
        <SectionHeading
          index="03"
          label="Internship Programs"
          badge="Starting from ₹1,999"
          align="center"
          title="Industry Internship Tracks"
          subtitle="Hands-on training tracks structured to take you from core programming fundamentals to portfolio-grade live projects and career certification."
        />

        {/* Programs Grid */}
        <div ref={ref} className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROGRAMS.map((program, i) => {
            const Icon = program.icon;
            const isPopular = program.highlighted;

            return (
              <div
                key={program.id}
                className={`reveal ${isInView ? 'in-view' : ''} reveal-delay-${(i % 4) + 1} relative rounded-2xl border p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 ${
                  isPopular
                    ? 'border-royal dark:border-accent bg-royal/[0.02] dark:bg-accent/[0.04] shadow-card-lg ring-1 ring-royal/20 dark:ring-accent/30'
                    : 'border-navy/10 dark:border-white/10 bg-white dark:bg-white/[0.03] hover:border-royal/30 hover:shadow-card'
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-grad-primary text-white text-[11px] font-mono uppercase tracking-wider font-bold shadow-glow-sm">
                    <Sparkles size={11} /> Most Popular Track
                  </span>
                )}

                <div>
                  {/* Top Row: Icon + Duration Chip */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="w-11 h-11 grid place-items-center rounded-xl bg-royal/10 dark:bg-accent/15 text-royal dark:text-accent">
                      <Icon size={20} strokeWidth={2.2} />
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-navy/5 dark:bg-white/10 font-mono text-[11px] font-semibold text-navy/80 dark:text-white/80">
                      <Clock size={12} className="text-royal dark:text-accent" />
                      {program.duration}
                    </span>
                  </div>

                  {/* Program Title & Tagline */}
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-extrabold text-xl text-navy dark:text-white">
                      {program.name}
                    </h3>
                    <span className="text-[10px] font-mono uppercase tracking-wide px-2 py-0.5 rounded bg-royal/10 dark:bg-white/10 text-royal dark:text-accent font-semibold">
                      {program.tag}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slatesoft dark:text-white/60 leading-relaxed min-h-[34px]">
                    {program.tagline}
                  </p>

                  {/* Pricing Display */}
                  <div className="mt-4 pt-4 border-t border-navy/5 dark:border-white/10 flex items-baseline gap-1.5">
                    <span className="font-display font-extrabold text-3xl text-navy dark:text-white tracking-tight">
                      {program.price}
                    </span>
                    {program.price !== 'Custom' && (
                      <span className="text-xs text-slatesoft dark:text-white/50 font-mono">/ one-time</span>
                    )}
                  </div>

                  {/* Deliverables & Features */}
                  <ul className="mt-6 space-y-3 pt-2">
                    <li className="flex items-start gap-2.5 text-xs text-navy/90 dark:text-white/80 leading-snug">
                      <Code2 size={15} className="text-royal dark:text-accent shrink-0 mt-0.5" />
                      <span><strong>Skills:</strong> {program.skills}</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs text-navy/90 dark:text-white/80 leading-snug">
                      <Layers size={15} className="text-royal dark:text-accent shrink-0 mt-0.5" />
                      <span><strong>Projects:</strong> {program.projects}</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs text-navy/90 dark:text-white/80 leading-snug">
                      <Award size={15} className="text-royal dark:text-accent shrink-0 mt-0.5" />
                      <span><strong>Credential:</strong> {program.certificate}</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs text-navy/90 dark:text-white/80 leading-snug">
                      <Users size={15} className="text-royal dark:text-accent shrink-0 mt-0.5" />
                      <span><strong>Mentorship:</strong> {program.mentorship}</span>
                    </li>
                  </ul>
                </div>

                {/* Card CTA Actions */}
                <div className="mt-8 pt-5 border-t border-navy/5 dark:border-white/10 flex flex-col gap-2">
                  <a
                    href="#contact"
                    className={`btn-glow inline-flex items-center justify-center gap-2 font-semibold py-3 px-4 rounded-xl text-sm transition-all ${
                      isPopular
                        ? 'bg-grad-primary text-white hover:brightness-110 shadow-glow-sm'
                        : 'bg-navy/5 dark:bg-white/10 text-navy dark:text-white hover:bg-navy/10 dark:hover:bg-white/15'
                    }`}
                  >
                    <span>Apply for Batch</span>
                    <ArrowRight size={15} />
                  </a>
                  {program.price !== 'Custom' && (
                    <a
                      href="#pricing"
                      className="text-center text-[11px] font-mono text-slatesoft dark:text-white/50 hover:text-royal dark:hover:text-accent transition-colors py-1"
                    >
                      Instant Pay &amp; Reserve &rarr;
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust & Guarantee Banner */}
        <div className="mt-14 p-5 sm:p-6 rounded-2xl bg-mist dark:bg-white/[0.02] border border-navy/8 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-royal/10 dark:bg-accent/15 text-royal dark:text-accent grid place-items-center shrink-0">
              <ShieldCheck size={20} />
            </span>
            <div>
              <p className="text-sm font-semibold text-navy dark:text-white">
                All Internship Tracks Include Verified Certification
              </p>
              <p className="text-xs text-slatesoft dark:text-white/60">
                Online and offline batches available in Rajahmundry with live project guidance.
              </p>
            </div>
          </div>
          <a
            href="#contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-semibold text-xs uppercase tracking-wider text-royal dark:text-accent hover:underline py-2"
          >
            Have questions? Contact an advisor &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}

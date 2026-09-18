import React from 'react';
import SectionHeading from '../SectionHeading';
import useInView from '../../hooks/useInView';
import { 
  Zap, 
  Users, 
  BarChart3, 
  Palette, 
  Layers, 
  HeartHandshake, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Code2,
  Sparkles
} from 'lucide-react';

const DMWhyTeknon = () => {
  const [ref, isInView] = useInView();

  return (
    <section id="dm-why" className="py-24 sm:py-32 bg-mist dark:bg-navy-deep relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-royal/5 dark:bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-96 h-96 bg-navy/5 dark:bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="container-px mx-auto max-w-7xl relative z-10">
        <SectionHeading
          index="07"
          label="Why us"
          title="Why ATS Group?"
          subtitle="Technology, creativity, and execution — all under one roof."
          align="center"
        />

        {/* Bento Grid */}
        <div
          ref={ref}
          className={`mt-14 sm:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 reveal ${
            isInView ? 'in-view' : ''
          }`}
        >
          {/* Bento Card 1: Flagship Differentiator (Spans 2 cols on LG) */}
          <div className="lg:col-span-2 rounded-3xl border border-navy/10 dark:border-white/10 bg-gradient-to-br from-white via-white to-royal/5 dark:from-white/[0.06] dark:via-white/[0.03] dark:to-accent/5 p-8 sm:p-10 shadow-card hover:shadow-card-lg transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-48 h-48 bg-royal/10 dark:bg-accent/10 rounded-bl-[100px] pointer-events-none" />
            
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-12 h-12 rounded-2xl bg-royal text-white dark:bg-accent dark:text-navy flex items-center justify-center shadow-md">
                  <Zap size={24} />
                </span>
                <span className="text-xs font-mono font-bold tracking-widest text-royal dark:text-accent uppercase">
                  Flagship Differentiator
                </span>
              </div>

              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-navy dark:text-white tracking-tight mb-4">
                Technology + Creativity Combined
              </h3>
              <p className="text-slatesoft dark:text-white/70 text-base sm:text-lg leading-relaxed max-w-2xl">
                Most agencies build creative assets that perform poorly, or engineering teams build rigid platforms that lack aesthetic appeal. We synthesize modern web engineering with brand design so every asset converts and scales.
              </p>
            </div>

            {/* Architecture pill matrix */}
            <div className="mt-8 pt-6 border-t border-navy/10 dark:border-white/10 flex flex-wrap items-center gap-2 sm:gap-3">
              {[
                { label: 'Sub-Second Load Times', icon: Zap },
                { label: 'Conversion Architecture', icon: CheckCircle2 },
                { label: 'Design System Cohesion', icon: Palette },
                { label: 'Enterprise Stack', icon: Code2 },
                { label: 'Verified Analytics', icon: BarChart3 }
              ].map((pill, pIdx) => (
                <span
                  key={pIdx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy/5 dark:bg-white/10 text-xs font-semibold text-navy dark:text-white/90 border border-navy/5 dark:border-white/5"
                >
                  <pill.icon size={13} className="text-royal dark:text-accent" />
                  {pill.label}
                </span>
              ))}
            </div>
          </div>

          {/* Bento Card 2: Dedicated Team */}
          <div className="rounded-3xl border border-navy/10 dark:border-white/10 bg-white dark:bg-white/[0.04] p-8 shadow-card hover:shadow-card-lg transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-royal/10 dark:bg-accent/10 text-royal dark:text-accent flex items-center justify-center mb-6">
                <Users size={24} />
              </div>
              <span className="text-xs font-mono font-bold tracking-widest text-royal dark:text-accent uppercase block mb-2">
                Embedded Pods
              </span>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-navy dark:text-white tracking-tight mb-3">
                Dedicated Brand Team
              </h3>
              <p className="text-slatesoft dark:text-white/70 text-sm leading-relaxed">
                A focused team assigned to your brand — not a revolving door of outsourced freelancers. Direct contact with the people building your marketing.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-navy/10 dark:border-white/10 flex items-center justify-between text-xs text-navy/70 dark:text-white/60 font-mono">
              <span>Direct Comms</span>
              <span className="text-royal dark:text-accent font-bold">Fast Turnaround</span>
            </div>
          </div>

          {/* Bento Card 3: Data-Driven Approach */}
          <div className="rounded-3xl border border-navy/10 dark:border-white/10 bg-white dark:bg-white/[0.04] p-8 shadow-card hover:shadow-card-lg transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-royal/10 dark:bg-accent/10 text-royal dark:text-accent flex items-center justify-center mb-6">
                <BarChart3 size={24} />
              </div>
              <span className="text-xs font-mono font-bold tracking-widest text-royal dark:text-accent uppercase block mb-2">
                Actionable Insights
              </span>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-navy dark:text-white tracking-tight mb-3">
                Data-Driven Approach
              </h3>
              <p className="text-slatesoft dark:text-white/70 text-sm leading-relaxed">
                Decisions backed by search volume, audience engagement telemetry, and real conversion data — never vanity numbers or guesswork.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-navy/10 dark:border-white/10 flex items-center justify-between text-xs text-navy/70 dark:text-white/60 font-mono">
              <span>Attribution</span>
              <span className="text-royal dark:text-accent font-bold">Clear Reporting</span>
            </div>
          </div>

          {/* Bento Card 4: Creative Strategy */}
          <div className="rounded-3xl border border-navy/10 dark:border-white/10 bg-white dark:bg-white/[0.04] p-8 shadow-card hover:shadow-card-lg transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-royal/10 dark:bg-accent/10 text-royal dark:text-accent flex items-center justify-center mb-6">
                <Palette size={24} />
              </div>
              <span className="text-xs font-mono font-bold tracking-widest text-royal dark:text-accent uppercase block mb-2">
                Brand Position
              </span>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-navy dark:text-white tracking-tight mb-3">
                Strategic Creativity
              </h3>
              <p className="text-slatesoft dark:text-white/70 text-sm leading-relaxed">
                Every visual, headline, and video campaign adheres to custom aesthetic guidelines designed to stand out distinctly in saturated feeds.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-navy/10 dark:border-white/10 flex items-center justify-between text-xs text-navy/70 dark:text-white/60 font-mono">
              <span>Brand Guidelines</span>
              <span className="text-royal dark:text-accent font-bold">Distinctive Identity</span>
            </div>
          </div>

          {/* Bento Card 5: End-to-End Solutions */}
          <div className="rounded-3xl border border-navy/10 dark:border-white/10 bg-white dark:bg-white/[0.04] p-8 shadow-card hover:shadow-card-lg transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-royal/10 dark:bg-accent/10 text-royal dark:text-accent flex items-center justify-center mb-6">
                <Layers size={24} />
              </div>
              <span className="text-xs font-mono font-bold tracking-widest text-royal dark:text-accent uppercase block mb-2">
                Complete Stack
              </span>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-navy dark:text-white tracking-tight mb-3">
                End-to-End Solutions
              </h3>
              <p className="text-slatesoft dark:text-white/70 text-sm leading-relaxed">
                From brand architecture and content creation to high-performance websites and search optimization — one team, zero vendor friction.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-navy/10 dark:border-white/10 flex items-center justify-between text-xs text-navy/70 dark:text-white/60 font-mono">
              <span>Unified Engine</span>
              <span className="text-royal dark:text-accent font-bold">Full Lifecycle</span>
            </div>
          </div>

          {/* Bento Card 6: Long-Term Partnership (Spans 3 cols on LG) */}
          <div className="lg:col-span-3 rounded-3xl border border-navy/10 dark:border-white/10 bg-gradient-to-r from-navy via-navy to-royal dark:from-white/[0.06] dark:via-navy-deep dark:to-white/[0.03] text-white p-8 sm:p-10 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <HeartHandshake className="text-gold" size={22} />
                <span className="text-xs font-mono font-bold tracking-widest text-gold uppercase">
                  Long-Term Growth Partner
                </span>
              </div>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight mb-3">
                We Build for Lasting Market Leadership
              </h3>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                We don't do transactional one-off jobs and disappear. We operate as your extended digital department, continually updating your technical infrastructure and optimizing your campaigns as your company grows.
              </p>
            </div>

            <div className="flex-shrink-0 w-full md:w-auto">
              <a
                href="#dm-enquiry"
                className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3.5 rounded-xl bg-gold hover:bg-gold-light text-navy font-bold text-sm shadow-md transition-all duration-200"
              >
                <span>Partner With Us</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DMWhyTeknon;

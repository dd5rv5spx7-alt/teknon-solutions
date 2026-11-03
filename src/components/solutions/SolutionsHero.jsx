import React from 'react';
import { ArrowRight, ShieldCheck, Terminal, Server, Cpu, CheckCircle2 } from 'lucide-react';

export default function SolutionsHero() {
  return (
    <section id="solutions-home" className="relative overflow-hidden bg-grad-navy pt-32 pb-32 sm:pt-40 sm:pb-44 border-b border-white/10">
      <div className="absolute inset-0 bg-dot-grid opacity-35" aria-hidden="true" />
      <div className="absolute -top-28 -left-28 w-[450px] h-[450px] bg-royal/20 rounded-full blur-[120px]" aria-hidden="true" />
      <div className="absolute top-1/3 -right-32 w-[420px] h-[420px] bg-accent/20 rounded-full blur-[120px]" aria-hidden="true" />

      <div className="relative container-px mx-auto max-w-8xl grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
        {/* Left Column: Heading, Value Prop, CTAs */}
        <div className="lg:col-span-7">
          <span className="eyebrow text-accent">
            <span aria-hidden="true">//</span> ATS IT Solutions &bull; Enterprise Engineering
          </span>

          <h1 className="mt-5 font-display font-extrabold text-4xl sm:text-5xl md:text-[3.3rem] leading-[1.08] tracking-tight text-white text-balance">
            Enterprise IT Architecture &amp;{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-[#7DB8FF] to-white">
              Software Solutions.
            </span>
          </h1>

          <p className="mt-6 text-lg text-white/70 leading-relaxed max-w-xl">
            Custom software engineering, cybersecurity consulting, penetration testing, and scalable cloud architecture — delivered by the engineering team behind our production stack.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#quote"
              className="btn-glow group inline-flex items-center gap-2 bg-grad-primary text-white font-semibold px-7 py-3.5 rounded-xl hover:brightness-110 transition-all shadow-glow-sm"
            >
              Request a Scoped Quote
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#services"
              className="inline-flex items-center gap-2 glass text-white font-medium px-6 py-3.5 rounded-xl hover:bg-white/15 transition-colors text-sm"
            >
              Explore Capabilities
            </a>
          </div>

          {/* Reliability Trust Pills */}
          <div className="mt-10 flex flex-wrap items-center gap-6 pt-6 border-t border-white/10 text-xs font-mono text-white/60">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-400" />
              99.9% Cloud Uptime SLA
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck size={15} className="text-accent" />
              SOC 2 &amp; OWASP Best Practices
            </span>
            <span className="inline-flex items-center gap-2">
              <Server size={15} className="text-royal" />
              Multi-Cloud Architecture
            </span>
          </div>
        </div>

        {/* Right Column: Interactive Architecture Terminal Mockup */}
        <div className="lg:col-span-5 relative">
          <div className="rounded-2xl border border-white/15 bg-navy-deep/95 shadow-2xl overflow-hidden backdrop-blur-xl">
            {/* Terminal Header */}
            <div className="px-4 py-3 border-b border-white/10 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
                <span className="ml-2 font-mono text-xs text-white/50">ats-cluster-telemetry.sh</span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] uppercase font-bold tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
              </span>
            </div>

            {/* Terminal Body */}
            <div className="p-5 font-mono text-xs leading-relaxed space-y-3.5 text-white/80">
              <div className="flex items-center justify-between text-white/50 border-b border-white/5 pb-2">
                <span>[ENGINEERING STATUS]</span>
                <span className="text-accent">PRODUCTION READY</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-white/60">Cloud Infrastructure:</span>
                  <span className="text-emerald-400 font-semibold">AWS + Kubernetes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Security Audit:</span>
                  <span className="text-emerald-400 font-semibold">0 Vulnerabilities (PASSED)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Average Latency:</span>
                  <span className="text-accent font-semibold">&lt; 18ms Edge Global</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Data Encryption:</span>
                  <span className="text-white/90">AES-256 / TLS 1.3</span>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center gap-2 text-accent text-[11px] mb-1 font-semibold">
                  <Cpu size={14} /> Systems Built &amp; Managed:
                </div>
                <p className="text-[11px] text-white/65 leading-normal">
                  Custom Web Platforms &bull; REST &amp; GraphQL APIs &bull; Penetration Testing Labs &bull; Cloud Migration
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

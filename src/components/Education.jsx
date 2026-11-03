import React from 'react';
import { GraduationCap, Calendar, MapPin, Award, BookOpen, ShieldCheck } from 'lucide-react';
import useInView from '../hooks/useInView.js';
import OrganizationLogo from './portfolio/PortfolioLogos.jsx';
import { EDUCATION } from '../data/portfolioData.js';

export default function Education() {
  const [headerRef, headerInView] = useInView();
  const [cardsRef, cardsInView] = useInView();

  return (
    <section
      id="education"
      className="relative py-24 sm:py-32 bg-[#06080E] text-white overflow-hidden border-t border-white/5"
    >
      {/* Background Lighting Elements */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative container-px mx-auto max-w-6xl">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={`reveal ${headerInView ? 'in-view' : ''} max-w-3xl`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-emerald-400 mb-5">
            <GraduationCap size={14} className="text-emerald-400" />
            <span>ACADEMIC FOUNDATION</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-white leading-[1.12]">
            Education &amp;{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-white">
              Qualifications.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed font-sans max-w-2xl">
            Formal education blending technical specialization in cybersecurity with foundational
            problem-solving and analytical training.
          </p>
        </div>

        {/* Minimal & Professional Education Cards */}
        <div
          ref={cardsRef}
          className={`reveal reveal-delay-2 ${cardsInView ? 'in-view' : ''} mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 gap-8`}
        >
          {EDUCATION.map((item, index) => {
            const isUniversity = item.id === 'srm-university';

            return (
              <div
                key={item.id}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-8 sm:p-9 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/30 hover:bg-white/[0.04] hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] flex flex-col justify-between"
              >
                <div>
                  {/* Header: Logo & Badge */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-14 h-14 rounded-2xl border border-white/10 bg-[#0C101A] p-1.5 grid place-items-center group-hover:scale-105 group-hover:border-emerald-500/30 transition-all duration-300 shadow-sm">
                      <OrganizationLogo type={item.logoType} className="w-10 h-10" />
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20">
                      <Award size={12} />
                      {item.badge}
                    </span>
                  </div>

                  {/* Institution Name */}
                  <div className="mt-6">
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-white group-hover:text-emerald-300 transition-colors">
                      {item.institution}
                    </h3>

                    {/* Degree & Specialization or Qualification */}
                    <p className="mt-2 text-base sm:text-lg font-medium text-zinc-200">
                      {item.degree ? (
                        <>
                          <span>{item.degree}</span>
                          <span className="text-zinc-500 font-normal"> &mdash; </span>
                          <span className="text-emerald-400 font-semibold">{item.specialization}</span>
                        </>
                      ) : (
                        <span>{item.qualification}</span>
                      )}
                    </p>

                    {item.field && (
                      <p className="text-xs sm:text-sm font-sans text-zinc-400 mt-0.5">
                        {item.field}
                      </p>
                    )}

                    {item.grades && (
                      <p className="text-xs sm:text-sm font-mono text-emerald-400/90 mt-1">
                        {item.grades}
                      </p>
                    )}
                  </div>

                  {/* Dates & Location */}
                  <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs font-mono text-zinc-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar size={13} className="text-emerald-400/80" />
                      {item.duration}
                    </span>
                    {item.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={13} className="text-zinc-500" />
                        {item.location}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="mt-5 text-sm sm:text-base text-zinc-300 leading-relaxed font-sans border-t border-white/10 pt-5">
                    {item.description}
                  </p>
                </div>

                {/* Academic Highlights & Key Competencies */}
                {item.highlights && item.highlights.length > 0 && (
                  <div className="mt-6 pt-5 border-t border-white/10">
                    <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold mb-3">
                      Focus Areas &amp; Rigor:
                    </p>
                    <ul className="space-y-2 text-xs sm:text-sm text-zinc-400">
                      {item.highlights.map((point, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/70 mt-1.5 shrink-0" />
                          <span className="leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

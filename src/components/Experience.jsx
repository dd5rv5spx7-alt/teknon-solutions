import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  ChevronDown,
  Sparkles,
  Briefcase,
  Users,
  HeartHandshake,
  CheckCircle2,
  ArrowUpRight,
  Shield,
  Layers,
} from 'lucide-react';
import useInView from '../hooks/useInView.js';
import OrganizationLogo from './portfolio/PortfolioLogos.jsx';
import {
  EXPERIENCES,
  PORTFOLIO_STATS,
  CATEGORY_FILTERS,
} from '../data/portfolioData.js';

export default function Experience() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [hoveredId, setHoveredId] = useState(null);
  const [headerRef, headerInView] = useInView();
  const [statsRef, statsInView] = useInView();
  const [timelineRef, timelineInView] = useInView();

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredExperiences =
    activeCategory === 'all'
      ? EXPERIENCES
      : EXPERIENCES.filter((exp) => exp.categoryType === activeCategory);

  return (
    <section
      id="experience"
      className="relative py-28 sm:py-36 bg-[#080B11] text-white overflow-hidden border-t border-white/5"
    >
      {/* Background Lighting & Fine Apple-style Grid */}
      <div
        className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:28px_28px] opacity-25 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/4 -left-48 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/3 -right-48 w-96 h-96 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative container-px mx-auto max-w-6xl">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={`reveal ${headerInView ? 'in-view' : ''} max-w-3xl`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-emerald-400 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>EXECUTIVE &amp; LEADERSHIP RECORD</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-white leading-[1.12]">
            Professional Experience &amp;{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-white">
              Leadership.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed font-sans max-w-2xl">
            A chronological timeline of technology leadership, student body governance, and
            community initiatives. Every position reflects authentic organizational roles
            and demonstrated impact.
          </p>
        </div>

        {/* Small Statistics Strip (Calculated Strictly from Verified Entries) */}
        <div
          ref={statsRef}
          className={`reveal reveal-delay-1 ${statsInView ? 'in-view' : ''} mt-12 sm:mt-14`}
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 sm:p-7 shadow-[0_8px_32px_rgba(0,0,0,0.36)]">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
              {/* Stat 1: Roles */}
              <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:px-4 first:pt-0 first:px-0">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 grid place-items-center text-emerald-400 shrink-0">
                  <Briefcase size={22} strokeWidth={2} />
                </div>
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                      {PORTFOLIO_STATS.rolesCount}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-400 font-medium mt-0.5">
                    Professional &amp; Leadership Roles
                  </p>
                </div>
              </div>

              {/* Stat 2: Organizations */}
              <div className="flex items-center gap-4 pt-6 sm:pt-0 sm:px-6">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 grid place-items-center text-blue-400 shrink-0">
                  <Layers size={22} strokeWidth={2} />
                </div>
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                      {PORTFOLIO_STATS.organizationsCount}
                    </span>
                    <span className="text-xs font-mono text-blue-400 font-semibold uppercase tracking-wider">
                      Institutions
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-400 font-medium mt-0.5">
                    Organizations &amp; Bodies
                  </p>
                </div>
              </div>

              {/* Stat 3: Technical & Social Initiatives */}
              <div className="flex items-center gap-4 pt-6 sm:pt-0 sm:px-6">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 grid place-items-center text-purple-400 shrink-0">
                  <Sparkles size={22} strokeWidth={2} />
                </div>
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                      {PORTFOLIO_STATS.initiativesCount}
                    </span>
                    <span className="text-xs font-mono text-purple-400 font-semibold uppercase tracking-wider">
                      Programs
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-400 font-medium mt-0.5">
                    Technical &amp; Social Initiatives
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mt-10 flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider mr-2 hidden sm:inline-block">
            Filter View:
          </span>
          {CATEGORY_FILTERS.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`text-xs sm:text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 border ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'bg-white/[0.03] text-zinc-400 border-white/10 hover:text-white hover:border-white/20'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Sophisticated Vertical Timeline */}
        <div
          ref={timelineRef}
          className={`reveal reveal-delay-2 ${timelineInView ? 'in-view' : ''} mt-12 sm:mt-16 relative`}
        >
          {/* Vertical Connecting Rail */}
          <div
            className="absolute left-[23px] sm:left-[27px] top-6 bottom-8 w-[2px] bg-gradient-to-b from-emerald-500/50 via-white/10 to-transparent pointer-events-none"
            aria-hidden="true"
          />

          <div className="space-y-10 sm:space-y-12">
            {filteredExperiences.map((item, idx) => {
              const isExpanded = expandedIds.has(item.id);
              const isHovered = hoveredId === item.id;
              const isCurrent = item.isCurrent;

              return (
                <div
                  key={item.id}
                  id={item.id}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="relative group pl-12 sm:pl-16 transition-all duration-300"
                >
                  {/* Timeline Indicator Node */}
                  <div className="absolute left-0 top-1.5 sm:top-2 flex items-center justify-center">
                    <div
                      className={`w-[48px] sm:w-[56px] h-[48px] sm:h-[56px] rounded-2xl border transition-all duration-300 grid place-items-center bg-[#0C101A] backdrop-blur-md ${
                        isCurrent
                          ? 'border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                          : isHovered
                          ? 'border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                          : 'border-white/15'
                      }`}
                    >
                      <OrganizationLogo
                        type={item.logoType}
                        className="w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Active Pulsing Indicator for Current Roles */}
                    {isCurrent && (
                      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#080B11]" />
                      </span>
                    )}
                  </div>

                  {/* Experience Entry Body */}
                  <div
                    className={`rounded-2xl border p-6 sm:p-8 transition-all duration-300 bg-white/[0.02] backdrop-blur-sm ${
                      isHovered
                        ? 'border-emerald-500/30 bg-white/[0.04] shadow-[0_12px_40px_rgba(0,0,0,0.45)]'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* Top Row: Category Badge & Status */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Role Category Badge */}
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide ${
                            item.categoryType === 'professional'
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : item.categoryType === 'leadership'
                              ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                              : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {item.categoryType === 'professional' ? (
                            <Briefcase size={12} />
                          ) : item.categoryType === 'leadership' ? (
                            <Users size={12} />
                          ) : (
                            <HeartHandshake size={12} />
                          )}
                          {item.categoryLabel}
                        </span>

                        {/* Employment type label if professional */}
                        {item.employmentType === 'Self-employed' && (
                          <span className="text-xs font-mono text-zinc-400 px-2.5 py-0.5 rounded-md bg-white/5 border border-white/5">
                            Self-employed
                          </span>
                        )}
                      </div>

                      {/* Current vs Concluded Indicator */}
                      {isCurrent ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Present Role
                        </span>
                      ) : (
                        <span className="text-xs font-mono text-zinc-500">
                          Concluded
                        </span>
                      )}
                    </div>

                    {/* Role Title & Organization */}
                    <div className="mt-2">
                      <h3 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                        {item.role}
                      </h3>
                      <p className="text-base sm:text-lg font-medium text-zinc-300 mt-1 flex items-center gap-2">
                        <span>{item.organization}</span>
                      </p>
                    </div>

                    {/* Meta: Dates, Location & Work Mode */}
                    <div className="mt-3 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs sm:text-sm font-mono text-zinc-400">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar size={14} className="text-emerald-400/80" />
                        {item.duration}
                      </span>
                      {item.location && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin size={14} className="text-zinc-500" />
                          {item.location}
                        </span>
                      )}
                      {item.workMode && (
                        <span className="text-zinc-500">
                          &bull; {item.workMode}
                        </span>
                      )}
                    </div>

                    {/* Short Description */}
                    <p className="mt-4 text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
                      {item.shortDescription}
                    </p>

                    {/* Expandable Extended Details (Smooth CSS Grid Transition) */}
                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                        isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="pt-4 mt-4 border-t border-white/10 space-y-2.5">
                          <p className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                            Key Responsibilities &amp; Initiatives:
                          </p>
                          <ul className="space-y-2 text-sm text-zinc-300 font-sans">
                            {item.detailedDescription.map((desc, dIdx) => (
                              <li key={dIdx} className="flex items-start gap-2.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 mt-2 shrink-0" />
                                <span className="leading-relaxed">{desc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Expand/Collapse Trigger */}
                    <button
                      type="button"
                      onClick={() => toggleExpand(item.id)}
                      className="mt-4 inline-flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-400 hover:text-emerald-300 transition-colors py-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 rounded"
                    >
                      <span>{isExpanded ? 'Show less' : 'Read more & scope'}</span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-300 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Technology & Skills Tags */}
                    {item.skills && item.skills.length > 0 && (
                      <div className="mt-5 pt-5 border-t border-white/10 flex flex-wrap items-center gap-2">
                        {item.skills.map((skill) => (
                          <span
                            key={skill}
                            className="text-xs font-sans px-3 py-1 rounded-full bg-white/[0.04] text-zinc-300 border border-white/10 transition-colors group-hover:border-white/20"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

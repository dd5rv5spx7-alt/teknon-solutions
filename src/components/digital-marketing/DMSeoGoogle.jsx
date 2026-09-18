import React from 'react';
import { 
  MapPin, 
  Search, 
  Star, 
  TrendingUp, 
  Globe, 
  Phone, 
  Navigation, 
  CheckCircle2, 
  Sliders, 
  ShieldCheck, 
  Sparkles
} from 'lucide-react';
import SectionHeading from '../SectionHeading.jsx';
import useInView from '../../hooks/useInView.js';

const SEO_PILLARS = [
  {
    icon: MapPin,
    title: 'Google Business Profile Optimization',
    badge: 'Local 3-Pack',
    description: 'We claim, verify, and supercharge your Google Business Profile so local buyers discover you first on Google Maps and Search.',
    points: [
      'Local 3-Pack top ranking blueprint',
      'Category & service hierarchy structuring',
      'Automated review generation & response strategy',
      'Weekly geo-tagged posts, offers & photo updates'
    ]
  },
  {
    icon: Navigation,
    title: 'Local Discovery & Citation Authority',
    badge: 'Zero Conflict NAP',
    description: 'Ensure consistent Name, Address, and Phone data across 50+ global directories to cement Google search algorithm trust.',
    points: [
      '100% consistent directory citation syndication',
      'High-intent geographic keyword targeting',
      'Dedicated hyper-local landing page architecture',
      'Localized backlink acquisition & brand mentions'
    ]
  },
  {
    icon: Sliders,
    title: 'On-Page & Technical Search Architecture',
    badge: 'Core Web Vitals',
    description: 'A website is only as strong as its technical foundation. We optimize every structural signal Google looks for.',
    points: [
      'Sub-second page load & Core Web Vitals optimization',
      'Schema.org structured data (LocalBusiness, FAQ, Service)',
      'Clean URL hierarchy & semantic H1-H6 heading tags',
      'Mobile-first crawlability & XML sitemap indexing'
    ]
  },
  {
    icon: TrendingUp,
    title: 'High-Intent Keyword & Content Strategy',
    badge: 'Buyer Intent',
    description: 'We prioritize terms people search right before they spend money, turning search clicks directly into qualified sales leads.',
    points: [
      'Commercial & transactional search intent mapping',
      'Topic clusters to build comprehensive domain authority',
      'Competitor keyword gap analysis & opportunity capture',
      'Live Google Search Console rank & conversion tracking'
    ]
  }
];

export default function DMSeoGoogle() {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <section id="dm-seo" className="py-28 sm:py-32 bg-white dark:bg-navy transition-colors duration-300 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-royal/5 dark:bg-royal/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 dark:bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-px mx-auto max-w-8xl relative z-10">
        <SectionHeading
          index="06"
          label="Search & Visibility"
          title="Dominate Local Search & Google Discovery."
          subtitle="From Google Business Profile 3-pack rankings to technical search infrastructure, we turn search intent into high-value inbound customers."
          align="left"
        />

        {/* 4 SEO Pillars Grid */}
        <div 
          ref={ref}
          className={`mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 reveal ${isInView ? 'in-view' : ''}`}
        >
          {SEO_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={idx}
                className="group relative rounded-3xl border border-navy/10 dark:border-white/10 bg-mist/60 dark:bg-navy-deep/60 p-7 sm:p-8 backdrop-blur-sm hover:border-royal/30 dark:hover:border-accent/40 transition-all duration-300 hover:shadow-card hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-royal/10 dark:bg-accent/15 grid place-items-center text-royal dark:text-accent shrink-0 group-hover:scale-110 transition-transform">
                    <Icon size={24} strokeWidth={2} />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-navy/5 dark:bg-white/10 text-navy/70 dark:text-white/80 font-mono text-xs font-semibold">
                    {pillar.badge}
                  </span>
                </div>

                <h3 className="font-display font-bold text-xl sm:text-2xl text-navy dark:text-white mb-3">
                  {pillar.title}
                </h3>
                <p className="text-slatesoft dark:text-white/65 text-sm leading-relaxed mb-6">
                  {pillar.description}
                </p>

                <div className="space-y-2.5 pt-4 border-t border-navy/5 dark:border-white/10">
                  {pillar.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-navy/80 dark:text-white/75">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Realistic Google Local 3-Pack & SERP Showcase ─────────────── */}
        <div className={`mt-16 reveal ${isInView ? 'in-view' : ''}`}>
          <div className="relative mx-auto max-w-5xl rounded-3xl bg-mist dark:bg-navy-deep border border-navy/10 dark:border-white/10 p-6 sm:p-10 shadow-card-lg overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <span className="eyebrow text-royal dark:text-accent">// Live Preview Simulation</span>
                <h4 className="font-display font-bold text-xl sm:text-2xl text-navy dark:text-white mt-1">
                  How Your Brand Appears on Google Search
                </h4>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20 w-fit">
                <Sparkles size={13} /> SAMPLE SERP AUDIT
              </span>
            </div>

            {/* Google Search Bar Mockup */}
            <div className="mb-6 bg-white dark:bg-white/5 rounded-full border border-navy/15 dark:border-white/15 px-4 sm:px-6 py-3 flex items-center gap-3 shadow-sm">
              <Search size={18} className="text-slatesoft dark:text-white/40 shrink-0" />
              <div className="flex-1 font-sans text-xs sm:text-sm text-navy dark:text-white truncate">
                <span className="text-navy dark:text-white font-medium">digital marketing & it solutions agency</span>
                <span className="text-slatesoft dark:text-white/40"> near me</span>
              </div>
              <span className="text-[10px] font-mono text-royal dark:text-accent font-bold uppercase tracking-wider hidden sm:inline-block">
                Top 3 Result
              </span>
            </div>

            {/* Local 3-Pack Listing Card */}
            <div className="bg-white dark:bg-white/[0.04] rounded-2xl border border-navy/10 dark:border-white/10 p-5 sm:p-6 shadow-sm mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-royal text-white text-[10px] font-bold font-mono">LOCAL 3-PACK RESULT</span>
                    <h5 className="font-display font-bold text-lg sm:text-xl text-navy dark:text-white">
                      ATS Group of Companies — Digital & IT Solutions
                    </h5>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slatesoft dark:text-white/70 mb-2">
                    <span className="font-bold text-amber-500 flex items-center gap-1">
                      4.9
                      <span className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                        ))}
                      </span>
                    </span>
                    <span>(128 reviews)</span>
                    <span>•</span>
                    <span className="text-navy/80 dark:text-white/80 font-medium">Marketing agency · Software company</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slatesoft dark:text-white/60 flex items-center gap-1.5">
                    <MapPin size={13} className="text-royal dark:text-accent shrink-0" />
                    <span>ATS Towers, Tech Corridor • Open · Closes 7:00 PM</span>
                  </p>
                </div>

                {/* Call-to-actions buttons */}
                <div className="flex items-center gap-2 sm:self-center shrink-0">
                  <a 
                    href="#dm-enquiry"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-royal text-white text-xs font-semibold shadow-sm hover:brightness-110 transition-all"
                  >
                    <Globe size={14} /> Website
                  </a>
                  <a 
                    href="#dm-enquiry"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-navy/15 dark:border-white/20 text-navy dark:text-white text-xs font-semibold hover:bg-navy/5 dark:hover:bg-white/5 transition-all"
                  >
                    <Phone size={14} /> Call
                  </a>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-navy/5 dark:border-white/5 flex flex-wrap items-center gap-3 text-xs text-slatesoft dark:text-white/60">
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <ShieldCheck size={14} /> Google Verified Business
                </span>
                <span>•</span>
                <span>Online appointments</span>
                <span>•</span>
                <span>On-site services available</span>
              </div>
            </div>

            {/* Organic Snippet with Rich Sitelinks */}
            <div className="bg-white dark:bg-white/[0.04] rounded-2xl border border-navy/10 dark:border-white/10 p-5 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-5 h-5 rounded-full bg-royal text-white text-[10px] grid place-items-center font-bold">A</div>
                <span className="text-xs text-slatesoft dark:text-white/60">https://ateknonsolutions.com › digital-marketing</span>
              </div>
              <h5 className="font-display font-bold text-base sm:text-lg text-royal dark:text-accent hover:underline cursor-pointer">
                Digital Marketing & IT Growth Solutions | ATS Group
              </h5>
              <p className="mt-1 text-xs sm:text-sm text-slatesoft dark:text-white/70 leading-relaxed max-w-3xl">
                Scale your brand with performance social media, high-converting responsive web development, local Google 3-pack SEO, and full-funnel digital execution. Free initial consultation.
              </p>

              {/* Sitelinks grid */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-navy/5 dark:border-white/5">
                <div className="text-xs">
                  <span className="font-semibold text-royal dark:text-accent block">Social Media Strategy</span>
                  <span className="text-slatesoft dark:text-white/50 text-[11px]">Reels, content creation & community growth.</span>
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-royal dark:text-accent block">Web Development</span>
                  <span className="text-slatesoft dark:text-white/50 text-[11px]">Modern, mobile-responsive custom websites.</span>
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-royal dark:text-accent block">Local SEO Ranking</span>
                  <span className="text-slatesoft dark:text-white/50 text-[11px]">Google Map optimization & review acceleration.</span>
                </div>
              </div>
            </div>

            {/* Results metrics bar */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-navy/5 dark:border-white/5">
                <p className="font-display font-extrabold text-xl sm:text-2xl text-royal dark:text-accent">+180%</p>
                <p className="text-[11px] font-mono text-slatesoft dark:text-white/60">Local Search Actions</p>
              </div>
              <div className="p-3 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-navy/5 dark:border-white/5">
                <p className="font-display font-extrabold text-xl sm:text-2xl text-emerald-500">4.8×</p>
                <p className="text-[11px] font-mono text-slatesoft dark:text-white/60">Direct Inbound Calls</p>
              </div>
              <div className="p-3 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-navy/5 dark:border-white/5">
                <p className="font-display font-extrabold text-xl sm:text-2xl text-royal dark:text-accent">100%</p>
                <p className="text-[11px] font-mono text-slatesoft dark:text-white/60">Organic Visibility</p>
              </div>
              <div className="p-3 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-navy/5 dark:border-white/5">
                <p className="font-display font-extrabold text-xl sm:text-2xl text-amber-500">Top 3</p>
                <p className="text-[11px] font-mono text-slatesoft dark:text-white/60">Google 3-Pack Placement</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

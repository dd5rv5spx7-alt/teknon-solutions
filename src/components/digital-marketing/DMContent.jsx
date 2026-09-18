import React, { useState } from 'react';
import { 
  Video, 
  Layers, 
  Smartphone, 
  Megaphone, 
  Lightbulb, 
  Sparkles, 
  Play, 
  Bookmark, 
  Heart, 
  Share2, 
  Clock, 
  ArrowRight,
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import SectionHeading from '../SectionHeading';
import useInView from '../../hooks/useInView';

const FORMAT_TABS = [
  { id: 'all', label: 'All Formats' },
  { id: 'reels', label: 'Short-Form Reels' },
  { id: 'carousels', label: 'Multi-Slide Carousels' },
  { id: 'educational', label: 'Educational Content' },
  { id: 'stories', label: 'Promotional Stories' },
  { id: 'campaigns', label: 'Brand Campaigns' },
];

const CONTENT_ITEMS = [
  {
    type: 'reels',
    badge: 'Short-Form Video',
    title: 'High-Retention Reels',
    headline: '0.3s Hook Framework That Captures Attention',
    desc: 'Cinematic color grading, trending audio, animated kinetic captions, and rapid hook sequencing engineered for organic reach.',
    stats: '24.5K avg views · 8.2% save rate',
    aspect: 'aspect-[9/14]',
    tagColor: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
    visual: (
      <div className="relative w-full h-full bg-gradient-to-b from-purple-950/60 via-navy-deep to-black flex flex-col justify-between p-5 rounded-2xl border border-white/10 overflow-hidden group">
        <div className="flex items-center justify-between z-10">
          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-white flex items-center gap-1.5 border border-white/15">
            <Flame size={12} className="text-pink-400" /> Viral Format
          </span>
          <span className="px-2 py-0.5 rounded bg-white/10 text-[9px] font-mono text-white/60">0:45</span>
        </div>
        
        <div className="my-auto text-center z-10">
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md grid place-items-center mx-auto text-white group-hover:scale-110 group-hover:bg-white transition-all duration-300 group-hover:text-navy shadow-glow">
            <Play size={22} className="ml-1 fill-current" />
          </div>
          <p className="mt-4 text-xs font-mono text-white/75 font-semibold">Cinematic Script + Kinetic Audio</p>
        </div>

        <div className="z-10 bg-black/50 backdrop-blur-sm p-3 rounded-xl border border-white/10">
          <p className="text-xs font-bold text-white leading-snug">"Why 90% of Local Brands Struggle With Digital Marketing"</p>
          <div className="flex items-center justify-between text-[10px] text-white/60 mt-2 font-mono">
            <span>🎵 Trending Brand Audio</span>
            <span className="text-emerald-400 font-bold">1.8K Shares</span>
          </div>
        </div>
      </div>
    )
  },
  {
    type: 'carousels',
    badge: 'Multi-Slide Deck',
    title: 'Value-First Carousels',
    headline: 'Step-by-Step Guides That Drive Massive Saves',
    desc: 'Structured storytelling decks designed to educate, build authoritative domain expertise, and prompt profile visits.',
    stats: '14.2% bookmark rate · 3.5× profile visits',
    aspect: 'aspect-square sm:aspect-[4/5]',
    tagColor: 'text-accent bg-royal/10 border-royal/20',
    visual: (
      <div className="relative w-full h-full bg-gradient-to-br from-navy-deep via-[#0A1A3D] to-navy p-5 rounded-2xl border border-white/10 flex flex-col justify-between overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full bg-royal/20 text-accent text-[10px] font-mono font-bold border border-royal/30">
            Slide 1 of 7
          </span>
          <span className="flex items-center gap-1 text-[11px] text-white/60 font-mono">
            <Bookmark size={12} className="text-accent" /> Save Deck
          </span>
        </div>

        <div className="space-y-3 my-auto">
          <span className="text-[10px] font-mono tracking-widest text-accent uppercase font-bold">// Growth Playbook</span>
          <h4 className="font-display font-extrabold text-xl text-white leading-snug">
            The 5-Point Website Architecture That Converts Visitors Into Enquiries
          </h4>
          <div className="flex gap-1.5 pt-2">
            {[...Array(7)].map((_, i) => (
              <div key={i} className={`h-1 rounded-full ${i === 0 ? 'w-6 bg-accent' : 'w-2 bg-white/20'}`} />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-white/60">
          <span>Swipe to learn →</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><Heart size={12} className="text-pink-400" /> 842</span>
            <span className="flex items-center gap-1"><Share2 size={12} /> 219</span>
          </div>
        </div>
      </div>
    )
  },
  {
    type: 'educational',
    badge: 'Infographic Framework',
    title: 'Visual Knowledge Frameworks',
    headline: 'Simplifying Complex Technical Concepts',
    desc: 'Clean diagrams and infographics that position your leadership team as definitive industry authorities.',
    stats: 'Top shared format · High dwell time',
    aspect: 'aspect-square sm:aspect-[4/5]',
    tagColor: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    visual: (
      <div className="relative w-full h-full bg-gradient-to-br from-navy-deep to-slate-900 p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full bg-amber-400/15 text-amber-300 text-[10px] font-mono font-bold border border-amber-400/20">
            FRAMEWORK
          </span>
          <span className="text-[10px] font-mono text-white/40">Topical Authority</span>
        </div>

        <div className="space-y-2.5 my-auto">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/8 flex items-center gap-3">
            <span className="w-6 h-6 rounded-lg bg-royal/20 text-accent grid place-items-center font-bold text-xs font-mono">01</span>
            <span className="text-xs text-white font-medium">Search Intent &amp; Persona Mapping</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/8 flex items-center gap-3">
            <span className="w-6 h-6 rounded-lg bg-royal/20 text-accent grid place-items-center font-bold text-xs font-mono">02</span>
            <span className="text-xs text-white font-medium">Core Web Vitals &amp; Page Architecture</span>
          </div>
          <div className="p-2.5 rounded-xl bg-royal/15 border border-royal/30 flex items-center gap-3">
            <span className="w-6 h-6 rounded-lg bg-royal text-white grid place-items-center font-bold text-xs font-mono">03</span>
            <span className="text-xs text-white font-bold">Continuous Conversion Optimization</span>
          </div>
        </div>

        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50 font-mono">
          <span>Brand Watermarked</span>
          <span className="text-accent">High Save Rate</span>
        </div>
      </div>
    )
  },
  {
    type: 'stories',
    badge: 'Interactive Stories',
    title: 'Engaging 24-Hr Stories',
    headline: 'Direct Polls, Link Stickers & Urgent Inquiries',
    desc: 'Behind-the-scenes glimpses, limited promotions, student/client milestones, and interactive polls that route leads directly to chat.',
    stats: '68% completion rate · Direct DM triggers',
    aspect: 'aspect-[9/14]',
    tagColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    visual: (
      <div className="relative w-full h-full bg-gradient-to-b from-slate-900 via-navy-deep to-navy p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex gap-1">
            <div className="flex-1 h-0.5 bg-white rounded-full" />
            <div className="flex-1 h-0.5 bg-white/30 rounded-full" />
            <div className="flex-1 h-0.5 bg-white/30 rounded-full" />
          </div>
          <div className="flex items-center justify-between text-xs text-white/70 pt-1">
            <span className="font-bold text-white">atsgroup.official</span>
            <span className="text-[10px] font-mono text-white/40">3h ago</span>
          </div>
        </div>

        <div className="my-auto text-center space-y-3">
          <span className="px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-medium border border-white/15">
            Quick Poll
          </span>
          <p className="font-display font-bold text-lg text-white">
            Is your website generating consistent leads every week?
          </p>
          <div className="space-y-1.5 max-w-xs mx-auto text-left">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex justify-between">
              <span>Yes, fully optimized</span>
              <span>28%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-royal/30 border border-royal/50 text-white text-xs font-semibold flex justify-between">
              <span>No, we need help</span>
              <span className="text-accent font-bold">72%</span>
            </div>
          </div>
        </div>

        <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 text-center text-xs font-semibold text-white">
          💬 Send direct WhatsApp inquiry
        </div>
      </div>
    )
  },
  {
    type: 'campaigns',
    badge: 'Brand Campaign Creatives',
    title: 'High-Impact Promotional Ads',
    headline: 'Conversion-Tuned Commercial Campaign Creatives',
    desc: 'Targeted visual ads built for paid campaigns, festival offers, service launches, and lead magnet promotion.',
    stats: 'Low cost per lead · Clear offer hierarchy',
    aspect: 'aspect-square sm:aspect-[4/5]',
    tagColor: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    visual: (
      <div className="relative w-full h-full bg-gradient-to-tr from-navy-deep via-purple-950/40 to-slate-900 p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold border border-purple-500/30">
            LAUNCH CAMPAIGN
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">● ACTIVE</span>
        </div>

        <div className="my-auto space-y-2">
          <span className="text-[10px] font-mono tracking-widest text-accent uppercase font-bold">Limited Quarterly Batch</span>
          <h4 className="font-display font-extrabold text-2xl text-white leading-tight">
            Scale Your Business With ATS Digital Solutions
          </h4>
          <p className="text-xs text-white/60">Complete social media, website, and Google search execution under one team.</p>
        </div>

        <div className="p-3 rounded-xl bg-grad-primary text-white text-center font-semibold text-xs shadow-glow">
          Claim Free Strategic Consultation
        </div>
      </div>
    )
  },
];

export default function DMContent() {
  const [ref, isInView] = useInView();
  const [activeTab, setActiveTab] = useState('all');

  const filteredItems = activeTab === 'all' 
    ? CONTENT_ITEMS 
    : CONTENT_ITEMS.filter(item => item.type === activeTab);

  return (
    <section id="dm-content" className="py-28 sm:py-32 bg-white dark:bg-navy relative overflow-hidden transition-colors duration-300">
      <div className="container-px mx-auto max-w-8xl relative z-10">
        <SectionHeading
          index="04"
          label="Content Creation"
          title="Content That Makes People Stop Scrolling."
          subtitle="From cinematic reels to high-converting carousels and brand campaigns — every asset is designed to capture attention and communicate your brand."
          align="center"
        />

        {/* ── Interactive Category Pills ─────────────── */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
          {FORMAT_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-royal dark:bg-accent text-white dark:text-navy font-semibold shadow-sm'
                  : 'bg-mist dark:bg-white/5 text-slatesoft dark:text-white/60 hover:text-navy dark:hover:text-white border border-navy/5 dark:border-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Visual Content Gallery Grid ─────────────── */}
        <div 
          ref={ref} 
          className={`reveal ${isInView ? 'in-view' : ''} mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`}
        >
          {filteredItems.map((item, idx) => (
            <div 
              key={idx}
              className="group rounded-3xl border border-navy/10 dark:border-white/10 bg-mist/50 dark:bg-navy-deep/50 p-6 flex flex-col justify-between hover:shadow-card-lg hover:border-royal/30 dark:hover:border-accent/30 transition-all duration-300"
            >
              {/* Visual Mockup Box */}
              <div className={`w-full ${item.aspect} mb-6 rounded-2xl overflow-hidden shadow-card group-hover:scale-[1.01] transition-transform duration-300`}>
                {item.visual}
              </div>

              {/* Text Info */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${item.tagColor}`}>
                    {item.badge}
                  </span>
                  <span className="text-[10px] font-mono text-slatesoft dark:text-white/40">
                    {item.stats}
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-navy dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slatesoft dark:text-white/65 leading-relaxed mb-4">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-navy/5 dark:border-white/10 flex items-center justify-between text-xs text-royal dark:text-accent font-semibold">
                <span>View format specs</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


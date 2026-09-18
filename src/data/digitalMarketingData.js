import {
  Megaphone, AtSign, PenTool, Video, Globe, Search,
  BarChart3, Palette, Target, TrendingUp, Users, Lightbulb,
  Zap, Shield, HeartHandshake, Layers, ArrowUpRight,
  Calendar, Eye, MessageSquare, Smartphone, Share2,
  Building2, Store, LayoutTemplate, ShoppingCart, UserSquare, Wrench,
} from 'lucide-react';

// ── Services ──────────────────────────────────────────────────────────────

export const DM_SERVICES = [
  {
    icon: Share2,
    name: 'Social Media Management',
    description:
      'Strategic management of your social channels — content calendars, scheduled publishing, audience engagement, and transparent performance reporting.',
  },
  {
    icon: AtSign,
    name: 'Instagram Page Creation',
    description:
      'A fully optimized Instagram presence built like a digital storefront — professional bio, highlight covers, brand identity, and content templates.',
  },
  {
    icon: PenTool,
    name: 'Content Creation',
    description:
      'Scroll-stopping posts, carousels, stories, and promotional creatives designed to communicate your brand clearly and consistently.',
  },
  {
    icon: Video,
    name: 'Reels & Short-Form Video Strategy',
    description:
      'High-retention video content crafted for Instagram Reels and short-form platforms, with scripting, editing, and publishing support.',
  },
  {
    icon: Globe,
    name: 'Website Design & Development',
    description:
      'Modern, responsive websites built with clean code, fast load times, SEO foundations, and lead-capture integrations.',
  },
  {
    icon: Search,
    name: 'SEO & Google Business Optimization',
    description:
      'Improve local search visibility through on-page SEO, Google Business Profile optimization, keyword strategy, and structured data.',
  },
  {
    icon: Megaphone,
    name: 'Digital Marketing Campaigns',
    description:
      'Targeted campaigns across platforms — strategic planning, audience research, creative execution, and performance tracking.',
  },
  {
    icon: Palette,
    name: 'Branding & Creative Design',
    description:
      'Visual identity systems including logo direction, color architecture, typography standards, brand guidelines, and profile aesthetics.',
  },
  {
    icon: Target,
    name: 'Lead Generation',
    description:
      'Structured lead funnels combining WhatsApp routing, enquiry forms, landing pages, and conversion tracking to turn visitors into clients.',
  },
  {
    icon: TrendingUp,
    name: 'Digital Growth Strategy',
    description:
      'End-to-end strategic planning that connects branding, content, social media, website, and marketing into one cohesive growth plan.',
  },
];

// ── Packages ──────────────────────────────────────────────────────────────

export const DM_PACKAGES = [
  {
    name: 'Silver',
    tier: 'Digital Foundation',
    tagline: 'For businesses beginning their digital journey.',
    highlighted: false,
    features: [
      'Social media setup & profile optimization',
      'Content strategy & content calendar',
      'Professional creative content',
      'Caption & hashtag strategy',
      'Basic social media management',
      'Monthly performance insights',
      'Digital consultation',
    ],
    footer: 'Foundation Level • Rapid Deployment',
  },
  {
    name: 'Gold',
    tier: 'Business Growth',
    tagline: 'For businesses actively growing their digital presence.',
    highlighted: true,
    badge: 'Most Popular',
    features: [
      'Everything in Silver',
      'Advanced social media management',
      'Premium content creation',
      'Reels & short-form video strategy',
      'Instagram page creation / revamp',
      'Audience research & engagement strategy',
      'Website development',
      'SEO foundation & Google Business optimization',
      'Lead/enquiry journey setup',
      'Growth reporting',
    ],
    footer: 'Complete Brand & Web Ecosystem',
  },
  {
    name: 'Platinum',
    tier: 'Complete Digital Brand',
    tagline: 'For businesses wanting a complete digital ecosystem.',
    highlighted: false,
    features: [
      'Everything in Gold',
      'Complete digital strategy',
      'Advanced website development',
      'Branding & identity system',
      'Premium content system',
      'Reels & campaign strategy',
      'Advanced SEO & local visibility',
      'Lead generation strategy',
      'WhatsApp integration',
      'Analytics & conversion tracking',
      'Ongoing optimization',
      'Priority strategic support',
    ],
    footer: 'Full Agency Execution & Dominance',
  },
];

// ── Process Steps ─────────────────────────────────────────────────────────

export const DM_PROCESS_STEPS = [
  { step: '01', title: 'Discover', desc: 'We learn about your business, audience, and goals to build a clear picture of where you stand and where you want to go.', icon: Eye },
  { step: '02', title: 'Strategize', desc: 'We design a tailored digital roadmap — from brand positioning and content themes to platform priorities and growth targets.', icon: Lightbulb },
  { step: '03', title: 'Build', desc: 'We set up your digital infrastructure — website, social profiles, brand assets, and lead-capture systems.', icon: Layers },
  { step: '04', title: 'Create', desc: 'Our team produces content, creatives, and campaigns aligned to the strategy — consistently and at quality.', icon: PenTool },
  { step: '05', title: 'Launch', desc: 'We publish, promote, and activate your digital presence across all configured channels.', icon: Zap },
  { step: '06', title: 'Grow', desc: 'We measure, optimize, and iterate — turning data into better content, stronger engagement, and more leads.', icon: TrendingUp },
];

// ── Social Media Workflow ─────────────────────────────────────────────────

export const DM_SOCIAL_WORKFLOW = [
  { label: 'Strategy', icon: Lightbulb, description: 'Audience & competitor research defining brand voice, positioning and targets.' },
  { label: 'Content Plan', icon: Calendar, description: 'Structured monthly editorial calendars aligned with business priorities.' },
  { label: 'Design', icon: Palette, description: 'Scroll-stopping visual assets, high-converting carousels and promotional graphics.' },
  { label: 'Publish', icon: ArrowUpRight, description: 'Peak-time scheduling with hashtag architecture and engaging captions.' },
  { label: 'Engage', icon: MessageSquare, description: 'Community response, DM routing, conversation sparking and audience nurturing.' },
  { label: 'Analyse', icon: BarChart3, description: 'Transparent reporting on reach, impressions, interactions and profile visits.' },
  { label: 'Optimise', icon: TrendingUp, description: 'Iterative adjustments to creative and scheduling to compound growth over time.' },
];

// ── Growth Ecosystem ──────────────────────────────────────────────────────

export const DM_GROWTH_ECOSYSTEM = [
  { label: 'Brand', icon: Palette, description: 'Distinct identity, logo standards, typography and consistent aesthetic foundation.' },
  { label: 'Website', icon: Globe, description: 'Fast, conversion-focused digital headquarters turning traffic into qualified prospects.' },
  { label: 'Social Media', icon: Smartphone, description: 'Active community engagement and organic audience building across key platforms.' },
  { label: 'Content', icon: PenTool, description: 'High-value posts, carousels, and reels establishing authority and brand affinity.' },
  { label: 'Marketing', icon: Megaphone, description: 'Targeted campaigns and local search optimization expanding your reach.' },
  { label: 'Leads', icon: Target, description: 'Automated WhatsApp routing and enquiry captures converting interest to pipeline.' },
  { label: 'Growth', icon: TrendingUp, description: 'Compounding brand equity, recurring revenue and measurable market leadership.' },
];

// ── Instagram Features ────────────────────────────────────────────────────

export const DM_INSTAGRAM_FEATURES = [
  'Profile creation & bio optimization',
  'Profile positioning & brand identity',
  'Highlight covers & story templates',
  'Content templates & brand kit',
  'Reels strategy & content calendar',
  'CTA optimization',
];

// ── Website Types ─────────────────────────────────────────────────────────

export const DM_WEBSITE_TYPES = [
  {
    icon: Building2,
    title: 'Corporate Websites',
    description: 'Professional multi-page sites for established businesses — structured for trust, credibility, and lead capture.',
  },
  {
    icon: Store,
    title: 'Business Websites',
    description: 'Clean, conversion-focused websites for local and regional businesses looking to grow their online presence.',
  },
  {
    icon: LayoutTemplate,
    title: 'Landing Pages',
    description: 'High-converting single-page experiences built specifically to turn visitors into enquiries or customers.',
  },
  {
    icon: ShoppingCart,
    title: 'E-commerce Websites',
    description: 'Product-ready online stores with catalogue management, payments, and a seamless buying experience.',
  },
  {
    icon: UserSquare,
    title: 'Portfolio Websites',
    description: 'Elegant showcases for professionals, agencies, and creatives to display their work with impact.',
  },
  {
    icon: Wrench,
    title: 'Custom Web Applications',
    description: 'Bespoke web-based tools and dashboards built to exact business requirements and workflows.',
  },
];

export const DM_WEBSITE_HIGHLIGHTS = [
  { icon: Palette, label: 'Modern UI/UX' },
  { icon: Smartphone, label: 'Mobile Responsive' },
  { icon: Zap, label: 'Performance Optimized' },
  { icon: Search, label: 'SEO Ready' },
  { icon: Shield, label: 'Secure' },
  { icon: Target, label: 'Lead Generation' },
  { icon: MessageSquare, label: 'WhatsApp Integration' },
  { icon: PenTool, label: 'Enquiry Forms' },
];

// ── Why Teknon ────────────────────────────────────────────────────────────

export const DM_WHY_TEKNON = [
  {
    icon: Users,
    title: 'Dedicated Team',
    description: 'A focused team assigned to your brand — not a rotating roster of freelancers.',
  },
  {
    icon: Lightbulb,
    title: 'Creative Strategy',
    description: 'Every piece of content and campaign is guided by a clear strategic direction.',
  },
  {
    icon: Zap,
    title: 'Technology + Creativity',
    description: 'We combine technical execution with creative design for results that actually work.',
  },
  {
    icon: BarChart3,
    title: 'Data-Driven Approach',
    description: 'Decisions backed by performance data, audience insights, and measurable outcomes.',
  },
  {
    icon: Layers,
    title: 'End-to-End Solutions',
    description: 'From branding and content to websites and lead generation — one team, one ecosystem.',
  },
  {
    icon: HeartHandshake,
    title: 'Long-Term Partnership',
    description: 'We work as an extension of your team, invested in your growth beyond a one-off project.',
  },
];

// ── Content Types ─────────────────────────────────────────────────────────

export const DM_CONTENT_TYPES = [
  { label: 'Instagram Posts', icon: AtSign },
  { label: 'Carousels', icon: Layers },
  { label: 'Reels', icon: Video },
  { label: 'Stories', icon: Smartphone },
  { label: 'Promotional Creatives', icon: Megaphone },
  { label: 'Educational Content', icon: Lightbulb },
];

// ── Intro Pillars ─────────────────────────────────────────────────────────

export const DM_INTRO_PILLARS = [
  { label: 'Strategy', icon: Lightbulb, description: 'Every move starts with a clear plan tied to your business goals.' },
  { label: 'Creativity', icon: Palette, description: 'Visuals and messaging crafted to stand out in a crowded feed.' },
  { label: 'Technology', icon: Globe, description: 'Modern tools and platforms powering every campaign and website.' },
  { label: 'Execution', icon: Zap, description: 'Consistent, reliable delivery — from content to code to campaigns.' },
  { label: 'Growth', icon: TrendingUp, description: 'Measurable progress toward real business outcomes.' },
];

// ── Sample Case Studies ───────────────────────────────────────────────────

export const DM_CASE_STUDIES = [
  {
    isSample: true,
    client: 'Local Retail Business',
    industry: 'Retail & E-commerce',
    challenge: 'No social media presence and zero online visibility in local search results.',
    strategy: 'Complete Instagram setup, Google Business optimization, and a content calendar targeting local audiences.',
    execution: 'Profile creation, 30 branded posts, highlight covers, local SEO, and Google Maps optimization over 8 weeks.',
    result: 'Established a professional digital presence across Instagram and Google — ready for organic growth.',
  },
  {
    isSample: true,
    client: 'Professional Services Firm',
    industry: 'Professional Services',
    challenge: 'Outdated website and inconsistent branding across digital channels.',
    strategy: 'New responsive website, brand identity refresh, and social media content system.',
    execution: 'Website redesign, brand guidelines, 40+ content templates, and ongoing social media management over 12 weeks.',
    result: 'A cohesive, modern digital presence that accurately represents the quality of the firm\'s services.',
  },
];

// ── DM Service Options (for enquiry form dropdown) ────────────────────────

export const DM_SERVICE_OPTIONS = [
  'Social Media Management',
  'Instagram Page Creation',
  'Content Creation',
  'Reels & Video Strategy',
  'Website Design & Development',
  'SEO & Google Business',
  'Digital Marketing Campaigns',
  'Branding & Creative Design',
  'Lead Generation',
  'Digital Growth Strategy',
  'Complete Digital Package',
  'Not sure yet',
];

export const DM_TIMELINE_OPTIONS = [
  'Starting immediately',
  'Within 2 weeks',
  'Within 1 month',
  'Within 3 months',
  'Just exploring options',
];

// ── SEO ───────────────────────────────────────────────────────────────────

export const DM_SEO = {
  title: 'Digital Marketing & Growth Services | ATS Group of Companies',
  description:
    'Build a stronger online presence with social media management, Instagram marketing, content creation, website development, SEO, branding, and digital marketing services from ATS Group of Companies, Rajahmundry.',
  ogTitle: 'ATS Group of Companies — Digital Marketing & Digital Growth Services',
  ogDescription:
    'Social media, content, websites, branding, and digital marketing — all under one team. Build your digital presence with ATS Group of Companies.',
};


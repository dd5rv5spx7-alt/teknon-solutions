import {
  Code2, ShieldCheck, Crosshair, Bug, Cloud, Compass, LifeBuoy, Users,
  Search, ClipboardList, FileText, Wrench, RefreshCw,
  Eye, Handshake, MessageSquare,
} from 'lucide-react';

export const SOLUTIONS_SERVICES = [
  {
    icon: Code2,
    name: 'Website & Software Development',
    description: "Custom websites, web apps, and business software, end-to-end. Built by the same team that runs this stack (React, Node.js, Supabase, PostgreSQL) in production, not just in a classroom.",
  },
  {
    icon: ShieldCheck,
    name: 'Cybersecurity Consulting & Audits',
    description: 'Security audits and risk assessments benchmarked against widely recognized industry frameworks, plus ongoing advisory to prioritize the risks that matter most.',
  },
  {
    icon: Crosshair,
    name: 'Penetration Testing',
    description: 'Simulated real-world attacks across network, web app, API, cloud, and social-engineering vectors, going beyond automated scanning to show how a determined attacker could actually get in — with a clear, prioritized remediation report.',
  },
  {
    icon: Bug,
    name: 'Malware Analysis & Threat Research',
    description: 'In-depth static and dynamic analysis of suspicious files in an isolated environment, using industry-recognized methodologies to surface behavior, indicators of compromise, and containment guidance.',
  },
  {
    icon: Cloud,
    name: 'Cloud & DevOps Solutions',
    description: 'Cloud migration, infrastructure-as-code, and CI/CD pipeline setup across AWS, Azure, and GCP — built to help you ship faster without firefighting infrastructure.',
  },
  {
    icon: Compass,
    name: 'IT Consulting & Technology Advisory',
    description: 'Independent guidance on architecture, stack, and technology decisions for growing teams — the same fundamentals we teach, applied to your product and roadmap.',
  },
  {
    icon: LifeBuoy,
    name: 'Managed IT Support',
    description: 'Ongoing monitoring, maintenance, and support for infrastructure and applications — helping catch issues early and reduce downtime.',
  },
  {
    icon: Users,
    name: 'IT Staffing & Talent Placement',
    description: 'Access to a pipeline of trained, project-ready developers and security analysts from our own programs, for internships, contract work, or full-time hires.',
  },
];

export const SOLUTIONS_PROCESS_STEPS = [
  {
    step: '01',
    title: 'Discovery & Scoping',
    desc: 'We start with a conversation about your goals, systems, and constraints to define exactly what is in and out of scope.',
    icon: Search,
  },
  {
    step: '02',
    title: 'Assessment & Design',
    desc: 'We assess your current environment and design an approach and timeline tailored to the engagement, whether that is a build, an audit, or both.',
    icon: ClipboardList,
  },
  {
    step: '03',
    title: 'Execution',
    desc: 'Our team gets to work — writing code, running tests, or carrying out agreed engagement activities — with regular check-ins along the way.',
    icon: Code2,
  },
  {
    step: '04',
    title: 'Reporting & Delivery',
    desc: 'You receive clear deliverables: working software, or a prioritized findings report written for both technical and non-technical stakeholders.',
    icon: FileText,
  },
  {
    step: '05',
    title: 'Remediation Support',
    desc: 'We help you address findings or issues that surface during the engagement, prioritizing what matters most first.',
    icon: Wrench,
  },
  {
    step: '06',
    title: 'Review & Retest',
    desc: 'We revisit the work together to confirm fixes hold and the engagement’s goals were met.',
    icon: RefreshCw,
  },
];

export const SOLUTIONS_TRUST_POINTS = [
  {
    icon: Eye,
    title: 'Independent, Objective Recommendations',
    desc: "We're not incentivized to push a specific tool or platform — our recommendations are based on what actually fits your situation.",
  },
  {
    icon: ClipboardList,
    title: 'Process Rigor & Repeatability',
    desc: 'Every engagement follows the same structured process rather than ad hoc guesswork, so quality does not depend on who is assigned.',
  },
  {
    icon: Handshake,
    title: 'Built for an Ongoing Relationship',
    desc: 'We aim to be a long-term partner, not a one-and-done vendor — available for follow-up work as your needs evolve.',
  },
  {
    icon: MessageSquare,
    title: 'Reporting Everyone Can Actually Use',
    desc: 'Findings and recommendations are written in plain language, so both your engineers and your leadership can act on them.',
  },
];

export const CASE_STUDY_BADGE = 'Internal build — not a client engagement';

export const SOLUTIONS_CASE_STUDIES = [
  {
    title: 'Student Learning Portal & Dashboard',
    badge: CASE_STUDY_BADGE,
    problem: 'Students needed one place to track courses, assignments, progress, and certificates without emailing the office for every update.',
    solution: 'We built a role-based student dashboard covering course access, assignment submission, progress tracking, and certificate downloads.',
    result: 'Students and staff now self-serve day-to-day academic tracking instead of routing it through manual admin work.',
  },
  {
    title: 'Public Certificate Verification',
    badge: CASE_STUDY_BADGE,
    problem: 'Employers and institutions had no fast way to confirm that a certificate we issued was genuine.',
    solution: 'We built a public verification page where anyone can look up a certificate by its certificate number and see its validity.',
    result: 'Certificate authenticity can now be checked in seconds, without contacting our team directly.',
  },
  {
    title: 'Payments & Invoicing Pipeline',
    badge: CASE_STUDY_BADGE,
    problem: 'Manual payment collection did not scale as enrollment grew, and it made refunds and discount codes harder to track.',
    solution: 'We built a Razorpay-based checkout flow with GST-compliant invoicing, refund handling, and coupon code support.',
    result: 'Enrollment payments, invoices, refunds, and promotions are now handled through one consistent pipeline.',
  },
];

export const SOLUTIONS_FAQS = [
  {
    q: 'How does pricing work?',
    a: "We don't publish flat pricing — every engagement is scoped individually based on your goals, systems, and timeline, and priced accordingly in a quote. Tell us what you need through the form below and we'll follow up with a scoped proposal.",
  },
  {
    q: 'How long does a typical engagement take?',
    a: "It depends on scope. A focused audit or a small website build might wrap up in a few weeks, while a larger development or security engagement can run several months. We'll give you a realistic estimate once we understand what you need.",
  },
  {
    q: 'Can we sign an NDA, and who owns the IP?',
    a: 'Yes, NDAs are available on request before we discuss project details. IP ownership terms are finalized in the engagement contract, so we can confirm exactly how that works for your project during scoping.',
  },
  {
    q: 'Do you offer support after launch or after an engagement ends?',
    a: "Support options are part of the proposal for each engagement — we'll lay out what's included and what ongoing support would look like before you commit, rather than assuming a fixed plan applies to everyone.",
  },
  {
    q: 'How is our data handled during a security engagement?',
    a: 'Data handling and access are scoped and agreed with you before any engagement begins, so you know exactly what we can see and touch ahead of time. Specific details are worked out as part of scoping for each project.',
  },
];

export const SOLUTIONS_TIMELINE_OPTIONS = ['ASAP', '1-3 months', '3-6 months', 'Just exploring'];

import React, { useState } from 'react';
import { Phone, MapPin, Mail, Send, ChevronRight } from 'lucide-react';
import { Instagram, Linkedin, Github, Facebook, Youtube } from './icons/BrandIcons.jsx';
import Logo from './Logo.jsx';
import { SOCIAL_LINKS, CONTACT } from '../data/siteData.js';

const ICON_MAP = { Instagram, Linkedin, Github, Facebook, Youtube };

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    const msg = `Hi ATS Group of Companies, I'd like to subscribe to updates. My email: ${email}`;
    const waUrl = `https://wa.me/${CONTACT.phoneRaw}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-navy-deep text-white pt-20 pb-10 border-t border-white/10">
      <div className="container-px mx-auto max-w-8xl">
        {/* Main Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-16 border-b border-white/10">
          {/* Col 1: ATS Group Brand Statement (4 cols on lg) */}
          <div className="lg:col-span-4 flex flex-col items-start pr-0 lg:pr-4">
            <Logo variant="light" />
            <span className="mt-3 inline-block text-[10px] font-mono tracking-widest text-accent font-bold uppercase">
              ATS GROUP OF COMPANIES
            </span>
            <p className="mt-3 text-white/60 text-sm leading-relaxed max-w-sm">
              ATS Group of Companies bridges talent development and business transformation. Powering future tech leaders through Teknon Solutions and delivering scalable digital growth through ATS Digital Solutions.
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              {SOCIAL_LINKS.map((social) => {
                const Icon = ICON_MAP[social.icon];
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    aria-label={social.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 grid place-items-center rounded-full border border-white/15 text-white/70 hover:border-accent hover:text-accent hover:bg-white/5 transition-all"
                  >
                    <Icon size={15} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Col 2: Company (2 cols on lg) */}
          <div className="lg:col-span-2">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-white/40 mb-5">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="/#about" className="text-sm text-white/65 hover:text-accent transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/#gallery" className="text-sm text-white/65 hover:text-accent transition-colors">
                  Student Life
                </a>
              </li>
              <li>
                <a href="/blog" className="text-sm text-white/65 hover:text-accent transition-colors">
                  Articles & Insights
                </a>
              </li>
              <li>
                <a href="/#contact" className="text-sm text-white/65 hover:text-accent transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/#contact" className="text-sm text-white/65 hover:text-accent transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Education / Teknon Solutions (2 cols on lg) */}
          <div className="lg:col-span-2">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-white/40 mb-5">Education</h3>
            <ul className="space-y-3">
              <li>
                <a href="/#programs" className="text-sm text-white/65 hover:text-accent transition-colors">
                  Training Programs
                </a>
              </li>
              <li>
                <a href="/#courses" className="text-sm text-white/65 hover:text-accent transition-colors">
                  Tech Courses
                </a>
              </li>
              <li>
                <a href="/#pricing" className="text-sm text-white/65 hover:text-accent transition-colors">
                  Internship Batches
                </a>
              </li>
              <li>
                <a href="/student/login" className="text-sm text-white/65 hover:text-accent transition-colors inline-flex items-center gap-1">
                  Student Portal <ChevronRight size={12} className="text-accent" />
                </a>
              </li>
              <li>
                <a href="/verify-certificate" className="text-sm text-white/65 hover:text-accent transition-colors">
                  Verify Certificate
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Digital Solutions (2 cols on lg) */}
          <div className="lg:col-span-2">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-white/40 mb-5">Digital Growth</h3>
            <ul className="space-y-3">
              <li>
                <a href="/digital-marketing" className="text-sm text-white/65 hover:text-accent transition-colors">
                  Digital Marketing
                </a>
              </li>
              <li>
                <a href="/digital-marketing#dm-social" className="text-sm text-white/65 hover:text-accent transition-colors">
                  Social Media Strategy
                </a>
              </li>
              <li>
                <a href="/digital-marketing#dm-webdev" className="text-sm text-white/65 hover:text-accent transition-colors">
                  Web Development
                </a>
              </li>
              <li>
                <a href="/digital-marketing#dm-seo" className="text-sm text-white/65 hover:text-accent transition-colors">
                  Google 3-Pack SEO
                </a>
              </li>
              <li>
                <a href="/it-solutions" className="text-sm text-white/65 hover:text-accent transition-colors">
                  IT Solutions
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Connect & Stay Updated (2 cols on lg) */}
          <div className="lg:col-span-2">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-white/40 mb-5">Connect</h3>
            <ul className="space-y-3 text-sm text-white/65 mb-6">
              <li className="flex items-start gap-2">
                <Phone size={14} className="text-accent shrink-0 mt-1" />
                <a href={`tel:${CONTACT.phoneRaw}`} className="hover:text-accent transition-colors">
                  {CONTACT.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={14} className="text-accent shrink-0 mt-1" />
                <a href={`mailto:${CONTACT.email}`} className="hover:text-accent transition-colors break-all">
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-accent shrink-0 mt-1" />
                <span>{CONTACT.location}</span>
              </li>
            </ul>

            <div>
              <p className="text-xs text-white/50 mb-2">Get updates & batch dates:</p>
              {subscribed ? (
                <p className="text-xs text-accent font-medium">Subscribed successfully!</p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-center gap-1.5">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    aria-label="Email address"
                    className="min-w-0 flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/15 text-white text-xs placeholder:text-white/30 focus:border-accent/50"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="shrink-0 w-8 h-8 grid place-items-center rounded-lg bg-grad-primary text-white hover:brightness-110 transition-all"
                  >
                    <Send size={13} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40 font-mono">
          <p>© 2026 ATS Group of Companies. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-white/30 hidden sm:inline">Teknon Solutions · ATS Digital Solutions</span>
            <a href="/#about" className="hover:text-accent transition-colors">
              Privacy & Terms
            </a>
            <a href="/verify-certificate" className="hover:text-accent transition-colors">
              Verify Certificate
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}


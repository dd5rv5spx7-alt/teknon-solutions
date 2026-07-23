import React, { useState } from 'react';
import { Phone, MapPin, Mail, Send } from 'lucide-react';
import { Instagram, Linkedin, Github, Facebook, Youtube } from './icons/BrandIcons.jsx';
import Logo from './Logo.jsx';
import { FOOTER_LINKS, SOCIAL_LINKS, CONTACT } from '../data/siteData.js';

const ICON_MAP = { Instagram, Linkedin, Github, Facebook, Youtube };

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    // Route newsletter subscriptions via WhatsApp with the email pre-filled
    // Replace with a real email service (Mailchimp, ConvertKit, etc.) when ready
    const msg = `Hi A Teknon Solutions, I'd like to subscribe to updates. My email: ${email}`;
    const waUrl = `https://wa.me/${CONTACT.phoneRaw}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-navy-deep text-white pt-20 pb-10">
      <div className="container-px mx-auto max-w-8xl">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <Logo variant="light" />
            <p className="mt-5 text-white/55 text-sm leading-relaxed max-w-[220px]">
              Learn. Build. Grow. Industry-ready IT training and internships in Rajahmundry.
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
                    className="w-9 h-9 grid place-items-center rounded-full border border-white/15 text-white/70 hover:border-accent hover:text-accent transition-colors"
                  >
                    <Icon size={15} />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-white/40 mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-white/65 hover:text-accent transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-white/40 mb-5">Contact</h3>
            <ul className="space-y-3.5 text-sm text-white/65">
              <li className="flex items-center gap-2.5">
                <Phone size={14} className="text-accent shrink-0" /> {CONTACT.phone}
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={14} className="text-accent shrink-0" /> {CONTACT.email}
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin size={14} className="text-accent shrink-0" /> {CONTACT.location}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-white/40 mb-5">Stay Updated</h3>
            <p className="text-sm text-white/55 mb-4">Get new batch dates and career tips in your inbox.</p>
            {subscribed ? (
              <p className="text-sm text-accent font-medium">You&rsquo;re subscribed — welcome aboard!</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  aria-label="Email address"
                  className="min-w-0 flex-1 px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/15 text-white text-sm placeholder:text-white/30 focus:border-accent/50"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="shrink-0 w-10 h-10 grid place-items-center rounded-lg bg-grad-primary text-white hover:brightness-110 transition-all"
                >
                  <Send size={15} />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40 font-mono">
            © 2026 A Teknon Solutions. All Rights Reserved.
          </p>
          <div className="flex items-center gap-5">
            <a href="/verify-certificate" className="text-xs text-white/40 font-mono hover:text-accent transition-colors">
              Verify Certificate
            </a>
            <p className="text-xs text-white/40 font-mono">Learn. Build. Grow.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

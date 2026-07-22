import React, { useState } from 'react';
import { Phone, MapPin, MessageCircle, Send, Clock, CheckCircle2 } from 'lucide-react';
import SectionHeading from './SectionHeading.jsx';
import { CONTACT, PROGRAMS } from '../data/siteData.js';

// FORM SUBMISSION STRATEGY
// Submits to /api/enquiry (stores in Supabase + emails via Resend, once you've
// added those credentials — see .env.example). If that call fails for any
// reason — not yet configured, network hiccup, whatever — it automatically
// falls back to opening WhatsApp with the same details pre-filled, so an
// enquiry is never silently lost either way.

const initialForm = { name: '', email: '', phone: '', college: '', year: '', program: '', message: '', _gotcha: '' };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [channel, setChannel] = useState(null); // 'api' | 'whatsapp' | 'duplicate'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const buildWhatsAppMessage = (f) => {
    const lines = [
      `*New Inquiry — A Teknon Solutions*`,
      ``,
      `*Name:* ${f.name}`,
      `*Phone:* ${f.phone}`,
      `*Email:* ${f.email}`,
      f.college ? `*College:* ${f.college}` : null,
      f.year ? `*Year:* ${f.year}` : null,
      f.program ? `*Program:* ${f.program}` : null,
      f.message ? `*Message:* ${f.message}` : null,
    ].filter(Boolean);
    return lines.join('\n');
  };

  const fallbackToWhatsApp = () => {
    const msg = buildWhatsAppMessage(form);
    const waUrl = `https://wa.me/${CONTACT.phoneRaw}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setChannel('whatsapp');
    setStatus('success');
    setForm(initialForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form._gotcha) return; // honeypot tripped — silently do nothing
    setStatus('submitting');

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: window.location.pathname || '/' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setChannel(data.duplicate ? 'duplicate' : 'api');
      setStatus('success');
      setForm(initialForm);
    } catch (err) {
      fallbackToWhatsApp();
    }
  };

  const whatsappHref = `https://wa.me/${CONTACT.phoneRaw}?text=${encodeURIComponent(CONTACT.whatsappMessage)}`;
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(CONTACT.location)}&t=&z=12&ie=UTF8&iwloc=&output=embed`;

  return (
    <section id="contact" className="py-28 sm:py-32 bg-mist dark:bg-navy-deep">
      <div className="container-px mx-auto max-w-8xl">
        <SectionHeading
          index="12"
          label="Get in touch"
          title="Let's Start Your Tech Journey"
          subtitle="Reach out on WhatsApp, call us directly, or send an inquiry below — we usually reply within a day."
        />

        <div className="mt-14 grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-5">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl bg-[#25D366] text-white p-5 hover:brightness-105 transition-all shadow-soft"
            >
              <span className="w-11 h-11 shrink-0 grid place-items-center rounded-xl bg-white/20">
                <MessageCircle size={20} />
              </span>
              <span>
                <span className="block font-semibold">Chat on WhatsApp</span>
                <span className="block text-sm text-white/85">{CONTACT.phone}</span>
              </span>
            </a>

            <a
              href={`tel:${CONTACT.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-4 rounded-2xl bg-white dark:bg-white/[0.04] border border-navy/8 dark:border-white/10 p-5 hover:border-royal/30 transition-all"
            >
              <span className="w-11 h-11 shrink-0 grid place-items-center rounded-xl bg-royal/10 dark:bg-accent/15 text-royal dark:text-accent">
                <Phone size={20} />
              </span>
              <span>
                <span className="block font-semibold text-navy dark:text-white">Call Us</span>
                <span className="block text-sm text-slatesoft dark:text-white/55">{CONTACT.phone}</span>
              </span>
            </a>

            <div className="flex items-center gap-4 rounded-2xl bg-white dark:bg-white/[0.04] border border-navy/8 dark:border-white/10 p-5">
              <span className="w-11 h-11 shrink-0 grid place-items-center rounded-xl bg-royal/10 dark:bg-accent/15 text-royal dark:text-accent">
                <MapPin size={20} />
              </span>
              <span>
                <span className="block font-semibold text-navy dark:text-white">Location</span>
                <span className="block text-sm text-slatesoft dark:text-white/55">{CONTACT.location}</span>
              </span>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-white dark:bg-white/[0.04] border border-navy/8 dark:border-white/10 p-5">
              <span className="w-11 h-11 shrink-0 grid place-items-center rounded-xl bg-royal/10 dark:bg-accent/15 text-royal dark:text-accent">
                <Clock size={20} />
              </span>
              <span>
                <span className="block font-semibold text-navy dark:text-white">Classes</span>
                <span className="block text-sm text-slatesoft dark:text-white/55">{CONTACT.classes}</span>
              </span>
            </div>

            <div className="rounded-2xl overflow-hidden border border-navy/8 dark:border-white/10 h-56">
              <iframe
                title="A Teknon Solutions location"
                src={mapSrc}
                className="w-full h-full grayscale-[30%]"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="lg:col-span-3 rounded-3xl bg-white dark:bg-white/[0.04] border border-navy/8 dark:border-white/10 p-7 sm:p-9">
            {status === 'success' ? (
              <div role="status" className="h-full min-h-[380px] flex flex-col items-center justify-center text-center gap-4">
                <span className="w-14 h-14 grid place-items-center rounded-full bg-royal/10 dark:bg-accent/15 text-royal dark:text-accent">
                  <CheckCircle2 size={26} />
                </span>
                <h3 className="font-display font-bold text-xl text-navy dark:text-white">
                  {channel === 'whatsapp' ? 'WhatsApp opened with your inquiry!' : "You're all set!"}
                </h3>
                <p className="text-slatesoft dark:text-white/60 max-w-sm">
                  {channel === 'whatsapp'
                    ? 'Your details were pre-filled in WhatsApp. Just tap Send and we\u2019ll respond within a few hours.'
                    : channel === 'duplicate'
                    ? "Looks like we already have your enquiry from a couple of minutes ago \u2014 no need to send it twice. We'll be in touch soon."
                    : "We've received your enquiry and sent you a confirmation email. Our team will reach out within 24 hours."}
                </p>
                {channel !== 'whatsapp' && (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#25D366]"
                  >
                    <MessageCircle size={15} /> Want it faster? Message us on WhatsApp
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="mt-2 text-royal dark:text-accent font-semibold text-sm"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-5">
                <div className="sm:col-span-1">
                  <label htmlFor="name" className="block text-sm font-medium text-navy dark:text-white mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl border border-navy/10 dark:border-white/15 bg-mist dark:bg-white/5 text-navy dark:text-white placeholder:text-slatesoft dark:placeholder:text-white/55 text-sm focus:outline-hidden focus:border-royal/50 transition-colors"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label htmlFor="phone" className="block text-sm font-medium text-navy dark:text-white mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 00000 00000"
                    className="w-full px-4 py-3 rounded-xl border border-navy/10 dark:border-white/15 bg-mist dark:bg-white/5 text-navy dark:text-white placeholder:text-slatesoft dark:placeholder:text-white/55 text-sm focus:outline-hidden focus:border-royal/50 transition-colors"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-navy dark:text-white mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-navy/10 dark:border-white/15 bg-mist dark:bg-white/5 text-navy dark:text-white placeholder:text-slatesoft dark:placeholder:text-white/55 text-sm focus:outline-hidden focus:border-royal/50 transition-colors"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label htmlFor="college" className="block text-sm font-medium text-navy dark:text-white mb-2">
                    College <span className="text-slatesoft dark:text-white/55 font-normal">(optional)</span>
                  </label>
                  <input
                    id="college"
                    name="college"
                    type="text"
                    autoComplete="organization"
                    value={form.college}
                    onChange={handleChange}
                    placeholder="Your college or company"
                    className="w-full px-4 py-3 rounded-xl border border-navy/10 dark:border-white/15 bg-mist dark:bg-white/5 text-navy dark:text-white placeholder:text-slatesoft dark:placeholder:text-white/55 text-sm focus:outline-hidden focus:border-royal/50 transition-colors"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label htmlFor="year" className="block text-sm font-medium text-navy dark:text-white mb-2">
                    Year <span className="text-slatesoft dark:text-white/55 font-normal">(optional)</span>
                  </label>
                  <select
                    id="year"
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-navy/10 dark:border-white/15 bg-mist dark:bg-white/5 text-navy dark:text-white text-sm focus:outline-hidden focus:border-royal/50 transition-colors"
                  >
                    <option value="">Select</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="Final Year">Final Year</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Working Professional">Working Professional</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="program" className="block text-sm font-medium text-navy dark:text-white mb-2">
                    Program Interest
                  </label>
                  <select
                    id="program"
                    name="program"
                    value={form.program}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-navy/10 dark:border-white/15 bg-mist dark:bg-white/5 text-navy dark:text-white text-sm focus:outline-hidden focus:border-royal/50 transition-colors"
                  >
                    <option value="">Select a program</option>
                    {PROGRAMS.map((p) => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="block text-sm font-medium text-navy dark:text-white mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us what you're hoping to learn..."
                    className="w-full px-4 py-3 rounded-xl border border-navy/10 dark:border-white/15 bg-mist dark:bg-white/5 text-navy dark:text-white placeholder:text-slatesoft dark:placeholder:text-white/55 text-sm focus:outline-hidden focus:border-royal/50 transition-colors resize-none"
                  />
                </div>

                <div className="sm:col-span-2" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
                  <label htmlFor="_gotcha">Leave this field empty</label>
                  <input
                    id="_gotcha"
                    name="_gotcha"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form._gotcha}
                    onChange={handleChange}
                  />
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="btn-glow w-full inline-flex items-center justify-center gap-2 bg-grad-primary text-white font-semibold px-6 py-3.5 rounded-xl hover:brightness-110 transition-all disabled:opacity-60"
                  >
                    {status === 'submitting' ? 'Sending...' : 'Send Inquiry'}
                    <Send size={16} />
                  </button>
                  {status === 'error' && (
                    <p className="mt-3 text-sm text-center text-red-600 dark:text-red-300">
                      Something went wrong — please try WhatsApp or call us directly instead.
                    </p>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

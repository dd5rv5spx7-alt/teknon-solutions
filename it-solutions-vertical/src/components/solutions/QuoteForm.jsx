import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import SectionHeading from '../SectionHeading.jsx';
import { SOLUTIONS_SERVICES, SOLUTIONS_TIMELINE_OPTIONS } from '../../data/solutionsData.js';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  company: '',
  service_interested: '',
  preferred_timeline: '',
  message: '',
  _gotcha: '',
};

export default function QuoteForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form._gotcha) return; // honeypot tripped — silently do nothing
    setStatus('submitting');

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
          service_interested: form.service_interested,
          preferred_timeline: form.preferred_timeline,
          message: form.message,
          program: null,
          college: null,
          year: null,
          source: '/it-solutions',
          lead_type: 'business',
          _gotcha: form._gotcha,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setStatus('success');
      setForm(initialForm);
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <section id="quote" className="py-28 sm:py-32 bg-mist dark:bg-navy-deep">
      <div className="container-px mx-auto max-w-8xl">
        <SectionHeading
          index="07"
          label="Get a quote"
          align="center"
          title="Tell Us What You're Building"
          subtitle="Share a few details and we'll follow up with a scoped proposal — no public pricing, every engagement is quoted individually."
        />

        <div className="mt-14 max-w-3xl mx-auto rounded-3xl bg-white dark:bg-white/[0.04] border border-navy/8 dark:border-white/10 p-7 sm:p-9">
          {status === 'success' ? (
            <div role="status" className="min-h-[380px] flex flex-col items-center justify-center text-center gap-4">
              <span className="w-14 h-14 grid place-items-center rounded-full bg-royal/10 dark:bg-accent/15 text-royal dark:text-accent">
                <CheckCircle2 size={26} />
              </span>
              <h3 className="font-display font-bold text-xl text-navy dark:text-white">You're all set!</h3>
              <p className="text-slatesoft dark:text-white/60 max-w-sm">
                Your enquiry has been sent successfully. Our team will contact you shortly.
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="mt-2 text-royal dark:text-accent font-semibold text-sm"
              >
                Send another enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-5">
              <div className="sm:col-span-1">
                <label htmlFor="quote-name" className="block text-sm font-medium text-navy dark:text-white mb-2">
                  Full Name
                </label>
                <input
                  id="quote-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl border border-navy/10 dark:border-white/15 bg-mist dark:bg-white/5 text-navy dark:text-white placeholder:text-slatesoft dark:placeholder:text-white/55 text-sm focus:border-royal/50 transition-colors"
                />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="quote-phone" className="block text-sm font-medium text-navy dark:text-white mb-2">
                  Phone Number
                </label>
                <input
                  id="quote-phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 00000 00000"
                  className="w-full px-4 py-3 rounded-xl border border-navy/10 dark:border-white/15 bg-mist dark:bg-white/5 text-navy dark:text-white placeholder:text-slatesoft dark:placeholder:text-white/55 text-sm focus:border-royal/50 transition-colors"
                />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="quote-email" className="block text-sm font-medium text-navy dark:text-white mb-2">
                  Work Email
                </label>
                <input
                  id="quote-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  className="w-full px-4 py-3 rounded-xl border border-navy/10 dark:border-white/15 bg-mist dark:bg-white/5 text-navy dark:text-white placeholder:text-slatesoft dark:placeholder:text-white/55 text-sm focus:border-royal/50 transition-colors"
                />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="quote-company" className="block text-sm font-medium text-navy dark:text-white mb-2">
                  Company Name
                </label>
                <input
                  id="quote-company"
                  name="company"
                  type="text"
                  required
                  autoComplete="organization"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Your company"
                  className="w-full px-4 py-3 rounded-xl border border-navy/10 dark:border-white/15 bg-mist dark:bg-white/5 text-navy dark:text-white placeholder:text-slatesoft dark:placeholder:text-white/55 text-sm focus:border-royal/50 transition-colors"
                />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="quote-service" className="block text-sm font-medium text-navy dark:text-white mb-2">
                  Which service are you interested in?
                </label>
                <select
                  id="quote-service"
                  name="service_interested"
                  required
                  value={form.service_interested}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-navy/10 dark:border-white/15 bg-mist dark:bg-white/5 text-navy dark:text-white text-sm focus:border-royal/50 transition-colors"
                >
                  <option value="">Select a service</option>
                  {SOLUTIONS_SERVICES.map((s) => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                  <option value="Not sure yet">Not sure yet</option>
                </select>
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="quote-timeline" className="block text-sm font-medium text-navy dark:text-white mb-2">
                  Preferred Timeline <span className="text-slatesoft dark:text-white/55 font-normal">(optional)</span>
                </label>
                <select
                  id="quote-timeline"
                  name="preferred_timeline"
                  value={form.preferred_timeline}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-navy/10 dark:border-white/15 bg-mist dark:bg-white/5 text-navy dark:text-white text-sm focus:border-royal/50 transition-colors"
                >
                  <option value="">Select</option>
                  {SOLUTIONS_TIMELINE_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="quote-message" className="block text-sm font-medium text-navy dark:text-white mb-2">
                  Project Details <span className="text-slatesoft dark:text-white/55 font-normal">(optional)</span>
                </label>
                <textarea
                  id="quote-message"
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us about your project, timeline, or requirements..."
                  className="w-full px-4 py-3 rounded-xl border border-navy/10 dark:border-white/15 bg-mist dark:bg-white/5 text-navy dark:text-white placeholder:text-slatesoft dark:placeholder:text-white/55 text-sm focus:border-royal/50 transition-colors resize-none"
                />
              </div>

              <div className="sm:col-span-2" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
                <label htmlFor="quote-gotcha">Leave this field empty</label>
                <input
                  id="quote-gotcha"
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
                  {status === 'submitting' ? 'Sending...' : 'Request a Quote'}
                  <Send size={16} />
                </button>
                {status === 'error' && (
                  <p className="mt-3 text-sm text-center text-red-600 dark:text-red-300">
                    Something went wrong — please try again in a moment, or reach us on WhatsApp.
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import SectionHeading from '../SectionHeading';
import useInView from '../../hooks/useInView';
import { DM_SERVICE_OPTIONS, DM_TIMELINE_OPTIONS } from '../../data/digitalMarketingData';
import { CONTACT } from '../../data/siteData';

export default function DMEnquiryForm() {
  const [ref, isInView] = useInView();
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [errorMsg, setErrorMsg] = useState('');
  const [isWhatsAppFallback, setIsWhatsAppFallback] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service_interested: '',
    preferred_timeline: '',
    message: '',
    _gotcha: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleWhatsAppFallback = () => {
    const text = `Hi, I'm interested in digital marketing services.\n\nName: ${form.name}\nBusiness: ${form.company}\nPhone: ${form.phone}\nEmail: ${form.email}\nService: ${form.service_interested || 'Not specified'}\nTimeline: ${form.preferred_timeline || 'Not specified'}\nMessage: ${form.message || 'None'}`;
    const url = `https://wa.me/${CONTACT.phoneRaw}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setIsWhatsAppFallback(true);
    setStatus('success');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form._gotcha) return; // Honeypot trap

    setStatus('submitting');
    setErrorMsg('');
    setIsWhatsAppFallback(false);

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
          source: '/digital-marketing',
          lead_type: 'business',
          _gotcha: form._gotcha,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit form');
      }

      setStatus('success');
    } catch (err) {
      console.error('Form submission error:', err);
      handleWhatsAppFallback();
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      phone: '',
      company: '',
      service_interested: '',
      preferred_timeline: '',
      message: '',
      _gotcha: ''
    });
    setStatus('idle');
    setIsWhatsAppFallback(false);
  };

  return (
    <section id="dm-enquiry" className="py-28 sm:py-32 bg-mist dark:bg-navy-deep">
      <div className="container-px mx-auto max-w-8xl">
        <SectionHeading
          index="11"
          label="Get in touch"
          title="Tell Us About Your Business"
          subtitle="Share a few details and our team will follow up with a tailored proposal."
          align="center"
        />

        <div ref={ref} className={`reveal mt-16 max-w-3xl mx-auto rounded-3xl bg-white dark:bg-white/[0.04] border border-navy/8 dark:border-white/10 p-7 sm:p-9 ${isInView ? 'in-view' : ''}`}>
          {status === 'success' ? (
            <div className="text-center py-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-display font-bold text-navy dark:text-white mb-4">
                {isWhatsAppFallback ? 'WhatsApp opened with your enquiry!' : "You're all set!"}
              </h3>
              <p className="text-slate-600 dark:text-white/70 mb-8 max-w-md mx-auto">
                {isWhatsAppFallback 
                  ? "We couldn't reach our server, so we've opened WhatsApp with your details ready to send."
                  : "Thank you for reaching out. Our team will review your details and get back to you shortly."}
              </p>
              <button
                onClick={resetForm}
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold bg-navy text-white hover:bg-navy-light dark:bg-white dark:text-navy transition-colors"
              >
                Send another enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Honeypot */}
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="dm-gotcha">Don't fill this out if you're human:</label>
                <input
                  type="text"
                  id="dm-gotcha"
                  name="_gotcha"
                  tabIndex="-1"
                  value={form._gotcha}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="dm-name" className="block text-sm font-medium text-navy dark:text-white">Full Name *</label>
                <input
                  type="text"
                  id="dm-name"
                  name="name"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-navy/10 dark:border-white/10 bg-mist dark:bg-navy p-3 text-navy dark:text-white focus:border-royal/50 focus:outline-none focus:ring-1 focus:ring-royal/50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="dm-company" className="block text-sm font-medium text-navy dark:text-white">Business Name *</label>
                <input
                  type="text"
                  id="dm-company"
                  name="company"
                  required
                  autoComplete="organization"
                  value={form.company}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-navy/10 dark:border-white/10 bg-mist dark:bg-navy p-3 text-navy dark:text-white focus:border-royal/50 focus:outline-none focus:ring-1 focus:ring-royal/50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="dm-email" className="block text-sm font-medium text-navy dark:text-white">Email Address *</label>
                <input
                  type="email"
                  id="dm-email"
                  name="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-navy/10 dark:border-white/10 bg-mist dark:bg-navy p-3 text-navy dark:text-white focus:border-royal/50 focus:outline-none focus:ring-1 focus:ring-royal/50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="dm-phone" className="block text-sm font-medium text-navy dark:text-white">Phone Number *</label>
                <input
                  type="tel"
                  id="dm-phone"
                  name="phone"
                  required
                  autoComplete="tel"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-navy/10 dark:border-white/10 bg-mist dark:bg-navy p-3 text-navy dark:text-white focus:border-royal/50 focus:outline-none focus:ring-1 focus:ring-royal/50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="dm-service" className="block text-sm font-medium text-navy dark:text-white">Service Interested In *</label>
                <select
                  id="dm-service"
                  name="service_interested"
                  required
                  value={form.service_interested}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-navy/10 dark:border-white/10 bg-mist dark:bg-navy p-3 text-navy dark:text-white focus:border-royal/50 focus:outline-none focus:ring-1 focus:ring-royal/50 transition-colors"
                >
                  <option value="" disabled>Select a service</option>
                  {DM_SERVICE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="dm-timeline" className="block text-sm font-medium text-navy dark:text-white">Preferred Timeline</label>
                <select
                  id="dm-timeline"
                  name="preferred_timeline"
                  value={form.preferred_timeline}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-navy/10 dark:border-white/10 bg-mist dark:bg-navy p-3 text-navy dark:text-white focus:border-royal/50 focus:outline-none focus:ring-1 focus:ring-royal/50 transition-colors"
                >
                  <option value="">Select a timeline (optional)</option>
                  {DM_TIMELINE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="dm-message" className="block text-sm font-medium text-navy dark:text-white">Message (Optional)</label>
                <textarea
                  id="dm-message"
                  name="message"
                  rows="4"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us about your goals or specific requirements..."
                  className="w-full rounded-xl border border-navy/10 dark:border-white/10 bg-mist dark:bg-navy p-3 text-navy dark:text-white focus:border-royal/50 focus:outline-none focus:ring-1 focus:ring-royal/50 transition-colors resize-y"
                ></textarea>
              </div>

              <div className="md:col-span-2 mt-4">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-white btn-glow bg-grad-primary hover:scale-[1.01] transition-all disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Request a Free Consultation
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

import React, { Suspense, lazy, useState } from 'react';
import { Check, X, ArrowRight } from 'lucide-react';
import SectionHeading from './SectionHeading.jsx';
import useInView from '../hooks/useInView.js';
import { PRICING } from '../data/siteData.js';

// Razorpay's own checkout.js script plus the modal aren't needed until
// someone actually clicks "Pay Now" — lazy-loading keeps them out of the
// bundle every homepage visitor downloads.
const CheckoutModal = lazy(() => import('./CheckoutModal.jsx'));

// Maps a PRICING entry's display name to the tier key api/_lib/pricing.js
// resolves the real, authoritative amount from. 'Enterprise' has no key —
// it's Custom pricing, so it stays a Contact CTA rather than a payment button.
const TIER_KEYS = {
  Starter: 'starter',
  Professional: 'professional',
  Advanced: 'advanced',
};

export default function Pricing() {
  const [ref, isInView] = useInView();
  const [checkoutTier, setCheckoutTier] = useState(null); // null | PRICING entry

  return (
    <section id="pricing" className="py-28 sm:py-32 bg-mist dark:bg-navy-deep">
      <div className="container-px mx-auto max-w-8xl">
        <SectionHeading
          index="10"
          label="Pricing"
          badge="Courses starting from ₹1,999"
          align="center"
          title="Simple, Transparent Pricing"
          subtitle="Career-focused training that fits your budget — every program includes a certificate. Pay securely online, or reach out first if you have questions."
        />

        <div ref={ref} className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRICING.map((tier, i) => {
            const Icon = tier.icon;
            const tierKey = TIER_KEYS[tier.name];
            return (
              <div
                key={tier.name}
                className={`reveal ${isInView ? 'in-view' : ''} reveal-delay-${(i % 6) + 1} relative rounded-2xl border p-6 flex flex-col ${
                  tier.highlighted
                    ? 'border-royal dark:border-accent bg-white dark:bg-white/[0.06] shadow-card-lg scale-[1.02]'
                    : 'border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.04]'
                }`}
              >
                {tier.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-grad-primary text-white text-[11px] font-mono uppercase tracking-wide">
                    Most popular
                  </span>
                )}
                <span className="w-11 h-11 grid place-items-center rounded-xl bg-royal/10 dark:bg-accent/15 text-royal dark:text-accent mb-4">
                  <Icon size={19} strokeWidth={2.1} />
                </span>
                <h3 className="font-display font-bold text-lg text-navy dark:text-white">{tier.name}</h3>
                <p className="mt-1 text-2xl font-display font-extrabold text-navy dark:text-white">{tier.price}</p>
                <p className="text-xs text-slatesoft dark:text-white/50 mb-5">{tier.period}</p>

                <ul className="space-y-2.5 flex-1 mb-6">
                  {tier.features.map((f) => (
                    <li key={f.label} className="flex items-start gap-2 text-sm">
                      {f.included ? (
                        <Check size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <X size={15} className="text-slatesoft/40 dark:text-white/25 shrink-0 mt-0.5" />
                      )}
                      <span className={f.included ? 'text-navy dark:text-white/80' : 'text-slatesoft/60 dark:text-white/30'}>
                        {f.label}
                      </span>
                    </li>
                  ))}
                </ul>

                {tierKey ? (
                  <button
                    onClick={() => setCheckoutTier(tier)}
                    className={`btn-glow inline-flex items-center justify-center gap-2 font-semibold px-5 py-3 rounded-xl transition-all ${
                      tier.highlighted
                        ? 'bg-grad-primary text-white hover:brightness-110'
                        : 'border border-navy/10 dark:border-white/15 text-navy dark:text-white hover:border-royal/40'
                    }`}
                  >
                    Pay {tier.price} Now
                  </button>
                ) : (
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center gap-2 border border-navy/10 dark:border-white/15 text-navy dark:text-white font-semibold px-5 py-3 rounded-xl hover:border-royal/40 transition-all"
                  >
                    Contact us <ArrowRight size={15} />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {checkoutTier && (
        <Suspense fallback={null}>
          <CheckoutModal
            tier={TIER_KEYS[checkoutTier.name]}
            tierLabel={`${checkoutTier.name} (${checkoutTier.period})`}
            priceDisplay={checkoutTier.price}
            onClose={() => setCheckoutTier(null)}
          />
        </Suspense>
      )}
    </section>
  );
}

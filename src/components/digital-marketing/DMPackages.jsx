import React from 'react';
import { Check } from 'lucide-react';
import SectionHeading from '../SectionHeading';
import useInView from '../../hooks/useInView';
import { DM_PACKAGES } from '../../data/digitalMarketingData';

const DMPackages = () => {
  const [ref, isInView] = useInView();

  return (
    <section id="dm-packages" className="py-28 sm:py-32 bg-white dark:bg-navy">
      <div className="container-px mx-auto max-w-8xl">
        <SectionHeading
          index="06"
          label="Packages"
          title="Our Digital Growth Packages"
          subtitle="Three clear tiers engineered for every stage of commercial expansion. Pick the plan matching your current objectives, then scale seamlessly as your business expands."
          align="center"
        />

        <div
          ref={ref}
          className={`mt-16 sm:mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 reveal ${
            isInView ? 'in-view' : ''
          }`}
        >
          {DM_PACKAGES?.map((pkg, idx) => {
            const isGold = pkg.name === 'Gold';
            return (
              <div
                key={idx}
                className={`relative flex flex-col rounded-2xl p-6 sm:p-8 ${
                  isGold
                    ? 'border-royal/20 dark:border-accent/20 bg-white dark:bg-white/[0.04] shadow-card-lg ring-2 ring-royal/30 dark:ring-accent/30 scale-100 md:scale-105 z-10'
                    : 'border border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.04] shadow-card'
                }`}
              >
                {isGold && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-grad-primary text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight text-navy dark:text-white">
                    {pkg.name}
                  </h3>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-royal dark:text-accent">
                    {pkg.tier}
                  </p>
                  <p className="mt-3 text-slatesoft dark:text-white/60">
                    {pkg.tagline}
                  </p>
                </div>

                <div className="flex-grow">
                  <ul className="space-y-4">
                    {pkg.features?.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-royal dark:text-accent shrink-0 mt-0.5" />
                        <span className="text-sm text-navy dark:text-white/70">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-navy/8 dark:border-white/10">
                  <a
                    href="#dm-enquiry"
                    className="block w-full text-center py-3 px-4 rounded-xl font-semibold bg-royal text-white hover:bg-royal/90 transition-colors btn-glow"
                  >
                    Request a Custom Proposal
                  </a>
                  {pkg.footerText && (
                    <p className="mt-4 text-center text-xs text-slatesoft dark:text-white/60 bg-mist dark:bg-white/5 py-1.5 rounded-md">
                      {pkg.footerText}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DMPackages;

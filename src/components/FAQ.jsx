import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import SectionHeading from './SectionHeading.jsx';
import useInView from '../hooks/useInView.js';
import { FAQS } from '../data/siteData.js';

function FAQItem({ item, isOpen, onToggle, isInView, delay, itemId }) {
  const panelId = `faq-panel-${itemId}`;
  const buttonId = `faq-btn-${itemId}`;
  return (
    <div className={`reveal ${isInView ? 'in-view' : ''} ${delay} border-b border-navy/8 dark:border-white/10`}>
      <button
        id={buttonId}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="w-full flex items-center justify-between gap-6 py-6 text-left group"
      >
        <span className="font-display font-semibold text-navy dark:text-white text-base sm:text-lg">
          {item.q}
        </span>
        <span
          aria-hidden="true"
          className={`shrink-0 w-8 h-8 grid place-items-center rounded-full border transition-all duration-300 ${
            isOpen
              ? 'bg-grad-primary border-transparent rotate-45 text-white'
              : 'border-navy/15 dark:border-white/20 text-navy dark:text-white group-hover:border-royal/40'
          }`}
        >
          <Plus size={15} />
        </span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <p className="pb-6 text-slatesoft dark:text-white/60 leading-relaxed max-w-2xl">{item.a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const [ref, isInView] = useInView();

  return (
    <section className="py-28 sm:py-32 bg-white dark:bg-navy">
      <div className="container-px mx-auto max-w-8xl">
        <div className="grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-14">
          <SectionHeading
            index="11"
            label="FAQ"
            title="Questions, Answered"
            subtitle="Can't find what you're looking for? Reach out on WhatsApp and we'll answer directly."
          />

          <div ref={ref}>
            {FAQS.map((item, i) => (
              <FAQItem
                key={item.q}
                item={item}
                itemId={i}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
                isInView={isInView}
                delay={`reveal-delay-${(i % 6) + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

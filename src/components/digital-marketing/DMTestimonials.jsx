import React from 'react';
import SectionHeading from '../SectionHeading';
import useInView from '../../hooks/useInView';

export default function DMTestimonials() {
  const [ref, isInView] = useInView();

  return (
    <section id="dm-testimonials" className="py-28 sm:py-32 bg-white dark:bg-navy">
      <div className="container-px mx-auto max-w-8xl">
        <SectionHeading
          index="10"
          label="Testimonials"
          title="What Our Clients Say"
          subtitle="We're building this section as our digital marketing partnerships grow."
          align="center"
        />

        <div 
          ref={ref} 
          className={`reveal max-w-3xl mx-auto rounded-2xl border border-navy/8 dark:border-white/10 bg-mist dark:bg-white/[0.04] p-8 sm:p-12 text-center mt-12 ${isInView ? 'in-view' : ''}`}
        >
          <p className="text-lg text-slate-600 dark:text-white/70 mb-6 font-sans">
            Digital marketing testimonials coming soon. In the meantime, explore what our training clients say about working with us.
          </p>
          <a href="/#testimonials" className="inline-flex items-center text-royal dark:text-accent font-semibold hover:opacity-80 transition-opacity">
            View Student Testimonials &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}

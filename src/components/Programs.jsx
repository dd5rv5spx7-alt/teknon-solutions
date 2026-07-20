import React from 'react';
import { ArrowRight } from 'lucide-react';
import SectionHeading from './SectionHeading.jsx';
import useInView from '../hooks/useInView.js';

export default function Programs() {
  const [ref, isInView] = useInView();

  return (
    <section id="programs" className="py-28 sm:py-32 bg-white dark:bg-navy">
      <div ref={ref} className={`container-px mx-auto max-w-8xl reveal ${isInView ? 'in-view' : ''}`}>
        <SectionHeading
          index="03"
          label="Programs"
          badge="Courses starting from ₹1,999"
          align="center"
          title="Start Your Learning Today"
          subtitle="Hands-on internship programs designed to take you from fundamentals to a portfolio-ready certificate."
        />

        <div className="mt-10 flex justify-center">
          <a
            href="#contact"
            className="btn-glow group inline-flex items-center gap-2 bg-grad-primary text-white font-semibold px-8 py-4 rounded-xl hover:brightness-110 transition-all"
          >
            Enroll Now
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}

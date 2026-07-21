import React from 'react';
import SectionHeading from './SectionHeading.jsx';
import useInView from '../hooks/useInView.js';
import { GALLERY_CATEGORIES } from '../data/siteData.js';

export default function Gallery() {
  const [ref, isInView] = useInView();

  return (
    <section id="gallery" className="py-28 sm:py-32 bg-white dark:bg-navy">
      <div className="container-px mx-auto max-w-8xl">
        <SectionHeading
          index="09"
          label="Gallery"
          title="Life at A Teknon Solutions"
          subtitle="Classroom sessions, workshops, hackathons and the moments in between."
        />

        <div ref={ref} className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {GALLERY_CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.label}
                className={`reveal ${isInView ? 'in-view' : ''} reveal-delay-${(i % 6) + 1} group relative aspect-[4/3] rounded-2xl overflow-hidden`}
              >
                <img
                  src={cat.image}
                  // These are grid tiles, not full-width hero images — a
                  // phone in a 2-column layout never needs the full 800px
                  // asset. Unsplash's imaging API resizes on the fly from
                  // the same &w= param already in cat.image, so a 480w
                  // variant is just a URL swap, not a second asset to manage.
                  srcSet={`${cat.image.replace('w=800', 'w=480')} 480w, ${cat.image} 800w`}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  alt={cat.alt}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/25 to-transparent"
                  aria-hidden="true"
                />
                <div className="absolute inset-0 flex flex-col items-start justify-end p-5 gap-2.5">
                  <span className="w-10 h-10 grid place-items-center rounded-xl glass text-white">
                    <Icon size={18} />
                  </span>
                  <span className="font-display font-bold text-white text-base">{cat.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

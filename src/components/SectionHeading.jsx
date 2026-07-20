import React from 'react';
import useInView from '../hooks/useInView.js';

export default function SectionHeading({
  index,
  label,
  title,
  subtitle,
  align = 'left',
  light = false,
  badge,
}) {
  const [ref, isInView] = useInView();

  return (
    <div
      ref={ref}
      className={`max-w-2xl reveal ${isInView ? 'in-view' : ''} ${align === 'center' ? 'mx-auto text-center' : ''}`}
    >
      {badge && (
        <span
          className={`w-fit flex items-center gap-1.5 mb-3 px-3 py-1 rounded-full bg-grad-primary text-white text-xs font-bold tracking-wide ${
            align === 'center' ? 'mx-auto' : ''
          }`}
        >
          {badge}
        </span>
      )}
      <span className={`eyebrow ${light ? 'text-accent' : 'text-royal'}`}>
        <span aria-hidden="true">//</span>
        {index ? `${index} — ${label}` : label}
      </span>
      <h2
        className={`mt-4 font-display font-extrabold text-3xl sm:text-4xl md:text-[2.75rem] leading-[1.12] tracking-tight text-balance ${
          light ? 'text-white' : 'text-navy dark:text-white'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-base sm:text-lg leading-relaxed ${
            light ? 'text-white/70' : 'text-slatesoft dark:text-white/60'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

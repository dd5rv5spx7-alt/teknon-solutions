import React from 'react';
import logoUrl from '../assets/logo.svg';

// Logo artwork is a fixed 1402x1122 lockup (monogram + two-line wordmark
// baked into one image) — width is derived to preserve that aspect ratio.
const ASPECT = 1402 / 1122;

export default function Logo({ variant = 'dark', size = 'md', className = '' }) {
  const onDarkBackground = variant === 'light';
  const height = size === 'lg' ? 92 : size === 'sm' ? 52 : 68;
  const width = Math.round(height * ASPECT);

  const img = (
    <img
      src={logoUrl}
      alt="A Teknon Solutions"
      width={width}
      height={height}
      className="block transition-transform duration-300 group-hover:scale-105"
    />
  );

  // variant="light" means the surrounding background is permanently dark
  // (hero, footer, login pages) — always show the white chip. variant="dark"
  // (the default) means the background is light in light theme but flips to
  // dark navy via Tailwind's dark: classes (admin/student headers, scrolled
  // navbar) — so the chip there only needs to activate in dark theme.
  const chipClasses = onDarkBackground
    ? 'bg-white rounded-2xl p-2 shadow-[0_0_28px_2px_rgba(30,94,255,0.4)]'
    : 'dark:bg-white dark:rounded-2xl dark:p-2 dark:shadow-[0_0_28px_2px_rgba(30,94,255,0.4)]';

  return (
    <a href="#home" className={`flex items-center shrink-0 group ${className}`} aria-label="A Teknon Solutions home">
      <span className={chipClasses}>{img}</span>
    </a>
  );
}

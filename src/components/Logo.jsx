import React from 'react';
import { Link } from 'react-router-dom';
import logoUrl from '../assets/logo.svg';
import logoLightUrl from '../assets/logo-light.svg';

// Logo artwork is a fixed 1402x1122 lockup (monogram + two-line wordmark
// baked into one image) — width is derived to preserve that aspect ratio.
const ASPECT = 1402 / 1122;

export default function Logo({ variant = 'dark', size = 'md', className = '', to }) {
  // variant="light" means the logo sits on a dark background (Hero, DM page,
  // footer, non-scrolled navbar, or dark mode). We use the light/white logo.
  // variant="dark" means it sits on a light background (scrolled navbar in light mode).
  const onDarkBackground = variant === 'light';
  const height = size === 'lg' ? 60 : size === 'sm' ? 36 : 46;
  const width = Math.round(height * ASPECT);

  const img = (
    <img
      src={onDarkBackground ? logoLightUrl : logoUrl}
      alt="ATS Group of Companies"
      width={width}
      height={height}
      className="block h-auto max-h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
    />
  );

  const innerContent = (
    <span className="inline-flex items-center">{img}</span>
  );

  if (to) {
    return (
      <Link to={to} className={`flex items-center shrink-0 group ${className}`} aria-label="ATS Group of Companies home">
        {innerContent}
      </Link>
    );
  }

  return (
    <a href="#home" className={`flex items-center shrink-0 group ${className}`} aria-label="ATS Group of Companies home">
      {innerContent}
    </a>
  );
}


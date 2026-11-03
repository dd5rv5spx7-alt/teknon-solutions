import React from 'react';
import logoLightUrl from '../../assets/logo-light.svg';

/**
 * Premium Vector Logos for Organizations & Institutions
 * Designed for crisp display on deep charcoal & dark backgrounds,
 * with subtle hover glowing borders and transitions.
 */

export function AtsLogo({ className = 'w-full h-full' }) {
  return (
    <div className={`relative flex items-center justify-center p-1 ${className}`}>
      <img
        src={logoLightUrl}
        alt="A Teknon Solutions Logo"
        className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(30,94,255,0.4)]"
      />
    </div>
  );
}

export function GfgLogo({ className = 'w-full h-full' }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="GeeksforGeeks Logo"
    >
      <rect width="48" height="48" rx="12" fill="#0B1C10" />
      <rect x="0.5" y="0.5" width="47" height="47" rx="11.5" stroke="#10B981" strokeOpacity="0.3" />
      {/* GeeksforGeeks Iconic Double Curly Bracket Motif */}
      <path
        d="M20.5 14C17.5 14 15.5 16 15.5 19V21.5C15.5 23 14 24 12.5 24C14 24 15.5 25 15.5 26.5V29C15.5 32 17.5 34 20.5 34"
        stroke="#00E599"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27.5 14C30.5 14 32.5 16 32.5 19V21.5C32.5 23 34 24 35.5 24C34 24 32.5 25 32.5 26.5V29C32.5 32 30.5 34 27.5 34"
        stroke="#00E599"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="24" r="2.2" fill="#10B981" />
    </svg>
  );
}

export function NssLogo({ className = 'w-full h-full' }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="National Service Scheme Logo"
    >
      <rect width="48" height="48" rx="12" fill="#0E121E" />
      <rect x="0.5" y="0.5" width="47" height="47" rx="11.5" stroke="#3B82F6" strokeOpacity="0.25" />
      
      {/* Outer Konark Wheel Ring */}
      <circle cx="24" cy="24" r="16.5" stroke="#1D4ED8" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="14.5" stroke="#EF4444" strokeWidth="1.2" strokeDasharray="2.5 2" />

      {/* 8 Spokes of Konark Wheel */}
      <g stroke="#F59E0B" strokeWidth="1.6" strokeLinecap="round">
        <line x1="24" y1="9.5" x2="24" y2="38.5" />
        <line x1="9.5" y1="24" x2="38.5" y2="24" />
        <line x1="13.7" y1="13.7" x2="34.3" y2="34.3" />
        <line x1="34.3" y1="13.7" x2="13.7" y2="34.3" />
      </g>

      {/* Central Wheel Hub with Blue & Crimson Dot */}
      <circle cx="24" cy="24" r="5" fill="#1E3A8A" stroke="#F59E0B" strokeWidth="1.2" />
      <circle cx="24" cy="24" r="2" fill="#EF4444" />
    </svg>
  );
}

export function EClubLogo({ className = 'w-full h-full' }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Entrepreneurship Club Logo"
    >
      <rect width="48" height="48" rx="12" fill="#14111D" />
      <rect x="0.5" y="0.5" width="47" height="47" rx="11.5" stroke="#A855F7" strokeOpacity="0.25" />

      {/* Dynamic Rocket / Beacon Motif */}
      <path
        d="M24 10C24 10 32 15 32 24C32 27.5 30 30 28 32L24 30L20 32C18 30 16 27.5 16 24C16 15 24 10 24 10Z"
        fill="url(#eclub-grad)"
        stroke="#EC4899"
        strokeWidth="1.5"
      />
      <circle cx="24" cy="21" r="3" fill="#FFFFFF" />
      {/* Thrust / Spark trails */}
      <path d="M24 33V38" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M19.5 34.5L16.5 37.5" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
      <path d="M28.5 34.5L31.5 37.5" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />

      <defs>
        <linearGradient id="eclub-grad" x1="24" y1="10" x2="24" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#EC4899" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function SrmLogo({ className = 'w-full h-full' }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="SRM University Andhra Pradesh Logo"
    >
      <rect width="48" height="48" rx="12" fill="#08142C" />
      <rect x="0.5" y="0.5" width="47" height="47" rx="11.5" stroke="#3B82F6" strokeOpacity="0.3" />

      {/* University Heraldic Shield */}
      <path
        d="M13 14C13 14 24 11 24 11C24 11 35 14 35 14V25C35 32 24 37 24 37C24 37 13 32 13 25V14Z"
        fill="url(#srm-shield-grad)"
        stroke="#F59E0B"
        strokeWidth="1.6"
      />

      {/* Knowledge Torch & Book Motif */}
      <path
        d="M20 28C21.5 27 23 27 24 28C25 27 26.5 27 28 28V22C26.5 21 25 21 24 22C23 21 21.5 21 20 22V28Z"
        fill="#FFFFFF"
        opacity="0.95"
      />
      <circle cx="24" cy="18" r="2.2" fill="#F59E0B" />
      <path d="M24 15V17" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />

      <defs>
        <linearGradient id="srm-shield-grad" x1="24" y1="11" x2="24" y2="37" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1E3A8A" />
          <stop offset="1" stopColor="#0F172A" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function SchoolLogo({ className = 'w-full h-full' }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Tirumala School Emblem"
    >
      <rect width="48" height="48" rx="12" fill="#0C1524" />
      <rect x="0.5" y="0.5" width="47" height="47" rx="11.5" stroke="#F59E0B" strokeOpacity="0.3" />

      {/* Academic Crest Badge */}
      <circle cx="24" cy="24" r="14" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 2" />

      {/* Open Book and Lamp of Learning */}
      <path
        d="M16 26C19 24.5 22 25 24 26.5C26 25 29 24.5 32 26V20C29 18.5 26 19 24 20.5C22 19 19 18.5 16 20V26Z"
        fill="#E2E8F0"
        stroke="#0F172A"
        strokeWidth="0.8"
      />
      {/* Radiant Star of Excellence */}
      <path
        d="M24 13L25.2 16.5H29L26 18.5L27.2 22L24 20L20.8 22L22 18.5L19 16.5H22.8L24 13Z"
        fill="#F59E0B"
      />
    </svg>
  );
}

export default function OrganizationLogo({ type, className = 'w-11 h-11' }) {
  switch (type) {
    case 'ats':
      return <AtsLogo className={className} />;
    case 'gfg':
      return <GfgLogo className={className} />;
    case 'nss':
      return <NssLogo className={className} />;
    case 'eclub':
      return <EClubLogo className={className} />;
    case 'srm':
      return <SrmLogo className={className} />;
    case 'school':
      return <SchoolLogo className={className} />;
    default:
      return <AtsLogo className={className} />;
  }
}

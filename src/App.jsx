import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext.jsx';
import MarketingSite from './pages/MarketingSite.jsx';

const VerifyCertificate = lazy(() => import('./pages/VerifyCertificate.jsx'));
const BlogList = lazy(() => import('./pages/BlogList.jsx'));
const BlogPost = lazy(() => import('./pages/BlogPost.jsx'));

// AdminApp/StudentApp/ResetPasswordApp each own AuthProvider internally
// (see src/routes/) — that's what keeps the Supabase client, and the
// getSession() call AuthProvider fires on mount, out of the bundle every
// anonymous marketing-site visitor downloads. Don't import AuthProvider
// here; a static import at this level would defeat the whole point even
// though these route components are lazy.
const AdminApp = lazy(() => import('./routes/AdminApp.jsx'));
const StudentApp = lazy(() => import('./routes/StudentApp.jsx'));
const ResetPasswordApp = lazy(() => import('./routes/ResetPasswordApp.jsx'));

function RouteFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-screen grid place-items-center bg-navy text-white/50 text-sm font-mono"
    >
      Loading…
    </div>
  );
}

// Keyboard/screen-reader users otherwise have to tab through the full nav on
// every single page before reaching content — no page in src/pages ever
// renders more than one <main>, so a generic selector works across routes
// without every page needing to own an id="main-content" anchor itself.
function SkipToContent() {
  const handleSkip = (e) => {
    const main = document.querySelector('main');
    if (!main) return;
    e.preventDefault();
    if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');
    main.focus();
    main.scrollIntoView();
  };

  return (
    <a
      href="#main-content"
      onClick={handleSkip}
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999] focus:rounded-lg focus:bg-navy focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white focus:shadow-card-lg"
    >
      Skip to main content
    </a>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <BrowserRouter>
          <SkipToContent />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<MarketingSite />} />
              <Route path="/verify-certificate" element={<VerifyCertificate />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/reset-password" element={<ResetPasswordApp />} />
              <Route path="/admin/*" element={<AdminApp />} />
              <Route path="/student/*" element={<StudentApp />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  );
}

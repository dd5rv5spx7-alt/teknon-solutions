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
    <div className="min-h-screen grid place-items-center bg-navy text-white/50 text-sm font-mono">
      Loading…
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <BrowserRouter>
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

import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, Sparkles } from 'lucide-react';
import Logo from '../components/Logo.jsx';
import ForgotPassword from '../components/ForgotPassword.jsx';
import PasswordField from '../components/PasswordField.jsx';
import Seo from '../components/Seo.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminLogin() {
  const { signIn, isAuthenticated, role, loading, isSupabaseConfigured } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Gate on `loading` so a staff account that's already signed in doesn't
  // get bounced to /admin before its role has actually resolved — and once
  // it has, a student who lands here goes to their own portal instead of
  // being sent to /admin only to be rejected by ProtectedRoute.
  if (loading) {
    return (
      <div role="status" className="min-h-screen grid place-items-center bg-grad-navy text-white/50 text-sm font-mono">
        Checking session…
      </div>
    );
  }
  if (isAuthenticated && (role === 'admin' || role === 'faculty')) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError('');
    setSubmitting(true);
    let signedInRole = null;
    let signInError = null;
    try {
      ({ error: signInError, role: signedInRole } = await signIn(email, password));
    } catch {
      signInError = 'Something went wrong. Please try again.';
    }
    setSubmitting(false);
    if (signInError) {
      setError(signInError);
    } else {
      navigate(signedInRole === 'student' ? '/student' : '/admin');
    }
  };

  return (
    <div className="min-h-screen bg-grad-navy flex items-center justify-center px-6 relative overflow-hidden">
      <Seo
        title="Staff sign in — A Teknon Solutions"
        description="Sign in to the A Teknon Solutions admin dashboard for staff and faculty."
        path="/admin/login"
        noindex
      />
      <div className="absolute inset-0 bg-dot-grid opacity-30" aria-hidden="true" />
      <div className="relative w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo variant="light" size="lg" to="/" />
        </div>

        <div className="glass rounded-3xl p-8">
          {/* text-accent (#2F80ED) measures 3.53:1 on this glass card — below
              AA for normal text. #7DB8FF (already used for the same navy-on-
              dark pairing in the email templates) clears 6.6:1. */}
          <span className="eyebrow text-[#7DB8FF]">
            <Lock size={13} /> Staff access
          </span>
          <h1 className="mt-3 font-display font-extrabold text-2xl text-white">Sign in</h1>
          <p className="mt-1.5 text-sm text-white/55">Admin and faculty accounts only.</p>

          {!isSupabaseConfigured && (
            <div className="mt-5 rounded-xl border border-royal/30 bg-royal/10 p-3.5 text-xs text-white/80">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-accent flex items-center gap-1.5">
                  <Sparkles size={13} /> Interactive Admin Preview
                </span>
                <span className="px-2 py-0.5 rounded bg-royal/20 text-accent font-mono text-[10px]">Staff Ready</span>
              </div>
              <p className="text-white/65 leading-relaxed">
                Supabase credentials not configured in local environment. Click below to enter demo admin console with 1 click.
              </p>
              <button
                type="button"
                onClick={async () => {
                  setEmail('admin@ateknonsolutions.com');
                  setPassword('admin1234');
                  setSubmitting(true);
                  const res = await signIn('admin@ateknonsolutions.com', 'admin1234');
                  setSubmitting(false);
                  if (!res.error) {
                    navigate('/admin');
                  }
                }}
                className="mt-2.5 w-full py-2.5 px-3 rounded-lg bg-royal hover:bg-royal/80 text-white font-semibold text-xs border border-royal/40 transition-colors shadow-sm text-center"
              >
                Enter Admin Console (1-Click Demo) &rarr;
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-white/80 mb-1.5">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                autoFocus
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                disabled={submitting}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-white/60 text-sm focus:border-accent/50 disabled:opacity-50"
                placeholder="you@ateknonsolutions.com"
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-white/80 mb-1.5">
                Password
              </label>
              <PasswordField
                id="admin-password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                disabled={submitting}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-glow w-full bg-grad-primary text-white font-semibold px-6 py-3.5 rounded-xl hover:brightness-110 transition-all disabled:opacity-50"
            >
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <ForgotPassword />
          </div>
        </div>

        <a href="/" className="block text-center mt-6 text-sm text-white/55 hover:text-white/80 transition-colors">
          ← Back to the main site
        </a>
      </div>
    </div>
  );
}

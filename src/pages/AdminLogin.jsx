import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Lock, AlertCircle } from 'lucide-react';
import Logo from '../components/Logo.jsx';
import ForgotPassword from '../components/ForgotPassword.jsx';
import PasswordField from '../components/PasswordField.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminLogin() {
  const { signIn, isAuthenticated, loading, isSupabaseConfigured } = useAuth();
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
  if (isAuthenticated) return <Navigate to="/admin" replace />;

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
      <div className="absolute inset-0 bg-dot-grid opacity-30" aria-hidden="true" />
      <div className="relative w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo variant="light" size="lg" />
        </div>

        <div className="glass rounded-3xl p-8">
          <span className="eyebrow text-accent">
            <Lock size={13} /> Staff access
          </span>
          <h1 className="mt-3 font-display font-extrabold text-2xl text-white">Sign in</h1>
          <p className="mt-1.5 text-sm text-white/55">Admin and faculty accounts only.</p>

          {!isSupabaseConfigured && (
            <div className="mt-5 flex gap-2.5 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3.5 text-sm text-amber-200">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>
                Login isn&rsquo;t connected yet — Supabase credentials are missing from this
                deployment&rsquo;s environment variables. See <code>.env.example</code>.
              </span>
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
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isSupabaseConfigured || submitting}
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
                onChange={(e) => setPassword(e.target.value)}
                disabled={!isSupabaseConfigured || submitting}
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
              disabled={submitting || !isSupabaseConfigured}
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

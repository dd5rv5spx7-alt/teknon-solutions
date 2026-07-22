import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, AlertCircle } from 'lucide-react';
import Logo from '../components/Logo.jsx';
import Seo from '../components/Seo.jsx';
import PasswordField from '../components/PasswordField.jsx';
import { useAuth } from '../context/AuthContext.jsx';

// Landing page for the link in a "forgot password" email. Supabase's client
// detects the recovery token in the URL on load and briefly opens a session
// scoped to changing the password — AuthContext's `session`/`loading` state
// already tracks this, so we reuse it rather than re-deriving it here.
export default function ResetPassword() {
  const { updatePassword, signOut, role, session, loading, isSupabaseConfigured } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setError('');
    if (password.length < 8) {
      setError('Use at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setSubmitting(true);
    try {
      const { error: err } = await updatePassword(password);
      if (err) {
        setError(err);
      } else {
        // The whole point of a reset link is regaining access without the
        // old password — leaving this browser signed in afterward would
        // defeat that on a shared/borrowed device the link was opened on.
        await signOut();
        setDone(true);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setSubmitting(false);
  }

  const signInPath = role === 'student' ? '/student/login' : '/admin/login';

  return (
    <div className="min-h-screen bg-grad-navy flex items-center justify-center px-6 relative overflow-hidden">
      <Seo
        title="Reset Password | A Teknon Solutions"
        description="Set a new password for your A Teknon Solutions account."
        path="/reset-password"
        noindex
      />
      <div className="absolute inset-0 bg-dot-grid opacity-30" aria-hidden="true" />
      <div className="relative w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo variant="light" size="lg" />
        </div>

        <div className="glass rounded-3xl p-8">
          <span className="eyebrow text-accent">
            <KeyRound size={13} /> Reset password
          </span>
          <h1 className="mt-3 font-display font-extrabold text-2xl text-white">Set a new password</h1>

          {!isSupabaseConfigured ? (
            <div className="mt-5 flex gap-2.5 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3.5 text-sm text-amber-200">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>Login isn&rsquo;t connected yet on this deployment. See <code>.env.example</code>.</span>
            </div>
          ) : loading ? (
            <p role="status" className="mt-4 text-sm text-white/55">
              Checking your reset link…
            </p>
          ) : done ? (
            <div role="status">
              <p className="mt-4 text-sm text-white/70">
                Your password has been updated. Sign in with it below.
              </p>
              <button
                onClick={() => navigate(signInPath)}
                className="btn-glow w-full mt-5 bg-grad-primary text-white font-semibold px-6 py-3.5 rounded-xl hover:brightness-110 transition-all"
              >
                Go to sign in
              </button>
            </div>
          ) : !session ? (
            <div>
              <p className="mt-4 text-sm text-white/70">
                This reset link is invalid or has expired.
              </p>
              <a
                href="/admin/login"
                className="btn-glow inline-flex w-full mt-5 items-center justify-center bg-grad-primary text-white font-semibold px-6 py-3.5 rounded-xl hover:brightness-110 transition-all"
              >
                Request a new link
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-white/80 mb-1.5">
                  New password
                </label>
                <PasswordField
                  id="new-password"
                  autoComplete="new-password"
                  minLength={8}
                  aria-describedby="new-password-hint"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  disabled={submitting}
                  placeholder="••••••••"
                />
                <p id="new-password-hint" className="mt-1.5 text-xs text-white/45">
                  At least 8 characters.
                </p>
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-white/80 mb-1.5">
                  Confirm password
                </label>
                <PasswordField
                  id="confirm-password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => {
                    setConfirm(e.target.value);
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
                {submitting ? 'Updating…' : 'Update password'}
              </button>
            </form>
          )}
        </div>

        <a href="/" className="block text-center mt-6 text-sm text-white/55 hover:text-white/80 transition-colors">
          ← Back to the main site
        </a>
      </div>
    </div>
  );
}

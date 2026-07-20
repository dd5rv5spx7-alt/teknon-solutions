import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

// Shared by AdminLogin and StudentLogin. Toggles from a plain link into an
// inline email form. Always reports the same generic "sent" outcome
// regardless of whether the email actually matches an account, so this
// can't be used to enumerate who has an account.
export default function ForgotPassword() {
  const { resetPassword, isSupabaseConfigured } = useAuth();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent
  const [error, setError] = useState('');

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs text-white/55 hover:text-accent transition-colors"
      >
        Forgot password?
      </button>
    );
  }

  if (status === 'sent') {
    return (
      <div role="status" className="space-y-1.5">
        <p className="text-xs text-emerald-300">
          If an account exists for that email, a reset link is on its way — check your inbox.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="text-xs text-white/55 hover:text-accent transition-colors"
        >
          Wrong email? Try again
        </button>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === 'sending') return;
    setError('');
    setStatus('sending');
    try {
      const { error: err } = await resetPassword(email);
      if (err) {
        setError(err);
        setStatus('idle');
      } else {
        setStatus('sent');
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setStatus('idle');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <label htmlFor="forgot-password-email" className="sr-only">
        Account email
      </label>
      <div className="flex gap-2">
        <input
          id="forgot-password-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={!isSupabaseConfigured}
          placeholder="your account email"
          className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/15 text-white placeholder:text-white/50 text-xs focus:border-accent/50 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === 'sending' || !isSupabaseConfigured}
          className="px-3 py-2 rounded-lg bg-white/10 text-white text-xs font-medium hover:bg-white/15 transition-colors disabled:opacity-50 shrink-0"
        >
          {status === 'sending' ? 'Sending…' : 'Send link'}
        </button>
      </div>
      {error && (
        <p role="alert" className="text-xs text-red-300">
          {error}
        </p>
      )}
    </form>
  );
}

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// Shared by AdminLogin, StudentLogin, and ResetPassword (twice) — a masked
// input with a show/hide toggle. No focus:outline-hidden here on purpose: the
// project's global input:focus-visible ring (src/index.css) needs to win.
export default function PasswordField({ id, value, onChange, placeholder, autoComplete, disabled }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        required
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full px-4 py-3 pr-11 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-white/60 text-sm focus:border-accent/50 disabled:opacity-50"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        disabled={disabled}
        aria-label={visible ? 'Hide password' : 'Show password'}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors disabled:opacity-50"
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

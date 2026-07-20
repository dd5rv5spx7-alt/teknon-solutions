import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';

const AuthContext = createContext(null);

// Translates known Supabase/GoTrue error strings into copy a user can act
// on. Falls back to the raw message for anything unrecognized rather than
// hiding it.
function mapAuthError(message) {
  if (!message) return null;
  if (/invalid login credentials/i.test(message)) {
    return "That email and password don't match an account we have on file.";
  }
  if (/email not confirmed/i.test(message)) {
    return 'Please confirm your email before signing in.';
  }
  if (/rate limit/i.test(message)) {
    return 'Too many attempts — please wait a moment and try again.';
  }
  if (/auth session missing/i.test(message)) {
    return 'This link has expired or was already used — request a new one.';
  }
  return message;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  // Guards against two overlapping fetchRole() calls (getSession's initial
  // fetch racing an onAuthStateChange event, or a fast sign-out/sign-in)
  // ever letting a stale response for a no-longer-current user win.
  const latestUserId = useRef(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) fetchRole(data.session.user.id);
      else setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) fetchRole(newSession.user.id);
      else {
        latestUserId.current = null;
        setRole(null);
        setStatus(null);
        setLoading(false);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function fetchRole(userId) {
    latestUserId.current = userId;
    const { data, error } = await supabase.from('profiles').select('role, status').eq('id', userId).single();
    if (latestUserId.current !== userId) return; // a newer call already superseded this one
    setRole(error ? null : data?.role ?? null);
    setStatus(error ? null : data?.status ?? null);
    setLoading(false);
  }

  async function signIn(email, password) {
    if (!isSupabaseConfigured) {
      return { error: 'Supabase is not configured yet — see .env.example.' };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: mapAuthError(error.message) };
    // Resolve the role directly rather than relying on this context's own
    // (async, not-yet-settled) role state, so the caller can navigate to
    // the right destination immediately instead of racing fetchRole().
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
    return { error: null, role: profile?.role ?? null };
  }

  async function signOut() {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
  }

  async function resetPassword(email) {
    if (!isSupabaseConfigured) {
      return { error: 'Supabase is not configured yet — see .env.example.' };
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error: error ? mapAuthError(error.message) : null };
  }

  async function updatePassword(password) {
    if (!isSupabaseConfigured) {
      return { error: 'Supabase is not configured yet — see .env.example.' };
    }
    const { error } = await supabase.auth.updateUser({ password });
    return { error: error ? mapAuthError(error.message) : null };
  }

  const value = {
    session,
    role,
    status,
    loading,
    isAuthenticated: Boolean(session),
    isSupabaseConfigured,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

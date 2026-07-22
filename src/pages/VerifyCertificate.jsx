import React, { useState } from 'react';
import { ShieldCheck, Search, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import Seo from '../components/Seo.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import WhatsAppButton from '../components/WhatsAppButton.jsx';

// Verification now goes through /api/verify-certificate (server-side), not
// the Supabase client directly — so this page no longer needs to import
// src/lib/supabaseClient.js at all, which otherwise pulls the full
// @supabase/supabase-js SDK into this route's chunk for no reason.
const isSupabaseConfigured = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

export default function VerifyCertificate() {
  const [certNumber, setCertNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(undefined); // undefined = not searched, null = not found, {} = found
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = certNumber.trim();
    if (!trimmed) return;
    setLoading(true);
    setError('');
    setResult(undefined);

    // Routed through a rate-limited API endpoint rather than calling
    // supabase.rpc() directly from the browser — the RPC itself has no rate
    // limiting of its own, so a direct call is brute-forceable against
    // Supabase straight from a script.
    try {
      const res = await fetch('/api/verify-certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cert_number: trimmed }),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) {
        setError(body.error || 'Something went wrong verifying that certificate. Please try again.');
        setLoading(false);
        return;
      }
      setResult(body.result);
    } catch {
      setError('Something went wrong verifying that certificate. Please try again.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-navy transition-colors duration-300">
      <Seo
        title="Verify a Certificate | A Teknon Solutions"
        description="Enter a certificate number to confirm the authenticity of an A Teknon Solutions IT internship or training certificate."
        path="/verify-certificate"
      />
      <Navbar />
      <main className="pt-40 pb-28">
        <div className="container-px mx-auto max-w-2xl">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-royal/10 dark:bg-accent/15 text-royal dark:text-accent text-xs font-mono uppercase tracking-wide mb-4">
              <ShieldCheck size={13} /> Certificate Verification
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-navy dark:text-white tracking-tight">
              Verify a Certificate
            </h1>
            <p className="mt-3 text-slatesoft dark:text-white/60">
              Enter the certificate number found on any A Teknon Solutions certificate to confirm
              it&rsquo;s genuine.
            </p>
          </div>

          {!isSupabaseConfigured ? (
            <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5 text-sm text-amber-800 dark:text-amber-200 text-center">
              Verification isn&rsquo;t connected yet on this deployment.
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-8">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slatesoft dark:text-white/40" />
                  <input
                    type="text"
                    required
                    value={certNumber}
                    onChange={(e) => setCertNumber(e.target.value)}
                    placeholder="e.g. TS-2026-483920"
                    aria-label="Certificate number"
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-navy/10 dark:border-white/15 bg-mist dark:bg-white/5 text-navy dark:text-white placeholder:text-slatesoft dark:placeholder:text-white/55 focus:outline-hidden focus:border-royal/50 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-glow inline-flex items-center justify-center gap-2 bg-grad-primary text-white font-semibold px-7 py-3.5 rounded-xl hover:brightness-110 transition-all disabled:opacity-60 shrink-0"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                  {loading ? 'Verifying…' : 'Verify'}
                </button>
              </form>

              {/* aria-live so a screen-reader user who just submitted the form hears
                  the outcome without needing to go find it — none of these three
                  states are guaranteed to receive focus on their own. */}
              <div aria-live="polite">
                {error && <p className="text-sm text-red-500 text-center mb-6">{error}</p>}

                {result === null && (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center">
                    <XCircle size={28} className="mx-auto text-red-500 mb-3" />
                    <p className="font-display font-bold text-navy dark:text-white">Certificate not found</p>
                    <p className="text-sm text-slatesoft dark:text-white/50 mt-1">
                      Double-check the certificate number and try again.
                    </p>
                  </div>
                )}

                {result && (
                  <div className="rounded-3xl border-2 border-royal/20 dark:border-accent/30 bg-grad-navy p-8 text-center">
                    <CheckCircle2 size={32} className="mx-auto text-emerald-400 mb-4" />
                    <p className="text-xs uppercase tracking-wide text-white/50 mb-2">Verified Certificate</p>
                    <p className="font-display font-extrabold text-2xl text-white mb-4">{result.student_name}</p>
                    <p className="text-sm text-white/70 mb-1">has successfully completed</p>
                    <p className="font-display font-bold text-lg text-accent mb-6">{result.course_title}</p>
                    <div className="flex items-center justify-center gap-6 text-xs text-white/50 font-mono">
                      <span>{result.certificate_number}</span>
                      <span>{new Date(result.issued_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

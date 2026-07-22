import React, { useEffect, useState } from 'react';
import { LayoutTemplate, Loader2, RotateCcw, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { supabase } from '../lib/supabaseClient.js';
import { FAQS, TESTIMONIALS } from '../data/siteData.js';

// Deliberately scoped to two sections, matching the audit recommendation
// this was built from ("a structured JSON-per-section editor is enough...
// avoid a full page-builder"). Pricing is intentionally excluded — its tier
// keys/amounts must stay in lockstep with api/_lib/pricing.js's
// server-side source of truth, and a loosely-typed CMS edit risks a real
// mismatch between what's displayed and what Razorpay actually charges.
const SECTIONS = [
  { key: 'faq', label: 'FAQ', description: 'Questions & answers shown in the FAQ section.', fallback: FAQS },
  { key: 'testimonials', label: 'Testimonials', description: 'Student quotes shown in the Testimonials carousel.', fallback: TESTIMONIALS },
];

export default function AdminCMS() {
  const { role: myRole } = useAuth();
  const isAdmin = myRole === 'admin';
  const [activeKey, setActiveKey] = useState(SECTIONS[0].key);
  const active = SECTIONS.find((s) => s.key === activeKey);

  return (
    <>
      <h1 className="font-display font-bold text-2xl text-navy dark:text-white mb-2 flex items-center gap-2">
        <LayoutTemplate size={22} /> Site Content
      </h1>
      <p className="text-sm text-slatesoft dark:text-white/50 mb-6">
        Edit the content below without a code change or redeploy. Changes go live immediately.
      </p>
      {!isAdmin && (
        <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-800 dark:text-amber-200 mb-6">
          You don&rsquo;t have permission to edit site content.
        </div>
      )}

      <div className="flex gap-2 mb-6">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveKey(s.key)}
            aria-pressed={activeKey === s.key}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              activeKey === s.key
                ? 'bg-royal text-white'
                : 'bg-white dark:bg-white/5 text-slatesoft dark:text-white/50 border border-navy/8 dark:border-white/10'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <SectionEditor key={active.key} section={active} isAdmin={isAdmin} />
    </>
  );
}

function SectionEditor({ section, isAdmin }) {
  const [rawJson, setRawJson] = useState('');
  const [isOverride, setIsOverride] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    supabase
      .from('site_content')
      .select('content')
      .eq('section_key', section.key)
      .maybeSingle()
      .then(({ data, error: err }) => {
        if (err) {
          setError(`Could not load current content: ${err.message}`);
          setRawJson(JSON.stringify(section.fallback, null, 2));
          setLoading(false);
          return;
        }
        setIsOverride(Boolean(data?.content));
        setRawJson(JSON.stringify(data?.content ?? section.fallback, null, 2));
        setLoading(false);
      });
  }, [section.key, section.fallback]);

  async function save() {
    let parsed;
    try {
      parsed = JSON.parse(rawJson);
    } catch (e) {
      setError(`Invalid JSON: ${e.message}`);
      return;
    }
    if (!Array.isArray(parsed) || parsed.length === 0) {
      setError('This section expects a non-empty JSON array.');
      return;
    }
    setSaving(true);
    setError('');
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error: err } = await supabase
      .from('site_content')
      .upsert(
        { section_key: section.key, content: parsed, updated_at: new Date().toISOString(), updated_by: user?.id },
        { onConflict: 'section_key' }
      );
    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    setIsOverride(true);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function resetToDefault() {
    if (!window.confirm('Remove your override and go back to the built-in default? This cannot be undone.')) return;
    setSaving(true);
    setError('');
    const { error: err } = await supabase.from('site_content').delete().eq('section_key', section.key);
    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    setIsOverride(false);
    setRawJson(JSON.stringify(section.fallback, null, 2));
  }

  return (
    <div className="rounded-2xl border border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.04] p-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-navy dark:text-white">{section.label}</p>
          <p className="text-xs text-slatesoft dark:text-white/50">{section.description}</p>
        </div>
        <span
          className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold ${
            isOverride ? 'bg-royal/10 dark:bg-accent/15 text-royal dark:text-accent' : 'bg-slatesoft/10 dark:bg-white/10 text-slatesoft dark:text-white/50'
          }`}
        >
          {isOverride ? 'Custom' : 'Default'}
        </span>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-slatesoft dark:text-white/50 text-sm">
          <Loader2 size={16} className="animate-spin" /> Loading…
        </div>
      ) : (
        <>
          <textarea
            value={rawJson}
            onChange={(e) => setRawJson(e.target.value)}
            disabled={!isAdmin}
            spellCheck={false}
            rows={16}
            className="w-full px-3.5 py-3 rounded-xl border border-navy/10 dark:border-white/15 bg-mist dark:bg-white/5 text-navy dark:text-white text-xs font-mono focus:border-royal/50 disabled:opacity-60 resize-y"
          />
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          {isAdmin && (
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={save}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-grad-primary text-white text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-60"
              >
                {saved ? <CheckCircle2 size={15} /> : <Save size={15} />}
                {saving ? 'Saving…' : saved ? 'Saved!' : 'Save changes'}
              </button>
              {isOverride && (
                <button
                  onClick={resetToDefault}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-navy/10 dark:border-white/15 text-sm font-semibold text-navy dark:text-white hover:border-royal/40 transition-colors disabled:opacity-50"
                >
                  <RotateCcw size={14} /> Reset to default
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
import { CreditCard, Loader2, Search, Download, IndianRupee, TrendingUp, Receipt } from 'lucide-react';
import { supabase } from '../lib/supabaseClient.js';

const TIER_LABELS = {
  starter: 'Starter (2-week)',
  professional: 'Professional (4-week)',
  advanced: 'Advanced (8-week)',
};

function rupees(paise) {
  return `₹${(paise / 100).toLocaleString('en-IN')}`;
}

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500)
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setPayments(data ?? []);
        setLoading(false);
      });
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${now.getMonth()}`;
    const paid = payments.filter((p) => p.status === 'paid');
    return {
      totalRevenue: paid.reduce((sum, p) => sum + p.amount, 0),
      totalCount: paid.length,
      thisMonthRevenue: paid
        .filter((p) => {
          const d = new Date(p.created_at);
          return `${d.getFullYear()}-${d.getMonth()}` === monthKey;
        })
        .reduce((sum, p) => sum + p.amount, 0),
    };
  }, [payments]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return payments;
    return payments.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q) ||
        p.phone?.toLowerCase().includes(q) ||
        p.razorpay_payment_id?.toLowerCase().includes(q)
    );
  }, [payments, search]);

  function exportCsv() {
    const headers = ['Name', 'Email', 'Phone', 'Program', 'Amount', 'Status', 'Razorpay Payment ID', 'Date'];
    const rows = filtered.map((p) => [
      p.name, p.email, p.phone, TIER_LABELS[p.tier] || p.tier,
      (p.amount / 100).toFixed(2), p.status, p.razorpay_payment_id ?? '', p.created_at,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teknon-payments-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <h1 className="font-display font-bold text-2xl text-navy dark:text-white mb-5">Payments</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Revenue" value={rupees(stats.totalRevenue)} icon={IndianRupee} />
        <StatCard label="This Month" value={rupees(stats.thisMonthRevenue)} icon={TrendingUp} />
        <StatCard label="Total Payments" value={stats.totalCount} icon={Receipt} />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slatesoft dark:text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone, payment ID…"
            aria-label="Search payments"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-navy/10 dark:border-white/15 bg-white dark:bg-white/5 text-navy dark:text-white text-sm placeholder:text-slatesoft dark:placeholder:text-white/55 focus:border-royal/50"
          />
        </div>
        <button
          onClick={exportCsv}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-navy/10 dark:border-white/15 text-sm font-semibold text-navy dark:text-white hover:border-royal/40 transition-colors shrink-0"
        >
          <Download size={15} /> Export CSV ({filtered.length})
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-slatesoft dark:text-white/50 text-sm">
          <Loader2 size={16} className="animate-spin" /> Loading…
        </div>
      )}
      {error && <p className="text-sm text-red-500">Couldn&rsquo;t load payments: {error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <p className="text-sm text-slatesoft dark:text-white/50">
          {payments.length === 0 ? 'No payments yet — they appear here as soon as someone pays.' : 'No payments match.'}
        </p>
      )}

      {filtered.length > 0 && (
        <div className="rounded-2xl border border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.04] divide-y divide-navy/5 dark:divide-white/5 overflow-hidden">
          {filtered.map((p) => (
            <div key={p.id} className="flex items-center gap-4 px-5 py-4">
              <span className="w-9 h-9 grid place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                <CreditCard size={15} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-navy dark:text-white truncate">{p.name}</p>
                <p className="text-xs text-slatesoft dark:text-white/50 truncate">
                  {p.email} · {p.phone}
                </p>
              </div>
              <span className="hidden sm:block text-xs text-slatesoft dark:text-white/50 shrink-0">
                {TIER_LABELS[p.tier] || p.tier}
              </span>
              <span className="shrink-0 text-sm font-display font-bold text-navy dark:text-white">
                {rupees(p.amount)}
              </span>
              <span className="hidden md:block text-xs text-slatesoft dark:text-white/40 shrink-0 w-24 text-right">
                {new Date(p.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.04] p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono uppercase tracking-wide text-slatesoft dark:text-white/40">{label}</span>
        <Icon size={15} className="text-royal dark:text-accent" />
      </div>
      <p className="font-display font-extrabold text-2xl text-navy dark:text-white">{value}</p>
    </div>
  );
}

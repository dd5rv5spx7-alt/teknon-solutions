import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CreditCard, Loader2, Search, Download, IndianRupee, TrendingUp, Receipt, ExternalLink, Undo2, X } from 'lucide-react';
import { supabase } from '../lib/supabaseClient.js';
import { useAuth } from '../context/AuthContext.jsx';
import StatCard from '../components/admin/StatCard.jsx';
import { downloadCsv } from '../lib/csv.js';

const TIER_LABELS = {
  starter: 'Starter (2-week)',
  professional: 'Professional (4-week)',
  advanced: 'Advanced (8-week)',
};

const STATUS_META = {
  paid: { label: 'Paid', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  created: { label: 'Started', color: 'bg-slatesoft/10 dark:bg-white/10 text-slatesoft dark:text-white/60' },
  failed: { label: 'Failed', color: 'bg-red-500/10 text-red-600 dark:text-red-300' },
  refunded: { label: 'Refunded', color: 'bg-gold/15 text-amber-600 dark:text-gold' },
  partially_refunded: { label: 'Partial refund', color: 'bg-gold/15 text-amber-600 dark:text-gold' },
};
const FILTER_TABS = ['all', 'paid', 'created', 'failed', 'refunded', 'partially_refunded'];
const PAGE_SIZE = 100;

function rupees(paise) {
  return `₹${(paise / 100).toLocaleString('en-IN')}`;
}

export default function AdminPayments() {
  const { session } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [refunding, setRefunding] = useState(null); // payment row being refunded, or null

  useEffect(() => {
    fetchPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function fetchPage(page) {
    const loader = page === 0 ? setLoading : setLoadingMore;
    loader(true);
    supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1)
      .then(({ data, error: err }) => {
        if (err) {
          setError(err.message);
        } else {
          setPayments((prev) => (page === 0 ? data ?? [] : [...prev, ...(data ?? [])]));
          setHasMore((data ?? []).length === PAGE_SIZE);
        }
        loader(false);
      });
  }

  // Revenue only ever counts what's actually still kept — a refund issued
  // from the Razorpay dashboard used to keep counting as revenue here
  // forever, with no way to reconcile short of manually cross-checking
  // Razorpay's own dashboard.
  const stats = useMemo(() => {
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${now.getMonth()}`;
    const counted = payments.filter((p) => p.status === 'paid' || p.status === 'partially_refunded');
    const netAmount = (p) => p.amount - (p.refunded_amount || 0);
    return {
      totalRevenue: counted.reduce((sum, p) => sum + netAmount(p), 0),
      totalCount: counted.length,
      thisMonthRevenue: counted
        .filter((p) => {
          const d = new Date(p.created_at);
          return `${d.getFullYear()}-${d.getMonth()}` === monthKey;
        })
        .reduce((sum, p) => sum + netAmount(p), 0),
    };
  }, [payments]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return payments.filter((p) => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (!q) return true;
      return (
        p.name?.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q) ||
        p.phone?.toLowerCase().includes(q) ||
        p.razorpay_payment_id?.toLowerCase().includes(q)
      );
    });
  }, [payments, search, statusFilter]);

  function exportCsv() {
    const headers = ['Name', 'Email', 'Phone', 'Program', 'Amount', 'Refunded', 'Status', 'Razorpay Payment ID', 'Razorpay Order ID', 'Date'];
    const rows = filtered.map((p) => [
      p.name, p.email, p.phone, TIER_LABELS[p.tier] || p.tier,
      (p.amount / 100).toFixed(2), ((p.refunded_amount || 0) / 100).toFixed(2), p.status,
      p.razorpay_payment_id ?? '', p.razorpay_order_id ?? '', p.created_at,
    ]);
    downloadCsv(`teknon-payments-${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  }

  function onRefunded(paymentId, refundedAmount) {
    setPayments((list) =>
      list.map((p) =>
        p.id === paymentId
          ? { ...p, refunded_amount: refundedAmount, status: refundedAmount >= p.amount ? 'refunded' : 'partially_refunded' }
          : p
      )
    );
    setRefunding(null);
  }

  return (
    <>
      <h1 className="font-display font-bold text-2xl text-navy dark:text-white mb-5">Payments</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Revenue" value={rupees(stats.totalRevenue)} icon={IndianRupee} sub="net of refunds" />
        <StatCard label="This Month" value={rupees(stats.thisMonthRevenue)} icon={TrendingUp} sub="net of refunds" />
        <StatCard label="Total Payments" value={stats.totalCount} icon={Receipt} />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
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

      <div className="flex gap-2 flex-wrap mb-6">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold font-mono uppercase tracking-wide transition-colors ${
              statusFilter === tab
                ? 'bg-royal text-white'
                : 'bg-white dark:bg-white/5 text-slatesoft dark:text-white/50 border border-navy/8 dark:border-white/10'
            }`}
          >
            {tab === 'all' ? 'All' : STATUS_META[tab].label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-slatesoft dark:text-white/50 text-sm">
          <Loader2 size={16} className="animate-spin" /> Loading…
        </div>
      )}
      {error && <p className="text-sm text-red-500">Couldn&rsquo;t load payments: {error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <p className="text-sm text-slatesoft dark:text-white/50">
          {payments.length === 0 ? 'No payments yet — they appear here as soon as someone starts checkout.' : 'No payments match.'}
        </p>
      )}

      {filtered.length > 0 && (
        <div className="rounded-2xl border border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.04] divide-y divide-navy/5 dark:divide-white/5 overflow-hidden">
          {filtered.map((p) => {
            const meta = STATUS_META[p.status] || STATUS_META.created;
            const canRefund = p.status === 'paid' || p.status === 'partially_refunded';
            return (
              <div key={p.id} className="flex flex-wrap items-center gap-3 sm:gap-4 px-5 py-4">
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
                <span className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold ${meta.color}`}>
                  {meta.label}
                </span>
                <span className="shrink-0 text-sm font-display font-bold text-navy dark:text-white">
                  {rupees(p.amount - (p.refunded_amount || 0))}
                  {p.refunded_amount > 0 && (
                    <span className="ml-1 text-[11px] font-mono font-normal text-slatesoft dark:text-white/40">
                      (of {rupees(p.amount)})
                    </span>
                  )}
                </span>
                <span className="hidden md:block text-xs text-slatesoft dark:text-white/40 shrink-0 w-20 text-right">
                  {new Date(p.created_at).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-2 shrink-0 ml-auto sm:ml-0">
                  {p.razorpay_payment_id && (
                    <a
                      href={`https://dashboard.razorpay.com/app/payments/${encodeURIComponent(p.razorpay_payment_id)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View in Razorpay"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-navy/10 dark:border-white/15 text-navy dark:text-white hover:border-royal/40 transition-colors"
                    >
                      <ExternalLink size={12} /> Razorpay
                    </a>
                  )}
                  {canRefund && (
                    <button
                      onClick={() => setRefunding(p)}
                      title="Issue refund"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-red-500/30 text-red-600 dark:text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                      <Undo2 size={12} /> Refund
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && hasMore && statusFilter === 'all' && !search && (
        <div className="mt-6 text-center">
          <button
            onClick={() => fetchPage(Math.ceil(payments.length / PAGE_SIZE))}
            disabled={loadingMore}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-navy/10 dark:border-white/15 text-sm font-semibold text-navy dark:text-white hover:border-royal/40 transition-colors disabled:opacity-50"
          >
            {loadingMore && <Loader2 size={14} className="animate-spin" />}
            {loadingMore ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}

      {refunding && (
        <RefundModal
          payment={refunding}
          accessToken={session?.access_token}
          onClose={() => setRefunding(null)}
          onRefunded={onRefunded}
        />
      )}
    </>
  );
}

function RefundModal({ payment, accessToken, onClose, onRefunded }) {
  const remaining = payment.amount - (payment.refunded_amount || 0);
  const [amountRupees, setAmountRupees] = useState((remaining / 100).toString());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const dialogRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    previouslyFocused.current = document.activeElement;
    const focusable = dialogRef.current.querySelectorAll('input, button, [href], [tabindex]:not([tabindex="-1"])');
    focusable[0]?.focus();
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused.current?.focus?.();
    };
  }, [onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    const amountPaise = Math.round(parseFloat(amountRupees) * 100);
    if (!amountPaise || amountPaise <= 0 || amountPaise > remaining) {
      setError(`Enter an amount between ₹0.01 and ₹${(remaining / 100).toFixed(2)}.`);
      return;
    }
    if (!window.confirm(`Refund ₹${(amountPaise / 100).toFixed(2)} to ${payment.name}? This calls Razorpay and cannot be undone from here.`)) {
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/admin/refund-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ payment_id: payment.id, amount: amountPaise }),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) {
        setError(body.error || 'Refund failed.');
        setSubmitting(false);
        return;
      }
      onRefunded(payment.id, body.refunded_amount);
    } catch {
      setError('Refund failed. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="refund-modal-title"
        className="w-full max-w-sm rounded-3xl bg-white dark:bg-navy p-7 shadow-card-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 id="refund-modal-title" className="font-display font-bold text-lg text-navy dark:text-white">
            Refund {payment.name}
          </h2>
          <button onClick={onClose} aria-label="Close" className="text-slatesoft dark:text-white/50 hover:text-navy dark:hover:text-white">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-slatesoft dark:text-white/60">
            Up to ₹{(remaining / 100).toFixed(2)} refundable on this payment (Razorpay ID {payment.razorpay_payment_id}).
          </p>
          <div>
            <label className="block text-xs font-semibold text-navy dark:text-white mb-1.5">Refund amount (₹)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max={remaining / 100}
              value={amountRupees}
              onChange={(e) => setAmountRupees(e.target.value)}
              className="modal-input"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-grad-primary text-white font-semibold px-6 py-3 rounded-xl hover:brightness-110 transition-all disabled:opacity-60"
          >
            {submitting ? 'Processing…' : 'Issue refund'}
          </button>
        </form>
      </div>
    </div>
  );
}

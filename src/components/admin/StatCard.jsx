import React from 'react';

// Was reimplemented independently in AdminDashboard, AdminPayments,
// AdminPeople, and AdminAnalytics — the prop signatures had already
// drifted (highlight vs. sub vs. neither). One shared component supporting
// the union of props already in use across all four.
export default function StatCard({ label, value, icon: Icon, highlight, sub }) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        highlight ? 'border-royal/30 bg-royal/5 dark:bg-accent/10' : 'border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.04]'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono uppercase tracking-wide text-slatesoft dark:text-white/55">{label}</span>
        <Icon size={15} className="text-royal dark:text-accent" />
      </div>
      <p className="font-display font-extrabold text-2xl text-navy dark:text-white">{value}</p>
      {sub && <p className="text-[11px] text-slatesoft dark:text-white/55 mt-0.5">{sub}</p>}
    </div>
  );
}

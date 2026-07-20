import React, { useEffect, useMemo, useState } from 'react';
import {
  Inbox, Loader2, Search, Download, Mail, MailOpen,
  MessageSquare, GraduationCap, Archive, RotateCcw, ChevronDown, ChevronUp,
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient.js';

const STATUS_META = {
  new: { label: 'New', color: 'bg-royal/10 dark:bg-accent/15 text-royal dark:text-accent' },
  read: { label: 'Read', color: 'bg-slatesoft/10 dark:bg-white/10 text-slatesoft dark:text-white/60' },
  replied: { label: 'Replied', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  enrolled: { label: 'Enrolled', color: 'bg-gold/15 text-amber-600 dark:text-gold' },
  archived: { label: 'Archived', color: 'bg-red-500/10 text-red-500' },
};
const FILTER_TABS = ['all', 'new', 'read', 'replied', 'enrolled', 'archived'];

export default function AdminDashboard() {
  const [enquiries, setEnquiries] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  function fetchEnquiries() {
    setLoadingList(true);
    supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500)
      .then(({ data, error }) => {
        if (error) setListError(error.message);
        else setEnquiries(data ?? []);
        setLoadingList(false);
      });
  }

  async function updateStatus(id, status) {
    setUpdatingId(id);
    const { error } = await supabase.from('enquiries').update({ status }).eq('id', id);
    if (!error) {
      setEnquiries((list) => list.map((e) => (e.id === id ? { ...e, status } : e)));
    }
    setUpdatingId(null);
  }

  const stats = useMemo(() => {
    const now = new Date();
    const todayStr = now.toDateString();
    const monthKey = `${now.getFullYear()}-${now.getMonth()}`;
    return {
      total: enquiries.length,
      today: enquiries.filter((e) => new Date(e.created_at).toDateString() === todayStr).length,
      thisMonth: enquiries.filter((e) => {
        const d = new Date(e.created_at);
        return `${d.getFullYear()}-${d.getMonth()}` === monthKey;
      }).length,
      unread: enquiries.filter((e) => e.status === 'new').length,
    };
  }, [enquiries]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return enquiries.filter((e) => {
      const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
      const matchesSearch =
        !q ||
        e.name?.toLowerCase().includes(q) ||
        e.email?.toLowerCase().includes(q) ||
        e.phone?.toLowerCase().includes(q) ||
        e.college?.toLowerCase().includes(q) ||
        e.program?.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [enquiries, search, statusFilter]);

  function exportCsv() {
    const headers = ['Name', 'Email', 'Phone', 'College', 'Year', 'Program', 'Status', 'Message', 'Source', 'Received'];
    const rows = filtered.map((e) => [
      e.name, e.email, e.phone, e.college ?? '', e.year ?? '', e.program ?? '',
      e.status, (e.message ?? '').replace(/\n/g, ' '), e.source_page ?? '', e.created_at,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teknon-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <h1 className="font-display font-bold text-2xl text-navy dark:text-white mb-5">Enquiries</h1>

      <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-800 dark:text-amber-200 mb-8">
        Enquiries, People, Courses, Certificates and Payments are built — CMS (editing the
        marketing site's own content) and Assignments from CLAUDE.md's full spec aren't here yet.
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Enquiries" value={stats.total} icon={Inbox} />
        <StatCard label="Today" value={stats.today} icon={Mail} />
        <StatCard label="This Month" value={stats.thisMonth} icon={GraduationCap} />
        <StatCard label="Unread" value={stats.unread} icon={MailOpen} highlight={stats.unread > 0} />
      </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slatesoft dark:text-white/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, phone, college…"
              aria-label="Search enquiries"
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

        {loadingList && (
          <div className="flex items-center gap-2 text-slatesoft dark:text-white/50 text-sm">
            <Loader2 size={16} className="animate-spin" /> Loading…
          </div>
        )}
        {listError && <p className="text-sm text-red-500">Couldn&rsquo;t load enquiries: {listError}</p>}
        {!loadingList && !listError && filtered.length === 0 && (
          <p className="text-sm text-slatesoft dark:text-white/50">No enquiries match.</p>
        )}

        {filtered.length > 0 && (
          <div className="rounded-2xl border border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.04] divide-y divide-navy/5 dark:divide-white/5 overflow-hidden">
            {filtered.map((e) => {
              const isOpen = expandedId === e.id;
              return (
                <div key={e.id}>
                  <button
                    onClick={() => setExpandedId(isOpen ? null : e.id)}
                    className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-mist/60 dark:hover:bg-white/[0.03] transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-navy dark:text-white truncate">{e.name}</p>
                      <p className="text-xs text-slatesoft dark:text-white/50 truncate">
                        {e.email} · {e.phone}
                        {e.college ? ` · ${e.college}` : ''}
                      </p>
                    </div>
                    <span className="hidden sm:block text-xs text-slatesoft dark:text-white/50 shrink-0">
                      {e.program || '—'}
                    </span>
                    <span className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold ${STATUS_META[e.status]?.color}`}>
                      {STATUS_META[e.status]?.label ?? e.status}
                    </span>
                    <span className="hidden md:block text-xs text-slatesoft dark:text-white/40 shrink-0 w-20 text-right">
                      {new Date(e.created_at).toLocaleDateString()}
                    </span>
                    {isOpen ? <ChevronUp size={16} className="text-slatesoft shrink-0" /> : <ChevronDown size={16} className="text-slatesoft shrink-0" />}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 bg-mist/40 dark:bg-white/[0.02]">
                      <div className="grid sm:grid-cols-2 gap-3 text-sm mb-4">
                        <DetailRow label="Year" value={e.year} />
                        <DetailRow label="Source page" value={e.source_page} />
                        <DetailRow label="IP address" value={e.ip_address} />
                        <DetailRow label="Received" value={new Date(e.created_at).toLocaleString()} />
                      </div>
                      {e.message && (
                        <div className="mb-4">
                          <p className="text-xs font-mono uppercase tracking-wide text-slatesoft dark:text-white/40 mb-1">Message</p>
                          <p className="text-sm text-navy dark:text-white/80 whitespace-pre-wrap">{e.message}</p>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <ActionBtn icon={MailOpen} label="Mark read" onClick={() => updateStatus(e.id, 'read')} disabled={updatingId === e.id} />
                        <ActionBtn icon={MessageSquare} label="Mark replied" onClick={() => updateStatus(e.id, 'replied')} disabled={updatingId === e.id} />
                        <ActionBtn icon={GraduationCap} label="Mark enrolled" onClick={() => updateStatus(e.id, 'enrolled')} disabled={updatingId === e.id} />
                        {e.status === 'archived' ? (
                          <ActionBtn icon={RotateCcw} label="Restore" onClick={() => updateStatus(e.id, 'new')} disabled={updatingId === e.id} />
                        ) : (
                          <ActionBtn icon={Archive} label="Archive" onClick={() => updateStatus(e.id, 'archived')} disabled={updatingId === e.id} danger />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
    </>
  );
}

function StatCard({ label, value, icon: Icon, highlight }) {
  return (
    <div className={`rounded-2xl border p-5 ${highlight ? 'border-royal/30 bg-royal/5 dark:bg-accent/10' : 'border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.04]'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono uppercase tracking-wide text-slatesoft dark:text-white/40">{label}</span>
        <Icon size={15} className="text-royal dark:text-accent" />
      </div>
      <p className="font-display font-extrabold text-2xl text-navy dark:text-white">{value}</p>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div>
      <p className="text-xs font-mono uppercase tracking-wide text-slatesoft dark:text-white/40">{label}</p>
      <p className="text-sm text-navy dark:text-white/80 break-all">{value || '—'}</p>
    </div>
  );
}

function ActionBtn({ icon: Icon, label, onClick, disabled, danger }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors disabled:opacity-50 ${
        danger
          ? 'border-red-500/30 text-red-500 hover:bg-red-500/10'
          : 'border-navy/10 dark:border-white/15 text-navy dark:text-white hover:border-royal/40'
      }`}
    >
      <Icon size={13} /> {label}
    </button>
  );
}

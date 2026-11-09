import React, { useEffect, useMemo, useState } from 'react';
import {
  Inbox, Loader2, Search, Download, Mail, MailOpen,
  MessageSquare, GraduationCap, Archive, RotateCcw, ChevronDown, ChevronUp,
  Phone, Send, Building2, User, CheckCircle2, Clock, Sparkles, Filter, X
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';
import StatCard from '../components/admin/StatCard.jsx';
import { downloadCsv } from '../lib/csv.js';
import { MOCK_ENQUIRIES } from '../data/mockPortalData.js';

const STATUS_META = {
  new: { label: 'New Lead', color: 'bg-blue-500/10 text-royal dark:text-accent border-blue-500/20' },
  read: { label: 'Read', color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20' },
  replied: { label: 'Replied', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  enrolled: { label: 'Enrolled / Closed', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  archived: { label: 'Archived', color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' },
};

const FILTER_TABS = ['all', 'new', 'read', 'replied', 'enrolled', 'archived'];

export default function AdminDashboard() {
  const [enquiries, setEnquiries] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [leadTypeFilter, setLeadTypeFilter] = useState('all'); // all | student | business
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  function fetchEnquiries() {
    setLoadingList(true);
    setListError('');

    if (!isSupabaseConfigured || !supabase) {
      // Use rich mock data resilience layer
      setEnquiries(MOCK_ENQUIRIES);
      setLoadingList(false);
      return;
    }

    supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500)
      .then(({ data, error }) => {
        if (error) {
          console.warn('Supabase query returned error, falling back to mock enquiries:', error);
          setEnquiries(MOCK_ENQUIRIES);
        } else if (data && data.length > 0) {
          setEnquiries(data);
        } else {
          setEnquiries(MOCK_ENQUIRIES);
        }
        setLoadingList(false);
      });
  }

  async function updateStatus(id, status) {
    setUpdatingId(id);

    // If Supabase is available, update in DB
    if (isSupabaseConfigured && supabase) {
      await supabase.from('enquiries').update({ status }).eq('id', id);
    }

    // Update in local state
    setEnquiries((list) => list.map((e) => (e.id === id ? { ...e, status } : e)));
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
      const matchesType =
        leadTypeFilter === 'all' ||
        (leadTypeFilter === 'student' && (!e.lead_type || e.lead_type === 'student')) ||
        (leadTypeFilter === 'business' && (e.lead_type === 'business' || e.company || e.service_interested));

      const matchesSearch =
        !q ||
        e.name?.toLowerCase().includes(q) ||
        e.email?.toLowerCase().includes(q) ||
        e.phone?.toLowerCase().includes(q) ||
        e.college?.toLowerCase().includes(q) ||
        e.company?.toLowerCase().includes(q) ||
        e.program?.toLowerCase().includes(q) ||
        e.service_interested?.toLowerCase().includes(q) ||
        e.message?.toLowerCase().includes(q);

      return matchesStatus && matchesType && matchesSearch;
    });
  }, [enquiries, search, statusFilter, leadTypeFilter]);

  function exportCsv() {
    const headers = ['Name', 'Email', 'Phone', 'College/Company', 'Program/Service', 'Status', 'Message', 'Source', 'Received'];
    const rows = filtered.map((e) => [
      e.name,
      e.email,
      e.phone,
      e.company || e.college || '',
      e.service_interested || e.program || '',
      e.status,
      (e.message ?? '').replace(/\n/g, ' '),
      e.source_page ?? '',
      e.created_at,
    ]);
    downloadCsv(`ats-enquiries-${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  }

  function getWhatsAppUrl(e) {
    const rawPhone = (e.phone || '').replace(/[^0-9]/g, '');
    const phoneWithCountry = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
    const name = e.name || 'there';
    const topic = e.service_interested || e.program || 'your inquiry';
    const text = encodeURIComponent(
      `Hello ${name}, thank you for contacting ATS Group of Companies regarding ${topic}. We would be glad to guide you further.`
    );
    return `https://wa.me/${phoneWithCountry}?text=${text}`;
  }

  return (
    <div className="space-y-6">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
            Inquiries & Leads Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time prospective student registrations & corporate IT inquiries
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs sm:text-sm font-semibold text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all shadow-xs"
          >
            <Download size={15} /> Export CSV ({filtered.length})
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Inquiries" value={stats.total} icon={Inbox} />
        <StatCard label="Today's Leads" value={stats.today} icon={Mail} />
        <StatCard label="This Month" value={stats.thisMonth} icon={GraduationCap} />
        <StatCard label="Pending Action" value={stats.unread} icon={MailOpen} highlight={stats.unread > 0} />
      </div>

      {/* Lead Segmentation Bar */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 max-w-md shadow-xs">
        <button
          onClick={() => setLeadTypeFilter('all')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all ${
            leadTypeFilter === 'all'
              ? 'bg-royal text-white dark:bg-accent dark:text-navy shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          All Leads ({enquiries.length})
        </button>
        <button
          onClick={() => setLeadTypeFilter('student')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
            leadTypeFilter === 'student'
              ? 'bg-royal text-white dark:bg-accent dark:text-navy shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <GraduationCap size={13} />
          <span>Students</span>
        </button>
        <button
          onClick={() => setLeadTypeFilter('business')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
            leadTypeFilter === 'business'
              ? 'bg-royal text-white dark:bg-accent dark:text-navy shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Building2 size={13} />
          <span>Business IT</span>
        </button>
      </div>

      {/* Toolbar: Search + Status Filter Tabs */}
      <div className="space-y-4">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads by name, email, phone, college, company or program…"
            aria-label="Search inquiries"
            className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:border-royal shadow-xs"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 flex-wrap items-center">
          {FILTER_TABS.map((tab) => {
            const count = enquiries.filter((e) => (tab === 'all' ? true : e.status === tab)).length;
            const isActive = statusFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                aria-pressed={isActive}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-royal text-white dark:bg-accent dark:text-navy shadow-xs'
                    : 'bg-white dark:bg-[#0f172a] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:border-slate-300'
                }`}
              >
                <span>{tab === 'all' ? 'All Status' : STATUS_META[tab]?.label || tab}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white dark:bg-navy/20 dark:text-navy' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading & Empty States */}
      {loadingList && (
        <div className="flex items-center gap-2 text-slate-500 text-sm py-12 justify-center">
          <Loader2 size={18} className="animate-spin text-royal" /> Loading inquiries…
        </div>
      )}

      {!loadingList && filtered.length === 0 && (
        <div className="rounded-3xl p-12 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 text-center space-y-3">
          <Inbox size={36} className="mx-auto text-slate-400" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">No inquiries found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {search || statusFilter !== 'all' || leadTypeFilter !== 'all'
              ? 'No leads match your current search and filter criteria.'
              : 'Prospective students and clients who submit the contact form will appear here.'}
          </p>
          {(search || statusFilter !== 'all' || leadTypeFilter !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('all');
                setLeadTypeFilter('all');
              }}
              className="text-xs font-semibold text-royal dark:text-accent hover:underline pt-2 inline-block"
            >
              Reset all filters
            </button>
          )}
        </div>
      )}

      {/* Enquiries List */}
      {!loadingList && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((e) => {
            const isOpen = expandedId === e.id;
            const isStudent = !e.lead_type || e.lead_type === 'student';
            const initials = (e.name || 'L')
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();

            const topicStr = e.service_interested || e.program || 'General Inquiry';
            const affiliation = e.company || e.college || 'Direct Prospect';

            return (
              <div
                key={e.id}
                className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f172a] shadow-xs overflow-hidden transition-all hover:border-slate-300 dark:hover:border-white/20"
              >
                {/* Main Row */}
                <div
                  onClick={() => setExpandedId(isOpen ? null : e.id)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                    {/* Lead Initials Avatar */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isStudent
                          ? 'bg-blue-500/10 text-royal dark:text-accent border border-blue-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {initials}
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">{e.name}</h3>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                            STATUS_META[e.status]?.color || 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {STATUS_META[e.status]?.label || e.status}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {isStudent ? '🎓 Student' : '🏢 Business IT'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-slate-700 dark:text-slate-300">{topicStr}</span>
                        <span>·</span>
                        <span>{affiliation}</span>
                        <span>·</span>
                        <span>{e.phone}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions & Timestamp */}
                  <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                    <span className="text-xs font-mono text-slate-400 hidden md:inline">
                      {new Date(e.created_at).toLocaleDateString()}
                    </span>

                    {/* WhatsApp Quick Action */}
                    {e.phone && (
                      <a
                        href={getWhatsAppUrl(e)}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(ev) => ev.stopPropagation()}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold transition-colors"
                        title="Open WhatsApp chat with prospect"
                      >
                        <Phone size={12} /> WhatsApp
                      </a>
                    )}

                    <button
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
                      aria-label="Expand details"
                    >
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isOpen && (
                  <div className="p-5 border-t border-slate-100 dark:border-white/5 bg-slate-50/70 dark:bg-white/[0.02] space-y-4">
                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div>
                        <p className="font-mono uppercase text-slate-400 text-[10px]">Email Address</p>
                        <a
                          href={`mailto:${e.email}?subject=ATS Group of Companies - Regarding Your Inquiry`}
                          className="font-medium text-royal dark:text-accent hover:underline break-all mt-0.5 inline-block"
                        >
                          {e.email || '—'}
                        </a>
                      </div>
                      <div>
                        <p className="font-mono uppercase text-slate-400 text-[10px]">Mobile / WhatsApp</p>
                        <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">{e.phone || '—'}</p>
                      </div>
                      <div>
                        <p className="font-mono uppercase text-slate-400 text-[10px]">Academic Year / Org</p>
                        <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">
                          {e.year || e.company || '—'}
                        </p>
                      </div>
                      <div>
                        <p className="font-mono uppercase text-slate-400 text-[10px]">Source Page / Route</p>
                        <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5 font-mono">
                          {e.source_page || '/'}
                        </p>
                      </div>
                    </div>

                    {e.message && (
                      <div className="p-3.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 text-xs">
                        <p className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] mb-1">
                          Inquiry Message:
                        </p>
                        <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                          {e.message}
                        </p>
                      </div>
                    )}

                    {/* Status Update Trigger Buttons */}
                    <div className="pt-2 flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-slate-500 font-medium">Update Status:</span>
                        <button
                          onClick={() => updateStatus(e.id, 'read')}
                          disabled={updatingId === e.id}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                        >
                          Mark Read
                        </button>
                        <button
                          onClick={() => updateStatus(e.id, 'replied')}
                          disabled={updatingId === e.id}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                        >
                          Mark Replied
                        </button>
                        <button
                          onClick={() => updateStatus(e.id, 'enrolled')}
                          disabled={updatingId === e.id}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
                        >
                          Mark Enrolled
                        </button>
                        {e.status === 'archived' ? (
                          <button
                            onClick={() => updateStatus(e.id, 'new')}
                            disabled={updatingId === e.id}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 hover:bg-slate-100 dark:border-white/10 text-slate-600 transition-colors"
                          >
                            Restore
                          </button>
                        ) : (
                          <button
                            onClick={() => updateStatus(e.id, 'archived')}
                            disabled={updatingId === e.id}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                          >
                            Archive
                          </button>
                        )}
                      </div>

                      <a
                        href={getWhatsAppUrl(e)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 transition-colors shadow-xs"
                      >
                        <Send size={13} /> Chat on WhatsApp
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

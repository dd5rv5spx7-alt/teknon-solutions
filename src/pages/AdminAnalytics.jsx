import React, { useEffect, useMemo, useState } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell,
} from 'recharts';
import { TrendingUp, Target, GraduationCap, UserCog, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient.js';
import StatCard from '../components/admin/StatCard.jsx';

const STATUS_ORDER = ['new', 'read', 'replied', 'enrolled', 'archived'];
const STATUS_LABELS = { new: 'New', read: 'Read', replied: 'Replied', enrolled: 'Enrolled', archived: 'Archived' };
const STATUS_COLORS = { new: '#1E5EFF', read: '#94A3B8', replied: '#10B981', enrolled: '#FBBF24', archived: '#EF4444' };

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

export default function AdminAnalytics() {
  const [enquiries, setEnquiries] = useState([]);
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      supabase.from('enquiries').select('program, college, status, created_at').limit(5000),
      supabase.from('profiles').select('role, created_at').in('role', ['student', 'faculty']).limit(5000),
    ]).then(([enqRes, peopleRes]) => {
      if (enqRes.error) setError(enqRes.error.message);
      else setEnquiries(enqRes.data ?? []);
      if (peopleRes.data) setPeople(peopleRes.data);
      setLoading(false);
    });
  }, []);

  const stats = useMemo(() => {
    const total = enquiries.length;
    const enrolled = enquiries.filter((e) => e.status === 'enrolled').length;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const newThisWeek = enquiries.filter((e) => new Date(e.created_at) >= weekAgo).length;
    return {
      total,
      conversionRate: total ? Math.round((enrolled / total) * 100) : 0,
      students: people.filter((p) => p.role === 'student').length,
      faculty: people.filter((p) => p.role === 'faculty').length,
      newThisWeek,
    };
  }, [enquiries, people]);

  const dailySeries = useMemo(() => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({ date: isoDate(d), label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), count: 0 });
    }
    const byDay = Object.fromEntries(days.map((d) => [d.date, d]));
    enquiries.forEach((e) => {
      const key = isoDate(new Date(e.created_at));
      if (byDay[key]) byDay[key].count += 1;
    });
    return days;
  }, [enquiries]);

  const byProgram = useMemo(() => {
    const counts = {};
    enquiries.forEach((e) => {
      const key = e.program || 'Not specified';
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name: name.length > 18 ? name.slice(0, 16) + '…' : name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [enquiries]);

  const byStatus = useMemo(() => {
    const counts = Object.fromEntries(STATUS_ORDER.map((s) => [s, 0]));
    enquiries.forEach((e) => {
      if (counts[e.status] !== undefined) counts[e.status] += 1;
    });
    return STATUS_ORDER.map((s) => ({ name: STATUS_LABELS[s], value: counts[s], key: s }));
  }, [enquiries]);

  const byCollege = useMemo(() => {
    const counts = {};
    enquiries.forEach((e) => {
      if (!e.college) return;
      counts[e.college] = (counts[e.college] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name: name.length > 20 ? name.slice(0, 18) + '…' : name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [enquiries]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slatesoft dark:text-white/50 text-sm">
        <Loader2 size={16} className="animate-spin" /> Loading…
      </div>
    );
  }
  if (error) return <p className="text-sm text-red-500">Couldn&rsquo;t load analytics: {error}</p>;

  if (stats.total === 0) {
    return (
      <div className="rounded-2xl border border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.04] p-10 text-center">
        <p className="text-navy dark:text-white font-semibold mb-1">No data yet</p>
        <p className="text-sm text-slatesoft dark:text-white/50">Charts fill in automatically once enquiries start coming in.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Enquiries" value={stats.total} icon={TrendingUp} />
        <StatCard label="Conversion Rate" value={`${stats.conversionRate}%`} icon={Target} sub="enrolled / total" />
        <StatCard label="Students" value={stats.students} icon={GraduationCap} />
        <StatCard label="Faculty" value={stats.faculty} icon={UserCog} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-5">
        <ChartCard title="Enquiries — last 30 days" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dailySeries} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="fillRoyal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1E5EFF" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#1E5EFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94A3B8' }} interval={4} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} allowDecimals={false} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid #eee' }} />
              <Area type="monotone" dataKey="count" stroke="#1E5EFF" strokeWidth={2} fill="url(#fillRoyal)" name="Enquiries" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Status breakdown">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={byStatus} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                {byStatus.map((entry) => (
                  <Cell key={entry.key} fill={STATUS_COLORS[entry.key]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid #eee' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center mt-1">
            {byStatus.map((s) => (
              <span key={s.key} className="inline-flex items-center gap-1.5 text-[11px] text-slatesoft dark:text-white/50">
                <span className="w-2 h-2 rounded-full" style={{ background: STATUS_COLORS[s.key] }} />
                {s.name} ({s.value})
              </span>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <ChartCard title="Top programs by interest">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={byProgram} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94A3B8' }} allowDecimals={false} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} width={110} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid #eee' }} />
              <Bar dataKey="count" fill="#1E5EFF" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top colleges">
          {byCollege.length === 0 ? (
            <div className="h-[220px] flex items-center justify-center text-sm text-slatesoft dark:text-white/40">
              No college data submitted yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={byCollege} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#94A3B8' }} allowDecimals={false} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} width={110} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid #eee' }} />
                <Bar dataKey="count" fill="#FBBF24" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </>
  );
}


function ChartCard({ title, children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.04] p-5 ${className}`}>
      <h3 className="text-sm font-semibold text-navy dark:text-white mb-4">{title}</h3>
      {children}
    </div>
  );
}

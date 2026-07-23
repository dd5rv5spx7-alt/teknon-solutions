import React, { useEffect, useMemo, useState } from 'react';
import {
  Users, GraduationCap, UserCog, UserX, Search, Plus, X, Loader2,
  Mail, Phone, ShieldCheck, Ban, RotateCcw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { supabase } from '../lib/supabaseClient.js';
import StatCard from '../components/admin/StatCard.jsx';
import useFocusTrap from '../components/admin/useFocusTrap.js';

const ROLE_META = {
  student: { label: 'Student', color: 'bg-royal/10 dark:bg-accent/15 text-royal dark:text-accent' },
  faculty: { label: 'Faculty', color: 'bg-gold/15 text-amber-600 dark:text-gold' },
};
const ROLE_TABS = ['all', 'student', 'faculty'];

export default function AdminPeople() {
  const { role: myRole, session } = useAuth();
  const isAdmin = myRole === 'admin';

  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    fetchPeople();
  }, []);

  function fetchPeople() {
    setLoading(true);
    supabase
      .from('profiles')
      .select('*')
      .in('role', ['student', 'faculty'])
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setPeople(data ?? []);
        setLoading(false);
      });
  }

  async function updatePerson(id, patch) {
    setUpdatingId(id);
    const { error } = await supabase.from('profiles').update(patch).eq('id', id);
    if (!error) setPeople((list) => list.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    setUpdatingId(null);
  }

  const stats = useMemo(
    () => ({
      total: people.length,
      students: people.filter((p) => p.role === 'student').length,
      faculty: people.filter((p) => p.role === 'faculty').length,
      inactive: people.filter((p) => p.status === 'inactive').length,
    }),
    [people]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return people.filter((p) => {
      const matchesRole = roleFilter === 'all' || p.role === roleFilter;
      const matchesSearch =
        !q || p.full_name?.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q) || p.phone?.toLowerCase().includes(q);
      return matchesRole && matchesSearch;
    });
  }, [people, search, roleFilter]);

  return (
    <>
      {!isAdmin && (
        <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-800 dark:text-amber-200 mb-8">
          You're signed in as faculty — you can view the roster, but only admins can add people or
          change roles/status.
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total" value={stats.total} icon={Users} />
        <StatCard label="Students" value={stats.students} icon={GraduationCap} />
        <StatCard label="Faculty" value={stats.faculty} icon={UserCog} />
        <StatCard label="Inactive" value={stats.inactive} icon={UserX} highlight={stats.inactive > 0} />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slatesoft dark:text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone…"
            aria-label="Search people"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-navy/10 dark:border-white/15 bg-white dark:bg-white/5 text-navy dark:text-white text-sm placeholder:text-slatesoft dark:placeholder:text-white/55 focus:border-royal/50"
          />
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-grad-primary text-white text-sm font-semibold hover:brightness-110 transition-all shrink-0"
          >
            <Plus size={15} /> Add Person
          </button>
        )}
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {ROLE_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setRoleFilter(tab)}
            aria-pressed={roleFilter === tab}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold font-mono uppercase tracking-wide transition-colors ${
              roleFilter === tab
                ? 'bg-royal text-white'
                : 'bg-white dark:bg-white/5 text-slatesoft dark:text-white/50 border border-navy/8 dark:border-white/10'
            }`}
          >
            {tab === 'all' ? 'All' : ROLE_META[tab].label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-slatesoft dark:text-white/50 text-sm">
          <Loader2 size={16} className="animate-spin" /> Loading…
        </div>
      )}
      {error && <p className="text-sm text-red-500">Couldn&rsquo;t load people: {error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <p className="text-sm text-slatesoft dark:text-white/50">No one matches.</p>
      )}

      {filtered.length > 0 && (
        <div className="rounded-2xl border border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.04] divide-y divide-navy/5 dark:divide-white/5 overflow-hidden">
          {filtered.map((p) => (
            <div key={p.id} className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-navy dark:text-white truncate">
                  {p.full_name || 'Unnamed'}
                  {p.status === 'inactive' && (
                    <span className="ml-2 text-[11px] font-mono text-red-500 align-middle">INACTIVE</span>
                  )}
                </p>
                <p className="text-xs text-slatesoft dark:text-white/50 truncate flex items-center gap-3 mt-0.5">
                  <span className="inline-flex items-center gap-1"><Mail size={11} /> {p.email || '—'}</span>
                  {p.phone && <span className="inline-flex items-center gap-1"><Phone size={11} /> {p.phone}</span>}
                </p>
              </div>
              <span className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold w-fit ${ROLE_META[p.role]?.color}`}>
                {ROLE_META[p.role]?.label ?? p.role}
              </span>
              {isAdmin && (
                <div className="flex flex-wrap gap-2 shrink-0">
                  <ActionBtn
                    icon={ShieldCheck}
                    label={p.role === 'faculty' ? 'Make student' : 'Make faculty'}
                    onClick={() => updatePerson(p.id, { role: p.role === 'faculty' ? 'student' : 'faculty' })}
                    disabled={updatingId === p.id}
                  />
                  {p.status === 'inactive' ? (
                    <ActionBtn icon={RotateCcw} label="Reactivate" onClick={() => updatePerson(p.id, { status: 'active' })} disabled={updatingId === p.id} />
                  ) : (
                    <ActionBtn icon={Ban} label="Deactivate" onClick={() => updatePerson(p.id, { status: 'inactive' })} disabled={updatingId === p.id} danger />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <AddPersonModal
          token={session?.access_token}
          onClose={() => setShowAdd(false)}
          onCreated={() => {
            setShowAdd(false);
            fetchPeople();
          }}
        />
      )}
    </>
  );
}

function AddPersonModal({ token, onClose, onCreated }) {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', role: 'student' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const dialogRef = useFocusTrap(onClose);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/admin/create-person', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Could not create the account.');
      onCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-person-title"
        className="w-full max-w-md rounded-3xl bg-white dark:bg-navy p-7 shadow-card-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 id="add-person-title" className="font-display font-bold text-lg text-navy dark:text-white">Add Person</h2>
          <button onClick={onClose} aria-label="Close" className="text-slatesoft dark:text-white/50 hover:text-navy dark:hover:text-white">
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-slatesoft dark:text-white/50 mb-5">
          They&rsquo;ll get an email invite to set their own password — you never see or handle it.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Full name">
            <input
              type="text"
              required
              value={form.full_name}
              onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
              className="modal-input"
              placeholder="Jane Doe"
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="modal-input"
              placeholder="jane@example.com"
            />
          </Field>
          <Field label="Phone (optional)">
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="modal-input"
              placeholder="+91 00000 00000"
            />
          </Field>
          <Field label="Role">
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              className="modal-input"
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
            </select>
          </Field>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="btn-glow w-full bg-grad-primary text-white font-semibold px-6 py-3 rounded-xl hover:brightness-110 transition-all disabled:opacity-60"
          >
            {submitting ? 'Sending invite…' : 'Send Invite'}
          </button>
        </form>
      </div>
    </div>
  );
}

// The label previously sat as a plain sibling of the control with no
// htmlFor/id or nesting — visually a label, but with no programmatic
// association a screen reader could use to announce it. Cloning the id onto
// the single input/select/textarea child (when there is one) restores that
// without touching every call site.
function Field({ label, children }) {
  const id = React.useId();
  const associable = React.isValidElement(children) && ['input', 'select', 'textarea'].includes(children.type);
  return (
    <div>
      <label htmlFor={associable ? id : undefined} className="block text-xs font-semibold text-navy dark:text-white mb-1.5">
        {label}
      </label>
      {associable ? React.cloneElement(children, { id }) : children}
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

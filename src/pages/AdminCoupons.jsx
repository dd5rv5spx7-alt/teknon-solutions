import React, { useEffect, useMemo, useState } from 'react';
import { Tag, Plus, X, Loader2, Search, Pencil, Trash2, Power } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { supabase } from '../lib/supabaseClient.js';
import useFocusTrap from '../components/admin/useFocusTrap.js';

const TIERS = [
  { value: 'starter', label: 'Starter' },
  { value: 'professional', label: 'Professional' },
  { value: 'advanced', label: 'Advanced' },
];

const EMPTY_FORM = {
  code: '',
  discount_type: 'percent',
  discount_value: '',
  applicable_tiers: [],
  usage_limit: '',
  expires_at: '',
};

function describeDiscount(c) {
  return c.discount_type === 'percent' ? `${c.discount_value}% off` : `₹${(c.discount_value / 100).toLocaleString('en-IN')} off`;
}

export default function AdminCoupons() {
  const { role: myRole } = useAuth();
  const isAdmin = myRole === 'admin';

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {...coupon} = edit

  useEffect(() => {
    fetchCoupons();
  }, []);

  function fetchCoupons() {
    setLoading(true);
    supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setCoupons(data ?? []);
        setLoading(false);
      });
  }

  async function toggleActive(coupon) {
    setUpdatingId(coupon.id);
    const { error: err } = await supabase.from('coupons').update({ active: !coupon.active }).eq('id', coupon.id);
    if (!err) setCoupons((list) => list.map((c) => (c.id === coupon.id ? { ...c, active: !c.active } : c)));
    else window.alert(`Couldn't update this coupon: ${err.message}`);
    setUpdatingId(null);
  }

  async function deleteCoupon(id) {
    if (!window.confirm('Delete this coupon? This cannot be undone — past orders that used it keep their own record either way.')) return;
    setUpdatingId(id);
    const { error: err } = await supabase.from('coupons').delete().eq('id', id);
    if (!err) setCoupons((list) => list.filter((c) => c.id !== id));
    else window.alert(`Couldn't delete this coupon: ${err.message}`);
    setUpdatingId(null);
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return coupons;
    return coupons.filter((c) => c.code?.toLowerCase().includes(q));
  }, [coupons, search]);

  return (
    <>
      {!isAdmin && (
        <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-800 dark:text-amber-200 mb-8">
          You're signed in as faculty — you can view coupons, but only admins can add, edit, or
          remove them.
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slatesoft dark:text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search code…"
            aria-label="Search coupons"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-navy/10 dark:border-white/15 bg-white dark:bg-white/5 text-navy dark:text-white text-sm placeholder:text-slatesoft dark:placeholder:text-white/55 focus:outline-hidden focus:border-royal/50"
          />
        </div>
        {isAdmin && (
          <button
            onClick={() => setEditing({ ...EMPTY_FORM })}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-grad-primary text-white text-sm font-semibold hover:brightness-110 transition-all shrink-0"
          >
            <Plus size={15} /> Add Coupon
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-slatesoft dark:text-white/50 text-sm">
          <Loader2 size={16} className="animate-spin" /> Loading…
        </div>
      )}
      {error && <p className="text-sm text-red-500">Couldn&rsquo;t load coupons: {error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <p className="text-sm text-slatesoft dark:text-white/50">No coupons match.</p>
      )}

      {filtered.length > 0 && (
        <div className="rounded-2xl border border-navy/8 dark:border-white/10 bg-white dark:bg-white/[0.04] divide-y divide-navy/5 dark:divide-white/5 overflow-hidden">
          {filtered.map((c) => (
            <div key={c.id} className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4">
              <div className="w-9 h-9 grid place-items-center rounded-lg bg-royal/10 dark:bg-accent/15 text-royal dark:text-accent shrink-0">
                <Tag size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-navy dark:text-white truncate font-mono">
                  {c.code}
                  {!c.active && (
                    <span className="ml-2 text-[11px] font-mono text-slatesoft dark:text-white/40 align-middle">INACTIVE</span>
                  )}
                </p>
                <p className="text-xs text-slatesoft dark:text-white/50 truncate">
                  {describeDiscount(c)}
                  {' · '}
                  {c.applicable_tiers?.length ? c.applicable_tiers.join(', ') : 'all programs'}
                  {' · '}
                  {c.usage_limit ? `${c.times_used}/${c.usage_limit} used` : `${c.times_used} used`}
                  {c.expires_at ? ` · expires ${new Date(c.expires_at).toLocaleDateString()}` : ''}
                </p>
              </div>
              {isAdmin && (
                <div className="flex flex-wrap gap-2 shrink-0">
                  <ActionBtn
                    icon={Power}
                    label={c.active ? 'Deactivate' : 'Activate'}
                    onClick={() => toggleActive(c)}
                    disabled={updatingId === c.id}
                  />
                  <ActionBtn icon={Pencil} label="Edit" onClick={() => setEditing(c)} disabled={updatingId === c.id} />
                  <ActionBtn icon={Trash2} label="Delete" onClick={() => deleteCoupon(c.id)} disabled={updatingId === c.id} danger />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {editing && (
        <CouponModal
          coupon={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            fetchCoupons();
          }}
        />
      )}
    </>
  );
}

function CouponModal({ coupon, onClose, onSaved }) {
  const isNew = !coupon.id;
  const [form, setForm] = useState({
    code: coupon.code || '',
    discount_type: coupon.discount_type || 'percent',
    // Stored in paise for 'amount' coupons — edited here as rupees for a human-friendly form.
    discount_value: coupon.discount_type === 'amount' ? (coupon.discount_value || 0) / 100 : coupon.discount_value || '',
    applicable_tiers: coupon.applicable_tiers || [],
    usage_limit: coupon.usage_limit ?? '',
    expires_at: coupon.expires_at ? coupon.expires_at.slice(0, 10) : '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const dialogRef = useFocusTrap(onClose);

  function toggleTier(tier) {
    setForm((f) => ({
      ...f,
      applicable_tiers: f.applicable_tiers.includes(tier)
        ? f.applicable_tiers.filter((t) => t !== tier)
        : [...f.applicable_tiers, tier],
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const discountValue =
      form.discount_type === 'amount' ? Math.round(parseFloat(form.discount_value) * 100) : parseInt(form.discount_value, 10);
    if (!discountValue || discountValue <= 0) {
      setError('Enter a discount value greater than 0.');
      setSubmitting(false);
      return;
    }
    const payload = {
      code: form.code.trim().toUpperCase(),
      discount_type: form.discount_type,
      discount_value: discountValue,
      applicable_tiers: form.applicable_tiers.length > 0 ? form.applicable_tiers : null,
      usage_limit: form.usage_limit === '' ? null : parseInt(form.usage_limit, 10),
      expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
    };
    const { error: err } = isNew
      ? await supabase.from('coupons').insert(payload)
      : await supabase.from('coupons').update(payload).eq('id', coupon.id);
    setSubmitting(false);
    if (err) setError(err.message);
    else onSaved();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="coupon-modal-title"
        className="w-full max-w-md rounded-3xl bg-white dark:bg-navy p-7 shadow-card-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 id="coupon-modal-title" className="font-display font-bold text-lg text-navy dark:text-white">
            {isNew ? 'Add Coupon' : 'Edit Coupon'}
          </h2>
          <button onClick={onClose} aria-label="Close" className="text-slatesoft dark:text-white/50 hover:text-navy dark:hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Code">
            <input
              type="text"
              required
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
              className="modal-input uppercase"
              placeholder="WELCOME10"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Discount type">
              <select
                value={form.discount_type}
                onChange={(e) => setForm((f) => ({ ...f, discount_type: e.target.value }))}
                className="modal-input"
              >
                <option value="percent">Percent off</option>
                <option value="amount">Amount off (₹)</option>
              </select>
            </Field>
            <Field label={form.discount_type === 'percent' ? 'Percent (1-100)' : 'Amount (₹)'}>
              <input
                type="number"
                required
                min="1"
                max={form.discount_type === 'percent' ? 100 : undefined}
                value={form.discount_value}
                onChange={(e) => setForm((f) => ({ ...f, discount_value: e.target.value }))}
                className="modal-input"
              />
            </Field>
          </div>
          <Field label="Applies to">
            <div className="flex flex-wrap gap-2">
              {TIERS.map((t) => (
                <label
                  key={t.value}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-colors ${
                    form.applicable_tiers.includes(t.value)
                      ? 'bg-royal text-white border-royal'
                      : 'border-navy/10 dark:border-white/15 text-navy dark:text-white'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.applicable_tiers.includes(t.value)}
                    onChange={() => toggleTier(t.value)}
                    className="sr-only"
                  />
                  {t.label}
                </label>
              ))}
            </div>
            <p className="text-[11px] text-slatesoft dark:text-white/40 mt-1.5">None selected = applies to every program.</p>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Usage limit">
              <input
                type="number"
                min="1"
                value={form.usage_limit}
                onChange={(e) => setForm((f) => ({ ...f, usage_limit: e.target.value }))}
                className="modal-input"
                placeholder="Unlimited"
              />
            </Field>
            <Field label="Expires">
              <input
                type="date"
                value={form.expires_at}
                onChange={(e) => setForm((f) => ({ ...f, expires_at: e.target.value }))}
                className="modal-input"
              />
            </Field>
          </div>

          {error && <p role="alert" className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="btn-glow w-full bg-grad-primary text-white font-semibold px-6 py-3 rounded-xl hover:brightness-110 transition-all disabled:opacity-60"
          >
            {submitting ? 'Saving…' : isNew ? 'Add Coupon' : 'Save Changes'}
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
// without touching every call site. The "Applies to" checkbox group's child
// is a <div>, not a single control, so it's left exactly as before.
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

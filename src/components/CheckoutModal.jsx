import React, { useEffect, useRef, useState } from 'react';
import { X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

let razorpayScriptPromise = null;
function loadRazorpayScript() {
  if (window.Razorpay) return Promise.resolve();
  if (!razorpayScriptPromise) {
    razorpayScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = resolve;
      script.onerror = () => {
        razorpayScriptPromise = null; // allow a retry on the next attempt
        reject(new Error('Could not load the payment widget. Check your connection and try again.'));
      };
      document.body.appendChild(script);
    });
  }
  return razorpayScriptPromise;
}

// Matches the transition-duration below — kept in one place so the
// setTimeout that actually unmounts the modal can't drift out of sync with
// the CSS and cut the exit animation off mid-way.
const TRANSITION_MS = 200;

// tier: 'starter' | 'professional' | 'advanced' — must match api/_lib/pricing.js keys.
export default function CheckoutModal({ tier, tierLabel, priceDisplay, onClose }) {
  const [step, setStep] = useState('form'); // form | processing | success | error
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false); // drives the fade/scale transition

  const dialogRef = useRef(null);
  const previouslyFocused = useRef(null);

  // Two rAFs (not one): the first lets the initial "hidden" class actually
  // paint before the second flips it to "visible" — collapsing to a single
  // rAF risks the browser batching both class states into one frame, which
  // skips the transition entirely on some devices.
  useEffect(() => {
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf2);
    });
    return () => cancelAnimationFrame(raf1);
  }, []);

  // Plays the exit transition, then calls the real onClose once it's done —
  // the parent unmounts this component immediately on that call, so the
  // fade/scale-out has to happen before it, not after.
  function requestClose() {
    setVisible(false);
    setTimeout(onClose, TRANSITION_MS);
  }

  useEffect(() => {
    previouslyFocused.current = document.activeElement;
    const focusable = dialogRef.current.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
    focusable[0]?.focus();

    function handleKeyDown(e) {
      if (e.key === 'Escape' && step !== 'processing') {
        requestClose();
        return;
      }
      if (e.key === 'Tab' && focusable.length > 0) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused.current?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // aria-modal="true" isn't reliably enough on its own to keep a screen
  // reader's virtual cursor out of content behind the dialog — inert on the
  // page root enforces it, matching the same fix applied to Navbar's mobile
  // menu.
  useEffect(() => {
    const root = document.getElementById('site-root');
    if (root) root.inert = true;
    return () => {
      if (root) root.inert = false;
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setStep('processing');

    try {
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, name, email, phone }),
      });
      const order = await orderRes.json();
      if (!orderRes.ok || !order.ok) {
        setError(order.error || 'Could not start checkout. Please try again.');
        setStep('form');
        return;
      }

      await loadRazorpayScript();

      const razorpay = new window.Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        name: 'A Teknon Solutions',
        description: tierLabel,
        prefill: { name, email, contact: phone },
        theme: { color: '#1E5EFF' },
        handler: async (response) => {
          try {
            // Only the signed order/payment IDs go here — verify-payment.js
            // deliberately ignores tier/name/email/phone from the request
            // body and re-derives them from Razorpay's own order record, so
            // there's nothing to gain by sending them (and nothing lost by
            // not sending them).
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verify = await verifyRes.json();
            if (verifyRes.ok && verify.ok) {
              setStep('success');
            } else {
              setError("Payment went through, but we couldn't confirm it automatically. We'll follow up by email shortly.");
              setStep('error');
            }
          } catch {
            setError("Payment went through, but we couldn't confirm it automatically. We'll follow up by email shortly.");
            setStep('error');
          }
        },
        modal: {
          ondismiss: () => setStep('form'),
        },
      });

      razorpay.on('payment.failed', () => {
        setError('Payment failed or was declined. No charge was made — you can try again.');
        setStep('error');
      });

      razorpay.open();
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setStep('form');
    }
  }

  return (
    <div
      className={`fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4 transition-opacity duration-200 ease-out ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={step !== 'processing' ? requestClose : undefined}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-modal-title"
        className={`w-full max-w-sm rounded-3xl bg-white dark:bg-navy p-7 shadow-card-lg transition-all duration-200 ease-out ${
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 id="checkout-modal-title" className="font-display font-bold text-lg text-navy dark:text-white">
            {step === 'success' ? 'Payment confirmed' : `Enroll — ${tierLabel}`}
          </h2>
          {step !== 'processing' && (
            <button onClick={requestClose} aria-label="Close" className="text-slatesoft dark:text-white/50 hover:text-navy dark:hover:text-white">
              <X size={18} />
            </button>
          )}
        </div>

        {step === 'success' ? (
          <div className="text-center py-4">
            <CheckCircle2 size={40} className="mx-auto text-emerald-500 mb-3" />
            <p className="text-sm text-navy dark:text-white/80">
              You&rsquo;re all set — a receipt is on its way to <b>{email}</b>. Our team will reach
              out shortly with your batch details.
            </p>
            <button
              onClick={requestClose}
              className="btn-glow w-full mt-6 bg-grad-primary text-white font-semibold px-6 py-3 rounded-xl hover:brightness-110 transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-slatesoft dark:text-white/60">
              {priceDisplay} for the {tierLabel} program. Enter your details to continue to secure
              payment.
            </p>

            <div>
              <label htmlFor="checkout-name" className="block text-xs font-semibold text-navy dark:text-white mb-1.5">
                Full name
              </label>
              <input
                id="checkout-name"
                type="text"
                required
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={step === 'processing'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-navy/10 dark:border-white/15 bg-mist dark:bg-white/5 text-navy dark:text-white text-sm focus:border-royal/50 disabled:opacity-50"
              />
            </div>
            <div>
              <label htmlFor="checkout-email" className="block text-xs font-semibold text-navy dark:text-white mb-1.5">
                Email
              </label>
              <input
                id="checkout-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={step === 'processing'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-navy/10 dark:border-white/15 bg-mist dark:bg-white/5 text-navy dark:text-white text-sm focus:border-royal/50 disabled:opacity-50"
              />
            </div>
            <div>
              <label htmlFor="checkout-phone" className="block text-xs font-semibold text-navy dark:text-white mb-1.5">
                Phone
              </label>
              <input
                id="checkout-phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={step === 'processing'}
                placeholder="+91 00000 00000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-navy/10 dark:border-white/15 bg-mist dark:bg-white/5 text-navy dark:text-white text-sm focus:border-royal/50 disabled:opacity-50"
              />
            </div>

            {error && (
              <div role="alert" className="flex gap-2 rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-xs text-red-600 dark:text-red-300">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={step === 'processing'}
              className="btn-glow w-full bg-grad-primary text-white font-semibold px-6 py-3 rounded-xl hover:brightness-110 transition-all disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {step === 'processing' && <Loader2 size={16} className="animate-spin" />}
              {step === 'processing' ? 'Opening secure checkout…' : `Pay ${priceDisplay}`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

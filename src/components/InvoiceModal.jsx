import React, { useEffect, useState } from 'react';
import { X, Printer } from 'lucide-react';
import useFocusTrap from './admin/useFocusTrap.js';

// Mirrors api/_lib/gst.js exactly — duplicated because this renders
// client-side and the invoice must display correctly even if the payment
// row's own invoice_number/tax split was computed server-side at a
// different SAC/rate (e.g. an old payment from before a rate change). If
// your accountant says the rate or SAC code should differ, update BOTH
// this file and api/_lib/gst.js together.
const SAC_CODE = '999293';
const GST_RATE_PERCENT = 18;
const SELLER_STATE_CODE = '37'; // Andhra Pradesh

function computeGstSplit(amount, gstin, billingState) {
  const gstinStateCode = gstin ? String(gstin).slice(0, 2) : null;
  const stateCode = gstinStateCode || billingState || null;
  const isIntraState = stateCode === SELLER_STATE_CODE;
  const baseAmount = Math.round((amount * 100) / (100 + GST_RATE_PERCENT));
  const totalTax = amount - baseAmount;
  if (isIntraState) {
    const half = Math.round(totalTax / 2);
    return { baseAmount, cgst: half, sgst: totalTax - half, igst: 0, isIntraState: true };
  }
  return { baseAmount, cgst: 0, sgst: 0, igst: totalTax, isIntraState: false };
}

function rupees(paise) {
  return `₹${(paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const TIER_LABELS = {
  starter: 'Starter Program (2 weeks)',
  professional: 'Professional Program (4 weeks)',
  advanced: 'Advanced Program (8 weeks)',
};

export default function InvoiceModal({ payment, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf2);
    });
    return () => cancelAnimationFrame(raf1);
  }, []);

  function requestClose() {
    setVisible(false);
    setTimeout(onClose, 200);
  }

  const dialogRef = useFocusTrap(requestClose);

  const netAmount = payment.amount - (payment.refunded_amount || 0);
  const split = computeGstSplit(netAmount, payment.gstin, payment.billing_state);

  return (
    <div
      className={`fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4 transition-opacity duration-200 ease-out ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={requestClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="invoice-modal-title"
        className={`w-full max-w-lg rounded-3xl bg-white dark:bg-navy p-7 shadow-card-lg max-h-[90vh] overflow-y-auto transition-all duration-200 ease-out ${
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 id="invoice-modal-title" className="font-display font-bold text-lg text-navy dark:text-white">
            Invoice {payment.invoice_number || '(pending)'}
          </h2>
          <button onClick={requestClose} aria-label="Close" className="text-slatesoft dark:text-white/50 hover:text-navy dark:hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="print-area rounded-2xl border border-navy/10 dark:border-white/15 p-6 text-sm text-navy dark:text-white bg-white dark:bg-navy">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="font-display font-extrabold text-lg">A TEKNON SOLUTIONS</p>
              <p className="text-xs text-slatesoft dark:text-white/50 mt-1">
                Rajahmundry, Andhra Pradesh, India
                <br />
                info@ateknonsolutions.com
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-slatesoft dark:text-white/50">Tax Invoice</p>
              <p className="font-mono text-sm font-semibold mt-1">{payment.invoice_number || '—'}</p>
              <p className="text-xs text-slatesoft dark:text-white/50 mt-1">{new Date(payment.created_at).toLocaleDateString('en-IN')}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-navy/10 dark:border-white/15">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slatesoft dark:text-white/40 mb-1">Billed to</p>
              <p className="font-medium">{payment.billing_name || payment.name}</p>
              {payment.billing_address && <p className="text-xs text-slatesoft dark:text-white/50 whitespace-pre-wrap">{payment.billing_address}</p>}
              <p className="text-xs text-slatesoft dark:text-white/50">{payment.email}</p>
              {payment.gstin && <p className="text-xs text-slatesoft dark:text-white/50">GSTIN: {payment.gstin}</p>}
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wide text-slatesoft dark:text-white/40 mb-1">Payment reference</p>
              <p className="text-xs font-mono text-slatesoft dark:text-white/50">{payment.razorpay_payment_id}</p>
              <p className="text-[11px] uppercase tracking-wide text-slatesoft dark:text-white/40 mt-2 mb-1">HSN/SAC</p>
              <p className="text-xs font-mono text-slatesoft dark:text-white/50">{SAC_CODE}</p>
            </div>
          </div>

          <table className="w-full text-xs mb-6">
            <thead>
              <tr className="text-left text-slatesoft dark:text-white/40 uppercase tracking-wide">
                <th className="pb-2 font-medium">Description</th>
                <th className="pb-2 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-navy/10 dark:border-white/15">
                <td className="py-2.5">{TIER_LABELS[payment.tier] || payment.tier}</td>
                <td className="py-2.5 text-right">{rupees(split.baseAmount)}</td>
              </tr>
              {payment.discount_amount > 0 && (
                <tr className="border-t border-navy/10 dark:border-white/15 text-emerald-600 dark:text-emerald-400">
                  <td className="py-2.5">Coupon discount {payment.coupon_code ? `(${payment.coupon_code})` : ''}</td>
                  <td className="py-2.5 text-right">included above</td>
                </tr>
              )}
              {split.isIntraState ? (
                <>
                  <tr className="border-t border-navy/10 dark:border-white/15">
                    <td className="py-2.5 text-slatesoft dark:text-white/50">CGST @ {(GST_RATE_PERCENT / 2).toFixed(1)}%</td>
                    <td className="py-2.5 text-right">{rupees(split.cgst)}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-slatesoft dark:text-white/50">SGST @ {(GST_RATE_PERCENT / 2).toFixed(1)}%</td>
                    <td className="py-2.5 text-right">{rupees(split.sgst)}</td>
                  </tr>
                </>
              ) : (
                <tr className="border-t border-navy/10 dark:border-white/15">
                  <td className="py-2.5 text-slatesoft dark:text-white/50">IGST @ {GST_RATE_PERCENT}%</td>
                  <td className="py-2.5 text-right">{rupees(split.igst)}</td>
                </tr>
              )}
              <tr className="border-t-2 border-navy/20 dark:border-white/25 font-semibold">
                <td className="py-2.5">Total</td>
                <td className="py-2.5 text-right">{rupees(netAmount)}</td>
              </tr>
            </tbody>
          </table>

          {payment.refunded_amount > 0 && (
            <p className="text-xs text-amber-600 dark:text-gold mb-4">
              {rupees(payment.refunded_amount)} of the original {rupees(payment.amount)} charged has been refunded; the total above
              reflects the net amount retained.
            </p>
          )}

          <p className="text-[11px] text-slatesoft dark:text-white/40 text-center pt-4 border-t border-navy/10 dark:border-white/15">
            This is a computer-generated invoice. GST rate and SAC code shown are indicative — please confirm with your accountant
            if this invoice is being used for input tax credit claims.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-grad-primary text-white text-sm font-semibold hover:brightness-110 transition-all"
        >
          <Printer size={15} /> Print / Save as PDF
        </button>
      </div>
    </div>
  );
}

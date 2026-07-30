import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { X, GraduationCap, Briefcase } from 'lucide-react';

// Matches the transition-duration below — kept in one place so the
// setTimeout that actually unmounts the modal can't drift out of sync with
// the CSS and cut the exit animation off mid-way.
const TRANSITION_MS = 200;

export default function ChooserModal({ onClose }) {
  const [visible, setVisible] = useState(false); // drives the fade/scale transition
  const navigate = useNavigate();

  const dialogRef = useRef(null);
  const previouslyFocused = useRef(null);
  const initialFocusRef = useRef(null);

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
  // fade/scale-out has to happen before it, not after. This modal must never
  // stall a user who wants out, so every dismissal path routes through here
  // with zero extra delay or confirmation.
  function requestClose() {
    setVisible(false);
    setTimeout(onClose, TRANSITION_MS);
  }

  function handleLearn() {
    onClose();
  }

  function handleHire() {
    navigate('/it-solutions');
    onClose();
  }

  useEffect(() => {
    previouslyFocused.current = document.activeElement;
    // Focus the "I want to learn" option, not the first-in-DOM close button
    // — it's the lower-commitment primary path and should be the default
    // landing spot for keyboard and screen-reader users alike.
    initialFocusRef.current?.focus();

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        requestClose();
        return;
      }
      // Queried fresh on every Tab press, not the list captured at mount —
      // a stale list would trap Tab on whatever was focusable on the very
      // first render forever.
      if (e.key === 'Tab') {
        const focusable = dialogRef.current.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
        if (focusable.length === 0) return;
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
  }, []);

  // aria-modal="true" isn't reliably enough on its own to keep a screen
  // reader's virtual cursor out of content behind the dialog — inert on the
  // page root enforces it, matching the same fix applied to CheckoutModal
  // and Navbar's mobile menu.
  useEffect(() => {
    const root = document.getElementById('site-root');
    if (root) root.inert = true;
    return () => {
      if (root) root.inert = false;
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return createPortal(
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
        aria-labelledby="chooser-modal-title"
        className={`w-full max-w-2xl rounded-3xl bg-white dark:bg-navy-deep p-7 sm:p-8 shadow-card-lg transition-all duration-200 ease-out ${
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-2">
          <h2 id="chooser-modal-title" className="font-display font-bold text-xl sm:text-2xl text-navy dark:text-white">
            Welcome to A Teknon Solutions
          </h2>
          <button onClick={requestClose} aria-label="Close" className="shrink-0 text-slatesoft dark:text-white/50 hover:text-navy dark:hover:text-white">
            <X size={18} />
          </button>
        </div>
        <p className="text-sm text-slatesoft dark:text-white/60 mb-6">
          Tell us why you&rsquo;re here, so we can point you the right way.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex flex-col rounded-2xl border border-navy/10 dark:border-white/15 p-5">
            <div className="w-11 h-11 rounded-xl grid place-items-center bg-royal/10 dark:bg-accent/15 text-royal dark:text-accent mb-4">
              <GraduationCap size={20} />
            </div>
            <h3 className="font-display font-semibold text-navy dark:text-white mb-1.5">I want to learn</h3>
            <p className="text-sm text-slatesoft dark:text-white/60 mb-5 grow">
              IT internships, training programs, and certification courses.
            </p>
            <button
              type="button"
              ref={initialFocusRef}
              onClick={handleLearn}
              className="btn-glow w-full bg-grad-primary text-white font-semibold px-6 py-3 rounded-xl hover:brightness-110 transition-all"
            >
              Explore Programs
            </button>
          </div>

          <div className="flex flex-col rounded-2xl border border-navy/10 dark:border-white/15 p-5">
            <div className="w-11 h-11 rounded-xl grid place-items-center bg-royal/10 dark:bg-accent/15 text-royal dark:text-accent mb-4">
              <Briefcase size={20} />
            </div>
            <h3 className="font-display font-semibold text-navy dark:text-white mb-1.5">I want to hire</h3>
            <p className="text-sm text-slatesoft dark:text-white/60 mb-5 grow">
              Website &amp; software development, cybersecurity, cloud/DevOps, and more — for your
              business.
            </p>
            <button
              type="button"
              onClick={handleHire}
              className="w-full border border-navy/15 dark:border-white/20 text-navy dark:text-white font-semibold px-6 py-3 rounded-xl hover:border-royal/40 dark:hover:border-accent/40 hover:text-royal dark:hover:text-accent transition-colors"
            >
              View IT Solutions
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={requestClose}
          className="block mx-auto mt-6 text-sm font-medium text-slatesoft dark:text-white/50 hover:text-navy dark:hover:text-white transition-colors"
        >
          Skip — I&rsquo;ll look around
        </button>
      </div>
    </div>,
    document.body
  );
}

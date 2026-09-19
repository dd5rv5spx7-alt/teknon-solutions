import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { X, GraduationCap, Briefcase, Megaphone, TrendingUp } from 'lucide-react';

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
  function setSeen() {
    try {
      sessionStorage.setItem('ats_chooser_seen', 'true');
    } catch {
      // Ignore private-browsing storage quota errors
    }
  }

  function requestClose() {
    setSeen();
    setVisible(false);
    setTimeout(onClose, TRANSITION_MS);
  }

  function handleLearn() {
    setSeen();
    onClose();
  }

  function handleHire() {
    setSeen();
    navigate('/it-solutions');
    onClose();
  }

  function handleDigitalMarketing() {
    setSeen();
    navigate('/digital-marketing');
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
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, []);

  return createPortal(
    <div
      className={`fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-4 bg-navy-deep/80 dark:bg-black/85 backdrop-blur-sm overflow-hidden touch-none transition-opacity duration-200 ease-out ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={requestClose}
      onTouchMove={(e) => {
        if (e.target === e.currentTarget) e.preventDefault();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="chooser-modal-title"
        className={`relative flex flex-col w-full max-w-[calc(100vw-24px)] sm:max-w-xl md:max-w-2xl max-h-[88dvh] max-h-[88vh] rounded-2xl sm:rounded-3xl bg-white dark:bg-navy-deep border border-navy/10 dark:border-white/10 shadow-2xl overflow-hidden transition-all duration-200 ease-out box-border min-w-0 ${
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header — ALWAYS Visible & Never Scrolls */}
        <div className="shrink-0 p-3.5 sm:p-5 border-b border-navy/5 dark:border-white/10 bg-white dark:bg-navy-deep z-10 flex items-start justify-between gap-2.5">
          <div className="min-w-0 flex-1">
            <h2
              id="chooser-modal-title"
              className="font-display font-extrabold uppercase tracking-tight text-xs sm:text-base md:text-lg text-navy dark:text-white leading-tight"
            >
              Welcome to ATS Group of Companies
            </h2>
            <p className="text-[11px] sm:text-xs md:text-sm text-slatesoft dark:text-white/70 mt-1 leading-normal">
              Tell us why you&rsquo;re here, so we can point you in the right direction.
            </p>
          </div>

          <button
            type="button"
            onClick={requestClose}
            aria-label="Close dialog"
            className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-navy/5 dark:bg-white/10 flex items-center justify-center text-navy/70 dark:text-white/70 hover:text-navy dark:hover:text-white hover:bg-navy/10 dark:hover:bg-white/15 transition-colors focus-visible:ring-2 focus-visible:ring-royal"
          >
            <X size={15} />
          </button>
        </div>

        {/* Scrollable Card Content Area — Only this area scrolls if viewport is small */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-3 sm:p-5 space-y-2 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-3.5 touch-pan-y min-w-0">
          {/* Card 1: Learn */}
          <div className="min-w-0 flex flex-col justify-between rounded-xl sm:rounded-2xl border border-navy/10 dark:border-white/15 p-3 sm:p-4 bg-navy/[0.01] dark:bg-white/[0.02] hover:border-royal/30 transition-all">
            <div>
              <div className="flex items-center gap-2 sm:block sm:mb-2.5">
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl grid place-items-center bg-royal/10 dark:bg-accent/15 text-royal dark:text-accent shrink-0">
                  <GraduationCap size={16} className="sm:w-5 sm:h-5" />
                </div>
                <h3 className="font-display font-bold uppercase tracking-wider text-xs sm:text-sm text-navy dark:text-white truncate">
                  I Want to Learn
                </h3>
              </div>
              <p className="text-[11px] sm:text-xs text-slatesoft dark:text-white/65 mt-1 sm:mt-1.5 mb-2.5 sm:mb-4 leading-relaxed">
                IT internships, training programs and technology courses.
              </p>
            </div>
            <button
              type="button"
              ref={initialFocusRef}
              onClick={handleLearn}
              className="btn-glow w-full bg-grad-primary text-white font-semibold py-1.5 sm:py-2 px-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm hover:brightness-110 transition-all text-center tracking-wide"
            >
              Explore Programs
            </button>
          </div>

          {/* Card 2: Grow Online */}
          <div className="min-w-0 relative flex flex-col justify-between rounded-xl sm:rounded-2xl border border-royal/30 dark:border-accent/35 p-3 sm:p-4 bg-royal/[0.03] dark:bg-accent/[0.04] ring-1 ring-royal/15 dark:ring-accent/20 hover:border-royal/50 transition-all">
            <div>
              <div className="flex items-center justify-between gap-1.5 mb-1 sm:mb-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl grid place-items-center bg-royal/10 dark:bg-accent/15 text-royal dark:text-accent shrink-0">
                    <Megaphone size={16} className="sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="font-display font-bold uppercase tracking-wider text-xs sm:text-sm text-navy dark:text-white truncate">
                    I Want to Grow Online
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-grad-primary text-white text-[9px] font-bold tracking-wider uppercase shadow-sm whitespace-nowrap shrink-0">
                  <TrendingUp size={9} /> High Demand
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slatesoft dark:text-white/65 mt-1 sm:mt-1.5 mb-2.5 sm:mb-4 leading-relaxed">
                Digital marketing, social media, content creation, websites &amp; branding.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDigitalMarketing}
              className="btn-glow w-full bg-grad-primary text-white font-semibold py-1.5 sm:py-2 px-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm hover:brightness-110 transition-all text-center tracking-wide"
            >
              Digital Marketing
            </button>
          </div>

          {/* Card 3: Hire */}
          <div className="min-w-0 flex flex-col justify-between rounded-xl sm:rounded-2xl border border-navy/10 dark:border-white/15 p-3 sm:p-4 bg-navy/[0.01] dark:bg-white/[0.02] hover:border-royal/30 transition-all">
            <div>
              <div className="flex items-center gap-2 sm:block sm:mb-2.5">
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl grid place-items-center bg-royal/10 dark:bg-accent/15 text-royal dark:text-accent shrink-0">
                  <Briefcase size={16} className="sm:w-5 sm:h-5" />
                </div>
                <h3 className="font-display font-bold uppercase tracking-wider text-xs sm:text-sm text-navy dark:text-white truncate">
                  I Want to Hire
                </h3>
              </div>
              <p className="text-[11px] sm:text-xs text-slatesoft dark:text-white/65 mt-1 sm:mt-1.5 mb-2.5 sm:mb-4 leading-relaxed">
                Web development, IT solutions, cybersecurity and technology services.
              </p>
            </div>
            <button
              type="button"
              onClick={handleHire}
              className="w-full border border-navy/15 dark:border-white/20 text-navy dark:text-white font-semibold py-1.5 sm:py-2 px-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm hover:border-royal/40 dark:hover:border-accent/40 hover:text-royal dark:hover:text-accent transition-colors text-center tracking-wide"
            >
              View IT Solutions
            </button>
          </div>
        </div>

        {/* Sticky Footer — ALWAYS Accessible */}
        <div className="shrink-0 p-2.5 sm:p-3.5 border-t border-navy/5 dark:border-white/10 bg-white dark:bg-navy-deep text-center z-10">
          <button
            type="button"
            onClick={requestClose}
            className="inline-block text-xs sm:text-sm font-medium text-slatesoft dark:text-white/50 hover:text-navy dark:hover:text-white transition-colors py-1 px-3 rounded-lg"
          >
            Skip — I&rsquo;ll look around
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

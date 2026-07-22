import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = 'input, select, textarea, button, [href], [tabindex]:not([tabindex="-1"])';

// Was reimplemented independently in nearly every admin modal (Courses,
// Certificates, Blog, Coupons, People, Batches, Payments, CourseContent) —
// two of those copies had already drifted to Escape-only (no Tab wrap), and
// two more modals (AdminAssignments) had no focus trapping at all. One
// shared hook so "Escape closes, Tab wraps, focus returns to the trigger"
// can't drift per-modal again.
export default function useFocusTrap(onClose) {
  const dialogRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    previouslyFocused.current = document.activeElement;
    dialogRef.current?.querySelector(FOCUSABLE_SELECTOR)?.focus();

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      // Queried fresh on every Tab press rather than cached at mount —
      // a couple of these dialogs render their real fields only after an
      // async fetch resolves, and a list captured once would trap Tab on
      // whatever was focusable before that (usually just the close button)
      // forever.
      const focusable = dialogRef.current.querySelectorAll(FOCUSABLE_SELECTOR);
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

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused.current?.focus?.();
    };
  }, [onClose]);

  return dialogRef;
}

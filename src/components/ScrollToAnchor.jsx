import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToAnchor
 * Ensures cross-page navigation with hash anchors (e.g. /digital-marketing -> /#programs)
 * smoothly scrolls to the target element, and route changes without hashes scroll to top.
 */
export default function ScrollToAnchor() {
  const { pathname, hash } = useLocation();
  const lastPath = useRef(pathname);

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '');
      let attempts = 0;
      const maxAttempts = 10;

      const scrollToElement = () => {
        const element = document.getElementById(targetId) || document.querySelector(hash);
        if (element) {
          // Account for fixed header height (80px)
          const headerOffset = 84;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: 'smooth',
          });
        } else if (attempts < maxAttempts) {
          attempts += 1;
          setTimeout(scrollToElement, 60);
        }
      };

      // Start scroll attempt after brief paint frame
      requestAnimationFrame(scrollToElement);
    } else if (pathname !== lastPath.current) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }

    lastPath.current = pathname;
  }, [pathname, hash]);

  return null;
}

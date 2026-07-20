import { useEffect, useRef, useState } from 'react';

/**
 * Returns a ref to attach to an element, and a boolean that flips to true
 * once the element scrolls into the viewport. Stays true afterwards
 * (reveal animations shouldn't replay every time you scroll past).
 */
export default function useInView(options = {}) {
  const { threshold = 0.15, rootMargin = '0px 0px -80px 0px' } = options;
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, isInView];
}

import { useEffect, useRef, useState } from 'react';

/**
 * Animates a number from 0 up to `end` once `start` is true.
 * Used to drive the stats counters when they scroll into view.
 */
export default function useCountUp(end, { start = false, duration = 1600 } = {}) {
  const [value, setValue] = useState(0);
  const frameRef = useRef(null);
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (!start || hasRunRef.current) return undefined;
    hasRunRef.current = true;

    const startTime = performance.now();
    const numericEnd = Number(end) || 0;

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      setValue(Math.round(numericEnd * eased));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setValue(numericEnd);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [start, end, duration]);

  return value;
}

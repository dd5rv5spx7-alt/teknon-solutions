import { useEffect, useState } from 'react';

/**
 * Types out each string in `strings`, one character at a time.
 * If loop is true, it pauses, deletes, and moves to the next string forever.
 * If loop is false, it types the final string in the array and stops (cursor stays put).
 */
export default function useTypewriter(
  strings,
  { loop = true, typingSpeed = 45, deletingSpeed = 25, pauseTime = 1600, startDelay = 300 } = {}
) {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [startDelay]);

  useEffect(() => {
    if (!started || !strings || strings.length === 0) return undefined;

    const current = strings[index % strings.length];
    const isLastString = index === strings.length - 1;

    let timeout;

    if (!isDeleting && text.length < current.length) {
      timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), typingSpeed);
    } else if (!isDeleting && text.length === current.length) {
      if (!loop && isLastString) {
        return undefined; // done — stop here, cursor keeps blinking via CSS
      }
      timeout = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && text.length > 0) {
      timeout = setTimeout(() => setText(current.slice(0, text.length - 1)), deletingSpeed);
    } else if (isDeleting && text.length === 0) {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % strings.length);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, index, started, strings, loop, typingSpeed, deletingSpeed, pauseTime]);

  return text;
}

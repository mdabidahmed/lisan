import { useEffect, useState } from 'react';

/**
 * Trailing-edge debounce for derived values (search terms, filters).
 * Keeps expensive list filtering and future server round-trips off the keystroke path.
 *
 * A non-positive `delayMs` passes the value straight through rather than scheduling a timer, so
 * tests and reduced-latency call sites do not pay for an extra render.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    if (delayMs <= 0) return;

    const timer = window.setTimeout(() => {
      setDebounced(value);
    }, delayMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [value, delayMs]);

  return delayMs <= 0 ? value : debounced;
}

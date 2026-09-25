import { useEffect } from 'react';

/**
 * Prevents background scrolling behind a drawer or modal, compensating for the scrollbar width so
 * the page does not shift.
 */
export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    const { body, documentElement } = document;
    const previousOverflow = body.style.overflow;
    const previousPaddingInlineEnd = body.style.paddingInlineEnd;
    // Clamped: a 0-width `clientWidth` (jsdom, some embedded webviews) would otherwise pad the
    // body by the full viewport width.
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
    const compensation = scrollbarWidth > 0 && scrollbarWidth <= 40 ? scrollbarWidth : 0;

    body.style.overflow = 'hidden';
    if (compensation > 0) {
      body.style.paddingInlineEnd = `${compensation}px`;
    }

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingInlineEnd = previousPaddingInlineEnd;
    };
  }, [locked]);
}

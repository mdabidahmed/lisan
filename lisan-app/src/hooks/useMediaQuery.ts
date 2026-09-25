import { useCallback, useSyncExternalStore } from 'react';

import { MEDIA } from '@/constants/breakpoints';

/**
 * Subscribes to a media query with `useSyncExternalStore`, so there is no flash of the wrong
 * layout and no state update during render.
 *
 * Responsive layout in Lisan is CSS-first: the sidebar becomes a drawer, the bottom nav appears and
 * the grids reflow entirely in `*.module.css` against the same breakpoints `MEDIA` names. JavaScript
 * only needs a media query where JavaScript has to branch — which today is the theme resolver
 * below, and `NavDrawer` closing itself when the viewport grows past the drawer breakpoint.
 *
 * There were once `useIsMobile`, `useIsBelowDesktop` and `usePrefersReducedMotion` wrappers here as
 * well. None had a call site, and offering them implied a JS-driven responsive strategy that the
 * stylesheets do not use; reduced motion in particular is handled by `@media` plus the
 * `data-motion` override `ThemeProvider` writes, not by re-rendering. Each is one line to bring
 * back when something genuinely needs to branch in JS.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof window.matchMedia !== 'function') return () => undefined;
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => {
        list.removeEventListener('change', onChange);
      };
    },
    [query],
  );

  const getSnapshot = useCallback(() => {
    if (typeof window.matchMedia !== 'function') return false;
    return window.matchMedia(query).matches;
  }, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/** Read by `ThemeProvider` to resolve the `system` theme preference. */
export function usePrefersDarkScheme(): boolean {
  return useMediaQuery(MEDIA.darkScheme);
}

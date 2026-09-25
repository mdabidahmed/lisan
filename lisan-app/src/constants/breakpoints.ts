/**
 * Breakpoints (product spec §33). CSS uses the literal media queries below; JS reads the same
 * values through `useMediaQuery` so the two can never drift.
 */
export const BREAKPOINTS = {
  /** Small phones — the layout must not scroll horizontally at this width. */
  xs: 320,
  sm: 480,
  /** Tablet and up. Below this the sidebar becomes a drawer + bottom nav. */
  md: 768,
  lg: 1024,
  /** Desktop. */
  xl: 1280,
  '2xl': 1440,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

export const MEDIA = {
  belowTablet: `(max-width: ${BREAKPOINTS.md - 1}px)`,
  tabletUp: `(min-width: ${BREAKPOINTS.md}px)`,
  belowDesktop: `(max-width: ${BREAKPOINTS.lg - 1}px)`,
  desktopUp: `(min-width: ${BREAKPOINTS.lg}px)`,
  wideUp: `(min-width: ${BREAKPOINTS.xl}px)`,
  reducedMotion: '(prefers-reduced-motion: reduce)',
  darkScheme: '(prefers-color-scheme: dark)',
} as const;

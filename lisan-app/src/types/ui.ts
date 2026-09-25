/** Shared vocabulary for component APIs. Keeps prop unions identical across the design system. */

export type Size = 'sm' | 'md' | 'lg';

export type ControlSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Accent hues available as design tokens (`--color-accent-<name>` and `-soft`).
 * `Category['color']` may reference one of these names instead of a raw hex value.
 */
export const ACCENT_COLORS = [
  'blue',
  'green',
  'orange',
  'purple',
  'pink',
  'teal',
  'indigo',
  'amber',
  'red',
  'cyan',
] as const;

export type AccentColor = (typeof ACCENT_COLORS)[number];

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export type BadgeVariant =
  'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'purple';

export type LoadStatus = 'idle' | 'loading' | 'success' | 'error' | 'empty';

export type ThemeMode = 'light' | 'dark' | 'system';

export type ResolvedTheme = 'light' | 'dark';

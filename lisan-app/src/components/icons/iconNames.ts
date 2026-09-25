/**
 * The complete, closed icon set for Lisan — exactly 40 icons (product spec §9).
 *
 * This module is intentionally free of React so that both the `Icon` component and the domain
 * types (`Category['icon']`) can depend on it without creating a cycle.
 *
 * Adding a name here is a deliberate design-system decision: it must also get artwork in
 * `iconShapes.ts`, which is exhaustively typed against this union.
 */
export const ICON_NAMES = [
  // Navigation
  'home',
  'vocabulary',
  'grammar',
  'practice',
  'progress',
  // Chrome
  'search',
  'theme',
  'profile',
  'settings',
  // Audio
  'volume',
  'play',
  'pause',
  'replay',
  // Saving
  'bookmark',
  'favorite',
  // Directional
  'arrow-left',
  'arrow-right',
  'chevron-down',
  'chevron-right',
  // Status
  'check',
  'close',
  'info',
  'alert',
  // Motivation
  'goal',
  'trophy',
  'streak',
  // Vocabulary categories
  'family',
  'food',
  'work',
  'nature',
  'travel',
  'education',
  'places',
  // Analytics
  'statistics',
  'study-time',
  // Practice modes
  'quiz',
  'image',
  'microphone',
  'keyboard',
  'flashcard',
] as const;

export type IconName = (typeof ICON_NAMES)[number];

/** Runtime guard for values coming from data files or persisted storage. */
export function isIconName(value: string): value is IconName {
  return (ICON_NAMES as readonly string[]).includes(value);
}

export const ICON_COUNT = ICON_NAMES.length;

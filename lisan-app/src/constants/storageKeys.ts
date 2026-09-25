/**
 * Namespaced persistence keys. The storage service prefixes every key with `lisan:` and stores a
 * `version` alongside the payload so that schema migrations are possible.
 */
export const STORAGE_NAMESPACE = 'lisan';

export const STORAGE_KEYS = {
  settings: 'settings',
  progress: 'progress',
  bookmarks: 'bookmarks',
  grammar: 'grammar',
  quizSession: 'quiz-session',
  quizHistory: 'quiz-history',
  theme: 'theme',
  /** Whether the learner asked for a premium tier, and the address they left if they left one. */
  premium: 'premium',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

/**
 * Keys held in `sessionStorage` instead: scoped to one tab and discarded with it, for state that
 * would be wrong to carry into the next visit. Namespaced and enveloped exactly like the keys
 * above, so both areas stay readable by the same rules.
 */
export const SESSION_STORAGE_KEYS = {
  /** Records that this tab has already reloaded itself to escape a stale build. */
  staleReload: 'stale-reload',
} as const;

export type SessionStorageKey = (typeof SESSION_STORAGE_KEYS)[keyof typeof SESSION_STORAGE_KEYS];

/** The baseline every slice is persisted at unless it declares a version of its own below. */
export const STORAGE_SCHEMA_VERSION = 1;

/**
 * `progress` moved ahead of the baseline when the store started keeping dated snapshots of its
 * counters. Versioning the one slice that changed is deliberate: bumping the shared constant
 * would re-run every other slice's migration for a shape that did not move.
 */
export const PROGRESS_STORAGE_VERSION = 2;

/*
 * ── Contract with the anti-FOUC bootstrap in `index.html` ──────────────────────────────────────
 *
 * The inline script in `index.html` resolves the persisted theme before the first paint, so it runs
 * before any module loads and cannot import either of the keys below: it has `'lisan:settings'` and
 * `'lisan:theme'` written out as literals. Duplicated strings across two files with no compiler
 * between them is exactly how an anti-FOUC bootstrap silently starts reading nothing and every
 * dark-mode learner gets a white flash on load.
 *
 * Neither constant is read at runtime by TypeScript, which makes both look deletable. They are not.
 * They are this side of that contract, and `storageKeys.test.ts` reads `index.html` off disk and
 * fails if a key here stops appearing there — so renaming one names the line to change with it.
 */

/** Mirror of the theme mode, written by `settingsStore` for the bootstrap to read. */
export const THEME_STORAGE_KEY = `${STORAGE_NAMESPACE}:${STORAGE_KEYS.theme}`;

/** Where the bootstrap looks first: the full settings envelope, theme included. */
export const SETTINGS_STORAGE_KEY = `${STORAGE_NAMESPACE}:${STORAGE_KEYS.settings}`;

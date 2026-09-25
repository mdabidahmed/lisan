import type { AppSettings, ArabicFont, ReadingFont } from '@/types/settings';

export const APP_NAME = 'Lisan';
export const APP_TAGLINE = 'Learn Arabic, Grow Closer';
export const APP_DESCRIPTION =
  'Learn Arabic vocabulary, pronunciation, grammar and practice with spaced repetition. Free, fast and offline-capable.';

/** Motivational Arabic quote shown on Home and Progress (reference screens 1 and 5). */
export const APP_QUOTE = {
  arabic: 'مَنْ جَدَّ وَجَدَ',
  english: 'Whoever strives, succeeds.',
} as const;

/**
 * Placeholder learner identity. Lisan has no accounts yet (product spec §42: never store
 * credentials client-side), so the shell renders a local profile until auth exists.
 */
export const DEFAULT_PROFILE = {
  name: 'Sami',
  role: 'Learner',
} as const;

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  language: 'en',
  dailyGoal: 10,
  audioSpeed: 0.75,
  autoPlayAudio: false,
  quizQuestionCount: 10,
  quizDifficulty: 'mixed',
  reducedMotion: false,
  textSize: 'default',
  highContrast: false,
  arabicFont: 'indopak',
  readingFont: 'inter',
  monospaceTransliteration: false,
};

/**
 * Live sample for the font pickers in Settings.
 *
 * A real dataset entry (`student`), copied rather than imported: Settings has no other reason to
 * pull in the vocabulary chunk, and a fabricated word would be a poor test of a script face.
 * `src/data/__tests__/data.test.ts` asserts the copy still matches the dataset.
 */
export const FONT_PREVIEW_SAMPLE = {
  wordId: 'student',
  arabic: 'طَالِب',
  transliteration: 'ṭālib',
  english: 'Student',
  exampleArabic: 'الطَّالِبُ يَقْرَأُ كِتَابًا فِي الْمَكْتَبَةِ.',
  exampleEnglish: 'The student is reading a book in the library.',
} as const;

export const ARABIC_FONT_OPTIONS = [
  'naskh',
  'amiri',
  'indopak',
] as const satisfies readonly ArabicFont[];

export const READING_FONT_OPTIONS = ['inter', 'spectral'] as const satisfies readonly ReadingFont[];

export const AUDIO_SPEED_OPTIONS: readonly number[] = [0.5, 0.75, 1, 1.25, 1.5];
export const DAILY_GOAL_OPTIONS: readonly number[] = [5, 10, 15, 20, 30, 50];
export const QUIZ_QUESTION_COUNT_OPTIONS: readonly number[] = [5, 10, 15, 20];

/**
 * Long lists are paginated, not virtualised — these two page sizes are the whole strategy, and both
 * match the reference screens. A `useVirtualList` hook and a `VIRTUALIZATION_THRESHOLD` used to sit
 * alongside them as a second, unused answer to the same question; the windowing maths was subtle,
 * untested and reachable from the hooks barrel, which is exactly the kind of code a future reader
 * trusts on sight. Pagination keeps payloads small as well, which windowing does not.
 */
export const VOCABULARY_PAGE_SIZE = 6;
export const BOOKMARKS_PAGE_SIZE = 10;

/** Debounce applied to every search input (product spec §31). */
export const SEARCH_DEBOUNCE_MS = 250;

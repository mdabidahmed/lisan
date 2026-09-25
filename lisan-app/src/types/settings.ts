import type { Locale } from '@/i18n/locales';

import type { QuizDifficulty } from './quiz';
import type { ThemeMode } from './ui';

/**
 * The interface language a learner can persist. An alias, not a parallel union: the locale
 * registry decides which languages exist, so settings cannot drift from what `I18nProvider`
 * is able to resolve. A locale that is registered but not `uiAvailable` is still storable —
 * `resolveLocale` is what keeps it out of the interface.
 */
export type AppLanguage = Locale;

export type TextSize = 'default' | 'large';

/**
 * Typeface for Arabic learning content. The three faces set harakat very differently, which is
 * the whole point of the choice: `naskh` is the self-hosted default, `amiri` is classical naskh,
 * and `indopak` is the Indo-Pak Quranic nastaleeq South Asian learners read the script in.
 */
export type ArabicFont = 'naskh' | 'amiri' | 'indopak';

/** Typeface for Latin text. `inter` is the self-hosted default; `spectral` is a reading serif. */
export type ReadingFont = 'inter' | 'spectral';

export interface AppSettings {
  theme: ThemeMode;
  language: AppLanguage;
  /** Words per day the learner is aiming for. */
  dailyGoal: number;
  /** Speech rate multiplier applied to Arabic pronunciation (0.5–1.5). */
  audioSpeed: number;
  autoPlayAudio: boolean;
  quizQuestionCount: number;
  quizDifficulty: QuizDifficulty;
  reducedMotion: boolean;
  textSize: TextSize;
  highContrast: boolean;
  arabicFont: ArabicFont;
  readingFont: ReadingFont;
  /** Renders transliteration in a monospace face, so diacritics like `ṭālib` line up. */
  monospaceTransliteration: boolean;
}

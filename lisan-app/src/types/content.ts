import type { IconName } from '@/components/icons/iconNames';

/** Common European Framework level, used to grade every word, category and lesson. */
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export const CEFR_LEVELS: readonly CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export interface WordExample {
  arabic: string;
  english: string;
  transliteration?: string;
}

export interface WordPlural {
  arabic: string;
  transliteration: string;
}

export interface WordAudio {
  url?: string;
  source: 'human' | 'tts' | 'browser';
}

/**
 * The atomic unit of the product. Authored under `src/data/` and never mutated at runtime —
 * learner state lives separately in `WordProgress`.
 */
export interface VocabularyWord {
  id: string;
  english: string;
  /** Fully vocalised Arabic (with harakat/tashkeel). */
  arabic: string;
  /** Romanisation, e.g. `tuffāḥ`. */
  transliteration: string;
  categoryId: string;
  level: CEFRLevel;
  partOfSpeech?: string;
  pluralForm?: WordPlural;
  meaningUrdu?: string;
  meaningHindi?: string;
  audio?: WordAudio;
  image?: string;
  examples: WordExample[];
  synonyms?: string[];
  /** Ids of other `VocabularyWord`s. */
  relatedWords?: string[];
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  arabicName: string;
  description: string;
  /** Must be one of the 40 design-system icons. */
  icon: IconName;
  /** An `AccentColor` token name (preferred) or a raw hex value. */
  color: string;
  level: CEFRLevel;
  wordCount: number;
}

/* ── Grammar ──────────────────────────────────────────────────────────────── */

export type GrammarTopic =
  | 'nahw'
  | 'sarf'
  | 'pronouns'
  | 'verbs'
  | 'nouns'
  | 'adjectives'
  | 'sentence-structure'
  | 'particles'
  | 'cases'
  | 'verb-forms';

export interface GrammarExample {
  arabic: string;
  english: string;
  transliteration?: string;
  note?: string;
}

export interface GrammarSection {
  id: string;
  heading: string;
  body: string;
  examples?: GrammarExample[];
}

export interface GrammarLesson {
  id: string;
  title: string;
  arabicTitle: string;
  topic: GrammarTopic;
  level: CEFRLevel;
  summary: string;
  icon: IconName;
  estimatedMinutes: number;
  sections: GrammarSection[];
  relatedWordIds?: string[];
}

/* ── Practice ─────────────────────────────────────────────────────────────── */

export type PracticeModeId =
  | 'multiple-choice'
  | 'listening'
  | 'typing'
  | 'image-match'
  | 'flashcards'
  | 'arabic-to-english'
  | 'english-to-arabic';

export interface PracticeMode {
  id: PracticeModeId;
  title: string;
  description: string;
  icon: IconName;
  /** Default number of questions generated for this mode. */
  questionCount: number;
  /** `AccentColor` token name used for the mode tile. */
  accent: string;
  /** False while a mode is still behind the phase-2 content work. */
  available: boolean;
}

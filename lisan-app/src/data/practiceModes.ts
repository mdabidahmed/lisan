/**
 * Practice modes shown on the Practice page (spec §15).
 *
 * `PracticeMode`, `PracticeModeId`, `QuizType` and `QuizDifficulty` come from
 * the shared contract in `@/types`. This file adds the routing metadata the
 * quiz generator needs — which quiz type a mode maps to, which direction it
 * prompts in, and why a mode is disabled — as a superset interface, so these
 * objects are still assignable to `PracticeMode`.
 */
import type { PracticeMode, QuizDifficulty, QuizType } from '@/types';

export type { PracticeMode, PracticeModeId, QuizDifficulty, QuizType } from '@/types';

/** Everything the Practice page can launch — the quiz types plus flashcards. */
export type PracticeModeType = QuizType | 'flashcards';

/** Which way round a prompt is shown, for the two directional modes. */
export type PracticeDirection = 'arabic-to-english' | 'english-to-arabic';

/** A `PracticeMode` plus the metadata needed to build its quiz. */
export interface PracticeModeDefinition extends PracticeMode {
  difficulty: QuizDifficulty;
  type: PracticeModeType;
  direction?: PracticeDirection;
  /** Shown by the UI when `available` is false. */
  unavailableReason?: string;
}

export const practiceModes = [
  {
    id: 'multiple-choice',
    title: 'Multiple Choice',
    description: 'Read an Arabic word and choose the correct English meaning from a few options.',
    icon: 'quiz',
    questionCount: 10,
    accent: 'blue',
    difficulty: 'easy',
    type: 'multiple-choice',
    available: true,
  },
  {
    id: 'listening',
    title: 'Listening',
    description: 'Listen to the Arabic pronunciation and select the correct meaning.',
    icon: 'volume',
    questionCount: 10,
    accent: 'green',
    difficulty: 'easy',
    type: 'listening',
    available: true,
  },
  {
    id: 'typing',
    title: 'Typing',
    description: 'Read the English word and type its Arabic translation.',
    icon: 'keyboard',
    questionCount: 10,
    accent: 'purple',
    difficulty: 'hard',
    type: 'typing',
    available: true,
  },
  {
    id: 'image-match',
    title: 'Image Match',
    description: 'See an Arabic word and pick the picture that matches it.',
    icon: 'image',
    questionCount: 8,
    accent: 'orange',
    difficulty: 'easy',
    type: 'image-match',
    available: true,
  },
  {
    id: 'flashcards',
    title: 'Flashcards',
    description:
      'Flip through cards at your own pace and mark each word as known or still learning.',
    icon: 'flashcard',
    questionCount: 20,
    accent: 'pink',
    difficulty: 'easy',
    type: 'flashcards',
    available: true,
  },
  {
    id: 'arabic-to-english',
    title: 'Arabic → English',
    description: 'Recognition practice: see the Arabic, recall the English meaning.',
    icon: 'arrow-right',
    questionCount: 10,
    accent: 'teal',
    difficulty: 'medium',
    type: 'multiple-choice',
    direction: 'arabic-to-english',
    available: true,
  },
  {
    id: 'english-to-arabic',
    title: 'English → Arabic',
    description: 'Production practice: see the English, recall the Arabic word.',
    icon: 'arrow-left',
    questionCount: 10,
    accent: 'indigo',
    difficulty: 'hard',
    type: 'multiple-choice',
    direction: 'english-to-arabic',
    available: true,
  },
] satisfies PracticeModeDefinition[];

export default practiceModes;

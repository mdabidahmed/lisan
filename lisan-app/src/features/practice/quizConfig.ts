/**
 * Practice mode → quiz request.
 *
 * The API returns `PracticeMode`, which deliberately carries only presentation fields, so the
 * mapping from a mode to the question type it generates lives here rather than being read off the
 * content barrel. Adding a mode is a change to this table and to `PracticeModeId`.
 *
 * Direction is the exception: a tile promises a direction in its own title and description, so it
 * is read straight off the authored mode rather than restated here, where the two could drift.
 */
import { practiceModes, type PracticeDirection } from '@/data/practiceModes';
import {
  DEFAULT_QUIZ_DIRECTION,
  type PracticeModeId,
  type QuizConfig,
  type QuizDifficulty,
  type QuizType,
} from '@/types';

/** Sentinel used by the category select for "no category filter". */
export const ALL_CATEGORIES = 'all';

export const MODE_QUIZ_TYPE: Record<PracticeModeId, QuizType> = {
  'multiple-choice': 'multiple-choice',
  listening: 'listening',
  typing: 'typing',
  'image-match': 'image-match',
  // Flashcards are self-paced rather than scored, but the card faces are the same
  // Arabic-prompt/English-answer pairs a multiple-choice quiz is built from.
  flashcards: 'multiple-choice',
  'arabic-to-english': 'multiple-choice',
  // Four Arabic options, as the tile advertises: direction, not type, is what makes it
  // production practice.
  'english-to-arabic': 'multiple-choice',
};

const MODE_IDS = Object.keys(MODE_QUIZ_TYPE) as PracticeModeId[];

export function isPracticeModeId(value: string): value is PracticeModeId {
  return (MODE_IDS as string[]).includes(value);
}

/**
 * What the mode tile promises, falling back to the face its question type has always had — the
 * typing tile asks for Arabic without declaring a direction, and recognition is the default
 * everywhere else.
 */
export function directionForMode(mode: PracticeModeId): PracticeDirection {
  const declared = practiceModes.find((item) => item.id === mode)?.direction;
  return declared ?? DEFAULT_QUIZ_DIRECTION[MODE_QUIZ_TYPE[mode]];
}

/** The direction a config runs in, for sessions persisted before `direction` existed. */
export function directionOfQuiz(config: QuizConfig): PracticeDirection {
  return config.direction ?? DEFAULT_QUIZ_DIRECTION[config.type];
}

export interface QuizConfigInput {
  categoryId?: string | undefined;
  questionCount: number;
  difficulty: QuizDifficulty;
}

export function buildQuizConfig(
  mode: PracticeModeId,
  { categoryId, questionCount, difficulty }: QuizConfigInput,
): QuizConfig {
  const scoped = categoryId !== undefined && categoryId !== '' && categoryId !== ALL_CATEGORIES;

  return {
    mode,
    type: MODE_QUIZ_TYPE[mode],
    questionCount,
    difficulty,
    direction: directionForMode(mode),
    ...(scoped ? { categoryId } : {}),
  };
}

import { hasWordArt } from '@/assets';
import type { PracticeDirection } from '@/data/practiceModes';
import {
  DEFAULT_QUIZ_DIRECTION,
  type CEFRLevel,
  type Quiz,
  type QuizConfig,
  type QuizQuestion,
  type VocabularyWord,
} from '@/types';
import { hashString, sample, shuffle } from '@/utils';

import { badRequest } from '../errors';
import { getAllWords, getWordsForCategory } from '../contentSource';

/**
 * Builds a quiz from the real vocabulary. Every random choice is seeded from the config, so the
 * same request always yields the same questions — which is what lets React Query cache a quiz and
 * lets the result screen be reloaded without the answers shifting underneath the learner.
 */

const OPTION_COUNT = 4;

const DIFFICULTY_LEVELS: Record<QuizConfig['difficulty'], readonly CEFRLevel[] | null> = {
  easy: ['A1'],
  medium: ['A1', 'A2'],
  hard: ['B1', 'B2', 'C1', 'C2'],
  mixed: null,
};

function directionOf(config: QuizConfig): PracticeDirection {
  return config.direction ?? DEFAULT_QUIZ_DIRECTION[config.type];
}

function seedFor(config: QuizConfig): string {
  return [
    config.mode,
    config.type,
    // Two directions of the same mode are different quizzes and must not share an id: the
    // runner keeps a session alive when the incoming quiz id matches the one it is running.
    directionOf(config),
    config.categoryId ?? 'all',
    config.level ?? 'any',
    config.difficulty,
    config.questionCount,
  ].join('|');
}

function buildPool(config: QuizConfig): readonly VocabularyWord[] {
  const base = config.categoryId ? getWordsForCategory(config.categoryId) : getAllWords();

  let pool = config.level ? base.filter((word) => word.level === config.level) : base;

  const allowedLevels = DIFFICULTY_LEVELS[config.difficulty];
  if (allowedLevels) {
    const narrowed = pool.filter((word) => allowedLevels.includes(word.level));
    // A thin dataset must not produce an empty quiz; widen rather than fail.
    if (narrowed.length >= OPTION_COUNT) pool = narrowed;
  }

  if (config.type === 'image-match') return buildImageMatchPool(pool);

  return pool.length >= OPTION_COUNT ? pool : getAllWords();
}

/**
 * Image match can only ask about words that actually have artwork — a small subset of the corpus,
 * since the rest render as designed letter tiles that would make every option look identical.
 *
 * A filter that leaves too few illustrated candidates (a category with no artwork at all) widens
 * to the whole illustrated set rather than building a question nobody could answer.
 */
function buildImageMatchPool(pool: readonly VocabularyWord[]): readonly VocabularyWord[] {
  const illustrated = pool.filter((word) => hasWordArt(word.id));
  if (illustrated.length >= OPTION_COUNT) return illustrated;

  const everyIllustrated = getAllWords().filter((word) => hasWordArt(word.id));
  if (everyIllustrated.length >= OPTION_COUNT) return everyIllustrated;

  throw badRequest('Image match needs at least four illustrated words to build a question.');
}

/**
 * Every candidate distractor, most plausible first: same category and level, then the rest of
 * the category, then anything. A distractor from the same semantic field is what actually tests
 * recall — "bread" against "rice" is a question, "bread" against "Tuesday" is a giveaway.
 */
function distractorsByPlausibility(
  word: VocabularyWord,
  pool: readonly VocabularyWord[],
  seed: string,
): VocabularyWord[] {
  const candidates = pool.filter((item) => item.id !== word.id);
  const sameCategory = candidates.filter((item) => item.categoryId === word.categoryId);

  return [
    ...sample(
      sameCategory.filter((item) => item.level === word.level),
      OPTION_COUNT,
      `${seed}:level`,
    ),
    ...sample(
      sameCategory.filter((item) => item.level !== word.level),
      OPTION_COUNT,
      `${seed}:category`,
    ),
    ...sample(
      candidates.filter((item) => item.categoryId !== word.categoryId),
      OPTION_COUNT,
      `${seed}:any`,
    ),
  ];
}

/**
 * `OPTION_COUNT` distinct faces with the answer among them, as the words behind them rather than
 * bare strings — so a caller can read off a second attribute (the Urdu gloss) for the exact same
 * shuffled order instead of re-deriving it and risking the two falling out of step. Distinctness
 * is checked on the face rather than the word, because two words can share an English gloss and a
 * repeated option is an unanswerable question.
 */
function buildOptionWords(
  word: VocabularyWord,
  candidates: readonly VocabularyWord[],
  faceOf: (item: VocabularyWord) => string,
): VocabularyWord[] {
  const words = [word];
  const faces = new Set([faceOf(word)]);

  for (const candidate of candidates) {
    if (words.length >= OPTION_COUNT) break;
    const face = faceOf(candidate);
    if (!faces.has(face)) {
      faces.add(face);
      words.push(candidate);
    }
  }

  return words;
}

function imageTokenFor(word: VocabularyWord): string {
  // The token is the word id: `WordThumbnail` resolves that to real artwork when it exists and to
  // a deterministic tile when it does not, so the option renderer needs no asset knowledge.
  return word.image ?? word.id;
}

/** The side of a word a question prints, and the side it asks for. */
function facesFor(direction: PracticeDirection): {
  prompt: (word: VocabularyWord) => string;
  answer: (word: VocabularyWord) => string;
} {
  return direction === 'english-to-arabic'
    ? { prompt: (word) => word.english, answer: (word) => word.arabic }
    : { prompt: (word) => word.arabic, answer: (word) => word.english };
}

/**
 * Direction decides which side of the word is printed and which side is asked for, so
 * `english-to-arabic` is a genuine production question — an English prompt with four Arabic
 * options — rather than the recognition question with the labels swapped.
 *
 * Two types opt out. Listening's prompt is the text the UI speaks, so it is always the Arabic;
 * image match answers with artwork, which has no direction at all.
 */
function buildQuestion(
  word: VocabularyWord,
  index: number,
  config: QuizConfig,
  pool: readonly VocabularyWord[],
  seed: string,
): QuizQuestion {
  const questionSeed = `${seed}:${word.id}`;
  const id = `q${index + 1}_${word.id}`;
  const distractors = distractorsByPlausibility(word, pool, questionSeed);
  const { prompt, answer } = facesFor(directionOf(config));

  switch (config.type) {
    case 'typing':
      return {
        id,
        type: 'typing',
        wordId: word.id,
        question: prompt(word),
        correctAnswer: answer(word),
      };

    case 'image-match':
      return {
        id,
        type: 'image-match',
        wordId: word.id,
        question: word.arabic,
        correctAnswer: imageTokenFor(word),
        imageOptions: shuffle(buildOptionWords(word, distractors, imageTokenFor), questionSeed).map(
          imageTokenFor,
        ),
      };

    case 'listening':
    case 'multiple-choice':
    default: {
      const optionWords = shuffle(buildOptionWords(word, distractors, answer), questionSeed);
      return {
        id,
        type: config.type === 'listening' ? 'listening' : 'multiple-choice',
        wordId: word.id,
        question: config.type === 'listening' ? word.arabic : prompt(word),
        correctAnswer: answer(word),
        options: optionWords.map(answer),
        optionsUrdu: optionWords.map((item) => item.meaningUrdu ?? ''),
      };
    }
  }
}

export function generateQuiz(config: QuizConfig): Quiz {
  if (config.questionCount <= 0) {
    throw badRequest('A quiz needs at least one question.');
  }

  const pool = buildPool(config);
  if (pool.length === 0) {
    throw badRequest('No vocabulary matches this quiz configuration.');
  }

  const seed = seedFor(config);
  const chosen = sample(pool, Math.min(config.questionCount, pool.length), seed);

  return {
    id: `quiz_${hashString(seed).toString(36)}`,
    config,
    questions: chosen.map((word, index) => buildQuestion(word, index, config, pool, seed)),
  };
}

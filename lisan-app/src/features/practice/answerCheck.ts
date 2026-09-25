/**
 * Answer grading for the quiz runner.
 *
 * `quizSessionStore` owns whether an answer is *correct*; this module mirrors that decision
 * exactly (see `matchesExpected`) and adds the one thing the store has no opinion about — whether
 * a wrong answer was close enough to deserve a "so close" reveal rather than a flat red one.
 *
 * Forgiveness follows product spec §18: harakat, the alif and hamza-carrier variants, tāʾ marbūṭa
 * against hāʾ, whitespace and transliteration case are all harmless differences and never cost a
 * learner the question.
 */
import type { QuizType } from '@/types';
import {
  containsArabic,
  isArabicAnswerCorrect,
  normalizeArabic,
  normalizeTransliteration,
} from '@/utils';

export type AnswerVerdict = 'correct' | 'near-miss' | 'incorrect';

export interface GradeAnswerOptions {
  /** Defaults to `typing`. Every other type is a discrete choice, so only equality matters. */
  type?: QuizType | undefined;
  /**
   * Recognisable spellings in the wrong script — the word's transliteration, typically. Matching
   * one means the learner knew the word but not how to write it, which is a near miss.
   */
  nearMatches?: readonly string[] | undefined;
}

const ARABIC_DEFINITE_ARTICLE = 'ال';

function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

/**
 * Script-aware folding: Arabic loses its tashkeel and letter variants, Latin loses its diacritics
 * and case. One entry point so a mixed-script answer set never needs two comparisons at a callsite.
 */
export function normalizeAnswer(value: string): string {
  return collapseWhitespace(
    containsArabic(value) ? normalizeArabic(value) : normalizeTransliteration(value),
  );
}

/**
 * Exactly the comparison `quizSessionStore.answer()` runs, so the two can never disagree —
 * including its script test, which is what lets a typing question be graded in either direction.
 */
export function matchesExpected(given: string, expected: string, type: QuizType): boolean {
  return type === 'typing' && containsArabic(expected)
    ? isArabicAnswerCorrect(given, expected)
    : collapseWhitespace(given).toLowerCase() === collapseWhitespace(expected).toLowerCase();
}

function withoutDefiniteArticle(value: string): string {
  return value.startsWith(ARABIC_DEFINITE_ARTICLE)
    ? value.slice(ARABIC_DEFINITE_ARTICLE.length)
    : value;
}

/** Longer words earn more slack: one slip in a short word is likelier to be a different word. */
function typoTolerance(length: number): number {
  if (length <= 3) return 0;
  if (length <= 7) return 1;
  return 2;
}

/**
 * Optimal string alignment distance — Levenshtein plus adjacent transposition, because swapping
 * two letters is the single most common typing slip and costs two plain Levenshtein edits.
 * Bails out early once the strings cannot possibly land within `max`.
 */
export function editDistance(a: string, b: string, max = Number.POSITIVE_INFINITY): number {
  if (a === b) return 0;
  const beyond = Number.isFinite(max) ? max + 1 : Math.max(a.length, b.length);
  if (Math.abs(a.length - b.length) > max) return beyond;

  let twoBack: number[] = [];
  let previous: number[] = Array.from({ length: b.length + 1 }, (_, index) => index);

  for (let i = 1; i <= a.length; i += 1) {
    const current: number[] = new Array<number>(b.length + 1).fill(0);
    current[0] = i;

    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let best = Math.min(
        (previous[j - 1] ?? 0) + cost,
        (previous[j] ?? 0) + 1,
        (current[j - 1] ?? 0) + 1,
      );

      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        best = Math.min(best, (twoBack[j - 2] ?? 0) + 1);
      }

      current[j] = best;
    }

    twoBack = previous;
    previous = current;
  }

  return previous[b.length] ?? beyond;
}

/**
 * `correct` when the store would score it correct, `near-miss` when the learner clearly knew the
 * word, `incorrect` otherwise. A near miss is still a wrong answer for scoring — it only changes
 * how the reveal reads and how harshly the SRS grades the lapse.
 */
export function gradeAnswer(
  given: string,
  expected: string,
  { type = 'typing', nearMatches = [] }: GradeAnswerOptions = {},
): AnswerVerdict {
  if (given.trim() === '') return 'incorrect';
  if (matchesExpected(given, expected, type)) return 'correct';

  // Discrete choices are right or wrong; there is nothing in between to be close to.
  if (type !== 'typing') return 'incorrect';

  const normalizedGiven = normalizeAnswer(given);
  const normalizedExpected = normalizeAnswer(expected);
  if (normalizedGiven === '' || normalizedExpected === '') return 'incorrect';

  if (nearMatches.some((candidate) => normalizeAnswer(candidate) === normalizedGiven)) {
    return 'near-miss';
  }

  // "the engineer" against "engineer": the right word, the wrong definiteness.
  if (withoutDefiniteArticle(normalizedGiven) === withoutDefiniteArticle(normalizedExpected)) {
    return 'near-miss';
  }

  const tolerance = typoTolerance(normalizedExpected.length);
  if (tolerance === 0) return 'incorrect';

  return editDistance(normalizedGiven, normalizedExpected, tolerance) <= tolerance
    ? 'near-miss'
    : 'incorrect';
}

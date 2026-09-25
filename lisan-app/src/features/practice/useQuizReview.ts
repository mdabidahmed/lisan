/**
 * The per-question breakdown behind `/quiz/result`.
 *
 * A `QuizAnswer` records only what was submitted, so the review joins it back to the question it
 * came from (still in the session, which persists past completion) and to the word itself. Both
 * are optional on purpose: a learner who cleared their session still gets a readable list.
 */
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { api } from '@/services/api';
import { useLastQuizResult, useQuizSession } from '@/store/quizSessionStore';
import type {
  PracticeModeId,
  QuizAnswer,
  QuizConfig,
  QuizQuestion,
  QuizResult,
  QuizType,
  VocabularyWord,
} from '@/types';
import { containsArabic, unique } from '@/utils';

import { STATIC_CONTENT_STALE_TIME } from '../shared/staleTimes';
import { practiceKeys } from './queryKeys';

export interface QuizReviewRow {
  questionId: string;
  wordId: string;
  type: QuizType | undefined;
  arabic: string;
  english: string;
  transliteration: string;
  /** What the learner submitted, resolved to something readable. */
  givenLabel: string;
  correctLabel: string;
  /** True when the two labels are Arabic script and need RTL treatment. */
  answersAreArabic: boolean;
  correct: boolean;
}

export interface QuizReviewState {
  result: QuizResult | null;
  rows: QuizReviewRow[];
  /** Questions to re-ask, in their original order: everything wrong or skipped. */
  missedQuestions: QuizQuestion[];
  /** The mode the finished quiz ran in, so a retry can return to the same runner. */
  mode: PracticeModeId | null;
  /** The configuration the finished quiz was built from, for a retry session. */
  config: QuizConfig | null;
  isLoading: boolean;
}

const NO_ANSWER = 'No answer';

/** Image-match questions carry word ids as their answers, so those need resolving too. */
function imageTokensIn(
  questions: readonly QuizQuestion[],
  answers: readonly QuizAnswer[],
): string[] {
  const byId = new Map(questions.map((question) => [question.id, question]));
  const tokens: string[] = [];

  for (const answer of answers) {
    if (byId.get(answer.questionId)?.type !== 'image-match') continue;
    tokens.push(answer.given);
    const correctAnswer = byId.get(answer.questionId)?.correctAnswer;
    if (correctAnswer !== undefined) tokens.push(correctAnswer);
  }

  return tokens;
}

function labelFor(
  value: string,
  question: QuizQuestion | undefined,
  wordsById: ReadonlyMap<string, VocabularyWord>,
): string {
  if (value.trim() === '') return NO_ANSWER;
  if (question?.type !== 'image-match') return value;
  const word = wordsById.get(value);
  return word === undefined ? value : word.english;
}

export function useQuizReview(): QuizReviewState {
  const result = useLastQuizResult();
  const session = useQuizSession();

  const questions = useMemo<readonly QuizQuestion[]>(
    () => (session?.quizId === result?.quizId ? (session?.questions ?? []) : []),
    [session, result],
  );

  const wordIds = useMemo(() => {
    const answers = result?.answers ?? [];
    return unique([
      ...answers.map((answer) => answer.wordId),
      ...imageTokensIn(questions, answers),
    ]).sort();
  }, [result, questions]);

  const { data: words = [], isPending } = useQuery({
    queryKey: practiceKeys.reviewWords(wordIds),
    queryFn: async ({ signal }) => {
      const found = await Promise.all(
        wordIds.map((id) => api.words.getWord(id, { signal }).catch(() => undefined)),
      );
      return found.filter((word): word is VocabularyWord => word !== undefined);
    },
    enabled: wordIds.length > 0,
    staleTime: STATIC_CONTENT_STALE_TIME,
  });

  const wordsById = useMemo(() => new Map(words.map((word) => [word.id, word])), [words]);

  const rows = useMemo<QuizReviewRow[]>(() => {
    const questionsById = new Map(questions.map((question) => [question.id, question]));

    return (result?.answers ?? []).map((answer) => {
      const question = questionsById.get(answer.questionId);
      const word = wordsById.get(answer.wordId);
      const expected = question?.correctAnswer ?? word?.english ?? '';

      return {
        questionId: answer.questionId,
        wordId: answer.wordId,
        type: question?.type,
        arabic: word?.arabic ?? '',
        english: word?.english ?? answer.wordId,
        transliteration: word?.transliteration ?? '',
        givenLabel: labelFor(answer.given, question, wordsById),
        correctLabel: labelFor(expected, question, wordsById),
        // Whatever the question asked for: typed Arabic and `english-to-arabic` options both
        // need the RTL face. Image-match labels are resolved to English and never do.
        answersAreArabic: question?.type !== 'image-match' && containsArabic(expected),
        correct: answer.correct,
      };
    });
  }, [result, questions, wordsById]);

  const missedQuestions = useMemo(() => {
    const correctIds = new Set(
      (result?.answers ?? []).filter((answer) => answer.correct).map((a) => a.questionId),
    );
    return questions.filter((question) => !correctIds.has(question.id));
  }, [result, questions]);

  return {
    result,
    rows,
    missedQuestions,
    mode: session?.config.mode ?? null,
    config: session?.config ?? null,
    isLoading: isPending && wordIds.length > 0,
  };
}

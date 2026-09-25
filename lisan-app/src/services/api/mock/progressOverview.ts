import { countLearnedWords, getDueWords, isLearnedWord } from '@/services/srs';
import type {
  CategoryProgress,
  ProgressOverviewData,
  ProgressSummary,
  TimeSeriesPoint,
  WordProgress,
} from '@/types';
import { addDays, clampPercent, toDateKey } from '@/utils';

import { getAllCategories, getWordsForCategory } from '../contentSource';
import type { ProgressOverviewInput } from '../types';
import { computeStreaks, weekStudyDays } from './streaks';

const TIME_SERIES_DAYS = 14;

function buildSummary(input: ProgressOverviewInput, now: Date): ProgressSummary {
  const entries = Object.values(input.progressById);

  let wordsReviewed = 0;
  let wordsMastered = 0;

  for (const progress of entries) {
    if (progress.lastReviewedAt !== undefined) wordsReviewed += 1;
    if (progress.status === 'mastered') wordsMastered += 1;
  }

  const { current, longest } = computeStreaks(input.studyDays, now);

  return {
    wordsLearned: countLearnedWords(input.progressById),
    wordsReviewed,
    wordsMastered,
    quizzesCompleted: input.quizzesCompleted,
    accuracy:
      input.totalAnswers > 0
        ? clampPercent(Math.round((input.totalCorrect / input.totalAnswers) * 100))
        : 0,
    currentStreak: current,
    longestStreak: Math.max(longest, current),
    studyMinutes: input.studyMinutes,
    dueToday: getDueWords(input.progressById, now).length,
  };
}

/** Cumulative "words learned" for the last fortnight, which is what the line chart plots. */
function buildTimeSeries(progressById: Record<string, WordProgress>, now: Date): TimeSeriesPoint[] {
  const learnedOn: string[] = [];
  for (const progress of Object.values(progressById)) {
    if (progress.repetitions > 0 && progress.lastReviewedAt !== undefined) {
      learnedOn.push(toDateKey(progress.lastReviewedAt));
    }
  }

  return Array.from({ length: TIME_SERIES_DAYS }, (_, offset) => {
    const date = toDateKey(addDays(now, offset - (TIME_SERIES_DAYS - 1)));
    return { date, value: learnedOn.filter((key) => key <= date).length };
  });
}

function buildCategoryProgress(progressById: Record<string, WordProgress>): CategoryProgress[] {
  return getAllCategories().map((category) => {
    const words = getWordsForCategory(category.id);
    const total = words.length > 0 ? words.length : category.wordCount;
    const learned = words.filter((word) => {
      const progress = progressById[word.id];
      return progress !== undefined && isLearnedWord(progress);
    }).length;

    return {
      categoryId: category.id,
      learned,
      total,
      percent: total > 0 ? clampPercent(Math.round((learned / total) * 100)) : 0,
    };
  });
}

/**
 * The dashboard's server-side half: the rolled-up summary, the chart series, the category bars
 * and the week strip.
 *
 * The activity timeline and the achievement badges are deliberately not here. Both need slices
 * the endpoint is never handed — the last quiz result and the grammar lesson completions — so
 * they are derived in `src/features/progress/` from the whole of the learner's record instead.
 */
export function buildProgressOverview(
  input: ProgressOverviewInput,
  now: Date = new Date(),
): ProgressOverviewData {
  return {
    summary: buildSummary(input, now),
    wordsOverTime: buildTimeSeries(input.progressById, now),
    categories: buildCategoryProgress(input.progressById),
    weekStudyDays: weekStudyDays(input.studyDays, now),
  };
}

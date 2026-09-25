import { useMemo } from 'react';

import { useCompletedLessonCount } from '@/store/lessonProgressStore';
import { useProgressStore } from '@/store/progressStore';
import type { ProgressSummary } from '@/types';

import { deriveAchievements, type DerivedAchievement } from './achievements';

/**
 * Badge state for the Progress page.
 *
 * The summary already carries the rolled-up metrics; only the raw answer count (which gates the
 * accuracy badge) and the grammar lesson tally have to be read from their own slices.
 */
export function useAchievements(summary: ProgressSummary): DerivedAchievement[] {
  const totalAnswers = useProgressStore((state) => state.totalAnswers);
  const lessonsCompleted = useCompletedLessonCount();

  return useMemo(
    () =>
      deriveAchievements({
        wordsLearned: summary.wordsLearned,
        wordsMastered: summary.wordsMastered,
        quizzesCompleted: summary.quizzesCompleted,
        accuracy: summary.accuracy,
        longestStreak: summary.longestStreak,
        studyMinutes: summary.studyMinutes,
        totalAnswers,
        lessonsCompleted,
      }),
    [summary, totalAnswers, lessonsCompleted],
  );
}

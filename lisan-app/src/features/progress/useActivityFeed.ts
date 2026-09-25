import { useMemo } from 'react';

import { useLessonCompletionHistory } from '@/store/lessonProgressStore';
import { useGrammarLessons } from '@/features/grammar/useGrammar';
import { useWords } from '@/features/vocabulary/useWords';
import { useProgressStore } from '@/store/progressStore';
import { useLastQuizResult } from '@/store/quizSessionStore';
import type { ActivityEntry, Category, VocabularyQuery } from '@/types';

import { ACTIVITY_FEED_LIMIT, deriveActivityFeed, type ActivityLessonEvent } from './activityFeed';

/**
 * Grouping learned words by category needs `wordId → categoryId` for the whole corpus, so the
 * feed asks for one oversized page. It is the same cached query the vocabulary list uses, and the
 * mock content source answers it from memory.
 */
const WORD_LOOKUP_QUERY: VocabularyQuery = { pageSize: 1000 };

export interface UseActivityFeedOptions {
  categoriesById: Readonly<Record<string, Category>>;
  limit?: number | undefined;
}

export interface ActivityFeedResult {
  entries: ActivityEntry[];
  /** True until the word lookup lands, so a row is never labelled with the wrong category. */
  isLoading: boolean;
}

/** The Progress page timeline, derived from the learner's own record. */
export function useActivityFeed({
  categoriesById,
  limit,
}: UseActivityFeedOptions): ActivityFeedResult {
  const progressById = useProgressStore((state) => state.byWordId);
  const lastQuiz = useLastQuizResult();
  const completions = useLessonCompletionHistory();
  const { data: words, isLoading } = useWords(WORD_LOOKUP_QUERY);
  const { data: lessons } = useGrammarLessons();

  const categoryIdByWordId = useMemo(() => {
    const map: Record<string, string> = {};
    for (const word of words?.items ?? []) map[word.id] = word.categoryId;
    return map;
  }, [words]);

  const completedLessons = useMemo<ActivityLessonEvent[]>(() => {
    const titleById = new Map((lessons ?? []).map((lesson) => [lesson.id, lesson.title]));
    return completions.map((completion) => ({
      lessonId: completion.lessonId,
      title: titleById.get(completion.lessonId) ?? completion.lessonId,
      completedAt: completion.completedAt,
    }));
  }, [completions, lessons]);

  const entries = useMemo(
    () =>
      deriveActivityFeed({
        progressById,
        categoryIdByWordId,
        categoriesById,
        ...(lastQuiz === null
          ? {}
          : { lastQuiz: { accuracy: lastQuiz.accuracy, completedAt: lastQuiz.completedAt } }),
        completedLessons,
        limit: limit ?? ACTIVITY_FEED_LIMIT,
      }),
    [progressById, categoryIdByWordId, categoriesById, lastQuiz, completedLessons, limit],
  );

  return useMemo(() => ({ entries, isLoading }), [entries, isLoading]);
}

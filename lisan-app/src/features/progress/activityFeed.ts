import type { ActivityEntry, Category, WordProgress } from '@/types';
import { toDateKey } from '@/utils/date';
import { formatPercent } from '@/utils/format';

/**
 * The Progress timeline (reference screen 5) is derived, not recorded.
 *
 * The progress store keeps running totals and one SRS record per word rather than an event log,
 * so the only timestamps available are `WordProgress.lastReviewedAt`, the last quiz result, and
 * grammar lesson completions. Words are therefore grouped by day and category — which is exactly
 * how the design reads them ("Learned 5 new words in Professions") — and nothing is shown that
 * the learner's own record cannot account for.
 */

/** The one quiz the app keeps a timestamp for. Earlier quizzes are counted but not dated. */
export interface ActivityQuizEvent {
  /** 0–100. */
  accuracy: number;
  completedAt: string;
}

export interface ActivityLessonEvent {
  lessonId: string;
  title: string;
  completedAt: string;
}

export interface ActivityFeedInput {
  progressById: Readonly<Record<string, WordProgress>>;
  /** `wordId → categoryId`. Words with no entry are grouped together as "vocabulary". */
  categoryIdByWordId: Readonly<Record<string, string>>;
  categoriesById: Readonly<Record<string, Pick<Category, 'name' | 'color'>>>;
  lastQuiz?: ActivityQuizEvent | undefined;
  completedLessons?: readonly ActivityLessonEvent[] | undefined;
  limit?: number | undefined;
}

export const ACTIVITY_FEED_LIMIT = 12;

const FALLBACK_CATEGORY_NAME = 'Vocabulary';
const FALLBACK_ACCENT = 'blue';
const QUIZ_ACCENT = 'purple';
const LESSON_ACCENT = 'indigo';

/** `repetitions === 1` is the first successful review, which is where a word counts as learned. */
const FIRST_REVIEW_REPETITIONS = 1;

type WordGroupKind = 'learned' | 'reviewed';

interface WordGroup {
  categoryId: string;
  kind: WordGroupKind;
  dateKey: string;
  count: number;
  latestAt: string;
}

function groupKindFor(progress: WordProgress): WordGroupKind {
  const firstPass = progress.repetitions <= FIRST_REVIEW_REPETITIONS && progress.status !== 'new';
  return firstPass ? 'learned' : 'reviewed';
}

function groupWords(input: ActivityFeedInput): WordGroup[] {
  const groups = new Map<string, WordGroup>();

  for (const progress of Object.values(input.progressById)) {
    const at = progress.lastReviewedAt;
    if (at === undefined || at === '') continue;

    const categoryId = input.categoryIdByWordId[progress.wordId] ?? '';
    const kind = groupKindFor(progress);
    const dateKey = toDateKey(at);
    const key = `${dateKey}|${categoryId}|${kind}`;

    const existing = groups.get(key);
    if (existing) {
      existing.count += 1;
      if (at > existing.latestAt) existing.latestAt = at;
    } else {
      groups.set(key, { categoryId, kind, dateKey, count: 1, latestAt: at });
    }
  }

  return [...groups.values()];
}

function labelFor(kind: WordGroupKind, count: number, categoryName: string): string {
  const noun = count === 1 ? 'word' : 'words';
  return kind === 'learned'
    ? `Learned ${count} new ${noun} in ${categoryName}`
    : `Reviewed ${count} ${noun} in ${categoryName}`;
}

function wordEntries(input: ActivityFeedInput): ActivityEntry[] {
  return groupWords(input).map((group) => {
    const category = input.categoriesById[group.categoryId];

    return {
      id: `activity_words_${group.kind}_${group.dateKey}_${group.categoryId || 'other'}`,
      type: group.kind === 'learned' ? 'words-learned' : 'words-reviewed',
      label: labelFor(group.kind, group.count, category?.name ?? FALLBACK_CATEGORY_NAME),
      at: group.latestAt,
      icon: group.kind === 'learned' ? 'vocabulary' : 'replay',
      accent: category?.color ?? FALLBACK_ACCENT,
    } satisfies ActivityEntry;
  });
}

function quizEntries(input: ActivityFeedInput): ActivityEntry[] {
  const quiz = input.lastQuiz;
  if (!quiz || quiz.completedAt === '') return [];

  return [
    {
      id: `activity_quiz_${quiz.completedAt}`,
      type: 'quiz-completed',
      label: `Completed a quiz (Score: ${formatPercent(quiz.accuracy)})`,
      at: quiz.completedAt,
      icon: 'quiz',
      accent: QUIZ_ACCENT,
    },
  ];
}

function lessonEntries(input: ActivityFeedInput): ActivityEntry[] {
  return (input.completedLessons ?? []).map((lesson) => ({
    id: `activity_lesson_${lesson.lessonId}`,
    type: 'lesson-completed',
    label: `Completed the grammar lesson: ${lesson.title}`,
    at: lesson.completedAt,
    icon: 'grammar',
    accent: LESSON_ACCENT,
  }));
}

/** Newest first, with the id as a tie-break so equal timestamps keep a stable order. */
function byRecency(a: ActivityEntry, b: ActivityEntry): number {
  if (a.at !== b.at) return a.at < b.at ? 1 : -1;
  return a.id < b.id ? -1 : 1;
}

export function deriveActivityFeed(input: ActivityFeedInput): ActivityEntry[] {
  const limit = Math.max(1, input.limit ?? ACTIVITY_FEED_LIMIT);

  return [...wordEntries(input), ...quizEntries(input), ...lessonEntries(input)]
    .sort(byRecency)
    .slice(0, limit);
}

import type { IconName } from '@/components/icons';
import type { Achievement } from '@/types';
import { formatDuration, formatNumber, formatPercent } from '@/utils/format';

/**
 * Badges are a pure function of the learner's own record, so they can be recomputed from scratch
 * at any time and never need a data source of their own. Every field below comes from the progress
 * store, except `lessonsCompleted`, which comes from the grammar lesson store.
 */
export interface AchievementStats {
  wordsLearned: number;
  wordsMastered: number;
  quizzesCompleted: number;
  /** 0–100. */
  accuracy: number;
  longestStreak: number;
  studyMinutes: number;
  /** Total answers given. Gates the accuracy badge — see `ACCURACY_MIN_ANSWERS`. */
  totalAnswers: number;
  lessonsCompleted: number;
}

export type AchievementState = 'earned' | 'in-progress' | 'locked';

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  /** The value of `measure` at which the badge is earned. */
  target: number;
  measure: (stats: AchievementStats) => number;
  /** Renders the current and target values when a bare count would not read well. */
  format?: (value: number) => string;
}

export interface DerivedAchievement extends Achievement {
  state: AchievementState;
  progress: { current: number; target: number };
  /** `"24/100"`, `"4h 5m/10h"` — shown while a badge is still outstanding. */
  progressLabel: string;
}

/** One lucky answer should not earn an accuracy badge. */
export const ACCURACY_MIN_ANSWERS = 20;

const MINUTES_TARGET = 600;

/**
 * Order is the display order: the three badges from reference screen 5 come first.
 *
 * Streaks are measured against the longest streak rather than the current one so that a badge is
 * never taken back after a missed day.
 */
export const ACHIEVEMENT_DEFINITIONS: readonly AchievementDefinition[] = [
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Learn your first 10 words',
    icon: 'goal',
    target: 10,
    measure: (stats) => stats.wordsLearned,
  },
  {
    id: 'quiz-master',
    title: 'Quiz Master',
    description: 'Complete 10 quizzes',
    icon: 'quiz',
    target: 10,
    measure: (stats) => stats.quizzesCompleted,
  },
  {
    id: 'word-explorer',
    title: 'Word Explorer',
    description: 'Learn 100 words',
    icon: 'vocabulary',
    target: 100,
    measure: (stats) => stats.wordsLearned,
  },
  {
    id: 'streak-keeper',
    title: 'Streak Keeper',
    description: 'Study 7 days in a row',
    icon: 'streak',
    target: 7,
    measure: (stats) => stats.longestStreak,
  },
  {
    id: 'sharp-shooter',
    title: 'Sharp Shooter',
    description: `Hold 90% accuracy over at least ${ACCURACY_MIN_ANSWERS} answers`,
    icon: 'statistics',
    target: 90,
    // Accuracy only counts once there is enough of it to mean something.
    measure: (stats) => (stats.totalAnswers >= ACCURACY_MIN_ANSWERS ? stats.accuracy : 0),
    format: (value) => formatPercent(value),
  },
  {
    id: 'grammar-scholar',
    title: 'Grammar Scholar',
    description: 'Finish 5 grammar lessons',
    icon: 'grammar',
    target: 5,
    measure: (stats) => stats.lessonsCompleted,
  },
  {
    id: 'word-master',
    title: 'Master of Words',
    description: 'Master 25 words',
    icon: 'trophy',
    target: 25,
    measure: (stats) => stats.wordsMastered,
  },
  {
    id: 'dedicated-learner',
    title: 'Dedicated Learner',
    description: 'Study for 10 hours in total',
    icon: 'study-time',
    target: MINUTES_TARGET,
    measure: (stats) => stats.studyMinutes,
    format: (value) => formatDuration(value),
  },
];

export const EMPTY_ACHIEVEMENT_STATS: AchievementStats = {
  wordsLearned: 0,
  wordsMastered: 0,
  quizzesCompleted: 0,
  accuracy: 0,
  longestStreak: 0,
  studyMinutes: 0,
  totalAnswers: 0,
  lessonsCompleted: 0,
};

function stateFor(current: number, target: number): AchievementState {
  if (current >= target) return 'earned';
  return current > 0 ? 'in-progress' : 'locked';
}

/**
 * `unlockedAt` is deliberately left off: the progress store keeps running totals rather than an
 * event log, so the moment a badge was earned is not recoverable. Inventing one would be worse
 * than omitting it.
 */
export function deriveAchievements(
  stats: AchievementStats,
  definitions: readonly AchievementDefinition[] = ACHIEVEMENT_DEFINITIONS,
): DerivedAchievement[] {
  return definitions.map((definition) => {
    const raw = definition.measure(stats);
    const current = Math.max(0, Math.min(Math.round(raw), definition.target));
    const state = stateFor(current, definition.target);
    const format = definition.format ?? formatNumber;

    return {
      id: definition.id,
      title: definition.title,
      description: definition.description,
      icon: definition.icon,
      unlocked: state === 'earned',
      state,
      progress: { current, target: definition.target },
      progressLabel: `${format(current)}/${format(definition.target)}`,
    };
  });
}

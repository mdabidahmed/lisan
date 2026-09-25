import { describe, expect, it } from 'vitest';

import {
  ACCURACY_MIN_ANSWERS,
  ACHIEVEMENT_DEFINITIONS,
  EMPTY_ACHIEVEMENT_STATS,
  deriveAchievements,
  type AchievementStats,
  type DerivedAchievement,
} from './achievements';

function derive(overrides: Partial<AchievementStats> = {}): DerivedAchievement[] {
  return deriveAchievements({ ...EMPTY_ACHIEVEMENT_STATS, ...overrides });
}

function badge(id: string, overrides: Partial<AchievementStats> = {}): DerivedAchievement {
  const found = derive(overrides).find((achievement) => achievement.id === id);
  if (!found) throw new Error(`No achievement with id "${id}"`);
  return found;
}

describe('achievement definitions', () => {
  it('keeps the three badges from the reference design, in order, with their thresholds', () => {
    expect(
      ACHIEVEMENT_DEFINITIONS.slice(0, 3).map((definition) => [definition.id, definition.target]),
    ).toEqual([
      ['first-steps', 10],
      ['quiz-master', 10],
      ['word-explorer', 100],
    ]);
  });

  it('gives every definition a unique id and a positive target', () => {
    const ids = ACHIEVEMENT_DEFINITIONS.map((definition) => definition.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const definition of ACHIEVEMENT_DEFINITIONS) {
      expect(definition.target).toBeGreaterThan(0);
    }
  });
});

describe('deriveAchievements thresholds', () => {
  it('locks everything for a learner who has just arrived', () => {
    const achievements = derive();

    expect(achievements).toHaveLength(ACHIEVEMENT_DEFINITIONS.length);
    expect(achievements.every((achievement) => achievement.state === 'locked')).toBe(true);
    expect(achievements.every((achievement) => !achievement.unlocked)).toBe(true);
  });

  it('earns a badge exactly at its threshold, not one short of it', () => {
    expect(badge('first-steps', { wordsLearned: 9 }).state).toBe('in-progress');
    expect(badge('first-steps', { wordsLearned: 10 }).state).toBe('earned');
    expect(badge('first-steps', { wordsLearned: 10 }).unlocked).toBe(true);
  });

  it('reports partial progress the way the design labels it', () => {
    const explorer = badge('word-explorer', { wordsLearned: 24 });

    expect(explorer.state).toBe('in-progress');
    expect(explorer.progress).toEqual({ current: 24, target: 100 });
    expect(explorer.progressLabel).toBe('24/100');
  });

  it('clamps progress at the target so a bar can never overflow', () => {
    const explorer = badge('word-explorer', { wordsLearned: 250 });

    expect(explorer.progress).toEqual({ current: 100, target: 100 });
    expect(explorer.state).toBe('earned');
  });

  it('withholds the accuracy badge until there are enough answers to mean anything', () => {
    const tooFew = badge('sharp-shooter', {
      accuracy: 100,
      totalAnswers: ACCURACY_MIN_ANSWERS - 1,
    });
    expect(tooFew.state).toBe('locked');
    expect(tooFew.progressLabel).toBe('0%/90%');

    const enough = badge('sharp-shooter', { accuracy: 92, totalAnswers: ACCURACY_MIN_ANSWERS });
    expect(enough.state).toBe('earned');
  });

  it('measures streaks against the longest one, so a missed day cannot revoke a badge', () => {
    expect(badge('streak-keeper', { longestStreak: 7 }).state).toBe('earned');
    expect(badge('streak-keeper', { longestStreak: 3 }).progressLabel).toBe('3/7');
  });

  it('formats the study-time badge as a duration rather than a count of minutes', () => {
    expect(badge('dedicated-learner', { studyMinutes: 245 }).progressLabel).toBe('4h 5m/10h');
  });

  it('counts finished grammar lessons towards the grammar badge', () => {
    const scholar = badge('grammar-scholar', { lessonsCompleted: 5 });
    expect(scholar.state).toBe('earned');
  });

  it('never invents an unlock timestamp, because the store keeps no event log', () => {
    const earned = badge('first-steps', { wordsLearned: 40 });
    expect(earned.unlockedAt).toBeUndefined();
  });

  it('accepts a caller-supplied definition list', () => {
    const achievements = deriveAchievements(EMPTY_ACHIEVEMENT_STATS, [
      {
        id: 'only-one',
        title: 'Only One',
        description: 'A single badge',
        icon: 'trophy',
        target: 2,
        measure: () => 1,
      },
    ]);

    expect(achievements).toHaveLength(1);
    expect(achievements[0]?.progressLabel).toBe('1/2');
    expect(achievements[0]?.state).toBe('in-progress');
  });
});

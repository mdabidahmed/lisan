import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PROGRESS_STORAGE_VERSION, STORAGE_KEYS, STORAGE_NAMESPACE } from '@/constants';
import { countLearnedWords } from '@/services/srs';
import { storageService } from '@/services/storage';
import type { ProgressSnapshot, QuizResult, WordProgress } from '@/types';
import { addDays, toDateKey } from '@/utils';

import {
  SNAPSHOT_RETENTION_DAYS,
  useProgressStore,
  type ProgressSummaryData,
} from './progressStore';

const KEY = `${STORAGE_NAMESPACE}:${STORAGE_KEYS.progress}`;

const EMPTY = {
  byWordId: {},
  studyDays: [],
  quizzesCompleted: 0,
  studyMinutes: 0,
  totalCorrect: 0,
  totalAnswers: 0,
  snapshots: [],
};

function actions() {
  return useProgressStore.getState().actions;
}

function progressFor(wordId: string): WordProgress | undefined {
  return useProgressStore.getState().byWordId[wordId];
}

function snapshots(): ProgressSnapshot[] {
  return useProgressStore.getState().snapshots;
}

function dayKey(offset: number): string {
  return toDateKey(addDays(new Date(), offset));
}

function snapshotOn(date: string, overrides: Partial<ProgressSnapshot> = {}): ProgressSnapshot {
  return {
    date,
    wordsLearned: 0,
    quizzesCompleted: 0,
    totalCorrect: 0,
    totalAnswers: 0,
    studyMinutes: 0,
    ...overrides,
  };
}

beforeEach(() => {
  localStorage.clear();
  useProgressStore.setState({ ...EMPTY });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('progressStore.recordAnswer', () => {
  it('creates SRS state for a word on first answer', () => {
    actions().recordAnswer('apple', true);

    const progress = progressFor('apple');
    expect(progress).toMatchObject({
      wordId: 'apple',
      repetitions: 1,
      correctAnswers: 1,
      incorrectAnswers: 0,
      status: 'learning',
    });
    expect(progress?.nextReviewAt).toBeDefined();
  });

  it('advances the SRS ladder across repeated correct answers', () => {
    actions().recordAnswer('apple', true, 5);
    expect(progressFor('apple')?.intervalDays).toBe(1);

    actions().recordAnswer('apple', true, 5);
    expect(progressFor('apple')?.intervalDays).toBe(6);
    expect(progressFor('apple')?.repetitions).toBe(2);

    actions().recordAnswer('apple', true, 5);
    expect(progressFor('apple')?.repetitions).toBe(3);
    expect(progressFor('apple')?.status).toBe('review');

    actions().recordAnswer('apple', true, 5);
    expect(progressFor('apple')?.status).toBe('mastered');
  });

  it('resets the ladder on a wrong answer', () => {
    actions().recordAnswer('apple', true, 5);
    actions().recordAnswer('apple', true, 5);
    actions().recordAnswer('apple', false);

    expect(progressFor('apple')).toMatchObject({
      repetitions: 0,
      incorrectAnswers: 1,
      intervalDays: 1,
      status: 'new',
    });
  });

  it('tracks the running accuracy tallies', () => {
    actions().recordAnswer('apple', true);
    actions().recordAnswer('water', false);
    actions().recordAnswer('book', true);

    const state = useProgressStore.getState();
    expect(state.totalAnswers).toBe(3);
    expect(state.totalCorrect).toBe(2);
  });

  it('keeps other words untouched', () => {
    actions().recordAnswer('apple', true);
    const apple = progressFor('apple');

    actions().recordAnswer('water', true);
    expect(progressFor('apple')).toBe(apple);
  });
});

describe('progressStore.markLearned', () => {
  it('moves a new word into learning without touching accuracy', () => {
    actions().markLearned('tree');

    expect(progressFor('tree')).toMatchObject({ status: 'learning', repetitions: 1 });
    expect(useProgressStore.getState().totalAnswers).toBe(0);
  });
});

describe('progressStore.resetWord', () => {
  it('clears a mature card back to an untouched one', () => {
    actions().recordAnswer('apple', true, 5);
    actions().recordAnswer('apple', true, 5);

    actions().resetWord('apple');

    expect(progressFor('apple')).toEqual({
      wordId: 'apple',
      status: 'new',
      correctAnswers: 0,
      incorrectAnswers: 0,
      repetitions: 0,
      easeFactor: 2.5,
      intervalDays: 0,
    });
    expect(progressFor('apple')?.nextReviewAt).toBeUndefined();
  });

  it('keeps every other word exactly as it was', () => {
    actions().recordAnswer('apple', true);
    actions().recordAnswer('water', true);
    const water = progressFor('water');

    actions().resetWord('apple');

    expect(progressFor('water')).toBe(water);
  });

  it('does nothing at all for a word that was never tracked', () => {
    actions().recordAnswer('apple', true);
    const before = useProgressStore.getState();

    actions().resetWord('never-seen');

    expect(useProgressStore.getState()).toBe(before);
    expect(progressFor('never-seen')).toBeUndefined();
  });

  it('is not study activity, so it never stamps a study day', () => {
    useProgressStore.setState({
      ...EMPTY,
      byWordId: {
        apple: {
          wordId: 'apple',
          status: 'review',
          correctAnswers: 3,
          incorrectAnswers: 0,
          repetitions: 3,
        },
      },
    });

    actions().resetWord('apple');

    // A streak that can be extended by pressing "Reset progress" is not a streak.
    expect(useProgressStore.getState().studyDays).toEqual([]);
  });

  it('leaves the lifetime answer tallies alone, so accuracy cannot be reset', () => {
    actions().recordAnswer('apple', true);
    actions().recordAnswer('apple', false);

    actions().resetWord('apple');

    const state = useProgressStore.getState();
    expect(state.totalAnswers).toBe(2);
    expect(state.totalCorrect).toBe(1);
  });

  it('persists the cleared card', () => {
    actions().recordAnswer('apple', true);

    actions().resetWord('apple');

    const envelope = JSON.parse(localStorage.getItem(KEY) ?? '{}') as {
      data: { byWordId: Record<string, WordProgress> };
    };
    expect(envelope.data.byWordId.apple?.repetitions).toBe(0);
  });
});

describe('progressStore.resetWord and the weekly baseline', () => {
  it('leaves the snapshot for today alone, rather than rebasing the week downwards', () => {
    actions().recordAnswer('apple', true);
    actions().recordAnswer('water', true);
    const before = snapshots();
    expect(before.at(-1)?.wordsLearned).toBe(2);

    actions().resetWord('apple');

    // Today's row still says two, because two is what the learner had when they last studied.
    // Writing one into it would make next week's delta measure from an invented low point.
    expect(snapshots()).toBe(before);
    expect(snapshots().at(-1)?.wordsLearned).toBe(2);
  });

  it('lets the live learned count fall below the baseline, so the drop is reportable', () => {
    actions().recordAnswer('apple', true);
    actions().recordAnswer('water', true);

    actions().resetWord('apple');

    const state = useProgressStore.getState();
    expect(countLearnedWords(state.byWordId)).toBe(1);
    expect(state.snapshots.at(-1)?.wordsLearned).toBe(2);
  });

  it('starts recording the lower count again the next time the learner studies', () => {
    vi.useFakeTimers();

    vi.setSystemTime(new Date(2026, 2, 1, 10));
    actions().recordAnswer('apple', true);
    actions().recordAnswer('water', true);
    actions().resetWord('apple');

    vi.setSystemTime(new Date(2026, 2, 2, 10));
    actions().addStudyMinutes(10);

    expect(snapshots().map((entry) => [entry.date, entry.wordsLearned])).toEqual([
      ['2026-03-01', 2],
      ['2026-03-02', 1],
    ]);
  });
});

describe('progressStore study-day tracking', () => {
  it('records today once, however many answers are given', () => {
    actions().recordAnswer('apple', true);
    actions().recordAnswer('water', true);

    expect(useProgressStore.getState().studyDays).toEqual([toDateKey()]);
  });

  it('appends a new day when the clock rolls over', () => {
    vi.useFakeTimers();

    vi.setSystemTime(new Date(2026, 2, 1, 10, 0, 0));
    actions().recordAnswer('apple', true);

    vi.setSystemTime(new Date(2026, 2, 2, 10, 0, 0));
    actions().recordAnswer('water', true);

    expect(useProgressStore.getState().studyDays).toEqual(['2026-03-01', '2026-03-02']);
  });

  it('counts a study day for marking learned and for logging minutes', () => {
    actions().addStudyMinutes(12);
    expect(useProgressStore.getState().studyMinutes).toBe(12);
    expect(useProgressStore.getState().studyDays).toEqual([toDateKey()]);
  });

  it('ignores nonsense study minutes', () => {
    actions().addStudyMinutes(-5);
    actions().addStudyMinutes(Number.NaN);
    expect(useProgressStore.getState().studyMinutes).toBe(0);
  });
});

describe('progressStore.recordQuizCompletion', () => {
  const result: QuizResult = {
    sessionId: 'session_1',
    quizId: 'quiz_1',
    total: 10,
    correct: 8,
    incorrect: 2,
    skipped: 0,
    accuracy: 80,
    durationMs: 180_000,
    completedAt: new Date().toISOString(),
    answers: [],
  };

  it('rolls up the session without double-counting answers', () => {
    actions().recordAnswer('apple', true);
    actions().recordQuizCompletion(result);

    const state = useProgressStore.getState();
    expect(state.quizzesCompleted).toBe(1);
    expect(state.studyMinutes).toBe(3);
    // The per-answer tallies come from `recordAnswer` alone.
    expect(state.totalAnswers).toBe(1);
  });
});

describe('progressStore.reset', () => {
  it('wipes everything back to the empty state', () => {
    actions().recordAnswer('apple', true);
    actions().recordQuizCompletion({
      sessionId: 's',
      quizId: 'q',
      total: 1,
      correct: 1,
      incorrect: 0,
      skipped: 0,
      accuracy: 100,
      durationMs: 1000,
      completedAt: new Date().toISOString(),
      answers: [],
    });

    actions().reset();

    expect(useProgressStore.getState()).toMatchObject(EMPTY);
  });
});

describe('progressStore snapshots', () => {
  it('records today once, however many times the counters move', () => {
    actions().recordAnswer('apple', true);
    actions().recordAnswer('water', false);
    actions().addStudyMinutes(15);

    expect(snapshots()).toEqual([
      snapshotOn(dayKey(0), {
        wordsLearned: 1,
        totalCorrect: 1,
        totalAnswers: 2,
        studyMinutes: 15,
      }),
    ]);
  });

  it('leaves earlier days alone and appends the new one, oldest first', () => {
    vi.useFakeTimers();

    vi.setSystemTime(new Date(2026, 2, 1, 10));
    actions().recordAnswer('apple', true);

    vi.setSystemTime(new Date(2026, 2, 5, 10));
    actions().recordAnswer('water', true);

    expect(snapshots().map((entry) => [entry.date, entry.wordsLearned])).toEqual([
      ['2026-03-01', 1],
      ['2026-03-05', 2],
    ]);
  });

  it('counts a word as learned exactly when the summary does', () => {
    actions().recordAnswer('apple', true, 5);
    expect(snapshots().at(-1)?.wordsLearned).toBe(1);

    // A lapse drops the word back to `new`, so it stops counting.
    actions().recordAnswer('apple', false);
    expect(progressFor('apple')?.status).toBe('new');
    expect(snapshots().at(-1)?.wordsLearned).toBe(0);
  });

  it('keeps no more than the retention window, dropping the oldest day first', () => {
    vi.useFakeTimers();

    const start = new Date(2026, 0, 1, 10);
    for (let day = 0; day < SNAPSHOT_RETENTION_DAYS + 10; day += 1) {
      vi.setSystemTime(addDays(start, day));
      actions().addStudyMinutes(1);
    }

    const kept = snapshots();
    expect(kept).toHaveLength(SNAPSHOT_RETENTION_DAYS);
    expect(kept[0]?.date).toBe(toDateKey(addDays(start, 10)));
    expect(kept.at(-1)?.date).toBe(toDateKey(addDays(start, SNAPSHOT_RETENTION_DAYS + 9)));
  });

  it('discards a row dated in the future, which only a rolled-back clock can produce', () => {
    useProgressStore.setState({ ...EMPTY, snapshots: [snapshotOn(dayKey(3))] });

    actions().addStudyMinutes(5);

    expect(snapshots().map((entry) => entry.date)).toEqual([dayKey(0)]);
  });

  it('reset wipes the history with everything else', () => {
    actions().recordAnswer('apple', true);
    actions().reset();

    expect(snapshots()).toEqual([]);
  });
});

describe('progressStore.hydrate', () => {
  const restored: ProgressSummaryData = {
    byWordId: {
      apple: {
        wordId: 'apple',
        status: 'review',
        correctAnswers: 3,
        incorrectAnswers: 1,
        repetitions: 3,
      },
    },
    studyDays: ['2026-09-20', '2026-09-21'],
    quizzesCompleted: 4,
    studyMinutes: 92,
    totalCorrect: 18,
    totalAnswers: 20,
    snapshots: [snapshotOn(dayKey(-7), { wordsLearned: 1, quizzesCompleted: 2 })],
  };

  it('replaces every field, rather than merging over what was there', () => {
    actions().recordAnswer('water', true);
    actions().recordQuizCompletion({
      sessionId: 's',
      quizId: 'q',
      total: 1,
      correct: 1,
      incorrect: 0,
      skipped: 0,
      accuracy: 100,
      durationMs: 60_000,
      completedAt: new Date().toISOString(),
      answers: [],
    });

    actions().hydrate(restored);

    const state = useProgressStore.getState();
    expect(state.byWordId).toEqual(restored.byWordId);
    expect(state.studyDays).toEqual(restored.studyDays);
    expect(state.quizzesCompleted).toBe(4);
    expect(state.totalAnswers).toBe(20);
    expect(snapshots()).toEqual(restored.snapshots);
  });

  it('keeps the action bundle callable afterwards', () => {
    actions().hydrate(restored);
    actions().recordAnswer('apple', true);

    expect(useProgressStore.getState().totalAnswers).toBe(21);
  });

  it('persists what it wrote, not just the in-memory copy', () => {
    actions().hydrate(restored);

    expect(localStorage.getItem(KEY) ?? '').toContain('apple');
  });

  it('normalises the history it is handed: duplicates collapse and stale rows go', () => {
    actions().hydrate({
      ...restored,
      snapshots: [
        snapshotOn(dayKey(-(SNAPSHOT_RETENTION_DAYS + 5)), { wordsLearned: 99 }),
        snapshotOn(dayKey(-2), { wordsLearned: 1 }),
        snapshotOn(dayKey(-2), { wordsLearned: 2 }),
      ],
    });

    expect(snapshots()).toEqual([snapshotOn(dayKey(-2), { wordsLearned: 2 })]);
  });
});

describe('progressStore persistence', () => {
  it('round-trips through the storage service', async () => {
    actions().recordAnswer('apple', true);

    const envelope = JSON.parse(localStorage.getItem(KEY) ?? '{}') as {
      version: number;
      data: { byWordId: Record<string, WordProgress> };
    };
    expect(envelope.version).toBe(PROGRESS_STORAGE_VERSION);
    expect(envelope.data.byWordId.apple?.repetitions).toBe(1);

    const persisted = localStorage.getItem(KEY) ?? '';
    // Clearing state also clears storage, so the snapshot is restored before reading it back.
    useProgressStore.setState({ ...EMPTY });
    localStorage.setItem(KEY, persisted);

    await useProgressStore.persist.rehydrate();

    expect(progressFor('apple')?.repetitions).toBe(1);
  });

  it('never persists the action bundle', () => {
    actions().recordAnswer('apple', true);
    const envelope = JSON.parse(localStorage.getItem(KEY) ?? '{}') as { data: object };
    expect(Object.keys(envelope.data)).not.toContain('actions');
  });

  it('recovers from a corrupt payload', async () => {
    localStorage.setItem(KEY, '{{{');
    await useProgressStore.persist.rehydrate();
    expect(useProgressStore.getState()).toMatchObject(EMPTY);
  });

  it('migrates an older payload, dropping malformed fields', async () => {
    storageService.write(
      STORAGE_KEYS.progress,
      { byWordId: {}, studyDays: ['2026-03-01', 7, '2026-03-01'], quizzesCompleted: 'two' },
      0,
    );

    await useProgressStore.persist.rehydrate();

    const state = useProgressStore.getState();
    expect(state.studyDays).toEqual(['2026-03-01']);
    expect(state.quizzesCompleted).toBe(0);
  });

  it('carries a version 1 payload forward, with an empty history rather than a made-up one', async () => {
    storageService.write(
      STORAGE_KEYS.progress,
      {
        byWordId: {
          apple: {
            wordId: 'apple',
            status: 'review',
            correctAnswers: 3,
            incorrectAnswers: 1,
            repetitions: 3,
          },
        },
        studyDays: ['2026-03-01'],
        quizzesCompleted: 4,
        studyMinutes: 92,
        totalCorrect: 18,
        totalAnswers: 20,
      },
      1,
    );

    await useProgressStore.persist.rehydrate();

    const state = useProgressStore.getState();
    expect(progressFor('apple')?.repetitions).toBe(3);
    expect(state.studyDays).toEqual(['2026-03-01']);
    expect(state.quizzesCompleted).toBe(4);
    expect(state.totalAnswers).toBe(20);
    // A baseline cannot be invented after the fact, so the learner waits a week for deltas.
    expect(state.snapshots).toEqual([]);
  });

  it('prunes and repairs the history on rehydrate', async () => {
    storageService.write(
      STORAGE_KEYS.progress,
      {
        ...EMPTY,
        snapshots: [
          snapshotOn(dayKey(-3), { wordsLearned: 4 }),
          snapshotOn(dayKey(-(SNAPSHOT_RETENTION_DAYS + 1)), { wordsLearned: 1 }),
          { date: 'not-a-day', wordsLearned: 2 },
          { date: dayKey(-1), wordsLearned: 'lots', quizzesCompleted: -4 },
          7,
        ],
      },
      PROGRESS_STORAGE_VERSION,
    );

    await useProgressStore.persist.rehydrate();

    expect(snapshots()).toEqual([
      snapshotOn(dayKey(-3), { wordsLearned: 4 }),
      snapshotOn(dayKey(-1)),
    ]);
  });
});

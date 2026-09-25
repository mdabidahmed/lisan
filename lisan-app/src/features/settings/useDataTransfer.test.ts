import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { DEFAULT_SETTINGS, STORAGE_KEYS, STORAGE_NAMESPACE } from '@/constants';
import { useLessonProgressStore } from '@/store/lessonProgressStore';
import { useBookmarksStore } from '@/store/bookmarksStore';
import { useProgressStore } from '@/store/progressStore';
import { useQuizSessionStore } from '@/store/quizSessionStore';
import { useSettingsStore } from '@/store/settingsStore';
import type { QuizResult } from '@/types';

import { serializeBackup } from './dataTransfer';
import { useDataTransfer, type DataTransferApi } from './useDataTransfer';

const QUIZ_RESULT: QuizResult = {
  sessionId: 'session_1',
  quizId: 'quiz_1',
  total: 10,
  correct: 9,
  incorrect: 1,
  skipped: 0,
  accuracy: 90,
  durationMs: 120_000,
  completedAt: '2026-09-21T12:00:00.000Z',
  answers: [],
};

function api(): DataTransferApi {
  return renderHook(() => useDataTransfer()).result.current;
}

function seedEverything(): void {
  useProgressStore.getState().actions.recordAnswer('apple', true);
  useProgressStore.getState().actions.recordQuizCompletion(QUIZ_RESULT);
  useBookmarksStore.getState().actions.add('book');
  useBookmarksStore.getState().actions.add('water');
  useLessonProgressStore.getState().actions.markComplete('definite-article');
  useSettingsStore.getState().actions.update({ theme: 'dark', dailyGoal: 20, language: 'ar' });
  useQuizSessionStore.setState({ lastResult: QUIZ_RESULT });
}

beforeEach(() => {
  localStorage.clear();
  useProgressStore.getState().actions.reset();
  useBookmarksStore.getState().actions.clear();
  useLessonProgressStore.getState().actions.reset();
  useSettingsStore.getState().actions.reset();
  useQuizSessionStore.setState({ session: null, lastResult: null, questionStartedAt: null });
});

describe('useDataTransfer round trip', () => {
  it('restores every slice from a document it exported', () => {
    const transfer = api();
    seedEverything();

    const file = serializeBackup(transfer.snapshot());
    transfer.resetLearningData({ includeSettings: true });

    expect(useProgressStore.getState().byWordId).toEqual({});
    expect(useSettingsStore.getState().theme).toBe(DEFAULT_SETTINGS.theme);

    const outcome = transfer.importFromText(file);

    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(outcome.counts).toEqual({ words: 1, bookmarks: 2, lessons: 1, quizzes: 1 });

    expect(useProgressStore.getState().byWordId.apple?.repetitions).toBe(1);
    expect(useProgressStore.getState().quizzesCompleted).toBe(1);
    expect(useProgressStore.getState().totalAnswers).toBe(1);
    expect(useLessonProgressStore.getState().completedById['definite-article']).toBeDefined();
    expect(useSettingsStore.getState()).toMatchObject({
      theme: 'dark',
      dailyGoal: 20,
      language: 'ar',
    });
  });

  it('keeps bookmarks in the order they were exported', () => {
    const transfer = api();
    seedEverything();

    const exported = useBookmarksStore.getState().ids;
    const file = serializeBackup(transfer.snapshot());
    transfer.resetLearningData();
    transfer.importFromText(file);

    expect(useBookmarksStore.getState().ids).toEqual(exported);
  });

  it('routes settings through the store action, so the anti-FOUC theme key stays in sync', () => {
    const transfer = api();
    seedEverything();
    const file = serializeBackup(transfer.snapshot());

    transfer.resetLearningData({ includeSettings: true });
    transfer.importFromText(file);

    const mirrored = localStorage.getItem(`${STORAGE_NAMESPACE}:${STORAGE_KEYS.theme}`);
    expect(mirrored).toContain('dark');
  });

  it('persists the imported progress, not just the in-memory copy', () => {
    const transfer = api();
    seedEverything();
    const file = serializeBackup(transfer.snapshot());

    transfer.resetLearningData();
    transfer.importFromText(file);

    const raw = localStorage.getItem(`${STORAGE_NAMESPACE}:${STORAGE_KEYS.progress}`) ?? '';
    expect(raw).toContain('apple');
  });

  it('applies only the slices a partial backup contains', () => {
    const transfer = api();
    seedEverything();

    const outcome = transfer.importFromText(
      JSON.stringify({
        kind: 'lisan.backup',
        version: 1,
        exportedAt: '2026-09-21T12:00:00.000Z',
        bookmarks: ['tree'],
      }),
    );

    expect(outcome.ok).toBe(true);
    expect(useBookmarksStore.getState().ids).toEqual(['tree']);
    // Untouched by a bookmarks-only document.
    expect(useProgressStore.getState().byWordId.apple).toBeDefined();
    expect(useSettingsStore.getState().theme).toBe('dark');
  });
});

describe('useDataTransfer progress history', () => {
  it('carries the snapshot history out and back in', () => {
    const transfer = api();
    seedEverything();

    const exported = useProgressStore.getState().snapshots;
    expect(exported).not.toEqual([]);

    const file = serializeBackup(transfer.snapshot());
    transfer.resetLearningData();
    expect(useProgressStore.getState().snapshots).toEqual([]);

    expect(transfer.importFromText(file).ok).toBe(true);
    expect(useProgressStore.getState().snapshots).toEqual(exported);
  });

  it('restores a document written before the history existed, with no history invented', () => {
    const transfer = api();

    const outcome = transfer.importFromText(
      JSON.stringify({
        kind: 'lisan.backup',
        version: 1,
        exportedAt: '2026-09-21T12:00:00.000Z',
        progress: {
          byWordId: {},
          studyDays: ['2026-09-20'],
          quizzesCompleted: 3,
          studyMinutes: 40,
          totalCorrect: 8,
          totalAnswers: 10,
        },
      }),
    );

    expect(outcome.ok).toBe(true);
    expect(useProgressStore.getState().quizzesCompleted).toBe(3);
    expect(useProgressStore.getState().snapshots).toEqual([]);
  });

  it('replaces the progress slice rather than merging the backup over it', () => {
    const transfer = api();
    useProgressStore.getState().actions.recordAnswer('apple', true);
    const file = serializeBackup(transfer.snapshot());

    useProgressStore.getState().actions.recordAnswer('water', true);
    expect(useProgressStore.getState().byWordId.water).toBeDefined();

    transfer.importFromText(file);

    expect(useProgressStore.getState().byWordId.apple).toBeDefined();
    expect(useProgressStore.getState().byWordId.water).toBeUndefined();
    expect(useProgressStore.getState().totalAnswers).toBe(1);
  });

  it('leaves the progress actions in place, so the page keeps working after a restore', () => {
    const transfer = api();
    seedEverything();
    const file = serializeBackup(transfer.snapshot());

    transfer.importFromText(file);
    useProgressStore.getState().actions.recordAnswer('tree', true);

    expect(useProgressStore.getState().byWordId.tree?.repetitions).toBe(1);
  });
});

describe('useDataTransfer rejection', () => {
  it('changes nothing when the file is not JSON', () => {
    const transfer = api();
    seedEverything();
    const before = useProgressStore.getState().byWordId;

    const outcome = transfer.importFromText('<html>nope</html>');

    expect(outcome.ok).toBe(false);
    expect(useProgressStore.getState().byWordId).toBe(before);
  });

  it('changes nothing when the document is damaged', () => {
    const transfer = api();
    seedEverything();
    const before = useProgressStore.getState().byWordId;
    const bookmarksBefore = useBookmarksStore.getState().ids;

    const outcome = transfer.importFromText(
      JSON.stringify({
        kind: 'lisan.backup',
        version: 1,
        exportedAt: '2026-09-21T12:00:00.000Z',
        bookmarks: ['tree'],
        progress: { byWordId: { apple: { wordId: 'apple', status: 'legendary' } } },
      }),
    );

    expect(outcome.ok).toBe(false);
    if (outcome.ok) return;
    expect(outcome.issues.length).toBeGreaterThan(0);
    // A damaged slice rejects the whole document rather than half-importing it.
    expect(useProgressStore.getState().byWordId).toBe(before);
    expect(useBookmarksStore.getState().ids).toBe(bookmarksBefore);
  });

  it('reads a backup from a File', async () => {
    const transfer = api();
    seedEverything();
    const file = new File([serializeBackup(transfer.snapshot())], 'backup.json', {
      type: 'application/json',
    });

    transfer.resetLearningData();
    const outcome = await transfer.importFromFile(file);

    expect(outcome.ok).toBe(true);
    expect(useProgressStore.getState().byWordId.apple).toBeDefined();
  });
});

describe('useDataTransfer reset', () => {
  it('clears learner data but keeps preferences by default', () => {
    const transfer = api();
    seedEverything();

    transfer.resetLearningData();

    expect(useProgressStore.getState().byWordId).toEqual({});
    expect(useProgressStore.getState().studyDays).toEqual([]);
    expect(useBookmarksStore.getState().ids).toEqual([]);
    expect(useLessonProgressStore.getState().completedById).toEqual({});
    expect(useSettingsStore.getState().theme).toBe('dark');
  });

  it('clears the last quiz result, so the activity feed cannot show a deleted quiz', () => {
    const transfer = api();
    seedEverything();

    transfer.resetLearningData();

    expect(useQuizSessionStore.getState().lastResult).toBeNull();
    expect(useQuizSessionStore.getState().session).toBeNull();
    expect(useQuizSessionStore.getState().questionStartedAt).toBeNull();
  });

  it('restores default preferences when asked', () => {
    const transfer = api();
    seedEverything();

    transfer.resetLearningData({ includeSettings: true });

    expect(useSettingsStore.getState()).toMatchObject(DEFAULT_SETTINGS);
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { STORAGE_NAMESPACE } from '@/constants';

import { useLessonProgressStore } from './lessonProgressStore';

const KEY = `${STORAGE_NAMESPACE}:grammar`;

function actions() {
  return useLessonProgressStore.getState().actions;
}

function completedIds(): string[] {
  return Object.keys(useLessonProgressStore.getState().completedById).sort();
}

function envelope(): { version: number; data: { completedById: Record<string, unknown> } } {
  return JSON.parse(localStorage.getItem(KEY) ?? '{}') as ReturnType<typeof envelope>;
}

beforeEach(() => {
  localStorage.clear();
  useLessonProgressStore.setState({ completedById: {} });
});

describe('lessonProgressStore', () => {
  it('records a completion with the time it happened', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-21T10:00:00.000Z'));

    actions().markComplete('definite-article');

    expect(useLessonProgressStore.getState().completedById['definite-article']).toEqual({
      lessonId: 'definite-article',
      completedAt: '2026-09-21T10:00:00.000Z',
    });
  });

  it('keeps the original timestamp when a finished lesson is completed again', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-21T10:00:00.000Z'));
    actions().markComplete('definite-article');

    vi.setSystemTime(new Date('2026-09-22T10:00:00.000Z'));
    actions().markComplete('definite-article');

    expect(useLessonProgressStore.getState().completedById['definite-article']?.completedAt).toBe(
      '2026-09-21T10:00:00.000Z',
    );
  });

  it('un-completes a lesson without touching the others', () => {
    actions().markComplete('definite-article');
    actions().markComplete('sun-and-moon-letters');

    actions().markIncomplete('definite-article');

    expect(completedIds()).toEqual(['sun-and-moon-letters']);
  });

  it('toggles both ways', () => {
    actions().toggle('prepositions');
    expect(completedIds()).toEqual(['prepositions']);

    actions().toggle('prepositions');
    expect(completedIds()).toEqual([]);
  });

  it('ignores an empty lesson id', () => {
    actions().markComplete('');
    expect(completedIds()).toEqual([]);
  });

  it('replaces the whole slice for an import', () => {
    actions().markComplete('definite-article');

    actions().replaceAll([{ lessonId: 'cases', completedAt: '2026-01-01T00:00:00.000Z' }]);

    expect(useLessonProgressStore.getState().completedById).toEqual({
      cases: { lessonId: 'cases', completedAt: '2026-01-01T00:00:00.000Z' },
    });
  });

  it('resets back to empty', () => {
    actions().markComplete('definite-article');
    actions().reset();
    expect(completedIds()).toEqual([]);
  });
});

describe('lessonProgressStore persistence', () => {
  it('writes through the storage service, in the versioned envelope', () => {
    actions().markComplete('definite-article');

    const stored = envelope();
    expect(stored.version).toBe(1);
    expect(Object.keys(stored.data.completedById)).toEqual(['definite-article']);
  });

  it('never persists the action bundle', () => {
    actions().markComplete('definite-article');
    expect(Object.keys(envelope().data)).not.toContain('actions');
  });

  it('rehydrates a completion from storage', async () => {
    actions().markComplete('definite-article');
    const persisted = localStorage.getItem(KEY) ?? '';

    useLessonProgressStore.setState({ completedById: {} });
    localStorage.setItem(KEY, persisted);
    await useLessonProgressStore.persist.rehydrate();

    expect(completedIds()).toEqual(['definite-article']);
  });

  it('recovers from a corrupt payload', async () => {
    localStorage.setItem(KEY, '{{{');
    await useLessonProgressStore.persist.rehydrate();
    expect(completedIds()).toEqual([]);
  });

  it('drops malformed entries when migrating an older payload', async () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        version: 0,
        data: {
          completedById: {
            good: { completedAt: '2026-09-21T10:00:00.000Z' },
            missingDate: {},
            notAnObject: 7,
          },
        },
      }),
    );

    await useLessonProgressStore.persist.rehydrate();

    expect(completedIds()).toEqual(['good']);
  });
});

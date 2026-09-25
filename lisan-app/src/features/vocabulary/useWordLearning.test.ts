import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useProgressStore } from '@/store/progressStore';
import { toDateKey } from '@/utils/date';

import { useWordLearning, type WordLearning } from './useWordLearning';

function learning(wordId = 'engineer'): { current: WordLearning } {
  return renderHook(() => useWordLearning(wordId)).result;
}

beforeEach(() => {
  localStorage.clear();
  useProgressStore.getState().actions.reset();
});

describe('useWordLearning', () => {
  it('reports an untouched word as new and untracked', () => {
    const result = learning();

    expect(result.current.status).toBe('new');
    expect(result.current.isTracked).toBe(false);
    expect(result.current.answers).toBe(0);
    expect(result.current.nextReviewAt).toBeUndefined();
  });

  it('schedules the word when it is marked as learned', () => {
    const result = learning();

    act(() => {
      result.current.markLearned();
    });

    expect(result.current.status).toBe('learning');
    expect(result.current.isTracked).toBe(true);
    expect(result.current.nextReviewAt).toBeDefined();
  });

  it('reports the word accuracy from its own tallies', () => {
    useProgressStore.getState().actions.recordAnswer('engineer', true);
    useProgressStore.getState().actions.recordAnswer('engineer', false);

    const result = learning();

    expect(result.current.answers).toBe(2);
    expect(result.current.accuracy).toBe(50);
  });
});

describe('useWordLearning reset', () => {
  it('clears the card through the store action', () => {
    const result = learning();

    act(() => {
      result.current.markLearned();
    });
    act(() => {
      result.current.reset();
    });

    expect(result.current.status).toBe('new');
    expect(result.current.repetitions).toBe(0);
    expect(result.current.nextReviewAt).toBeUndefined();
    expect(useProgressStore.getState().byWordId.engineer?.repetitions).toBe(0);
  });

  it('clears only the word it was asked about', () => {
    useProgressStore.getState().actions.markLearned('teacher');
    const result = learning();

    act(() => {
      result.current.markLearned();
    });
    act(() => {
      result.current.reset();
    });

    expect(useProgressStore.getState().byWordId.teacher?.status).toBe('learning');
  });

  it('does not extend the streak: the only study day is the one marking learned recorded', () => {
    const result = learning();

    act(() => {
      result.current.markLearned();
    });
    act(() => {
      result.current.reset();
    });

    expect(useProgressStore.getState().studyDays).toEqual([toDateKey()]);
  });

  it('leaves the weekly baseline where the last real study session put it', () => {
    const result = learning();

    act(() => {
      result.current.markLearned();
    });
    const baseline = useProgressStore.getState().snapshots;

    act(() => {
      result.current.reset();
    });

    expect(useProgressStore.getState().snapshots).toBe(baseline);
    expect(baseline.at(-1)?.wordsLearned).toBe(1);
  });

  it('is harmless for a word the learner has never touched', () => {
    const result = learning();

    act(() => {
      result.current.reset();
    });

    expect(result.current.isTracked).toBe(false);
    expect(useProgressStore.getState().byWordId).toEqual({});
  });
});

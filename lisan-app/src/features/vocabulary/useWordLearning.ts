import { useCallback } from 'react';

import { useProgressActions, useWordProgress } from '@/store/progressStore';
import type { WordProgress, WordStatus } from '@/types';

import { answerCount, wordAccuracy } from './wordStatus';

export interface WordLearning {
  progress: WordProgress | undefined;
  status: WordStatus;
  /** 0–100. Zero until the word has been answered at least once. */
  accuracy: number;
  /** Answers recorded against the word, correct or not. */
  answers: number;
  repetitions: number;
  /** ISO 8601, or undefined while the word has never entered the schedule. */
  nextReviewAt: string | undefined;
  /** False while the learner has never touched the word. */
  isTracked: boolean;
  markLearned: () => void;
  reset: () => void;
}

/** Everything the word-detail learning panel needs for one word, and the two writes it offers. */
export function useWordLearning(wordId: string): WordLearning {
  const progress = useWordProgress(wordId);
  const { markLearned, resetWord } = useProgressActions();

  return {
    progress,
    status: progress?.status ?? 'new',
    accuracy: wordAccuracy(progress),
    answers: answerCount(progress),
    repetitions: progress?.repetitions ?? 0,
    nextReviewAt: progress?.nextReviewAt,
    isTracked: progress !== undefined,
    markLearned: useCallback(() => {
      markLearned(wordId);
    }, [markLearned, wordId]),
    reset: useCallback(() => {
      resetWord(wordId);
    }, [resetWord, wordId]),
  };
}

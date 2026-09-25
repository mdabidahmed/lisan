import { describe, expect, it } from 'vitest';

import { practiceModes } from '@/data/practiceModes';

import {
  ALL_CATEGORIES,
  buildQuizConfig,
  directionForMode,
  directionOfQuiz,
  isPracticeModeId,
  MODE_QUIZ_TYPE,
} from './quizConfig';

describe('isPracticeModeId', () => {
  it('accepts every mode the table covers', () => {
    for (const id of Object.keys(MODE_QUIZ_TYPE)) {
      expect(isPracticeModeId(id)).toBe(true);
    }
  });

  it('rejects anything else', () => {
    expect(isPracticeModeId('sudoku')).toBe(false);
    expect(isPracticeModeId('')).toBe(false);
  });
});

describe('buildQuizConfig', () => {
  it('maps a mode to the question type it generates', () => {
    expect(buildQuizConfig('listening', { questionCount: 10, difficulty: 'mixed' }).type).toBe(
      'listening',
    );
    expect(
      buildQuizConfig('arabic-to-english', { questionCount: 10, difficulty: 'mixed' }).type,
    ).toBe('multiple-choice');
    expect(
      buildQuizConfig('english-to-arabic', { questionCount: 10, difficulty: 'mixed' }).type,
    ).toBe('multiple-choice');
  });

  it('keeps the mode alongside the generated type', () => {
    const config = buildQuizConfig('flashcards', { questionCount: 20, difficulty: 'easy' });
    expect(config.mode).toBe('flashcards');
    expect(config.type).toBe('multiple-choice');
  });

  it('omits the category filter rather than sending an empty one', () => {
    for (const categoryId of [undefined, '', ALL_CATEGORIES]) {
      const config = buildQuizConfig('typing', {
        categoryId,
        questionCount: 5,
        difficulty: 'hard',
      });
      expect(config).not.toHaveProperty('categoryId');
    }
  });

  it('passes a real category through', () => {
    const config = buildQuizConfig('typing', {
      categoryId: 'food-dining',
      questionCount: 5,
      difficulty: 'hard',
    });
    expect(config.categoryId).toBe('food-dining');
  });

  it('carries the direction the mode tile promises into the request', () => {
    const forwards = buildQuizConfig('arabic-to-english', {
      questionCount: 10,
      difficulty: 'mixed',
    });
    const backwards = buildQuizConfig('english-to-arabic', {
      questionCount: 10,
      difficulty: 'mixed',
    });

    expect(forwards.direction).toBe('arabic-to-english');
    expect(backwards.direction).toBe('english-to-arabic');
  });

  it('gives every mode a direction, so nothing falls back at render time', () => {
    for (const id of Object.keys(MODE_QUIZ_TYPE)) {
      if (!isPracticeModeId(id)) throw new Error(`${id} is not a mode id`);
      expect(
        buildQuizConfig(id, { questionCount: 5, difficulty: 'mixed' }).direction,
      ).toBeDefined();
    }
  });
});

describe('directionForMode', () => {
  it('never disagrees with the tile it was read from', () => {
    for (const mode of practiceModes) {
      if (mode.direction === undefined) continue;
      expect(directionForMode(mode.id)).toBe(mode.direction);
    }
  });

  it('asks for Arabic in typing and for the meaning everywhere else', () => {
    expect(directionForMode('typing')).toBe('english-to-arabic');
    expect(directionForMode('multiple-choice')).toBe('arabic-to-english');
    expect(directionForMode('listening')).toBe('arabic-to-english');
    expect(directionForMode('flashcards')).toBe('arabic-to-english');
  });
});

describe('directionOfQuiz', () => {
  it('reads the direction a config states', () => {
    expect(
      directionOfQuiz({
        mode: 'english-to-arabic',
        type: 'multiple-choice',
        questionCount: 5,
        difficulty: 'mixed',
        direction: 'english-to-arabic',
      }),
    ).toBe('english-to-arabic');
  });

  it('falls back to the face the type has always had', () => {
    const base = { mode: 'typing', questionCount: 5, difficulty: 'mixed' } as const;

    expect(directionOfQuiz({ ...base, type: 'typing' })).toBe('english-to-arabic');
    expect(directionOfQuiz({ ...base, type: 'multiple-choice' })).toBe('arabic-to-english');
  });
});

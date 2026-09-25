import { describe, expect, it } from 'vitest';

import { hasWordArt } from '@/assets';
import type { QuizConfig, VocabularyWord } from '@/types';
import { containsArabic } from '@/utils';

import { getAllWords } from '../contentSource';

import { generateQuiz } from './quizGenerator';

function imageMatchConfig(overrides: Partial<QuizConfig> = {}): QuizConfig {
  return {
    mode: 'image-match',
    type: 'image-match',
    questionCount: 8,
    difficulty: 'mixed',
    ...overrides,
  };
}

function choiceConfig(overrides: Partial<QuizConfig> = {}): QuizConfig {
  return {
    mode: 'english-to-arabic',
    type: 'multiple-choice',
    questionCount: 10,
    difficulty: 'mixed',
    direction: 'english-to-arabic',
    ...overrides,
  };
}

const byId = new Map(getAllWords().map((word) => [word.id, word]));
const byArabic = new Map(getAllWords().map((word) => [word.arabic, word]));

function wordFor(wordId: string): VocabularyWord {
  const word = byId.get(wordId);
  if (!word) throw new Error(`the quiz asked about an unknown word: ${wordId}`);
  return word;
}

describe('image-match quizzes', () => {
  it('only asks about words that have artwork', () => {
    const quiz = generateQuiz(imageMatchConfig());

    expect(quiz.questions.length).toBeGreaterThan(0);
    for (const question of quiz.questions) {
      expect(hasWordArt(question.wordId)).toBe(true);
    }
  });

  it('offers only illustrated options, including the correct one', () => {
    const quiz = generateQuiz(imageMatchConfig());

    for (const question of quiz.questions) {
      expect(question.imageOptions).toBeDefined();
      expect(question.imageOptions).toContain(question.correctAnswer);
      for (const option of question.imageOptions ?? []) {
        expect(hasWordArt(option)).toBe(true);
      }
    }
  });

  it('widens past a category that has no artwork rather than failing', () => {
    // Abstract & Academic is deliberately unillustrated — concepts do not photograph well.
    const quiz = generateQuiz(imageMatchConfig({ categoryId: 'abstract-academic' }));

    expect(quiz.questions.length).toBeGreaterThan(0);
    for (const question of quiz.questions) {
      expect(hasWordArt(question.wordId)).toBe(true);
    }
  });

  it('is deterministic for a given configuration', () => {
    const first = generateQuiz(imageMatchConfig());
    const second = generateQuiz(imageMatchConfig());

    expect(first.questions.map((question) => question.wordId)).toEqual(
      second.questions.map((question) => question.wordId),
    );
  });
});

describe('other quiz types are unaffected by the artwork constraint', () => {
  it('draws multiple-choice questions from the full corpus', () => {
    // A sample this large makes an all-illustrated draw astronomically unlikely regardless of
    // exactly which words the seed happens to land on — unlike image-match, this type is never
    // filtered down to the illustrated subset, and the assertion below is what actually pins that.
    const quiz = generateQuiz({
      mode: 'multiple-choice',
      type: 'multiple-choice',
      questionCount: 60,
      difficulty: 'mixed',
    });

    expect(quiz.questions).toHaveLength(60);
    expect(quiz.questions.some((question) => !hasWordArt(question.wordId))).toBe(true);
  });
});

describe('prompt direction', () => {
  it('asks arabic-to-english with the Arabic prompt and English answers', () => {
    const quiz = generateQuiz(
      choiceConfig({ mode: 'arabic-to-english', direction: 'arabic-to-english' }),
    );

    expect(quiz.questions).toHaveLength(10);
    for (const question of quiz.questions) {
      const word = wordFor(question.wordId);
      expect(question.question).toBe(word.arabic);
      expect(question.correctAnswer).toBe(word.english);
      expect(question.options).toContain(word.english);
    }
  });

  it('asks english-to-arabic with the English prompt and Arabic answers', () => {
    const quiz = generateQuiz(choiceConfig());

    expect(quiz.questions).toHaveLength(10);
    for (const question of quiz.questions) {
      const word = wordFor(question.wordId);
      expect(question.question).toBe(word.english);
      expect(question.correctAnswer).toBe(word.arabic);
      expect(question.options).toContain(word.arabic);
    }
  });

  it('offers four distinct Arabic options, never the English ones', () => {
    const quiz = generateQuiz(choiceConfig());

    for (const question of quiz.questions) {
      const options = question.options ?? [];
      expect(options).toHaveLength(4);
      expect(new Set(options).size).toBe(4);
      for (const option of options) {
        expect(containsArabic(option)).toBe(true);
      }
    }
  });

  it('draws the Arabic distractors from the same category as the answer', () => {
    // A category filter is the honest test: the pool then holds more than four candidates from
    // the same field, so a distractor from elsewhere would be a real choice, not a shortage.
    const quiz = generateQuiz(choiceConfig({ categoryId: 'food-dining', questionCount: 8 }));

    for (const question of quiz.questions) {
      const word = wordFor(question.wordId);
      for (const option of question.options ?? []) {
        expect(byArabic.get(option)?.categoryId).toBe(word.categoryId);
      }
    }
  });

  it('prefers distractors at the answer\u2019s own level', () => {
    const quiz = generateQuiz(choiceConfig({ questionCount: 20 }));

    const distractorLevels = quiz.questions.flatMap((question) => {
      const word = wordFor(question.wordId);
      return (question.options ?? [])
        .filter((option) => option !== word.arabic)
        .map((option) => byArabic.get(option)?.level === word.level);
    });
    const matching = distractorLevels.filter(Boolean).length;

    expect(matching / distractorLevels.length).toBeGreaterThan(0.8);
  });

  it('types the Arabic in one direction and the English in the other', () => {
    const production = generateQuiz(
      choiceConfig({ mode: 'typing', type: 'typing', direction: 'english-to-arabic' }),
    );
    const recognition = generateQuiz(
      choiceConfig({ mode: 'typing', type: 'typing', direction: 'arabic-to-english' }),
    );

    for (const question of production.questions) {
      const word = wordFor(question.wordId);
      expect(question.question).toBe(word.english);
      expect(question.correctAnswer).toBe(word.arabic);
      expect(question.options).toBeUndefined();
    }

    for (const question of recognition.questions) {
      const word = wordFor(question.wordId);
      expect(question.question).toBe(word.arabic);
      expect(question.correctAnswer).toBe(word.english);
    }
  });

  it('keeps the face each type has always had when no direction is given', () => {
    const typing = generateQuiz({
      mode: 'typing',
      type: 'typing',
      questionCount: 5,
      difficulty: 'mixed',
    });
    const choice = generateQuiz({
      mode: 'multiple-choice',
      type: 'multiple-choice',
      questionCount: 5,
      difficulty: 'mixed',
    });

    expect(typing.questions.every((question) => containsArabic(question.correctAnswer))).toBe(true);
    expect(choice.questions.every((question) => containsArabic(question.question))).toBe(true);
  });

  it('gives the two directions of one mode different quiz ids', () => {
    const forwards = generateQuiz(choiceConfig({ direction: 'arabic-to-english' }));
    const backwards = generateQuiz(choiceConfig({ direction: 'english-to-arabic' }));

    expect(forwards.id).not.toBe(backwards.id);
  });

  it('stays deterministic in either direction', () => {
    expect(generateQuiz(choiceConfig())).toEqual(generateQuiz(choiceConfig()));
  });
});

import { describe, expect, it } from 'vitest';

import type { GrammarLesson } from '@/types';

import { LESSON_QUIZ_QUESTION_COUNT, buildLessonQuiz, scoreLessonQuiz } from './lessonQuiz';

const EXAMPLES = [
  { arabic: 'هٰذَا كِتَابٌ.', english: 'This is a book.', transliteration: 'hādhā kitābun.' },
  { arabic: 'الْبَيْتُ كَبِيرٌ.', english: 'The house is big.' },
  { arabic: 'الشَّمْسُ مُشْرِقَةٌ.', english: 'The sun is shining.' },
  { arabic: 'الْقَمَرُ جَمِيلٌ.', english: 'The moon is beautiful.' },
];

function lessonWith(exampleCount: number, id = 'definite-article'): GrammarLesson {
  return {
    id,
    title: 'The Definite Article',
    arabicTitle: 'أَلْ التَّعْرِيف',
    topic: 'nouns',
    level: 'A1',
    summary: 'Definiteness is marked by a prefix.',
    icon: 'grammar',
    estimatedMinutes: 6,
    sections: EXAMPLES.slice(0, exampleCount).map((example, index) => ({
      id: `section-${String(index)}`,
      heading: `Section ${String(index + 1)}`,
      body: 'Explanation.',
      examples: [example],
    })),
  };
}

describe('buildLessonQuiz', () => {
  it('builds a short check from the lesson examples', () => {
    const questions = buildLessonQuiz(lessonWith(4));

    expect(questions).toHaveLength(LESSON_QUIZ_QUESTION_COUNT);
    for (const question of questions) {
      expect(question.choices).toHaveLength(3);
      expect(new Set(question.choices).size).toBe(3);
      expect(question.choices).toContain(question.correctAnswer);
      expect(question.prompt).not.toBe(question.correctAnswer);
      expect(question.sectionHeading).toMatch(/^Section \d$/);
    }
  });

  it('asks in both directions, with the prompt and answers in opposite languages', () => {
    const questions = buildLessonQuiz(lessonWith(4));
    const arabicSentences = EXAMPLES.map((example) => example.arabic);

    expect(questions.map((question) => question.kind)).toEqual([
      'english-to-arabic',
      'arabic-to-english',
      'english-to-arabic',
    ]);

    for (const question of questions) {
      const answersAreArabic = question.kind === 'english-to-arabic';
      expect(arabicSentences.includes(question.correctAnswer)).toBe(answersAreArabic);
      expect(arabicSentences.includes(question.prompt)).toBe(!answersAreArabic);
    }
  });

  it('is deterministic, so the same lesson always shows the same check', () => {
    expect(buildLessonQuiz(lessonWith(4))).toEqual(buildLessonQuiz(lessonWith(4)));
  });

  it('varies between lessons rather than always picking the same examples', () => {
    const first = buildLessonQuiz(lessonWith(4, 'definite-article'));
    const second = buildLessonQuiz(lessonWith(4, 'sun-and-moon-letters'));

    expect(first.map((question) => question.prompt)).not.toEqual(
      second.map((question) => question.prompt),
    );
  });

  it('skips the check when a lesson has too few examples to hide the answer', () => {
    expect(buildLessonQuiz(lessonWith(2))).toEqual([]);
    expect(buildLessonQuiz(lessonWith(0))).toEqual([]);
  });

  it('never asks more questions than there are examples', () => {
    const questions = buildLessonQuiz(lessonWith(3), { questionCount: 10 });
    expect(questions).toHaveLength(3);
  });

  it('ignores examples with a missing side', () => {
    const lesson = lessonWith(4);
    const questions = buildLessonQuiz({
      ...lesson,
      sections: [
        ...lesson.sections,
        {
          id: 'broken',
          heading: 'Broken',
          body: 'Explanation.',
          examples: [{ arabic: '', english: '' }],
        },
      ],
    });

    for (const question of questions) {
      expect(question.choices).not.toContain('');
    }
  });
});

describe('scoreLessonQuiz', () => {
  it('counts only the questions answered correctly', () => {
    const questions = buildLessonQuiz(lessonWith(4));
    const [first, second, third] = questions;

    const answers: Record<string, string> = {
      ...(first ? { [first.id]: first.correctAnswer } : {}),
      ...(second ? { [second.id]: 'something else' } : {}),
    };

    expect(scoreLessonQuiz(questions, answers)).toBe(1);
    expect(third).toBeDefined();
  });

  it('scores an untouched quiz as zero', () => {
    expect(scoreLessonQuiz(buildLessonQuiz(lessonWith(4)), {})).toBe(0);
  });
});

import { describe, expect, it } from 'vitest';

import { editDistance, gradeAnswer, matchesExpected, normalizeAnswer } from './answerCheck';

/** Vowelled forms as authored in the dataset, with the bare spellings a learner is likely to type. */
const ENGINEER = 'الْمُهَنْدِسُ';
const APPLE = 'تُفَّاح';
const TREE = 'شَجَرَة';

describe('normalizeAnswer', () => {
  it('drops tashkeel from Arabic', () => {
    expect(normalizeAnswer(APPLE)).toBe('تفاح');
  });

  it('folds the alif variants onto a bare alif', () => {
    expect(normalizeAnswer('أمل')).toBe(normalizeAnswer('إمل'));
    expect(normalizeAnswer('آمل')).toBe(normalizeAnswer('امل'));
  });

  it('treats ta marbuta and ha as the same letter', () => {
    expect(normalizeAnswer('شجرة')).toBe(normalizeAnswer('شجره'));
  });

  it('collapses whitespace', () => {
    expect(normalizeAnswer('  تفاح   أحمر ')).toBe('تفاح احمر');
  });

  it('strips transliteration diacritics and case', () => {
    expect(normalizeAnswer('Tuffāḥ')).toBe('tuffah');
    expect(normalizeAnswer('al-muhandisu')).toBe('al muhandisu');
  });
});

describe('gradeAnswer — typed Arabic', () => {
  it('accepts the answer without tashkeel', () => {
    expect(gradeAnswer('تفاح', APPLE)).toBe('correct');
  });

  it('accepts ta marbuta written as ha', () => {
    expect(gradeAnswer('شجره', TREE)).toBe('correct');
  });

  it('accepts a hamza-less alif', () => {
    expect(gradeAnswer('امل', 'أَمَل')).toBe('correct');
  });

  it('ignores surrounding whitespace', () => {
    expect(gradeAnswer('  تفاح  ', APPLE)).toBe('correct');
  });

  it('rejects a different word outright', () => {
    expect(gradeAnswer('كتاب', APPLE)).toBe('incorrect');
  });

  it('rejects an empty answer', () => {
    expect(gradeAnswer('   ', APPLE)).toBe('incorrect');
  });
});

describe('gradeAnswer — near misses', () => {
  it('flags a missing definite article', () => {
    expect(gradeAnswer('مهندس', ENGINEER)).toBe('near-miss');
  });

  it('flags an added definite article', () => {
    expect(gradeAnswer('التفاح', APPLE)).toBe('near-miss');
  });

  it('flags a single dropped letter in a long word', () => {
    expect(gradeAnswer('المهنس', ENGINEER)).toBe('near-miss');
  });

  it('flags two swapped letters', () => {
    expect(gradeAnswer('المهدنس', ENGINEER)).toBe('near-miss');
  });

  it('flags the transliteration when it is offered as an alternative spelling', () => {
    expect(gradeAnswer('tuffah', APPLE, { nearMatches: ['tuffāḥ'] })).toBe('near-miss');
  });

  it('gives a short word no slack, because one letter makes it another word', () => {
    expect(gradeAnswer('مار', 'مَاء')).toBe('incorrect');
  });

  it('will not stretch to an unrelated word of the same length', () => {
    expect(gradeAnswer('المكتبات', ENGINEER)).toBe('incorrect');
  });
});

describe('gradeAnswer — chosen answers', () => {
  it('compares options case- and whitespace-insensitively', () => {
    expect(gradeAnswer(' engineer ', 'Engineer', { type: 'multiple-choice' })).toBe('correct');
  });

  it('never calls a chosen option a near miss', () => {
    expect(gradeAnswer('Enginer', 'Engineer', { type: 'multiple-choice' })).toBe('incorrect');
    expect(gradeAnswer('Teacher', 'Engineer', { type: 'listening' })).toBe('incorrect');
  });

  it('matches image-match tokens exactly', () => {
    expect(gradeAnswer('apple', 'apple', { type: 'image-match' })).toBe('correct');
    expect(gradeAnswer('tree', 'apple', { type: 'image-match' })).toBe('incorrect');
  });
});

describe('gradeAnswer — typed English, the other direction', () => {
  it('accepts the meaning whatever its case and spacing', () => {
    expect(gradeAnswer('  engineer ', 'Engineer')).toBe('correct');
  });

  it('forgives one slip in a long word', () => {
    expect(gradeAnswer('enginer', 'Engineer')).toBe('near-miss');
  });

  it('rejects a different meaning', () => {
    expect(gradeAnswer('Teacher', 'Engineer')).toBe('incorrect');
  });

  it('counts the transliteration as knowing the word but not the meaning', () => {
    expect(gradeAnswer('tuffah', 'Apple', { nearMatches: ['tuffāḥ'] })).toBe('near-miss');
  });

  it('does not apply the Arabic folding to a Latin answer', () => {
    // `normalizeArabic` leaves Latin untouched, so grading Arabic-first would have made the
    // English path case-sensitive.
    expect(matchesExpected('engineer', 'Engineer', 'typing')).toBe(true);
  });
});

describe('matchesExpected', () => {
  it('agrees with gradeAnswer on what counts as correct, in either direction', () => {
    const pairs: [string, string][] = [
      ['تفاح', APPLE],
      ['شجره', TREE],
      ['مهندس', ENGINEER],
      ['', APPLE],
      ['engineer', 'Engineer'],
      ['enginer', 'Engineer'],
      ['Teacher', 'Engineer'],
    ];

    for (const [given, expected] of pairs) {
      expect(matchesExpected(given, expected, 'typing')).toBe(
        gradeAnswer(given, expected, { type: 'typing' }) === 'correct',
      );
    }
  });
});

describe('editDistance', () => {
  it('counts substitutions, insertions and deletions', () => {
    expect(editDistance('kitten', 'sitting')).toBe(3);
    expect(editDistance('book', 'book')).toBe(0);
    expect(editDistance('book', 'boo')).toBe(1);
  });

  it('counts an adjacent swap as one edit', () => {
    expect(editDistance('kitab', 'ktiab')).toBe(1);
  });

  it('bails out once the lengths cannot meet the budget', () => {
    expect(editDistance('a', 'abcdef', 2)).toBeGreaterThan(2);
  });
});

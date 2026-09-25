import { describe, expect, it } from 'vitest';

import { segmentScripts, type ScriptSegment } from './segmentScripts';

/** The Arabic runs, in order — what the caller actually wraps. */
const arabicRuns = (text: string): string[] =>
  segmentScripts(text)
    .filter((segment) => segment.arabic)
    .map((segment) => segment.text);

const texts = (segments: ScriptSegment[]): string[] => segments.map((segment) => segment.text);

describe('segmentScripts', () => {
  it('returns nothing for an empty string', () => {
    expect(segmentScripts('')).toEqual([]);
  });

  it('returns host-language prose as a single run', () => {
    expect(segmentScripts('The house is big.')).toEqual([
      { text: 'The house is big.', arabic: false },
    ]);
  });

  it('returns an Arabic-only string as a single run', () => {
    expect(segmentScripts('الْكِتَابُ')).toEqual([{ text: 'الْكِتَابُ', arabic: true }]);
  });

  it('finds an Arabic run embedded in an English sentence', () => {
    expect(
      segmentScripts('definiteness is marked by attaching الـ to the front of the noun.'),
    ).toEqual([
      { text: 'definiteness is marked by attaching ', arabic: false },
      { text: 'الـ', arabic: true },
      { text: ' to the front of the noun.', arabic: false },
    ]);
  });

  it('finds every run when they alternate', () => {
    const body = 'So كِتَابٌ (kitābun) becomes الْكِتَابُ (al-kitābu).';

    expect(texts(segmentScripts(body))).toEqual([
      'So ',
      'كِتَابٌ',
      ' (kitābun) becomes ',
      'الْكِتَابُ',
      ' (al-kitābu).',
    ]);
  });

  it('starts and ends on Arabic when the string does', () => {
    expect(texts(segmentScripts('كِتَاب means "a book"'))).toEqual(['كِتَاب', ' means "a book"']);
    expect(texts(segmentScripts('the plural of مُهَنْدِس'))).toEqual([
      'the plural of ',
      'مُهَنْدِس',
    ]);
  });
});

describe('segmentScripts — where the boundaries fall', () => {
  /*
    The regression that matters most. `ت ث د ذ` is one right-to-left run to the bidi algorithm, so
    it must stay one element: fourteen isolates would be ordered by the surrounding left-to-right
    base and the learner would read the sun letters backwards.
  */
  it('keeps a space-separated list of letters in one run', () => {
    expect(arabicRuns('The fourteen sun letters are ت ث د ذ ر ز س ش ص ض ط ظ ل ن.')).toEqual([
      'ت ث د ذ ر ز س ش ص ض ط ظ ل ن',
    ]);
  });

  it('holds a run open across punctuation, symbols and digits between Arabic', () => {
    expect(arabicRuns('templates: كِتَاب → كُتُب, بَيْت → بُيُوت.')).toEqual([
      'كِتَاب → كُتُب, بَيْت → بُيُوت',
    ]);
    expect(arabicRuns('you (m./f.) أَنْتَ / أَنْتِ here')).toEqual(['أَنْتَ / أَنْتِ']);
    expect(arabicRuns('counts مِنْ 1 إِلَى here')).toEqual(['مِنْ 1 إِلَى']);
  });

  /*
    Only what sits *between* two stretches of Arabic is glue. A digit trailing a run is left
    outside it, which is a visible difference from what the bidi algorithm alone would do — rule W2
    would read it as an Arabic number and place it inside the right-to-left run. Nothing in
    `src/data` pairs a digit with Arabic that way, and the alternative (sweeping trailing digits in)
    would swallow the numbers in host-language prose that happen to follow a gloss.
  */
  it('leaves a digit that only trails a run outside it', () => {
    expect(texts(segmentScripts('كِتَاب 10'))).toEqual(['كِتَاب', ' 10']);
  });

  it('splits when a word of another script comes between', () => {
    expect(arabicRuns('ذَهَبَ الطُّلَّابُ, not ذَهَبُوا الطُّلَّابُ.')).toEqual([
      'ذَهَبَ الطُّلَّابُ',
      'ذَهَبُوا الطُّلَّابُ',
    ]);
  });

  /*
    A trailing full stop is bidi-neutral and belongs to the English sentence that contains it, not
    to the Arabic. Leaving it outside is what keeps it at the right-hand end of the line where an
    English reader expects it — the `sentence` flow of `ArabicText` is for the other case.
  */
  it('leaves neutrals that only touch one side of a run outside it', () => {
    expect(texts(segmentScripts('is read as الْكِتَابُ.'))).toEqual([
      'is read as ',
      'الْكِتَابُ',
      '.',
    ]);
    expect(texts(segmentScripts('Noun (إسْم)'))).toEqual(['Noun (', 'إسْم', ')']);
  });

  it('takes Arabic punctuation into the run, since it is Arabic', () => {
    expect(arabicRuns('endings: كَتَبْتُ، كَتَبْنَا، كَتَبُوا.')).toEqual([
      'كَتَبْتُ، كَتَبْنَا، كَتَبُوا',
    ]);
  });
});

describe('segmentScripts — what it must not mangle', () => {
  const SAMPLES = [
    '',
    'plain English only',
    'الْكِتَابُ',
    'A bare noun: كِتَاب means "a book".',
    'The fourteen sun letters are ت ث د ذ ر ز س ش ص ض ط ظ ل ن.',
    'Noun (إسْم)',
    'Suffixes ـِي، ـكَ، ـكِ، ـهُ، ـهَا attach to nouns.',
    'Presentation forms ﻻ and ﷲ sit in their own block.',
    'مَطَارَات (maṭārāt)',
    '   ',
    '؟!،',
    'كِتَاب → كُتُب, بَيْت → بُيُوت',
  ];

  it.each(SAMPLES)('reproduces %j when the segments are joined back together', (sample) => {
    expect(
      segmentScripts(sample)
        .map((segment) => segment.text)
        .join(''),
    ).toBe(sample);
  });

  it('never returns an empty segment', () => {
    for (const sample of SAMPLES) {
      for (const segment of segmentScripts(sample)) expect(segment.text).not.toBe('');
    }
  });

  it('keeps harakat, shadda and the superscript alef with their letter', () => {
    // Every mark in this word is a separate code point that a careless split would strip.
    const vowelled = 'هٰذَا الطَّالِبُ';

    expect(arabicRuns(`So ${vowelled} here`)).toEqual([vowelled]);
  });

  it('keeps tatweel inside the run rather than treating it as a separator', () => {
    expect(arabicRuns('the prefix الـ attaches')).toEqual(['الـ']);
    expect(arabicRuns('stretched كــتــاب here')).toEqual(['كــتــاب']);
  });

  it('recognises the presentation forms as Arabic', () => {
    expect(arabicRuns('the ligature ﻻ here')).toEqual(['ﻻ']);
  });

  it('does not treat a byte-order mark as Arabic', () => {
    expect(arabicRuns('a\uFEFFb')).toEqual([]);
  });

  it('is pure: the same input segments the same way every time', () => {
    const body = 'So كِتَابٌ becomes الْكِتَابُ.';

    expect(segmentScripts(body)).toEqual(segmentScripts(body));
  });
});

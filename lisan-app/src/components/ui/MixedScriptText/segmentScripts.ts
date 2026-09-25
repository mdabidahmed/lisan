/**
 * Splits a string of host-language prose into its Arabic and non-Arabic runs.
 *
 * Lives here rather than in `src/utils/arabic.ts` because it is not a text operation: it exists
 * only so that `MixedScriptText` has somewhere to hang an element, and the run boundaries it
 * returns are chosen to be invisible to layout rather than linguistically interesting.
 */

/**
 * Arabic, Arabic Supplement, Arabic Extended-B and -A, and the two presentation-form blocks.
 *
 * Harakat (U+064B–U+065F), the superscript alef (U+0670) and tatweel (U+0640) all sit inside the
 * first range, so a vowelled word is one run and never loses its marks to a boundary. The range
 * stops at U+FEFC, the last presentation form, rather than at the end of the block: U+FEFF is the
 * byte-order mark, which is not Arabic and must not hold a run open.
 */
const ARABIC =
  '\\u0600-\\u06FF\\u0750-\\u077F\\u0870-\\u088E\\u08A0-\\u08FF\\uFB50-\\uFDFF\\uFE70-\\uFEFC';

/**
 * A run of Arabic, extended across anything between two stretches of Arabic that is not a letter.
 *
 * The extension is the whole subtlety. `ت ث د ذ ر ز` is already a single right-to-left run to the
 * bidi algorithm — rule N1 resolves a neutral flanked by two right-to-left characters as
 * right-to-left — so it reads as one sequence from the right. Wrapping each letter separately
 * would make each one an isolate, and isolates are ordered by the *surrounding* base direction,
 * which is left-to-right: the list would come out backwards. Grouping what the bidi algorithm
 * already groups means the markup changes the font and nothing else.
 *
 * A letter of any other script ends the run instead, so the `, not ` in
 * `ذَهَبَ الطُّلَّابُ, not ذَهَبُوا الطُّلَّابُ` splits it in two, as it should. Neither class can
 * match a character of the other, so the alternation cannot backtrack: matching is linear.
 */
const ARABIC_RUN = new RegExp(`[${ARABIC}]+(?:[^\\p{L}${ARABIC}]+[${ARABIC}]+)*`, 'gu');

export interface ScriptSegment {
  text: string;
  /** Whether this run needs `lang="ar"` and the Arabic face. */
  arabic: boolean;
}

/**
 * Segments `text` in order, with no character added, dropped or reordered: joining every
 * `segment.text` back together reproduces the input exactly.
 *
 * An empty string produces no segments, and a string with no Arabic in it produces exactly one.
 */
export function segmentScripts(text: string): ScriptSegment[] {
  const segments: ScriptSegment[] = [];
  let cursor = 0;

  for (const match of text.matchAll(ARABIC_RUN)) {
    const run = match[0];
    if (match.index > cursor) {
      segments.push({ text: text.slice(cursor, match.index), arabic: false });
    }
    segments.push({ text: run, arabic: true });
    cursor = match.index + run.length;
  }

  if (cursor < text.length) segments.push({ text: text.slice(cursor), arabic: false });

  return segments;
}

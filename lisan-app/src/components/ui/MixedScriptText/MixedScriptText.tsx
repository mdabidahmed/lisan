import { Fragment } from 'react';

import { ArabicText } from '@/components/ui/ArabicText';

import { segmentScripts } from './segmentScripts';
import styles from './MixedScriptText.module.css';

export interface MixedScriptTextProps {
  /**
   * One flat string of host-language prose. Not a `ReactNode`: the whole point is to look at the
   * characters, and there is nothing useful to do with a string that has already been marked up.
   */
  children: string;
}

/**
 * Host-language prose with Arabic words set into it — a lesson body explaining that `كِتَابٌ`
 * becomes `الْكِتَابُ`, a card summary naming `الـ`, a part of speech reading `Noun (إسْم)`.
 *
 * The content is authored as flat strings, so until now those words had no element of their own
 * and inherited the Latin face from the sentence around them. `Inter` has no Arabic glyphs, so the
 * browser fell back to whatever the system offered, at body size, with no harakat clearance: a
 * lesson whose entire subject is the sukun and the nunation rendered them at 12px in a face nobody
 * chose. Splitting the string gives each Arabic run a `<span>`, which is all `[lang='ar']` in
 * `global.css` ever needed to reach it.
 *
 * Splitting at render time rather than re-authoring the data as segments is the trade here. The
 * runs are spread across every `body`, `summary` and `heading` in `src/data/grammar.ts` and every
 * `partOfSpeech` in the word lists; hand-segmenting them would be a very large diff that every
 * future content edit would have to keep up. `segmentScripts` cannot fall out of step with the
 * strings because it reads them.
 *
 * Each run goes through `ArabicText` in its default `embedded` flow, so it is marked `lang="ar"`,
 * isolated inline, and given *no* base direction of its own: a right-to-left base inside an
 * English sentence would reorder the Arabic against its Latin neighbours and throw the sentence's
 * punctuation to the wrong end. Only the size is added here, and relatively — see the stylesheet.
 */
export function MixedScriptText({ children }: MixedScriptTextProps) {
  const segments = segmentScripts(children);

  // Overwhelmingly the common case: leave the string exactly as it was, with no element around it.
  if (!segments.some((segment) => segment.arabic)) return <>{children}</>;

  return (
    <>
      {segments.map((segment, index) =>
        segment.arabic ? (
          <ArabicText key={index} className={styles.run}>
            {segment.text}
          </ArabicText>
        ) : (
          // Segments are positional and derived from the string, so the index *is* the identity.
          <Fragment key={index}>{segment.text}</Fragment>
        ),
      )}
    </>
  );
}

import type { ReactNode } from 'react';

// Deep import: the `@/i18n` barrel only re-exports ARABIC_CONTENT_ATTRS, and it is not this
// component's to edit.
import { ARABIC_CONTENT_ATTRS, ARABIC_EMBEDDED_CONTENT_ATTRS } from '@/i18n/contentDirection';

import styles from './ArabicText.module.css';

/** The tags Arabic content is set in across the app: a line in a stack, a title, a heading. */
export type ArabicTextElement = 'span' | 'p' | 'h1' | 'h2' | 'h3';

/**
 * What the Arabic *is*, which is the only thing that decides its base direction.
 *
 * `embedded` — a run set into host-language layout: a head word above its transliteration, a
 * vocabulary item in a tile, a mixed-script value like `مَطَارَات (maṭārāt)`. The run is not a
 * right-to-left thing in its own right, it is one script inside a left-to-right design, so it
 * takes the surrounding base direction and its Latin neighbours stay where the design puts them.
 *
 * `sentence` — a whole Arabic sentence, which genuinely *is* right-to-left content. It needs a
 * right-to-left base or the Unicode Bidi Algorithm mis-places its punctuation: a trailing
 * `.` is bidi-neutral, so rule N2 hands it the embedding direction, and under an inherited
 * left-to-right base that puts the full stop at the right-hand end — the end an Arabic sentence
 * *starts* from. 331 strings in `src/data` end that way.
 *
 * Nothing between the two: a single word is `embedded`, a sentence is `sentence`. Pick by asking
 * whether the string could stand alone as a sentence, not by how long it looks.
 */
export type ArabicTextFlow = 'embedded' | 'sentence';

export interface ArabicTextProps {
  children: ReactNode;
  /** `span` by default. Pick whatever the surrounding markup wants; nothing else changes. */
  as?: ArabicTextElement | undefined;
  /**
   * `embedded` by default, which is the behaviour that is safe on every string. Opt into
   * `sentence` only for self-contained Arabic sentences — see `ArabicTextFlow`.
   */
  flow?: ArabicTextFlow | undefined;
  /** Typography stays with the caller. This component only settles language and direction. */
  className?: string | undefined;
}

/**
 * An Arabic string embedded in host-language layout: a head word above its transliteration, an
 * example sentence above its translation, a card's Arabic subtitle beneath its English one.
 *
 * Every one of those is a line in a stack, and a stack is almost always a `flex-direction: column`
 * container whose default `align-items: stretch` gives each child the container's full width —
 * blockifying an inline `<span>` in the process, so a `<span>` behaves no differently from a `<p>`.
 * Put `dir="rtl"` on a box that wide and `[dir='rtl'] { text-align: right }` throws the Arabic to
 * the far edge of the card, stranded from the transliteration and gloss it belongs with, and the
 * right-to-left base reorders a mixed-script value so `مَطَارَات (maṭārāt)` comes out as
 * `(maṭārāt) مَطَارَات`.
 *
 * So the outer element carries `lang="ar"` and no direction, and the run is isolated inline
 * instead — see `ARABIC_EMBEDDED_CONTENT_ATTRS` and the stylesheet next door. Reach for
 * `ARABIC_CONTENT_ATTRS` directly only for Arabic that is a right-to-left *region* in its own
 * right, such as a pull quote sized to its own content.
 *
 * `flow="sentence"` is the one exception, and it changes nothing about the host: the base
 * direction goes on the *isolate*, which is inline and shrink-to-fit, so the sentence still begins
 * where its column begins and cannot be thrown to the far edge. Inside that box the base is
 * right-to-left, which is what puts a trailing full stop at the left-hand end where Arabic
 * finishes. Putting `dir` on the host instead would bring the stretched-box bug straight back.
 */
export function ArabicText({
  children,
  as: Tag = 'span',
  flow = 'embedded',
  className,
}: ArabicTextProps) {
  return (
    <Tag className={className} {...ARABIC_EMBEDDED_CONTENT_ATTRS}>
      <span
        className={styles.isolate}
        {...(flow === 'sentence' ? { dir: ARABIC_CONTENT_ATTRS.dir } : {})}
      >
        {children}
      </span>
    </Tag>
  );
}

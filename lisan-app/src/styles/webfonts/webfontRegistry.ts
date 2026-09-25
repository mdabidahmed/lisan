/**
 * The web fonts Lisan can fetch after first paint.
 *
 * Everything the product renders by default is self-hosted and precached (`src/styles/fonts.css`).
 * The faces below are the opposite: they are only ever needed by a learner who asked for them —
 * either through an Appearance preference or by opening a screen that renders Urdu — so none of
 * them may appear in `index.html`. Dropping the five-family Google stylesheet into `<head>` would
 * put a render-blocking third-party request on every visitor's critical path and, with the
 * suggested `<link rel="preload">`, push 82 kB of Quranic nastaleeq at people who never open the
 * font settings. `loadWebFont` fetches these instead, at the moment they become relevant.
 *
 * Costs measured against the live CDNs (woff2, already compressed — gzip does nothing):
 *   Amiri           arabic 400 + 700   204 kB   (+ 19 kB latin 400, only if Latin is set in it)
 *   IndoPak         single file         82 kB
 *   Nastaliq Urdu   arabic, all weights 234 kB  (one file backs 400/500/700)
 *   Spectral        latin 400/500/600   43 kB
 *   IBM Plex Mono   latin 400/500       20 kB
 */

/** `@font-face` sources Lisan declares itself rather than delegating to a font CDN. */
export const INDOPAK_NASTALEEQ_URL =
  'https://verses.quran.foundation/fonts/quran/hafs/nastaleeq/indopak/indopak-nastaleeq-waqf-lazim-v4.2.1.woff2';

export type WebFontId = 'amiri' | 'indopak' | 'nastaliqUrdu' | 'spectral' | 'plexMono';

export interface WebFontDescriptor {
  /** Must match the family named in the `tokens.css` stack that this font backs. */
  readonly family: string;
  /**
   * Stylesheet declaring the `@font-face` rules, for families served by a font CDN. Omitted when
   * Lisan declares the rules itself, in which case there is nothing to inject and the CSS Font
   * Loading API alone starts the download.
   */
  readonly stylesheet?: string;
  /** Weights to resolve. A family may ship one file per weight, so each is requested separately. */
  readonly weights: readonly number[];
  /**
   * Glyphs to resolve against. `document.fonts.load` only fetches the `unicode-range` subsets that
   * cover the sample, so this doubles as the declaration of what the app actually renders in the
   * face: Arabic script for the script faces, and Latin plus the transliteration diacritics
   * (ṭ, ā — Latin Extended) for the Latin ones.
   */
  readonly sample: string;
}

const ARABIC_SAMPLE = 'طَالِب';
const LATIN_SAMPLE = 'Aa ṭālib';

export const WEB_FONTS: Readonly<Record<WebFontId, WebFontDescriptor>> = {
  amiri: {
    family: 'Amiri',
    stylesheet: 'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap',
    weights: [400, 700],
    sample: ARABIC_SAMPLE,
  },
  indopak: {
    // Declared in `fonts.css` against `INDOPAK_NASTALEEQ_URL`; no stylesheet to inject.
    family: 'IndoPak Nastaleeq',
    weights: [400],
    sample: ARABIC_SAMPLE,
  },
  nastaliqUrdu: {
    family: 'Noto Nastaliq Urdu',
    stylesheet:
      'https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;500;700&display=swap',
    // Google backs all three weights with the same Arabic file, so this is one download.
    weights: [400, 500, 700],
    sample: ARABIC_SAMPLE,
  },
  spectral: {
    family: 'Spectral',
    stylesheet: 'https://fonts.googleapis.com/css2?family=Spectral:wght@400;500;600&display=swap',
    weights: [400, 500, 600],
    sample: LATIN_SAMPLE,
  },
  plexMono: {
    family: 'IBM Plex Mono',
    stylesheet: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap',
    weights: [400, 500],
    sample: LATIN_SAMPLE,
  },
};

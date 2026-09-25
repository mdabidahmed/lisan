import type { ArabicFont, ReadingFont } from '@/types/settings';

import { loadWebFont } from './loadWebFont';
import type { WebFontId } from './webfontRegistry';

/**
 * Publishes the font preferences to the document root, and fetches whatever they need.
 *
 * Same mechanism as theme, high contrast and large text: a `data-*` attribute on `<html>` selects
 * a block of token overrides in `tokens.css`, and every component keeps reading the token it
 * always read. Nothing downstream knows a font preference exists.
 *
 * `DEFAULT_ARABIC_FONT`/`DEFAULT_READING_FONT` name the self-hosted, zero-fetch baseline face —
 * the one with the least machinery, written with no attribute at all — not the app's preferred
 * starting choice (`DEFAULT_SETTINGS.arabicFont` in `constants/app.ts`, currently IndoPak
 * Nastaleeq). A first-time visitor still gets that real preference, fetched like any other
 * non-baseline face; this constant is only what a corrupted `lisan:settings` or a face that fails
 * to load falls back to.
 */

/**
 * Written verbatim, so this list reads as the selectors it drives. Three places have to agree on
 * them: the override blocks in `tokens.css`, the inline anti-FOUC bootstrap in `index.html`,
 * and here.
 */
export const FONT_ATTRIBUTES = {
  arabic: 'data-font-arabic',
  reading: 'data-font-reading',
  translit: 'data-font-translit',
} as const;

export type FontAttribute = (typeof FONT_ATTRIBUTES)[keyof typeof FONT_ATTRIBUTES];

/** Matches the font fields of `AppSettings`, so settings can be passed straight through. */
export interface FontPreferences {
  readonly arabicFont: ArabicFont;
  readonly readingFont: ReadingFont;
  readonly monospaceTransliteration: boolean;
}

export const DEFAULT_ARABIC_FONT: ArabicFont = 'naskh';
export const DEFAULT_READING_FONT: ReadingFont = 'inter';

/** `null` where the face is already self-hosted and precached, so there is nothing to fetch. */
const ARABIC_FONT_ASSET: Readonly<Record<ArabicFont, WebFontId | null>> = {
  naskh: null,
  amiri: 'amiri',
  indopak: 'indopak',
};

const READING_FONT_ASSET: Readonly<Record<ReadingFont, WebFontId | null>> = {
  inter: null,
  spectral: 'spectral',
};

const ARABIC_FONTS = ['naskh', 'amiri', 'indopak'] as const satisfies readonly ArabicFont[];
const READING_FONTS = ['inter', 'spectral'] as const satisfies readonly ReadingFont[];

/**
 * Narrows a persisted value to a face this build can render.
 *
 * Mirrors `resolveLocale`: the settings store only checks that a stored preference has the right
 * primitive type, so a hand-edited or downgraded `lisan:settings` can name a face that no longer
 * exists. Resolving at the edge means `<html>` never carries an attribute no rule matches, and
 * the stored preference is left alone.
 */
export function resolveArabicFont(value: unknown): ArabicFont {
  return ARABIC_FONTS.find((font) => font === value) ?? DEFAULT_ARABIC_FONT;
}

export function resolveReadingFont(value: unknown): ReadingFont {
  return READING_FONTS.find((font) => font === value) ?? DEFAULT_READING_FONT;
}

/** Synchronous, so it can run in a layout effect and never show a frame of the wrong face. */
export function applyDocumentFonts(root: HTMLElement, preferences: FontPreferences): void {
  const arabic = resolveArabicFont(preferences.arabicFont);
  const reading = resolveReadingFont(preferences.readingFont);

  write(root, FONT_ATTRIBUTES.arabic, arabic === DEFAULT_ARABIC_FONT ? null : arabic);
  write(root, FONT_ATTRIBUTES.reading, reading === DEFAULT_READING_FONT ? null : reading);
  write(root, FONT_ATTRIBUTES.translit, preferences.monospaceTransliteration ? 'mono' : null);
}

/**
 * Fetches the faces the current preferences ask for. Resolves once each has either arrived or
 * been given up on; a face that never arrives has its attribute removed, which returns that slot
 * to the default family.
 */
export async function ensureDocumentFonts(
  root: HTMLElement,
  preferences: FontPreferences,
): Promise<void> {
  const arabic = resolveArabicFont(preferences.arabicFont);
  const reading = resolveReadingFont(preferences.readingFont);

  await Promise.all([
    ensure(root, FONT_ATTRIBUTES.arabic, arabic, ARABIC_FONT_ASSET[arabic]),
    ensure(root, FONT_ATTRIBUTES.reading, reading, READING_FONT_ASSET[reading]),
    ensure(
      root,
      FONT_ATTRIBUTES.translit,
      'mono',
      preferences.monospaceTransliteration ? 'plexMono' : null,
    ),
  ]);
}

async function ensure(
  root: HTMLElement,
  attribute: FontAttribute,
  expected: string,
  id: WebFontId | null,
): Promise<void> {
  if (id === null) return;
  if (await loadWebFont(id)) return;

  // Only clear the slot we were loading for: a slow request must not undo a newer choice the
  // learner has already made.
  if (root.getAttribute(attribute) === expected) root.removeAttribute(attribute);
}

function write(root: HTMLElement, attribute: FontAttribute, value: string | null): void {
  if (value === null) root.removeAttribute(attribute);
  else root.setAttribute(attribute, value);
}

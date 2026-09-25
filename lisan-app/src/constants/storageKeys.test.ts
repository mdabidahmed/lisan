import { describe, expect, it } from 'vitest';

import indexHtml from '../../index.html?raw';

import { ARABIC_FONT_OPTIONS } from '@/constants/app';
import { LOCALE_IDS, LOCALES } from '@/i18n/locales';
import { DEFAULT_ARABIC_FONT } from '@/styles/webfonts/documentFonts';

import { SETTINGS_STORAGE_KEY, THEME_STORAGE_KEY } from './storageKeys';

/**
 * The inline bootstrap in `index.html` is the one piece of the app TypeScript cannot reach. It runs
 * before the first paint, so it cannot import anything, so every value it needs is written out as a
 * literal — storage keys, the non-default Arabic fonts, the locales whose interface has shipped.
 * Each of those literals is half of a contract whose other half is a constant in `src`, with no
 * compiler in between.
 *
 * So the coupling is asserted here instead. This reads the real `index.html` and fails the moment a
 * constant stops appearing in it, which is the only warning a future reader gets before a renamed
 * key turns the bootstrap into a no-op: a white flash for every dark-mode learner, the wrong
 * typeface for a frame, or a right-to-left interface painted left-to-right.
 *
 * Deliberately substring and shape checks rather than a parse — anything cleverer would be a second
 * implementation of the bootstrap to keep in sync.
 */

/** Everything between the tags of the bootstrap's inline `<script>`. */
const bootstrap = /<script>([\s\S]*?)<\/script>/.exec(indexHtml)?.[1] ?? '';

describe('index.html anti-FOUC bootstrap', () => {
  it('is the one inline script, so there is a single place to keep in sync', () => {
    expect(bootstrap).not.toBe('');
    expect(indexHtml.match(/<script>/g)).toHaveLength(1);
  });

  it('reads both storage keys under the names the storage service writes', () => {
    expect(THEME_STORAGE_KEY).toBe('lisan:theme');
    expect(SETTINGS_STORAGE_KEY).toBe('lisan:settings');

    expect(bootstrap).toContain(`'${SETTINGS_STORAGE_KEY}'`);
    expect(bootstrap).toContain(`'${THEME_STORAGE_KEY}'`);
  });

  it('unwraps the `{ version, data }` envelope the storage service writes', () => {
    expect(bootstrap).toContain("'data' in parsed");
  });

  it('lists every non-baseline Arabic font, so a chosen face is set before first paint', () => {
    // "Non-baseline" here is `DEFAULT_ARABIC_FONT` (the self-hosted, zero-attribute face), not
    // `DEFAULT_SETTINGS.arabicFont` (the app's preferred starting choice) — the bootstrap only
    // needs a literal for a face that requires writing a data-attribute at all, which the
    // self-hosted baseline never does, regardless of which face is the settings default.
    const nonBaseline = ARABIC_FONT_OPTIONS.filter((font) => font !== DEFAULT_ARABIC_FONT);

    expect(nonBaseline.length).toBeGreaterThan(0);
    for (const font of nonBaseline) {
      expect(bootstrap).toContain(`'${font}'`);
    }
  });

  it('lists every locale whose interface has shipped, and no locale that has not', () => {
    for (const id of LOCALE_IDS) {
      // `available` gates the first frame's `lang`. An unfinished locale must not appear in it, or
      // the bootstrap paints an interface `resolveLocale` then falls back out of.
      const listed = new RegExp(String.raw`var available = \[[^\]]*'${id}'`).test(bootstrap);

      expect(listed).toBe(LOCALES[id].uiAvailable);
    }
  });

  it('knows the direction of every right-to-left locale it may be handed', () => {
    for (const id of LOCALE_IDS) {
      if (LOCALES[id].dir !== 'rtl') continue;
      const listed = new RegExp(String.raw`var rightToLeft = \[[^\]]*'${id}'`).test(bootstrap);

      expect(listed).toBe(true);
    }
  });
});

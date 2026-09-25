import { describe, expect, it } from 'vitest';

import fontsCss from '../fonts.css?raw';
import tokensCss from '../tokens.css?raw';

import { INDOPAK_NASTALEEQ_URL, WEB_FONTS, type WebFontId } from './webfontRegistry';

/**
 * The registry and the stylesheets are one contract split across two languages.
 *
 * `loadWebFont` asks for a family by name and reports whether it resolved; the name only resolves
 * if a `@font-face` rule or a token stack spells it identically. Get that wrong and nothing
 * throws — the face quietly never matches, the loader reports a failed download, and every
 * learner who picked it is silently returned to the default. These are the assertions that turn
 * that into a test failure.
 */

describe('IndoPak Nastaleeq, declared by us', () => {
  it('is declared in fonts.css under the family the registry asks for', () => {
    expect(fontsCss).toContain(`font-family: '${WEB_FONTS.indopak.family}'`);
    expect(fontsCss).toContain(INDOPAK_NASTALEEQ_URL);
  });

  it('never blocks text, and never blocks Latin text at all', () => {
    const face = fontsCss.slice(fontsCss.indexOf(INDOPAK_NASTALEEQ_URL) - 400);

    expect(face).toContain('font-display: swap');
    // Arabic blocks only. An 82 kB Quranic face must not be a candidate for Latin runs.
    expect(face).toContain('U+0600-06FF');
    expect(face).not.toContain('U+0000-00FF');
  });

  it('has no stylesheet to inject, unlike the CDN-served faces', () => {
    expect(WEB_FONTS.indopak.stylesheet).toBeUndefined();
  });
});

describe('CDN-served faces', () => {
  const cdnFonts = Object.entries(WEB_FONTS).filter(([, font]) => font.stylesheet !== undefined);

  it.each(cdnFonts)('%s requests exactly the weights it declares', (_id, font) => {
    const url = new URL(font.stylesheet ?? '');
    // `get` decodes the `+` separators Google's API uses, so this is the family name verbatim —
    // which is exactly what `document.fonts.load` will ask for.
    const family = url.searchParams.get('family') ?? '';

    expect(url.origin).toBe('https://fonts.googleapis.com');
    expect(family.split(':')[0]).toBe(font.family);
    expect(family.split('@')[1]).toBe(font.weights.join(';'));
    // Without this the browser hides the text until the face arrives, which for a 234 kB
    // nastaliq is a visibly empty row.
    expect(url.searchParams.get('display')).toBe('swap');
  });
});

describe('token stacks', () => {
  const stacks: Readonly<Record<string, WebFontId>> = {
    "[data-font-arabic='amiri']": 'amiri',
    "[data-font-arabic='indopak']": 'indopak',
    "[data-font-reading='spectral']": 'spectral',
    "[data-font-translit='mono']": 'plexMono',
  };

  it.each(Object.entries(stacks))('%s names the family %s resolves', (selector, id) => {
    const block = tokensCss.slice(tokensCss.indexOf(selector));

    expect(tokensCss).toContain(selector);
    expect(block.slice(0, block.indexOf('}'))).toContain(`'${WEB_FONTS[id].family}'`);
  });

  it('keeps the self-hosted default at the end of every stack it overrides', () => {
    // This is what makes a failed download survivable: the fallback is a face that is already
    // on the device, not a system serif nobody designed against.
    const arabicBlocks = [...tokensCss.matchAll(/\[data-font-arabic='[^']+'] \{([^}]*)\}/g)];

    expect(arabicBlocks).toHaveLength(2);
    for (const [, block] of arabicBlocks) {
      expect(block).toContain("'Noto Naskh Arabic'");
    }
  });

  it('applies the Urdu face without a preference, since Urdu is never set in naskh', () => {
    expect(tokensCss).toContain('--font-urdu:');
    expect(tokensCss).toContain(`'${WEB_FONTS.nastaliqUrdu.family}'`);
    // No `[data-font-urdu]` selector exists: correct script is not something to opt into.
    expect(tokensCss).not.toContain('data-font-urdu');
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { loadWebFont, resetWebFonts } from './loadWebFont';
import { WEB_FONTS } from './webfontRegistry';

/**
 * jsdom implements neither stylesheet fetching nor the CSS Font Loading API, so both are stood up
 * here: `load` records what was asked for, and injected `<link>` elements are resolved by hand.
 * That is the point of the tests — the loader has to be observable enough that a failed font can
 * be given up on, and cheap enough that switching a preference back and forth costs one request.
 */

interface LoadCall {
  readonly font: string;
  readonly text: string;
}

function stubFontSet(behaviour: (font: string) => Promise<FontFace[]>) {
  const calls: LoadCall[] = [];
  const load = vi.fn((font: string, text: string) => {
    calls.push({ font, text });
    return behaviour(font);
  });
  Object.defineProperty(document, 'fonts', { value: { load }, configurable: true });
  return calls;
}

/** jsdom never fires `load` on a cross-origin stylesheet, so the test plays the browser. */
function settleStylesheets(event: 'load' | 'error'): void {
  for (const link of document.head.querySelectorAll('link[data-lisan-font]')) {
    link.dispatchEvent(new Event(event));
  }
}

const links = (): HTMLLinkElement[] => [
  ...document.head.querySelectorAll<HTMLLinkElement>('link[data-lisan-font]'),
];

beforeEach(() => {
  resetWebFonts();
});

afterEach(() => {
  resetWebFonts();
  Reflect.deleteProperty(document, 'fonts');
});

describe('loadWebFont', () => {
  it('injects the CDN stylesheet and then pulls every weight the face declares', async () => {
    const calls = stubFontSet(() => Promise.resolve([{} as FontFace]));

    const request = loadWebFont('spectral');
    expect(links()).toHaveLength(1);
    expect(links()[0]?.href).toBe(WEB_FONTS.spectral.stylesheet);
    expect(links()[0]?.rel).toBe('stylesheet');

    settleStylesheets('load');
    await expect(request).resolves.toBe(true);

    // One `document.fonts.load` per weight, each against the sample the registry declares, so
    // only the `unicode-range` subsets the app actually renders are fetched.
    expect(calls.map((call) => call.font)).toEqual([
      '400 1em "Spectral"',
      '500 1em "Spectral"',
      '600 1em "Spectral"',
    ]);
    expect(new Set(calls.map((call) => call.text))).toEqual(new Set([WEB_FONTS.spectral.sample]));
  });

  it('skips the stylesheet for a face Lisan declares itself', async () => {
    stubFontSet(() => Promise.resolve([{} as FontFace]));

    await expect(loadWebFont('indopak')).resolves.toBe(true);

    // IndoPak's `@font-face` lives in fonts.css against our own URL; there is nothing to inject.
    expect(links()).toHaveLength(0);
  });

  it('is idempotent: switching back and forth never injects or downloads twice', async () => {
    const calls = stubFontSet(() => Promise.resolve([{} as FontFace]));

    const first = loadWebFont('amiri');
    const second = loadWebFont('amiri');
    expect(second).toBe(first);

    settleStylesheets('load');
    await Promise.all([first, second, loadWebFont('amiri')]);

    expect(links()).toHaveLength(1);
    expect(calls).toHaveLength(WEB_FONTS.amiri.weights.length);
  });

  it('reports failure and cleans up when the stylesheet cannot be fetched', async () => {
    const calls = stubFontSet(() => Promise.resolve([{} as FontFace]));

    const request = loadWebFont('plexMono');
    settleStylesheets('error');

    await expect(request).resolves.toBe(false);
    // The dead <link> is removed, so it can never be mistaken for a face that is present.
    expect(links()).toHaveLength(0);
    expect(calls).toHaveLength(0);
  });

  it('reports failure when the face itself cannot be downloaded', async () => {
    stubFontSet(() => Promise.reject(new Error('NetworkError')));

    await expect(loadWebFont('indopak')).resolves.toBe(false);
  });

  it('reports failure when the family resolves to no face at all', async () => {
    stubFontSet(() => Promise.resolve([]));

    await expect(loadWebFont('indopak')).resolves.toBe(false);
  });

  it('caches the failure, so a face that cannot load is not retried on every render', async () => {
    const calls = stubFontSet(() => Promise.reject(new Error('NetworkError')));

    await expect(loadWebFont('indopak')).resolves.toBe(false);
    await expect(loadWebFont('indopak')).resolves.toBe(false);

    expect(calls).toHaveLength(1);
  });

  it('treats a missing Font Loading API as success, because the CSS applies regardless', async () => {
    // Pre-2016 browsers and jsdom. The `@font-face` rules still drive rendering; all that is lost
    // is the ability to confirm, and reporting failure would drop a face that is working.
    expect('fonts' in document).toBe(false);

    const request = loadWebFont('spectral');
    settleStylesheets('load');

    await expect(request).resolves.toBe(true);
  });
});

import { describe, expect, it } from 'vitest';

import { isChunkLoadError } from './chunkError';

/**
 * The messages real engines produce when an `import()` cannot be fetched, verbatim. They are the
 * whole basis of the predicate, so they are pinned here rather than paraphrased: if a browser ever
 * rewords one, this file is where that shows up.
 */
const BROWSER_MESSAGES: readonly [engine: string, message: string][] = [
  [
    'Chromium',
    'Failed to fetch dynamically imported module: https://lisan.app/assets/Settings-B7xK2p9q.js',
  ],
  [
    'Firefox',
    'error loading dynamically imported module: https://lisan.app/assets/Settings-B7xK2p9q.js',
  ],
  ['Safari', 'Importing a module script failed.'],
];

/**
 * Errors the app genuinely produces, which must keep reaching the error UI. `Failed to fetch` is
 * the one that matters most: it is what a dropped network request throws, it is common, and it
 * opens with the same two words as the Chromium message.
 */
const ORDINARY_MESSAGES: readonly [label: string, message: string][] = [
  ['a failed network request', 'Failed to fetch'],
  ['a failed request with a URL', 'TypeError: Failed to fetch https://lisan.app/api/words'],
  ['a render bug', "Cannot read properties of undefined (reading 'translation')"],
  ['a minified React invariant', 'Minified React error #185; visit https://react.dev/errors/185'],
  ['a missing subresource', 'Failed to load resource: the server responded with a status of 404'],
  ['a thrown assertion', 'Lisan failed to start: #root is missing from index.html'],
  ['an empty message', ''],
];

describe('isChunkLoadError', () => {
  it.each(BROWSER_MESSAGES)('matches the %s wording', (_engine, message) => {
    expect(isChunkLoadError(new Error(message))).toBe(true);
  });

  it('matches regardless of the case an engine chooses', () => {
    expect(isChunkLoadError(new Error('FAILED TO FETCH DYNAMICALLY IMPORTED MODULE: /a.js'))).toBe(
      true,
    );
  });

  it('matches the TypeError subclass the platform actually throws', () => {
    expect(
      isChunkLoadError(new TypeError('Failed to fetch dynamically imported module: /a.js')),
    ).toBe(true);
  });

  it.each(ORDINARY_MESSAGES)('does not match %s', (_label, message) => {
    expect(isChunkLoadError(new Error(message))).toBe(false);
  });

  it('does not match a partial phrase that names no module-loading step', () => {
    // Half of the Chromium wording, and the half that is about fetching rather than about modules.
    expect(isChunkLoadError(new Error('Failed to fetch dynamically'))).toBe(false);
    expect(isChunkLoadError(new Error('dynamically imported module'))).toBe(false);
  });

  it.each([
    ['null', null],
    ['undefined', undefined],
    ['a number', 42],
  ])('does not match %s', (_label, value) => {
    expect(isChunkLoadError(value)).toBe(false);
  });

  it('does not match a bare string, even the right one', () => {
    // A `throw 'string'` somewhere in the app must never be read as a stale deploy.
    expect(isChunkLoadError('Failed to fetch dynamically imported module: /a.js')).toBe(false);
  });

  it('does not match a plain object wearing the right message', () => {
    expect(
      isChunkLoadError({ message: 'Failed to fetch dynamically imported module: /a.js' }),
    ).toBe(false);
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SESSION_STORAGE_KEYS, STORAGE_NAMESPACE } from '@/constants';
import { storageService } from '@/services/storage';

import { hardReload } from './hardReload';
import {
  canRecoverFromStaleApp,
  recoverFromStaleApp,
  RELOAD_GUARD_WINDOW_MS,
} from './staleAppRecovery';

vi.mock('./hardReload', () => ({ hardReload: vi.fn() }));

const MARKER_KEY = `${STORAGE_NAMESPACE}:${SESSION_STORAGE_KEYS.staleReload}`;

/** A fixed clock, so every assertion about the guard window is exact rather than approximate. */
const NOW = Date.UTC(2026, 8, 22, 9, 0, 0);

function chunkError(): Error {
  return new TypeError(
    'Failed to fetch dynamically imported module: https://lisan.app/assets/Settings-B7xK2p9q.js',
  );
}

/**
 * jsdom implements no service worker, so `navigator.serviceWorker` is absent by default — which is
 * also the state of every browser on plain HTTP, and the path most of these tests take.
 */
function stubServiceWorker(update: () => Promise<void>): { update: ReturnType<typeof vi.fn> } {
  const worker = { update: vi.fn(update) };
  Object.defineProperty(navigator, 'serviceWorker', {
    configurable: true,
    value: { getRegistration: vi.fn().mockResolvedValue(worker) },
  });
  return worker;
}

beforeEach(() => {
  sessionStorage.clear();
});

afterEach(() => {
  Reflect.deleteProperty(navigator, 'serviceWorker');
  sessionStorage.clear();
});

describe('canRecoverFromStaleApp', () => {
  it('accepts a failed dynamic import', () => {
    expect(canRecoverFromStaleApp(chunkError(), NOW)).toBe(true);
  });

  it('rejects an ordinary error, whatever the guard says', () => {
    expect(canRecoverFromStaleApp(new Error('Failed to fetch'), NOW)).toBe(false);
    expect(canRecoverFromStaleApp(new Error('Cannot read properties of undefined'), NOW)).toBe(
      false,
    );
  });

  it('changes nothing it reads, so a boundary can call it while deriving state', () => {
    expect(canRecoverFromStaleApp(chunkError(), NOW)).toBe(true);
    expect(sessionStorage.getItem(MARKER_KEY)).toBeNull();
    // Still true: asking does not use up the one attempt.
    expect(canRecoverFromStaleApp(chunkError(), NOW)).toBe(true);
  });

  it('ignores a marker that is not the shape it wrote', () => {
    sessionStorage.setItem(MARKER_KEY, JSON.stringify({ version: 1, data: { at: 'yesterday' } }));
    expect(canRecoverFromStaleApp(chunkError(), NOW)).toBe(true);
  });
});

describe('recoverFromStaleApp', () => {
  it('records the attempt with its timestamp and reloads', async () => {
    expect(recoverFromStaleApp(chunkError(), NOW)).toBe(true);

    expect(JSON.parse(sessionStorage.getItem(MARKER_KEY) ?? '{}')).toEqual({
      version: 1,
      data: { at: NOW },
    });
    await vi.waitFor(() => {
      expect(hardReload).toHaveBeenCalledTimes(1);
    });
  });

  it('does not reload for an ordinary error, and leaves no marker behind', async () => {
    expect(recoverFromStaleApp(new Error('Cannot read properties of undefined'), NOW)).toBe(false);

    expect(sessionStorage.getItem(MARKER_KEY)).toBeNull();
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
    expect(hardReload).not.toHaveBeenCalled();
  });

  it('refuses a second attempt while the marker is fresh', async () => {
    expect(recoverFromStaleApp(chunkError(), NOW)).toBe(true);
    await vi.waitFor(() => {
      expect(hardReload).toHaveBeenCalledTimes(1);
    });

    // The reloaded tab fails the same way a second later. This is the loop, and it stops here.
    expect(recoverFromStaleApp(chunkError(), NOW + 1_000)).toBe(false);
    expect(recoverFromStaleApp(chunkError(), NOW + RELOAD_GUARD_WINDOW_MS - 1)).toBe(false);
    expect(hardReload).toHaveBeenCalledTimes(1);
  });

  it('reloads exactly once however many times the same failure recurs inside the window', () => {
    let permitted = 0;
    for (let elapsed = 0; elapsed < RELOAD_GUARD_WINDOW_MS; elapsed += 1_000) {
      if (recoverFromStaleApp(chunkError(), NOW + elapsed)) permitted += 1;
    }

    expect(permitted).toBe(1);
  });

  it('permits a fresh attempt once the marker has expired', async () => {
    expect(recoverFromStaleApp(chunkError(), NOW)).toBe(true);

    // The next deploy, days later, in the same long-lived tab.
    const later = NOW + RELOAD_GUARD_WINDOW_MS + 1;
    expect(recoverFromStaleApp(chunkError(), later)).toBe(true);
    expect(JSON.parse(sessionStorage.getItem(MARKER_KEY) ?? '{}')).toEqual({
      version: 1,
      data: { at: later },
    });
    await vi.waitFor(() => {
      expect(hardReload).toHaveBeenCalledTimes(2);
    });
  });

  it('refuses to reload when the marker cannot be stored', async () => {
    // Safari private mode. Reloading without a loop guard is worse than not reloading at all.
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('denied', 'SecurityError');
    });
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(recoverFromStaleApp(chunkError(), NOW)).toBe(false);
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
    expect(hardReload).not.toHaveBeenCalled();
  });

  it('asks the service worker for a new version before reloading', async () => {
    const worker = stubServiceWorker(() => Promise.resolve());

    expect(recoverFromStaleApp(chunkError(), NOW)).toBe(true);

    await vi.waitFor(() => {
      expect(hardReload).toHaveBeenCalledTimes(1);
    });
    expect(worker.update).toHaveBeenCalledTimes(1);
  });

  it('reloads anyway when the service worker check fails', async () => {
    stubServiceWorker(() => Promise.reject(new Error('offline')));

    expect(recoverFromStaleApp(chunkError(), NOW)).toBe(true);

    await vi.waitFor(() => {
      expect(hardReload).toHaveBeenCalledTimes(1);
    });
  });

  it('reloads anyway when the service worker check never settles', async () => {
    vi.useFakeTimers();
    stubServiceWorker(() => new Promise<void>(() => undefined));

    expect(recoverFromStaleApp(chunkError(), NOW)).toBe(true);
    expect(hardReload).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(3_000);
    expect(hardReload).toHaveBeenCalledTimes(1);
  });
});

describe('the marker itself', () => {
  it('lives in sessionStorage only, so a new tab is never held back by an old tab', () => {
    recoverFromStaleApp(chunkError(), NOW);

    expect(sessionStorage.getItem(MARKER_KEY)).not.toBeNull();
    expect(localStorage.getItem(MARKER_KEY)).toBeNull();
    expect(
      storageService.session.read(SESSION_STORAGE_KEYS.staleReload, { fallback: null }),
    ).toEqual({ at: NOW });
  });
});

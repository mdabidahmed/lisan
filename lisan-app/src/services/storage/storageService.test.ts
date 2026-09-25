import { afterEach, describe, expect, it, vi } from 'vitest';

import { SESSION_STORAGE_KEYS, STORAGE_KEYS, STORAGE_NAMESPACE } from '@/constants';

import { createMigrator, storageService } from './storageService';
import { createZustandStorage } from './zustandStorage';

const SETTINGS_KEY = `${STORAGE_NAMESPACE}:${STORAGE_KEYS.settings}`;
const STALE_RELOAD_KEY = `${STORAGE_NAMESPACE}:${SESSION_STORAGE_KEYS.staleReload}`;

interface Payload {
  dailyGoal: number;
  theme: string;
}

const fallback: Payload = { dailyGoal: 10, theme: 'system' };

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
  sessionStorage.clear();
});

describe('storageService', () => {
  it('round-trips a value through the versioned envelope', () => {
    const value: Payload = { dailyGoal: 25, theme: 'dark' };

    expect(storageService.write(STORAGE_KEYS.settings, value)).toBe(true);
    expect(storageService.read<Payload>(STORAGE_KEYS.settings, { fallback })).toEqual(value);

    const raw = localStorage.getItem(SETTINGS_KEY);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw ?? '{}')).toEqual({ version: 1, data: value });
  });

  it('namespaces every key with the lisan prefix', () => {
    storageService.write(STORAGE_KEYS.bookmarks, ['apple']);
    expect(localStorage.getItem(`${STORAGE_NAMESPACE}:${STORAGE_KEYS.bookmarks}`)).not.toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.bookmarks)).toBeNull();
  });

  it('falls back when the stored JSON is corrupt', () => {
    localStorage.setItem(SETTINGS_KEY, '{ not json');
    expect(storageService.read<Payload>(STORAGE_KEYS.settings, { fallback })).toBe(fallback);
  });

  it('falls back when the stored value is not an envelope', () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ dailyGoal: 4 }));
    expect(storageService.read<Payload>(STORAGE_KEYS.settings, { fallback })).toBe(fallback);
  });

  it('falls back when the key is missing', () => {
    expect(storageService.read<Payload>(STORAGE_KEYS.settings, { fallback })).toBe(fallback);
  });

  it('runs migrate on a version mismatch', () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ version: 0, data: { goal: 30 } }));

    const migrate = vi.fn((data: unknown, fromVersion: number): Payload | null => {
      expect(fromVersion).toBe(0);
      const record = data as { goal?: number };
      return { dailyGoal: record.goal ?? fallback.dailyGoal, theme: 'system' };
    });

    const result = storageService.read<Payload>(STORAGE_KEYS.settings, { fallback, migrate });

    expect(migrate).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ dailyGoal: 30, theme: 'system' });
  });

  it('falls back when migrate declines the payload', () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ version: 0, data: { goal: 30 } }));
    const migrate = createMigrator<Payload>({ 99: () => ({ dailyGoal: 1, theme: 'light' }) });

    expect(storageService.read<Payload>(STORAGE_KEYS.settings, { fallback, migrate })).toBe(
      fallback,
    );
  });

  it('returns false from write when setItem throws', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('exceeded the quota', 'QuotaExceededError');
    });
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(storageService.write(STORAGE_KEYS.settings, fallback)).toBe(false);
    expect(warn).toHaveBeenCalled();
  });

  it('reports isAvailable false when localStorage throws', () => {
    expect(storageService.isAvailable()).toBe(true);

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('denied', 'SecurityError');
    });

    expect(storageService.isAvailable()).toBe(false);
  });

  it('reports isAvailable false when localStorage is absent', () => {
    vi.stubGlobal('localStorage', undefined);
    expect(storageService.isAvailable()).toBe(false);
    expect(storageService.read<Payload>(STORAGE_KEYS.settings, { fallback })).toBe(fallback);
    expect(storageService.write(STORAGE_KEYS.settings, fallback)).toBe(false);
    vi.unstubAllGlobals();
  });

  it('removes a single key and clears only namespaced keys', () => {
    localStorage.setItem('unrelated', 'keep me');
    storageService.write(STORAGE_KEYS.settings, fallback);
    storageService.write(STORAGE_KEYS.bookmarks, ['apple']);

    storageService.remove(STORAGE_KEYS.settings);
    expect(localStorage.getItem(SETTINGS_KEY)).toBeNull();

    storageService.clearAll();
    expect(localStorage.getItem(`${STORAGE_NAMESPACE}:${STORAGE_KEYS.bookmarks}`)).toBeNull();
    expect(localStorage.getItem('unrelated')).toBe('keep me');
  });
});

describe('storageService.session', () => {
  it('round-trips through sessionStorage using the same namespace and envelope', () => {
    expect(storageService.session.write(SESSION_STORAGE_KEYS.staleReload, { at: 1_700_000 })).toBe(
      true,
    );

    expect(JSON.parse(sessionStorage.getItem(STALE_RELOAD_KEY) ?? '{}')).toEqual({
      version: 1,
      data: { at: 1_700_000 },
    });
    expect(
      storageService.session.read(SESSION_STORAGE_KEYS.staleReload, { fallback: null }),
    ).toEqual({ at: 1_700_000 });
  });

  it('keeps the two areas apart, so a tab-scoped value never outlives the tab', () => {
    storageService.session.write(SESSION_STORAGE_KEYS.staleReload, { at: 1 });

    expect(localStorage.getItem(STALE_RELOAD_KEY)).toBeNull();
    expect(sessionStorage.getItem(STALE_RELOAD_KEY)).not.toBeNull();
  });

  it('falls back when the key is missing', () => {
    expect(storageService.session.read(SESSION_STORAGE_KEYS.staleReload, { fallback: null })).toBe(
      null,
    );
  });

  it('reports a failed write instead of throwing when the area is unusable', () => {
    // Safari's private mode: the property exists but every write raises.
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('denied', 'SecurityError');
    });
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(storageService.session.write(SESSION_STORAGE_KEYS.staleReload, { at: 1 })).toBe(false);
  });

  it('reports a failed write when sessionStorage is absent altogether', () => {
    vi.stubGlobal('sessionStorage', undefined);

    expect(storageService.session.write(SESSION_STORAGE_KEYS.staleReload, { at: 1 })).toBe(false);
    expect(storageService.session.read(SESSION_STORAGE_KEYS.staleReload, { fallback: null })).toBe(
      null,
    );

    vi.unstubAllGlobals();
  });
});

describe('createZustandStorage', () => {
  it('flattens zustand state onto the storage envelope', () => {
    const storage = createZustandStorage();

    storage.setItem(
      STORAGE_KEYS.settings,
      JSON.stringify({ state: { theme: 'dark', textSize: 'large' }, version: 1 }),
    );

    // The anti-FOUC script reads `parsed.data.textSize` directly.
    expect(JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}')).toEqual({
      version: 1,
      data: { theme: 'dark', textSize: 'large' },
    });

    expect(storage.getItem(STORAGE_KEYS.settings)).toBe(
      JSON.stringify({ state: { theme: 'dark', textSize: 'large' }, version: 1 }),
    );
  });

  it('returns null for missing or unreadable entries', () => {
    const storage = createZustandStorage();
    expect(storage.getItem(STORAGE_KEYS.settings)).toBeNull();

    localStorage.setItem(SETTINGS_KEY, 'not json');
    expect(storage.getItem(STORAGE_KEYS.settings)).toBeNull();
  });

  it('ignores unparsable writes instead of throwing', () => {
    const storage = createZustandStorage();
    expect(() => {
      storage.setItem(STORAGE_KEYS.settings, 'not json');
    }).not.toThrow();
    expect(localStorage.getItem(SETTINGS_KEY)).toBeNull();
  });

  it('removes entries', () => {
    const storage = createZustandStorage();
    storage.setItem(
      STORAGE_KEYS.settings,
      JSON.stringify({ state: { theme: 'dark' }, version: 1 }),
    );
    storage.removeItem(STORAGE_KEYS.settings);
    expect(localStorage.getItem(SETTINGS_KEY)).toBeNull();
  });
});

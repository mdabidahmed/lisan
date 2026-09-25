import {
  STORAGE_NAMESPACE,
  STORAGE_SCHEMA_VERSION,
  type SessionStorageKey,
  type StorageKey,
} from '@/constants';

/**
 * The one place in the app that talks to Web Storage.
 *
 * Every value is wrapped in `{ version, data }` so a persisted shape can be migrated later. The
 * inline anti-FOUC script in `index.html` parses the same envelope for `lisan:theme` and
 * `lisan:settings`, so the format is a contract, not an implementation detail.
 *
 * `globalThis.localStorage` is read instead of `window.localStorage` on purpose: the property is
 * absent during SSR/prerender and throws `SecurityError` in Safari private mode, and ESLint
 * forbids `window.localStorage` everywhere so that nothing bypasses this module.
 *
 * `sessionStorage` is reached through the same plumbing under `storageService.session`. It is a
 * separate area rather than a separate module because everything that makes this one careful —
 * the namespace, the envelope, the absent-backend and quota-exceeded handling — applies verbatim;
 * only the lifetime differs, and the callers that want a tab-scoped lifetime are few.
 */

export interface StorageEnvelope<T = unknown> {
  version: number;
  data: T;
}

export interface ReadOptions<T> {
  fallback: T;
  /** Expected envelope version. Defaults to `STORAGE_SCHEMA_VERSION`. */
  version?: number | undefined;
  /** Called when the stored version differs. Returning `null` falls back. */
  migrate?: ((data: unknown, fromVersion: number) => T | null) | undefined;
}

/** Map of `fromVersion -> upgrade`, for stores that need more than one hop. */
export type StorageMigrations<T> = Record<number, (data: unknown) => T>;

/** Which Web Storage area a call addresses. `local` outlives the tab, `session` does not. */
type StorageArea = 'local' | 'session';

function namespaced(key: string): string {
  return `${STORAGE_NAMESPACE}:${key}`;
}

interface StorageScope {
  localStorage?: Storage | undefined;
  sessionStorage?: Storage | undefined;
}

function getBackend(area: StorageArea = 'local'): Storage | null {
  try {
    const scope = globalThis as StorageScope;
    const storage = area === 'local' ? scope.localStorage : scope.sessionStorage;
    return typeof storage?.getItem === 'function' ? storage : null;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toEnvelope(value: unknown): StorageEnvelope | null {
  if (!isRecord(value)) return null;
  const version = value.version;
  if (typeof version !== 'number' || !('data' in value)) return null;
  return { version, data: value.data };
}

const warned = new Set<string>();

function warnOnce(key: string, error: unknown): void {
  if (warned.has(key)) return;
  warned.add(key);
  const reason = error instanceof Error ? error.name : 'unknown error';
  console.warn(`[lisan] Could not persist "${namespaced(key)}" (${reason}). Continuing in memory.`);
}

function readEnvelope(key: string, area: StorageArea = 'local'): StorageEnvelope | null {
  const backend = getBackend(area);
  if (!backend) return null;

  let raw: string | null;
  try {
    raw = backend.getItem(namespaced(key));
  } catch {
    return null;
  }
  if (raw === null) return null;

  try {
    return toEnvelope(JSON.parse(raw));
  } catch {
    return null;
  }
}

function writeEnvelope(
  key: string,
  data: unknown,
  version: number,
  area: StorageArea = 'local',
): boolean {
  const backend = getBackend(area);
  if (!backend) return false;
  try {
    backend.setItem(namespaced(key), JSON.stringify({ version, data } satisfies StorageEnvelope));
    return true;
  } catch (error) {
    warnOnce(key, error);
    return false;
  }
}

function removeKey(key: string, area: StorageArea = 'local'): void {
  const backend = getBackend(area);
  if (!backend) return;
  try {
    backend.removeItem(namespaced(key));
  } catch {
    // Removal failing is never worth interrupting the learner.
  }
}

function readFrom<T>(key: string, options: ReadOptions<T>, area: StorageArea): T {
  const envelope = readEnvelope(key, area);
  if (!envelope) return options.fallback;

  const expected = options.version ?? STORAGE_SCHEMA_VERSION;
  if (envelope.version === expected) return envelope.data as T;

  const migrated = options.migrate?.(envelope.data, envelope.version);
  return migrated ?? options.fallback;
}

function read<T>(key: StorageKey, options: ReadOptions<T>): T {
  return readFrom(key, options, 'local');
}

function write(key: StorageKey, data: unknown, version: number = STORAGE_SCHEMA_VERSION): boolean {
  return writeEnvelope(key, data, version);
}

function remove(key: StorageKey): void {
  removeKey(key);
}

function readSession<T>(key: SessionStorageKey, options: ReadOptions<T>): T {
  return readFrom(key, options, 'session');
}

function writeSession(
  key: SessionStorageKey,
  data: unknown,
  version: number = STORAGE_SCHEMA_VERSION,
): boolean {
  return writeEnvelope(key, data, version, 'session');
}

function clearAll(): void {
  const backend = getBackend();
  if (!backend) return;
  const prefix = `${STORAGE_NAMESPACE}:`;
  try {
    for (let index = backend.length - 1; index >= 0; index -= 1) {
      const key = backend.key(index);
      if (key?.startsWith(prefix)) backend.removeItem(key);
    }
  } catch {
    // Same reasoning as `remove`.
  }
}

function isAvailable(): boolean {
  const backend = getBackend();
  if (!backend) return false;
  const probe = `${STORAGE_NAMESPACE}:__probe__`;
  try {
    backend.setItem(probe, '1');
    backend.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

/** Turns a `StorageMigrations` map into the `migrate` callback `read` expects. */
export function createMigrator<T>(migrations: StorageMigrations<T>) {
  return (data: unknown, fromVersion: number): T | null => {
    const upgrade = migrations[fromVersion];
    return upgrade ? upgrade(data) : null;
  };
}

export const storageService = {
  read,
  write,
  remove,
  clearAll,
  isAvailable,
  /**
   * The `sessionStorage` area: same namespace, same envelope, tab lifetime.
   *
   * Only `read` and `write` are offered. There is no `clearAll` because nothing needs to sweep an
   * area the browser discards on its own, and no `remove` because the one caller keys its entry by
   * timestamp and lets it age out rather than deleting it. A `write` returning `false` is how a
   * caller learns the area is unusable — Safari's private mode being the case that matters — which
   * is a stronger signal than a separate availability probe, since it reports on the actual write.
   */
  session: {
    read: readSession,
    write: writeSession,
  },
};

/** Internal seam shared with the zustand adapter; not part of the public surface. */
export const storageInternals = {
  readEnvelope,
  writeEnvelope,
  removeKey,
};

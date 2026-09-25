import type { StateStorage } from 'zustand/middleware';

import { STORAGE_SCHEMA_VERSION } from '@/constants';

import { storageInternals } from './storageService';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Adapter that routes zustand's `persist` middleware through the storage service.
 *
 * zustand serialises `{ state, version }`; this flattens it onto the storage envelope so the
 * persisted JSON is `{ "version": n, "data": <state> }`. That keeps `lisan:settings` readable by
 * the inline anti-FOUC script in `index.html`, which expects the settings object directly under
 * `data` rather than nested inside a `state` wrapper.
 */
export function createZustandStorage(): StateStorage {
  return {
    getItem(name) {
      const envelope = storageInternals.readEnvelope(name);
      if (!envelope) return null;
      return JSON.stringify({ state: envelope.data, version: envelope.version });
    },

    setItem(name, value) {
      let parsed: unknown;
      try {
        parsed = JSON.parse(value);
      } catch {
        return;
      }
      if (!isRecord(parsed)) return;
      const version = parsed.version;
      storageInternals.writeEnvelope(
        name,
        parsed.state,
        typeof version === 'number' ? version : STORAGE_SCHEMA_VERSION,
      );
    },

    removeItem(name) {
      storageInternals.removeKey(name);
    },
  };
}

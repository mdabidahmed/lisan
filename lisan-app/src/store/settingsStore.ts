import { create } from 'zustand';
import { createJSONStorage, persist, type PersistOptions } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

import { DEFAULT_SETTINGS, STORAGE_KEYS, STORAGE_SCHEMA_VERSION } from '@/constants';
import { createZustandStorage, storageService } from '@/services/storage';
import type { AppSettings, ThemeMode } from '@/types';

export interface SettingsActions {
  update: (patch: Partial<AppSettings>) => void;
  reset: () => void;
}

export type SettingsState = AppSettings & { actions: SettingsActions };

const SETTINGS_KEYS = Object.keys(DEFAULT_SETTINGS) as (keyof AppSettings)[];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Keeps only keys that exist in `DEFAULT_SETTINGS` and still have the expected primitive type. */
function coerceSettings(value: unknown): AppSettings {
  if (!isRecord(value)) return { ...DEFAULT_SETTINGS };

  const next = { ...DEFAULT_SETTINGS };
  for (const key of SETTINGS_KEYS) {
    const stored = value[key];
    if (stored !== undefined && typeof stored === typeof DEFAULT_SETTINGS[key]) {
      Object.assign(next, { [key]: stored });
    }
  }
  return next;
}

/**
 * The inline anti-FOUC script in `index.html` reads `lisan:theme` before React boots, so the
 * chosen mode is mirrored into its own key. `ThemeProvider` only applies the theme; this is the
 * one writer.
 */
function mirrorThemeKey(theme: ThemeMode): void {
  storageService.write(STORAGE_KEYS.theme, theme);
}

const persistOptions: PersistOptions<SettingsState, AppSettings> = {
  name: STORAGE_KEYS.settings,
  version: STORAGE_SCHEMA_VERSION,
  storage: createJSONStorage<AppSettings>(() => createZustandStorage()),
  partialize: ({ actions: _actions, ...settings }) => settings,
  migrate: (persisted) => coerceSettings(persisted),
  onRehydrateStorage: () => (state) => {
    if (state) mirrorThemeKey(state.theme);
  },
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      actions: {
        update: (patch) => {
          set(patch);
          if (patch.theme !== undefined) mirrorThemeKey(patch.theme);
        },
        reset: () => {
          set({ ...DEFAULT_SETTINGS });
          mirrorThemeKey(DEFAULT_SETTINGS.theme);
        },
      },
    }),
    persistOptions,
  ),
);

const selectSettings = (state: SettingsState): AppSettings => {
  const { actions: _actions, ...settings } = state;
  return settings;
};

/** The whole settings object. Shallow-compared, so unrelated writes do not re-render. */
export function useSettings(): AppSettings {
  return useSettingsStore(useShallow(selectSettings));
}

/** Prefer this: subscribing to one primitive is the cheapest possible subscription. */
export function useSetting<K extends keyof AppSettings>(key: K): AppSettings[K] {
  return useSettingsStore((state) => state[key]);
}

export function useSettingsActions(): SettingsActions {
  return useSettingsStore((state) => state.actions);
}

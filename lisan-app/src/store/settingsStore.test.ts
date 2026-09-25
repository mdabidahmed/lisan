import { beforeEach, describe, expect, it } from 'vitest';

import { DEFAULT_SETTINGS, STORAGE_KEYS, STORAGE_SCHEMA_VERSION } from '@/constants';
import { storageService } from '@/services/storage';
import type { AppSettings } from '@/types';

import { useSettingsStore } from './settingsStore';

/**
 * Writes the envelope `index.html` and the storage service agree on: `{ version, data }`.
 *
 * `version` decides which path rehydration takes, and the two are genuinely different. At the
 * current version zustand merges the payload straight onto the initial state; only an older one
 * runs `coerceSettings`. Both are exercised below.
 */
function persist(settings: Record<string, unknown>, version = STORAGE_SCHEMA_VERSION): void {
  storageService.write(STORAGE_KEYS.settings, settings, version);
}

const BEFORE_FONTS = STORAGE_SCHEMA_VERSION - 1;

function rehydrate(): AppSettings {
  void useSettingsStore.persist.rehydrate();
  const { actions: _actions, ...settings } = useSettingsStore.getState();
  return settings;
}

beforeEach(() => {
  localStorage.clear();
  useSettingsStore.getState().actions.reset();
});

describe('settingsStore font preferences', () => {
  it('defaults to IndoPak Nastaleeq for Arabic and the self-hosted Latin face', () => {
    const state = useSettingsStore.getState();

    // Arabic's default is IndoPak Nastaleeq, fetched like any other non-baseline face — see the
    // comment on `DEFAULT_ARABIC_FONT` in `documentFonts.ts`. The reading face stays on the
    // precached default: nothing about the Arabic choice should put a second fetch in the boot
    // path.
    expect(state.arabicFont).toBe('indopak');
    expect(state.readingFont).toBe('inter');
    expect(state.monospaceTransliteration).toBe(false);
  });

  it('updates and persists each field independently', () => {
    useSettingsStore.getState().actions.update({ arabicFont: 'indopak' });
    useSettingsStore.getState().actions.update({ monospaceTransliteration: true });

    expect(useSettingsStore.getState().arabicFont).toBe('indopak');
    expect(useSettingsStore.getState().readingFont).toBe('inter');

    const stored = storageService.read<AppSettings>(STORAGE_KEYS.settings, {
      fallback: DEFAULT_SETTINGS,
    });
    expect(stored.arabicFont).toBe('indopak');
    expect(stored.monospaceTransliteration).toBe(true);
  });

  it('restores a persisted preference on rehydrate, which is what makes boot loading work', () => {
    persist({ ...DEFAULT_SETTINGS, arabicFont: 'amiri', readingFont: 'spectral' });

    const state = rehydrate();

    expect(state.arabicFont).toBe('amiri');
    expect(state.readingFont).toBe('spectral');
  });

  it('fills in the new fields for a payload written before they existed', () => {
    // Exactly what is in a returning learner's localStorage today: no font keys at all.
    persist({
      theme: 'dark',
      language: 'en',
      dailyGoal: 30,
      audioSpeed: 1,
      autoPlayAudio: true,
      quizQuestionCount: 10,
      quizDifficulty: 'mixed',
      reducedMotion: false,
      textSize: 'large',
      highContrast: false,
    });

    const state = rehydrate();

    // Their own settings survive, and the new ones arrive on the defaults rather than undefined.
    expect(state.theme).toBe('dark');
    expect(state.textSize).toBe('large');
    expect(state.arabicFont).toBe('indopak');
    expect(state.readingFont).toBe('inter');
    expect(state.monospaceTransliteration).toBe(false);
  });

  it('drops a value of the wrong type when the migration runs', () => {
    persist({ ...DEFAULT_SETTINGS, monospaceTransliteration: 'yes', arabicFont: 42 }, BEFORE_FONTS);

    const state = rehydrate();

    expect(state.monospaceTransliteration).toBe(false);
    expect(state.arabicFont).toBe('indopak');
  });

  it('cannot guarantee a valid face on its own, which is why the document resolves too', () => {
    // `coerceSettings` compares `typeof`, so a string that is not a face it knows survives — and
    // at the current schema version it is not even consulted. Nothing downstream may assume the
    // stored value is renderable; `applyDocumentFonts` resolves it again before writing it out.
    persist({ ...DEFAULT_SETTINGS, arabicFont: 'kufi' }, BEFORE_FONTS);

    expect(rehydrate().arabicFont).toBe('kufi');
  });

  it('restores the defaults on reset', () => {
    useSettingsStore.getState().actions.update({ arabicFont: 'amiri', readingFont: 'spectral' });

    useSettingsStore.getState().actions.reset();

    expect(useSettingsStore.getState().arabicFont).toBe('indopak');
    expect(useSettingsStore.getState().readingFont).toBe('inter');
  });
});

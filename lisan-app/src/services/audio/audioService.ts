import { BrowserSpeechProvider } from './BrowserSpeechProvider';
import {
  DEFAULT_SPEECH_LANG,
  IDLE_AUDIO_STATE,
  isSelectiveProvider,
  type AudioState,
  type AudioStateListener,
  type SpeakOptions,
  type SpeechProvider,
} from './types';

/**
 * Singleton facade over speech. The UI only ever reaches this through `useAudio()`, so swapping
 * the browser voice for CDN audio or cloud TTS (spec §14) touches nothing above this file.
 *
 * Nothing here throws. An environment without speech synthesis simply reports
 * `isSupported() === false` and every call becomes a no-op.
 */

let browserProvider = new BrowserSpeechProvider();
let override: SpeechProvider | null = null;

let active: SpeechProvider = browserProvider;
let detachActive: (() => void) | null = null;

const listeners = new Set<AudioStateListener>();
let state: AudioState = { ...IDLE_AUDIO_STATE, isSupported: browserProvider.isSupported() };

function isSameState(a: AudioState, b: AudioState): boolean {
  return (
    a.isSpeaking === b.isSpeaking &&
    a.isPaused === b.isPaused &&
    a.activeText === b.activeText &&
    a.isSupported === b.isSupported
  );
}

function publish(next: AudioState): void {
  const merged: AudioState = { ...next, isSupported: isSupported() };
  if (isSameState(state, merged)) return;
  state = merged;
  for (const listener of [...listeners]) {
    try {
      listener(state);
    } catch (error) {
      console.error('[lisan] audio subscriber threw', error);
    }
  }
}

function setActive(provider: SpeechProvider): void {
  if (active === provider && detachActive) return;
  detachActive?.();
  active = provider;
  detachActive = provider.onStateChange(publish);
}

function pickProvider(text: string): SpeechProvider {
  const candidate = override;
  if (!candidate) return browserProvider;
  try {
    if (!candidate.isSupported()) return browserProvider;
    if (isSelectiveProvider(candidate) && !candidate.canSpeak(text)) return browserProvider;
    return candidate;
  } catch {
    return browserProvider;
  }
}

function isSupported(): boolean {
  try {
    return browserProvider.isSupported() || (override?.isSupported() ?? false);
  } catch {
    return false;
  }
}

function speakArabic(text: string, options: SpeakOptions = {}): void {
  if (!text.trim()) return;
  try {
    const provider = pickProvider(text);
    setActive(provider);
    void Promise.resolve(provider.speak(text, { lang: DEFAULT_SPEECH_LANG, ...options })).catch(
      (error: unknown) => {
        console.warn('[lisan] pronunciation failed', error);
      },
    );
  } catch (error) {
    console.warn('[lisan] pronunciation failed', error);
  }
}

function stopSpeech(): void {
  try {
    active.stop();
  } catch {
    /* ignored */
  }
  publish({ ...state, isSpeaking: false, isPaused: false, activeText: null });
}

function pauseSpeech(): void {
  try {
    active.pause();
  } catch {
    /* ignored */
  }
}

function resumeSpeech(): void {
  try {
    active.resume();
  } catch {
    /* ignored */
  }
}

function subscribe(listener: AudioStateListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getState(): AudioState {
  return state;
}

/** Stable snapshot for SSR/prerender, where no speech engine exists. */
function getServerState(): AudioState {
  return IDLE_AUDIO_STATE;
}

/** Swap in `AudioFileProvider` (or a fake, in tests). Pass `null` to return to the browser voice. */
function setProvider(provider: SpeechProvider | null): void {
  stopSpeech();
  override = provider;
  setActive(pickProvider(''));
  publish({ ...state });
}

/** Test-only: rebuilds the default provider so freshly stubbed globals are picked up. */
function reset(): void {
  detachActive?.();
  detachActive = null;
  override = null;
  browserProvider.dispose();
  browserProvider = new BrowserSpeechProvider();
  state = { ...IDLE_AUDIO_STATE, isSupported: browserProvider.isSupported() };
  setActive(browserProvider);
}

setActive(browserProvider);

export const audioService = {
  speakArabic,
  stopSpeech,
  pauseSpeech,
  resumeSpeech,
  isSupported,
  subscribe,
  getState,
  getServerState,
  setProvider,
  reset,
};

export { speakArabic, stopSpeech, pauseSpeech, resumeSpeech, isSupported };

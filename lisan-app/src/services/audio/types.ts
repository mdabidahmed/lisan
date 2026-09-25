export interface SpeakOptions {
  lang?: string | undefined;
  rate?: number | undefined;
  pitch?: number | undefined;
  volume?: number | undefined;
}

export interface AudioState {
  isSpeaking: boolean;
  isPaused: boolean;
  activeText: string | null;
  isSupported: boolean;
}

export type AudioStateListener = (state: AudioState) => void;

/**
 * The seam between the app and however Arabic is pronounced. `BrowserSpeechProvider` is the MVP
 * implementation; `AudioFileProvider` is the phase-2 shape for CDN audio and cloud TTS.
 */
export interface SpeechProvider {
  isSupported(): boolean;
  speak(text: string, options: SpeakOptions): Promise<void> | void;
  stop(): void;
  pause(): void;
  resume(): void;
  /** Returns an unsubscribe function. */
  onStateChange(listener: AudioStateListener): () => void;
}

/**
 * A provider that can only pronounce part of the vocabulary — a CDN with a partial audio
 * catalogue, for instance. The facade asks before routing so it can fall back per word rather
 * than per session.
 */
export interface SelectiveSpeechProvider extends SpeechProvider {
  canSpeak(text: string): boolean;
}

export function isSelectiveProvider(provider: SpeechProvider): provider is SelectiveSpeechProvider {
  return typeof (provider as Partial<SelectiveSpeechProvider>).canSpeak === 'function';
}

export const IDLE_AUDIO_STATE: AudioState = Object.freeze({
  isSpeaking: false,
  isPaused: false,
  activeText: null,
  isSupported: false,
});

/** Product spec §14: Arabic is spoken slower than the browser default so learners can follow. */
export const DEFAULT_SPEECH_LANG = 'ar-SA';
export const DEFAULT_SPEECH_RATE = 0.75;
export const DEFAULT_SPEECH_PITCH = 1;

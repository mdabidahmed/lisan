import { createAudioStateEmitter } from './stateEmitter';
import type {
  AudioState,
  AudioStateListener,
  SelectiveSpeechProvider,
  SpeakOptions,
} from './types';

/**
 * NOT CONSTRUCTED BY ANYTHING — the one genuinely unwired seam in the app.
 *
 * Pre-generated MP3s on a CDN, human recordings, or cloud TTS (spec §14). It implements the same
 * `SpeechProvider` contract as `BrowserSpeechProvider` and is unit-tested against it, but unlike
 * `FetchHttpClient` there is no environment variable that reaches it: enabling it is a literal
 * `audioService.setProvider(new AudioFileProvider(...))` at bootstrap, once a `resolveUrl` strategy
 * and an audio catalogue exist. The README has the call.
 *
 * `canSpeak(text)` returning false lets the facade fall back to the browser voice per word, which
 * is what a partially populated audio catalogue needs.
 */

export interface AudioFileProviderOptions {
  /** Returns a playable URL for the text, or `null` when the catalogue has no recording. */
  resolveUrl: (text: string) => string | null;
  /** Injected for tests; defaults to `new Audio(url)`. */
  createAudio?: ((url: string) => HTMLAudioElement) | undefined;
}

function defaultCreateAudio(url: string): HTMLAudioElement {
  return new Audio(url);
}

function canConstructAudio(): boolean {
  return typeof (globalThis as { Audio?: unknown }).Audio === 'function';
}

export class AudioFileProvider implements SelectiveSpeechProvider {
  readonly #emitter = createAudioStateEmitter({
    isSpeaking: false,
    isPaused: false,
    activeText: null,
    isSupported: false,
  });

  readonly #resolveUrl: (text: string) => string | null;
  readonly #createAudio: (url: string) => HTMLAudioElement;

  #element: HTMLAudioElement | null = null;

  constructor(options: AudioFileProviderOptions) {
    this.#resolveUrl = options.resolveUrl;
    this.#createAudio = options.createAudio ?? defaultCreateAudio;
    this.#emitter.set({ isSupported: this.isSupported() });
  }

  isSupported(): boolean {
    return canConstructAudio();
  }

  canSpeak(text: string): boolean {
    if (!this.isSupported()) return false;
    try {
      return this.#resolveUrl(text) !== null;
    } catch {
      return false;
    }
  }

  getState(): AudioState {
    return this.#emitter.get();
  }

  onStateChange(listener: AudioStateListener): () => void {
    return this.#emitter.subscribe(listener);
  }

  speak(text: string, options: SpeakOptions = {}): void {
    const url = this.canSpeak(text) ? this.#resolveUrl(text) : null;
    if (url === null) {
      this.#emitter.set({ isSupported: false, isSpeaking: false, activeText: null });
      return;
    }

    this.stop();

    try {
      const element = this.#createAudio(url);
      if (options.rate !== undefined) element.playbackRate = options.rate;
      if (options.volume !== undefined) element.volume = options.volume;

      element.onplay = () => {
        this.#emitter.set({ isSpeaking: true, isPaused: false, activeText: text });
      };
      element.onpause = () => {
        this.#emitter.set({ isPaused: true });
      };
      element.onended = () => {
        this.#emitter.set({ isSpeaking: false, isPaused: false, activeText: null });
      };
      element.onerror = () => {
        this.#emitter.set({ isSpeaking: false, isPaused: false, activeText: null });
      };

      this.#element = element;
      void element.play().catch(() => {
        this.#emitter.set({ isSpeaking: false, isPaused: false, activeText: null });
      });
    } catch (error) {
      console.warn('[lisan] audio file playback failed', error);
      this.#emitter.set({ isSpeaking: false, isPaused: false, activeText: null });
    }
  }

  stop(): void {
    const element = this.#element;
    this.#element = null;
    if (element) {
      try {
        element.pause();
        element.currentTime = 0;
      } catch {
        /* ignored */
      }
    }
    this.#emitter.set({ isSpeaking: false, isPaused: false, activeText: null });
  }

  pause(): void {
    try {
      this.#element?.pause();
      this.#emitter.set({ isPaused: true });
    } catch {
      /* ignored */
    }
  }

  resume(): void {
    const element = this.#element;
    if (!element) return;
    try {
      void element.play().catch(() => undefined);
      this.#emitter.set({ isPaused: false });
    } catch {
      /* ignored */
    }
  }
}

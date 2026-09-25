import { createAudioStateEmitter } from './stateEmitter';
import {
  DEFAULT_SPEECH_LANG,
  DEFAULT_SPEECH_PITCH,
  DEFAULT_SPEECH_RATE,
  type AudioState,
  type AudioStateListener,
  type SpeakOptions,
  type SpeechProvider,
} from './types';

/**
 * Web Speech API provider (product spec §14, MVP).
 *
 * This is the only module allowed to touch `speechSynthesis`; ESLint blocks it everywhere else.
 * Every entry point is defensive because support is genuinely inconsistent: jsdom has no
 * synthesis at all, Chrome populates `getVoices()` asynchronously, and some Linux builds expose
 * the API but ship no Arabic voice.
 */

interface SpeechScope {
  speechSynthesis?: SpeechSynthesis | undefined;
  SpeechSynthesisUtterance?: typeof SpeechSynthesisUtterance | undefined;
}

function getScope(): SpeechScope {
  try {
    return globalThis;
  } catch {
    return {};
  }
}

function getSynth(): SpeechSynthesis | null {
  const synth = getScope().speechSynthesis;
  return typeof synth?.speak === 'function' ? synth : null;
}

function getUtteranceCtor(): typeof SpeechSynthesisUtterance | null {
  return getScope().SpeechSynthesisUtterance ?? null;
}

export class BrowserSpeechProvider implements SpeechProvider {
  readonly #emitter = createAudioStateEmitter({
    isSpeaking: false,
    isPaused: false,
    activeText: null,
    isSupported: false,
  });

  #voice: SpeechSynthesisVoice | null = null;
  #detachVoicesChanged: (() => void) | null = null;

  constructor() {
    this.#emitter.set({ isSupported: this.isSupported() });
    this.#watchVoices();
  }

  isSupported(): boolean {
    return getSynth() !== null && getUtteranceCtor() !== null;
  }

  getState(): AudioState {
    return this.#emitter.get();
  }

  onStateChange(listener: AudioStateListener): () => void {
    return this.#emitter.subscribe(listener);
  }

  speak(text: string, options: SpeakOptions = {}): void {
    const synth = getSynth();
    const Utterance = getUtteranceCtor();
    if (!synth || !Utterance || !text.trim()) {
      this.#emitter.set({ isSupported: synth !== null && Utterance !== null });
      return;
    }

    try {
      // Spec §14: always cancel first, otherwise rapid taps queue up and play over each other.
      synth.cancel();

      const utterance = new Utterance(text);
      utterance.lang = options.lang ?? DEFAULT_SPEECH_LANG;
      utterance.rate = options.rate ?? DEFAULT_SPEECH_RATE;
      utterance.pitch = options.pitch ?? DEFAULT_SPEECH_PITCH;
      if (options.volume !== undefined) utterance.volume = options.volume;

      // No Arabic voice is not a failure: the default voice still produces usable audio.
      const voice = this.#resolveVoice(synth, utterance.lang);
      if (voice) utterance.voice = voice;

      utterance.onstart = () => {
        this.#emitter.set({ isSpeaking: true, isPaused: false, activeText: text });
      };
      utterance.onend = () => {
        this.#emitter.set({ isSpeaking: false, isPaused: false, activeText: null });
      };
      utterance.onerror = () => {
        this.#emitter.set({ isSpeaking: false, isPaused: false, activeText: null });
      };
      utterance.onpause = () => {
        this.#emitter.set({ isPaused: true });
      };
      utterance.onresume = () => {
        this.#emitter.set({ isPaused: false });
      };

      this.#emitter.set({ isSupported: true, isSpeaking: true, isPaused: false, activeText: text });
      synth.speak(utterance);
    } catch (error) {
      console.warn('[lisan] speech synthesis failed', error);
      this.#emitter.set({ isSpeaking: false, isPaused: false, activeText: null });
    }
  }

  stop(): void {
    const synth = getSynth();
    try {
      synth?.cancel();
    } catch {
      // Cancelling a synth that is already torn down must not surface to the learner.
    }
    this.#emitter.set({ isSpeaking: false, isPaused: false, activeText: null });
  }

  pause(): void {
    const synth = getSynth();
    if (!synth || !this.#emitter.get().isSpeaking) return;
    try {
      synth.pause();
      this.#emitter.set({ isPaused: true });
    } catch {
      /* ignored */
    }
  }

  resume(): void {
    const synth = getSynth();
    if (!synth || !this.#emitter.get().isPaused) return;
    try {
      synth.resume();
      this.#emitter.set({ isPaused: false });
    } catch {
      /* ignored */
    }
  }

  /** Releases the `voiceschanged` listener. Only needed by tests and hot reload. */
  dispose(): void {
    this.#detachVoicesChanged?.();
    this.#detachVoicesChanged = null;
  }

  #resolveVoice(synth: SpeechSynthesis, lang: string): SpeechSynthesisVoice | null {
    if (this.#voice) return this.#voice;
    this.#voice = pickVoice(synth, lang);
    return this.#voice;
  }

  #watchVoices(): void {
    const synth = getSynth();
    if (!synth || typeof synth.addEventListener !== 'function') return;

    const onVoicesChanged = () => {
      this.#voice = pickVoice(synth, DEFAULT_SPEECH_LANG);
    };

    try {
      synth.addEventListener('voiceschanged', onVoicesChanged);
      this.#detachVoicesChanged = () => {
        synth.removeEventListener('voiceschanged', onVoicesChanged);
      };
      onVoicesChanged();
    } catch {
      /* ignored */
    }
  }
}

function pickVoice(synth: SpeechSynthesis, lang: string): SpeechSynthesisVoice | null {
  let voices: SpeechSynthesisVoice[];
  try {
    voices = typeof synth.getVoices === 'function' ? synth.getVoices() : [];
  } catch {
    return null;
  }
  if (voices.length === 0) return null;

  const prefix = lang.slice(0, 2).toLowerCase();
  const exact = voices.find(
    (voice) => voice.lang.toLowerCase().replace('_', '-') === lang.toLowerCase(),
  );
  if (exact) return exact;

  return voices.find((voice) => voice.lang.toLowerCase().startsWith(prefix)) ?? null;
}

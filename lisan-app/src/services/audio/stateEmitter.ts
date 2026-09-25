import type { AudioState, AudioStateListener } from './types';

export interface AudioStateEmitter {
  get(): AudioState;
  /** No-ops when nothing actually changed, so `useSyncExternalStore` stays quiet. */
  set(patch: Partial<AudioState>): void;
  subscribe(listener: AudioStateListener): () => void;
}

function isSameState(a: AudioState, b: AudioState): boolean {
  return (
    a.isSpeaking === b.isSpeaking &&
    a.isPaused === b.isPaused &&
    a.activeText === b.activeText &&
    a.isSupported === b.isSupported
  );
}

export function createAudioStateEmitter(initial: AudioState): AudioStateEmitter {
  const listeners = new Set<AudioStateListener>();
  let state = initial;

  return {
    get: () => state,

    set(patch) {
      const next: AudioState = { ...state, ...patch };
      if (isSameState(state, next)) return;
      state = next;
      for (const listener of [...listeners]) {
        try {
          listener(state);
        } catch (error) {
          console.error('[lisan] audio state listener threw', error);
        }
      }
    },

    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

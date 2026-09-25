import { useCallback, useMemo, useSyncExternalStore } from 'react';

import { audioService } from '@/services/audio';
import { useSetting } from '@/store/settingsStore';

export interface UseAudioResult {
  speak: (text: string, opts?: { rate?: number | undefined; lang?: string | undefined }) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  isSpeaking: boolean;
  isPaused: boolean;
  isSupported: boolean;
  activeText: string | null;
}

/**
 * The only way the UI touches audio.
 *
 * State comes from `audioService` through `useSyncExternalStore`, so several `AudioButton`s can
 * render at once and all of them know which word is currently playing. The learner's
 * `audioSpeed` setting is the default rate; callers may still override it per word.
 */
export function useAudio(): UseAudioResult {
  const state = useSyncExternalStore(
    audioService.subscribe,
    audioService.getState,
    audioService.getServerState,
  );

  const audioSpeed = useSetting('audioSpeed');

  const speak = useCallback(
    (text: string, opts?: { rate?: number | undefined; lang?: string | undefined }) => {
      audioService.speakArabic(text, { rate: opts?.rate ?? audioSpeed, lang: opts?.lang });
    },
    [audioSpeed],
  );

  const stop = useCallback(() => {
    audioService.stopSpeech();
  }, []);

  const pause = useCallback(() => {
    audioService.pauseSpeech();
  }, []);

  const resume = useCallback(() => {
    audioService.resumeSpeech();
  }, []);

  return useMemo(
    () => ({
      speak,
      stop,
      pause,
      resume,
      isSpeaking: state.isSpeaking,
      isPaused: state.isPaused,
      isSupported: state.isSupported,
      activeText: state.activeText,
    }),
    [speak, stop, pause, resume, state],
  );
}

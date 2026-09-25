import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { audioService } from './audioService';
import type { AudioState, SelectiveSpeechProvider } from './types';

/* A hand-rolled Web Speech API. jsdom ships none, and we need to inspect call order. */

class MockUtterance {
  lang = '';
  rate = 1;
  pitch = 1;
  volume = 1;
  voice: SpeechSynthesisVoice | null = null;

  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onpause: (() => void) | null = null;
  onresume: (() => void) | null = null;

  constructor(public text: string) {}
}

function makeVoice(lang: string, name: string): SpeechSynthesisVoice {
  return { lang, name, default: false, localService: true, voiceURI: name };
}

interface Harness {
  calls: string[];
  spoken: MockUtterance[];
  synth: {
    speak: (utterance: MockUtterance) => void;
    cancel: () => void;
    pause: () => void;
    resume: () => void;
    getVoices: () => SpeechSynthesisVoice[];
    addEventListener: () => void;
    removeEventListener: () => void;
  };
}

function installSpeech(voices: SpeechSynthesisVoice[] = []): Harness {
  const calls: string[] = [];
  const spoken: MockUtterance[] = [];

  const synth = {
    speak: (utterance: MockUtterance) => {
      calls.push('speak');
      spoken.push(utterance);
      utterance.onstart?.();
    },
    cancel: () => calls.push('cancel'),
    pause: () => calls.push('pause'),
    resume: () => calls.push('resume'),
    getVoices: () => voices,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  };

  vi.stubGlobal('speechSynthesis', synth);
  vi.stubGlobal('SpeechSynthesisUtterance', MockUtterance);
  audioService.reset();

  return { calls, spoken, synth };
}

function lastUtterance(harness: Harness): MockUtterance {
  const utterance = harness.spoken.at(-1);
  if (!utterance) throw new Error('nothing was spoken');
  return utterance;
}

afterEach(() => {
  vi.unstubAllGlobals();
  audioService.reset();
});

describe('audioService with speech synthesis available', () => {
  let harness: Harness;

  beforeEach(() => {
    harness = installSpeech([makeVoice('en-US', 'Samantha'), makeVoice('ar-SA', 'Maged')]);
  });

  it('reports support', () => {
    expect(audioService.isSupported()).toBe(true);
    expect(audioService.getState().isSupported).toBe(true);
  });

  it('cancels any in-flight utterance before speaking', () => {
    audioService.speakArabic('تُفَّاح');
    expect(harness.calls).toEqual(['cancel', 'speak']);

    audioService.speakArabic('كِتَاب');
    expect(harness.calls).toEqual(['cancel', 'speak', 'cancel', 'speak']);
  });

  it('applies the Arabic locale and the slow default rate', () => {
    audioService.speakArabic('تُفَّاح');

    const utterance = lastUtterance(harness);
    expect(utterance.text).toBe('تُفَّاح');
    expect(utterance.lang).toBe('ar-SA');
    expect(utterance.rate).toBe(0.75);
    expect(utterance.pitch).toBe(1);
  });

  it('honours a caller-supplied rate', () => {
    audioService.speakArabic('كِتَاب', { rate: 1.25 });
    expect(lastUtterance(harness).rate).toBe(1.25);
  });

  it('prefers a voice whose lang starts with ar', () => {
    audioService.speakArabic('مَاء');
    expect(lastUtterance(harness).voice?.name).toBe('Maged');
  });

  it('still speaks when no Arabic voice is installed', () => {
    harness = installSpeech([makeVoice('en-US', 'Samantha')]);
    audioService.speakArabic('مَاء');

    expect(lastUtterance(harness).voice).toBeNull();
    expect(audioService.getState().isSpeaking).toBe(true);
  });

  it('broadcasts state transitions to subscribers', () => {
    const states: AudioState[] = [];
    const unsubscribe = audioService.subscribe((next) => states.push(next));

    audioService.speakArabic('شَاي');
    expect(audioService.getState()).toMatchObject({
      isSpeaking: true,
      isPaused: false,
      activeText: 'شَاي',
    });

    const utterance = lastUtterance(harness);
    utterance.onpause?.();
    expect(audioService.getState().isPaused).toBe(true);

    utterance.onresume?.();
    expect(audioService.getState().isPaused).toBe(false);

    utterance.onend?.();
    expect(audioService.getState()).toMatchObject({
      isSpeaking: false,
      isPaused: false,
      activeText: null,
    });

    expect(states.length).toBeGreaterThanOrEqual(4);

    unsubscribe();
    audioService.speakArabic('بَيْت');
    const countAfterUnsubscribe = states.length;
    audioService.stopSpeech();
    expect(states.length).toBe(countAfterUnsubscribe);
  });

  it('clears state on an utterance error', () => {
    audioService.speakArabic('بَيْت');
    lastUtterance(harness).onerror?.();
    expect(audioService.getState()).toMatchObject({ isSpeaking: false, activeText: null });
  });

  it('stops, pauses and resumes through the synth', () => {
    audioService.speakArabic('بَيْت');
    audioService.pauseSpeech();
    expect(harness.calls).toContain('pause');

    audioService.resumeSpeech();
    expect(harness.calls).toContain('resume');

    audioService.stopSpeech();
    expect(audioService.getState().isSpeaking).toBe(false);
  });

  it('ignores blank text', () => {
    audioService.speakArabic('   ');
    expect(harness.calls).toEqual([]);
  });

  it('returns a stable snapshot object while nothing changes', () => {
    const first = audioService.getState();
    expect(audioService.getState()).toBe(first);
  });
});

describe('audioService without speech synthesis', () => {
  beforeEach(() => {
    vi.stubGlobal('speechSynthesis', undefined);
    vi.stubGlobal('SpeechSynthesisUtterance', undefined);
    audioService.reset();
  });

  it('reports unsupported instead of throwing', () => {
    expect(audioService.isSupported()).toBe(false);
    expect(audioService.getState()).toEqual({
      isSpeaking: false,
      isPaused: false,
      activeText: null,
      isSupported: false,
    });
  });

  it('makes every call a no-op', () => {
    expect(() => {
      audioService.speakArabic('تُفَّاح');
      audioService.pauseSpeech();
      audioService.resumeSpeech();
      audioService.stopSpeech();
    }).not.toThrow();

    expect(audioService.getState().isSpeaking).toBe(false);
  });
});

describe('audioService provider swapping', () => {
  it('routes through a custom provider and falls back when it cannot speak', () => {
    const harness = installSpeech([makeVoice('ar-SA', 'Maged')]);
    const providerSpeak = vi.fn();

    const partialCatalogue: SelectiveSpeechProvider = {
      isSupported: () => true,
      canSpeak: (text: string) => text === 'known',
      speak: providerSpeak,
      stop: () => undefined,
      pause: () => undefined,
      resume: () => undefined,
      onStateChange: () => () => undefined,
    };
    audioService.setProvider(partialCatalogue);

    // Swapping providers stops whatever was playing, which cancels the browser synth.
    harness.calls.length = 0;

    audioService.speakArabic('known');
    expect(providerSpeak).toHaveBeenCalledTimes(1);
    expect(harness.calls).toEqual([]);

    audioService.speakArabic('unknown');
    expect(providerSpeak).toHaveBeenCalledTimes(1);
    expect(harness.calls).toEqual(['cancel', 'speak']);

    audioService.setProvider(null);
    audioService.speakArabic('known');
    expect(providerSpeak).toHaveBeenCalledTimes(1);
  });
});

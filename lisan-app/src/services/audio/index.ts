export { AudioFileProvider, type AudioFileProviderOptions } from './AudioFileProvider';
export {
  audioService,
  isSupported,
  pauseSpeech,
  resumeSpeech,
  speakArabic,
  stopSpeech,
} from './audioService';
export { BrowserSpeechProvider } from './BrowserSpeechProvider';
export {
  DEFAULT_SPEECH_LANG,
  DEFAULT_SPEECH_PITCH,
  DEFAULT_SPEECH_RATE,
  IDLE_AUDIO_STATE,
  isSelectiveProvider,
  type AudioState,
  type AudioStateListener,
  type SelectiveSpeechProvider,
  type SpeakOptions,
  type SpeechProvider,
} from './types';

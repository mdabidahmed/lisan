import type { PracticeModeId, QuizType } from '@/types';

/**
 * Typed, vendor-free event facade (spec §60).
 *
 * The payloads are part of the contract: adding a vendor later means writing one
 * `AnalyticsProvider` and calling `analytics.setProvider(...)` at bootstrap. No SDK is imported
 * here, so nothing ships to the bundle until that decision is actually made.
 */

export interface AnalyticsEventMap {
  word_viewed: { wordId: string; categoryId?: string | undefined; source?: string | undefined };
  audio_played: { text: string; wordId?: string | undefined; rate: number };
  word_bookmarked: { wordId: string; bookmarked: boolean };
  quiz_started: {
    quizId: string;
    mode: PracticeModeId;
    type: QuizType;
    questionCount: number;
  };
  quiz_answered: {
    quizId: string;
    questionId: string;
    wordId: string;
    correct: boolean;
    durationMs: number;
  };
  quiz_completed: {
    quizId: string;
    total: number;
    correct: number;
    accuracy: number;
    durationMs: number;
  };
  category_opened: { categoryId: string };
  /**
   * The sidebar's premium card was pressed. Paired with `premium_interest_registered` below, these
   * two are the only evidence there will be for whether a paid tier is worth building, so the
   * impression matters as much as the conversion.
   */
  premium_dialog_opened: {
    /** True when the learner had already registered, so they were not shown the pitch again. */
    returning: boolean;
  };
  premium_interest_registered: {
    /**
     * Whether an address was left — never the address. Nothing here may carry personal data: these
     * payloads are the contract a vendor SDK would be handed, and an email in one is a leak that
     * only shows up after the SDK is installed.
     */
    withEmail: boolean;
  };
  study_session_started: { sessionId: string };
  study_session_completed: {
    sessionId: string;
    durationMs: number;
    wordsStudied: number;
  };
}

export type AnalyticsEvent = keyof AnalyticsEventMap;

export interface AnalyticsProvider {
  track<E extends AnalyticsEvent>(event: E, props: AnalyticsEventMap[E]): void;
  identify?(userId: string, traits?: Record<string, unknown>): void;
}

/** The default. Learners get no tracking until a provider is explicitly installed. */
export class NoopProvider implements AnalyticsProvider {
  track(): void {
    /* intentionally empty */
  }
}

let provider: AnalyticsProvider = new NoopProvider();

function track<E extends AnalyticsEvent>(event: E, props: AnalyticsEventMap[E]): void {
  try {
    provider.track(event, props);
  } catch (error) {
    // Telemetry must never break the learning flow.
    console.warn('[lisan] analytics provider threw', error);
  }
}

function setProvider(next: AnalyticsProvider | null): void {
  provider = next ?? new NoopProvider();
}

function identify(userId: string, traits?: Record<string, unknown>): void {
  try {
    provider.identify?.(userId, traits);
  } catch (error) {
    console.warn('[lisan] analytics provider threw', error);
  }
}

export const analytics = { track, setProvider, identify };

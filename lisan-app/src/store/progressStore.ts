import { create } from 'zustand';
import { createJSONStorage, persist, type PersistOptions } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

import { PROGRESS_STORAGE_VERSION, STORAGE_KEYS } from '@/constants';
import { createZustandStorage } from '@/services/storage';
import { countLearnedWords, srsService } from '@/services/srs';
import type { ProgressSnapshot, QuizResult, ReviewQuality, WordProgress } from '@/types';
import { addDays, toDateKey, unique } from '@/utils';

/**
 * How much snapshot history is kept. Long enough that a learner who studies twice a month still
 * has a week-old baseline to compare against, short enough that the slice cannot grow without
 * bound: sixty dated rows of six small numbers each.
 */
export const SNAPSHOT_RETENTION_DAYS = 60;

export interface ProgressActions {
  /** Delegates the whole SM-2 step to `srsService`; the store only owns persistence. */
  recordAnswer: (wordId: string, correct: boolean, quality?: ReviewQuality) => void;
  markLearned: (wordId: string) => void;
  /** Clears one word's card back to `new`. A no-op for a word that has none. */
  resetWord: (wordId: string) => void;
  recordQuizCompletion: (result: QuizResult) => void;
  addStudyMinutes: (minutes: number) => void;
  /** Replaces every persisted field at once, validating as it goes. Used by backup restore. */
  hydrate: (data: ProgressSummaryData) => void;
  reset: () => void;
}

/**
 * Study time is accumulated in minutes but never rounded on the way in, so it keeps millisecond
 * resolution. Rounding each session first is what made the counter useless: a quiz answered in
 * fifteen seconds rounded to zero, and so did the next forty of them, leaving a learner who had
 * studied for hours with a total that had never moved. Rounding belongs at the point of display,
 * where it happens once against the accumulated total instead of once per session.
 */
function toMinutes(milliseconds: number): number {
  if (!Number.isFinite(milliseconds) || milliseconds <= 0) return 0;
  return milliseconds / 60_000;
}

export interface ProgressState {
  byWordId: Record<string, WordProgress>;
  /** `YYYY-MM-DD` keys; the set a streak is computed from. */
  studyDays: string[];
  quizzesCompleted: number;
  /** Minutes, fractional. See `toMinutes`: never round this on write. */
  studyMinutes: number;
  totalCorrect: number;
  totalAnswers: number;
  /** Oldest first, at most one row per day, pruned to `SNAPSHOT_RETENTION_DAYS`. */
  snapshots: ProgressSnapshot[];
  actions: ProgressActions;
}

export type ProgressSummaryData = Omit<ProgressState, 'actions'>;

/** The counters a snapshot is taken of. `studyDays` is a set, not a total, so it is not one. */
type Counters = Pick<
  ProgressSummaryData,
  'byWordId' | 'quizzesCompleted' | 'studyMinutes' | 'totalCorrect' | 'totalAnswers'
>;

const EMPTY: ProgressSummaryData = {
  byWordId: {},
  studyDays: [],
  quizzesCompleted: 0,
  studyMinutes: 0,
  totalCorrect: 0,
  totalAnswers: 0,
  snapshots: [],
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;

function coerceSnapshot(value: unknown): ProgressSnapshot | null {
  if (!isRecord(value)) return null;
  if (typeof value.date !== 'string' || !DATE_KEY.test(value.date)) return null;

  const count = (key: keyof ProgressSnapshot): number => {
    const raw = value[key];
    return typeof raw === 'number' && Number.isFinite(raw) ? Math.max(0, Math.round(raw)) : 0;
  };

  // A duration, not a tally, so it is clamped but not rounded like the counts beside it. Rounding
  // here would throw away the sub-minute precision on every rehydrate, and a baseline rounded
  // differently from the live counter is what makes a week-over-week delta drift.
  const minutes = value.studyMinutes;

  return {
    date: value.date,
    wordsLearned: count('wordsLearned'),
    quizzesCompleted: count('quizzesCompleted'),
    totalCorrect: count('totalCorrect'),
    totalAnswers: count('totalAnswers'),
    studyMinutes: typeof minutes === 'number' && Number.isFinite(minutes) ? Math.max(0, minutes) : 0,
  };
}

/** Oldest first, one row per day, nothing older than the retention window. */
function coerceSnapshots(value: unknown, now: Date): ProgressSnapshot[] {
  if (!Array.isArray(value)) return [];

  const oldest = toDateKey(addDays(now, -(SNAPSHOT_RETENTION_DAYS - 1)));
  const byDate = new Map<string, ProgressSnapshot>();

  for (const entry of value) {
    const snapshot = coerceSnapshot(entry);
    // A duplicated day keeps the last one written, the same rule `withSnapshot` applies live.
    if (snapshot && snapshot.date >= oldest) byDate.set(snapshot.date, snapshot);
  }

  return [...byDate.values()].sort((a, b) => (a.date < b.date ? -1 : 1));
}

function coerce(value: unknown, now: Date = new Date()): ProgressSummaryData {
  if (!isRecord(value)) return { ...EMPTY };

  const byWordId = isRecord(value.byWordId) ? (value.byWordId as Record<string, WordProgress>) : {};
  const studyDays = Array.isArray(value.studyDays)
    ? value.studyDays.filter((day): day is string => typeof day === 'string')
    : [];
  const num = (key: string): number =>
    typeof value[key] === 'number' && Number.isFinite(value[key]) ? value[key] : 0;

  return {
    byWordId,
    studyDays: unique(studyDays),
    quizzesCompleted: num('quizzesCompleted'),
    studyMinutes: num('studyMinutes'),
    totalCorrect: num('totalCorrect'),
    totalAnswers: num('totalAnswers'),
    // Absent in every payload written before this slice reached version 2.
    snapshots: coerceSnapshots(value.snapshots, now),
  };
}

function withStudyDay(studyDays: string[], now = new Date()): string[] {
  const key = toDateKey(now);
  return studyDays.includes(key) ? studyDays : [...studyDays, key];
}

/**
 * Rewrites today's row from the counters about to be committed and drops everything outside the
 * retention window. Today's last write wins, which is what keeps the history to one row a day
 * however many answers are given, and makes a snapshot cheap enough to take on every mutation.
 *
 * Rows dated in the future are discarded too: only a clock that moved backwards can produce one,
 * and they would otherwise sit in the window forever.
 */
function withSnapshot(
  previous: readonly ProgressSnapshot[],
  counters: Counters,
  now: Date,
): ProgressSnapshot[] {
  const today = toDateKey(now);
  const oldest = toDateKey(addDays(now, -(SNAPSHOT_RETENTION_DAYS - 1)));

  const kept = previous.filter((entry) => entry.date >= oldest && entry.date < today);

  return [
    ...kept,
    {
      date: today,
      wordsLearned: countLearnedWords(counters.byWordId),
      quizzesCompleted: counters.quizzesCompleted,
      totalCorrect: counters.totalCorrect,
      totalAnswers: counters.totalAnswers,
      studyMinutes: counters.studyMinutes,
    },
  ];
}

/**
 * The single write path for every mutating action: it stamps the study day and refreshes today's
 * snapshot from the counters being committed, so no action can record progress without a
 * baseline being kept for it.
 */
function commit(
  state: ProgressState,
  patch: Partial<Counters>,
  now: Date = new Date(),
): Partial<ProgressState> {
  const counters: Counters = {
    byWordId: patch.byWordId ?? state.byWordId,
    quizzesCompleted: patch.quizzesCompleted ?? state.quizzesCompleted,
    studyMinutes: patch.studyMinutes ?? state.studyMinutes,
    totalCorrect: patch.totalCorrect ?? state.totalCorrect,
    totalAnswers: patch.totalAnswers ?? state.totalAnswers,
  };

  return {
    ...counters,
    studyDays: withStudyDay(state.studyDays, now),
    snapshots: withSnapshot(state.snapshots, counters, now),
  };
}

const persistOptions: PersistOptions<ProgressState, ProgressSummaryData> = {
  name: STORAGE_KEYS.progress,
  version: PROGRESS_STORAGE_VERSION,
  storage: createJSONStorage<ProgressSummaryData>(() => createZustandStorage()),
  partialize: ({ actions: _actions, ...data }) => data,
  /*
   * Version 1 payloads carry no `snapshots`; everything else survives untouched.
   *
   * Keeping sub-minute precision needed no further bump, because it widened `studyMinutes` from
   * whole minutes to fractions of one rather than changing what the field is. Every stored value
   * is already a correct reading under the wider domain, here and in the snapshot rows, so the
   * history stays in one unit and a baseline written last month is still subtractable from a
   * total written today.
   */
  migrate: (persisted) => coerce(persisted),
  // `migrate` only runs when the stored version differs, so validation belongs here as well:
  // every rehydrate is coerced, which is also what prunes the snapshot window to today.
  merge: (persisted, current) => ({ ...current, ...coerce(persisted) }),
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      ...EMPTY,
      actions: {
        recordAnswer: (wordId, correct, quality) => {
          set((state) => {
            const current = state.byWordId[wordId] ?? srsService.createInitialProgress(wordId);
            const next = srsService.recordAnswer(current, correct, {
              ...(quality === undefined ? {} : { quality }),
              wordId,
            });

            return commit(state, {
              byWordId: { ...state.byWordId, [wordId]: next },
              totalCorrect: state.totalCorrect + (correct ? 1 : 0),
              totalAnswers: state.totalAnswers + 1,
            });
          });
        },

        markLearned: (wordId) => {
          set((state) => {
            const current = state.byWordId[wordId] ?? srsService.createInitialProgress(wordId);
            return commit(state, {
              byWordId: { ...state.byWordId, [wordId]: srsService.markLearned(current) },
            });
          });
        },

        /*
         * Deliberately not routed through `commit`, because clearing a card is a scheduling
         * decision rather than study activity, and `commit` would record it as both:
         *
         * - the study-day stamp feeds the streak, and a streak that can be extended by pressing
         *   "Reset progress" is not a streak;
         * - today's snapshot is the baseline next week's deltas are subtracted from, so writing
         *   the post-reset counters into it would bake the drop in `wordsLearned` into that
         *   baseline and overstate the following week by however many cards were cleared.
         *
         * Leaving today's row alone keeps it what it claims to be: the totals as of the last
         * time the learner actually studied. The lifetime answer tallies are untouched for the
         * same reason `markLearned` leaves them alone — they record answers that were really
         * given, and accuracy must not be resettable.
         */
        resetWord: (wordId) => {
          set((state) =>
            state.byWordId[wordId] === undefined
              ? state
              : { byWordId: { ...state.byWordId, [wordId]: srsService.resetProgress(wordId) } },
          );
        },

        // Per-answer SRS already ran through `recordAnswer`; this only rolls up the session.
        recordQuizCompletion: (result) => {
          set((state) =>
            commit(state, {
              quizzesCompleted: state.quizzesCompleted + 1,
              studyMinutes: state.studyMinutes + toMinutes(result.durationMs),
            }),
          );
        },

        /** Minutes, as the name says, and fractions of one are kept rather than rounded away. */
        addStudyMinutes: (minutes) => {
          if (!Number.isFinite(minutes) || minutes <= 0) return;
          set((state) => commit(state, { studyMinutes: state.studyMinutes + minutes }));
        },

        // Validated rather than trusted: the only caller reads a file the learner chose.
        hydrate: (data) => {
          set(coerce(data));
        },

        reset: () => {
          set({ ...EMPTY });
        },
      },
    }),
    persistOptions,
  ),
);

export function useWordProgress(wordId: string): WordProgress | undefined {
  return useProgressStore((state) => state.byWordId[wordId]);
}

export function useWordStatus(wordId: string): WordProgress['status'] {
  return useProgressStore((state) => state.byWordId[wordId]?.status ?? 'new');
}

/** Everything the progress endpoint needs. Shallow-compared so it is safe to spread. */
export function useProgressSummaryData(): ProgressSummaryData {
  return useProgressStore(
    useShallow(({ actions: _actions, ...data }): ProgressSummaryData => data),
  );
}

export function useProgressActions(): ProgressActions {
  return useProgressStore((state) => state.actions);
}

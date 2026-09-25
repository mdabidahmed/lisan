import { create } from 'zustand';
import { createJSONStorage, persist, type PersistOptions } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

import { STORAGE_KEYS, STORAGE_SCHEMA_VERSION } from '@/constants';
import { createZustandStorage } from '@/services/storage';
import { nowIso } from '@/utils';

/**
 * Which grammar lessons the learner has finished (spec §56: every topic tracks progress).
 *
 * Persisted through `createZustandStorage`, so the payload lands in `lisan:grammar` wrapped in
 * the usual `{ version, data }` envelope.
 *
 * Read by `src/features/grammar` and the grammar pages, and it used to live beside them. It is
 * here now because it is learner-owned persisted state, which is what `src/store` is for — there
 * is one answer to "where do persisted stores live?" and this is it.
 */

export interface LessonCompletion {
  lessonId: string;
  /** ISO 8601 timestamp. */
  completedAt: string;
}

export interface LessonProgressActions {
  markComplete: (lessonId: string) => void;
  markIncomplete: (lessonId: string) => void;
  toggle: (lessonId: string) => void;
  /** Used by the settings import, which has to replace the whole slice at once. */
  replaceAll: (completions: readonly LessonCompletion[]) => void;
  reset: () => void;
}

export interface LessonProgressState {
  completedById: Record<string, LessonCompletion>;
  actions: LessonProgressActions;
}

export type LessonProgressData = Omit<LessonProgressState, 'actions'>;

const EMPTY: LessonProgressData = { completedById: {} };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function coerceCompletion(lessonId: string, value: unknown): LessonCompletion | null {
  if (!isRecord(value)) return null;
  const completedAt = value.completedAt;
  if (typeof completedAt !== 'string' || completedAt === '') return null;
  return { lessonId, completedAt };
}

function coerce(value: unknown): LessonProgressData {
  if (!isRecord(value) || !isRecord(value.completedById)) return { ...EMPTY };

  const completedById: Record<string, LessonCompletion> = {};
  for (const [lessonId, entry] of Object.entries(value.completedById)) {
    const completion = coerceCompletion(lessonId, entry);
    if (completion) completedById[lessonId] = completion;
  }
  return { completedById };
}

function toRecord(completions: readonly LessonCompletion[]): Record<string, LessonCompletion> {
  const next: Record<string, LessonCompletion> = {};
  for (const completion of completions) {
    if (completion.lessonId === '') continue;
    next[completion.lessonId] = { ...completion };
  }
  return next;
}

const persistOptions: PersistOptions<LessonProgressState, LessonProgressData> = {
  name: STORAGE_KEYS.grammar,
  version: STORAGE_SCHEMA_VERSION,
  storage: createJSONStorage<LessonProgressData>(() => createZustandStorage()),
  partialize: ({ actions: _actions, ...data }) => data,
  migrate: (persisted) => coerce(persisted),
};

export const useLessonProgressStore = create<LessonProgressState>()(
  persist(
    (set) => ({
      ...EMPTY,
      actions: {
        markComplete: (lessonId) => {
          if (lessonId === '') return;
          set((state) =>
            state.completedById[lessonId]
              ? state
              : {
                  completedById: {
                    ...state.completedById,
                    [lessonId]: { lessonId, completedAt: nowIso() },
                  },
                },
          );
        },

        markIncomplete: (lessonId) => {
          set((state) => {
            if (!state.completedById[lessonId]) return state;
            const { [lessonId]: _removed, ...rest } = state.completedById;
            return { completedById: rest };
          });
        },

        toggle: (lessonId) => {
          const { completedById, actions } = useLessonProgressStore.getState();
          if (completedById[lessonId]) actions.markIncomplete(lessonId);
          else actions.markComplete(lessonId);
        },

        replaceAll: (completions) => {
          set({ completedById: toRecord(completions) });
        },

        reset: () => {
          set({ ...EMPTY });
        },
      },
    }),
    persistOptions,
  ),
);

export function useCompletedLessons(): Readonly<Record<string, LessonCompletion>> {
  return useLessonProgressStore((state) => state.completedById);
}

export function useIsLessonComplete(lessonId: string): boolean {
  return useLessonProgressStore((state) => state.completedById[lessonId] !== undefined);
}

export function useCompletedLessonCount(): number {
  return useLessonProgressStore((state) => Object.keys(state.completedById).length);
}

/** Most recently completed first — the order the progress activity feed wants. */
export function useLessonCompletionHistory(): readonly LessonCompletion[] {
  return useLessonProgressStore(
    useShallow((state) =>
      Object.values(state.completedById).sort((a, b) => (a.completedAt < b.completedAt ? 1 : -1)),
    ),
  );
}

export function useLessonProgressActions(): LessonProgressActions {
  return useLessonProgressStore((state) => state.actions);
}

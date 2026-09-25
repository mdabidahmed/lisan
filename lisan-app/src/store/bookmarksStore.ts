import { create } from 'zustand';
import { createJSONStorage, persist, type PersistOptions } from 'zustand/middleware';

import { STORAGE_KEYS, STORAGE_SCHEMA_VERSION } from '@/constants';
import { createZustandStorage } from '@/services/storage';
import { unique } from '@/utils';

export interface BookmarksActions {
  toggle: (wordId: string) => void;
  add: (wordId: string) => void;
  remove: (wordId: string) => void;
  clear: () => void;
}

export interface BookmarksState {
  ids: string[];
  actions: BookmarksActions;
}

type PersistedBookmarks = Pick<BookmarksState, 'ids'>;

function coerce(value: unknown): PersistedBookmarks {
  if (typeof value !== 'object' || value === null) return { ids: [] };
  const ids = (value as { ids?: unknown }).ids;
  return {
    ids: Array.isArray(ids) ? unique(ids.filter((id): id is string => typeof id === 'string')) : [],
  };
}

const persistOptions: PersistOptions<BookmarksState, PersistedBookmarks> = {
  name: STORAGE_KEYS.bookmarks,
  version: STORAGE_SCHEMA_VERSION,
  storage: createJSONStorage<PersistedBookmarks>(() => createZustandStorage()),
  partialize: ({ ids }) => ({ ids }),
  migrate: (persisted) => coerce(persisted),
};

export const useBookmarksStore = create<BookmarksState>()(
  persist(
    (set) => ({
      ids: [],
      actions: {
        add: (wordId) => {
          set((state) => (state.ids.includes(wordId) ? state : { ids: [wordId, ...state.ids] }));
        },
        remove: (wordId) => {
          set((state) =>
            state.ids.includes(wordId) ? { ids: state.ids.filter((id) => id !== wordId) } : state,
          );
        },
        toggle: (wordId) => {
          set((state) =>
            state.ids.includes(wordId)
              ? { ids: state.ids.filter((id) => id !== wordId) }
              : { ids: [wordId, ...state.ids] },
          );
        },
        clear: () => {
          set((state) => (state.ids.length === 0 ? state : { ids: [] }));
        },
      },
    }),
    persistOptions,
  ),
);

/** Most recently bookmarked first. Stable reference between unrelated updates. */
export function useBookmarkIds(): readonly string[] {
  return useBookmarksStore((state) => state.ids);
}

export function useIsBookmarked(wordId: string): boolean {
  return useBookmarksStore((state) => state.ids.includes(wordId));
}

export function useBookmarkCount(): number {
  return useBookmarksStore((state) => state.ids.length);
}

export function useBookmarkActions(): BookmarksActions {
  return useBookmarksStore((state) => state.actions);
}

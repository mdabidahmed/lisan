/**
 * Bookmarks have no fetching hook of their own: saved words are the vocabulary list scoped to the
 * persisted ids, so `/bookmarks` calls `useWords({ bookmarkedOnly: true, bookmarkedIds })` and
 * inherits its search, sort and pagination behaviour. Only the cache keys live here.
 */
export { bookmarkKeys } from './queryKeys';

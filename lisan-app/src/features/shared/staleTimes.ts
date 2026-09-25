/**
 * Authored vocabulary, grammar and practice content never changes at runtime, so it is cached for
 * the whole session. Learner-derived data is cheap to recompute but changes on every answer, so
 * it stays fresh.
 */
export const STATIC_CONTENT_STALE_TIME = Number.POSITIVE_INFINITY;

/** Paginated lists: long enough to make paging instant, short enough to pick up new filters. */
export const LIST_STALE_TIME = 5 * 60 * 1000;

/** Search results follow the debounced input; a short window absorbs backspacing. */
export const SEARCH_STALE_TIME = 60 * 1000;

/** Recomputed from the local progress store, which already invalidates via the query key. */
export const LEARNER_DATA_STALE_TIME = 30 * 1000;

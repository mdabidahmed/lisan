import { bookmarkKeys } from './bookmarks/queryKeys';
import { grammarKeys } from './grammar/queryKeys';
import { practiceKeys } from './practice/queryKeys';
import { progressKeys } from './progress/queryKeys';
import { categoryKeys, wordKeys } from './vocabulary/queryKeys';

/**
 * Every cache key in the app, composed from the per-domain factories. Import this rather than the
 * individual factories when invalidating across domains.
 */
export const queryKeys = {
  categories: categoryKeys,
  words: wordKeys,
  grammar: grammarKeys,
  practice: practiceKeys,
  progress: progressKeys,
  bookmarks: bookmarkKeys,
} as const;

export { bookmarkKeys, categoryKeys, grammarKeys, practiceKeys, progressKeys, wordKeys };

import * as categories from './categories';
import * as grammar from './grammar';
import * as practice from './practice';
import * as progress from './progress';
import * as words from './words';

/** Grouped by domain so call sites read like the URLs they stand in for. */
export const api = {
  categories,
  words,
  grammar,
  practice,
  progress,
} as const;

export { categories, grammar, practice, progress, words };

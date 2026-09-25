/**
 * The small deterministic content set every unit test builds on.
 *
 * It is authored in `src/data/fallbackContent.ts`, because the API layer serves it for real when a
 * slice of the authored dataset is missing, and content the app can render belongs in `src/data`.
 * This module is the test-facing name for it, so a test still never has to reach into the
 * production content tree by hand.
 *
 * This is not the exception to "tests never import `@/data`" — that rule is about the 352-word
 * barrel, whose size and churn make assertions brittle. Eleven fixed words with a fixed shape are
 * the opposite of that, and having one copy of them means a test and the fallback can never drift.
 */
export {
  fallbackCategories as categories,
  fallbackGrammarLessons as grammarLessons,
  fallbackPracticeModes as practiceModes,
  fallbackWords as words,
} from '@/data/fallbackContent';

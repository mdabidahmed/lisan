/*
 * Lesson completion is learner-owned persisted state, so it lives in `src/store` with the other
 * persisted stores rather than here — import it from `@/store/lessonProgressStore`.
 */
export { grammarKeys } from './queryKeys';
export {
  LESSON_QUIZ_CHOICE_COUNT,
  LESSON_QUIZ_MIN_EXAMPLES,
  LESSON_QUIZ_QUESTION_COUNT,
  buildLessonQuiz,
  scoreLessonQuiz,
  type BuildLessonQuizOptions,
  type LessonQuizKind,
  type LessonQuizQuestion,
} from './lessonQuiz';
export { GRAMMAR_TOPIC_LABELS, GRAMMAR_TOPICS, grammarTopicLabel, isGrammarTopic } from './topics';
export { useGrammarLesson, useGrammarLessons } from './useGrammar';
export { useLessonWords, type LessonWordsResult } from './useLessonWords';

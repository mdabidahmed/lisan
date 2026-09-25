import type { GrammarExample, GrammarLesson } from '@/types';
import { hashString } from '@/utils';

/**
 * The end-of-lesson comprehension check (spec §56: every topic supports a quiz).
 *
 * Questions are built from the lesson's own worked examples, so there is no second body of
 * content to author or keep in sync, and the distractors are always plausible: they are other
 * real sentences from the same lesson. Everything is seeded from the lesson id, so a learner sees
 * the same check on every visit and on every device.
 */

export type LessonQuizKind = 'english-to-arabic' | 'arabic-to-english';

export interface LessonQuizQuestion {
  id: string;
  kind: LessonQuizKind;
  prompt: string;
  /** Options in their final display order. */
  choices: string[];
  correctAnswer: string;
  /** Where the answer is explained, so feedback can point back at the right paragraph. */
  sectionHeading: string;
}

export const LESSON_QUIZ_QUESTION_COUNT = 3;
export const LESSON_QUIZ_CHOICE_COUNT = 3;
/** Fewer than this and the distractors would give the answer away. */
export const LESSON_QUIZ_MIN_EXAMPLES = 3;

interface SourcedExample extends GrammarExample {
  sectionHeading: string;
}

/** Deterministic Fisher–Yates using a 32-bit LCG, so the same seed always gives the same order. */
function seededOrder<T>(items: readonly T[], seed: number): T[] {
  const result = [...items];
  let state = seed >>> 0 || 1;

  for (let index = result.length - 1; index > 0; index -= 1) {
    state = (state * 1_664_525 + 1_013_904_223) >>> 0;
    const target = state % (index + 1);
    const current = result[index];
    const swapped = result[target];
    if (current !== undefined && swapped !== undefined) {
      result[index] = swapped;
      result[target] = current;
    }
  }

  return result;
}

function collectExamples(lesson: GrammarLesson): SourcedExample[] {
  return lesson.sections.flatMap((section) =>
    (section.examples ?? []).map((example) => ({ ...example, sectionHeading: section.heading })),
  );
}

function answerOf(example: SourcedExample, kind: LessonQuizKind): string {
  return kind === 'english-to-arabic' ? example.arabic : example.english;
}

function promptOf(example: SourcedExample, kind: LessonQuizKind): string {
  return kind === 'english-to-arabic' ? example.english : example.arabic;
}

export interface BuildLessonQuizOptions {
  questionCount?: number | undefined;
  choiceCount?: number | undefined;
}

export function buildLessonQuiz(
  lesson: GrammarLesson,
  options: BuildLessonQuizOptions = {},
): LessonQuizQuestion[] {
  const examples = collectExamples(lesson).filter(
    (example) => example.arabic !== '' && example.english !== '',
  );
  if (examples.length < LESSON_QUIZ_MIN_EXAMPLES) return [];

  const questionCount = Math.min(
    options.questionCount ?? LESSON_QUIZ_QUESTION_COUNT,
    examples.length,
  );
  const choiceCount = Math.max(2, options.choiceCount ?? LESSON_QUIZ_CHOICE_COUNT);
  const seed = hashString(lesson.id);
  const picked = seededOrder(examples, seed).slice(0, questionCount);

  return picked.map((example, index) => {
    // Alternating direction keeps the check short but still tests both recognition and recall.
    const kind: LessonQuizKind = index % 2 === 0 ? 'english-to-arabic' : 'arabic-to-english';
    const correctAnswer = answerOf(example, kind);

    const distractors: string[] = [];
    for (const candidate of seededOrder(examples, hashString(`${lesson.id}:${index}`))) {
      if (distractors.length >= choiceCount - 1) break;
      const value = answerOf(candidate, kind);
      if (value === correctAnswer || distractors.includes(value)) continue;
      distractors.push(value);
    }

    return {
      id: `${lesson.id}_check_${index}`,
      kind,
      prompt: promptOf(example, kind),
      choices: seededOrder(
        [correctAnswer, ...distractors],
        hashString(`${lesson.id}:choices:${index}`),
      ),
      correctAnswer,
      sectionHeading: example.sectionHeading,
    } satisfies LessonQuizQuestion;
  });
}

export function scoreLessonQuiz(
  questions: readonly LessonQuizQuestion[],
  answers: Readonly<Record<string, string>>,
): number {
  return questions.filter((question) => answers[question.id] === question.correctAnswer).length;
}

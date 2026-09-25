import { useId, useMemo, useState } from 'react';

import { Alert } from '@/components/ui/Alert';
import { ArabicText } from '@/components/ui/ArabicText';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import { QuizOption, type QuizOptionState } from '@/components/ui/QuizOption';
import {
  buildLessonQuiz,
  scoreLessonQuiz,
  type LessonQuizKind,
  type LessonQuizQuestion,
} from '@/features/grammar';
import type { GrammarLesson } from '@/types/content';

import styles from './GrammarLesson.module.css';

const LEAD: Record<LessonQuizKind, string> = {
  'english-to-arabic': 'Which Arabic sentence means this?',
  'arabic-to-english': 'What does this sentence mean?',
};

function optionState(
  question: LessonQuizQuestion,
  choice: string,
  chosen: string | undefined,
  checked: boolean,
): QuizOptionState {
  if (!checked) return chosen === choice ? 'selected' : 'default';
  if (choice === question.correctAnswer) return 'correct';
  return chosen === choice ? 'incorrect' : 'default';
}

export interface LessonQuizProps {
  lesson: GrammarLesson;
  completed: boolean;
  onMarkComplete: () => void;
}

/**
 * A short check-your-understanding quiz at the end of the lesson.
 *
 * All questions are on screen at once and nothing is timed: this is a reading page, so the check
 * should feel like the last paragraph rather than a test. Answers are only graded when the learner
 * asks, and the feedback names the section that explains each answer.
 */
export function LessonQuiz({ lesson, completed, onMarkComplete }: LessonQuizProps) {
  const questions = useMemo(() => buildLessonQuiz(lesson), [lesson]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const baseId = useId();

  if (questions.length === 0) return null;

  const answeredCount = questions.filter((question) => answers[question.id] !== undefined).length;
  const score = scoreLessonQuiz(questions, answers);
  const allCorrect = score === questions.length;

  return (
    <Card as="section" padding="md">
      <CardHeader
        title="Check your understanding"
        subtitle={`${questions.length} quick questions from the examples above`}
        icon="quiz"
        accent="purple"
        as="h2"
      />

      <ol className={styles.questions}>
        {questions.map((question, index) => {
          const promptId = `${baseId}-${String(index)}`;
          const chosen = answers[question.id];
          const isArabicPrompt = question.kind === 'arabic-to-english';

          return (
            <li key={question.id} className={styles.question}>
              <div className={styles.prompt} id={promptId}>
                <span className={styles.promptLead}>{LEAD[question.kind]}</span>
                {isArabicPrompt ? (
                  <ArabicText flow="sentence" className={styles.promptArabic}>
                    {question.prompt}
                  </ArabicText>
                ) : (
                  <span className={styles.promptEnglish}>{question.prompt}</span>
                )}
              </div>

              {/*
                Both faces of this check are the lesson's own worked examples, so an Arabic choice
                is a whole sentence ending in a full stop, exactly like the prompt above it.
              */}
              <div className={styles.options} role="radiogroup" aria-labelledby={promptId}>
                {question.choices.map((choice) => (
                  <QuizOption
                    key={choice}
                    value={choice}
                    label={choice}
                    arabic={question.kind === 'english-to-arabic' ? 'sentence' : false}
                    state={optionState(question, choice, chosen, checked)}
                    disabled={checked}
                    onSelect={(value) => {
                      setAnswers((current) => ({ ...current, [question.id]: value }));
                    }}
                  />
                ))}
              </div>

              {checked && chosen !== question.correctAnswer ? (
                <p className={styles.explain}>
                  Revisit <strong>{question.sectionHeading}</strong> above.
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>

      {checked ? (
        <div className={styles.quizFooter}>
          <div role="status">
            <Alert
              variant={allCorrect ? 'success' : 'info'}
              title={`You got ${score} of ${questions.length}`}
            >
              {allCorrect
                ? 'That is the whole lesson understood. Mark it complete and move on.'
                : 'Read the sections named above once more, then try the check again.'}
            </Alert>
          </div>
          <div className={styles.quizActions}>
            <Button
              variant="secondary"
              onClick={() => {
                setAnswers({});
                setChecked(false);
              }}
            >
              Try again
            </Button>
            {completed ? null : (
              <Button iconLeft="check" onClick={onMarkComplete}>
                Mark lesson complete
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.quizFooter}>
          <Button
            disabled={answeredCount < questions.length}
            onClick={() => {
              setChecked(true);
            }}
          >
            Check answers
          </Button>
          <p className={styles.quizHint}>
            {answeredCount} of {questions.length} answered
          </p>
        </div>
      )}
    </Card>
  );
}

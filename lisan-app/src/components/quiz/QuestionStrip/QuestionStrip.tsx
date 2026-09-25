import { Icon, type IconName } from '@/components/icons';
import type { QuizAnswer, QuizQuestion } from '@/types/quiz';
import { cn } from '@/utils';

import styles from './QuestionStrip.module.css';

export type QuestionStatus = 'correct' | 'incorrect' | 'unanswered';

export interface QuestionStripProps {
  questions: readonly QuizQuestion[];
  answers: Readonly<Record<string, QuizAnswer>>;
  /** Zero-based index of the question on screen. */
  currentIndex: number;
  /** Turns the pills into jump controls. Without it they stay read-only status indicators. */
  onSelect?: ((index: number) => void) | undefined;
  className?: string | undefined;
}

const STATUS_CLASS: Record<QuestionStatus, string | undefined> = {
  correct: styles.correct,
  incorrect: styles.incorrect,
  unanswered: undefined,
};

const STATUS_ICON: Partial<Record<QuestionStatus, IconName>> = {
  correct: 'check',
  incorrect: 'close',
};

const STATUS_LABEL: Record<QuestionStatus, string> = {
  correct: 'correct',
  incorrect: 'incorrect',
  unanswered: 'not answered',
};

function statusOf(
  question: QuizQuestion,
  answers: Readonly<Record<string, QuizAnswer>>,
): QuestionStatus {
  const answer = answers[question.id];
  if (answer === undefined) return 'unanswered';
  return answer.correct ? 'correct' : 'incorrect';
}

/**
 * The run of numbered pills under the question card (reference screen 4): where the learner is,
 * how each question they have already answered went, and — with `onSelect` — the way back to any
 * of them.
 *
 * The pill and its tick are decorative, so a jump control names itself: position *and* outcome,
 * because "3" on its own says nothing about why you would press it. Which question is on screen
 * is left to `aria-current`, which assistive technology already announces.
 */
export function QuestionStrip({
  questions,
  answers,
  currentIndex,
  onSelect,
  className,
}: QuestionStripProps) {
  return (
    <ol className={cn(styles.list, className)}>
      {questions.map((question, index) => {
        const status = statusOf(question, answers);
        const icon = STATUS_ICON[status];
        const isCurrent = index === currentIndex;
        const label = `Question ${index + 1}, ${STATUS_LABEL[status]}`;

        const face = (
          <span className={styles.face} aria-hidden="true">
            <span className={cn(styles.pill, STATUS_CLASS[status], isCurrent && styles.current)}>
              {index + 1}
            </span>
            <span className={cn(styles.mark, STATUS_CLASS[status])}>
              {icon === undefined ? (
                <span className={styles.dot} />
              ) : (
                <Icon name={icon} size={12} />
              )}
            </span>
          </span>
        );

        return (
          <li key={question.id} className={styles.item}>
            {onSelect === undefined ? (
              <>
                {face}
                <span className="u-visually-hidden">
                  {`${label}${isCurrent ? ', current question' : ''}`}
                </span>
              </>
            ) : (
              <button
                type="button"
                className={styles.button}
                aria-label={label}
                {...(isCurrent ? { 'aria-current': 'step' as const } : {})}
                onClick={() => {
                  onSelect(index);
                }}
              >
                {face}
              </button>
            )}
          </li>
        );
      })}
    </ol>
  );
}

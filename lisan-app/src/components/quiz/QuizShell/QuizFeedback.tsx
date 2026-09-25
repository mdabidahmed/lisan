import { Icon, type IconName } from '@/components/icons';
import type { AnswerVerdict } from '@/features/practice/answerCheck';
import { ARABIC_CONTENT_ATTRS } from '@/i18n';
import { cn } from '@/utils';

import styles from './QuizShell.module.css';

export interface QuizFeedbackProps {
  revealed: boolean;
  verdict: AnswerVerdict | null;
  /** Shown after "the answer is" for anything other than a correct answer. */
  correctAnswer?: string | undefined;
  /** Renders `correctAnswer` in the Arabic face, right-to-left. */
  arabic?: boolean | undefined;
}

const TONE: Record<AnswerVerdict, string | undefined> = {
  correct: styles.correct,
  'near-miss': styles.nearMiss,
  incorrect: styles.incorrect,
};

const GLYPH: Record<AnswerVerdict, IconName> = {
  correct: 'check',
  'near-miss': 'alert',
  incorrect: 'close',
};

const LEAD: Record<AnswerVerdict, string> = {
  correct: 'Correct answer.',
  'near-miss': 'So close — the answer is',
  incorrect: 'Not quite — the answer is',
};

/**
 * The reveal, announced rather than only coloured: the region is always mounted so assistive
 * technology picks up the change, and an icon carries the verdict alongside the tone colour.
 */
export function QuizFeedback({
  revealed,
  verdict,
  correctAnswer,
  arabic = false,
}: QuizFeedbackProps) {
  const showAnswer = verdict !== null && verdict !== 'correct' && correctAnswer !== undefined;

  return (
    <p
      className={cn(styles.feedback, verdict === null ? undefined : TONE[verdict])}
      role="status"
      aria-live="polite"
    >
      {revealed && verdict !== null ? (
        <>
          <Icon name={GLYPH[verdict]} size={16} />
          {/* The trailing space collapses visually (the row is a flex `gap`) but keeps the
              announcement from running the answer into the sentence. */}
          <span>{showAnswer ? `${LEAD[verdict]} ` : LEAD[verdict]}</span>
          {showAnswer ? (
            <span
              className={cn(styles.answer, arabic && styles.answerArabic)}
              {...(arabic ? ARABIC_CONTENT_ATTRS : {})}
            >
              {correctAnswer}
            </span>
          ) : null}
        </>
      ) : null}
    </p>
  );
}

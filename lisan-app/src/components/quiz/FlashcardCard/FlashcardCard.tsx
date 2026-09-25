import { useState } from 'react';

import { AudioButton } from '@/components/ui/AudioButton';
import { Button } from '@/components/ui/Button';
import { ARABIC_CONTENT_ATTRS } from '@/i18n';
import type { QuizQuestion } from '@/types/quiz';

import { QuizNav, QuizShell } from '../QuizShell';

import styles from './FlashcardCard.module.css';

export interface FlashcardCardProps {
  /** Built from a multiple-choice question: `question` is the Arabic, `correctAnswer` the English. */
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  transliteration?: string | undefined;
  /** Present once the learner has graded themselves on this card. */
  given?: string | undefined;
  revealed?: boolean;
  onRespond: (known: boolean) => void;
  onNext?: (() => void) | undefined;
  onPrevious?: (() => void) | undefined;
  canGoBack?: boolean;
  isLast?: boolean;
}

const PROMPT = 'Recall the meaning, then check yourself:';

/**
 * Self-paced review: the learner turns the card over and grades their own recall, which is the
 * honest input an SM-2 schedule wants. The self-grade is stored as an ordinary answer, so a
 * flashcard run scores and schedules exactly like any other session.
 */
export function FlashcardCard({
  question,
  questionNumber,
  totalQuestions,
  transliteration,
  given,
  revealed = false,
  onRespond,
  onNext,
  onPrevious,
  canGoBack = false,
  isLast = false,
}: FlashcardCardProps) {
  const [flipped, setFlipped] = useState(false);
  const showBack = flipped || revealed;
  const knewIt = given === question.correctAnswer;

  return (
    <QuizShell questionNumber={questionNumber} totalQuestions={totalQuestions} prompt={PROMPT}>
      <div className={styles.face}>
        <span className={styles.arabic} {...ARABIC_CONTENT_ATTRS}>
          {question.question}
        </span>
        <AudioButton text={question.question} size="md" variant="primary" label="Play the word" />
      </div>

      <div className={styles.back} aria-live="polite">
        {showBack ? (
          <>
            <span className={styles.english}>{question.correctAnswer}</span>
            {transliteration === undefined ? null : (
              <span className={styles.translit}>{transliteration}</span>
            )}
          </>
        ) : (
          <Button
            variant="secondary"
            iconLeft="replay"
            onClick={() => {
              setFlipped(true);
            }}
          >
            Show Meaning
          </Button>
        )}
      </div>

      {showBack ? (
        <div className={styles.grade}>
          <Button
            variant={revealed && !knewIt ? 'primary' : 'secondary'}
            iconLeft="close"
            disabled={revealed}
            onClick={() => {
              onRespond(false);
            }}
          >
            Still Learning
          </Button>
          <Button
            variant={revealed && knewIt ? 'primary' : 'secondary'}
            iconLeft="check"
            disabled={revealed}
            onClick={() => {
              onRespond(true);
            }}
          >
            I Knew It
          </Button>
        </div>
      ) : null}

      <QuizNav
        onNext={onNext}
        onPrevious={onPrevious}
        canGoBack={canGoBack}
        isLast={isLast}
        nextDisabled={!revealed}
      />
    </QuizShell>
  );
}

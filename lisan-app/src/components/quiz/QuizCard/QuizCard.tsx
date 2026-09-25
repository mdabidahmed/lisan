import { Icon, type IconName } from '@/components/icons';
import { ArabicText } from '@/components/ui/ArabicText';
import { AudioButton } from '@/components/ui/AudioButton';
import { Card } from '@/components/ui/Card';
import { UrduText } from '@/components/ui/UrduText';
import type { PracticeDirection } from '@/data/practiceModes';
import type { AnswerVerdict } from '@/features/practice/answerCheck';
import { ARABIC_CONTENT_ATTRS } from '@/i18n';
import type { QuizQuestion } from '@/types/quiz';
import { cn } from '@/utils';
import { clampPercent, formatPercent } from '@/utils/format';

import { QuizFeedback } from '../QuizShell';

import styles from './QuizCard.module.css';

export interface QuizCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  /**
   * Which way round the question is asked. `arabic-to-english` prints the Arabic prompt large
   * and reads it aloud; `english-to-arabic` prints the English and offers Arabic options.
   */
  direction?: PracticeDirection | undefined;
  selectedAnswer?: string | undefined;
  /** After submission the correct/incorrect styling is revealed. */
  revealed?: boolean;
  onSelect: (value: string) => void;
  onNext?: (() => void) | undefined;
  onPrevious?: (() => void) | undefined;
  canGoBack?: boolean;
  isLast?: boolean;
  /** Listening questions: the script stays hidden until the answer is revealed. */
  concealPrompt?: boolean | undefined;
  /** Overrides the instruction line. */
  prompt?: string | undefined;
}

const DEFAULT_PROMPT: Record<PracticeDirection, string> = {
  'arabic-to-english': 'Select the correct meaning:',
  'english-to-arabic': 'Select the correct Arabic word:',
};
const LISTENING_PROMPT = 'Listen to the word, then select its meaning:';

type RowState = 'default' | 'selected' | 'correct' | 'incorrect';

const ROW_ICON: Partial<Record<RowState, IconName>> = {
  selected: 'check',
  correct: 'check',
  incorrect: 'close',
};

function rowState(
  option: string,
  {
    selectedAnswer,
    revealed,
    correctAnswer,
  }: Pick<QuizCardProps, 'selectedAnswer' | 'revealed'> & {
    correctAnswer: string;
  },
): RowState {
  if (!revealed) return option === selectedAnswer ? 'selected' : 'default';
  if (option === correctAnswer) return 'correct';
  if (option === selectedAnswer) return 'incorrect';
  return 'default';
}

/**
 * One question at a time: a compact list of answer rows rather than a card grid, a segmented
 * dot track in place of a bar, and the prompt folded into the same panel as the word so the
 * question reads as one unit (design direction 8).
 *
 * Covers both option-picking types and both directions. For listening the audio *is* the
 * question, so the script is masked until the reveal and playback is always learner-initiated —
 * iOS Safari refuses speech that did not come from a gesture, and autoplay would be the wrong
 * default regardless.
 */
export function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  direction = 'arabic-to-english',
  selectedAnswer,
  revealed = false,
  onSelect,
  onNext,
  onPrevious,
  canGoBack = false,
  isLast = false,
  concealPrompt = false,
  prompt,
}: QuizCardProps) {
  const options = question.options ?? [];
  const concealed = concealPrompt && !revealed;
  const arabicPrompt = direction === 'arabic-to-english';
  const verdict: AnswerVerdict | null = revealed
    ? selectedAnswer === question.correctAnswer
      ? 'correct'
      : 'incorrect'
    : null;
  const percent = clampPercent((questionNumber / Math.max(1, totalQuestions)) * 100);
  // A staged pick (selectedAnswer set, not yet revealed) already lets the learner confirm —
  // Next grades it on that first press, so it need not wait for `revealed` itself.
  const nextDisabled = !revealed && selectedAnswer === undefined;
  const instruction = prompt ?? (concealPrompt ? LISTENING_PROMPT : DEFAULT_PROMPT[direction]);

  return (
    <Card padding="lg" className={styles.root}>
      <div className={styles.headRow}>
        <p className={styles.counter}>
          Question {questionNumber} of {totalQuestions}
        </p>
        <span className={styles.percent} aria-hidden="true">
          {formatPercent(percent)}
        </span>
      </div>
      <div
        className={styles.dots}
        role="progressbar"
        aria-label="Quiz progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        {Array.from({ length: totalQuestions }, (_, index) => (
          <span
            key={index}
            className={cn(styles.dot, index < questionNumber && styles.dotFilled)}
          />
        ))}
      </div>

      <div className={styles.wordPanel}>
        <div className={styles.wordPanelText}>
          <p className={styles.wordLabel}>{instruction}</p>
          {concealed ? (
            <span className={styles.concealed} aria-hidden="true" />
          ) : (
            <span
              className={arabicPrompt ? styles.arabic : styles.english}
              {...(arabicPrompt ? ARABIC_CONTENT_ATTRS : {})}
            >
              {question.question}
            </span>
          )}
        </div>
        {/* Reading a production prompt aloud would be reading out its answer. */}
        {arabicPrompt ? (
          <AudioButton
            text={question.question}
            size={concealPrompt ? 'lg' : 'md'}
            variant="primary"
            label={concealPrompt ? 'Play the word again' : 'Play the word'}
            className={styles.audio}
            tooltipAlign="end"
          />
        ) : null}
      </div>

      {concealed ? <p className={styles.hint}>Tap play as many times as you need.</p> : null}

      <div className={styles.options} role="radiogroup" aria-label="Answer options">
        {options.map((option, index) => {
          const state = rowState(option, {
            ...(selectedAnswer === undefined ? {} : { selectedAnswer }),
            revealed,
            correctAnswer: question.correctAnswer,
          });
          const icon = ROW_ICON[state];
          const urdu = arabicPrompt ? question.optionsUrdu?.[index] : undefined;

          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={state !== 'default'}
              disabled={revealed}
              className={cn(styles.row, styles[state])}
              onClick={() => {
                onSelect(option);
              }}
            >
              <span className={styles.rowLeft}>
                <span className={styles.badge}>{index + 1}</span>
                {arabicPrompt ? (
                  <span className={styles.rowLabel}>{option}</span>
                ) : (
                  <ArabicText
                    flow="embedded"
                    className={cn(styles.rowLabel, styles.rowLabelArabic)}
                  >
                    {option}
                  </ArabicText>
                )}
              </span>
              <span className={styles.rowRight}>
                {urdu ? <UrduText className={styles.rowUrdu}>{urdu}</UrduText> : null}
                {icon ? (
                  <span className={styles.rowIcon}>
                    <Icon name={icon} size={11} />
                  </span>
                ) : (
                  <span className={styles.rowMarker} aria-hidden="true" />
                )}
              </span>
            </button>
          );
        })}
      </div>

      <QuizFeedback
        revealed={revealed}
        verdict={verdict}
        correctAnswer={question.correctAnswer}
        arabic={!arabicPrompt}
      />

      <div className={styles.nav}>
        {canGoBack ? (
          <button type="button" className={styles.prevButton} onClick={onPrevious}>
            <Icon name="arrow-left" size={16} />
            Previous
          </button>
        ) : null}
        <button
          type="button"
          className={cn(styles.nextButton, !canGoBack && styles.nextFullWidth)}
          onClick={onNext}
          disabled={nextDisabled}
        >
          {isLast ? 'Finish Quiz' : 'Next Question'}
          <Icon name="arrow-right" size={16} />
        </button>
      </div>
    </Card>
  );
}

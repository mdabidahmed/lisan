import { getWordArt } from '@/assets';
import { Icon, type IconName } from '@/components/icons';
import { AudioButton } from '@/components/ui/AudioButton';
import { WordThumbnail } from '@/components/ui/WordThumbnail';
import type { AnswerVerdict } from '@/features/practice/answerCheck';
import { ARABIC_CONTENT_ATTRS } from '@/i18n';
import type { QuizQuestion } from '@/types/quiz';
import { cn } from '@/utils';

import { QuizFeedback, QuizNav, QuizShell } from '../QuizShell';

import styles from './ImageMatchCard.module.css';

export interface ImageMatchCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer?: string | undefined;
  revealed?: boolean;
  onSelect: (value: string) => void;
  onNext?: (() => void) | undefined;
  onPrevious?: (() => void) | undefined;
  canGoBack?: boolean;
  isLast?: boolean;
}

type TileState = 'default' | 'selected' | 'correct' | 'incorrect';

const PROMPT = 'Select the picture that matches this word:';
const THUMBNAIL_SIZE = 148;

const TILE_CLASS: Record<TileState, string | undefined> = {
  default: undefined,
  selected: styles.selected,
  correct: styles.correct,
  incorrect: styles.incorrect,
};

const TILE_ICON: Partial<Record<TileState, IconName>> = {
  correct: 'check',
  incorrect: 'close',
};

function tileState(
  token: string,
  correctAnswer: string,
  selectedAnswer: string | undefined,
  revealed: boolean,
): TileState {
  if (!revealed) return token === selectedAnswer ? 'selected' : 'default';
  if (token === correctAnswer) return 'correct';
  if (token === selectedAnswer) return 'incorrect';
  return 'default';
}

/**
 * Picture recognition (product spec §19). Options are word ids from the illustrated subset of the
 * corpus, so every tile is a real drawing; the artwork's own description becomes the tile's
 * accessible name, which is the closest equivalent to seeing it.
 */
export function ImageMatchCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  revealed = false,
  onSelect,
  onNext,
  onPrevious,
  canGoBack = false,
  isLast = false,
}: ImageMatchCardProps) {
  const options = question.imageOptions ?? [];
  const verdict: AnswerVerdict | null = revealed
    ? selectedAnswer === question.correctAnswer
      ? 'correct'
      : 'incorrect'
    : null;

  return (
    <QuizShell questionNumber={questionNumber} totalQuestions={totalQuestions} prompt={PROMPT}>
      <div className={styles.subject}>
        <span className={styles.arabic} {...ARABIC_CONTENT_ATTRS}>
          {question.question}
        </span>
        <AudioButton text={question.question} size="md" variant="primary" label="Play the word" />
      </div>

      <div className={styles.grid} role="radiogroup" aria-label="Picture options">
        {options.map((token, index) => {
          const state = tileState(token, question.correctAnswer, selectedAnswer, revealed);
          const resultIcon = TILE_ICON[state];
          const description = getWordArt(token)?.alt ?? token;

          return (
            <button
              key={token}
              type="button"
              role="radio"
              aria-checked={state !== 'default'}
              disabled={revealed}
              className={cn(styles.tile, TILE_CLASS[state])}
              onClick={() => {
                onSelect(token);
              }}
            >
              <kbd className={styles.shortcut}>{index + 1}</kbd>
              <WordThumbnail
                wordId={token}
                arabic=""
                alt={description}
                size={THUMBNAIL_SIZE}
                radius="var(--radius-md)"
              />
              {resultIcon === undefined ? null : (
                <span className={styles.result}>
                  <Icon name={resultIcon} size={16} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <QuizFeedback revealed={revealed} verdict={verdict} />

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

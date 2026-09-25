import { useId } from 'react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { WORD_STATUS_LABEL, WORD_STATUS_VARIANT } from '@/features/vocabulary/wordStatus';
import type { WordStatus } from '@/types/progress';
import { cn } from '@/utils/cn';
import { isPast } from '@/utils/date';
import { formatNumber, formatPercent, formatRelativeTime, formatShortDate } from '@/utils/format';

import styles from './WordProgressPanel.module.css';

export interface WordProgressPanelProps {
  status: WordStatus;
  /** 0–100. */
  accuracy: number;
  /** Answers recorded against this word, correct or not. */
  answers: number;
  repetitions: number;
  /** ISO 8601. Absent while the word has never entered the schedule. */
  nextReviewAt?: string | undefined;
  onMarkLearned: () => void;
  onReset: () => void;
  className?: string | undefined;
}

function describeNextReview(nextReviewAt: string | undefined, now: Date): string {
  if (nextReviewAt === undefined) return 'Not scheduled';
  if (isPast(nextReviewAt, now)) return 'Due now';
  return `${formatShortDate(nextReviewAt)} · ${formatRelativeTime(nextReviewAt, now)}`;
}

/**
 * Spaced-repetition state for a single word (spec §48), with the two writes the reading view
 * offers: promote a new word out of the queue, or clear its card and start over.
 *
 * Purely presentational so every state is directly renderable; `useWordLearning` supplies the
 * values and the callbacks.
 */
export function WordProgressPanel({
  status,
  accuracy,
  answers,
  repetitions,
  nextReviewAt,
  onMarkLearned,
  onReset,
  className,
}: WordProgressPanelProps) {
  const headingId = useId();
  const now = new Date();
  const hasAnswers = answers > 0;
  const canReset = repetitions > 0 || hasAnswers || nextReviewAt !== undefined;

  return (
    <Card
      as="section"
      padding="md"
      className={cn(styles.root, className)}
      aria-labelledby={headingId}
    >
      <SectionHeader
        id={headingId}
        title="Your Progress"
        as="h3"
        action={<Badge variant={WORD_STATUS_VARIANT[status]}>{WORD_STATUS_LABEL[status]}</Badge>}
      />

      <dl className={styles.stats}>
        <div className={styles.stat}>
          <dt className={styles.statLabel}>Accuracy</dt>
          <dd className={styles.statValue}>{hasAnswers ? formatPercent(accuracy) : '—'}</dd>
          <dd className={styles.statHint}>
            {hasAnswers ? `${formatNumber(answers)} answered` : 'No answers yet'}
          </dd>
        </div>

        <div className={styles.stat}>
          <dt className={styles.statLabel}>Repetitions</dt>
          <dd className={styles.statValue}>{formatNumber(repetitions)}</dd>
          <dd className={styles.statHint}>Successful reviews in a row</dd>
        </div>

        <div className={styles.stat}>
          <dt className={styles.statLabel}>Next review</dt>
          <dd className={styles.statValue}>{describeNextReview(nextReviewAt, now)}</dd>
          <dd className={styles.statHint}>Scheduled by spaced repetition</dd>
        </div>
      </dl>

      {hasAnswers ? (
        <ProgressBar
          value={accuracy}
          tone={accuracy >= 80 ? 'success' : 'primary'}
          ariaLabel="Accuracy on this word"
        />
      ) : null}

      <div className={styles.actions}>
        {status === 'new' ? (
          <Button iconLeft="check" onClick={onMarkLearned}>
            Mark as learned
          </Button>
        ) : null}
        {canReset ? (
          <Button variant="ghost" iconLeft="replay" onClick={onReset}>
            Reset progress
          </Button>
        ) : null}
      </div>
    </Card>
  );
}

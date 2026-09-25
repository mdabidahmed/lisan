import { useId } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Icon } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { ROUTES } from '@/constants/routes';
import type { VocabularyWord } from '@/types/content';
import { cn } from '@/utils/cn';
import { formatNumber } from '@/utils/format';

import { ReviewQueueItem } from './ReviewQueueItem';
import styles from './ReviewQueue.module.css';

export interface ReviewQueueProps {
  /** The words to list — already trimmed to what should be shown. */
  words: readonly VocabularyWord[];
  /** Everything the schedule says is due, which may be more than `words`. */
  total: number;
  isLoading?: boolean | undefined;
  className?: string | undefined;
}

function subtitleFor(total: number): string {
  if (total === 0) return 'Your spaced-repetition schedule is clear.';
  return total === 1 ? '1 word is ready to come back' : `${formatNumber(total)} words are ready`;
}

/**
 * "What should I review?" on the dashboard (spec §49), driven by the spaced-repetition schedule.
 *
 * An empty queue is a success state, not a gap: it says the learner is caught up and points at the
 * next useful thing to do.
 */
export function ReviewQueue({ words, total, isLoading = false, className }: ReviewQueueProps) {
  const navigate = useNavigate();
  const headingId = useId();
  const hidden = Math.max(0, total - words.length);

  return (
    <Card
      as="section"
      padding="md"
      className={cn(styles.root, className)}
      aria-labelledby={headingId}
    >
      <SectionHeader
        id={headingId}
        title="Due for Review"
        subtitle={subtitleFor(total)}
        as="h3"
        action={
          total > 0 ? (
            <Link to={ROUTES.practice} className={styles.cta}>
              Review now
              <Icon name="arrow-right" size={16} />
            </Link>
          ) : null
        }
      />

      {isLoading ? (
        <div className={styles.list} aria-busy="true" aria-live="polite">
          <span className="u-visually-hidden">Loading your review queue…</span>
          <Skeleton height={68} radius="var(--radius-md)" count={3} />
        </div>
      ) : words.length === 0 ? (
        <EmptyState
          icon="check"
          title="You are all caught up"
          description="Nothing is due right now. Learn a few new words and they will come back when it is time to review them."
          action={
            <Button
              iconRight="arrow-right"
              onClick={() => {
                void navigate(ROUTES.vocabulary);
              }}
            >
              Browse vocabulary
            </Button>
          }
        />
      ) : (
        <>
          <ul className={styles.list}>
            {words.map((word) => (
              <li key={word.id}>
                <ReviewQueueItem word={word} />
              </li>
            ))}
          </ul>
          {hidden > 0 ? (
            <p className={styles.more}>{formatNumber(hidden)} more waiting in the queue</p>
          ) : null}
        </>
      )}
    </Card>
  );
}

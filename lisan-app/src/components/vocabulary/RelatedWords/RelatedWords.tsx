import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import type { VocabularyWord } from '@/types/content';
import { cn } from '@/utils/cn';

import { RelatedWordTile } from './RelatedWordTile';
import styles from './RelatedWords.module.css';

export interface RelatedWordsProps {
  words: readonly VocabularyWord[];
  isLoading?: boolean | undefined;
  isError?: boolean | undefined;
  onRetry?: (() => void) | undefined;
  skeletonCount?: number | undefined;
  className?: string | undefined;
}

/** Grid of words linked to the one being read: synonyms, same-root words, category neighbours. */
export function RelatedWords({
  words,
  isLoading = false,
  isError = false,
  onRetry,
  skeletonCount = 3,
  className,
}: RelatedWordsProps) {
  if (isError) {
    return (
      <ErrorState
        title="We could not load related words"
        description="The rest of this word is still available. Try loading the connections again."
        {...(onRetry ? { onRetry } : {})}
      />
    );
  }

  if (isLoading) {
    return (
      <div className={cn(styles.grid, className)} aria-busy="true" aria-live="polite">
        <span className="u-visually-hidden">Loading related words…</span>
        {Array.from({ length: skeletonCount }, (_unused, index) => (
          <Skeleton key={index} height={76} radius="var(--radius-lg)" />
        ))}
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <EmptyState
        icon="flashcard"
        title="No related words yet"
        description="This word has no connections in the library. Browse its category to find neighbours."
      />
    );
  }

  return (
    <ul className={cn(styles.grid, className)}>
      {words.map((word) => (
        <li key={word.id} className={styles.item}>
          <RelatedWordTile word={word} />
        </li>
      ))}
    </ul>
  );
}

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { illustrations, type VectorAsset } from '@/assets';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { VocabularyRow } from '@/components/ui/VocabularyRow';
import { routePaths } from '@/constants/routes';
import type { Category, VocabularyWord } from '@/types/content';
import { cn } from '@/utils/cn';

import styles from './VocabularyList.module.css';

export interface VocabularyListProps {
  words: readonly VocabularyWord[];
  /** Full categories keyed by id, so a row can show the badge's name, icon and accent color. */
  categories?: Readonly<Record<string, Category>>;
  bookmarkedIds?: ReadonlySet<string> | readonly string[];
  isLoading?: boolean;
  error?: unknown;
  onRetry?: (() => void) | undefined;
  onToggleBookmark?: ((word: VocabularyWord) => void) | undefined;
  /** Overrides the default navigation to `/vocabulary/:wordId`. */
  onOpenWord?: ((word: VocabularyWord) => void) | undefined;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  /** Defaults to the "no search results" scene; Bookmarks passes its own. */
  emptyIllustration?: VectorAsset;
  skeletonCount?: number;
  className?: string | undefined;
}

function toSet(value: VocabularyListProps['bookmarkedIds']): ReadonlySet<string> {
  if (!value) return new Set();
  return value instanceof Set ? value : new Set(value as readonly string[]);
}

/**
 * Renders the vocabulary rows plus every list state the spec requires: loading skeletons, an
 * empty state, an error state with retry, and the success list.
 */
export function VocabularyList({
  words,
  categories,
  bookmarkedIds,
  isLoading = false,
  error,
  onRetry,
  onToggleBookmark,
  onOpenWord,
  emptyTitle = 'No vocabulary found',
  emptyDescription = 'Try a different search term, or clear the filters to see every word.',
  emptyAction,
  emptyIllustration = illustrations.emptySearch,
  skeletonCount = 6,
  className,
}: VocabularyListProps) {
  const navigate = useNavigate();
  const bookmarked = toSet(bookmarkedIds);

  const handleOpen = useCallback(
    (word: VocabularyWord) => {
      if (onOpenWord) {
        onOpenWord(word);
        return;
      }
      void navigate(routePaths.wordDetail(word.id));
    },
    [navigate, onOpenWord],
  );

  if (error) {
    return (
      <ErrorState
        illustration={illustrations.errorGeneric}
        title="We could not load these words"
        description="Something went wrong while fetching the vocabulary list. Please try again."
        {...(onRetry ? { onRetry } : {})}
      />
    );
  }

  if (isLoading) {
    return (
      <div className={cn(styles.list, className)} aria-busy="true" aria-live="polite">
        <span className="u-visually-hidden">Loading vocabulary…</span>
        {Array.from({ length: skeletonCount }, (_, index) => (
          <Card key={index} padding="sm">
            <div className={styles.skeletonRow}>
              <Skeleton width={64} height={64} radius="var(--radius-md)" />
              <div className={styles.skeletonCopy}>
                <Skeleton width="34%" height={24} />
                <Skeleton width="22%" height={13} />
                <Skeleton width="28%" height={13} />
              </div>
              <Skeleton width={40} height={40} circle />
              <Skeleton width={40} height={40} circle />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <EmptyState
        illustration={emptyIllustration}
        title={emptyTitle}
        description={emptyDescription}
        {...(emptyAction ? { action: emptyAction } : {})}
      />
    );
  }

  return (
    <ul className={cn(styles.list, className)}>
      {words.map((word) => (
        <li key={word.id}>
          <VocabularyRow
            word={word}
            {...(categories?.[word.categoryId] ? { category: categories[word.categoryId] } : {})}
            bookmarked={bookmarked.has(word.id)}
            onOpen={handleOpen}
            {...(onToggleBookmark ? { onToggleBookmark } : {})}
          />
        </li>
      ))}
    </ul>
  );
}

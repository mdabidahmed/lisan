import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Category } from '@/types/content';
import { cn } from '@/utils/cn';

import { CategoryCard } from './CategoryCard';
import styles from './CategoryGrid.module.css';

export interface CategoryGridProps {
  categories: readonly Category[];
  /** Learned-word counts keyed by category id. */
  learnedByCategory?: Readonly<Record<string, number>>;
  isLoading?: boolean;
  variant?: 'grid' | 'strip';
  className?: string | undefined;
}

export function CategoryGrid({
  categories,
  learnedByCategory,
  isLoading = false,
  variant = 'grid',
  className,
}: CategoryGridProps) {
  if (isLoading) {
    return (
      <div className={cn(styles.grid, className)} data-variant={variant} aria-hidden="true">
        {[0, 1, 2, 3].map((index) => (
          <Skeleton key={index} height={82} radius="var(--radius-lg)" />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <EmptyState
        icon="vocabulary"
        title="No categories yet"
        description="Vocabulary categories will appear here once the content library is loaded."
      />
    );
  }

  return (
    <ul className={cn(styles.grid, className)} data-variant={variant}>
      {categories.map((category) => (
        <li key={category.id} className={styles.item}>
          <CategoryCard
            category={category}
            learned={learnedByCategory?.[category.id] ?? 0}
            variant={variant}
          />
        </li>
      ))}
    </ul>
  );
}

import { Icon } from '@/components/icons';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Category } from '@/types/content';
import type { CategoryProgress } from '@/types/progress';
import { resolveAccentColor } from '@/utils/color';

import styles from './CategoryProgressList.module.css';

export interface CategoryProgressListProps {
  items: readonly CategoryProgress[];
  categoriesById: Readonly<Record<string, Category>>;
}

/** Per-category completion rows (reference screen 5, right column). */
export function CategoryProgressList({ items, categoriesById }: CategoryProgressListProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon="statistics"
        title="No category progress yet"
        description="Learn a few words and your category breakdown will appear here."
      />
    );
  }

  return (
    <ul className={styles.list}>
      {items.map((item) => {
        const category = categoriesById[item.categoryId];
        const accent = resolveAccentColor(category?.color);
        return (
          <li key={item.categoryId} className={styles.row}>
            <span
              className={styles.icon}
              style={{ color: accent.fg, backgroundColor: accent.bg }}
              aria-hidden="true"
            >
              <Icon name={category?.icon ?? 'vocabulary'} size={18} />
            </span>
            <span className={styles.name}>{category?.name ?? item.categoryId}</span>
            <span className={styles.bar}>
              <ProgressBar
                value={item.percent}
                size="sm"
                tone="accent"
                accentColor={accent.fg}
                ariaLabel={`${category?.name ?? item.categoryId}: ${item.percent}% complete`}
              />
            </span>
            <span className={styles.percent}>{item.percent}%</span>
            <span className={styles.count}>
              {item.learned}/{item.total}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

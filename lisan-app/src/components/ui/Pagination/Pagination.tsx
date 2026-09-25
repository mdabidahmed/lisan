import { IconButton } from '@/components/ui/IconButton';
import { cn } from '@/utils';

import styles from './Pagination.module.css';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number | undefined;
  label?: string | undefined;
  className?: string | undefined;
}

type PageItem = number | 'gap-start' | 'gap-end';

function numberRange(from: number, to: number): number[] {
  const out: number[] = [];
  for (let value = from; value <= to; value += 1) out.push(value);
  return out;
}

/** First and last page stay reachable in one click; everything between collapses to an ellipsis. */
function buildItems(page: number, totalPages: number, siblingCount: number): PageItem[] {
  const windowSize = siblingCount * 2 + 5;
  if (totalPages <= windowSize) return numberRange(1, totalPages);

  const start = Math.max(page - siblingCount, 1);
  const end = Math.min(page + siblingCount, totalPages);
  const hasStartGap = start > 2;
  const hasEndGap = end < totalPages - 1;

  if (!hasStartGap) {
    return [...numberRange(1, windowSize - 2), 'gap-end', totalPages];
  }
  if (!hasEndGap) {
    return [1, 'gap-start', ...numberRange(totalPages - (windowSize - 3), totalPages)];
  }
  return [1, 'gap-start', ...numberRange(start, end), 'gap-end', totalPages];
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  label = 'Pagination',
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const items = buildItems(page, totalPages, siblingCount);

  return (
    <nav aria-label={label} className={cn(styles.root, className)}>
      <IconButton
        icon="arrow-left"
        label="Previous page"
        variant="ghost"
        shape="circle"
        size="sm"
        disabled={page <= 1}
        onClick={() => {
          onPageChange(page - 1);
        }}
      />

      <ul className={styles.list}>
        {items.map((item) =>
          typeof item === 'number' ? (
            <li key={item}>
              <button
                type="button"
                className={cn(styles.page, item === page && styles.current)}
                {...(item === page ? { 'aria-current': 'page' as const } : {})}
                aria-label={`Page ${item}`}
                onClick={() => {
                  onPageChange(item);
                }}
              >
                {item}
              </button>
            </li>
          ) : (
            <li key={item} className={styles.gap} aria-hidden="true">
              &hellip;
            </li>
          ),
        )}
      </ul>

      <IconButton
        icon="arrow-right"
        label="Next page"
        variant="ghost"
        shape="circle"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => {
          onPageChange(page + 1);
        }}
      />
    </nav>
  );
}

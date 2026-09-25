import { type ReactNode } from 'react';

import { Icon } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Select, type SelectOption } from '@/components/ui/Select';
import { WORD_STATUS_LABEL } from '@/features/vocabulary/wordStatus';
import type { VocabularySort } from '@/types/api';
import { CEFR_LEVELS, type CEFRLevel } from '@/types/content';
import type { WordStatus } from '@/types/progress';
import { cn } from '@/utils/cn';

import { FilterGroup } from './FilterGroup';
import styles from './VocabularyFilters.module.css';

/** `new` is deliberately absent: "words I have not started" is the unfiltered list minus nothing. */
const STATUS_FILTERS: readonly WordStatus[] = ['learning', 'review', 'mastered'];

const SORT_OPTIONS: readonly SelectOption<VocabularySort>[] = [
  { value: 'curated', label: 'Suggested' },
  { value: 'a-z', label: 'A–Z' },
  { value: 'recent', label: 'Recently Added' },
  { value: 'most-practiced', label: 'Most Practiced' },
];

const SORT_LABEL: Record<VocabularySort, string> = {
  curated: 'Suggested',
  'a-z': 'A–Z',
  recent: 'Recently Added',
  'most-practiced': 'Most Practiced',
};

/** A filter the learner has turned on, with the one-click way to turn it back off. */
interface ActiveFilter {
  key: string;
  label: string;
  clear: () => void;
}

export interface VocabularyFiltersProps {
  level: CEFRLevel | 'all';
  onLevelChange: (value: CEFRLevel | 'all') => void;
  status: WordStatus | 'all';
  onStatusChange: (value: WordStatus | 'all') => void;
  bookmarkedOnly: boolean;
  onBookmarkedOnlyChange: (value: boolean) => void;
  sort: VocabularySort;
  onSortChange: (value: VocabularySort) => void;
  /** Shows the reset control; the page owns what "filtered" means. */
  isFiltered?: boolean | undefined;
  onReset?: (() => void) | undefined;
  /** The primary category chips, laid out inline to the left of the disclosure trigger. */
  children?: ReactNode;
  className?: string | undefined;
}

/**
 * The vocabulary filter bar: category chips inline with a disclosure that holds CEFR level,
 * learner status and sort (spec §12 and §32).
 *
 * Only the chips and the trigger are on screen at rest, because the list they filter is the
 * point of the page — the full set of controls used a viewport's worth of height. The trigger
 * carries a count of how many of the collapsed filters are on, and any that are on also appear
 * as a removable pill under the bar, so a filter can never quietly shrink the result set while
 * out of sight.
 *
 * `<details>` rather than a scripted popover: the browser already takes the collapsed controls
 * out of the layout and out of the tab order, and gives the trigger its expanded state.
 *
 * The component is stateless — the page keeps the values in the URL so a filtered list is
 * shareable and survives a reload.
 */
export function VocabularyFilters({
  level,
  onLevelChange,
  status,
  onStatusChange,
  bookmarkedOnly,
  onBookmarkedOnlyChange,
  sort,
  onSortChange,
  isFiltered = false,
  onReset,
  children,
  className,
}: VocabularyFiltersProps) {
  const active: ActiveFilter[] = [];
  if (level !== 'all') {
    active.push({
      key: 'level',
      label: `Level ${level}`,
      clear: () => {
        onLevelChange('all');
      },
    });
  }
  if (status !== 'all') {
    active.push({
      key: 'status',
      label: WORD_STATUS_LABEL[status],
      clear: () => {
        onStatusChange('all');
      },
    });
  }
  if (bookmarkedOnly) {
    active.push({
      key: 'bookmarked',
      label: 'Bookmarked',
      clear: () => {
        onBookmarkedOnlyChange(false);
      },
    });
  }
  if (sort !== 'curated') {
    active.push({
      key: 'sort',
      label: `Sorted by ${SORT_LABEL[sort]}`,
      clear: () => {
        onSortChange('curated');
      },
    });
  }

  const showReset = isFiltered && onReset !== undefined;

  return (
    <div className={cn(styles.root, className)}>
      {children === undefined ? null : <div className={styles.strip}>{children}</div>}

      <details className={styles.disclosure}>
        <summary className={styles.trigger}>
          <span>Filters</span>
          {active.length > 0 ? (
            <>
              <span className={styles.badge} aria-hidden="true">
                {active.length}
              </span>
              <span className="u-visually-hidden">{`, ${active.length} active`}</span>
            </>
          ) : null}
          <Icon name="chevron-down" size={15} className={styles.chevron} />
        </summary>

        <div className={styles.panel}>
          <div className={styles.row}>
            <FilterGroup label="Level">
              <Chip
                label="All levels"
                className={styles.chip}
                selected={level === 'all'}
                onClick={() => {
                  onLevelChange('all');
                }}
              />
              {CEFR_LEVELS.map((item) => (
                <Chip
                  key={item}
                  label={item}
                  className={styles.chip}
                  selected={level === item}
                  onClick={() => {
                    onLevelChange(level === item ? 'all' : item);
                  }}
                />
              ))}
            </FilterGroup>

            <Select
              options={SORT_OPTIONS}
              value={sort}
              onValueChange={onSortChange}
              label="Sort by"
              className={styles.sort}
            />
          </div>

          <div className={styles.row}>
            <FilterGroup label="Status">
              {STATUS_FILTERS.map((item) => (
                <Chip
                  key={item}
                  label={WORD_STATUS_LABEL[item]}
                  className={styles.chip}
                  selected={status === item}
                  onClick={() => {
                    onStatusChange(status === item ? 'all' : item);
                  }}
                />
              ))}
              <Chip
                label="Bookmarked"
                icon="favorite"
                className={styles.chip}
                selected={bookmarkedOnly}
                onClick={() => {
                  onBookmarkedOnlyChange(!bookmarkedOnly);
                }}
              />
            </FilterGroup>
          </div>
        </div>
      </details>

      {active.length > 0 || showReset ? (
        <div className={styles.active}>
          {active.map((filter) => (
            <button
              key={filter.key}
              type="button"
              className={styles.pill}
              aria-label={`Remove filter: ${filter.label}`}
              onClick={filter.clear}
            >
              <span>{filter.label}</span>
              <Icon name="close" size={12} />
            </button>
          ))}
          {showReset ? (
            <Button variant="ghost" size="sm" iconLeft="close" onClick={onReset}>
              Clear filters
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

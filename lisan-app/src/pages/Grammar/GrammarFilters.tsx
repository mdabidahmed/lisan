import { useId, useMemo, type ReactNode } from 'react';

import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { GRAMMAR_TOPICS, grammarTopicLabel } from '@/features/grammar';
import {
  CEFR_LEVELS,
  type CEFRLevel,
  type GrammarLesson,
  type GrammarTopic,
} from '@/types/content';

import type { LevelFilter, TopicFilter } from './useGrammarFilters';
import styles from './Grammar.module.css';

interface FilterRowProps {
  label: string;
  children: ReactNode;
}

/** The visible label doubles as the group's accessible name. */
function FilterRow({ label, children }: FilterRowProps) {
  const labelId = useId();

  return (
    <div className={styles.filterRow} role="group" aria-labelledby={labelId}>
      <span className={styles.filterLabel} id={labelId}>
        {label}
      </span>
      <div className={styles.chips}>{children}</div>
    </div>
  );
}

export interface GrammarFiltersProps {
  /** Every lesson, not the filtered subset — the counts on the chips come from here. */
  lessons: readonly GrammarLesson[];
  topic: TopicFilter;
  level: LevelFilter;
  onTopicChange: (value: TopicFilter) => void;
  onLevelChange: (value: LevelFilter) => void;
  isFiltered: boolean;
  onReset: () => void;
}

function countBy<T extends string>(values: readonly T[]): Map<T, number> {
  const counts = new Map<T, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return counts;
}

/**
 * Topic and level filters for the grammar library (spec §56).
 *
 * Every chip is a toggle: pressing the active one clears that filter. Topics with no lessons yet
 * are left out rather than shown as dead ends.
 */
export function GrammarFilters({
  lessons,
  topic,
  level,
  onTopicChange,
  onLevelChange,
  isFiltered,
  onReset,
}: GrammarFiltersProps) {
  const topicCounts = useMemo(() => countBy(lessons.map((lesson) => lesson.topic)), [lessons]);
  const levelCounts = useMemo(() => countBy(lessons.map((lesson) => lesson.level)), [lessons]);

  const topics = useMemo(
    () => GRAMMAR_TOPICS.filter((item: GrammarTopic) => (topicCounts.get(item) ?? 0) > 0),
    [topicCounts],
  );
  const levels = useMemo(
    () => CEFR_LEVELS.filter((item: CEFRLevel) => (levelCounts.get(item) ?? 0) > 0),
    [levelCounts],
  );

  return (
    <div className={styles.filters}>
      <FilterRow label="Topic">
        <Chip
          label="All topics"
          count={lessons.length}
          selected={topic === 'all'}
          onClick={() => {
            onTopicChange('all');
          }}
        />
        {topics.map((item) => (
          <Chip
            key={item}
            label={grammarTopicLabel(item)}
            count={topicCounts.get(item) ?? 0}
            selected={topic === item}
            onClick={() => {
              onTopicChange(topic === item ? 'all' : item);
            }}
          />
        ))}
      </FilterRow>

      <div className={styles.filterRowWithAction}>
        <FilterRow label="Level">
          {levels.map((item) => (
            <Chip
              key={item}
              label={item}
              count={levelCounts.get(item) ?? 0}
              selected={level === item}
              onClick={() => {
                onLevelChange(level === item ? 'all' : item);
              }}
            />
          ))}
        </FilterRow>

        {isFiltered ? (
          <Button variant="ghost" size="sm" iconLeft="close" onClick={onReset}>
            Clear filters
          </Button>
        ) : null}
      </div>
    </div>
  );
}

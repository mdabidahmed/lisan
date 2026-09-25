import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import { isGrammarTopic } from '@/features/grammar';
import { CEFR_LEVELS, type CEFRLevel, type GrammarTopic } from '@/types/content';

export type TopicFilter = GrammarTopic | 'all';
export type LevelFilter = CEFRLevel | 'all';

function asTopic(value: string | null): TopicFilter {
  return value && isGrammarTopic(value) ? value : 'all';
}

function asLevel(value: string | null): LevelFilter {
  return value && (CEFR_LEVELS as readonly string[]).includes(value) ? (value as CEFRLevel) : 'all';
}

export interface GrammarFilters {
  topic: TopicFilter;
  level: LevelFilter;
  isFiltered: boolean;
  setTopic: (value: TopicFilter) => void;
  setLevel: (value: LevelFilter) => void;
  reset: () => void;
}

/** Filter state lives in the URL, so a filtered topic list is shareable and survives a reload. */
export function useGrammarFilters(): GrammarFilters {
  const [params, setParams] = useSearchParams();

  const topic = asTopic(params.get('topic'));
  const level = asLevel(params.get('level'));

  const update = useCallback(
    (patch: Record<string, string>) => {
      setParams(
        (current) => {
          const next = new URLSearchParams(current);
          for (const [key, value] of Object.entries(patch)) {
            if (value === 'all' || value === '') next.delete(key);
            else next.set(key, value);
          }
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  return {
    topic,
    level,
    isFiltered: topic !== 'all' || level !== 'all',
    setTopic: useCallback(
      (value: TopicFilter) => {
        update({ topic: value });
      },
      [update],
    ),
    setLevel: useCallback(
      (value: LevelFilter) => {
        update({ level: value });
      },
      [update],
    ),
    reset: useCallback(() => {
      setParams(new URLSearchParams(), { replace: true });
    }, [setParams]),
  };
}

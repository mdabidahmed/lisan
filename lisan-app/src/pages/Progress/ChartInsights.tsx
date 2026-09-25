import type { CSSProperties } from 'react';

import { Icon, type IconName } from '@/components/icons';
import type { ProgressSummary } from '@/types';
import { formatNumber } from '@/utils/format';

import styles from './ChartInsights.module.css';

export interface ChartInsightsProps {
  summary: ProgressSummary;
}

interface Insight {
  icon: IconName;
  label: string;
  value: string;
  accent: string;
}

type TileStyle = CSSProperties & Record<`--${string}`, string>;

function tileStyleFor(accent: string): TileStyle {
  return {
    '--insight-fg': `var(--color-accent-${accent})`,
    '--insight-bg': `var(--color-accent-${accent}-soft)`,
  };
}

/**
 * Four secondary numbers the headline stat cards don't show — mastery, review volume, best
 * streak and today's queue. Sits under the trend line so the chart card carries as much signal
 * as the category list beside it instead of trailing off into empty space.
 */
export function ChartInsights({ summary }: ChartInsightsProps) {
  const insights: Insight[] = [
    {
      icon: 'trophy',
      label: 'Words Mastered',
      value: formatNumber(summary.wordsMastered),
      accent: 'amber',
    },
    {
      icon: 'replay',
      label: 'Words Reviewed',
      value: formatNumber(summary.wordsReviewed),
      accent: 'teal',
    },
    {
      icon: 'streak',
      label: 'Longest Streak',
      value: `${formatNumber(summary.longestStreak)}d`,
      accent: 'orange',
    },
    {
      icon: 'alert',
      label: 'Due Today',
      value: formatNumber(summary.dueToday),
      accent: 'red',
    },
  ];

  return (
    <div className={styles.grid}>
      {insights.map((insight) => (
        <div key={insight.label} className={styles.item}>
          <span className={styles.tile} style={tileStyleFor(insight.accent)}>
            <Icon name={insight.icon} size={18} />
          </span>
          <span className={styles.body}>
            <span className={styles.value}>{insight.value}</span>
            <span className={styles.label}>{insight.label}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

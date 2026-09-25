import type { CSSProperties } from 'react';

import { Icon, type IconName } from '@/components/icons';
import { Card } from '@/components/ui/Card';
import { cn, resolveAccentColor } from '@/utils';

import styles from './StatCard.module.css';

export interface StatCardProps {
  icon: IconName;
  label: string;
  value: string;
  accent?: string | undefined;
  delta?: string | undefined;
  deltaTone?: 'positive' | 'negative' | 'neutral' | undefined;
  className?: string | undefined;
}

type TileStyle = CSSProperties & Record<`--${string}`, string>;

/** Headline metric tile for the Progress dashboard (reference screen 5). */
export function StatCard({
  icon,
  label,
  value,
  accent,
  delta,
  deltaTone = 'neutral',
  className,
}: StatCardProps) {
  const tone = resolveAccentColor(accent);
  const tileStyle: TileStyle = { '--stat-fg': tone.fg, '--stat-bg': tone.bg };

  return (
    <Card padding="md" className={cn(styles.root, className)}>
      <span className={styles.tile} style={tileStyle}>
        <Icon name={icon} size={22} />
      </span>
      <span className={styles.body}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{value}</span>
        {delta ? (
          <span className={cn(styles.delta, styles[deltaTone])}>
            {deltaTone === 'neutral' ? null : <Icon name="progress" size={13} />}
            {delta}
          </span>
        ) : null}
      </span>
    </Card>
  );
}

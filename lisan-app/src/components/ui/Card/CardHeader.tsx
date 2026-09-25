import type { CSSProperties, ReactNode } from 'react';

import { Icon, type IconName } from '@/components/icons';
import { cn, resolveAccentColor } from '@/utils';

import styles from './CardHeader.module.css';

export interface CardHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: IconName | undefined;
  /** Accent token name or hex driving the icon tile. */
  accent?: string | undefined;
  action?: ReactNode;
  as?: 'h2' | 'h3' | 'h4' | undefined;
  id?: string | undefined;
  className?: string | undefined;
}

export function CardHeader({
  title,
  subtitle,
  icon,
  accent,
  action,
  as: Heading = 'h3',
  id,
  className,
}: CardHeaderProps) {
  const tile = resolveAccentColor(accent);
  const tileStyle: CSSProperties = { color: tile.fg, backgroundColor: tile.bg };

  return (
    <div className={cn(styles.header, className)}>
      {icon === undefined ? null : (
        <span className={styles.tile} style={tileStyle}>
          <Icon name={icon} size={20} />
        </span>
      )}

      <div className={styles.copy}>
        <Heading className={styles.title} id={id}>
          {title}
        </Heading>
        {subtitle === undefined ? null : <p className={styles.subtitle}>{subtitle}</p>}
      </div>

      {action === undefined ? null : <div className={styles.action}>{action}</div>}
    </div>
  );
}

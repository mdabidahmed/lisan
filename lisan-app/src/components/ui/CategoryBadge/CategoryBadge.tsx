import type { CSSProperties } from 'react';

import { Icon, type IconName } from '@/components/icons';
import { cn, resolveAccentColor } from '@/utils';

import styles from './CategoryBadge.module.css';

export interface CategoryBadgeProps {
  name: string;
  color?: string | undefined;
  icon?: IconName | undefined;
  size?: 'sm' | 'md' | undefined;
  className?: string | undefined;
}

type BadgeStyle = CSSProperties & Record<`--${string}`, string>;

/** Category pill tinted with the category's own accent, used in lists and on the word detail. */
export function CategoryBadge({ name, color, icon, size = 'md', className }: CategoryBadgeProps) {
  const accent = resolveAccentColor(color);
  const style: BadgeStyle = { '--category-fg': accent.fg, '--category-bg': accent.bg };

  return (
    <span className={cn(styles.root, styles[size], className)} style={style}>
      {icon ? <Icon name={icon} size={size === 'sm' ? 13 : 15} /> : null}
      <span className={styles.name}>{name}</span>
    </span>
  );
}

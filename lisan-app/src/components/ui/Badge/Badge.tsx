import type { ReactNode } from 'react';

import { Icon, type IconName } from '@/components/icons';
import type { BadgeVariant } from '@/types/ui';
import { cn } from '@/utils';

import styles from './Badge.module.css';

export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  variant?: BadgeVariant | undefined;
  size?: BadgeSize | undefined;
  icon?: IconName | undefined;
  className?: string | undefined;
  children: ReactNode;
}

const VARIANT_CLASS: Record<BadgeVariant, string | undefined> = {
  neutral: styles.neutral,
  primary: styles.primary,
  success: styles.success,
  warning: styles.warning,
  error: styles.error,
  info: styles.info,
  purple: styles.purple,
};

const SIZE_CLASS: Record<BadgeSize, string | undefined> = { sm: styles.sm, md: styles.md };

export function Badge({ variant = 'neutral', size = 'md', icon, className, children }: BadgeProps) {
  return (
    <span className={cn(styles.badge, VARIANT_CLASS[variant], SIZE_CLASS[size], className)}>
      {icon === undefined ? null : <Icon name={icon} size={size === 'sm' ? 12 : 13} />}
      {children}
    </span>
  );
}

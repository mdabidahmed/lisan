import type { ReactNode } from 'react';

import { Icon, type IconName } from '@/components/icons';
import { cn } from '@/utils';

import styles from './Alert.module.css';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  variant?: AlertVariant | undefined;
  icon?: IconName | undefined;
  title?: string | undefined;
  className?: string | undefined;
  children: ReactNode;
}

const VARIANT_CLASS: Record<AlertVariant, string | undefined> = {
  info: styles.info,
  success: styles.success,
  warning: styles.warning,
  error: styles.error,
};

const VARIANT_ICON: Record<AlertVariant, IconName> = {
  info: 'info',
  success: 'check',
  warning: 'alert',
  error: 'alert',
};

export function Alert({ variant = 'info', icon, title, className, children }: AlertProps) {
  return (
    <div
      className={cn(styles.alert, VARIANT_CLASS[variant], className)}
      // Only errors interrupt: the other variants are static guidance, not live announcements.
      {...(variant === 'error' ? { role: 'alert' } : {})}
    >
      <Icon name={icon ?? VARIANT_ICON[variant]} size={18} className={styles.icon} />
      <div className={styles.copy}>
        {title === undefined ? null : <p className={styles.title}>{title}</p>}
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}

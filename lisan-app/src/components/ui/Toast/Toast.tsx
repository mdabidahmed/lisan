import { Icon, type IconName } from '@/components/icons';
import { IconButton } from '@/components/ui/IconButton';
import type { ToastVariant } from '@/types';
import { cn } from '@/utils';

import styles from './Toast.module.css';

export interface ToastData {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  /** Auto-dismiss delay in ms. Honoured by the provider, not by this component. */
  duration?: number;
}

export interface ToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

const VARIANT_ICON: Record<ToastVariant, IconName> = {
  info: 'info',
  success: 'check',
  warning: 'alert',
  error: 'alert',
};

/** Presentational only — queueing and auto-dismiss live in the toast provider. */
export function Toast({ toast, onDismiss }: ToastProps) {
  const { id, variant, title, description } = toast;

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={cn(styles.root, styles[variant])}
    >
      <Icon name={VARIANT_ICON[variant]} size={18} className={styles.icon} />
      <div className={styles.copy}>
        <p className={styles.title}>{title}</p>
        {description === undefined ? null : <p className={styles.description}>{description}</p>}
      </div>
      <IconButton
        icon="close"
        label="Dismiss notification"
        variant="ghost"
        shape="circle"
        size="sm"
        className={styles.dismiss}
        onClick={() => {
          onDismiss(id);
        }}
      />
    </div>
  );
}

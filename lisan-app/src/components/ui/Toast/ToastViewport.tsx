import { Toast, type ToastData } from './Toast';
import styles from './ToastViewport.module.css';

export interface ToastViewportProps {
  toasts: readonly ToastData[];
  onDismiss: (id: string) => void;
}

/**
 * Fixed bottom-end stack. The region stays mounted even when empty so assistive technology has a
 * stable live region to watch.
 */
export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  return (
    <div role="region" aria-label="Notifications" aria-live="polite" className={styles.root}>
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

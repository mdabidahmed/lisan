import { useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { IconButton } from '@/components/ui/IconButton';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { cn } from '@/utils';

import styles from './Modal.module.css';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string | undefined;
  size?: 'sm' | 'md' | 'lg' | undefined;
  footer?: ReactNode;
  children: ReactNode;
}

/**
 * Portalled dialog. Focus is trapped for as long as it is open and restored to the trigger on
 * close, which `useFocusTrap` already implements for the mobile drawer.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  size = 'md',
  footer,
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useFocusTrap(dialogRef, open, { onEscape: onClose });
  useLockBodyScroll(open);

  if (!open) return null;

  return createPortal(
    <div className={styles.layer}>
      <div className={styles.backdrop} role="presentation" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(styles.dialog, styles[size])}
        {...(description === undefined ? {} : { 'aria-describedby': descriptionId })}
      >
        <header className={styles.header}>
          <div className={styles.heading}>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            {description === undefined ? null : (
              <p id={descriptionId} className={styles.description}>
                {description}
              </p>
            )}
          </div>
          <IconButton
            icon="close"
            label="Close dialog"
            variant="ghost"
            shape="circle"
            size="sm"
            onClick={onClose}
          />
        </header>

        <div className={styles.body}>{children}</div>

        {footer === undefined ? null : <footer className={styles.footer}>{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}

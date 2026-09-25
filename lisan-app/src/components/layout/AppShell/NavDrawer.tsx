import { useCallback, useEffect, useRef } from 'react';

import { Sidebar } from '@/components/layout/Sidebar';
import { IconButton } from '@/components/ui/IconButton';
import { MEDIA } from '@/constants/breakpoints';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

import styles from './NavDrawer.module.css';

export interface NavDrawerProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Off-canvas navigation for phones: focus-trapped, Escape-dismissable, with an inert backdrop.
 * Kept mounted-but-hidden so the open/close transition has something to animate.
 */
export function NavDrawer({ open, onClose }: NavDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useFocusTrap(panelRef, open, { onEscape: onClose });
  useLockBodyScroll(open);

  const handleBackdropClick = useCallback(() => {
    onClose();
  }, [onClose]);

  // Close if the viewport grows back to the persistent-sidebar breakpoint. The query comes from
  // `MEDIA` rather than a literal: `breakpoints.ts` is what the stylesheets mirror, and a hard-coded
  // 768 here is precisely the drift that file exists to prevent.
  useEffect(() => {
    if (!open || typeof window.matchMedia !== 'function') return;
    const list = window.matchMedia(MEDIA.tabletUp);
    const handleChange = () => {
      if (list.matches) onClose();
    };
    list.addEventListener('change', handleChange);
    return () => {
      list.removeEventListener('change', handleChange);
    };
  }, [open, onClose]);

  return (
    // `inert` on the wrapper removes the closed drawer — backdrop included — from the tab order
    // and the accessibility tree, so no `aria-hidden` juggling is needed.
    <div className={styles.root} data-open={open} inert={!open}>
      {/* Mouse-only affordance: keyboard users close with Escape or the labelled close button,
          so the backdrop stays out of the accessibility tree and the tab order. */}
      <button
        type="button"
        className={styles.backdrop}
        tabIndex={-1}
        aria-hidden="true"
        onClick={handleBackdropClick}
      />
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        tabIndex={-1}
      >
        <div className={styles.close}>
          <IconButton
            icon="close"
            label="Close navigation menu"
            variant="ghost"
            onClick={onClose}
          />
        </div>
        <Sidebar variant="drawer" onNavigate={onClose} />
      </div>
    </div>
  );
}

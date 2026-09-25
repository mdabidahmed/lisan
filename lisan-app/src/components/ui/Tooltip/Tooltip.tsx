import { cloneElement, useId, type ReactElement } from 'react';

import { cn } from '@/utils';

import styles from './Tooltip.module.css';

export type TooltipPlacement = 'top' | 'bottom' | 'start' | 'end';
export type TooltipAlign = 'center' | 'end';

export interface TooltipProps {
  content: string;
  placement?: TooltipPlacement | undefined;
  /**
   * `top`/`bottom` bubbles centre on the trigger by default. Pass `end` when the trigger sits
   * flush against the edge of the viewport (a page-header action, a list row's trailing button)
   * so the bubble grows inward instead of overflowing.
   */
  align?: TooltipAlign | undefined;
  /** Exactly one focusable child — hover and keyboard focus both reveal the bubble. */
  children: ReactElement;
  className?: string | undefined;
}

type DescribableElement = ReactElement<{ 'aria-describedby'?: string | undefined }>;

const PLACEMENT_CLASS: Record<TooltipPlacement, string | undefined> = {
  top: styles.top,
  bottom: styles.bottom,
  start: styles.start,
  end: styles.end,
};

/**
 * Deliberately CSS-only: no portal, no positioning engine, no state. Hover and `:focus-within` on
 * the wrapper reveal the bubble, and `aria-describedby` keeps the text available to assistive
 * technology whether or not it is visible.
 */
export function Tooltip({
  content,
  placement = 'top',
  align = 'center',
  children,
  className,
}: TooltipProps) {
  const tooltipId = useId();
  const trigger = cloneElement(children as DescribableElement, {
    'aria-describedby': tooltipId,
  });

  return (
    <span
      className={cn(
        styles.wrapper,
        PLACEMENT_CLASS[placement],
        align === 'end' && styles.alignEnd,
        className,
      )}
    >
      {trigger}
      <span className={styles.bubble} id={tooltipId} role="tooltip">
        {content}
      </span>
    </span>
  );
}

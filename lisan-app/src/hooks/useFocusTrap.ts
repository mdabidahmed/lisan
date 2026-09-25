import { useEffect, type RefObject } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Deliberately attribute-based rather than layout-based: `offsetParent` is always null under
 * jsdom, which would make the trap untestable, and everything inside an open dialog is visible by
 * construction.
 */
function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) =>
      !element.hasAttribute('disabled') &&
      element.getAttribute('aria-hidden') !== 'true' &&
      element.closest('[hidden]') === null,
  );
}

export interface FocusTrapOptions {
  /** Called on Escape. Omit to disable Escape handling. */
  onEscape?: (() => void) | undefined;
  /** Focus the first focusable child when the trap activates. Defaults to true. */
  autoFocus?: boolean;
}

/**
 * Every active trap, innermost last, so only the innermost one reacts to a key.
 *
 * Traps nest for real: the sidebar's premium card opens a Modal while the mobile drawer holding it
 * is still open and still trapped. Both listeners sit on `document` in the capture phase, and
 * `stopPropagation` does not stop a second listener on the *same* node — so without this stack one
 * Escape would dismiss the dialog and the drawer behind it, and focus would be restored into a
 * panel that is no longer there.
 */
const activeTraps: RefObject<HTMLElement | null>[] = [];

/**
 * Confines Tab/Shift+Tab to `containerRef` while `active`, restores focus to the previously
 * focused element on deactivation, and optionally handles Escape.
 *
 * Shared by the mobile drawer and the Modal so dialog semantics are implemented exactly once.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
  { onEscape, autoFocus = true }: FocusTrapOptions = {},
): void {
  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    if (autoFocus) {
      const [first] = getFocusable(container);
      (first ?? container).focus({ preventScroll: true });
    }

    activeTraps.push(containerRef);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (activeTraps[activeTraps.length - 1] !== containerRef) return;

      if (event.key === 'Escape' && onEscape) {
        event.stopPropagation();
        onEscape();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = getFocusable(container);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      const activeElement = document.activeElement;
      if (event.shiftKey && (activeElement === first || activeElement === container)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      const index = activeTraps.lastIndexOf(containerRef);
      if (index !== -1) activeTraps.splice(index, 1);
      document.removeEventListener('keydown', handleKeyDown, true);
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, [active, containerRef, onEscape, autoFocus]);
}

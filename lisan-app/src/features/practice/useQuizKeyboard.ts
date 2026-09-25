/**
 * Keyboard shortcuts for a live quiz (product spec §50): 1–4 pick an option, Enter advances.
 *
 * The listener is on the document rather than the card, because a learner who has not tabbed into
 * anything yet still expects the digits to work. Anything typed into a field is left alone, and
 * Enter on a real button is left to the browser so the shortcut can never double-fire.
 */
import { useEffect } from 'react';

export interface UseQuizKeyboardOptions {
  /** How many numbered options the current question has; 0 disables the digit shortcuts. */
  optionCount: number;
  onSelectIndex: (index: number) => void;
  onAdvance: () => void;
  enabled?: boolean | undefined;
}

const DIGIT = /^[1-9]$/;

function isTextEntry(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  return ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

function isNativelyActivated(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return ['BUTTON', 'A'].includes(target.tagName) || target.getAttribute('role') === 'button';
}

export function useQuizKeyboard({
  optionCount,
  onSelectIndex,
  onAdvance,
  enabled = true,
}: UseQuizKeyboardOptions): void {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTextEntry(event.target)) return;

      if (event.key === 'Enter') {
        if (isNativelyActivated(event.target)) return;
        event.preventDefault();
        onAdvance();
        return;
      }

      if (!DIGIT.test(event.key)) return;
      const index = Number(event.key) - 1;
      if (index >= optionCount) return;

      event.preventDefault();
      onSelectIndex(index);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, optionCount, onSelectIndex, onAdvance]);
}

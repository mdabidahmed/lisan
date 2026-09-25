import { useEffect, useId, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';

import { Icon } from '@/components/icons';
import { IconButton } from '@/components/ui/IconButton';
import { SEARCH_DEBOUNCE_MS } from '@/constants';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { cn } from '@/utils';

import styles from './SearchBox.module.css';

export interface SearchBoxProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string | undefined;
  label?: string | undefined;
  size?: 'sm' | 'md' | 'lg' | undefined;
  debounceMs?: number | undefined;
  autoFocus?: boolean | undefined;
  className?: string | undefined;
  onSubmit?: ((value: string) => void) | undefined;
}

/**
 * Search input that keeps keystrokes local and only publishes a debounced value upwards, so list
 * filtering never runs on the typing path. Clearing bypasses the debounce because the learner
 * expects the list to come straight back.
 */
export function SearchBox({
  value,
  onValueChange,
  placeholder = 'Search words (e.g. teacher, book, food...)',
  label = 'Search words',
  size = 'md',
  debounceMs = SEARCH_DEBOUNCE_MS,
  autoFocus = false,
  className,
  onSubmit,
}: SearchBoxProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState(value);
  const debounced = useDebouncedValue(draft, debounceMs);

  // Tracks what the parent already knows, so an echoed `value` prop never re-triggers an emit.
  const publishedRef = useRef(value);
  const valuePropRef = useRef(value);

  // A ref, not a dependency: callers whose `onValueChange` identity changes on every render (a
  // URL-backed filter setter is a common case) must never make the publish effect below re-run —
  // that re-run would fire with whatever `debounced` happened to hold at that moment, which can
  // still be the pre-clear keystroke while its own timer is in flight, silently reviving text the
  // learner just cleared.
  const onValueChangeRef = useRef(onValueChange);
  useEffect(() => {
    onValueChangeRef.current = onValueChange;
  });

  useEffect(() => {
    if (valuePropRef.current === value) return;
    valuePropRef.current = value;
    publishedRef.current = value;
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (debounced === publishedRef.current) return;
    publishedRef.current = debounced;
    onValueChangeRef.current(debounced);
  }, [debounced]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDraft(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    publishedRef.current = draft;
    onSubmit?.(draft);
  };

  const handleClear = () => {
    setDraft('');
    publishedRef.current = '';
    onValueChange('');
    inputRef.current?.focus();
  };

  return (
    <div role="search" className={cn(styles.root, styles[size], className)}>
      <label htmlFor={inputId} className="u-visually-hidden">
        {label}
      </label>
      <Icon name="search" size={18} className={styles.leadingIcon} />
      <input
        id={inputId}
        ref={inputRef}
        type="search"
        className={styles.input}
        value={draft}
        placeholder={placeholder}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        // eslint-disable-next-line jsx-a11y/no-autofocus -- opt-in only, used by the search modal.
        autoFocus={autoFocus}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {draft.length > 0 && (
        <IconButton
          icon="close"
          label="Clear search"
          variant="ghost"
          size="sm"
          shape="circle"
          className={styles.clear}
          onClick={handleClear}
        />
      )}
    </div>
  );
}

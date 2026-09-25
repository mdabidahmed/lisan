import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';

import { Icon, type IconName } from '@/components/icons';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { cn, resolveAccentColor } from '@/utils';

import styles from './Combobox.module.css';

export interface ComboboxOption<T extends string = string> {
  value: T;
  label: string;
  icon?: IconName | undefined;
  /** An `AccentColor` token name (preferred) or a raw hex value, tinting the option's icon. */
  color?: string | undefined;
}

export type ComboboxSize = 'sm' | 'md' | 'lg';

export interface ComboboxProps<T extends string = string> {
  options: readonly ComboboxOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  /** Rendered above the trigger, and read by the listbox as its accessible name. */
  label: string;
  size?: ComboboxSize | undefined;
  className?: string | undefined;
}

const SIZE_CLASS: Record<ComboboxSize, string | undefined> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

/**
 * A styled listbox in place of a native `<select>` — the native popover is un-themeable (flat OS
 * chrome, no brand colour, no room for a per-option icon) and, on a long list, whatever height the
 * platform feels like rather than one that stays on screen.
 *
 * Follows the WAI-ARIA "select-only combobox" pattern with roving tabindex across the options —
 * the same trigger-plus-panel shape `FontSwitcher`'s popover already uses: Escape and an outside
 * press close it and return focus to the trigger (`useFocusTrap`), entry focus lands on the
 * selected option, and Home/End jump to the ends of the list. Unlike that radiogroup, arrowing
 * only moves focus; the value commits on Enter, Space or a click, same as a native `<select>`.
 */
export function Combobox<T extends string = string>({
  options,
  value,
  onValueChange,
  label,
  size = 'md',
  className,
}: ComboboxProps<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef(new Map<T, HTMLButtonElement>());
  const labelId = useId();
  const panelId = useId();

  const selected = options.find((option) => option.value === value);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus({ preventScroll: true });
  }, []);

  // Same containment as `FontSwitcher`: Escape and Tab are trapped around the trigger *and* the
  // panel, not the panel alone, because the options are a roving-tabindex list — Tab has exactly
  // one stop inside it, not one per option — so the trigger has to be the wrap point.
  useFocusTrap(rootRef, open, { onEscape: close, autoFocus: false });

  useEffect(() => {
    if (!open) return;
    const target = (value ? optionRefs.current.get(value) : undefined) ?? panelRef.current;
    target?.focus({ preventScroll: true });
  }, [open, value]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      const root = rootRef.current;
      if (root && !root.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [open]);

  const selectOption = (option: ComboboxOption<T>) => {
    onValueChange(option.value);
    close();
  };

  /*
   * Arrow keys only move focus among the options, they never call `onValueChange` — unlike
   * `FontSwitcher`'s radiogroup, where arrowing re-sets a cheap live preview, committing here
   * re-queries the whole word list on every keypress. `option` is the one the event fired on
   * (each button's own closure below), not the committed `value`, so browsing away from the
   * current selection and back doesn't touch it until Enter, Space or a click actually commits.
   */
  const handleOptionKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    option: ComboboxOption<T>,
  ) => {
    const current = options.findIndex((item) => item.value === option.value);
    let target: ComboboxOption<T> | undefined;

    switch (event.key) {
      case 'ArrowDown':
        target = options[(current + 1) % options.length];
        break;
      case 'ArrowUp':
        target = options[(current - 1 + options.length) % options.length];
        break;
      case 'Home':
        target = options[0];
        break;
      case 'End':
        target = options[options.length - 1];
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        selectOption(option);
        return;
      default:
        return;
    }

    if (!target) return;
    event.preventDefault();
    optionRefs.current.get(target.value)?.focus();
  };

  return (
    <div className={cn(styles.root, className)} ref={rootRef}>
      <p id={labelId} className={styles.label}>
        {label}
      </p>

      <button
        ref={triggerRef}
        type="button"
        className={cn(styles.trigger, SIZE_CLASS[size])}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={labelId}
        {...(open ? { 'aria-controls': panelId } : {})}
        onClick={() => {
          setOpen((current) => !current);
        }}
      >
        {selected?.icon ? (
          <Icon
            name={selected.icon}
            size={size === 'sm' ? 14 : 16}
            className={styles.triggerIcon}
            style={{ color: resolveAccentColor(selected.color).fg }}
          />
        ) : null}
        <span className={styles.triggerLabel}>{selected?.label ?? label}</span>
        <Icon
          name="chevron-down"
          size={size === 'sm' ? 14 : 16}
          className={cn(styles.chevron, open && styles.chevronOpen)}
        />
      </button>

      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          role="listbox"
          aria-labelledby={labelId}
          tabIndex={-1}
          className={styles.panel}
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                ref={(node) => {
                  if (node) optionRefs.current.set(option.value, node);
                  else optionRefs.current.delete(option.value);
                }}
                type="button"
                role="option"
                aria-selected={isSelected}
                tabIndex={isSelected ? 0 : -1}
                className={cn(styles.option, isSelected && styles.optionSelected)}
                onClick={() => {
                  selectOption(option);
                }}
                onKeyDown={(event) => {
                  handleOptionKeyDown(event, option);
                }}
              >
                {option.icon ? (
                  <Icon
                    name={option.icon}
                    size={16}
                    className={styles.optionIcon}
                    style={{ color: resolveAccentColor(option.color).fg }}
                  />
                ) : null}
                <span className={styles.optionLabel}>{option.label}</span>
                {isSelected ? <Icon name="check" size={16} className={styles.optionCheck} /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

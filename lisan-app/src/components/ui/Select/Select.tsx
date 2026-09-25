import { useId, type ChangeEvent, type SelectHTMLAttributes } from 'react';

import { Icon } from '@/components/icons';
import { cn } from '@/utils';

import styles from './Select.module.css';

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean | undefined;
}

export interface SelectProps<T extends string = string> extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'onChange' | 'value' | 'size'
> {
  options: readonly SelectOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  label?: string | undefined;
  hint?: string | undefined;
  selectSize?: SelectSize | undefined;
  fullWidth?: boolean | undefined;
}

const SIZE_CLASS: Record<SelectSize, string | undefined> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

/**
 * A native `<select>` behind a styled shell: mobile gets the platform picker, keyboard and screen
 * reader users get the built-in listbox semantics, and we only own the chevron and the frame.
 */
export function Select<T extends string = string>({
  options,
  value,
  onValueChange,
  label,
  hint,
  selectSize = 'md',
  fullWidth = false,
  id,
  className,
  disabled = false,
  ...rest
}: SelectProps<T>) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const hintId = `${selectId}-hint`;

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onValueChange(event.target.value as T);
  };

  return (
    <div className={cn(styles.field, fullWidth && styles.fullWidth, className)}>
      {label === undefined ? null : (
        <label className={styles.label} htmlFor={selectId}>
          {label}
        </label>
      )}

      <div className={cn(styles.control, SIZE_CLASS[selectSize], disabled && styles.disabled)}>
        <select
          {...rest}
          id={selectId}
          className={styles.select}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          aria-describedby={hint === undefined ? undefined : hintId}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled ?? false}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon name="chevron-down" size={16} className={styles.chevron} />
      </div>

      {hint === undefined ? null : (
        <p className={styles.hint} id={hintId}>
          {hint}
        </p>
      )}
    </div>
  );
}

import { useId, type InputHTMLAttributes, type ReactNode, type Ref } from 'react';

import { Icon, type IconName } from '@/components/icons';
import { cn } from '@/utils';

import styles from './Input.module.css';

export type InputSize = 'sm' | 'md' | 'lg' | 'xl';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string | undefined;
  hint?: string | undefined;
  error?: string | undefined;
  iconLeft?: IconName | undefined;
  trailing?: ReactNode;
  inputSize?: InputSize | undefined;
  fullWidth?: boolean | undefined;
  ref?: Ref<HTMLInputElement> | undefined;
}

const SIZE_CLASS: Record<InputSize, string | undefined> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
  xl: styles.xl,
};

const GLYPH_SIZE: Record<InputSize, number> = { sm: 15, md: 17, lg: 18, xl: 20 };

export function Input({
  label,
  hint,
  error,
  iconLeft,
  trailing,
  inputSize = 'md',
  fullWidth = false,
  id,
  className,
  disabled = false,
  ref,
  ...rest
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const describedBy = cn(hint === undefined ? '' : hintId, error === undefined ? '' : errorId);

  return (
    <div className={cn(styles.field, fullWidth && styles.fullWidth, className)}>
      {label === undefined ? null : (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}

      <div
        className={cn(
          styles.control,
          SIZE_CLASS[inputSize],
          error === undefined ? undefined : styles.invalid,
          disabled && styles.disabled,
        )}
      >
        {iconLeft === undefined ? null : (
          <Icon name={iconLeft} size={GLYPH_SIZE[inputSize]} className={styles.leadingIcon} />
        )}
        <input
          {...rest}
          ref={ref}
          id={inputId}
          className={styles.input}
          disabled={disabled}
          aria-invalid={error === undefined ? undefined : true}
          aria-describedby={describedBy === '' ? undefined : describedBy}
        />
        {trailing === undefined ? null : <span className={styles.trailing}>{trailing}</span>}
      </div>

      {hint === undefined ? null : (
        <p className={styles.hint} id={hintId}>
          {hint}
        </p>
      )}
      {error === undefined ? null : (
        <p className={styles.error} id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
}

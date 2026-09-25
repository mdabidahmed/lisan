import { useId, type InputHTMLAttributes } from 'react';

import { Icon } from '@/components/icons';
import { cn } from '@/utils';

import styles from './Checkbox.module.css';

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> {
  label: string;
  description?: string | undefined;
}

export function Checkbox({
  label,
  description,
  id,
  className,
  disabled = false,
  ...rest
}: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = `${inputId}-description`;

  return (
    <label className={cn(styles.root, disabled && styles.disabled, className)} htmlFor={inputId}>
      <input
        {...rest}
        type="checkbox"
        id={inputId}
        className={cn(styles.input, 'u-visually-hidden')}
        disabled={disabled}
        aria-describedby={description === undefined ? undefined : descriptionId}
      />
      <span className={styles.box} aria-hidden="true">
        <Icon name="check" size={14} strokeWidth={2.6} className={styles.check} />
      </span>
      <span className={styles.copy}>
        <span className={styles.label}>{label}</span>
        {description === undefined ? null : (
          <span className={styles.description} id={descriptionId}>
            {description}
          </span>
        )}
      </span>
    </label>
  );
}

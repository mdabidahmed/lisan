import { useId, type ChangeEvent } from 'react';

import { cn } from '@/utils';

import styles from './Switch.module.css';

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  description?: string | undefined;
  disabled?: boolean | undefined;
  id?: string | undefined;
  className?: string | undefined;
}

export function Switch({
  checked,
  onCheckedChange,
  label,
  description,
  disabled = false,
  id,
  className,
}: SwitchProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = `${inputId}-description`;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onCheckedChange(event.target.checked);
  };

  return (
    <label className={cn(styles.root, disabled && styles.disabled, className)} htmlFor={inputId}>
      <span className={styles.copy}>
        <span className={styles.label}>{label}</span>
        {description === undefined ? null : (
          <span className={styles.description} id={descriptionId}>
            {description}
          </span>
        )}
      </span>
      <input
        type="checkbox"
        role="switch"
        id={inputId}
        className={cn(styles.input, 'u-visually-hidden')}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        aria-describedby={description === undefined ? undefined : descriptionId}
      />
      <span className={styles.track} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
    </label>
  );
}

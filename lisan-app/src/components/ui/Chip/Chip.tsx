import type { ButtonHTMLAttributes } from 'react';

import { Icon, type IconName } from '@/components/icons';
import { cn, formatNumber } from '@/utils';

import styles from './Chip.module.css';

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  label: string;
  selected?: boolean | undefined;
  icon?: IconName | undefined;
  count?: number | undefined;
}

export function Chip({
  label,
  selected = false,
  icon,
  count,
  type = 'button',
  disabled = false,
  className,
  ...rest
}: ChipProps) {
  return (
    <button
      type={type}
      {...rest}
      className={cn(styles.chip, selected && styles.selected, className)}
      disabled={disabled}
      aria-pressed={selected}
    >
      {icon === undefined ? null : <Icon name={icon} size={15} />}
      <span>{label}</span>
      {count === undefined ? null : <span className={styles.count}>{formatNumber(count)}</span>}
    </button>
  );
}

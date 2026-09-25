import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { Icon, type IconName } from '@/components/icons';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/utils';

import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: ButtonVariant | undefined;
  size?: ButtonSize | undefined;
  loading?: boolean | undefined;
  iconLeft?: IconName | undefined;
  iconRight?: IconName | undefined;
  fullWidth?: boolean | undefined;
  children?: ReactNode;
}

const VARIANT_CLASS: Record<ButtonVariant, string | undefined> = {
  primary: styles.primary,
  secondary: styles.secondary,
  ghost: styles.ghost,
  danger: styles.danger,
};

const SIZE_CLASS: Record<ButtonSize, string | undefined> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

const GLYPH_SIZE: Record<ButtonSize, number> = { sm: 16, md: 18, lg: 20 };

/**
 * While loading the spinner takes the place of `iconLeft` rather than the label, so the button
 * keeps its width and the surrounding layout never jumps.
 */
function renderLeading(loading: boolean, iconLeft: IconName | undefined, glyphSize: number) {
  if (loading) return <Spinner size={glyphSize} />;
  if (iconLeft === undefined) return null;
  return <Icon name={iconLeft} size={glyphSize} />;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  iconLeft,
  iconRight,
  fullWidth = false,
  type = 'button',
  disabled = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  const glyphSize = GLYPH_SIZE[size];

  return (
    <button
      type={type}
      {...rest}
      className={cn(
        styles.button,
        VARIANT_CLASS[variant],
        SIZE_CLASS[size],
        fullWidth && styles.fullWidth,
        loading && styles.loading,
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      {renderLeading(loading, iconLeft, glyphSize)}
      {children === undefined ? null : <span className={styles.label}>{children}</span>}
      {iconRight === undefined ? null : <Icon name={iconRight} size={glyphSize} />}
    </button>
  );
}

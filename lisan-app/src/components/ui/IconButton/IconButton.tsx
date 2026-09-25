import type { ButtonHTMLAttributes } from 'react';

import { Icon, type IconName } from '@/components/icons';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/utils';

import styles from './IconButton.module.css';

export type IconButtonVariant = 'primary' | 'secondary' | 'ghost' | 'soft' | 'danger' | 'bookmark';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'aria-label'
> {
  icon: IconName;
  /** Becomes the accessible name and, unless `hideNativeTitle` is set, the native tooltip. */
  label: string;
  variant?: IconButtonVariant | undefined;
  size?: IconButtonSize | undefined;
  shape?: 'circle' | 'rounded' | undefined;
  /** Toggled state (bookmark, filter, playback). Renders `aria-pressed` when supplied. */
  active?: boolean | undefined;
  loading?: boolean | undefined;
  iconSize?: number | undefined;
  /** Omits the native `title` — set this when a custom `Tooltip` already wraps the button. */
  hideNativeTitle?: boolean | undefined;
}

const VARIANT_CLASS: Record<IconButtonVariant, string | undefined> = {
  primary: styles.primary,
  secondary: styles.secondary,
  ghost: styles.ghost,
  soft: styles.soft,
  danger: styles.danger,
  bookmark: styles.bookmark,
};

const SIZE_CLASS: Record<IconButtonSize, string | undefined> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

const GLYPH_SIZE: Record<IconButtonSize, number> = { sm: 16, md: 18, lg: 20 };

export function IconButton({
  icon,
  label,
  variant = 'secondary',
  size = 'md',
  shape = 'circle',
  active,
  loading = false,
  iconSize,
  type = 'button',
  disabled = false,
  className,
  hideNativeTitle = false,
  ...rest
}: IconButtonProps) {
  const glyphSize = iconSize ?? GLYPH_SIZE[size];

  return (
    <button
      type={type}
      {...rest}
      className={cn(
        styles.iconButton,
        VARIANT_CLASS[variant],
        SIZE_CLASS[size],
        shape === 'rounded' ? styles.rounded : styles.circle,
        active === true && styles.active,
        loading && styles.loading,
        className,
      )}
      disabled={disabled || loading}
      aria-label={label}
      {...(hideNativeTitle ? {} : { title: label })}
      aria-busy={loading}
      {...(active === undefined ? {} : { 'aria-pressed': active })}
    >
      {loading ? <Spinner size={glyphSize} /> : <Icon name={icon} size={glyphSize} />}
    </button>
  );
}

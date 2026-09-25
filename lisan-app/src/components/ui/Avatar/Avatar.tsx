import { useState } from 'react';

import { Icon } from '@/components/icons';
import { cn } from '@/utils';

import styles from './Avatar.module.css';

export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps {
  name: string;
  src?: string | undefined;
  size?: AvatarSize | undefined;
  className?: string | undefined;
}

const SIZE_CLASS: Record<AvatarSize, string | undefined> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

const GLYPH_SIZE: Record<AvatarSize, number> = { sm: 16, md: 18, lg: 22 };

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return `${first}${last}`.toUpperCase();
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = initialsFrom(name);
  const showImage = src !== undefined && src !== '' && !imageFailed;

  if (showImage) {
    return (
      <img
        className={cn(styles.avatar, styles.image, SIZE_CLASS[size], className)}
        src={src}
        alt={name}
        loading="lazy"
        decoding="async"
        onError={() => {
          setImageFailed(true);
        }}
      />
    );
  }

  return (
    <span
      className={cn(styles.avatar, styles.fallback, SIZE_CLASS[size], className)}
      role="img"
      aria-label={name}
    >
      {initials === '' ? <Icon name="profile" size={GLYPH_SIZE[size]} /> : initials}
    </span>
  );
}

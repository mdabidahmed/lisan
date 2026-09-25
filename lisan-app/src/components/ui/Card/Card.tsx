import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/utils';

import styles from './Card.module.css';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';
export type CardElevation = 'none' | 'sm' | 'md';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: 'div' | 'section' | 'article' | 'li' | undefined;
  padding?: CardPadding | undefined;
  interactive?: boolean | undefined;
  elevation?: CardElevation | undefined;
  children: ReactNode;
}

const PADDING_CLASS: Record<CardPadding, string | undefined> = {
  none: styles.paddingNone,
  sm: styles.paddingSm,
  md: styles.paddingMd,
  lg: styles.paddingLg,
};

const ELEVATION_CLASS: Record<CardElevation, string | undefined> = {
  none: styles.elevationNone,
  sm: styles.elevationSm,
  md: styles.elevationMd,
};

export function Card({
  as: Tag = 'div',
  padding = 'md',
  interactive = false,
  elevation = 'md',
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <Tag
      {...rest}
      className={cn(
        styles.card,
        PADDING_CLASS[padding],
        ELEVATION_CLASS[elevation],
        interactive && styles.interactive,
        className,
      )}
    >
      {children}
    </Tag>
  );
}

import type { CSSProperties } from 'react';

import { cn } from '@/utils';

import styles from './Skeleton.module.css';

export interface SkeletonProps {
  width?: string | number | undefined;
  height?: string | number | undefined;
  radius?: string | undefined;
  circle?: boolean | undefined;
  /** Renders `count` stacked bars — the usual list/paragraph placeholder. */
  count?: number | undefined;
  className?: string | undefined;
}

export function Skeleton({
  width,
  height,
  radius,
  circle = false,
  count = 1,
  className,
}: SkeletonProps) {
  const style: CSSProperties = {};
  if (width !== undefined) style.inlineSize = width;
  if (height !== undefined) style.blockSize = height;
  if (radius !== undefined) style.borderRadius = radius;

  const total = Math.max(1, Math.trunc(count));

  return (
    <>
      {Array.from({ length: total }, (_unused, index) => (
        <span
          key={index}
          className={cn(styles.skeleton, circle && styles.circle, className)}
          style={style}
          aria-hidden="true"
        />
      ))}
    </>
  );
}

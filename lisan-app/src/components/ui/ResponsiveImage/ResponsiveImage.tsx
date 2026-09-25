import type { ImageAsset } from '@/assets';
import { cn } from '@/utils';

import styles from './ResponsiveImage.module.css';

export interface ResponsiveImageProps {
  asset: ImageAsset;
  /** Overrides the asset's own alt text. Pass `''` to mark the image decorative. */
  alt?: string | undefined;
  sizes?: string | undefined;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto' | undefined;
  /** Applied to the `<picture>`, which is the element callers need to position. */
  className?: string | undefined;
  onError?: (() => void) | undefined;
}

/**
 * Renders an {@link ImageAsset} as AVIF → WebP → raster, with its low-quality placeholder painted
 * underneath so there is no empty frame while the real file arrives.
 *
 * Intrinsic `width`/`height` always come from the asset, so every image reserves its own space and
 * contributes nothing to cumulative layout shift.
 */
export function ResponsiveImage({
  asset,
  alt,
  sizes,
  loading = 'lazy',
  fetchPriority,
  className,
  onError,
}: ResponsiveImageProps) {
  return (
    <picture className={cn(styles.picture, className)}>
      {asset.avif === undefined ? null : (
        <source type="image/avif" srcSet={asset.srcSet?.avif ?? asset.avif} sizes={sizes} />
      )}
      <source type="image/webp" srcSet={asset.srcSet?.webp ?? asset.webp} sizes={sizes} />
      <img
        className={styles.image}
        src={asset.fallback ?? asset.webp}
        alt={alt ?? asset.alt}
        width={asset.width}
        height={asset.height}
        loading={loading}
        decoding="async"
        onError={onError}
        {...(asset.lqip === undefined
          ? {}
          : { style: { backgroundImage: `url("${asset.lqip}")` } })}
        {...(fetchPriority === undefined ? {} : { fetchPriority })}
      />
    </picture>
  );
}

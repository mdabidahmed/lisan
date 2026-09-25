import { memo, useId, type SVGProps } from 'react';

import type { IconName } from './iconNames';
import { ICON_SHAPES, type IconShape } from './iconShapes';
import styles from './Icon.module.css';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name' | 'ref'> {
  /** One of the 40 design-system icons. */
  name: IconName;
  /** Rendered square size in px. Defaults to 20 to match the sidebar/nav scale. */
  size?: number | undefined;
  className?: string | undefined;
  /**
   * Accessible name rendered as an SVG `<title>`. Supplying it (or `aria-label`) promotes the
   * icon from decoration to content.
   */
  title?: string | undefined;
  /** Stroke weight override. The design system default is 1.8. */
  strokeWidth?: number | undefined;
}

const DEFAULT_SIZE = 20;
const DEFAULT_STROKE_WIDTH = 1.8;

function renderShape(shape: IconShape, index: number) {
  switch (shape.kind) {
    case 'circle':
      return <circle key={index} cx={shape.cx} cy={shape.cy} r={shape.r} />;
    case 'rect':
      return (
        <rect
          key={index}
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          rx={shape.rx}
        />
      );
    case 'path':
      return <path key={index} d={shape.d} fill={shape.filled ? 'currentColor' : 'none'} />;
  }
}

/**
 * The single source of every glyph in Lisan.
 *
 * Icons are decorative by default (`aria-hidden`), because the overwhelming majority sit next to a
 * text label. Pass `title` or `aria-label` for the standalone cases (icon-only buttons already do
 * this via `IconButton`).
 */
function IconComponent({
  name,
  size = DEFAULT_SIZE,
  className,
  title,
  strokeWidth = DEFAULT_STROKE_WIDTH,
  ...rest
}: IconProps) {
  const titleId = useId();
  const ariaLabel = rest['aria-label'];
  const isDecorative = title === undefined && ariaLabel === undefined;
  const shapes = ICON_SHAPES[name];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      className={className ? `${styles.icon} ${className}` : styles.icon}
      data-icon={name}
      {...(isDecorative
        ? { 'aria-hidden': true }
        : { role: 'img', ...(title === undefined ? {} : { 'aria-labelledby': titleId }) })}
      {...rest}
    >
      {title === undefined ? null : <title id={titleId}>{title}</title>}
      {shapes.map(renderShape)}
    </svg>
  );
}

export const Icon = memo(IconComponent);
Icon.displayName = 'Icon';

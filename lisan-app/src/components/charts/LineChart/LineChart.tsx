import { useId, useMemo, useState } from 'react';

import type { TimeSeriesPoint } from '@/types/progress';
import { cn } from '@/utils/cn';
import { formatNumber, formatShortDate } from '@/utils/format';

import {
  axisTickIndices,
  niceMax,
  plotPoints,
  toAreaPath,
  toSmoothPath,
  type ChartGeometry,
} from './geometry';
import styles from './LineChart.module.css';

const GEOMETRY: ChartGeometry = {
  width: 720,
  height: 260,
  padding: { top: 18, right: 14, bottom: 30, left: 44 },
};

const Y_TICKS = 5;
const X_TICKS = 5;

export interface LineChartProps {
  data: readonly TimeSeriesPoint[];
  /** Describes the series for screen readers, e.g. "Words learned over the last 30 days". */
  ariaLabel: string;
  /** Appended to tooltip and table values, e.g. "words". */
  valueSuffix?: string;
  className?: string | undefined;
}

/**
 * A hand-rolled SVG area/line chart.
 *
 * A charting library would be ~50 kB for the single graph on the Progress page, so this draws the
 * geometry directly. Accessibility comes from a visually-hidden data table plus keyboard-focusable
 * points — the visual is `aria-hidden`, the table is the real content.
 */
export function LineChart({ data, ariaLabel, valueSuffix = '', className }: LineChartProps) {
  const gradientId = useId();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { points, max, linePath, areaPath, xTicks, yTicks } = useMemo(() => {
    const highest = data.reduce((acc, point) => Math.max(acc, point.value), 0);
    const axisMax = niceMax(highest, Y_TICKS);
    const plotted = plotPoints(data, GEOMETRY, axisMax);
    const line = toSmoothPath(plotted);

    return {
      points: plotted,
      max: axisMax,
      linePath: line,
      areaPath: toAreaPath(plotted, GEOMETRY, line),
      xTicks: axisTickIndices(data.length, X_TICKS),
      yTicks: Array.from({ length: Y_TICKS + 1 }, (_, index) => (axisMax / Y_TICKS) * index),
    };
  }, [data]);

  if (data.length === 0) {
    return <p className={cn(styles.empty, className)}>No data to chart yet.</p>;
  }

  const innerHeight = GEOMETRY.height - GEOMETRY.padding.top - GEOMETRY.padding.bottom;
  const active = activeIndex === null ? null : points[activeIndex];

  return (
    <figure className={cn(styles.chart, className)}>
      <svg
        viewBox={`0 0 ${GEOMETRY.width} ${GEOMETRY.height}`}
        className={styles.svg}
        role="presentation"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" className={styles.gradientFrom} />
            <stop offset="100%" className={styles.gradientTo} />
          </linearGradient>
        </defs>

        {yTicks.map((tick, index) => {
          const y = GEOMETRY.padding.top + innerHeight - (innerHeight * tick) / (max || 1);
          return (
            <g key={tick}>
              <line
                x1={GEOMETRY.padding.left}
                x2={GEOMETRY.width - GEOMETRY.padding.right}
                y1={y}
                y2={y}
                className={styles.grid}
              />
              {index === 0 ? null : (
                <text x={GEOMETRY.padding.left - 10} y={y + 4} className={styles.axisLabel}>
                  {formatNumber(Math.round(tick))}
                </text>
              )}
            </g>
          );
        })}

        {areaPath ? <path d={areaPath} fill={`url(#${gradientId})`} /> : null}
        {linePath ? <path d={linePath} className={styles.line} /> : null}

        {xTicks.map((index) => {
          const plotted = points[index];
          if (!plotted) return null;
          return (
            <text
              key={plotted.point.date}
              x={plotted.x}
              y={GEOMETRY.height - 8}
              className={styles.axisLabel}
              textAnchor="middle"
            >
              {formatShortDate(plotted.point.date)}
            </text>
          );
        })}

        {active ? (
          <g>
            <line
              x1={active.x}
              x2={active.x}
              y1={GEOMETRY.padding.top}
              y2={GEOMETRY.height - GEOMETRY.padding.bottom}
              className={styles.marker}
            />
            <circle cx={active.x} cy={active.y} r={5} className={styles.point} />
          </g>
        ) : null}
      </svg>

      {/* Invisible hit targets: one focusable button per data point. */}
      <div className={styles.hotspots}>
        {points.map((plotted) => (
          <button
            key={plotted.point.date}
            type="button"
            className={styles.hotspot}
            style={{ insetInlineStart: `${(plotted.x / GEOMETRY.width) * 100}%` }}
            onMouseEnter={() => {
              setActiveIndex(plotted.index);
            }}
            onFocus={() => {
              setActiveIndex(plotted.index);
            }}
            onMouseLeave={() => {
              setActiveIndex(null);
            }}
            onBlur={() => {
              setActiveIndex(null);
            }}
            tabIndex={-1}
            aria-hidden="true"
          />
        ))}
      </div>

      {active ? (
        <span
          className={styles.tooltip}
          style={{
            insetInlineStart: `${(active.x / GEOMETRY.width) * 100}%`,
            insetBlockStart: `${(active.y / GEOMETRY.height) * 100}%`,
          }}
        >
          {formatNumber(active.point.value)} {valueSuffix}
        </span>
      ) : null}

      <figcaption className="u-visually-hidden">
        <table>
          <caption>{ariaLabel}</caption>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            {data.map((point) => (
              <tr key={point.date}>
                <th scope="row">{formatShortDate(point.date)}</th>
                <td>
                  {formatNumber(point.value)} {valueSuffix}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </figcaption>
    </figure>
  );
}

import type { TimeSeriesPoint } from '@/types/progress';

export interface ChartGeometry {
  readonly width: number;
  readonly height: number;
  readonly padding: { top: number; right: number; bottom: number; left: number };
}

export interface PlottedPoint {
  readonly x: number;
  readonly y: number;
  readonly point: TimeSeriesPoint;
  readonly index: number;
}

/** Rounds an axis maximum up to a friendly increment so grid labels read cleanly. */
export function niceMax(value: number, ticks: number): number {
  if (value <= 0) return ticks;
  const rough = value / ticks;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const normalized = rough / magnitude;
  const step = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return step * magnitude * ticks;
}

export function plotPoints(
  data: readonly TimeSeriesPoint[],
  geometry: ChartGeometry,
  max: number,
): PlottedPoint[] {
  const { width, height, padding } = geometry;
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const lastIndex = Math.max(1, data.length - 1);
  const safeMax = max || 1;

  return data.map((point, index) => ({
    index,
    point,
    x: padding.left + (innerWidth * index) / lastIndex,
    y: padding.top + innerHeight - (innerHeight * point.value) / safeMax,
  }));
}

/** Catmull-Rom → cubic Bézier, giving a smooth line without a charting dependency. */
export function toSmoothPath(points: readonly PlottedPoint[]): string {
  if (points.length === 0) return '';
  const [first] = points;
  if (!first) return '';
  if (points.length === 1) return `M ${first.x} ${first.y}`;

  let path = `M ${first.x} ${first.y}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    if (!p0 || !p1 || !p2 || !p3) continue;

    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    path += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return path;
}

export function toAreaPath(
  points: readonly PlottedPoint[],
  geometry: ChartGeometry,
  linePath: string,
): string {
  const first = points[0];
  const last = points[points.length - 1];
  if (!first || !last || !linePath) return '';
  const baseline = geometry.height - geometry.padding.bottom;
  return `${linePath} L ${last.x} ${baseline} L ${first.x} ${baseline} Z`;
}

/** Picks at most `count` evenly spaced indices so the x-axis never overlaps itself. */
export function axisTickIndices(length: number, count: number): number[] {
  if (length <= count) return Array.from({ length }, (_, index) => index);
  const step = (length - 1) / (count - 1);
  return Array.from({ length: count }, (_, index) => Math.round(index * step));
}

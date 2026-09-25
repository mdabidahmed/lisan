import { hashString } from './hash';

export function unique<T>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

export function chunk<T>(items: readonly T[], size: number): T[][] {
  if (size <= 0) return [items.slice()];
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

/** Mulberry32 — small, fast, good enough for shuffling quiz options reproducibly. */
function createRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Fisher–Yates shuffle. Passing a `seed` makes the result deterministic, which keeps quiz option
 * order stable across re-renders and makes the generator unit-testable.
 */
export function shuffle<T>(items: readonly T[], seed?: string | number): T[] {
  const out = items.slice();
  const random =
    seed === undefined
      ? Math.random
      : createRandom(typeof seed === 'number' ? seed : hashString(seed));

  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const a = out[i];
    const b = out[j];
    if (a === undefined || b === undefined) continue;
    out[i] = b;
    out[j] = a;
  }
  return out;
}

/** Picks up to `count` items without repetition, deterministically when seeded. */
export function sample<T>(items: readonly T[], count: number, seed?: string | number): T[] {
  return shuffle(items, seed).slice(0, Math.max(0, count));
}

/** Buckets are `Partial` because not every key of `K` is guaranteed to be present. */
export function groupBy<T, K extends string>(
  items: readonly T[],
  getKey: (item: T) => K,
): Partial<Record<K, T[]>> {
  const out: Partial<Record<K, T[]>> = {};
  for (const item of items) {
    const key = getKey(item);
    const bucket = out[key];
    if (bucket) bucket.push(item);
    else out[key] = [item];
  }
  return out;
}

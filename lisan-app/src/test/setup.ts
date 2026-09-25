import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

/**
 * Global test environment. jsdom is missing several browser APIs the app feature-detects, so we
 * install minimal, inspectable stand-ins rather than letting components crash.
 */

class ResizeObserverStub {
  observe(): void {
    /* jsdom has no layout engine; nothing to observe. */
  }

  unobserve(): void {
    /* no-op */
  }

  disconnect(): void {
    /* no-op */
  }
}

class IntersectionObserverStub {
  readonly root: Element | null = null;
  readonly rootMargin = '';
  readonly scrollMargin = '';
  readonly thresholds: readonly number[] = [];

  observe(): void {
    /* nothing ever intersects under jsdom. */
  }

  unobserve(): void {
    /* no-op */
  }

  disconnect(): void {
    /* no-op */
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

interface MediaQueryListStub {
  matches: boolean;
  media: string;
  onchange: null;
  addListener: () => void;
  removeListener: () => void;
  addEventListener: () => void;
  removeEventListener: () => void;
  dispatchEvent: () => boolean;
}

function createMatchMedia(matches: boolean) {
  return (query: string): MediaQueryListStub => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(() => false),
  });
}

beforeEach(() => {
  /*
   * Testing Library drains its post-event microtask queue with a `setTimeout(0)` that it only
   * advances through a Jest-shaped clock, so every `userEvent` interaction deadlocks under
   * `vi.useFakeTimers()` without this bridge. It stays inert while real timers are in use —
   * Testing Library also checks `setTimeout._isMockFunction` before reaching for the clock.
   */
  vi.stubGlobal('jest', {
    advanceTimersByTime: (ms: number) => {
      vi.advanceTimersByTime(ms);
    },
  });

  vi.stubGlobal('matchMedia', createMatchMedia(false));
  vi.stubGlobal('ResizeObserver', ResizeObserverStub);
  vi.stubGlobal('IntersectionObserver', IntersectionObserverStub);
  vi.stubGlobal('scrollTo', vi.fn());

  // Focus management calls this; jsdom does not implement it.
  Element.prototype.scrollIntoView = vi.fn();

  window.localStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

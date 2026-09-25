export const progressKeys = {
  all: ['progress'] as const,
  /** Hooks append a fingerprint of the local progress store so the cache tracks it. */
  overview: ['progress', 'overview'] as const,
  due: ['progress', 'due'] as const,
};

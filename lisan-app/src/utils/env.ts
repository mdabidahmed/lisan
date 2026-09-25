/** Typed, defaulted access to the public build-time configuration. */

const env = import.meta.env;

export const APP_ENV = {
  appName: env.VITE_APP_NAME ?? 'Lisan',
  appUrl: env.VITE_APP_URL ?? 'https://lisan.app',
  apiMode: env.VITE_API_MODE ?? 'mock',
  apiBaseUrl: env.VITE_API_BASE_URL ?? '/api',
  mockLatencyMs: Number.parseInt(env.VITE_API_MOCK_LATENCY ?? '', 10) || 180,
  analyticsProvider: env.VITE_ANALYTICS_PROVIDER ?? 'noop',
  isDev: env.DEV,
  isProd: env.PROD,
  isTest: env.MODE === 'test',
} as const;

/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME?: string;
  readonly VITE_APP_URL?: string;
  readonly VITE_API_MODE?: 'mock' | 'http';
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_API_MOCK_LATENCY?: string;
  readonly VITE_ANALYTICS_PROVIDER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

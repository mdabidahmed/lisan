import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { VitePWA } from 'vite-plugin-pwa';

const resolveSrc = (path: string): string => fileURLToPath(new URL(path, import.meta.url));

/**
 * Vendor chunk boundaries. Keeping these explicit means a dependency bump can never silently
 * move 100 kB into the entry chunk.
 */
type ChunkRule = readonly [name: string, test: (id: string) => boolean];

const MANUAL_CHUNKS: readonly ChunkRule[] = [
  ['vendor-react', (id) => /node_modules\/(react|react-dom|scheduler)\//.test(id)],
  ['vendor-router', (id) => /node_modules\/(react-router|react-router-dom)\//.test(id)],
  ['vendor-query', (id) => /node_modules\/@tanstack\//.test(id)],
  // Zustand is in the app shell (theme and settings are read before first paint), so it is on the
  // critical path by definition. Zod is not: its only caller is the Settings page's backup
  // import/export. They were one `vendor-forms` chunk, which put ~18 kB gzipped of schema
  // validation in front of every learner on every visit — a manual chunk is indivisible, so the
  // lazy half was dragged along by the eager half. Keep them apart.
  ['vendor-state', (id) => /node_modules\/zustand\//.test(id)],
  ['vendor-schema', (id) => /node_modules\/zod\//.test(id)],
  // The authored vocabulary dataset. Isolated so it is obvious in the build report and so it can
  // be swapped for paginated network fetches without disturbing the application chunks.
  ['content', (id) => /\/src\/data\//.test(id)],
];

// GitHub Pages serves a project site under /<repo>/, so every built asset path needs that
// prefix. Local dev and `vite preview` stay at '/' — only the GH Pages deploy workflow sets
// GH_PAGES=true before building.
const base = process.env.GH_PAGES === 'true' ? '/lisan/' : '/';

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: [
        'brand/favicon.svg',
        'brand/favicon.ico',
        'brand/apple-touch-icon.png',
        'robots.txt',
      ],
      manifest: {
        id: '/',
        name: 'Lisan — Learn Arabic, Grow Closer',
        short_name: 'Lisan',
        description:
          'Learn Arabic vocabulary, pronunciation, grammar and practice with spaced repetition.',
        theme_color: '#1769FF',
        background_color: '#F5F7FA',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        lang: 'en',
        dir: 'ltr',
        categories: ['education', 'productivity'],
        icons: [
          { src: '/brand/pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/brand/pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          {
            src: '/brand/pwa-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Fonts are deliberately excluded: the browser only requests the `unicode-range` subsets
        // it needs, and the runtime CacheFirst rule below keeps those offline afterwards.
        globPatterns: ['**/*.{js,css,html,svg}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            /*
              The optional faces a learner can switch to, plus the Urdu face: Google's gstatic
              files and the IndoPak nastaleeq. Both hosts serve versioned, immutable URLs, and the
              payloads are large (234 kB for Nastaliq Urdu, 204 kB for Amiri, 82 kB for IndoPak),
              so a repeat visitor must never fetch them twice. Listed before the generic font rule
              because Workbox takes the first match and these deserve their own quota.
            */
            urlPattern: ({ url }) =>
              url.origin === 'https://fonts.gstatic.com' ||
              url.origin === 'https://verses.quran.foundation',
            handler: 'CacheFirst',
            options: {
              cacheName: 'lisan-remote-fonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            /*
              The Google stylesheet that declares those faces. Deliberately not CacheFirst: it is
              an indirection to file URLs Google rotates, so pinning it for a year would
              eventually leave us asking for files that no longer exist. Revalidating in the
              background costs nothing — the response is ~1 kB and never on the critical path.
            */
            urlPattern: ({ url }) => url.origin === 'https://fonts.googleapis.com',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'lisan-remote-font-css',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Self-hosted fonts are content-hashed and immutable.
            urlPattern: ({ request }) => request.destination === 'font',
            handler: 'CacheFirst',
            options: {
              cacheName: 'lisan-fonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Word illustrations: serve instantly, refresh in the background.
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'lisan-images',
              expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Future backend: keep the last good payload so previously viewed content stays usable.
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'lisan-api',
              networkTimeoutSeconds: 4,
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  resolve: {
    alias: {
      '@': resolveSrc('./src'),
    },
  },
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    /*
      Most illustrations are only a couple of kilobytes, so the default 4 kB threshold base64
      inlined almost the whole artwork set into JavaScript — roughly 290 kB gzipped on every page,
      where it could not be lazy-loaded, cached by the runtime image rule, or skipped by a learner
      who never opens that category.

      Anything a component imports from `@/assets` lands in one shared chunk, so the rule is about
      how often an asset is actually rendered rather than how big it is: the brand mark and the
      decorative flourishes appear constantly and are worth inlining, while photographs, audio and
      the empty-state scenes stay as files that are fetched only when something needs them.
    */
    assetsInlineLimit: (filePath: string) => {
      if (/\.(avif|webp|png|jpe?g|gif|wav|mp3)$/i.test(filePath)) return false;
      if (/[\\/]illustrations[\\/]/.test(filePath)) return false;
      return undefined;
    },
    sourcemap: false,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 400,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const match = MANUAL_CHUNKS.find(([, test]) => test(id));
          return match ? match[0] : undefined;
        },
      },
    },
  },
  server: {
    port: 5173,
    strictPort: false,
  },
  preview: {
    port: 4173,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    restoreMocks: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/index.ts',
        'src/test/**',
        'src/main.tsx',
        'src/**/*.test.{ts,tsx}',
      ],
    },
  },
});

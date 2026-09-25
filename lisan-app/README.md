# Lisan — Learn Arabic, Grow Closer

A vocabulary-first Arabic learning app: 286 authored words with full harakat, 17 categories,
14 grammar lessons, 7 practice modes, spoken pronunciation, spaced repetition and progress
tracking. Everything runs in the browser — there is no backend yet, and the seams for adding one
are described below.

React 19 · TypeScript (strict) · Vite · TanStack Query · Zustand · CSS Modules.
No UI kit, no icon library, no CSS framework, no chart library — every pixel is first-party.

- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — layering, state split, the SRS model, the
  path to a real backend.
- **[src/i18n/README.md](src/i18n/README.md)** — the translation layer and how to add a locale.

---

## Quick start

```bash
nvm use          # Node 24 (see .nvmrc); engines require >= 20.19
npm install
cp .env.example .env
npm run dev      # http://localhost:5173
```

No API keys, no services to start. The app serves its own content from `src/data`.

## Scripts

| Script                  | What it does                                                 |
| ----------------------- | ------------------------------------------------------------ |
| `npm run dev`           | Vite dev server with HMR on port 5173                        |
| `npm run build`         | `typecheck` then a production build into `dist/`             |
| `npm run preview`       | Serve the built `dist/` on port 4173                         |
| `npm run typecheck`     | `tsc --noEmit` for the app and for the Node tooling config   |
| `npm run lint`          | ESLint flat config, type-aware rules                         |
| `npm run lint:fix`      | ESLint with `--fix`                                          |
| `npm run format`        | Prettier write                                               |
| `npm run format:check`  | Prettier check — this is what CI runs                        |
| `npm run test`          | Vitest in watch mode                                         |
| `npm run test:ui`       | Vitest's browser UI                                          |
| `npm run test:coverage` | Vitest once, with V8 coverage into `coverage/`               |
| `npm run e2e`           | Playwright — builds, previews on 4173, then runs `e2e/`      |
| `npm run e2e:install`   | Download the Chromium build Playwright needs (run this once) |

`npm run test -- --run` runs the unit suite once without watching.

## Environment

Copy `.env.example` to `.env`. Every variable is compiled into the bundle and visible to anyone
who opens devtools — **never put a secret in a `VITE_*` variable.** They are read once into
`APP_ENV` (`src/utils/env.ts`); nothing else reads `import.meta.env`.

| Variable                  | Default             | Controls                                                         |
| ------------------------- | ------------------- | ---------------------------------------------------------------- |
| `VITE_APP_NAME`           | `Lisan`             | Product name in the shell, document titles and the manifest      |
| `VITE_APP_URL`            | `https://lisan.app` | Canonical URL used in social metadata                            |
| `VITE_API_MODE`           | `mock`              | `mock` for the bundled content, `http` for a real backend        |
| `VITE_API_BASE_URL`       | `/api`              | Prefix for every request when `VITE_API_MODE=http`               |
| `VITE_API_MOCK_LATENCY`   | `180`               | Artificial delay in ms for the mock client; forced to 0 in tests |
| `VITE_ANALYTICS_PROVIDER` | `noop`              | Read into `APP_ENV` and currently unused — see Known gaps        |

## Folder structure

```
src/
  app/                  Entry, router, providers (query/theme/toast/i18n), error boundaries
  assets/               Brand, hero, category and word artwork + the typed asset registry
  components/
    brand/                Logo mark and lockup (brand art, not UI icons)
    charts/               Hand-rolled SVG LineChart
    home/                 HeroBanner, QuickActions, DailyGoal, ReviewQueue, QuoteCard, …
    icons/                Icon.tsx and the closed 40-icon registry
    layout/               AppShell, Sidebar, Topbar, MobileNav, PageHeader, templates/
    progress/             ProgressOverview, CategoryProgressList, StudyStreak, ActivityFeed
    quiz/                 QuizCard, TypingCard, FlashcardCard, ImageMatchCard, QuizShell, …
    skeletons/            Route-level Suspense fallbacks, shaped like the page they replace
    ui/                   The design system, one folder per component
    vocabulary/           VocabularyList, CategoryGrid, RecentWords, WordCard, RelatedWords
  constants/            Routes, navigation, breakpoints, app defaults, storage keys
  data/                 The authored vocabulary, categories, grammar and practice modes
  features/             Per-domain query hooks, query-key factories and derivations
  hooks/                Reusable behaviour (audio, media queries, focus trap, debounce, …)
  i18n/                 Locale registry, typed dictionary, Intl formatting
  pages/                One folder per route
  services/             api/ audio/ storage/ srs/ analytics/ premium/
  store/                Zustand stores (settings, progress, bookmarks, quiz session)
  styles/               tokens.css, reset.css, fonts.css, global.css, utilities.css
  test/                 Vitest setup, renderWithProviders, fixtures
  types/                Canonical domain types — the contract with src/data
docs/                   Architecture notes
e2e/                    Playwright specs
public/brand/           Favicon, PWA and social icons — stable URLs, never content-hashed
```

## Architecture in one screen

```
pages → features (query hooks) → services/api → contentSource → src/data
   ↓
components/ui ← components/icons ← styles/tokens.css
   ↓
store (zustand) → services/storage → localStorage
```

Pages call feature hooks, never services. Feature hooks call the API layer, not `src/data`.
Exactly one module — `src/services/api/contentSource.ts` — imports the content barrel, so
replacing bundled content with a network source is a one-file change.
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) has the detail, including the one place that breaks
this rule on purpose.

### Design system

`src/styles/tokens.css` is the only file in the repo that contains a colour. Components read
tokens; **no `*.module.css` has a literal colour anywhere** (92 of them, verified). Dark mode is a
`[data-theme='dark']` token override, with `[data-contrast='high']` and `[data-text-size='large']`
layering on top. Layout uses logical properties throughout so RTL works without a mirrored sheet.

### Icons

Exactly 40 icons, listed in `src/components/icons/iconNames.ts`, drawn as plain geometry in
`iconShapes.ts` typed as `Record<IconName, readonly IconShape[]>` — TypeScript refuses to compile
if a name has no artwork. Every glyph is `viewBox="0 0 24 24"`, `stroke="currentColor"`,
`stroke-width="1.8"`, round caps and joins, `fill="none"`. Emoji and Unicode symbols are never
used as icons.

### Arabic content direction

Arabic **content** direction is independent of the interface locale: an English interface still
renders تُفَّاح right to left. Every element holding an Arabic string spreads
`ARABIC_CONTENT_ATTRS` from `@/i18n` rather than writing `lang="ar" dir="rtl"` by hand, so the
rule has one definition and one place to grep.

## Swapping the mock API for a real backend

`src/services/api/client.ts` chooses an `HttpClient` from `VITE_API_MODE`:

```bash
VITE_API_MODE=http
VITE_API_BASE_URL=https://api.example.com/v1
```

`MockClient` serves `src/data` with artificial latency and abort support; `FetchHttpClient` issues
real `fetch` calls against the base URL. Both throw `ApiError` with a typed `code`
(`not_found`, `bad_request`, `aborted`, `network`) and both return the same `Paginated<T>`
envelope, so **no call site changes** — nothing above `client.ts` knows which one it got.

A backend has to implement these, matching `src/services/api/mockRoutes.ts`:

| Method | Path                            | Body                    | Returns                     |
| ------ | ------------------------------- | ----------------------- | --------------------------- |
| GET    | `/categories`                   | —                       | `Category[]`                |
| GET    | `/categories/:categoryId`       | —                       | `Category`                  |
| POST   | `/categories/:categoryId/words` | `WordsQuery`            | `Paginated<VocabularyWord>` |
| POST   | `/words/query`                  | `WordsQuery`            | `Paginated<VocabularyWord>` |
| GET    | `/words/search?q=&limit=`       | —                       | `VocabularyWord[]`          |
| GET    | `/words/:wordId`                | —                       | `VocabularyWord`            |
| GET    | `/words/:wordId/related`        | —                       | `VocabularyWord[]`          |
| GET    | `/grammar`                      | —                       | `GrammarLesson[]`           |
| GET    | `/grammar/:lessonId`            | —                       | `GrammarLesson`             |
| GET    | `/practice/modes`               | —                       | `PracticeMode[]`            |
| POST   | `/practice/quiz`                | `QuizConfig`            | `Quiz`                      |
| POST   | `/progress/overview`            | `ProgressOverviewInput` | `ProgressOverviewData`      |
| POST   | `/progress/due`                 | `DueWordsInput`         | `string[]` (word ids)       |
| POST   | `/progress`                     | `SaveProgressInput`     | `{ savedAt, count }`        |

The progress endpoints are `POST` because there are no accounts: the client sends its own
progress map in the body. With real accounts the server owns that state and these become `GET`s —
see the scaling notes in the architecture doc.

Remember to widen `connect-src` in `nginx.conf`'s CSP to the API host.

## Swapping browser speech for recorded audio

The UI never touches `speechSynthesis` — ESLint fails the build if it tries. Components call
`useAudio()`, which subscribes to `audioService`, which delegates to a `SpeechProvider`.

`BrowserSpeechProvider` is the default: Web Speech API, `ar-SA`, rate 0.75, cancel-before-speak,
and a graceful fallback when no Arabic voice is installed. `AudioFileProvider` is written and
tested but not constructed by anything. To switch:

```ts
import { audioService, AudioFileProvider } from '@/services/audio';

audioService.setProvider(
  new AudioFileProvider({
    // Return null for a word you have no recording of.
    resolveUrl: (text) => audioCatalogue[text] ?? null,
  }),
);
```

`resolveUrl` returning `null` makes `canSpeak(text)` false, and the facade falls back to the
browser voice **for that word only** — so a catalogue can be populated a word at a time instead
of all at once. Unsupported browsers degrade to a disabled control rather than a thrown error.

## Sending the premium waitlist somewhere

The sidebar's "Go Premium" dialog records interest through `submitWaitlist`, whose default
transport sends it nowhere — there is no backend, and the dialog tells the learner so. Pointing it
at an endpoint is one call at bootstrap:

```ts
import { apiClient, setWaitlistTransport } from '@/services';

setWaitlistTransport({
  submit: async (signup) => {
    await apiClient.post('/premium/waitlist', signup);
  },
});
```

Two things change with it, and `src/services/premium/waitlist.ts` says so in place:

- **The copy.** `premium.dialog.localOnly` in `src/i18n/messages/en.ts` promises that nothing leaves
  the browser and no email will arrive. That stops being true the moment a transport is installed.
- **`connect-src`** in `nginx.conf`, if the endpoint is on another host.

The learner's own record is written by `premiumStore` whichever transport is installed, so a failed
request never costs them what they typed.

## Adding vocabulary

1. Append a `VocabularyWord` to the right file in `src/data/words/`. Required fields: a unique
   kebab-case `id`, `english`, fully vowelled `arabic`, `transliteration`, an existing
   `categoryId`, `level`, `partOfSpeech` in the form `Noun (اسم)`, `meaningUrdu`, `meaningHindi`,
   `audio: { source: 'browser' }`, and one or two `examples` with vowelled Arabic.
2. That is usually all. Category `wordCount` is derived, not hand-maintained, and the id seeds the
   deterministic gradient thumbnail — so keep it stable once shipped.
3. Run `npx vitest run src/data` — `src/data/__tests__/data.test.ts` checks every rule above,
   including that `relatedWords` point at words that exist.

**Adding an illustration** is separate and optional: drop AVIF + WebP into `src/assets/words/` and
register the id in `wordArt`/`wordArtIds` in `src/assets/index.ts`. 25 of the 286 words are
illustrated; the rest fall back to a deterministic gradient tile drawn from the id, so partial
coverage is a design state rather than a missing asset.

**A new category** needs an entry in `src/data/categories.ts` (with `icon` from the 40 `IconName`s
and an accent `color`) plus the word file imported and spread in `src/data/index.ts`.

**A new quiz type** needs four edits: the `QuizType` union in `src/types/quiz.ts`, generation in
`src/services/api/mock/quizGenerator.ts`, a `PracticeMode` entry so it appears on `/practice`, and
rendering in `src/pages/PracticeMode/`.

## Testing

- **Unit and component** — Vitest, Testing Library, jsdom. 65 files, 714 tests, 86% line coverage.
  `src/test/setup.ts` stubs `matchMedia`, `ResizeObserver` and `IntersectionObserver` and clears
  storage between tests; `renderWithProviders` wraps a component in the full provider stack plus a
  `MemoryRouter`. Tests import fixtures from `src/test/fixtures/` rather than reaching into the
  286-word dataset — `sampleContent` is the test-facing name for `src/data/fallbackContent.ts`,
  which the API layer also serves when a slice of the dataset is missing, so a test and that
  fallback can never drift apart.
- **End-to-end** — Playwright, `chromium-desktop` (1440×900) and `chromium-mobile` (Pixel 7),
  running against the real production build. `playwright.config.ts` owns the server: it runs
  `npm run build && npm run preview` on port 4173 before the first test, so `npm run e2e` is the
  only command you need — after `npm run e2e:install` once.

## Accessibility

WCAG 2.2 AA is a gate, not an afterthought: semantic landmarks, a skip-to-content link, visible
focus rings, full keyboard operability, roving-tabindex tabs, focus-trapped dialogs, `aria-live`
quiz feedback, `role="progressbar"` with real values, a visually-hidden data table behind the
chart, and `prefers-reduced-motion` (with an in-app override) honoured throughout. State is never
communicated by colour alone — correct and incorrect answers pair colour with an icon.

## Performance

Initial JavaScript is **414 kB raw / 134 kB gzipped** across nine chunks; another 478 kB raw /
145 kB gzipped is split across 34 lazy chunks that are fetched only when a route or feature needs
them.

- Route-level code splitting via `React.lazy`, with layout-shaped skeletons as fallbacks.
- Explicit Rollup vendor chunks. The boundaries are deliberate: `vendor-state` is Zustand alone
  and `vendor-schema` is Zod alone, because Zustand is read before first paint while Zod is only
  used by the Settings page's backup import. A manual chunk is indivisible, so pairing them put
  25 kB gzipped of schema validation on every first load.
- The 286-word dataset is its own `content` chunk (191 kB raw / 46 kB gzipped), loaded with the
  first data-driven screen rather than with the shell.
- `build.assetsInlineLimit` never inlines raster art, audio or the empty-state scenes. The default
  4 kB threshold base64'd most of the artwork into JavaScript — roughly 290 kB gzipped on every
  page, where it could not be lazy-loaded or cached as an image.
- Anything rendered in the app shell (the sidebar logo) imports its file directly rather than
  through the asset registry, because importing one entry pulls the whole map into the shell.
- Self-hosted subset fonts with `font-display: swap`; no third-party font request.
- TanStack Query caches immutable content with a long `staleTime` and never refetches on focus.
- Debounced search (250 ms), memoised derivations, selector-based store subscriptions.

## PWA

`vite-plugin-pwa` generates the service worker and manifest. Runtime caching: `CacheFirst` for
fonts, `StaleWhileRevalidate` for images, `NetworkFirst` (4 s timeout) for `/api/`, with an
`index.html` navigation fallback so previously viewed content works offline.

## Deployment

```bash
docker build -t lisan .
docker run -p 8080:8080 lisan
```

Three stages: `npm ci` → `npm run build` → nginx serving `dist`. The build stage pre-compresses
every text asset over 1 kB with `gzip -9` and `brotli -q 11`, so nginx serves a `.gz` sibling via
`gzip_static` and spends no CPU per request. The runtime image runs unprivileged as `nginx` on
port 8080 with a read-only document root and a `HEALTHCHECK` against `/health`.

`nginx.conf` covers SPA fallback, immutable caching for `/assets/` (content-hashed) versus
`no-cache` for `index.html` and the service worker, and the security header set. Two things an
operator should change for a real deployment:

- **CSP.** `script-src` ships `'unsafe-inline'` because `index.html` carries one inline script —
  the anti-FOUC bootstrap that reads the persisted theme before first paint. Compute its SHA-256
  at release time and replace the token; a hash makes browsers ignore `'unsafe-inline'`.
- **`connect-src 'self'`** is correct only while all content is bundled. Widen it when you point
  `VITE_API_BASE_URL` at a real host.

Brotli is optional: the `.br` files are always on disk, but `brotli_static` needs `ngx_brotli`,
which the stock nginx image does not ship. Build an image with the module and drop a file
containing `brotli_static on;` into `/etc/nginx/conf.d/brotli-enabled/`.

CI (`.github/workflows/ci.yml`) runs install → typecheck → lint → format check → tests with
coverage → build, uploads `dist` and `coverage`, then runs a second job that installs Chromium
with `npx playwright install --with-deps chromium` and executes the Playwright suite.

## Known gaps

Things that look finished and are not. The full list is in
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#6-known-gaps).

- **The Arabic interface is scaffolded, not translated.** `src/i18n` has the locale registry,
  direction handling, a typed dictionary and `Intl` formatting; there is no `messages/ar.ts`.
  Arabic is registered with `uiAvailable: false`, listed in Settings as unavailable, and a
  persisted `ar` preference resolves to English until a dictionary exists. The Settings page and the
  premium dialog render through `t()` today — the rest of the interface is literal English. Arabic
  **learning content** is unaffected: it is data, not copy, and is never translated.
- **Image Match draws only from the 25 illustrated words.** The generator filters the pool to
  words with artwork and widens to the global illustrated set if a category has fewer than four,
  so the mode repeats itself far sooner than the others do.
- **Analytics is a no-op.** The premium dialog is its only call site, so a provider installed today
  would report on that and nothing else. **There are no accounts** — the profile is a local
  placeholder and says so.
- **The premium waitlist has no other end.** "Go Premium" opens a dialog that says plainly that no
  paid tier exists, and records the learner's interest on their device. Nothing is sent anywhere
  until a `WaitlistTransport` is installed — see `src/services/premium/waitlist.ts`, which also
  names the copy that has to be rewritten when it is.

## License

Private.

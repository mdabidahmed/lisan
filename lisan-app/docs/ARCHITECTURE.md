# Architecture

How Lisan is put together, why the seams are where they are, and what has to change when the
bundled dataset becomes a real backend. For setup, scripts and deployment see the
[README](../README.md); for the translation layer see [`src/i18n/README.md`](../src/i18n/README.md).

---

## 1. Layers

```
              ┌─────────────────────────────────────────────┐
  routing     │  src/app          router, providers, shell  │
              └──────────────────────┬──────────────────────┘
                                     │  renders
              ┌──────────────────────▼──────────────────────┐
  screens     │  src/pages        one folder per route      │
              └──────────┬───────────────────────┬──────────┘
                         │ calls hooks           │ renders
              ┌──────────▼──────────┐ ┌──────────▼──────────┐
  domain      │  src/features       │ │  src/components     │
              │  query hooks, keys, │ │  ui/ icons/ layout/  │
              │  derivations        │ │  charts/ quiz/ …    │
              └──────────┬──────────┘ └─────────────────────┘
                         │ calls
              ┌──────────▼──────────────────────────────────┐
  services    │  src/services     api/ audio/ storage/ srs/ │
              └──────────┬──────────────────────────────────┘
                         │ reads (one module only)
              ┌──────────▼──────────────────────────────────┐
  content     │  src/data         286 authored words        │
              └─────────────────────────────────────────────┘

  src/store (Zustand) sits beside all of this: components and features read it,
  it writes through src/services/storage, and nothing else touches localStorage.
```

Each layer may only call the one below it. The rules, and their exact status today:

| Rule                                                   | Status                                                                                                       |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Pages never import `@/services`                        | Holds. No production file under `src/pages/` imports the services barrel.                                    |
| Feature hooks never read `src/data`                    | One exception: `src/features/practice/quizConfig.ts` imports the `practiceModes` array directly (see below). |
| Exactly one module imports the `@/data` barrel         | Holds in production code. `contentSource.ts` is the only one; two tests read it to cross-check it against `src/data/fallbackContent.ts`. |
| Components never touch `speechSynthesis`               | Holds, and ESLint enforces it (`no-restricted-globals`).                                                     |
| Nothing but the storage service touches `localStorage` | Holds in production code; tests reach into it directly to assert on what was persisted.                      |

### The one exception, and why it matters

`quizConfig.ts` reads `practiceModes` from `@/data/practiceModes` to map a URL segment
(`/practice/flashcards`) onto a quiz type before any query runs. It is a synchronous lookup in a
route guard, so it cannot await the API. When the dataset moves behind a network call this is the
one place that has to change shape — probably into a small static route table that does not need
the dataset at all. Six other modules import the same file, but only for its `PracticeDirection`
**type**, which is erased at build time and costs nothing.

### Reading one screen end to end

Loading `/vocabulary` is the whole stack in six hops:

1. `pages/Vocabulary/Vocabulary.tsx` calls `useWords(filters)`.
2. `features/vocabulary/useWords.ts` builds a query key and calls `api.words.getWords`.
3. `services/api/endpoints/words.ts` issues `apiClient.post('/words/query', body)`.
4. `services/api/client.ts` has already chosen `MockClient` or `FetchHttpClient` from
   `VITE_API_MODE`; in mock mode `mockRoutes.ts` matches the path.
5. `services/api/mock/queryWords.ts` filters, sorts and paginates.
6. `services/api/contentSource.ts` hands it the frozen, validated dataset from `@/data`.

Swapping step 4 for a real server changes no file above it.

---

## 2. State: two stores, one rule

The split is **who owns the value**, not how often it changes.

**TanStack Query owns content the learner did not create.** Words, categories, grammar lessons,
practice modes, generated quizzes, the progress overview. It is immutable, shared, and cacheable,
so it gets a long `staleTime`, no refetch on window focus, and a query-key factory per domain
(`wordKeys`, `categoryKeys`, `grammarKeys`, `practiceKeys`, `progressKeys`, `bookmarkKeys`,
composed in `features/queryKeys.ts`). Today it is served from memory; tomorrow from a server. The
hooks do not know or care.

**Zustand owns what the learner produced.** Six persisted stores, all of them in `src/store/`:

| Store                 | Holds                                                      | Schema version |
| --------------------- | ---------------------------------------------------------- | -------------- |
| `settingsStore`       | Theme, language, daily goal, audio speed, a11y preferences | 1              |
| `progressStore`       | Per-word SRS state, study days, counters, daily snapshots  | **2**          |
| `bookmarksStore`      | Saved word ids                                             | 1              |
| `quizSessionStore`    | The in-flight quiz and the last result                     | 1              |
| `lessonProgressStore` | Completed grammar lessons                                  | 1              |
| `premiumStore`        | Whether the learner asked for a premium tier               | 1              |

Every one persists through `services/storage` with a `version` and a `migrate` function, so a
shape change degrades to defaults instead of corrupting a learner's history.

`lessonProgressStore` used to live in `features/grammar/`, beside the query hooks that read it.
That made "where do persisted stores live?" a question with two answers, which is one too many: the
rule is now that persisted learner state is in `src/store/` regardless of which feature reads it, and
the barrel there lists all six.

### Where the two meet

Progress is client-owned but the _list_ endpoints need it — "words I have not learned yet",
sorted by due date — and the server does not have it. `features/shared/useWordsRequest.ts`
resolves that by folding the relevant slice of the progress and bookmark stores into the request
body and into the query key, so a query re-runs when the learner's own state changes:

```
useWords(filters) ──► useWordsRequest ──► { ...filters, progressById, bookmarkedIds }
                             │                            │
                    progressStore, bookmarksStore     POST /words/query
```

This is also the piece that makes the backend migration honest: a real server with accounts would
read that state from the database instead, and `useWordsRequest` is where the change lands.

---

## 3. Spaced repetition

`services/srs/srsService.ts` is pure, takes an explicit `now`, and is the only module that
computes scheduling. SM-2, with the constants stated rather than buried:

```
INITIAL_EASE_FACTOR   2.5      FIRST_INTERVAL_DAYS    1
MIN_EASE_FACTOR       1.3      SECOND_INTERVAL_DAYS   6
PASSING_QUALITY       3        MASTERY_REPETITIONS    3
                               MASTERY_INTERVAL_DAYS  21
```

**Grading.** Learners never self-rate. `qualityFromAnswer(correct, responseMs)` turns an answer
into a 0–5 quality using response time: under 3 s is confident, over 8 s is laboured.

**Ease.** `EF' = EF + (0.1 − (5 − q) × (0.08 + (5 − q) × 0.02))`, floored at 1.3 so a word can
never become unschedulable.

**Interval.** A pass (`q ≥ 3`) schedules 1 day, then 6 days, then `round(previous × EF)`. A fail
resets repetitions to 0 and the interval to 1 day — the ease factor keeps its penalty, so a word
you keep forgetting comes back faster each cycle.

**Status.** `new → learning → reviewing → mastered`, where mastered means at least 3 repetitions
and an interval of 21 days or more. `getDueWords` is a pure filter over `nextReviewAt`.

Replacing this with FSRS or a server-side scheduler means replacing one file: the store calls it,
nothing else computes SRS state, and the unit tests describe the ladder independently of React.

---

## 4. Seams for a real backend

Four things are swappable by design. All four are wired and typed; two are not yet switched on.

### Content and API — `VITE_API_MODE`

`services/api/client.ts` picks `MockClient` (bundled content, artificial latency, abort support)
or `FetchHttpClient` (talks to `VITE_API_BASE_URL`). Both satisfy the same `HttpClient` interface,
throw the same `ApiError` with a typed `code`, and return the same `Paginated<T>` envelope, so no
call site changes. The endpoints a server must implement are listed in the README.

### Audio — `SpeechProvider`

`BrowserSpeechProvider` (Web Speech API, `ar-SA`, rate 0.75) is the default.
`AudioFileProvider` is written, tested and unused: it plays URLs from a catalogue and returns
`false` from `canSpeak(text)` when it has no recording, which makes the facade fall back to the
browser voice per word. That is exactly the behaviour a partially recorded catalogue needs.
Enabling it is one call, documented in the README.

### Premium interest — `WaitlistTransport`

`services/premium/waitlist.ts` is the only way to register interest in a premium tier, and
`deviceOnlyTransport` is its default: it sends a signup nowhere, because there is nowhere to send
it. `setWaitlistTransport({ submit })` points it at an endpoint — see the worked example in that
file. The learner's own record is written by `premiumStore` either way, so a failed request costs
them nothing.

Two things have to change with the transport, and the file says so: the copy in
`premium.dialog.localOnly`, which currently promises that nothing leaves the browser, and
`connect-src` if the endpoint is on another host.

### Persistence — `services/storage`

Namespaced (`lisan:`), versioned, quota- and parse-safe. Everything a learner owns goes through
it, which means "sync progress to a server" is a change to one module's write path rather than a
hunt through components.

---

## 5. Scaling to a million learners

Nothing here needs rearchitecting for scale; the work is mostly moving data across an existing
seam. In rough order:

**1. Content becomes a read-only API.** The 286-word dataset is 191 kB raw / 46 kB gzipped in its
own `content` chunk, lazily loaded. That is fine now and wrong at ten thousand words. Content is
immutable, identical for every learner, and already paginated at the API boundary — so it is a
CDN problem, not a database problem. Serve the catalogue as static JSON behind a CDN, keep the
`Paginated<T>` envelope, and set `VITE_API_MODE=http`. TanStack Query's cache and the PWA's
`NetworkFirst` rule for `/api/` already handle the offline and repeat-visit cases.

**2. Learner state becomes an account.** This is the only genuinely stateful part, and it is
small: a few hundred bytes per word, per learner, append-mostly, and only ever read by its owner.
Key on `(userId, wordId)`, which shards cleanly — a million learners is a million independent
partitions with no cross-learner queries. The client already computes SRS locally and writes
through a single service, so the sync layer is a background flush plus last-write-wins on
`updatedAt`, with the local store as the offline cache it already is.

**3. Move the progress-aware queries server-side.** `useWordsRequest` currently posts the
learner's progress map with every list request because the server has none. With accounts, the
server owns it and the request body shrinks to a filter. That removes the one part of the request
that grows with the learner's history.

**4. Quiz generation moves or stays.** `mock/quizGenerator.ts` builds questions from the dataset
with a seeded shuffle. It can stay on the client (free, instant, works offline) as long as the
catalogue is client-side; once the catalogue is remote, generation follows it to the server, and
`POST /practice/quiz` already has the right shape for that.

**5. Audio stops being synthesised.** Browser TTS costs nothing and scales infinitely but sounds
like a robot. Recorded audio is a CDN bill and a catalogue, which is the `AudioFileProvider` swap
above — no application change.

What is deliberately _not_ on this list: the rendering layer, the state split, the SRS model and
the design system. They are unaffected by learner count.

---

## 6. Known gaps

Honest inventory of what is scaffolded rather than finished:

- **Arabic interface.** The locale registry, direction handling and typed dictionary exist;
  `messages/ar.ts` does not. `ar` is registered with `uiAvailable: false`, and `resolveLocale`
  keeps a persisted `ar` preference out of the interface until it ships. Only the Settings page
  currently renders through `t()`; the rest is literal English.
- **Analytics.** `services/analytics` is a typed event map behind a no-op provider.
  `VITE_ANALYTICS_PROVIDER` is read into `APP_ENV` and otherwise unused. The premium dialog is the
  only call site, so installing a provider today would report on that and nothing else.
- **Accounts.** There are none, deliberately. The profile in the topbar and Settings is a local
  placeholder, labelled as such in the UI.
- **The sidebar upsell.** The CTA now opens a dialog that states plainly that no premium tier
  exists and offers to record the learner's interest. What is missing is the other end: the
  interest lives only in that browser until a `WaitlistTransport` is installed, so it is a signal
  nobody can read yet.
- **Image Match** draws only from the 25 illustrated words, so its question pool is far smaller
  than the other modes'.

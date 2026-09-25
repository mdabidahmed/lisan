import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { beforeAll, describe, expect, it } from 'vitest';

import { AppProviders } from '@/app/providers';
import { createTestQueryClient } from '@/test/renderWithProviders';

import { routes } from './router';

/**
 * Every route element is a `React.lazy` around a dynamic `import()`, so mounting a route starts a
 * module load before React can resolve its Suspense boundary: Vite has to transform the page and
 * everything it pulls in, the vocabulary dataset included.
 *
 * That load, not rendering, was what the assertions below were timing. `findBy*` allows 1000 ms, a
 * cold page spent most of it, and whether any given route came in under the wire depended on how
 * warm the transform cache happened to be — which is why three runs of this file with no code
 * change scored 12/12, 11/12 and 10/12, and why every failure was a `findByRole` timeout.
 *
 * Loading the pages up front takes that work out of the timed window for good. By the time a route
 * mounts, its `import()` resolves straight from the module registry and the boundary clears on the
 * next tick, so the assertions wait on rendering and nothing else — which took the route
 * assertions from 1100-1900 ms down to 100-400 ms.
 *
 * Globbed rather than listed out so that adding a page cannot quietly reintroduce the race. These
 * are the same `src/pages/*\/index.ts` modules `router.tsx` names, keyed by resolved path in the
 * same registry, so preloading them is what makes the lazy imports hit warm.
 */
const pageModules = import.meta.glob('../pages/*/index.ts');

/**
 * A module-load budget, not an assertion budget. Transforming every page in the app is genuinely
 * slow the first time and varies with cache warmth, so it gets room — but it is paid once, here,
 * where there is nothing to race and a timeout would mean a real problem rather than bad luck.
 */
const PAGE_PRELOAD_TIMEOUT_MS = 120_000;

beforeAll(async () => {
  const load = Object.values(pageModules);
  // If the glob ever stops matching, the preload would silently become a no-op and the flake
  // would come back looking like a fresh bug. Fail loudly instead.
  if (load.length === 0) throw new Error('No page modules matched: the preload glob is stale');

  await Promise.all(load.map((loadModule) => loadModule()));
}, PAGE_PRELOAD_TIMEOUT_MS);

/**
 * What is left to wait for once the modules are warm, and why 1000 ms is the wrong number for it.
 *
 * Testing Library's default is sized for "an element shows up after an event". These waits are a
 * different shape: React has to resolve a Suspense boundary, then render a whole page — layout,
 * sidebar, cards, icons, the lot — into jsdom, which has no layout engine but does pay full cost
 * for every node. That is hundreds of milliseconds of pure CPU on an idle machine and multiples of
 * that on a busy one, so the default leaves a page render to finish inside a budget that was never
 * meant to cover one. Preloading removed the unbounded part of the wait; this covers the rest.
 *
 * Deliberately generous, because nothing is gained by failing early here: a route that is actually
 * broken fails on the assertion, not the clock. Only a route that is merely slow needs the room.
 */
const ROUTE_RENDER_TIMEOUT_MS = 10_000;

/**
 * And the test's own budget, which has to be the larger of the two or it decides the outcome
 * first: Vitest defaults to 5000 ms, so a wait allowed 10 000 ms could never actually use them,
 * and a slow page would be reported as a bare "test timed out" instead of naming the element it
 * was waiting for. Sized for the worst case in this file — the navigation test renders three
 * pages in a row — rather than per test, so the two numbers cannot drift apart.
 */
const ROUTE_TEST_TIMEOUT_MS = ROUTE_RENDER_TIMEOUT_MS * 3;

/** The `<h1>` a lazily-loaded route renders once its Suspense boundary has resolved. */
function findPageHeading(name: string | RegExp) {
  return screen.findByRole('heading', { level: 1, name }, { timeout: ROUTE_RENDER_TIMEOUT_MS });
}

function renderApp(initialPath = '/') {
  const router = createMemoryRouter(routes, { initialEntries: [initialPath] });
  const view = render(
    <AppProviders queryClient={createTestQueryClient()}>
      <RouterProvider router={router} />
    </AppProviders>,
  );
  return { ...view, router };
}

describe('application shell', () => {
  it(
    'renders the chrome: skip link, sidebar, top header, main landmark',
    async () => {
      renderApp();

      expect(screen.getByRole('link', { name: /skip to main content/i })).toBeInTheDocument();
      expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');

      const sidebar = screen.getByRole('complementary', { name: /sidebar/i });
      for (const label of [
        'Home',
        'Vocabulary',
        'Grammar',
        'Practice',
        'Progress',
        'Bookmarks',
        'Settings',
      ]) {
        expect(within(sidebar).getByRole('link', { name: label })).toBeInTheDocument();
      }

      expect(within(sidebar).getByRole('button', { name: /go premium/i })).toBeInTheDocument();
      expect(screen.getByRole('searchbox', { name: /search vocabulary/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /switch to dark theme/i })).toBeInTheDocument();

      expect(await findPageHeading(/learn arabic step by step/i)).toBeInTheDocument();
    },
    ROUTE_TEST_TIMEOUT_MS,
  );

  it(
    'navigates from the sidebar and updates the location',
    async () => {
      const user = userEvent.setup();
      const { router } = renderApp();

      /*
      The route we start on is lazy like every other one, so let it commit before navigating away.
      Clicking into a router that is still resolving its first Suspense boundary starts the second
      navigation inside the first one's transition, and React is then free to hold the new route
      back until the old one settles — which is the one remaining way this test could lose its
      race after the pages themselves were preloaded.
    */
      await findPageHeading(/learn arabic step by step/i);

      const sidebar = screen.getByRole('complementary', { name: /sidebar/i });
      await user.click(within(sidebar).getByRole('link', { name: 'Vocabulary' }));

      expect(await findPageHeading('Vocabulary')).toBeInTheDocument();
      // The heading is already on screen, so the location has already changed; this only reads it.
      await waitFor(() => {
        expect(router.state.location.pathname).toBe('/vocabulary');
      });

      await user.click(within(sidebar).getByRole('link', { name: 'Progress' }));
      expect(await findPageHeading(/your progress/i)).toBeInTheDocument();
    },
    ROUTE_TEST_TIMEOUT_MS,
  );

  it.each([
    ['/', /learn arabic step by step/i],
    ['/vocabulary', /^Vocabulary$/],
    ['/grammar', /^Grammar$/],
    ['/practice', /^Practice$/],
    ['/progress', /your progress/i],
    ['/bookmarks', /^Bookmarks$/],
    ['/settings', /^Settings$/],
    ['/this-route-does-not-exist', /page not found/i],
  ])(
    'renders %s with its page heading',
    async (path, heading) => {
      renderApp(path);
      expect(await findPageHeading(heading)).toBeInTheDocument();
    },
    ROUTE_TEST_TIMEOUT_MS,
  );

  it(
    'renders the word detail route for a real word from the content library',
    async () => {
      renderApp('/vocabulary/engineer');

      // Not a heading, but the same wait: a lazy route resolving and rendering a whole page.
      const routeWait = { timeout: ROUTE_RENDER_TIMEOUT_MS };
      expect(
        await screen.findByRole('link', { name: /back to words/i }, routeWait),
      ).toBeInTheDocument();
      expect(await screen.findByRole('tab', { name: 'Details' }, routeWait)).toBeInTheDocument();
    },
    ROUTE_TEST_TIMEOUT_MS,
  );

  it('exposes every route in the table', () => {
    const paths = (routes[0]?.children ?? []).map((route) =>
      'index' in route && route.index ? '/' : (route.path ?? ''),
    );

    expect(paths).toEqual([
      '/',
      '/vocabulary',
      '/vocabulary/:wordId',
      '/grammar',
      '/grammar/:lessonId',
      '/practice',
      '/practice/:mode',
      '/quiz/result',
      '/progress',
      '/bookmarks',
      '/settings',
      '*',
    ]);
  });
});

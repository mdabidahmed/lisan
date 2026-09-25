import { lazy } from 'react';
import { createBrowserRouter, type RouteObject } from 'react-router-dom';

import {
  DashboardSkeleton,
  ProgressSkeleton,
  QuizSkeleton,
  SimplePageSkeleton,
  VocabularyListSkeleton,
  WordDetailSkeleton,
} from '@/components/skeletons';
import { ROUTES } from '@/constants/routes';

import { RootLayout } from './RootLayout';
import { RouteBoundary } from './RouteBoundary';
import { RouteError } from './RouteError';

/**
 * Every page is its own chunk. Resolving the named export keeps pages free of default exports,
 * which makes them straightforward to import directly in tests.
 */
const HomePage = lazy(() => import('@/pages/Home').then((m) => ({ default: m.HomePage })));
const VocabularyPage = lazy(() =>
  import('@/pages/Vocabulary').then((m) => ({ default: m.VocabularyPage })),
);
const WordDetailPage = lazy(() =>
  import('@/pages/WordDetail').then((m) => ({ default: m.WordDetailPage })),
);
const GrammarPage = lazy(() => import('@/pages/Grammar').then((m) => ({ default: m.GrammarPage })));
const GrammarLessonPage = lazy(() =>
  import('@/pages/GrammarLesson').then((m) => ({ default: m.GrammarLessonPage })),
);
const PracticePage = lazy(() =>
  import('@/pages/Practice').then((m) => ({ default: m.PracticePage })),
);
const PracticeModePage = lazy(() =>
  import('@/pages/PracticeMode').then((m) => ({ default: m.PracticeModePage })),
);
const QuizResultPage = lazy(() =>
  import('@/pages/QuizResult').then((m) => ({ default: m.QuizResultPage })),
);
const ProgressPage = lazy(() =>
  import('@/pages/Progress').then((m) => ({ default: m.ProgressPage })),
);
const BookmarksPage = lazy(() =>
  import('@/pages/Bookmarks').then((m) => ({ default: m.BookmarksPage })),
);
const SettingsPage = lazy(() =>
  import('@/pages/Settings').then((m) => ({ default: m.SettingsPage })),
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFound').then((m) => ({ default: m.NotFoundPage })),
);

/** Route definitions, exported so tests can mount them under a `MemoryRouter`. */
export const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      {
        index: true,
        element: (
          <RouteBoundary fallback={<DashboardSkeleton />}>
            <HomePage />
          </RouteBoundary>
        ),
      },
      {
        path: ROUTES.vocabulary,
        element: (
          <RouteBoundary fallback={<VocabularyListSkeleton />}>
            <VocabularyPage />
          </RouteBoundary>
        ),
      },
      {
        path: ROUTES.wordDetail,
        element: (
          <RouteBoundary fallback={<WordDetailSkeleton />}>
            <WordDetailPage />
          </RouteBoundary>
        ),
      },
      {
        path: ROUTES.grammar,
        element: (
          <RouteBoundary fallback={<SimplePageSkeleton />}>
            <GrammarPage />
          </RouteBoundary>
        ),
      },
      {
        path: ROUTES.grammarLesson,
        element: (
          <RouteBoundary fallback={<SimplePageSkeleton />}>
            <GrammarLessonPage />
          </RouteBoundary>
        ),
      },
      {
        path: ROUTES.practice,
        element: (
          <RouteBoundary fallback={<QuizSkeleton />}>
            <PracticePage />
          </RouteBoundary>
        ),
      },
      {
        path: ROUTES.practiceMode,
        element: (
          <RouteBoundary fallback={<QuizSkeleton />}>
            <PracticeModePage />
          </RouteBoundary>
        ),
      },
      {
        path: ROUTES.quizResult,
        element: (
          <RouteBoundary fallback={<QuizSkeleton />}>
            <QuizResultPage />
          </RouteBoundary>
        ),
      },
      {
        path: ROUTES.progress,
        element: (
          <RouteBoundary fallback={<ProgressSkeleton />}>
            <ProgressPage />
          </RouteBoundary>
        ),
      },
      {
        path: ROUTES.bookmarks,
        element: (
          <RouteBoundary fallback={<VocabularyListSkeleton />}>
            <BookmarksPage />
          </RouteBoundary>
        ),
      },
      {
        path: ROUTES.settings,
        element: (
          <RouteBoundary fallback={<SimplePageSkeleton />}>
            <SettingsPage />
          </RouteBoundary>
        ),
      },
      {
        path: ROUTES.notFound,
        element: (
          <RouteBoundary fallback={<SimplePageSkeleton />}>
            <NotFoundPage />
          </RouteBoundary>
        ),
      },
    ],
  },
];

// `BASE_URL` is '/' locally and '/lisan/' on GitHub Pages (set by `vite.config.ts`'s `base`), so
// the router's basename always matches wherever the app is actually served from.
export const router = createBrowserRouter(routes, { basename: import.meta.env.BASE_URL });

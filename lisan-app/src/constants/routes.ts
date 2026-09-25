/** Every route in the application, in one place. Never hard-code a path string in a component. */
export const ROUTES = {
  home: '/',
  vocabulary: '/vocabulary',
  wordDetail: '/vocabulary/:wordId',
  grammar: '/grammar',
  grammarLesson: '/grammar/:lessonId',
  practice: '/practice',
  practiceMode: '/practice/:mode',
  quizResult: '/quiz/result',
  progress: '/progress',
  bookmarks: '/bookmarks',
  settings: '/settings',
  notFound: '*',
} as const;

export type RouteKey = keyof typeof ROUTES;

export const routePaths = {
  home: () => ROUTES.home,
  vocabulary: () => ROUTES.vocabulary,
  wordDetail: (wordId: string) => `/vocabulary/${encodeURIComponent(wordId)}`,
  grammar: () => ROUTES.grammar,
  grammarLesson: (lessonId: string) => `/grammar/${encodeURIComponent(lessonId)}`,
  practice: () => ROUTES.practice,
  practiceMode: (mode: string) => `/practice/${encodeURIComponent(mode)}`,
  quizResult: () => ROUTES.quizResult,
  progress: () => ROUTES.progress,
  bookmarks: () => ROUTES.bookmarks,
  settings: () => ROUTES.settings,
} as const;

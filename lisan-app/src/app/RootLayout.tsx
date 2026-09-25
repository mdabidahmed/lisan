import { ScrollRestoration } from 'react-router-dom';

import { AppShell } from '@/components/layout';

/**
 * The single layout route. Scroll position is restored per pathname, so returning to a long
 * vocabulary list lands where the learner left off while a new page always starts at the top.
 */
export function RootLayout() {
  return (
    <>
      <ScrollRestoration getKey={(location) => location.pathname} />
      <AppShell />
    </>
  );
}

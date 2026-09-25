import type { QueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { I18nProvider } from '@/i18n';

import { ErrorBoundary } from './ErrorBoundary';
import { ErrorFallback } from './ErrorBoundary/ErrorFallback';
import { QueryProvider } from './query';
import { ThemeProvider } from './theme';
import { ToastProvider } from './toast';

export interface AppProvidersProps {
  children: ReactNode;
  queryClient?: QueryClient;
}

/**
 * Provider order matters: the boundary must be outermost so a provider crash still renders a
 * fallback, the locale must sit above anything that renders copy, and the theme must sit above
 * anything that reads tokens at mount.
 */
export function AppProviders({ children, queryClient }: AppProvidersProps) {
  return (
    <ErrorBoundary
      fallback={(error, reset) => <ErrorFallback error={error} onReset={reset} variant="app" />}
    >
      <QueryProvider {...(queryClient ? { client: queryClient } : {})}>
        <I18nProvider>
          <ThemeProvider>
            <ToastProvider>{children}</ToastProvider>
          </ThemeProvider>
        </I18nProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}

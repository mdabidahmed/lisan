import { QueryClient } from '@tanstack/react-query';
import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { AppProviders } from '@/app/providers';

export interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  /** Initial history entry, e.g. `/vocabulary/apple`. */
  route?: string;
  /** Route pattern to mount the element under, e.g. `/vocabulary/:wordId`. */
  path?: string;
  queryClient?: QueryClient;
}

/** A query client with retries and background refetching disabled, so tests stay deterministic. */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0, refetchOnWindowFocus: false },
      mutations: { retry: false },
    },
  });
}

export interface RenderWithProvidersResult extends RenderResult {
  queryClient: QueryClient;
}

/**
 * Renders a component inside the same provider stack the app uses (error boundary, query client,
 * theme, toasts) plus a memory router.
 */
export function renderWithProviders(
  ui: ReactElement,
  { route = '/', path, queryClient, ...options }: RenderWithProvidersOptions = {},
): RenderWithProvidersResult {
  const client = queryClient ?? createTestQueryClient();

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <AppProviders queryClient={client}>
        <MemoryRouter initialEntries={[route]}>
          {path ? (
            <Routes>
              <Route path={path} element={children} />
            </Routes>
          ) : (
            children
          )}
        </MemoryRouter>
      </AppProviders>
    );
  }

  return { ...render(ui, { wrapper: Wrapper, ...options }), queryClient: client };
}

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

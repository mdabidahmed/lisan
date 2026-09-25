import { Suspense, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import { ErrorBoundary } from '@/app/providers/ErrorBoundary';

export interface RouteBoundaryProps {
  children: ReactNode;
  /** The layout-aware skeleton shown while the route chunk loads. */
  fallback: ReactNode;
}

/**
 * Wraps every route in its own error boundary and Suspense fallback, so one failing page never
 * takes down the shell and navigation always has something to render.
 */
export function RouteBoundary({ children, fallback }: RouteBoundaryProps) {
  const { pathname } = useLocation();
  return (
    <ErrorBoundary resetKey={pathname}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}

import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom';

import { ErrorFallback, hardReload } from '@/app/providers/ErrorBoundary';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ROUTES } from '@/constants/routes';
import { isChunkLoadError } from '@/utils';

/**
 * The router's `errorElement`. A 404 thrown by a loader renders a friendly not-found panel;
 * anything else falls back to the generic recovery UI.
 *
 * It deliberately does not import the `NotFound` page — that page is a lazy route chunk, and a
 * static import here would pull it back into the shared bundle. The illustrated 404 scene is left
 * to that page for the same reason: reaching for it here would drag the whole asset registry into
 * the app shell to decorate a surface almost nobody sees.
 */
export function RouteError() {
  const error = useRouteError();
  const navigate = useNavigate();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <EmptyState
        icon="search"
        title="Page not found"
        description="The page you were looking for does not exist. It may have moved, or the link may be out of date."
        action={
          <Button
            iconRight="arrow-right"
            onClick={() => {
              void navigate(ROUTES.home);
            }}
          >
            Back to home
          </Button>
        }
      />
    );
  }

  /*
    A missing route chunk cannot be recovered by re-running the router: `navigate(0)` revalidates
    the same module graph and asks for the same file the deploy took away. The document has to be
    fetched again. Automatic recovery is not repeated here — every route element is wrapped in
    `RouteBoundary`, so React's boundary sees these errors first and handles them; this branch only
    makes sure that if one ever does reach the router, the button does something that can work.
  */
  const onReset = isChunkLoadError(error)
    ? hardReload
    : () => {
        void navigate(0);
      };

  return (
    <ErrorFallback
      error={error instanceof Error ? error : new Error('Unexpected routing error')}
      onReset={onReset}
      variant="app"
    />
  );
}

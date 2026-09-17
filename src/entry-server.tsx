import { ReactElement, StrictMode } from 'react';
import App from './App';
import { RouterProvider } from './router';

/**
 * Server entry for the build-time prerender pass (`scripts/prerender.mjs`).
 *
 * The site ships as a static bundle with no server at runtime, so this is only
 * ever loaded by the build: Vite compiles it in SSR mode, the script renders
 * each route to a string, and the results are baked into one HTML file per
 * route. That is what non-JavaScript consumers — link unfurlers, LLM fetchers,
 * `curl` — actually read, since none of them run the bundle.
 *
 * Wrapped in `StrictMode` to match `main.tsx` exactly: the client hydrates the
 * markup this produces, and a structural difference between the two trees is a
 * hydration mismatch.
 */
export function createApp(path: string): ReactElement {
  return (
    <StrictMode>
      <RouterProvider initialPath={path}>
        <App />
      </RouterProvider>
    </StrictMode>
  );
}

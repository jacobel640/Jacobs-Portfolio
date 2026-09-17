import { createContext, useContext } from 'react';

/**
 * Routing primitives for seven static routes.
 *
 * The site prerenders every route to its own HTML file, so each URL is already
 * a real document that a crawler, an unfurler or a cold visitor can read
 * without running anything. The router only adds in-page navigation on top of
 * that: following a link without discarding the loaded bundle.
 *
 * Hand-rolled rather than a routing library for the same reason `RichText` is
 * not a Markdown parser — the whole routing table is known at build time and
 * fits in a regex, and a dependency would cost more bundle than the feature.
 *
 * The context and helpers live apart from the components in `router.tsx` so
 * neither file mixes the two kinds of export, which is what Fast Refresh needs.
 */

export interface RouterValue {
  /** Always normalised: no trailing slash, no query, no hash. */
  path: string;
  navigate: (to: string) => void;
}

export const RouterContext = createContext<RouterValue>({ path: '/', navigate: () => {} });

export const useRouter = (): RouterValue => useContext(RouterContext);

/** `/projects/taskflow/` and `/projects/taskflow` are the same route. */
export function normalisePath(raw: string): string {
  const path = raw.split('?')[0].split('#')[0];
  if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1);
  return path || '/';
}

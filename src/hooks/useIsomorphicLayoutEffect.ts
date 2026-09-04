import { useEffect, useLayoutEffect } from 'react';

/**
 * `useLayoutEffect` in the browser, `useEffect` during the build-time prerender.
 *
 * Layout effects cannot run on the server — there is no layout to read — so
 * React warns whenever one is reached during `renderToPipeableStream`. Neither
 * hook body actually runs in that pass, so the warning is noise rather than a
 * defect, but silencing it by swapping the hook keeps a genuine SSR problem
 * visible if one ever appears.
 *
 * Chosen once at module scope rather than per render: which hook a component
 * calls must not change between renders.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;

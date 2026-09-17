import { useCallback, useEffect, useMemo, useState, FC, MouseEvent, ReactNode } from 'react';

import { RouterContext, normalisePath, useRouter } from './router-core';

export const RouterProvider: FC<{ initialPath: string; children: ReactNode }> = ({
  initialPath,
  children,
}) => {
  const [path, setPath] = useState(() => normalisePath(initialPath));

  useEffect(() => {
    // The browser may have restored a different URL than the one the markup was
    // rendered for (back/forward cache, a hash the server never saw).
    setPath(normalisePath(window.location.pathname));

    const onPopState = () => setPath(normalisePath(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((to: string) => {
    const next = normalisePath(to);
    if (next === normalisePath(window.location.pathname)) return;
    window.history.pushState(null, '', to);
    setPath(next);
    // A new document starts at the top. Instant rather than smooth: the
    // stylesheet sets `scroll-behavior: smooth`, which would animate the whole
    // way up a long case study before the next page appears.
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const value = useMemo(() => ({ path, navigate }), [path, navigate]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
};

/**
 * An ordinary anchor that navigates in place when it can.
 *
 * The `href` is always real and always absolute, so a crawler following it
 * reaches the prerendered document and a visitor can middle-click, copy or
 * open it in a new tab. Only a plain left click is intercepted — modifier
 * clicks are the browser's to handle, and stealing them breaks "open in new
 * tab" in a way people notice immediately.
 */
export const Link: FC<{
  to: string;
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}> = ({ to, children, onClick, ...rest }) => {
  const { navigate } = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
};

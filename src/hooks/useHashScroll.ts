import { useEffect } from 'react';

/** How long to keep honouring the hash while the page is still assembling. */
const DEADLINE_MS = 8000;

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Scrolls to the element named by the URL hash.
 *
 * The sections below the hero are code-split, so on a cold load with
 * `/#projects` the browser resolves the hash against an empty `#root` and gives
 * up — its native scroll is a one-shot attempt at first paint.
 *
 * Re-aiming is driven by what actually moves the target rather than by a timer:
 * a skeleton can sit still for most of a second before its chunk arrives, and
 * for the last section on the page the offset never moves at all — only the
 * document grows tall enough to reach it. So this watches the DOM for mounts
 * and the body for resizes, and re-aims whenever either changes the answer,
 * until the visitor scrolls or the deadline passes.
 */
export function useHashScroll(): void {
  useEffect(() => {
    let cleanup: (() => void) | null = null;

    const scrollToHash = (behavior: ScrollBehavior) => {
      cleanup?.();

      const id = decodeURIComponent(window.location.hash.replace('#', ''));
      if (!id) return;

      let scheduled = 0;
      let lastTop: number | null = null;
      let lastHeight = -1;

      const stop = () => {
        cancelAnimationFrame(scheduled);
        clearTimeout(deadline);
        mutations.disconnect();
        resizes.disconnect();
        window.removeEventListener('wheel', stop);
        window.removeEventListener('touchstart', stop);
        window.removeEventListener('keydown', stop);
        cleanup = null;
      };

      const aim = () => {
        scheduled = 0;
        const el = document.getElementById(id);
        if (!el) return;

        const top = Math.round(el.getBoundingClientRect().top + window.scrollY);
        const height = document.documentElement.scrollHeight;
        // Only re-aim when the destination actually moved; scrolling on every
        // notification would restart a smooth animation before it lands.
        if (top === lastTop && height === lastHeight) return;

        lastTop = top;
        lastHeight = height;
        el.scrollIntoView({ behavior, block: 'start' });
      };

      const schedule = () => {
        if (scheduled) return;
        scheduled = requestAnimationFrame(aim);
      };

      const mutations = new MutationObserver(schedule);
      const resizes = new ResizeObserver(schedule);

      // Give up rather than fight a visitor who has started scrolling.
      const deadline = setTimeout(stop, DEADLINE_MS);
      window.addEventListener('wheel', stop, { passive: true, once: true });
      window.addEventListener('touchstart', stop, { passive: true, once: true });
      window.addEventListener('keydown', stop, { once: true });

      mutations.observe(document.body, { childList: true, subtree: true });
      resizes.observe(document.body);
      cleanup = stop;
      schedule();
    };

    // 'instant' rather than 'auto': the stylesheet sets scroll-behavior: smooth,
    // and 'auto' defers to it, which would animate the whole way down the page
    // on a cold load.
    scrollToHash('instant');

    // Editing the hash in the address bar hits the same missing-target problem.
    const onHashChange = () =>
      scrollToHash(prefersReducedMotion() ? 'instant' : 'smooth');
    window.addEventListener('hashchange', onHashChange);

    return () => {
      window.removeEventListener('hashchange', onHashChange);
      cleanup?.();
    };
  }, []);
}

export default useHashScroll;

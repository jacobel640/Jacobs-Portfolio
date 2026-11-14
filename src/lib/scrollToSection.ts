/** How long the spotlit card holds its wash, and how long it takes to ease back. */
const SPOTLIGHT_HOLD_MS = 1200;
const SPOTLIGHT_FADE_MS = 1000;

/**
 * Scrolls to a section and, once it has arrived, gently spotlights one card
 * inside it.
 *
 * The section heading lands at the top of the view, as a navbar link would
 * put it, so the visitor reads the section's own introduction first. The card
 * then takes the `is-spotlit` class: its tonal wash and outline deepen for a
 * moment and ease back on the surface's own transition (see `index.css`).
 * Nothing moves or grows; it is the hover state, held briefly.
 *
 * Returns false when the section is not in the document yet (its lazy chunk
 * has not mounted), so the caller can let the link fall back to an ordinary
 * hash navigation, which `useHashScroll` follows once the chunk arrives.
 */
export function scrollToSection(sectionId: string, spotlightId?: string): boolean {
  const section = document.getElementById(sectionId);
  if (!section) return false;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  section.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  // Shareable, without a history entry per click.
  window.history.replaceState(null, '', `#${sectionId}`);

  const card = spotlightId ? document.getElementById(spotlightId) : null;
  if (!card) return true;

  const spotlight = () => {
    card.classList.remove('is-spotlit-out');
    card.classList.add('is-spotlit');
    window.setTimeout(() => {
      // Hand over to a slower, gentler transition for the way back.
      card.classList.replace('is-spotlit', 'is-spotlit-out');
      window.setTimeout(() => card.classList.remove('is-spotlit-out'), SPOTLIGHT_FADE_MS);
    }, SPOTLIGHT_HOLD_MS);
  };

  // On arrival, not on departure: a smooth scroll can take most of a second,
  // and a highlight that fades before the card is on screen is wasted.
  if (reduceMotion || !('onscrollend' in window)) {
    window.setTimeout(spotlight, reduceMotion ? 0 : 600);
  } else {
    let fallback = 0;
    const onEnd = () => {
      window.clearTimeout(fallback);
      window.removeEventListener('scrollend', onEnd);
      spotlight();
    };
    window.addEventListener('scrollend', onEnd);
    // Already in place: no scroll happens, so no `scrollend` will come.
    fallback = window.setTimeout(onEnd, 1400);
  }
  return true;
}

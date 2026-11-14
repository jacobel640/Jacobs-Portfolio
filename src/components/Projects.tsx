import { forwardRef, useCallback, useRef, useState, FC } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Folder, Github, Lock, ExternalLink, ArrowRight } from 'lucide-react';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import { projects } from '../data/projects';
import type { FilterType, Project } from '../data/projects';
import { Link } from '../router';
import { projectPath } from '../routes';
import { themeVars } from '../theme/color';
import { REFLOW, motionScheme, spatialWithEffects } from '../theme/motion';
import { FilterChip } from './md/Chip';
import { Reveal, RevealItem } from './md/Reveal';
import { SectionHeader } from './md/SectionHeader';
import { StateLayer } from './md/StateLayer';

const FILTERS: readonly FilterType[] = ['All', 'Android', 'Fullstack', 'Backend'];

const matches = (project: Project, filter: FilterType): boolean =>
  filter === 'All' || project.category === filter;

/** How many projects a filter would show, for the count on its chip. */
const countFor = (filter: FilterType): number => projects.filter((project) => matches(project, filter)).length;

/** Cards entering or leaving: scale on the spatial spring, fade on effects. */
const ARRIVE = spatialWithEffects(motionScheme.standard.spatial.default, motionScheme.standard.effects.default);

/**
 * The projects section on the home page: a filterable grid of cards.
 *
 * Each card links to `/projects/<id>`, a prerendered page of its own, rather
 * than opening a modal. The case study itself lives in `ProjectCaseStudy`.
 */
export const Projects: FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  // Switching categories changes how many cards the grid holds, which changes
  // the page height and slides everything under the pointer. Pin the filter
  // bar — the control that was just clicked — to where it was.
  const filterBarRef = useRef<HTMLDivElement | null>(null);
  const pinnedBarTopRef = useRef<number | null>(null);

  const selectFilter = useCallback((tab: FilterType) => {
    pinnedBarTopRef.current = filterBarRef.current?.getBoundingClientRect().top ?? null;
    setActiveFilter(tab);
  }, []);

  useIsomorphicLayoutEffect(() => {
    const target = pinnedBarTopRef.current;
    if (target === null) return;
    pinnedBarTopRef.current = null;

    const root = document.documentElement;

    // The stylesheet sets `scroll-behavior: smooth` on <html>, and that applies
    // to programmatic scrolls too. Every correction below would animate, and a
    // correction issued each frame would interrupt the one before it — which is
    // exactly the "page jumps away and slides back" flicker. Corrections have to
    // land instantly.
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';

    // Scroll anchoring is the other half of it. Adding or removing cards moves
    // everything below the grid, so the browser silently shifts the scroll
    // position to hold whichever element it picked as the anchor still — which
    // is what actually drags the filter bar off its mark, a frame or two after
    // the click and again when the exit animations unmount their cards. Turning
    // it off on the root excludes the whole document, and only for as long as
    // the reflow lasts.
    const previousAnchor = root.style.overflowAnchor;
    root.style.overflowAnchor = 'none';

    let frame = 0;
    let released = false;

    const release = () => {
      if (released) return;
      released = true;
      cancelAnimationFrame(frame);
      root.style.scrollBehavior = previousBehavior;
      root.style.overflowAnchor = previousAnchor;
      window.removeEventListener('wheel', release);
      window.removeEventListener('touchstart', release);
      window.removeEventListener('pointerdown', release);
      window.removeEventListener('keydown', release);
    };

    const correct = () => {
      const bar = filterBarRef.current;
      if (!bar) return;
      const drift = bar.getBoundingClientRect().top - target;
      if (Math.abs(drift) > 0.5) window.scrollBy(0, drift);
    };

    // Correct once synchronously, while we are still inside the layout phase:
    // the first frame the visitor sees is then already in the right place,
    // instead of being painted wrong and fixed a frame later.
    correct();

    // The grid animates its reflow, so keep holding the bar across the rest of
    // the transition rather than correcting only once.
    const deadline = performance.now() + 600;
    const hold = () => {
      correct();
      if (performance.now() < deadline) frame = requestAnimationFrame(hold);
      else release();
    };
    frame = requestAnimationFrame(hold);

    // Stop the moment the visitor takes over — holding against their own scroll
    // would feel like the page is stuck. Presses count too: a navbar link
    // clicked inside this window scrolls the page itself, and the correction
    // below would undo it frame by frame while the instant `scroll-behavior`
    // stripped its animation. The press that triggered this run has already
    // happened, so it cannot release the pin it just set.
    window.addEventListener('wheel', release, { passive: true });
    window.addEventListener('touchstart', release, { passive: true });
    window.addEventListener('pointerdown', release, { passive: true });
    window.addEventListener('keydown', release);

    return release;
  }, [activeFilter]);

  const filteredProjects = projects.filter((project) => matches(project, activeFilter));

  return (
    <section id="projects" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <SectionHeader
        icon={Folder}
        eyebrow="Featured Portfolio"
        title="Projects & Case Studies"
        lead="Explore a curated selection of native mobile applications, robust backend microservices, and fullstack platforms engineered for performance and scalability."
      />

      {/* Filter chips */}
      <Reveal className="relative z-10 flex justify-center mb-12">
        <RevealItem>
          <LayoutGroup id="project-filters">
            <div
              ref={filterBarRef}
              role="group"
              aria-label="Filter projects by category"
              className="flex flex-wrap items-center justify-center gap-2"
            >
              {FILTERS.map((filter) => (
                <FilterChip key={filter} selected={activeFilter === filter} onSelect={() => selectFilter(filter)}>
                  {filter}
                  <span className="ml-1.5 opacity-70 tabular-nums" aria-hidden="true">
                    {countFor(filter)}
                  </span>
                  <span className="sr-only">, {countFor(filter)} projects</span>
                </FilterChip>
              ))}
            </div>
          </LayoutGroup>
        </RevealItem>
      </Reveal>

      {/* Projects grid. Cards that stay reflow on a spatial spring; cards that
          leave or arrive scale and fade on the faster effects spring. */}
      <motion.ul layout className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <AnimatePresence mode="popLayout" initial={false}>
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </AnimatePresence>
      </motion.ul>
    </section>
  );
};

/**
 * One project card.
 *
 * The title link is the card's real control, stretched over the whole card by
 * a pseudo-element, so the card is one honest link for keyboards, crawlers and
 * "open in new tab" rather than a `div` with a click handler. The ripple and
 * focus ring are painted on the card but driven by that link. The Code and
 * Live chips sit above the stretched area and stay independently clickable.
 *
 * The card borrows its project's accent roles (`themeVars(..., 'accent')`), so
 * the icon tile, category label and action pick up the project's colour while
 * the surface stays the site's own.
 */
const ProjectCard = forwardRef<HTMLLIElement, { project: Project; index: number }>(({ project, index }, ref) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const Icon = project.icon;
  const href = projectPath(project);

  return (
    <motion.li
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.94 }}
      // The arrival staggers by position; the hover lift and the reflow must
      // not, so the delay lives on this transition only.
      animate={{ opacity: 1, scale: 1, transition: { ...ARRIVE, delay: index * 0.04 } }}
      exit={{ opacity: 0, scale: 0.94, transition: ARRIVE }}
      whileHover={{ y: -4 }}
      transition={{ layout: REFLOW, y: motionScheme.standard.spatial.fast }}
      style={themeVars(project.seed, { scope: 'accent' })}
      className="md-interactive group flex flex-col justify-between rounded-3xl bg-md-surface-container border border-md-outline-variant/60 shadow-md-1 hover:shadow-md-3 p-6 sm:p-7 md-shape-morph"
    >
      <StateLayer control={linkRef} shape="card" />

      <div>
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="md-shape-morph p-3 rounded-2xl group-hover:rounded-[22px] bg-md-primary-container text-md-on-primary-container">
            <Icon className="w-5 h-5" aria-hidden="true" />
          </div>

          {/* Above the stretched link, so these stay their own targets. */}
          <div className="relative z-10 flex items-center gap-2">
            {project.isPrivate ? (
              <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-lg text-label-md bg-md-surface-container-highest text-md-on-surface-variant">
                <Lock className="w-3 h-3" aria-hidden="true" />
                Private
              </span>
            ) : project.github ? (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} source code on GitHub`}
                className="md-interactive inline-flex items-center gap-1.5 h-7 px-3 rounded-lg text-label-md text-md-on-surface-variant border border-md-outline-variant"
              >
                <StateLayer shape="small" />
                <Github className="w-3 h-3" aria-hidden="true" />
                Code
              </a>
            ) : null}

            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} live on Google Play`}
                className="md-interactive inline-flex items-center gap-1.5 h-7 px-3 rounded-lg text-label-md bg-md-success-container text-md-on-success-container"
              >
                <StateLayer shape="small" />
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
                Live
              </a>
            )}
          </div>
        </div>

        <p className="text-label-md uppercase tracking-wider text-md-primary mb-2">{project.categoryLabel}</p>

        <h3 className="text-title-lg text-md-on-surface mb-3">
          <Link
            ref={linkRef}
            to={href}
            className="outline-none before:absolute before:inset-0 before:rounded-[inherit] before:content-['']"
          >
            {project.title}
          </Link>
        </h3>

        <p className="text-body-md text-md-on-surface-variant line-clamp-3 mb-6">{project.description}</p>
      </div>

      <div className="pt-4 border-t border-md-outline-variant/60">
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center h-7 px-2.5 text-label-md rounded-lg bg-md-surface-container-high text-md-on-surface-variant"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="px-1.5 text-label-md text-md-on-surface-variant">+{project.tags.length - 3} more</span>
          )}
        </div>

        {/* Presentational: the whole card is the link, this is its label. */}
        <div className="flex w-full items-center justify-between rounded-full text-label-lg text-md-primary px-4 py-2.5 bg-md-primary/0 group-hover:bg-md-primary/10 transition-colors duration-effects ease-effects" aria-hidden="true">
          <span>View Case Study &amp; Details</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-spatial ease-spatial group-hover:translate-x-1" />
        </div>
      </div>
    </motion.li>
  );
});
ProjectCard.displayName = 'ProjectCard';

export default Projects;

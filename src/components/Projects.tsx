import { useCallback, useRef, useState, FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, Github, Lock, ExternalLink, ArrowRight, Check } from 'lucide-react';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import { projects } from '../data/projects';
import type { FilterType } from '../data/projects';
import { Link } from '../router';
import { useRouter } from '../router-core';
import { projectPath } from '../routes';

/**
 * The projects section on the home page: a filterable grid of cards.
 *
 * Each card links to `/projects/<id>`, a prerendered page of its own, rather
 * than opening a modal. The case study itself lives in `ProjectCaseStudy`.
 */
export const Projects: FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const { navigate } = useRouter();

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

  const filteredProjects =
    activeFilter === 'All'
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  const filterTabs: FilterType[] = ['All', 'Android', 'Fullstack', 'Backend'];

  return (
    <section id="projects" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Section Header */}
      <div className="relative z-10 text-center mb-14">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 h-8 px-4 rounded-full text-xs font-medium uppercase tracking-wider bg-md-surface-container-high text-md-on-surface-variant border border-md-outline-variant mb-4"
        >
          <Folder className="w-3.5 h-3.5 text-md-primary" />
          <span>Featured Portfolio</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-md-on-surface"
        >
          Projects &amp; Case Studies
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-base sm:text-lg text-md-on-surface-variant max-w-2xl mx-auto leading-relaxed"
        >
          Explore a curated selection of native mobile applications, robust backend microservices, and fullstack platforms engineered for performance and scalability.
        </motion.p>
      </div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 flex flex-wrap items-center justify-center gap-2 mb-14"
      >
        <div
          ref={filterBarRef}
          role="group"
          aria-label="Filter projects by category"
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab;
            return (
              <button
                key={tab}
                type="button"
                aria-pressed={isActive}
                onClick={() => selectFilter(tab)}
                className={`state-layer md-focus inline-flex items-center gap-2 h-10 rounded-full text-sm font-medium border transition-colors duration-medium ease-emphasized ${
                  isActive
                    ? 'pl-3 pr-4 bg-md-secondary-container text-md-on-secondary-container border-transparent'
                    : 'px-4 bg-transparent text-md-on-surface-variant border-md-outline'
                }`}
              >
                {isActive && <Check className="w-[18px] h-[18px]" />}
                <span>{tab}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        layout
        className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
      >
        <AnimatePresence>
          {filteredProjects.map((project) => {
            const IconComponent = project.icon;
            return (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
                onClick={() => navigate(projectPath(project))}
                className="state-layer state-layer-within group relative flex flex-col justify-between rounded-3xl bg-md-surface-container border border-md-outline-variant shadow-md-1 hover:shadow-md-2 p-6 sm:p-7 transition-shadow duration-medium ease-emphasized cursor-pointer"
              >
                {/* Card Content Top */}
                <div>
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div className="p-3 rounded-2xl bg-md-primary-container text-md-on-primary-container">
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {project.isPrivate ? (
                        <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs font-medium bg-md-surface-container-highest text-md-on-surface-variant">
                          <Lock className="w-3 h-3" />
                          Private
                        </span>
                      ) : project.github ? (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.title} source code on GitHub`}
                          className="state-layer md-focus inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs font-medium text-md-on-surface-variant border border-md-outline-variant"
                        >
                          <Github className="w-3 h-3" />
                          Code
                        </a>
                      ) : null}

                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.title} live on Google Play`}
                          className="state-layer md-focus inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs font-medium bg-md-success/15 text-md-success border border-md-success/30"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Live
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="text-xs font-medium uppercase tracking-wider text-md-primary mb-2">
                    {project.categoryLabel}
                  </div>

                  <h3 className="text-xl font-medium text-md-on-surface mb-3">
                    <Link
                      to={projectPath(project)}
                      className="md-focus rounded-lg"
                    >
                      {project.title}
                    </Link>
                  </h3>

                  <p className="text-sm text-md-on-surface-variant leading-relaxed line-clamp-3 mb-6">
                    {project.description}
                  </p>
                </div>

                {/* Card Content Bottom / Tags */}
                <div className="pt-4 border-t border-md-outline-variant">
                  <div className="flex flex-wrap items-center gap-1.5 mb-4">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center h-7 px-3 text-xs font-medium rounded-full bg-md-surface-container-high text-md-on-surface-variant"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="px-2 text-xs font-medium text-md-on-surface-variant">
                        +{project.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  <Link
                    to={projectPath(project)}
                    aria-label={`Read the ${project.title} case study`}
                    className="state-layer md-focus flex w-full items-center justify-between rounded-full text-sm font-medium text-md-primary px-4 py-2.5"
                  >
                    <span>View Case Study &amp; Details</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-medium ease-emphasized" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default Projects;

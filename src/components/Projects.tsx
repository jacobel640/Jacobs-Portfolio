import { useCallback, useRef, useState, FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, Github, Lock, ExternalLink, ArrowRight } from 'lucide-react';
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
      {/* Ambient background glow */}
      <div className="ambient-glow absolute top-1/3 right-1/4 w-[32rem] h-[32rem] bg-blue-900/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Section Header */}
      <div className="relative z-10 text-center mb-14">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-300 border border-blue-500/25 mb-4 shadow-sm"
        >
          <Folder className="w-3.5 h-3.5 text-blue-400" />
          <span>Featured Portfolio</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white"
        >
          Projects &amp; Case Studies
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
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
          className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-900/60 border border-white/[0.08] backdrop-blur-xl"
        >
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab;
            return (
              <button
                key={tab}
                type="button"
                aria-pressed={isActive}
                onClick={() => selectFilter(tab)}
                className={`relative px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFilterTabIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/25 border border-blue-400/30"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
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
                transition={{ duration: 0.3 }}
                onClick={() => navigate(projectPath(project))}
                className="group relative flex flex-col justify-between rounded-3xl bg-slate-900/50 hover:bg-slate-900/80 border border-white/[0.08] hover:border-white/[0.22] p-6 sm:p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 backdrop-blur-xl cursor-pointer overflow-hidden focus-within:border-white/[0.22]"
              >
                {/* Subtle top card glow */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Card Content Top */}
                <div>
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:scale-105 group-hover:bg-blue-500/20 transition-all duration-300">
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {project.isPrivate ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-slate-800/80 text-slate-400 border border-slate-700/60">
                          <Lock className="w-3 h-3" />
                          Private
                        </span>
                      ) : project.github ? (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.title} source code on GitHub`}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
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
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Live
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-2">
                    {project.categoryLabel}
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-300 transition-all mb-3">
                    <Link
                      to={projectPath(project)}
                      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 rounded-lg"
                    >
                      {project.title}
                    </Link>
                  </h3>

                  <p className="text-sm text-slate-300/80 leading-relaxed line-clamp-3 mb-6">
                    {project.description}
                  </p>
                </div>

                {/* Card Content Bottom / Tags */}
                <div className="pt-4 border-t border-white/[0.06]">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white/[0.04] text-slate-300 border border-white/[0.06]"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="px-2 py-1 text-[11px] font-medium rounded-lg text-slate-400">
                        +{project.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  <Link
                    to={projectPath(project)}
                    aria-label={`Read the ${project.title} case study`}
                    className="flex w-full items-center justify-between rounded-lg text-xs font-semibold text-blue-400 group-hover:text-blue-300 transition-colors pt-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
                  >
                    <span>View Case Study &amp; Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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

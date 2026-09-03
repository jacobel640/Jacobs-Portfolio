import {
  useState,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useCallback,
  FC,
} from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { PanInfo, Variants } from 'framer-motion';
import {
  Folder,
  Github,
  X,
  Lock,
  CheckCircle2,
  Image as ImageIcon,
  ExternalLink,
  Sparkles,
  Layers,
  ZoomIn,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Server,
  Loader2,
} from 'lucide-react';
import { RichText } from './RichText';
import { projects, thumbFor } from '../data/projects';
import type { FilterType, Project } from '../data/projects';

/** How far a horizontal drag has to travel — distance plus a slice of its
 *  throw velocity — before it counts as a swipe rather than a stray touch. */
const SWIPE_THRESHOLD_PX = 55;

/** The outgoing image leaves the way the incoming one arrives from. */
const slideVariants: Variants = {
  enter: (direction: number) => ({ x: direction >= 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction >= 0 ? '-100%' : '100%', opacity: 0 }),
};

/** Same transition without the travel, for visitors who ask for reduced motion. */
const fadeVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

export const Projects: FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  // The lightbox tracks a position in the project's screenshot list rather than
  // a single shot, so it can walk to the next or previous one.
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  // +1 when moving forwards, -1 backwards: it decides which edge the incoming
  // image slides in from.
  const [slideDirection, setSlideDirection] = useState(0);
  // Full-resolution sources that have finished decoding. Keyed by src rather
  // than a single boolean so the outgoing image keeps its own loaded state
  // mid-swipe, and so stepping back to an image already seen doesn't
  // re-introduce the spinner.
  const [loadedSrcs, setLoadedSrcs] = useState<string[]>([]);

  const reduceMotion = useReducedMotion();

  // Set while a lightbox swipe is in flight. A drag that travels past the edge
  // of the image releases the pointer over the backdrop, and the browser then
  // fires a click on their common ancestor — which would read as "clicked
  // outside the image" and close the lightbox at the end of every swipe.
  const swipedRef = useRef(false);

  // The card that opened the modal, so focus can be handed back on close.
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  // Switching categories changes how many cards the grid holds, which changes
  // the page height and slides everything under the pointer. Pin the filter
  // bar — the control that was just clicked — to where it was.
  const filterBarRef = useRef<HTMLDivElement | null>(null);
  const pinnedBarTopRef = useRef<number | null>(null);

  const selectFilter = useCallback((tab: FilterType) => {
    pinnedBarTopRef.current = filterBarRef.current?.getBoundingClientRect().top ?? null;
    setActiveFilter(tab);
  }, []);

  useLayoutEffect(() => {
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
    // would feel like the page is stuck.
    window.addEventListener('wheel', release, { passive: true });
    window.addEventListener('touchstart', release, { passive: true });
    window.addEventListener('keydown', release);

    return release;
  }, [activeFilter]);

  const modalShots = useMemo(
    () => selectedProject?.detailedContent.screenshots ?? [],
    [selectedProject],
  );
  const shotCount = modalShots.length;
  const selectedImage = selectedIndex === null ? null : modalShots[selectedIndex] ?? null;
  const canNavigate = shotCount > 1;

  // Loaded sources belong to one project's gallery; drop them with the project.
  useEffect(() => {
    setLoadedSrcs([]);
  }, [selectedProject]);

  const markLoaded = useCallback((src: string) => {
    setLoadedSrcs((previous) => (previous.includes(src) ? previous : [...previous, src]));
  }, []);

  const openImage = useCallback((index: number) => {
    setSlideDirection(0);
    setSelectedIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  /** Steps the lightbox by `delta`, wrapping around at either end. */
  const goToImage = useCallback(
    (delta: number) => {
      if (shotCount < 2) return;
      setSlideDirection(delta >= 0 ? 1 : -1);
      setSelectedIndex((current) =>
        current === null ? current : (current + delta + shotCount) % shotCount,
      );
    },
    [shotCount],
  );

  const dismissLightbox = useCallback(() => {
    // Swallow the click a completed swipe leaves behind, once.
    if (swipedRef.current) {
      swipedRef.current = false;
      return;
    }
    closeLightbox();
  }, [closeLightbox]);

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      // Velocity carries the intent of a short, fast flick that never travels
      // far enough on distance alone.
      const throw_ = info.offset.x + info.velocity.x * 0.2;
      if (throw_ <= -SWIPE_THRESHOLD_PX) goToImage(1);
      else if (throw_ >= SWIPE_THRESHOLD_PX) goToImage(-1);
    },
    [goToImage],
  );

  // Keep the neighbours warm so a swipe lands on a decoded image rather than a
  // spinner.
  useEffect(() => {
    if (selectedIndex === null || shotCount < 2) return;
    const neighbours = [
      modalShots[(selectedIndex + 1) % shotCount],
      modalShots[(selectedIndex - 1 + shotCount) % shotCount],
    ];
    neighbours.forEach((shot) => {
      if (!shot) return;
      const preload = new Image();
      preload.src = shot.src;
    });
  }, [selectedIndex, shotCount, modalShots]);

  const closeProject = useCallback(() => {
    setSelectedIndex(null);
    setSelectedProject(null);
  }, []);

  const openProject = useCallback((project: Project, trigger: HTMLElement | null) => {
    lastFocusedRef.current = trigger;
    setSelectedProject(project);
  }, []);

  // Prevent background scrolling while a modal or the lightbox is open.
  // `removeProperty` rather than setting 'unset' — the shorthand would also
  // clear the `overflow-x: hidden` that keeps the ambient glows from causing
  // horizontal scroll.
  useEffect(() => {
    if (selectedProject || selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.removeProperty('overflow');
    }
    return () => {
      document.body.style.removeProperty('overflow');
    };
  }, [selectedProject, selectedImage]);

  // Escape closes the lightbox first, then the project modal. The arrow keys
  // are the keyboard equivalent of the swipe gesture.
  useEffect(() => {
    if (!selectedProject && !selectedImage) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        if (selectedImage) closeLightbox();
        else closeProject();
        return;
      }

      if (!selectedImage || !canNavigate) return;
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goToImage(1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToImage(-1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedProject, selectedImage, canNavigate, closeProject, closeLightbox, goToImage]);

  // Move focus into the modal on open, and back to the originating card on close.
  useEffect(() => {
    if (selectedProject) {
      closeButtonRef.current?.focus();
    } else {
      lastFocusedRef.current?.focus();
      lastFocusedRef.current = null;
    }
  }, [selectedProject]);

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
                onClick={(e) => openProject(project, e.currentTarget as HTMLElement)}
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
                    {project.title}
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

                  <button
                    type="button"
                    aria-label={`Open case study: ${project.title}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      openProject(project, e.currentTarget.closest('div') as HTMLElement);
                    }}
                    className="flex w-full items-center justify-between rounded-lg text-xs font-semibold text-blue-400 group-hover:text-blue-300 transition-colors pt-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
                  >
                    <span>View Case Study &amp; Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* High-End Glassmorphic Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl overflow-y-auto"
            onClick={closeProject}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="bg-slate-900/95 border border-white/[0.12] rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl shadow-black/80 my-auto text-left relative flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* The scroll container is separate from the rounded shell above,
                  so the scrollbar is clipped by the corners instead of being
                  painted across them. */}
              <div className="modal-scroll flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
              {/* Modal Header */}
              <div className="sticky top-0 z-20 flex items-center justify-between p-6 sm:px-8 border-b border-white/[0.08] bg-slate-900/95 backdrop-blur-2xl">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/25 hidden sm:flex items-center justify-center">
                    {(() => {
                      const ModalIcon = selectedProject.icon;
                      return <ModalIcon className="w-6 h-6" />;
                    })()}
                  </div>
                  <div>
                    <h3
                      id="project-modal-title"
                      className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
                    >
                      {selectedProject.title}
                    </h3>
                    <p className="text-blue-400 font-medium text-xs sm:text-sm mt-0.5">
                      {selectedProject.categoryLabel}
                    </p>
                  </div>
                </div>

                <button
                  ref={closeButtonRef}
                  onClick={closeProject}
                  className="p-2.5 text-slate-400 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] rounded-2xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
                  aria-label="Close project modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-8">
                {/* Overview */}
                <div>
                  <h4 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                    <Folder className="w-4 h-4 text-blue-400" />
                    <span>Project Overview</span>
                  </h4>
                  <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed bg-white/[0.02] p-5 sm:p-6 rounded-2xl border border-white/[0.06]">
                    {selectedProject.detailedContent.overview.map((paragraph, idx) => (
                      // The opening paragraph reads as a lead: slightly larger and
                      // brighter, so the eye has an obvious place to start.
                      <p
                        key={idx}
                        className={
                          idx === 0
                            ? 'text-base sm:text-lg text-slate-100 leading-relaxed'
                            : undefined
                        }
                      >
                        <RichText>{paragraph}</RichText>
                      </p>
                    ))}
                  </div>
                </div>

                {/* Architecture & Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Architecture */}
                  <div className="bg-slate-950/40 p-5 rounded-2xl border border-white/[0.06]">
                    <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2 border-b border-white/[0.06] pb-2.5">
                      <Server className="w-4 h-4 text-indigo-400" />
                      <span>Architecture &amp; Engineering</span>
                    </h4>
                    <ul className="space-y-3">
                      {selectedProject.detailedContent.architecture.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-slate-300 text-xs sm:text-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Features */}
                  <div className="bg-slate-950/40 p-5 rounded-2xl border border-white/[0.06]">
                    <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2 border-b border-white/[0.06] pb-2.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Key Features &amp; Highlights</span>
                    </h4>
                    <ul className="space-y-3">
                      {selectedProject.detailedContent.features.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-slate-300 text-xs sm:text-sm">
                          <CheckCircle2 className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Tech Stack */}
                <div>
                  <h4 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span>Technology Stack</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-white/[0.05] text-slate-200 border border-white/[0.08] shadow-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Screenshots & Media Section */}
                <div>
                  <h4 className="text-base font-bold text-white mb-4 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-pink-400" />
                      <span>Screenshots &amp; Visual Artifacts</span>
                    </span>
                    {modalShots.length > 0 && (
                      <span className="text-xs font-normal text-slate-400">
                        Click any image to zoom
                      </span>
                    )}
                  </h4>

                  {modalShots.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {modalShots.map((shot, index) => (
                        <figure key={shot.src} className="m-0">
                          <button
                            type="button"
                            onClick={() => openImage(index)}
                            aria-label={`Zoom: ${shot.caption}`}
                            className="group relative block w-full overflow-hidden rounded-2xl aspect-[9/20] border border-white/[0.08] hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
                          >
                            <img
                              src={thumbFor(shot.src)}
                              alt={`${selectedProject.title} — ${shot.caption}`}
                              loading="lazy"
                              decoding="async"
                              width={432}
                              height={960}
                              onError={(e) => {
                                // Fall back to the original PNG if the WebP thumb is missing.
                                const img = e.currentTarget;
                                if (img.src !== shot.src) img.src = shot.src;
                              }}
                              className="block w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                            <span className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200 flex items-end justify-end p-2.5">
                              <span className="p-1.5 rounded-lg bg-blue-600/90 text-white">
                                <ZoomIn className="w-3.5 h-3.5" />
                              </span>
                            </span>
                          </button>
                          <figcaption className="mt-2 text-[11px] leading-snug text-slate-400 text-center px-1">
                            {shot.caption}
                          </figcaption>
                        </figure>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-white/[0.08] bg-slate-950/40 p-8 text-center backdrop-blur-sm">
                      <ImageIcon className="w-10 h-10 mx-auto text-slate-500 mb-3 opacity-70" />
                      <p className="text-sm font-medium text-slate-400">
                        No screenshots available to display
                      </p>
                    </div>
                  )}
                </div>

                {/* Repository & Live Demo Actions */}
                <div className="bg-slate-950/50 rounded-2xl p-5 sm:p-6 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h5 className="text-white font-semibold text-sm sm:text-base mb-1">
                      Project Repository &amp; Delivery
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-400 max-w-md">
                      {selectedProject.isPrivate
                        ? 'This repository is private due to client confidentiality, enterprise credentials, or proprietary intellectual property.'
                        : 'Explore the full source code, commit history, and architectural implementation on GitHub.'}
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    {selectedProject.isPrivate ? (
                      <div className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/80 text-slate-400 border border-white/[0.06] text-xs sm:text-sm font-medium">
                        <Lock className="w-4 h-4" />
                        <span>Private Repository</span>
                      </div>
                    ) : selectedProject.github ? (
                      <a
                        href={selectedProject.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-blue-500/20 transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
                      >
                        <Github className="w-4 h-4" />
                        <span>Source Code</span>
                      </a>
                    ) : null}

                    {selectedProject.demo && (
                      <a
                        href={selectedProject.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lightbox / Zoom Overlay */}
      <AnimatePresence>
        {selectedImage && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl"
            /* Every press starts out as a plain click; only a drag that actually
               engages flips the flag, and the next press clears it again, so a
               stale flag can never swallow a real dismissal. */
            onPointerDownCapture={() => {
              swipedRef.current = false;
            }}
            onClick={dismissLightbox}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={selectedImage.caption}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-5xl max-h-[90vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeLightbox}
                autoFocus
                className="absolute -top-12 right-0 p-2 text-slate-300 hover:text-white bg-white/[0.1] hover:bg-white/[0.2] border border-white/[0.15] rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
                aria-label="Close image preview"
              >
                <X className="w-5 h-5" />
              </button>

              {/* The frame keeps its size across a swipe; only its contents move,
                  so the panel never resizes mid-gesture. */}
              <div className="group relative aspect-[9/20] h-[76vh] max-w-full overflow-hidden rounded-2xl border border-white/[0.15] shadow-2xl bg-slate-950">
                <AnimatePresence initial={false} custom={slideDirection}>
                  {(() => {
                    const shot = selectedImage;
                    const ready = loadedSrcs.includes(shot.src);
                    return (
                      <motion.div
                        key={shot.src}
                        custom={slideDirection}
                        variants={reduceMotion ? fadeVariants : slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                          type: 'tween',
                          ease: [0.22, 1, 0.36, 1],
                          duration: reduceMotion ? 0.15 : 0.32,
                        }}
                        drag={canNavigate ? 'x' : false}
                        dragDirectionLock
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.16}
                        dragMomentum={false}
                        onDragStart={() => {
                          swipedRef.current = true;
                        }}
                        onDragEnd={handleDragEnd}
                        className={`absolute inset-0 ${
                          canNavigate ? 'cursor-grab active:cursor-grabbing' : ''
                        }`}
                      >
                        {/* The grid already fetched the thumbnail, so it paints
                            immediately and holds the frame at the right size while
                            the full-resolution PNG arrives — rather than an empty
                            box with the close button floating in the middle of it. */}
                        <img
                          src={thumbFor(shot.src)}
                          alt=""
                          aria-hidden="true"
                          draggable={false}
                          className={`absolute inset-0 w-full h-full object-cover blur-[3px] scale-105 select-none transition-opacity duration-300 ${
                            ready ? 'opacity-0' : 'opacity-100'
                          }`}
                        />

                        {!ready && (
                          <span
                            className="absolute inset-0 flex items-center justify-center"
                            role="status"
                          >
                            <Loader2 className="w-8 h-8 text-white/80 animate-spin" />
                            <span className="sr-only">Loading full-resolution screenshot</span>
                          </span>
                        )}

                        <img
                          src={shot.src}
                          alt={shot.caption}
                          draggable={false}
                          ref={(node) => {
                            // A cached image can already be complete before onLoad binds.
                            if (node?.complete) markLoaded(shot.src);
                          }}
                          onLoad={() => markLoaded(shot.src)}
                          onError={() => markLoaded(shot.src)}
                          className={`relative w-full h-full object-cover select-none transition-opacity duration-300 ${
                            ready ? 'opacity-100' : 'opacity-0'
                          }`}
                        />
                      </motion.div>
                    );
                  })()}
                </AnimatePresence>

                {/* Swiping is the primary gesture; these are a quiet fallback for
                    a mouse, so they sit at half opacity until pointed at. */}
                {canNavigate && (
                  <>
                    <button
                      type="button"
                      onClick={() => goToImage(-1)}
                      aria-label="Previous screenshot"
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 hover:bg-black/75 text-white/80 hover:text-white border border-white/[0.14] shadow-lg shadow-black/30 backdrop-blur-sm opacity-55 hover:opacity-100 focus-visible:opacity-100 group-hover:opacity-90 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => goToImage(1)}
                      aria-label="Next screenshot"
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 hover:bg-black/75 text-white/80 hover:text-white border border-white/[0.14] shadow-lg shadow-black/30 backdrop-blur-sm opacity-55 hover:opacity-100 focus-visible:opacity-100 group-hover:opacity-90 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              <p
                className="mt-3 text-xs sm:text-sm text-slate-300 font-medium tracking-wide text-center px-2"
                aria-live="polite"
              >
                {selectedImage.caption}
              </p>

              {canNavigate && selectedIndex !== null && (
                <p className="mt-1 text-[11px] text-slate-500 tracking-wide">
                  {selectedIndex + 1} / {shotCount}
                  <span className="sr-only">
                    {' '}
                    — swipe or use the arrow keys to move between screenshots
                  </span>
                </p>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;

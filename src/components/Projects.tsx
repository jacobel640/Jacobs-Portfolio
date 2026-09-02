import { useState, useEffect, useRef, useCallback, FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Server,
} from 'lucide-react';
import { RichText } from './RichText';
import { projects, thumbFor } from '../data/projects';
import type { FilterType, Project, Screenshot } from '../data/projects';

export const Projects: FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedImage, setSelectedImage] = useState<Screenshot | null>(null);

  // The card that opened the modal, so focus can be handed back on close.
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const closeProject = useCallback(() => {
    setSelectedImage(null);
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

  // Escape closes the lightbox first, then the project modal.
  useEffect(() => {
    if (!selectedProject && !selectedImage) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.stopPropagation();
      if (selectedImage) setSelectedImage(null);
      else closeProject();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedProject, selectedImage, closeProject]);

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

  const modalShots = selectedProject?.detailedContent.screenshots ?? [];

  return (
    <section id="projects" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 right-1/4 w-[32rem] h-[32rem] bg-blue-900/10 rounded-full blur-[130px] pointer-events-none" />

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
                onClick={() => setActiveFilter(tab)}
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
              <div className="modal-scroll flex-1 overflow-y-auto overscroll-contain">
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
                      {modalShots.map((shot) => (
                        <figure key={shot.src} className="m-0">
                          <button
                            type="button"
                            onClick={() => setSelectedImage(shot)}
                            aria-label={`Zoom: ${shot.caption}`}
                            className="group relative block w-full rounded-[1.35rem] p-1.5 bg-slate-950/80 border border-white/[0.10] hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
                          >
                            <span className="block overflow-hidden rounded-[0.95rem] aspect-[9/19.5] bg-slate-900">
                              <img
                                src={thumbFor(shot.src)}
                                alt={`${selectedProject.title} — ${shot.caption}`}
                                loading="lazy"
                                decoding="async"
                                width={432}
                                height={936}
                                onError={(e) => {
                                  // Fall back to the original PNG if the WebP thumb is missing.
                                  const img = e.currentTarget;
                                  if (img.src !== shot.src) img.src = shot.src;
                                }}
                                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                              />
                            </span>
                            <span className="absolute inset-1.5 rounded-[0.95rem] bg-gradient-to-t from-slate-950/95 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200 flex items-end justify-end p-2.5">
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
            onClick={() => setSelectedImage(null)}
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
                onClick={() => setSelectedImage(null)}
                autoFocus
                className="absolute -top-12 right-0 p-2 text-slate-300 hover:text-white bg-white/[0.1] hover:bg-white/[0.2] border border-white/[0.15] rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
                aria-label="Close image preview"
              >
                <X className="w-5 h-5" />
              </button>

              <img
                src={selectedImage.src}
                alt={selectedImage.caption}
                className="max-w-full max-h-[80vh] object-contain rounded-2xl border border-white/[0.15] shadow-2xl"
              />

              <p className="mt-3 text-xs sm:text-sm text-slate-300 font-medium tracking-wide">
                {selectedImage.caption}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;

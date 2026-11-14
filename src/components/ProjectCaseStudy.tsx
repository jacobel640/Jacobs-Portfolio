import { useCallback, useEffect, useMemo, useRef, useState, FC, ReactNode } from 'react';
import { motion, AnimatePresence, useReducedMotion, useMotionValue, animate } from 'framer-motion';
import type { AnimationPlaybackControls, PanInfo } from 'framer-motion';
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
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Server,
  Loader2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import { RichText } from './RichText';
import { thumbFor } from '../data/projects';
import type { Project, Screenshot } from '../data/projects';
import { cn } from '../lib/cn';
import { themeVars } from '../theme/color';
import { ENTER, motionScheme, revealContainer, revealItem, spatialWithEffects } from '../theme/motion';
import { Button, IconButton } from './md/Button';
import { Reveal, RevealItem } from './md/Reveal';
import { StateLayer } from './md/StateLayer';

const SWIPE_DISTANCE_RATIO = 0.4;

/**
 * How far ahead a release is credited for the speed it still carries. A flick
 * is charged the distance it would have covered had the finger kept going, so
 * it clears the same gate as a full drag without the travel.
 *
 * Deliberately one rule rather than a separate velocity threshold. A hard
 * velocity gate has to sit at some particular number, and if pointer velocity
 * reads lower than that number on a given device the flick shortcut silently
 * stops working. Folding it into the distance instead degrades gracefully:
 * under-read the velocity and this falls back toward the plain distance rule,
 * which needs no calibration at all.
 */
const FLICK_LOOKAHEAD_S = 0.2;

/** Floor under the credit: a press that barely moved is not a flick, however
 *  sharply the pointer was lifted. Proportional, like the distance gate, so it
 *  means the same gesture on a phone as on a desktop. */
const MIN_TRAVEL_RATIO = 0.04;

/**
 * What a released drag means: -1 for the previous image, 1 for the next, 0 to
 * spring back where it was.
 *
 * Pure and separate from the component so the rule can be reasoned about, and
 * checked, on its own — synthetic pointer events cannot reproduce the timing of
 * a real flick, so the arithmetic is worth being able to test directly.
 */
function resolveSwipe(offsetX: number, velocityX: number, width: number): -1 | 0 | 1 {
  if (!width) return 0;

  const travelled = Math.abs(offsetX);
  if (travelled < width * MIN_TRAVEL_RATIO) return 0;

  // The distance the gesture actually covered, plus the distance its release
  // speed would have carried it. The projection only counts when it agrees with
  // where the gesture ended up: dragging one way and then whipping back toward
  // the middle is someone undoing the swipe, not asking for the image on the
  // other side.
  const projected = offsetX + velocityX * FLICK_LOOKAHEAD_S;
  const carried =
    Math.sign(projected) === Math.sign(offsetX) ? Math.abs(projected) : travelled;

  if (carried < width * SWIPE_DISTANCE_RATIO) return 0;
  return offsetX < 0 ? 1 : -1;
}

/** Carries the track home, whether from a released finger or an arrow press.
 *  A spring rather than a fixed duration: the settle scales with how far the
 *  image still has to go. */
const SETTLE_SPRING = { type: 'spring', stiffness: 300, damping: 34, mass: 0.85 } as const;

interface LightboxPaneProps {
  shot: Screenshot;
  /** Position in the track: -1 previous, 0 current, 1 next. */
  slot: -1 | 0 | 1;
  ready: boolean;
  failed: boolean;
  onLoaded: (src: string) => void;
  onFailed: (src: string) => void;
}

/**
 * One screenshot in the swipe track. The neighbours are mounted and painted
 * alongside the current one — that is what lets a drag pull the next image in
 * from the edge rather than play an animation once the finger is already gone.
 */
const LightboxPane: FC<LightboxPaneProps> = ({ shot, slot, ready, failed, onLoaded, onFailed }) => (
  <div
    className={`absolute inset-0 ${
      slot === -1 ? '-translate-x-full' : slot === 1 ? 'translate-x-full' : ''
    }`}
    aria-hidden={slot === 0 ? undefined : 'true'}
  >
    {/* The grid already fetched the thumbnail, so it paints immediately and
        holds the frame at the right size while the full-resolution PNG
        arrives — rather than an empty box with the close button floating in
        the middle of it. */}
    <img
      src={thumbFor(shot.src)}
      alt={failed && slot === 0 ? shot.caption : ''}
      aria-hidden={failed && slot === 0 ? undefined : 'true'}
      draggable={false}
      className={`absolute inset-0 w-full h-full object-cover select-none transition-opacity duration-300 ${
        failed ? '' : 'blur-[3px] scale-105'
      } ${ready ? 'opacity-0' : 'opacity-100'}`}
    />

    {!ready && !failed && (
      <span className="absolute inset-0 flex items-center justify-center" role="status">
        <Loader2 className="w-8 h-8 text-md-primary animate-spin" />
        <span className="sr-only">Loading full-resolution screenshot</span>
      </span>
    )}

    <img
      src={shot.src}
      alt={slot === 0 ? shot.caption : ''}
      draggable={false}
      ref={(node) => {
        // A cached image can already be complete before onLoad binds — and so
        // can a failed one, which only `naturalWidth` tells apart.
        if (!node?.complete) return;
        if (node.naturalWidth > 0) onLoaded(shot.src);
        else onFailed(shot.src);
      }}
      onLoad={() => onLoaded(shot.src)}
      onError={() => onFailed(shot.src)}
      className={`relative w-full h-full object-cover select-none transition-opacity duration-300 ${
        ready ? 'opacity-100' : 'opacity-0'
      }`}
    />
  </div>
);

/**
 * One project's case study, as its own page at `/projects/<id>`.
 *
 * This content used to live in a modal, which meant it existed only after a
 * click: it was absent from the HTML the build ships, so no crawler, unfurler
 * or LLM fetcher ever saw the substance of the work — roughly four fifths of
 * the site's writing. As a route it is prerendered like any other page, with
 * its own title, description and canonical URL.
 */
interface SectionTitleProps {
  icon: LucideIcon;
  tone: string;
  className?: string;
  children: ReactNode;
}

/** A case-study section heading: a tinted glyph and a title-medium label. */
const SectionTitle: FC<SectionTitleProps> = ({ icon: Icon, tone, className, children }) => (
  <h2 className={cn('text-title-md text-md-on-surface mb-3 flex items-center gap-2', className)}>
    <Icon className={cn('w-4 h-4', tone)} aria-hidden="true" />
    <span>{children}</span>
  </h2>
);

interface FactListProps {
  icon: LucideIcon;
  tone: string;
  title: string;
  items: string[];
  markTone: string;
}

/** A tonal card holding one checked list: the architecture, or the features. */
const FactList: FC<FactListProps> = ({ icon, tone, title, items, markTone }) => (
  <RevealItem className="bg-md-surface-container-low p-5 sm:p-6 rounded-3xl border border-md-outline-variant/60">
    <SectionTitle icon={icon} tone={tone} className="pb-3 mb-4 border-b border-md-outline-variant/60">
      {title}
    </SectionTitle>
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-md-on-surface-variant text-body-md">
          <CheckCircle2 className={cn('w-4 h-4 mt-0.5 shrink-0', markTone)} aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </RevealItem>
);

export const ProjectCaseStudy: FC<{ project: Project }> = ({ project }) => {
  // The lightbox tracks a position in the project's screenshot list rather than
  // a single shot, so it can walk to the next or previous one.
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  // True from the moment a swipe engages until the finger lifts, so the arrows
  // can get out of the way of the gesture.
  const [isSwiping, setIsSwiping] = useState(false);
  // The frame's own width, which is both the drag limit and the distance one
  // step of the track covers. Measured rather than assumed: it changes with the
  // viewport.
  const [frameWidth, setFrameWidth] = useState(0);
  // Full-resolution sources that have finished decoding, and those that could
  // not be fetched. Keyed by src rather than a single boolean so the outgoing
  // image keeps its own state mid-swipe, and so stepping back to an image
  // already seen doesn't re-introduce the spinner.
  const [loadedSrcs, setLoadedSrcs] = useState<string[]>([]);
  const [failedSrcs, setFailedSrcs] = useState<string[]>([]);

  const reduceMotion = useReducedMotion();

  // Horizontal offset of the whole three-pane track. The drag writes to it
  // directly, so the image tracks the finger one-to-one instead of animating
  // once the gesture is already over.
  const trackX = useMotionValue(0);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const trackAnimationRef = useRef<AnimationPlaybackControls | null>(null);
  // Where the track has to be re-pinned the instant the index changes, so the
  // pane that slid into view keeps the exact position it already had, and the
  // speed the finger was carrying when it let go.
  const pendingTrackXRef = useRef<number | null>(null);
  const pendingVelocityRef = useRef(0);

  // Set while a lightbox swipe is in flight. A drag that travels past the edge
  // of the image releases the pointer over the backdrop, and the browser then
  // fires a click on their common ancestor — which would read as "clicked
  // outside the image" and close the lightbox at the end of every swipe.
  const swipedRef = useRef(false);

  // The card that opened the modal, so focus can be handed back on close.

  const shots = useMemo(
    () => project.detailedContent.screenshots ?? [],
    [project],
  );
  const shotCount = shots.length;
  const selectedImage = selectedIndex === null ? null : shots[selectedIndex] ?? null;
  const canNavigate = shotCount > 1;
  const lightboxOpen = selectedImage !== null;

  // The neighbours either side of the current shot, which the track paints so a
  // drag has something real to pull into view. They are mounted rather than
  // merely prefetched, which is also what warms them.
  const trackPanes: { shot: Screenshot; slot: -1 | 0 | 1 }[] =
    selectedIndex === null || !selectedImage
      ? []
      : canNavigate
        ? [
            { shot: shots[(selectedIndex - 1 + shotCount) % shotCount], slot: -1 },
            { shot: selectedImage, slot: 0 },
            { shot: shots[(selectedIndex + 1) % shotCount], slot: 1 },
          ]
        : [{ shot: selectedImage, slot: 0 }];

  // These belong to one project's gallery; drop them with the project.
  useEffect(() => {
    setLoadedSrcs([]);
    setFailedSrcs([]);
  }, [project]);

  const markLoaded = useCallback((src: string) => {
    setLoadedSrcs((previous) => (previous.includes(src) ? previous : [...previous, src]));
  }, []);

  const markFailed = useCallback((src: string) => {
    setFailedSrcs((previous) => (previous.includes(src) ? previous : [...previous, src]));
  }, []);

  const openImage = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  // One step of the track is exactly one frame width, so the width has to be
  // known before any of the gesture maths means anything.
  useIsomorphicLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const measure = () => setFrameWidth(frame.offsetWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [lightboxOpen]);

  const animateTrackTo = useCallback(
    (target: number) => {
      trackAnimationRef.current?.stop();
      if (reduceMotion) {
        trackX.set(target);
        return;
      }
      trackAnimationRef.current = animate(trackX, target, SETTLE_SPRING);
    },
    [reduceMotion, trackX],
  );

  /**
   * Steps the lightbox by `delta`, wrapping around at either end.
   *
   * The index changes first and the track is re-pinned in the same commit, so
   * the pane that was the neighbour becomes the current one without moving a
   * pixel; only then does it travel home. Animating first and swapping
   * afterwards would leave a frame where the two disagree.
   */
  const goToImage = useCallback(
    (delta: number, releaseVelocity = 0) => {
      if (shotCount < 2) return;
      const step = delta >= 0 ? 1 : -1;
      const width = frameRef.current?.offsetWidth ?? 0;
      pendingTrackXRef.current = width ? trackX.get() + step * width : 0;
      pendingVelocityRef.current = releaseVelocity;
      setSelectedIndex((current) =>
        current === null ? current : (current + step + shotCount) % shotCount,
      );
    },
    [shotCount, trackX],
  );

  // Re-pin and release the track. Runs before paint, so the swap above is never
  // visible as a jump.
  useIsomorphicLayoutEffect(() => {
    const pinned = pendingTrackXRef.current;
    const releaseVelocity = pendingVelocityRef.current;
    pendingTrackXRef.current = null;
    pendingVelocityRef.current = 0;
    trackAnimationRef.current?.stop();

    if (pinned === null) {
      // A freshly opened lightbox starts centred.
      trackX.jump(0);
      return;
    }

    // `jump` rather than `set`: re-pinning moves the track a whole frame width
    // in no time at all, and `set` records that as the value's velocity. The
    // settle below would then inherit a speed of thousands of pixels a second
    // and hurl the track several widths away before springing back past centre
    // — the flick away and back that shows up at the end of every transition.
    // `jump` clears the velocity, and the real one is handed over explicitly.
    trackX.jump(pinned);
    if (reduceMotion || pinned === 0) {
      trackX.jump(0);
      return;
    }
    trackAnimationRef.current = animate(trackX, 0, {
      ...SETTLE_SPRING,
      // The finger was already moving this way; the settle carries on from it
      // rather than restarting from rest.
      velocity: releaseVelocity,
    });
  }, [selectedIndex, reduceMotion, trackX]);

  useEffect(() => () => trackAnimationRef.current?.stop(), []);

  const dismissLightbox = useCallback(() => {
    // Swallow the click a completed swipe leaves behind, once.
    if (swipedRef.current) {
      swipedRef.current = false;
      return;
    }
    closeLightbox();
  }, [closeLightbox]);

  const handleDragStart = useCallback(() => {
    trackAnimationRef.current?.stop();
    swipedRef.current = true;
    setIsSwiping(true);
  }, []);

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      setIsSwiping(false);

      const step = resolveSwipe(
        info.offset.x,
        info.velocity.x,
        frameRef.current?.offsetWidth ?? 0,
      );
      if (step !== 0) {
        goToImage(step, info.velocity.x);
        return;
      }

      // Not enough of a gesture — let the image fall back where it was.
      animateTrackTo(0);
    },
    [animateTrackTo, goToImage],
  );


  // Keep the page still behind the lightbox. `removeProperty` rather than
  // setting 'unset' — the shorthand would also clear the `overflow-x: hidden`
  // that guards the page against horizontal scroll.
  useEffect(() => {
    if (lightboxOpen) document.body.style.overflow = 'hidden';
    else document.body.style.removeProperty('overflow');
    return () => {
      document.body.style.removeProperty('overflow');
    };
  }, [lightboxOpen]);

  // Escape closes the lightbox; the arrow keys are the keyboard equivalent of
  // the swipe gesture.
  useEffect(() => {
    if (!selectedImage) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        closeLightbox();
        return;
      }
      if (!canNavigate) return;
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
  }, [selectedImage, canNavigate, closeLightbox, goToImage]);

  const Icon = project.icon;

  return (
    // The page takes the project's own Material You scheme, surfaces and all.
    // Every `md-*` utility and the MD3 web components inside resolve to it, so
    // each case study reads as its own product within the same system.
    <article
      style={themeVars(project.seed)}
      className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24"
    >
      {/* A large-container surface with its own top app bar. The case study is a
          page rather than a modal (so it can be prerendered and linked), but it
          enters like an MD3 dialog: a short rise on the slow spatial spring. */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={ENTER}
        className="relative z-10 rounded-[28px] bg-md-surface-container-high border border-md-outline-variant/60 shadow-md-2 overflow-hidden"
      >
        <div className="flex items-center justify-between gap-3 h-16 px-3 sm:px-4 bg-md-surface-container-highest border-b border-md-outline-variant/60">
          <Button variant="text" to="/#projects" icon={ArrowLeft}>
            All projects
          </Button>
          {project.isPrivate && (
            <span className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-label-md bg-md-surface-container-high text-md-on-surface-variant">
              <Lock className="w-3 h-3" aria-hidden="true" />
              Private
            </span>
          )}
        </div>

        <div className="p-5 sm:p-8 lg:p-10">
          <Reveal immediate stagger={0.08} delay={0.1}>
            <RevealItem>
              <header className="flex flex-col sm:flex-row sm:items-center gap-5 pb-8 mb-8 border-b border-md-outline-variant/60">
                <div className="p-4 rounded-[20px] bg-md-primary-container text-md-on-primary-container inline-flex items-center justify-center w-fit">
                  <Icon className="w-7 h-7" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <p className="text-label-lg uppercase tracking-wider text-md-primary mb-1.5">{project.categoryLabel}</p>
                  <h1 className="text-headline-lg sm:text-display-sm lg:text-display-md text-md-on-surface text-balance">
                    {project.title}
                  </h1>
                </div>
              </header>
            </RevealItem>

            {/* The card blurb, as the page's standfirst. */}
            <RevealItem>
              <p className="text-body-lg sm:text-title-lg sm:font-normal text-md-on-surface-variant mb-10 text-pretty">
                {project.description}
              </p>
            </RevealItem>
          </Reveal>

          <div className="space-y-8">
            {/* Overview */}
            <Reveal>
              <RevealItem>
                <SectionTitle icon={Folder} tone="text-md-primary">
                  Project Overview
                </SectionTitle>
              </RevealItem>
              <RevealItem className="space-y-4 text-md-on-surface-variant text-body-md sm:text-body-lg bg-md-surface-container-low p-5 sm:p-6 rounded-3xl border border-md-outline-variant/60">
                {project.detailedContent.overview.map((paragraph, idx) => (
                  // The opening paragraph reads as a lead: slightly larger and
                  // brighter, so the eye has an obvious place to start.
                  <p key={idx} className={idx === 0 ? 'text-body-lg sm:text-lg text-md-on-surface' : undefined}>
                    <RichText>{paragraph}</RichText>
                  </p>
                ))}
              </RevealItem>
            </Reveal>

            {/* Architecture & Features */}
            <Reveal stagger={0.1} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FactList
                icon={Server}
                tone="text-md-secondary"
                title="Architecture & Engineering"
                items={project.detailedContent.architecture}
                markTone="text-md-success"
              />
              <FactList
                icon={Sparkles}
                tone="text-md-tertiary"
                title="Key Features & Highlights"
                items={project.detailedContent.features}
                markTone="text-md-primary"
              />
            </Reveal>

            {/* Tech stack */}
            <Reveal>
              <RevealItem>
                <SectionTitle icon={Layers} tone="text-md-tertiary">
                  Technology Stack
                </SectionTitle>
              </RevealItem>
              <motion.ul variants={revealContainer(0.03)} className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <motion.li
                    key={tag}
                    variants={revealItem}
                    className="inline-flex items-center h-8 px-3.5 text-label-lg rounded-lg bg-md-secondary-container text-md-on-secondary-container"
                  >
                    {tag}
                  </motion.li>
                ))}
              </motion.ul>
            </Reveal>

            {/* Screenshots */}
            <Reveal>
              <RevealItem className="flex items-center justify-between gap-4 mb-4">
                <SectionTitle icon={ImageIcon} tone="text-md-secondary" className="mb-0">
                  Screenshots &amp; Visual Artifacts
                </SectionTitle>
                {shots.length > 0 && (
                  // A pointer hint; on a phone the thumbnails explain themselves.
                  <span className="hidden sm:inline text-body-sm text-md-on-surface-variant shrink-0">Click any image to zoom</span>
                )}
              </RevealItem>

              {shots.length > 0 ? (
                <motion.div variants={revealContainer(0.05)} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {shots.map((shot, index) => (
                    <motion.figure key={shot.src} variants={revealItem} className="m-0">
                      <button
                        type="button"
                        onClick={() => openImage(index)}
                        aria-label={`Zoom: ${shot.caption}`}
                        className="md-interactive md-shape-morph group block w-full rounded-2xl hover:rounded-[28px] aspect-[9/20] shadow-md-1 hover:shadow-md-3 cursor-zoom-in"
                      >
                        {/* The image clips to the button's live radius, so the
                            corner morph on hover reshapes the picture too. */}
                        <span className="absolute inset-0 overflow-hidden rounded-[inherit] border border-md-outline-variant/60">
                          <img
                            src={thumbFor(shot.src)}
                            alt={`${project.title} — ${shot.caption}`}
                            loading="lazy"
                            decoding="async"
                            width={432}
                            height={960}
                            onError={(e) => {
                              // Fall back to the original PNG if the WebP thumb is missing.
                              const img = e.currentTarget;
                              if (img.src !== shot.src) img.src = shot.src;
                            }}
                            className="block w-full h-full object-cover transition-transform duration-spatial-slow ease-spatial-slow group-hover:scale-[1.04]"
                          />
                          <span className="absolute inset-0 bg-gradient-to-t from-md-surface-dim/95 via-md-surface-dim/20 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-effects ease-effects flex items-end justify-end p-2.5">
                            <span className="p-1.5 rounded-full bg-md-primary text-md-on-primary translate-y-1 group-hover:translate-y-0 transition-transform duration-spatial ease-spatial">
                              <ZoomIn className="w-3.5 h-3.5" aria-hidden="true" />
                            </span>
                          </span>
                        </span>
                        <StateLayer shape="large" />
                      </button>
                      <figcaption className="mt-2 text-label-sm font-normal text-md-on-surface-variant text-center px-1">
                        {shot.caption}
                      </figcaption>
                    </motion.figure>
                  ))}
                </motion.div>
              ) : (
                <RevealItem className="rounded-3xl border border-md-outline-variant/60 bg-md-surface-container-low p-8 text-center">
                  <ImageIcon className="w-10 h-10 mx-auto text-md-outline mb-3 opacity-70" aria-hidden="true" />
                  <p className="text-title-sm text-md-on-surface-variant">No screenshots available to display</p>
                </RevealItem>
              )}
            </Reveal>

            {/* Repository & live demo */}
            <Reveal>
              <RevealItem className="bg-md-surface-container-low rounded-3xl p-5 sm:p-6 border border-md-outline-variant/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-title-md text-md-on-surface mb-1">Project Repository &amp; Delivery</h2>
                  <p className="text-body-md text-md-on-surface-variant max-w-md">
                    {project.isPrivate
                      ? 'This repository is private due to client confidentiality, enterprise credentials, or proprietary intellectual property.'
                      : 'Explore the full source code, commit history, and architectural implementation on GitHub.'}
                  </p>
                </div>

                <div className="shrink-0 flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  {project.isPrivate ? (
                    <div className="w-full sm:w-auto justify-center inline-flex items-center gap-2 h-10 px-5 rounded-full bg-md-surface-container-highest text-md-on-surface-variant text-label-lg">
                      <Lock className="w-4 h-4" aria-hidden="true" />
                      <span>Private Repository</span>
                    </div>
                  ) : project.github ? (
                    <Button
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      icon={Github}
                      className="w-full sm:w-auto"
                    >
                      Source Code
                    </Button>
                  ) : null}

                  {project.demo && (
                    <Button
                      variant="tonal"
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      icon={ExternalLink}
                      className="w-full sm:w-auto"
                    >
                      Live Demo
                    </Button>
                  )}
                </div>
              </RevealItem>
            </Reveal>
          </div>
        </div>
      </motion.div>

      {/* Lightbox / Zoom Overlay */}
      <AnimatePresence>
        {selectedImage && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/85"
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
              transition={spatialWithEffects(motionScheme.standard.spatial.default, motionScheme.standard.effects.fast)}
              className="relative max-w-5xl max-h-[90vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <IconButton
                icon={X}
                variant="tonal"
                onClick={closeLightbox}
                autoFocus
                className="absolute -top-14 right-0"
                aria-label="Close image preview"
              />

              {/* Arrows flank the image rather than sitting on top of it, so
                  nothing covers the screenshot. They are laid out first, which
                  is why the frame gives up the width they need: its height is
                  capped by what is left over once both buttons, the gaps and
                  the overlay's own padding are taken out of the viewport. */}
              <div className="group flex items-center gap-1.5 sm:gap-3 max-w-full">
                {canNavigate && (
                  <IconButton
                    icon={ChevronLeft}
                    variant="tonal"
                    onClick={() => goToImage(-1)}
                    aria-label="Previous screenshot"
                    tabIndex={isSwiping ? -1 : undefined}
                    className={cn(
                      'transition-opacity duration-effects ease-effects',
                      isSwiping
                        ? 'opacity-0 pointer-events-none'
                        : 'opacity-70 hover:opacity-100 focus-visible:opacity-100 group-hover:opacity-100',
                    )}
                  />
                )}

                <div
                  ref={frameRef}
                  className={`relative aspect-[9/20] h-[76vh] overflow-hidden rounded-3xl border border-md-outline-variant/60 shadow-md-3 bg-md-surface-dim ${
                    canNavigate ? 'max-h-[calc((100vw-7.5rem)*20/9)]' : 'max-w-full'
                  }`}
                >
                  {/* The track carries all three panes at once. Dragging moves
                      the track itself, so the neighbour really does come in
                      from the edge under the finger; releasing hands the same
                      offset to the settle animation. */}
                  <motion.div
                    className={`absolute inset-0 ${
                      canNavigate ? 'cursor-grab active:cursor-grabbing' : ''
                    }`}
                    style={{ x: trackX }}
                    drag={canNavigate ? 'x' : false}
                    dragDirectionLock
                    dragConstraints={{ left: -frameWidth, right: frameWidth }}
                    dragElastic={0.12}
                    dragMomentum={false}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    {trackPanes.map(({ shot, slot }) => (
                      <LightboxPane
                        key={slot}
                        shot={shot}
                        slot={slot}
                        ready={loadedSrcs.includes(shot.src)}
                        // A full-resolution PNG that will not load leaves the
                        // thumbnail standing in for it — sharp rather than
                        // blurred, so it reads as the picture instead of a
                        // stalled preview.
                        failed={!loadedSrcs.includes(shot.src) && failedSrcs.includes(shot.src)}
                        onLoaded={markLoaded}
                        onFailed={markFailed}
                      />
                    ))}
                  </motion.div>
                </div>

                {canNavigate && (
                  <IconButton
                    icon={ChevronRight}
                    variant="tonal"
                    onClick={() => goToImage(1)}
                    aria-label="Next screenshot"
                    tabIndex={isSwiping ? -1 : undefined}
                    className={cn(
                      'transition-opacity duration-effects ease-effects',
                      isSwiping
                        ? 'opacity-0 pointer-events-none'
                        : 'opacity-70 hover:opacity-100 focus-visible:opacity-100 group-hover:opacity-100',
                    )}
                  />
                )}
              </div>

              <p
                className="mt-3 text-label-lg text-md-on-surface text-center px-2"
                aria-live="polite"
              >
                {selectedImage.caption}
              </p>

              {canNavigate && selectedIndex !== null && (
                <p className="mt-1 text-label-sm font-normal text-md-on-surface-variant tabular-nums">
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
    </article>
  );
};

export default ProjectCaseStudy;

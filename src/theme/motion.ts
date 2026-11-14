import type { Transition, Variants } from 'framer-motion';

/**
 * MD3 motion tokens for Framer Motion.
 *
 * Material 3 Expressive describes motion as springs rather than as durations
 * and curves, and splits them in two:
 *
 * - **spatial** springs move things (position, size, shape). They may
 *   overshoot a little, which is what makes a moving element feel physical.
 * - **effects** springs change things in place (opacity, colour). They are
 *   critically damped, because a fade that overshoots reads as a flicker.
 *
 * Each comes in fast / default / slow. The stiffness and damping-ratio pairs
 * below are the published tokens from Compose's `MotionScheme`. The "standard"
 * scheme carries the site, and "expressive" is kept for the few elements whose
 * job is to draw the eye: the navigation indicator and selection marks.
 */

/** A spring as MD3 specifies it: stiffness and damping ratio, unit mass. */
interface SpringToken {
  stiffness: number;
  dampingRatio: number;
}

const TOKENS = {
  standard: {
    spatial: {
      fast: { stiffness: 1400, dampingRatio: 0.9 },
      default: { stiffness: 700, dampingRatio: 0.9 },
      slow: { stiffness: 300, dampingRatio: 0.9 },
    },
    effects: {
      fast: { stiffness: 3800, dampingRatio: 1 },
      default: { stiffness: 1600, dampingRatio: 1 },
      slow: { stiffness: 800, dampingRatio: 1 },
    },
  },
  expressive: {
    spatial: {
      fast: { stiffness: 800, dampingRatio: 0.6 },
      default: { stiffness: 380, dampingRatio: 0.8 },
      slow: { stiffness: 200, dampingRatio: 0.8 },
    },
    effects: {
      fast: { stiffness: 3800, dampingRatio: 1 },
      default: { stiffness: 1600, dampingRatio: 1 },
      slow: { stiffness: 800, dampingRatio: 1 },
    },
  },
} as const satisfies Record<string, Record<'spatial' | 'effects', Record<'fast' | 'default' | 'slow', SpringToken>>>;

/**
 * Framer Motion takes an absolute damping coefficient, while the MD3 tokens are
 * damping *ratios*. For a unit mass, c = ζ · 2√k.
 */
/** Narrower than Framer's `Transition`, so it also fits `animate(value, ...)`. */
export interface SpringTransition {
  type: 'spring';
  stiffness: number;
  damping: number;
  mass: number;
}

const toTransition = ({ stiffness, dampingRatio }: SpringToken): SpringTransition => ({
  type: 'spring',
  stiffness,
  damping: dampingRatio * 2 * Math.sqrt(stiffness),
  mass: 1,
});

type Scheme = typeof TOKENS;
type Transitions<T> = { [K in keyof T]: T[K] extends SpringToken ? SpringTransition : Transitions<T[K]> };

const mapTokens = <T extends object>(tree: T): Transitions<T> =>
  Object.fromEntries(
    Object.entries(tree).map(([key, value]) => [
      key,
      'stiffness' in value ? toTransition(value as SpringToken) : mapTokens(value),
    ]),
  ) as Transitions<T>;

export const motionScheme: Transitions<Scheme> = mapTokens(TOKENS);

/**
 * The same springs for CSS transitions, as a `linear()` easing plus the time
 * the spring takes to settle. Sampling the closed-form step response means a
 * hover in CSS and a layout animation in Framer Motion move on identical
 * physics, from one set of tokens. Browsers without `linear()` drop the
 * declaration and fall back to the default easing, which is harmless.
 */
export function cssSpring({ stiffness, dampingRatio }: SpringToken, samples = 32) {
  const omega = Math.sqrt(stiffness);
  const zeta = dampingRatio;
  const decay = zeta * omega;

  const position = (t: number): number => {
    if (zeta >= 1) return 1 - Math.exp(-omega * t) * (1 + omega * t);
    const damped = omega * Math.sqrt(1 - zeta * zeta);
    return 1 - Math.exp(-decay * t) * (Math.cos(damped * t) + (decay / damped) * Math.sin(damped * t));
  };

  // Settled once the envelope is within 0.1% of rest. A critically damped
  // spring carries an extra (1 + ωt) factor, hence the slightly longer tail.
  const settle = Math.log(1000) / decay + (zeta >= 1 ? 2 / omega : 0);
  const points = Array.from({ length: samples + 1 }, (_, i) =>
    i === samples ? '1' : String(Math.round(position((settle * i) / samples) * 1000) / 1000),
  );

  return { easing: `linear(${points.join(', ')})`, duration: `${Math.round(settle * 1000)}ms` };
}

export const springTokens = TOKENS;

const { standard, expressive } = motionScheme;

/** `useSpring` options for the effects spring: settles in place, no overshoot. */
export const EFFECTS_SPRING_OPTIONS = (({ stiffness, dampingRatio }: SpringToken) => ({
  stiffness,
  damping: dampingRatio * 2 * Math.sqrt(stiffness),
  mass: 1,
}))(TOKENS.standard.effects.default);

/** Emphasized easing, for the few transitions that need a fixed duration. */
export const EASE_EMPHASIZED = [0.2, 0, 0, 1] as const;
export const EASE_EMPHASIZED_DECELERATE = [0.05, 0.7, 0.1, 1] as const;
export const EASE_EMPHASIZED_ACCELERATE = [0.3, 0, 0.8, 0.15] as const;

/** Moves on a spatial spring and fades on an effects spring. */
export const spatialWithEffects = (
  spatial: Transition = standard.spatial.default,
  effects: Transition = standard.effects.default,
): Transition => ({ ...spatial, opacity: effects });

/** The site's default enter: a short rise, settled by the slow spatial spring. */
export const ENTER = spatialWithEffects(standard.spatial.slow, standard.effects.slow);

/** The navigation indicator and selection marks. */
export const INDICATOR = expressive.spatial.default;

/**
 * The hover lift every raised card shares: a few pixels on the fast spatial
 * spring. Framer drives it rather than CSS because the reveal animation leaves
 * an inline transform on the same element, which a CSS `translate` would lose to.
 */
export const HOVER_LIFT = { y: -4 } as const;
export const HOVER_LIFT_TRANSITION: Transition = { y: standard.spatial.fast };

/** Grid reflow when filtering. */
export const REFLOW = standard.spatial.default;

/**
 * A reveal container and its items. The container only orchestrates, so the
 * items carry the visual change; nesting a second container restarts the
 * stagger inside it.
 */
export const revealContainer = (stagger = 0.06, delay = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

export const revealItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: ENTER },
};

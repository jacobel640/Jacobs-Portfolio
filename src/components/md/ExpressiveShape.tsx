import { FC } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../../lib/cn';

/**
 * A scalloped MD3 Expressive shape, as a closed SVG path in a 100×100 box.
 *
 * The outline is r(θ) = 1 − depth · (1 − cos(lobes · θ)) / 2, sampled at a
 * fixed number of points and joined with Catmull-Rom curves. Fixing the sample
 * count is what makes two shapes morphable: every path has the same commands
 * in the same order, so the animation can interpolate them number by number.
 */
function scallopPath(lobes: number, depth: number, samples = 96): string {
  const points = Array.from({ length: samples }, (_, i) => {
    const theta = (i / samples) * Math.PI * 2;
    const r = 48 * (1 - (depth * (1 - Math.cos(lobes * theta))) / 2);
    return [50 + r * Math.cos(theta), 50 + r * Math.sin(theta)] as const;
  });

  const at = (i: number) => points[(i + samples) % samples];
  const fmt = (n: number) => n.toFixed(2);

  let d = `M${fmt(at(0)[0])} ${fmt(at(0)[1])}`;
  for (let i = 0; i < samples; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${fmt(c1[0])} ${fmt(c1[1])} ${fmt(c2[0])} ${fmt(c2[1])} ${fmt(p2[0])} ${fmt(p2[1])}`;
  }
  return `${d}Z`;
}

/** Close cousins of the MD3 Expressive shape library's cookie and flower shapes. */
const SHAPES = {
  cookie9: scallopPath(9, 0.1),
  cookie12: scallopPath(12, 0.07),
  flower: scallopPath(8, 0.22),
  soft: scallopPath(4, 0.06),
} as const;

type ShapeName = keyof typeof SHAPES;

interface ExpressiveShapeProps {
  /** The shapes to breathe between, in order. */
  morph: readonly [ShapeName, ShapeName];
  /** Seconds for one full morph there and back. */
  period?: number;
  className?: string;
}

/**
 * A slowly morphing, slowly turning decorative shape.
 *
 * Purely ornamental, so it is hidden from assistive technology, and it holds
 * still for visitors who ask for reduced motion: the stylesheet's reduced-motion
 * rule stops the CSS rotation, and the path morph checks for itself, since
 * Framer's `MotionConfig` covers transforms but not a path's `d`.
 */
export const ExpressiveShape: FC<ExpressiveShapeProps> = ({ morph: [from, to], period = 18, className }) => {
  const reduceMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
      className={cn('pointer-events-none animate-[spin_120s_linear_infinite]', className)}
    >
      <motion.path
        fill="currentColor"
        initial={false}
        d={SHAPES[from]}
        animate={reduceMotion ? undefined : { d: [SHAPES[from], SHAPES[to], SHAPES[from]] }}
        transition={{ duration: period, ease: 'easeInOut', repeat: Infinity }}
      />
    </svg>
  );
};

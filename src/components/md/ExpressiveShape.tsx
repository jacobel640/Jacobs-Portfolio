import { FC } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../../lib/cn';
import { SHAPES } from '../../theme/shapes';

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

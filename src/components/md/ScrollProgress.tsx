import { FC } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { EFFECTS_SPRING_OPTIONS } from '../../theme/motion';

/**
 * An MD3 linear progress indicator tracking how far the page has been read.
 *
 * The raw scroll value is passed through the effects spring so the bar glides
 * instead of stepping with each wheel notch. It is a transform on a single
 * element, so it never triggers layout.
 */
export const ScrollProgress: FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, EFFECTS_SPRING_OPTIONS);

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed top-0 inset-x-0 z-[70] h-[3px] origin-left rounded-r-full bg-md-primary pointer-events-none"
    />
  );
};

import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { FC } from 'react';
import { revealContainer, revealItem } from '../../theme/motion';

type RevealProps = HTMLMotionProps<'div'> & {
  /** Seconds between children. */
  stagger?: number;
  /** Seconds before the first child. */
  delay?: number;
  /** Animate on mount instead of when scrolled into view. */
  immediate?: boolean;
};

/**
 * Orchestrates a staggered entrance for its `RevealItem` children.
 *
 * Only the items animate; this container just sequences them, so a list of
 * chips, a card grid and a section header all share one choreography and one
 * set of spring tokens instead of each component hand-tuning its own delays.
 */
export const Reveal: FC<RevealProps> = ({ stagger = 0.06, delay = 0, immediate = false, ...rest }) => (
  <motion.div
    variants={revealContainer(stagger, delay)}
    initial="hidden"
    {...(immediate
      ? { animate: 'visible' }
      : { whileInView: 'visible', viewport: { once: true, margin: '0px 0px -10% 0px' } })}
    {...rest}
  />
);

/** One step of a `Reveal`: rises and fades in on the MD3 slow spatial spring. */
export const RevealItem: FC<HTMLMotionProps<'div'>> = (props) => <motion.div variants={revealItem} {...props} />;

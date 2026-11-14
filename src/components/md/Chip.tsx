import { FC, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';
import { scrollToSection } from '../../lib/scrollToSection';
import { INDICATOR, motionScheme } from '../../theme/motion';
import { TONE_CLASS } from '../../theme/tone';
import type { Tone } from '../../theme/tone';
import { StateLayer } from './StateLayer';

interface FilterChipProps {
  selected: boolean;
  onSelect: () => void;
  children: ReactNode;
}

/**
 * MD3 filter chip. Selecting it fills it with the secondary container and
 * grows a check mark in from the leading edge. The chip resizes with the mark
 * through a layout animation rather than jumping to its new width, so a row of
 * chips reflows smoothly instead of shoving its neighbours.
 */
export const FilterChip: FC<FilterChipProps> = ({ selected, onSelect, children }) => (
  <motion.button
    layout
    type="button"
    aria-pressed={selected}
    onClick={onSelect}
    transition={{ layout: motionScheme.standard.spatial.fast }}
    className={cn(
      'md-interactive inline-flex items-center h-8 px-4 rounded-lg text-label-lg border',
      'transition-colors duration-effects ease-effects',
      selected
        ? 'bg-md-secondary-container text-md-on-secondary-container border-transparent'
        : 'text-md-on-surface-variant border-md-outline',
    )}
  >
    <StateLayer shape="small" />
    <AnimatePresence initial={false}>
      {selected && (
        <motion.span
          key="check"
          className="inline-flex overflow-hidden"
          initial={{ width: 0, opacity: 0, marginInlineEnd: 0 }}
          animate={{ width: 18, opacity: 1, marginInlineEnd: 8 }}
          exit={{ width: 0, opacity: 0, marginInlineEnd: 0 }}
          transition={INDICATOR}
        >
          <Check className="w-[18px] h-[18px] shrink-0" aria-hidden="true" />
        </motion.span>
      )}
    </AnimatePresence>
    <motion.span layout="position">{children}</motion.span>
  </motion.button>
);

interface AssistChipProps {
  icon: LucideIcon;
  /** The accent role the chip is washed with; its icon badge takes the same role. */
  tone?: Tone;
  /** The section the chip leads to; it scrolls there like a navbar link. */
  sectionId: string;
  /** A card inside that section to spotlight on arrival. */
  spotlightId?: string;
  className?: string;
  children: ReactNode;
}

/**
 * MD3 assist chip: a shortcut to the part of the page it names.
 *
 * A tonal surface with its icon in a soft badge of the same role. Hover
 * deepens the wash and fills the badge, and a trailing arrow says where the
 * chip leads; press ripples in the tone. Colour and opacity only, on the
 * effects spring: nothing moves except the arrow, so a row of these reads as
 * controls rather than decoration.
 *
 * It is a real link to `#sectionId`, so it works before hydration and without
 * script; with script it scrolls smoothly and spotlights the matching card.
 */
export const AssistChip: FC<AssistChipProps> = ({
  icon: Icon,
  tone = 'primary',
  sectionId,
  spotlightId,
  className,
  children,
}) => (
  <a
    href={`#${sectionId}`}
    onClick={(event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (scrollToSection(sectionId, spotlightId)) event.preventDefault();
    }}
    className={cn(
      'md-interactive md-tonal md-shape-morph group/chip inline-flex items-center gap-2.5 h-10 pl-1.5 pr-3 rounded-lg text-label-lg text-md-on-surface border',
      '[--md-tone-rest:8%] [--md-tone-rest-border:30%] [--md-tone-hover:16%]',
      TONE_CLASS[tone],
      className,
    )}
  >
    <StateLayer shape="small" />
    <span
      className="md-shape-morph grid place-items-center w-7 h-7 rounded-md bg-tone-soft text-tone group-hover/chip:bg-tone group-hover/chip:text-on-tone"
      aria-hidden="true"
    >
      <Icon className="w-4 h-4" />
    </span>
    <span>{children}</span>
    <ArrowDown
      className="w-4 h-4 text-tone opacity-60 transition-[transform,opacity] duration-spatial ease-spatial group-hover/chip:opacity-100 group-hover/chip:translate-y-0.5"
      aria-hidden="true"
    />
  </a>
);

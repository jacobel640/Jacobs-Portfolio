import { FC, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';
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
  icon?: LucideIcon;
  /** The accent role the chip is washed with; its icon takes the same role. */
  tone?: Tone;
  className?: string;
  children: ReactNode;
}

/**
 * A static MD3 assist-chip lookalike, for labels that are not actions. It is a
 * tonal surface: a light wash of its role at rest, deeper on hover, with the
 * icon in the role itself, so the colour reads as one unit rather than a
 * coloured glyph on a grey pill.
 */
export const AssistChip: FC<AssistChipProps> = ({ icon: Icon, tone = 'primary', className, children }) => (
  <span
    className={cn(
      'md-tonal md-shape-morph inline-flex items-center gap-2 h-8 px-4 rounded-lg text-label-lg text-md-on-surface border cursor-default',
      '[--md-tone-rest:8%] [--md-tone-rest-border:30%] [--md-tone-hover:16%]',
      TONE_CLASS[tone],
      className,
    )}
  >
    {Icon && <Icon className="w-[18px] h-[18px] shrink-0 text-tone" aria-hidden="true" />}
    <span>{children}</span>
  </span>
);

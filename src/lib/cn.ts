import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * tailwind-merge has to be told about the MD3 type scale. Out of the box it
 * reads `text-label-lg` as a text *colour*, so merging it with `text-md-primary`
 * would silently drop the type style.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'display-lg', 'display-md', 'display-sm',
            'headline-lg', 'headline-md', 'headline-sm',
            'title-lg', 'title-md', 'title-sm',
            'body-lg', 'body-md', 'body-sm',
            'label-lg', 'label-md', 'label-sm',
          ],
        },
      ],
    },
  },
});

/** Joins class names, letting a later Tailwind utility override an earlier one. */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

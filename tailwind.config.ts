import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

import { BRAND_SEED, COLOR_TOKENS, cssVar, themeVars } from './src/theme/color';
import { cssSpring, springTokens } from './src/theme/motion';

/**
 * Every `md-*` colour resolves to its `--md-sys-color-*` custom property, so a
 * subtree that sets those properties (a project's own scheme, for instance)
 * re-themes every utility inside it with no extra classes. `color-mix` keeps
 * Tailwind's opacity modifiers working on top of a variable: `bg-md-primary/15`
 * is the role at 15%, whatever the role currently is.
 */
const mdColors = Object.fromEntries(
  COLOR_TOKENS.map((token) => [
    token,
    `color-mix(in srgb, var(${cssVar(token)}) calc(<alpha-value> * 100%), transparent)`,
  ]),
);

/** CSS easings and durations sampled from the same spring tokens Framer uses. */
const springs = {
  'spatial-fast': cssSpring(springTokens.standard.spatial.fast),
  spatial: cssSpring(springTokens.standard.spatial.default),
  'spatial-slow': cssSpring(springTokens.standard.spatial.slow),
  'expressive-fast': cssSpring(springTokens.expressive.spatial.fast),
  effects: cssSpring(springTokens.standard.effects.default),
};

/** The MD3 type scale: size / line height / tracking, plus weight for titles and labels. */
type TypeStyle = [string, { lineHeight: string; letterSpacing: string; fontWeight?: string }];
const type = (size: number, line: number, tracking: number, weight?: number): TypeStyle => [
  `${size / 16}rem`,
  {
    lineHeight: `${line / 16}rem`,
    letterSpacing: `${tracking / 16}rem`,
    ...(weight ? { fontWeight: String(weight) } : {}),
  },
];

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: { md: mdColors },
      fontFamily: {
        sans: [
          '"Roboto Variable"',
          'Roboto',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        'display-lg': type(57, 64, -0.25),
        'display-md': type(45, 52, 0),
        'display-sm': type(36, 44, 0),
        'headline-lg': type(32, 40, 0),
        'headline-md': type(28, 36, 0),
        'headline-sm': type(24, 32, 0),
        'title-lg': type(22, 28, 0),
        'title-md': type(16, 24, 0.15, 500),
        'title-sm': type(14, 20, 0.1, 500),
        'body-lg': type(16, 24, 0.5),
        'body-md': type(14, 20, 0.25),
        'body-sm': type(12, 16, 0.4),
        'label-lg': type(14, 20, 0.1, 500),
        'label-md': type(12, 16, 0.5, 500),
        'label-sm': type(11, 16, 0.5, 500),
      },
      transitionTimingFunction: {
        emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
        'emphasized-decelerate': 'cubic-bezier(0.05, 0.7, 0.1, 1)',
        'emphasized-accelerate': 'cubic-bezier(0.3, 0, 0.8, 0.15)',
        ...Object.fromEntries(Object.entries(springs).map(([name, s]) => [name, s.easing])),
      },
      transitionDuration: {
        short: '150ms',
        medium: '250ms',
        long: '400ms',
        ...Object.fromEntries(Object.entries(springs).map(([name, s]) => [name, s.duration])),
      },
      // MD3 elevation levels 1-3 (key light + ambient), tuned for a dark surface.
      boxShadow: {
        'md-1': '0 1px 2px 0 rgb(0 0 0 / 0.45), 0 1px 3px 1px rgb(0 0 0 / 0.3)',
        'md-2': '0 1px 2px 0 rgb(0 0 0 / 0.45), 0 2px 6px 2px rgb(0 0 0 / 0.3)',
        'md-3': '0 1px 3px 0 rgb(0 0 0 / 0.45), 0 4px 8px 3px rgb(0 0 0 / 0.3)',
      },
      animation: {
        shimmer: 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [
    // The brand scheme, generated at build time. Components re-theme a subtree
    // by overriding these same properties inline.
    plugin(({ addBase }) => {
      addBase({ ':root': themeVars(BRAND_SEED) });
    }),
  ],
} satisfies Config;

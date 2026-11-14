import {
  argbFromHex,
  Blend,
  hexFromArgb,
  Hct,
  SchemeTonalSpot,
  TonalPalette,
} from '@material/material-color-utilities';
import type { DynamicScheme } from '@material/material-color-utilities';

/**
 * Material You dynamic colour.
 *
 * Every colour on the site is derived from a single seed by Google's own
 * colour library: the seed is projected into HCT, expanded into tonal palettes
 * and resolved into the MD3 colour roles by the Tonal Spot scheme, the default
 * Android uses for wallpaper-based theming. Nothing below is a hand-picked hex
 * value except the seeds themselves.
 *
 * The roles are emitted as `--md-sys-color-*` custom properties. Those are the
 * names `@material/web` reads, so the ripple and focus ring pick the theme up
 * on their own, and the Tailwind `md-*` colours resolve to the same variables
 * (see `tailwind.config.ts`). Re-theming a subtree is therefore one inline
 * `style` object: every token inside it, Tailwind or web component, follows.
 *
 * This module is imported by the Tailwind config at build time and by the
 * project components at runtime, so it must stay free of DOM access.
 */

/** The site's own seed. Its Tonal Spot surfaces land on a neutral, faintly cool
 *  dark grey; the primary is a calm blue. */
export const BRAND_SEED = '#1a73e8';

/** A role name and the `DynamicScheme` getter that resolves it. */
type SchemeRole = readonly [token: string, getter: keyof DynamicScheme];

/** Accent roles: what changes when a component borrows a project's colour. */
const ACCENT_ROLES: readonly SchemeRole[] = [
  ['primary', 'primary'],
  ['on-primary', 'onPrimary'],
  ['primary-container', 'primaryContainer'],
  ['on-primary-container', 'onPrimaryContainer'],
  ['inverse-primary', 'inversePrimary'],
  ['secondary', 'secondary'],
  ['on-secondary', 'onSecondary'],
  ['secondary-container', 'secondaryContainer'],
  ['on-secondary-container', 'onSecondaryContainer'],
  ['tertiary', 'tertiary'],
  ['on-tertiary', 'onTertiary'],
  ['tertiary-container', 'tertiaryContainer'],
  ['on-tertiary-container', 'onTertiaryContainer'],
];

/** Neutral roles: surfaces, text and outlines. */
const NEUTRAL_ROLES: readonly SchemeRole[] = [
  ['surface', 'surface'],
  ['surface-dim', 'surfaceDim'],
  ['surface-bright', 'surfaceBright'],
  ['surface-container-lowest', 'surfaceContainerLowest'],
  ['surface-container-low', 'surfaceContainerLow'],
  ['surface-container', 'surfaceContainer'],
  ['surface-container-high', 'surfaceContainerHigh'],
  ['surface-container-highest', 'surfaceContainerHighest'],
  ['surface-variant', 'surfaceVariant'],
  ['on-surface', 'onSurface'],
  ['on-surface-variant', 'onSurfaceVariant'],
  ['inverse-surface', 'inverseSurface'],
  ['inverse-on-surface', 'inverseOnSurface'],
  ['outline', 'outline'],
  ['outline-variant', 'outlineVariant'],
  ['error', 'error'],
  ['on-error', 'onError'],
  ['error-container', 'errorContainer'],
  ['on-error-container', 'onErrorContainer'],
  ['scrim', 'scrim'],
  ['shadow', 'shadow'],
];

/**
 * MD3 "custom colours": a fixed design colour that is harmonised toward the
 * seed (its hue nudged a little closer) and then given the same four roles a
 * key colour gets. A "live" green is not one of the baseline roles, but it
 * still has to sit in the same tonal system as everything else.
 */
const CUSTOM_COLORS = {
  success: '#1e8e3e',
} as const;

/** Every token name this module can emit, for the Tailwind colour map. */
export const COLOR_TOKENS: readonly string[] = [
  ...ACCENT_ROLES.map(([token]) => token),
  ...NEUTRAL_ROLES.map(([token]) => token),
  ...Object.keys(CUSTOM_COLORS).flatMap((name) => [
    name,
    `on-${name}`,
    `${name}-container`,
    `on-${name}-container`,
  ]),
];

export const cssVar = (token: string): string => `--md-sys-color-${token}`;

export type ThemeVars = Record<`--md-sys-color-${string}`, string>;

export interface ThemeOptions {
  /**
   * `full` re-themes surfaces too, which is what a page that belongs to one
   * project wants. `accent` keeps the site's neutral surfaces and swaps only
   * the colourful roles, so a grid of cards in different colours still reads
   * as one surface.
   */
  scope?: 'full' | 'accent';
  /** -1 (reduced) to 1 (maximum). 0 is the contrast the spec is designed for. */
  contrast?: number;
}

const cache = new Map<string, ThemeVars>();

/**
 * The `--md-sys-color-*` custom properties for a dark Tonal Spot scheme built
 * from `seed`. Pure and memoised, so it is safe to call during render and
 * yields identical markup on the server and the client.
 */
export function themeVars(seed: string, { scope = 'full', contrast = 0 }: ThemeOptions = {}): ThemeVars {
  const key = `${seed}|${scope}|${contrast}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const source = argbFromHex(seed);
  const scheme = new SchemeTonalSpot(Hct.fromInt(source), true, contrast);
  const vars: ThemeVars = {};

  const roles = scope === 'full' ? [...ACCENT_ROLES, ...NEUTRAL_ROLES] : ACCENT_ROLES;
  for (const [token, getter] of roles) {
    vars[cssVar(token) as keyof ThemeVars] = hexFromArgb(scheme[getter] as number);
  }

  // Dark-theme tones for a custom colour, per the MD3 spec.
  for (const [name, hex] of Object.entries(CUSTOM_COLORS)) {
    const palette = TonalPalette.fromInt(Blend.harmonize(argbFromHex(hex), source));
    vars[cssVar(name) as keyof ThemeVars] = hexFromArgb(palette.tone(80));
    vars[cssVar(`on-${name}`) as keyof ThemeVars] = hexFromArgb(palette.tone(20));
    vars[cssVar(`${name}-container`) as keyof ThemeVars] = hexFromArgb(palette.tone(30));
    vars[cssVar(`on-${name}-container`) as keyof ThemeVars] = hexFromArgb(palette.tone(90));
  }

  cache.set(key, vars);
  return vars;
}

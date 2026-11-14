/**
 * The accent role a tonal surface is washed with (see `.md-tonal` in
 * `index.css`). Components pick a tone by name; the class sets `--md-tone`,
 * which the surface, its icon (`text-tone`) and any tonal children inherit.
 */
export type Tone = 'primary' | 'secondary' | 'tertiary';

/** Full class names rather than built strings, so Tailwind's scanner sees them. */
export const TONE_CLASS: Record<Tone, string> = {
  primary: 'tone-primary',
  secondary: 'tone-secondary',
  tertiary: 'tone-tertiary',
};

import type { DetailedHTMLProps, HTMLAttributes } from 'react';

/**
 * JSX typings for the `@material/web` elements the site renders.
 *
 * React 18 passes props to custom elements as attributes, so these are typed
 * as the attributes the elements read rather than as their class properties.
 * Boolean attributes are present-or-absent: pass `''` to set one.
 */
type MaterialElement<Attributes> = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & Attributes;

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'md-ripple': MaterialElement<{ disabled?: '' }>;
      'md-focus-ring': MaterialElement<{ inward?: '' }>;
    }
  }
}

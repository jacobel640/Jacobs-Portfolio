import { useEffect, useRef, FC, CSSProperties, RefObject } from 'react';

/** What `@material/web`'s attachable elements expose for retargeting. */
interface Attachable extends HTMLElement {
  attach(control: HTMLElement): void;
  detach(): void;
}

/** MD3 corner tokens, for the focus ring to follow the control's shape. */
const SHAPE = {
  full: '9999px',
  'extra-large': '28px',
  card: '24px',
  large: '16px',
  medium: '12px',
  small: '8px',
} as const;

export type Shape = keyof typeof SHAPE;

interface StateLayerProps {
  /**
   * The element whose interaction drives the layer. By default that is the
   * parent element; pass a ref to paint the layer on a container while a link
   * inside it is the real control (see the project cards).
   */
  control?: RefObject<HTMLElement>;
  /** Corner shape of the focus ring. The ripple inherits the parent's radius. */
  shape?: Shape;
  /** Draws the focus ring inside the bounds, for parents that clip. */
  inward?: boolean;
}

/**
 * MD3 interaction feedback: `<md-ripple>` for hover and press, `<md-focus-ring>`
 * for keyboard focus, both from `@material/web`.
 *
 * Render it as a child of a `relative` interactive element. The ripple's hover
 * and pressed layers follow the control's text colour (see `index.css`), so the
 * same component is correct on filled, tonal, outlined and text controls.
 *
 * The elements are registered on the client only (`main.tsx`). The prerendered
 * markup carries them as inert tags, which upgrade when the bundle loads.
 */
export const StateLayer: FC<StateLayerProps> = ({ control, shape = 'full', inward = false }) => {
  const rippleRef = useRef<Attachable>(null);
  const focusRingRef = useRef<Attachable>(null);

  useEffect(() => {
    const target = control?.current;
    if (!target) return;
    const layers = [rippleRef.current, focusRingRef.current].filter(
      (layer): layer is Attachable => typeof layer?.attach === 'function',
    );
    layers.forEach((layer) => layer.attach(target));
    return () => layers.forEach((layer) => layer.detach());
  }, [control]);

  const style = { '--md-focus-ring-shape': SHAPE[shape] } as CSSProperties;

  return (
    <>
      <md-ripple ref={rippleRef} aria-hidden="true" />
      <md-focus-ring ref={focusRingRef} aria-hidden="true" style={style} inward={inward ? '' : undefined} />
    </>
  );
};

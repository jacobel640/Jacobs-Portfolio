import { forwardRef } from 'react';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Link } from '../../router';
import type { LinkProps } from '../../router';
import { StateLayer } from './StateLayer';

type Variant = 'filled' | 'tonal' | 'outlined' | 'text';
type Size = 'md' | 'lg';

interface CommonProps {
  variant?: Variant;
  size?: Size;
  /** Leading icon. MD3 tightens the leading padding when there is one. */
  icon?: LucideIcon;
  /** Trailing icon; nudges forward on hover, for "go somewhere" actions. */
  trailingIcon?: LucideIcon;
  className?: string;
  children: ReactNode;
}

/** A `<button>`, an external or in-page `<a href>`, or an in-app route `to`. */
export type ButtonProps = CommonProps &
  (
    | (Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & { href?: never; to?: never })
    | (Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & { href: string; to?: never })
    | (Omit<LinkProps, keyof CommonProps> & { to: string; href?: never })
  );

const VARIANT: Record<Variant, string> = {
  filled: 'bg-md-primary text-md-on-primary hover:shadow-md-1',
  tonal: 'bg-md-secondary-container text-md-on-secondary-container hover:shadow-md-1',
  outlined: 'border border-md-outline text-md-primary',
  text: 'text-md-primary',
};

/**
 * Height, padding and the press shape. MD3 Expressive buttons morph on press:
 * the pill tightens to a rounded rectangle, then springs back on release. The
 * resting radius is half the height rather than `9999px`, because a transition
 * from an effectively infinite radius only becomes visible in its last frame.
 */
const SIZE: Record<Size, { base: string; padding: string; withIcon: string; text: string }> = {
  md: { base: 'h-10 gap-2 rounded-[20px] active:rounded-lg', padding: 'px-6', withIcon: 'pl-4 pr-6', text: 'px-3' },
  lg: { base: 'h-12 gap-2 rounded-[24px] active:rounded-xl', padding: 'px-8', withIcon: 'pl-6 pr-8', text: 'px-4' },
};

const ICON = 'w-[18px] h-[18px] shrink-0';

/** MD3 common button: filled, tonal, outlined or text. */
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ variant = 'filled', size = 'md', icon: Icon, trailingIcon: TrailingIcon, className, children, ...rest }, ref) => {
    const sizing = SIZE[size];
    const classes = cn(
      'md-interactive md-shape-morph group/button inline-flex items-center justify-center whitespace-nowrap text-label-lg select-none',
      sizing.base,
      variant === 'text' ? sizing.text : Icon ? sizing.withIcon : sizing.padding,
      VARIANT[variant],
      className,
    );

    const content = (
      <>
        <StateLayer shape="full" />
        {Icon && <Icon className={ICON} aria-hidden="true" />}
        <span>{children}</span>
        {TrailingIcon && (
          <TrailingIcon
            className={cn(ICON, 'transition-transform duration-spatial ease-spatial group-hover/button:translate-x-0.5')}
            aria-hidden="true"
          />
        )}
      </>
    );

    if ('to' in rest && rest.to !== undefined) {
      return (
        <Link ref={ref as Ref<HTMLAnchorElement>} className={classes} {...(rest as LinkProps)}>
          {content}
        </Link>
      );
    }
    if ('href' in rest && rest.href !== undefined) {
      return (
        <a
          ref={ref as Ref<HTMLAnchorElement>}
          className={classes}
          {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }
    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        type="button"
        className={classes}
        {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  },
);
Button.displayName = 'Button';

type IconButtonProps = {
  icon: LucideIcon;
  /** Required: an icon button has no visible label. */
  'aria-label': string;
  variant?: 'standard' | 'tonal';
  className?: string;
} & (
  | (Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label' | 'className'> & { href?: never })
  | (Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'aria-label' | 'className'> & { href: string })
);

/** MD3 icon button: 40dp target, 20dp glyph, same press morph as `Button`. */
export const IconButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, IconButtonProps>(
  ({ icon: Icon, variant = 'standard', className, ...rest }, ref) => {
    const classes = cn(
      'md-interactive md-shape-morph inline-flex items-center justify-center w-10 h-10 shrink-0 rounded-[20px] active:rounded-xl',
      variant === 'tonal'
        ? 'bg-md-surface-container-highest text-md-on-surface shadow-md-2'
        : 'text-md-on-surface-variant',
      className,
    );
    const content = (
      <>
        <StateLayer shape="full" />
        <Icon className="w-5 h-5" aria-hidden="true" />
      </>
    );

    if ('href' in rest && rest.href !== undefined) {
      return (
        <a ref={ref as Ref<HTMLAnchorElement>} className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
          {content}
        </a>
      );
    }
    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        type="button"
        className={classes}
        {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  },
);
IconButton.displayName = 'IconButton';

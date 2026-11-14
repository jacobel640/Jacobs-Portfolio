import { useState, useEffect, useRef, FC, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Code2, MessageCircle, Github } from 'lucide-react';
import { useRouter, normalisePath } from '../router-core';
import { cn } from '../lib/cn';
import { INDICATOR, motionScheme, spatialWithEffects } from '../theme/motion';
import { Button, IconButton } from './md/Button';
import { Reveal, RevealItem } from './md/Reveal';
import { StateLayer } from './md/StateLayer';

interface NavItem {
  name: string;
  href: string;
}

const GITHUB_URL = 'https://github.com/jacobel640';

const navItems: NavItem[] = [
  { name: 'About', href: '#hero' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

export const Navbar: FC = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // While a nav click is gliding to its section, the scroll spy would report
  // every section it passes and the indicator would animate through each one.
  // Hold it on the destination until the scroll settles.
  const glidingToRef = useRef<string | null>(null);

  // The sections the nav points at live on the home page. From a case study
  // they are not in the document at all, so the links have to lead home rather
  // than at an anchor that resolves to nothing.
  const { path, navigate } = useRouter();
  const onHome = normalisePath(path) === '/';
  const hrefFor = (hash: string) => (onHome ? hash : `/${hash}`);

  useEffect(() => {
    const sections = navItems.map((item) => item.href.slice(1));
    let frame = 0;

    const measure = () => {
      frame = 0;
      setIsScrolled(window.scrollY > 20);

      if (glidingToRef.current) return;

      const scrollPosition = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (!el) continue;
        const { top, height } = el.getBoundingClientRect();
        const absoluteTop = top + window.scrollY;
        if (scrollPosition >= absoluteTop && scrollPosition < absoluteTop + height) {
          setActiveSection(section);
          break;
        }
      }
    };

    // Coalesce scroll events into one measurement per animation frame.
    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    measure();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  // Release the spy once scrolling has been quiet for a moment, with a ceiling
  // in case the scroll never starts (already at the destination).
  const releaseWhenSettled = () => {
    let quiet: ReturnType<typeof setTimeout>;
    const done = () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(ceiling);
      glidingToRef.current = null;
    };
    const onScroll = () => {
      clearTimeout(quiet);
      quiet = setTimeout(done, 140);
    };
    const ceiling = setTimeout(done, 2000);
    quiet = setTimeout(done, 400);
    window.addEventListener('scroll', onScroll, { passive: true });
  };

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      glidingToRef.current = targetId;
      setActiveSection(targetId);
      releaseWhenSettled();
      element.scrollIntoView({ behavior: 'smooth' });
      // Reflect the section in the URL so it can be copied and shared, without
      // adding a history entry for every click.
      window.history.replaceState(null, '', href);
    } else if (!onHome) {
      // Off the home page the section does not exist here at all. Navigating
      // with the hash hands off to `useHashScroll`, which waits for the
      // section's chunk to mount before aiming at it.
      navigate(`/${href}`);
    } else {
      // The lazy chunk for this section has not mounted yet; setting the hash
      // hands off to the hashchange listener, which waits for it to appear.
      window.location.hash = href;
    }
  };

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  /** A nav destination's anchor props: real href, in-page glide on click. */
  const destination = (href: string) => ({
    href: hrefFor(href),
    onClick: (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      handleNavClick(href);
    },
  });

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 sm:pt-6 pointer-events-none">
      {/* MD3 elevated top app bar, floating: a tonal surface container lifted by
          an elevation shadow rather than by blur. On scroll it steps up one
          surface tone and two elevation levels, the MD3 "scrolled" state. */}
      <nav
        aria-label="Main Navigation"
        className={cn(
          'pointer-events-auto flex items-center justify-between w-full max-w-5xl px-2 sm:px-3 py-2 rounded-full border border-md-outline-variant/60',
          'transition-[background-color,box-shadow] duration-effects ease-effects',
          isScrolled ? 'bg-md-surface-container-high/95 shadow-md-3' : 'bg-md-surface-container/90 shadow-md-1',
        )}
      >
        {/* Brand monogram. The badge morphs from a circle to a rounded square
            on hover: MD3 Expressive's shape change as the hover signal. */}
        <a
          {...destination('#hero')}
          className="md-interactive group flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full text-md-on-surface"
        >
          <StateLayer />
          <span className="md-shape-morph flex items-center justify-center w-9 h-9 rounded-[18px] group-hover:rounded-xl bg-md-primary-container text-md-on-primary-container">
            <Code2 className="w-4 h-4" aria-hidden="true" />
          </span>
          <span className="text-title-md sm:text-title-lg tracking-tight">
            Jacob<span className="text-md-primary font-normal">.dev</span>
          </span>
        </a>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.slice(1);
            return (
              <a
                key={item.name}
                {...destination(item.href)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'md-interactive px-4 py-2 text-label-lg rounded-full transition-colors duration-effects ease-effects',
                  isActive ? 'text-md-on-secondary-container' : 'text-md-on-surface-variant hover:text-md-on-surface',
                )}
              >
                {/* MD3 active indicator, carried between destinations on the
                    expressive spatial spring: a slight overshoot that settles. */}
                {isActive && (
                  <motion.span
                    layoutId="activeNavbarIndicator"
                    className="absolute inset-0 bg-md-secondary-container rounded-full"
                    transition={INDICATOR}
                  />
                )}
                <StateLayer />
                <span className="relative">{item.name}</span>
              </a>
            );
          })}
        </div>

        {/* Desktop quick actions */}
        <div className="hidden md:flex items-center gap-1.5">
          <IconButton
            icon={Github}
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
          />
          <Button icon={MessageCircle} {...destination('#contact')}>
            Let&apos;s Talk
          </Button>
        </div>

        {/* Mobile menu toggle: the glyph turns into the close mark. */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="md-interactive md-shape-morph inline-flex items-center justify-center w-10 h-10 rounded-[20px] active:rounded-xl text-md-on-surface-variant"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            <StateLayer />
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={mobileMenuOpen ? 'close' : 'menu'}
                className="inline-flex"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={spatialWithEffects(motionScheme.standard.spatial.fast, motionScheme.standard.effects.fast)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* Mobile navigation drawer: grows from the bar, its items following in sequence. */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={spatialWithEffects(motionScheme.standard.spatial.default, motionScheme.standard.effects.fast)}
            style={{ transformOrigin: 'top center' }}
            className="pointer-events-auto absolute top-20 left-4 right-4 max-w-lg mx-auto bg-md-surface-container-high border border-md-outline-variant/60 rounded-[28px] p-3 shadow-md-3 z-50"
          >
            <Reveal immediate stagger={0.04} className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.slice(1);
                return (
                  <RevealItem key={item.name}>
                    <a
                      {...destination(item.href)}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'md-interactive flex items-center px-5 h-14 rounded-full text-label-lg transition-colors duration-effects ease-effects',
                        isActive
                          ? 'bg-md-secondary-container text-md-on-secondary-container'
                          : 'text-md-on-surface-variant',
                      )}
                    >
                      <StateLayer />
                      <span>{item.name}</span>
                    </a>
                  </RevealItem>
                );
              })}
              <RevealItem className="pt-3 mt-2 border-t border-md-outline-variant/60 grid grid-cols-2 gap-3">
                <Button variant="outlined" icon={Github} href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                  GitHub
                </Button>
                <Button icon={MessageCircle} {...destination('#contact')}>
                  Contact
                </Button>
              </RevealItem>
            </Reveal>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;

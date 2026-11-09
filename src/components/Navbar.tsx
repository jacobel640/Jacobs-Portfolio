import { useState, useEffect, useRef, FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Code2, MessageCircle, Github } from 'lucide-react';
import { useRouter, normalisePath } from '../router-core';

interface NavItem {
  name: string;
  href: string;
}

const GITHUB_URL = 'https://github.com/jacobel640';

/** MD3 emphasized easing, for Framer Motion. */
const EMPHASIZED = [0.2, 0, 0, 1] as const;

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 sm:pt-6 pointer-events-none">
      {/* MD3 elevated top app bar, floating: a tonal surface container lifted by
          an elevation shadow rather than by blur. */}
      <nav
        aria-label="Main Navigation"
        className={`pointer-events-auto flex items-center justify-between w-full max-w-5xl px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border border-md-outline-variant transition-[background-color,box-shadow] duration-medium ease-emphasized ${
          isScrolled
            ? 'bg-md-surface-container-high/95 shadow-md-3'
            : 'bg-md-surface-container/90 shadow-md-1'
        }`}
      >
        {/* Brand Monogram */}
        <a
          href={hrefFor('#hero')}
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#hero');
          }}
          className="state-layer md-focus group flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full text-md-on-surface"
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-md-primary-container text-md-on-primary-container">
            <Code2 className="w-4 h-4" />
          </div>
          <span className="text-base sm:text-lg font-medium tracking-tight">
            Jacob<span className="text-md-primary font-normal">.dev</span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const sectionId = item.href.replace('#', '');
            const isActive = activeSection === sectionId;
            return (
              <a
                key={item.name}
                href={hrefFor(item.href)}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`state-layer md-focus relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-medium ease-emphasized ${
                  isActive ? 'text-md-on-secondary-container' : 'text-md-on-surface-variant'
                }`}
              >
                {/* MD3 active pill indicator, slid between destinations. */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavbarIndicator"
                    className="absolute inset-0 bg-md-secondary-container rounded-full"
                    transition={{ duration: 0.35, ease: EMPHASIZED }}
                  />
                )}
                <span className="relative z-10">{item.name}</span>
              </a>
            );
          })}
        </div>

        {/* Desktop Quick Actions */}
        <div className="hidden md:flex items-center gap-2">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="state-layer md-focus p-2.5 text-md-on-surface-variant rounded-full"
            aria-label="GitHub Profile"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href={hrefFor('#contact')}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#contact');
            }}
            className="state-layer md-focus inline-flex items-center gap-2 pl-4 pr-5 py-2.5 text-sm font-medium rounded-full bg-md-primary text-md-on-primary transition-shadow duration-medium ease-emphasized hover:shadow-md-1"
          >
            <MessageCircle className="w-[18px] h-[18px]" />
            <span>Let's Talk</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="state-layer md-focus p-2.5 rounded-full text-md-on-surface-variant"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.25, ease: EMPHASIZED }}
            className="pointer-events-auto absolute top-20 left-4 right-4 max-w-lg mx-auto bg-md-surface-container-high border border-md-outline-variant rounded-3xl p-3 shadow-md-3 z-50"
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const sectionId = item.href.replace('#', '');
                const isActive = activeSection === sectionId;
                return (
                  <a
                    key={item.name}
                    href={hrefFor(item.href)}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    aria-current={isActive ? 'page' : undefined}
                    className={`state-layer md-focus flex items-center px-5 h-14 rounded-full text-sm font-medium transition-colors duration-medium ease-emphasized ${
                      isActive
                        ? 'bg-md-secondary-container text-md-on-secondary-container'
                        : 'text-md-on-surface-variant'
                    }`}
                  >
                    <span>{item.name}</span>
                  </a>
                );
              })}
              <div className="pt-3 mt-2 border-t border-md-outline-variant flex items-center justify-between gap-3">
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="state-layer md-focus flex items-center gap-2 px-4 py-2.5 rounded-full border border-md-outline text-md-primary text-sm font-medium w-1/2 justify-center"
                >
                  <Github className="w-[18px] h-[18px]" />
                  <span>GitHub</span>
                </a>
                <a
                  href={hrefFor('#contact')}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('#contact');
                  }}
                  className="state-layer md-focus flex items-center gap-2 px-4 py-2.5 rounded-full bg-md-primary text-md-on-primary text-sm font-medium w-1/2 justify-center"
                >
                  <MessageCircle className="w-[18px] h-[18px]" />
                  <span>Contact</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;

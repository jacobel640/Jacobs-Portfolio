import { useState, useEffect, FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Code2, Sparkles, ArrowRight, Github } from 'lucide-react';

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

  useEffect(() => {
    const sections = navItems.map((item) => item.href.slice(1));
    let frame = 0;

    const measure = () => {
      frame = 0;
      setIsScrolled(window.scrollY > 20);

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

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // Reflect the section in the URL so it can be copied and shared, without
      // adding a history entry for every click.
      window.history.replaceState(null, '', href);
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
      <nav
        aria-label="Main Navigation"
        className={`pointer-events-auto flex items-center justify-between w-full max-w-5xl px-4 sm:px-6 py-2.5 sm:py-3 rounded-full transition-all duration-300 ${
          isScrolled
            ? 'bg-slate-900/75 backdrop-blur-xl border border-white/[0.12] shadow-2xl shadow-black/50'
            : 'bg-slate-900/50 backdrop-blur-lg border border-white/[0.08] shadow-lg shadow-black/20'
        }`}
      >
        {/* Brand Monogram */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#hero');
          }}
          className="group flex items-center gap-2.5 text-white font-bold tracking-tight rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <span className="text-base sm:text-lg font-semibold tracking-tight text-white group-hover:text-blue-400 transition-colors">
            Jacob<span className="text-blue-400 font-normal">.dev</span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 bg-slate-950/40 p-1 rounded-full border border-white/[0.06]">
          {navItems.map((item) => {
            const sectionId = item.href.replace('#', '');
            const isActive = activeSection === sectionId;
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`relative px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavbarIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-indigo-600/80 rounded-full shadow-md shadow-blue-500/20 border border-blue-400/30"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.name}</span>
              </a>
            );
          })}
        </div>

        {/* Desktop Quick Actions */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-slate-400 hover:text-white rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] transition-all"
            aria-label="GitHub Profile"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#contact');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/25 transition-all hover:scale-105"
          >
            <span>Let's Talk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-800/60 border border-white/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto absolute top-20 left-4 right-4 max-w-lg mx-auto bg-slate-900/90 backdrop-blur-2xl border border-white/[0.12] rounded-2xl p-5 shadow-2xl shadow-black/80 z-50"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const sectionId = item.href.replace('#', '');
                const isActive = activeSection === sectionId;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span>{item.name}</span>
                    {isActive && <Sparkles className="w-4 h-4 text-blue-400" />}
                  </a>
                );
              })}
              <div className="pt-3 mt-1 border-t border-slate-800 flex items-center justify-between gap-3">
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 text-slate-300 text-xs font-medium border border-slate-700 w-1/2 justify-center"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('#contact');
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-medium w-1/2 justify-center shadow-lg shadow-blue-500/20"
                >
                  <span>Contact</span>
                  <ArrowRight className="w-3.5 h-3.5" />
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

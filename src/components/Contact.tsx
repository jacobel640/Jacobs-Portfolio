import { useState, useEffect, useRef, FC, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, Github, Mail, ArrowUpRight, Heart, Copy, Check, ArrowUp } from 'lucide-react';
import { cn } from '../lib/cn';
import { motionScheme, revealContainer, revealItem, spatialWithEffects } from '../theme/motion';
import { Button } from './md/Button';
import { ExpressiveShape } from './md/ExpressiveShape';
import { Reveal, RevealItem } from './md/Reveal';
import { StateLayer } from './md/StateLayer';

const EMAIL = 'Jacobel640@gmail.com';
const GITHUB_USER = 'jacobel640';

const COPY_STATES = {
  idle: { icon: Copy, text: 'Copy' },
  copied: { icon: Check, text: 'Copied!' },
  failed: { icon: Copy, text: 'Select to copy' },
} as const;

export const Contact: FC = () => {
  const currentYear = new Date().getFullYear();
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');

  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const handleCopyEmail = async (e: MouseEvent) => {
    e.preventDefault();
    try {
      // clipboard.writeText is only available in a secure context; fall back to
      // a hidden textarea so the button never silently lies about copying.
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(EMAIL);
      } else {
        const field = document.createElement('textarea');
        field.value = EMAIL;
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.appendChild(field);
        field.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(field);
        if (!ok) throw new Error('copy command rejected');
      }
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => setCopyState('idle'), 2500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/jacob-elcharar-b9ba3a3a1/',
      icon: Linkedin,
      label: 'in/jacob-elcharar',
      actionText: 'Connect',
      iconTone: 'bg-md-primary-container text-md-on-primary-container',
    },
    {
      name: 'GitHub',
      url: `https://github.com/${GITHUB_USER}`,
      icon: Github,
      label: `github.com/${GITHUB_USER}`,
      actionText: 'Follow',
      iconTone: 'bg-md-tertiary-container text-md-on-tertiary-container',
    },
    {
      name: 'Email',
      url: `mailto:${EMAIL}`,
      icon: Mail,
      label: EMAIL,
      actionText: 'Send Email',
      iconTone: 'bg-md-secondary-container text-md-on-secondary-container',
    },
  ];

  const { icon: CopyIcon, text: copyText } = COPY_STATES[copyState];

  return (
    <footer id="contact" className="relative bg-md-surface-container-lowest text-md-on-surface overflow-hidden pt-24 pb-12 border-t border-md-outline-variant/60">
      {/* The footer's one ornament: the hero's shape language, quieter. */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[min(120vw,900px)] text-md-primary-container/15">
        <ExpressiveShape morph={['cookie12', 'cookie9']} period={26} />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal stagger={0.08} className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          {/* Status badge */}
          <RevealItem className="inline-flex items-center gap-2.5 h-8 px-4 rounded-full text-label-md uppercase tracking-wider bg-md-surface-container-high text-md-on-surface-variant border border-md-outline-variant/60 mb-6">
            <span className="w-2 h-2 rounded-full bg-md-success animate-pulse" aria-hidden="true" />
            <span>Open to Opportunities</span>
          </RevealItem>

          <RevealItem>
            <h2 className="text-headline-lg sm:text-display-sm lg:text-display-md text-md-on-surface mb-6 text-balance">
              Let&apos;s Build Something Exceptional
            </h2>
          </RevealItem>

          <RevealItem>
            <p className="text-body-lg sm:text-lg text-md-on-surface-variant mb-10 max-w-xl text-pretty">
              Have a project in mind, an opportunity to discuss, or looking for a specialized Android engineer / fullstack developer? Let&apos;s connect.
            </p>
          </RevealItem>

          {/* Contact cards */}
          <RevealItem className="w-full max-w-3xl mb-8">
            <motion.ul variants={revealContainer(0.08)} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                const external = item.url.startsWith('http');
                return (
                  <motion.li key={item.name} variants={revealItem} whileHover={{ y: -3 }} transition={{ y: motionScheme.standard.spatial.fast }}>
                    <a
                      href={item.url}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                      className="md-interactive md-shape-morph group flex h-full flex-col justify-between p-5 rounded-3xl bg-md-surface-container-low border border-md-outline-variant/60 text-md-on-surface hover:shadow-md-2"
                    >
                      <StateLayer shape="card" />
                      <div className="flex items-center justify-between mb-4">
                        <div className={`md-shape-morph p-2.5 rounded-2xl group-hover:rounded-[22px] ${item.iconTone}`}>
                          <Icon className="w-5 h-5" aria-hidden="true" />
                        </div>
                        <ArrowUpRight
                          className="w-4 h-4 text-md-on-surface-variant transition-transform duration-spatial ease-spatial group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          aria-hidden="true"
                        />
                      </div>

                      <div className="text-left">
                        <div className="text-title-sm text-md-on-surface mb-0.5">{item.name}</div>
                        <div className="text-body-sm text-md-on-surface-variant truncate">{item.label}</div>
                      </div>
                    </a>
                  </motion.li>
                );
              })}
            </motion.ul>
          </RevealItem>

          {/* Copy email: an outlined field with a filled action. The action
              resizes to its new label on a spatial spring and swaps the label
              itself with a short vertical slide. */}
          <RevealItem className="flex flex-wrap items-center justify-center gap-3 border border-md-outline rounded-full pl-5 pr-2 py-2 bg-md-surface-container-lowest">
            <Mail className="w-4 h-4 text-md-on-surface-variant" aria-hidden="true" />
            <span className="text-body-md text-md-on-surface font-mono">{EMAIL}</span>
            <motion.button
              layout
              transition={{ layout: motionScheme.standard.spatial.fast }}
              onClick={handleCopyEmail}
              type="button"
              aria-live="polite"
              aria-label="Copy email address"
              className={cn(
                'md-interactive md-shape-morph inline-flex items-center h-10 px-5 rounded-[20px] active:rounded-lg text-label-lg overflow-hidden',
                copyState === 'copied'
                  ? 'bg-md-success-container text-md-on-success-container'
                  : copyState === 'failed'
                    ? 'bg-md-error-container text-md-on-error-container'
                    : 'bg-md-primary text-md-on-primary',
              )}
            >
              <StateLayer />
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={copyState}
                  layout="position"
                  className="inline-flex items-center gap-2"
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={spatialWithEffects(motionScheme.standard.spatial.fast, motionScheme.standard.effects.fast)}
                >
                  <CopyIcon className="w-4 h-4" aria-hidden="true" />
                  <span>{copyText}</span>
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </RevealItem>
        </Reveal>

        {/* Bottom bar */}
        <div className="pt-8 mt-12 border-t border-md-outline-variant/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-body-sm text-md-on-surface-variant">
          <p>© {currentYear} Jacob Elcharar. All rights reserved.</p>

          <p className="flex items-center gap-1.5">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-md-error fill-md-error inline" aria-label="love" />
            <span>using React, Tailwind CSS, Material Web &amp; Framer Motion</span>
          </p>

          <Button variant="text" onClick={scrollToTop} icon={ArrowUp}>
            Back to top
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Contact;

import { useState, useEffect, useRef, FC } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Github, Mail, ArrowUpRight, Heart, Copy, Check, ArrowUp } from 'lucide-react';

const EMAIL = 'Jacobel640@gmail.com';
const GITHUB_USER = 'jacobel640';

export const Contact: FC = () => {
  const currentYear = new Date().getFullYear();
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');

  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const handleCopyEmail = async (e: React.MouseEvent) => {
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

  return (
    <footer id="contact" className="relative bg-md-surface-container-lowest text-md-on-surface overflow-hidden pt-24 pb-12 border-t border-md-outline-variant">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
          className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16"
        >
          {/* Status badge: an MD3 assist chip */}
          <div className="inline-flex items-center gap-2.5 h-8 px-4 rounded-full text-xs font-medium uppercase tracking-wider bg-md-surface-container-high text-md-on-surface-variant border border-md-outline-variant mb-6">
            <span className="w-2 h-2 rounded-full bg-md-success animate-pulse" />
            <span>Open to Opportunities</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-md-on-surface mb-6">
            Let's Build Something Exceptional
          </h2>

          <p className="text-base sm:text-lg text-md-on-surface-variant mb-10 max-w-xl leading-relaxed">
            Have a project in mind, an opportunity to discuss, or looking for a specialized Android engineer / fullstack developer? Let's connect.
          </p>

          {/* Contact cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mb-8">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.url}
                  target={item.url.startsWith('http') ? '_blank' : undefined}
                  rel={item.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="state-layer md-focus group relative flex flex-col justify-between p-5 rounded-3xl bg-md-surface-container-low border border-md-outline-variant text-md-on-surface transition-shadow duration-medium ease-emphasized hover:shadow-md-1"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2.5 rounded-2xl ${item.iconTone}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-md-on-surface-variant group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-medium ease-emphasized" />
                  </div>

                  <div className="text-left">
                    <div className="text-sm font-medium text-md-on-surface mb-0.5">{item.name}</div>
                    <div className="text-xs text-md-on-surface-variant truncate">{item.label}</div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Quick copy email action: an outlined field with a filled button */}
          <div className="flex flex-wrap items-center justify-center gap-3 border border-md-outline rounded-full pl-5 pr-2 py-2 bg-md-surface-container-lowest">
            <Mail className="w-4 h-4 text-md-on-surface-variant" />
            <span className="text-xs sm:text-sm text-md-on-surface font-mono">{EMAIL}</span>
            <button
              onClick={handleCopyEmail}
              type="button"
              aria-live="polite"
              aria-label="Copy email address"
              className={`state-layer md-focus inline-flex items-center gap-2 h-10 px-5 rounded-full text-sm font-medium transition-colors duration-medium ease-emphasized ${
                copyState === 'copied'
                  ? 'bg-md-success/20 text-md-success'
                  : copyState === 'failed'
                    ? 'bg-md-error/20 text-md-error'
                    : 'bg-md-primary text-md-on-primary'
              }`}
            >
              {copyState === 'copied' && (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              )}
              {copyState === 'failed' && (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Select to copy</span>
                </>
              )}
              {copyState === 'idle' && (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Bottom Footer Divider & Bar */}
        <div className="pt-8 mt-12 border-t border-md-outline-variant flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-md-on-surface-variant">
          <p>© {currentYear} Jacob Elcharar. All rights reserved.</p>

          <p className="flex items-center gap-1.5">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-md-error fill-md-error inline" />
            <span>using React, Tailwind CSS &amp; Framer Motion</span>
          </p>

          <button
            onClick={scrollToTop}
            type="button"
            className="state-layer md-focus inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-md-primary font-medium"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Contact;

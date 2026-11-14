import { FC, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { ArrowDown, ArrowRight, Mail, Smartphone, Server, Cpu } from 'lucide-react';
import { cn } from '../lib/cn';
import { motionScheme, revealContainer, revealItem } from '../theme/motion';
import { Button } from './md/Button';
import { AssistChip } from './md/Chip';
import { ExpressiveShape } from './md/ExpressiveShape';

/** Each word rises out of its own clipped line box, one after the other. */
const wordVariants: Variants = {
  hidden: { y: '110%' },
  visible: { y: 0, transition: motionScheme.standard.spatial.slow },
};

/**
 * Splits a phrase into individually animated words. The words stay plain text
 * in the heading, separated by real spaces, so what a crawler or a screen
 * reader gets is exactly the sentence.
 */
const RevealWords: FC<{ text: string; className?: string }> = ({ text, className }) => (
  <>
    {text.split(' ').map((word, index) => (
      <span key={`${word}-${index}`}>
        {index > 0 && ' '}
        {/* The padding gives descenders room inside the clip; the negative
            margin takes it back out of the line box. */}
        <span className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
          <motion.span variants={wordVariants} className={cn('inline-block', className)}>
            {word}
          </motion.span>
        </span>
      </span>
    ))}
  </>
);

const DOMAINS = [
  { icon: Smartphone, label: 'Native Android (Kotlin & Compose)', tone: 'text-md-primary' },
  { icon: Server, label: 'Spring Boot & Cloud Microservices', tone: 'text-md-secondary' },
  { icon: Cpu, label: 'AI Agents & Modern Tooling', tone: 'text-md-tertiary' },
] as const;

export const Hero: FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  // The decorative shapes drift at a different rate from the page as the hero
  // scrolls away: depth from parallax, at the cost of one transform.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const nearY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 180]);
  const farY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 90]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 overflow-hidden pt-28 pb-16"
    >
      {/* MD3 Expressive shapes as the hero's only ornament: tonal, slow, and
          well away from the copy. */}
      <motion.div style={{ y: nearY }} className="absolute -top-[18%] -right-[22%] sm:-right-[12%] w-[min(90vw,760px)] text-md-primary-container/35">
        <ExpressiveShape morph={['cookie9', 'cookie12']} period={20} />
      </motion.div>
      <motion.div style={{ y: farY }} className="absolute -bottom-[14%] -left-[24%] sm:-left-[10%] w-[min(60vw,440px)] text-md-tertiary-container/25">
        <ExpressiveShape morph={['flower', 'soft']} period={24} />
      </motion.div>

      <motion.div
        variants={revealContainer(0.09, 0.05)}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center"
      >
        {/* Availability: an assist chip with a live indicator dot */}
        <motion.div variants={revealItem} className="mb-7">
          <span className="inline-flex items-center gap-2.5 h-9 px-4 rounded-full text-label-lg bg-md-surface-container-high/80 text-md-on-surface-variant border border-md-outline-variant/60">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-md-success opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-md-success" />
            </span>
            Available for new opportunities
          </span>
        </motion.div>

        {/* Display headline, word by word */}
        <motion.h1
          variants={revealContainer(0.07)}
          className="text-display-sm sm:text-display-md lg:text-display-lg text-md-on-surface mb-6 text-balance"
        >
          <RevealWords text="Hi, I'm" /> <RevealWords text="Jacob Elcharar" className="text-md-primary" />
        </motion.h1>

        {/* Roles */}
        <motion.h2
          variants={revealItem}
          className="text-headline-sm sm:text-headline-md text-md-on-surface mb-6 flex items-center justify-center gap-x-3 gap-y-1 flex-wrap"
        >
          <span>Android Software Engineer</span>
          <span className="text-md-tertiary hidden sm:inline" aria-hidden="true">
            •
          </span>
          <span className="text-md-on-surface-variant">Fullstack Developer</span>
        </motion.h2>

        {/* Pitch */}
        <motion.p
          variants={revealItem}
          className="max-w-2xl text-body-lg sm:text-lg text-md-on-surface-variant mb-9 text-pretty"
        >
          Over 3 years of experience building native applications end-to-end. Specialized in modern Android engineering with Kotlin, Jetpack Compose, Clean Architecture, and MVVM, complemented by scalable Spring Boot backend solutions and AI-driven workflows.
        </motion.p>

        {/* Domains */}
        <motion.ul
          variants={revealContainer(0.05)}
          className="flex flex-wrap justify-center gap-2.5 mb-10"
          aria-label="Focus areas"
        >
          {DOMAINS.map(({ icon, label, tone }) => (
            <motion.li key={label} variants={revealItem}>
              <AssistChip icon={icon} iconClassName={tone} className="h-10">
                {label}
              </AssistChip>
            </motion.li>
          ))}
        </motion.ul>

        {/* Calls to action: filled + outlined */}
        <motion.div
          variants={revealItem}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto mb-16"
        >
          <Button size="lg" href="#projects" trailingIcon={ArrowRight}>
            Explore Projects
          </Button>
          <Button size="lg" variant="outlined" href="#contact" icon={Mail}>
            Get In Touch
          </Button>
        </motion.div>

        {/* Scroll cue. The reveal and the bobbing loop live on separate
            elements: an explicit `animate` object on a variant child overrides
            the inherited variant, which would leave it stuck at opacity 0. */}
        <motion.div variants={revealItem}>
          <motion.a
            href="#skills"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="md-interactive inline-flex flex-col items-center gap-1.5 px-3 py-1 text-md-on-surface-variant hover:text-md-primary transition-colors duration-effects ease-effects rounded-full focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-md-secondary"
            aria-label="Scroll to Skills"
          >
            <span className="tracking-widest uppercase text-label-sm">Explore Skills</span>
            <ArrowDown className="w-4 h-4" aria-hidden="true" />
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

import { FC } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Server, Check, Sparkles, Layers, Cpu } from 'lucide-react';
import { cn } from '../lib/cn';
import { HOVER_LIFT, HOVER_LIFT_TRANSITION, revealContainer, revealItem } from '../theme/motion';
import { TONE_CLASS } from '../theme/tone';
import type { Tone } from '../theme/tone';
import { Reveal, RevealItem } from './md/Reveal';
import { SectionHeader } from './md/SectionHeader';

interface SkillCategory {
  title: string;
  subtitle: string;
  icon: typeof Smartphone;
  /** The accent role the card is washed with on hover, and its marks take. */
  tone: Tone;
  /** Tonal container + on-colour pair for the icon tile. */
  iconTone: string;
  /** Colour of the bullet in the impact list. */
  dotTone: string;
  skills: string[];
  description: string;
  highlights: string[];
}

const skillCategories: SkillCategory[] = [
  {
    title: 'Android Development',
    subtitle: 'Native Mobile Engineering',
    icon: Smartphone,
    tone: 'primary',
    iconTone: 'bg-md-primary-container text-md-on-primary-container',
    dotTone: 'bg-md-primary',
    skills: [
      'Kotlin & Java',
      'Jetpack Compose',
      'Clean Architecture & MVVM',
      'Hilt / Dagger (DI)',
      'Room Database & SQL',
      'Coroutines & StateFlow',
      'WorkManager & Services',
      'Material Design 3',
    ],
    description:
      'Architecting responsive, offline-first native Android applications with modular layers, reactive data streams, and declarative UI.',
    highlights: ['Production Play Store Deployments', 'Custom Touch & Gesture Handling', 'Scoped Storage & Media APIs'],
  },
  {
    title: 'Backend & Cloud Systems',
    subtitle: 'Scalable Services & Microservices',
    icon: Server,
    tone: 'secondary',
    iconTone: 'bg-md-secondary-container text-md-on-secondary-container',
    dotTone: 'bg-md-secondary',
    skills: [
      'Java & Spring Boot',
      'PostgreSQL & SQL',
      'Node.js & Express',
      'Next.js & React',
      'TypeScript & REST APIs',
      'Docker & Containerization',
      'GraphQL & BFF Layers',
      'Webhooks & Meta WABA',
    ],
    description:
      'Designing robust backend services, secure transactional APIs, microservices, and modern full-stack web platforms.',
    highlights: ['Enterprise Messaging Integration', 'Normalized Schema Optimization', 'Server-Side Rendering & Caching'],
  },
  {
    title: 'AI Workflows & Dev Tools',
    subtitle: 'Next-Gen Engineering',
    icon: Cpu,
    tone: 'tertiary',
    iconTone: 'bg-md-tertiary-container text-md-on-tertiary-container',
    dotTone: 'bg-md-tertiary',
    skills: [
      'AI Agents & MCP',
      'Antigravity & Claude Workflows',
      'Prompt Engineering',
      'Git & GitHub CLI',
      'JUnit & Mockito Testing',
      'CI/CD & Netlify Deployments',
      'Vite & Rollup Bundling',
      'LLM Debugging & Tooling',
    ],
    description:
      'Harnessing AI-assisted development, Model Context Protocol, and automated toolchains to rapidly build high-reliability software.',
    highlights: ['Multi-Agent Coordination', 'Automated Verification Suites', 'Full-Stack Performance Profiling'],
  },
];

export const Skills: FC = () => {
  return (
    <section id="skills" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <SectionHeader
        icon={Sparkles}
        eyebrow="Core Capabilities"
        title="Technical Mastery & Stack"
        lead="A comprehensive breakdown of my engineering skill set across native Android mobile development, scalable backend systems, and next-generation AI workflows."
      />

      {/* Each card spans three parent rows and mirrors them with subgrid, so the
          header, body and technologies bands line up across the row no matter
          how the copy wraps at a given width. */}
      <Reveal
        stagger={0.12}
        className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 grid-rows-[repeat(9,auto)] md:grid-rows-[repeat(6,auto)] lg:grid-rows-[repeat(3,auto)]"
      >
        {skillCategories.map((category) => {
          const Icon = category.icon;
          return (
            <RevealItem
              key={category.title}
              whileHover={HOVER_LIFT}
              transition={HOVER_LIFT_TRANSITION}
              className={cn(
                'md-tonal md-shape-morph group relative grid row-span-3 grid-rows-subgrid gap-0 rounded-3xl p-6 sm:p-7 border',
                'hover:shadow-md-2 [--md-tone-hover:7%]',
                TONE_CLASS[category.tone],
              )}
            >
              {/* Band 1 — identity. The icon tile morphs toward a circle while
                  the card is hovered. */}
              <div className="flex items-start gap-4 mb-6">
                <div
                  className={`md-shape-morph p-3.5 rounded-2xl group-hover:rounded-[28px] ${category.iconTone} shrink-0`}
                >
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-title-lg text-md-on-surface">{category.title}</h3>
                  <p className="text-label-md text-md-on-surface-variant mt-1">{category.subtitle}</p>
                </div>
              </div>

              {/* Band 2 — what it means in practice */}
              <div className="pb-6">
                <p className="text-body-md text-md-on-surface-variant mb-5">{category.description}</p>

                <div className="flex items-center gap-2 mb-3 text-label-md uppercase tracking-wider text-md-on-surface-variant">
                  <Sparkles className="w-3.5 h-3.5 text-tone" aria-hidden="true" />
                  <span>Selected Impact</span>
                </div>
                <ul className="space-y-2">
                  {category.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2.5 text-body-md text-md-on-surface">
                      <span className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${category.dotTone}`} />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Band 3 — the stack. The chips arrive in sequence once the card
                  itself has landed. */}
              <div className="pt-4 border-t border-md-outline-variant/60">
                <div className="flex items-center gap-2 mb-3 text-label-md uppercase tracking-wider text-md-on-surface-variant">
                  <Layers className="w-3.5 h-3.5 text-tone" aria-hidden="true" />
                  <span>Key Technologies</span>
                </div>
                <motion.ul variants={revealContainer(0.03, 0.15)} className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <motion.li
                      key={skill}
                      variants={revealItem}
                      // Inherits the card's tone: a chip deepens toward it on hover.
                      className="md-tonal md-shape-morph inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-label-md text-md-on-surface-variant hover:text-md-on-surface border border-transparent [--md-tonal-base:var(--md-sys-color-surface-container-high)] [--md-tone-hover:20%] cursor-default"
                    >
                      <Check className="w-3.5 h-3.5 text-tone" aria-hidden="true" />
                      {skill}
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </RevealItem>
          );
        })}
      </Reveal>
    </section>
  );
};

export default Skills;

import { FC } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Server, Check, Sparkles, Layers, Cpu } from 'lucide-react';

interface SkillCategory {
  title: string;
  subtitle: string;
  icon: typeof Smartphone;
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
      {/* Header */}
      <div className="relative z-10 text-center space-y-4 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 h-8 px-4 rounded-full text-xs font-medium tracking-wide uppercase bg-md-surface-container-high text-md-on-surface-variant border border-md-outline-variant"
        >
          <Sparkles className="w-3.5 h-3.5 text-md-primary" />
          <span>Core Capabilities</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-md-on-surface"
        >
          Technical Mastery &amp; Stack
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg text-md-on-surface-variant max-w-2xl mx-auto leading-relaxed"
        >
          A comprehensive breakdown of my engineering skill set across native Android mobile development, scalable backend systems, and next-generation AI workflows.
        </motion.p>
      </div>

      {/* Grid of 3 tonal surface-container cards */}
      {/* Each card spans three parent rows and mirrors them with subgrid, so the
          header, body and technologies bands line up across the row no matter
          how the copy wraps at a given width. */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 grid-rows-[repeat(9,auto)] md:grid-rows-[repeat(6,auto)] lg:grid-rows-[repeat(3,auto)]">
        {skillCategories.map((category, idx) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="group relative grid row-span-3 grid-rows-subgrid gap-0 rounded-3xl bg-md-surface-container-low hover:bg-md-surface-container p-6 sm:p-7 border border-md-outline-variant transition-colors duration-medium ease-emphasized"
            >
              {/* Band 1 — identity */}
              <div className="flex items-start gap-4 mb-6">
                <div
                  className={`p-3.5 rounded-2xl ${category.iconTone} shrink-0`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-md-on-surface">
                    {category.title}
                  </h3>
                  <p className="text-xs font-medium text-md-on-surface-variant mt-0.5">{category.subtitle}</p>
                </div>
              </div>

              {/* Band 2 — what it means in practice */}
              <div className="pb-6">
                <p className="text-sm text-md-on-surface-variant mb-5 leading-relaxed">
                  {category.description}
                </p>

                {/* Proof points for this discipline */}
                <div className="flex items-center gap-2 mb-3 text-xs font-medium uppercase tracking-wider text-md-on-surface-variant">
                  <Sparkles className="w-3.5 h-3.5 text-md-primary" />
                  <span>Selected Impact</span>
                </div>
                <ul className="space-y-2">
                  {category.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-start gap-2.5 text-[13px] leading-snug text-md-on-surface"
                    >
                      <span
                        className={`mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full ${category.dotTone}`}
                      />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Band 3 — the stack */}
              <div className="pt-4 border-t border-md-outline-variant">
                <div className="flex items-center gap-2 mb-3 text-xs font-medium uppercase tracking-wider text-md-on-surface-variant">
                  <Layers className="w-3.5 h-3.5 text-md-primary" />
                  <span>Key Technologies</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-medium bg-md-surface-container-high text-md-on-surface-variant hover:bg-md-secondary-container hover:text-md-on-secondary-container transition-all duration-medium ease-emphasized"
                    >
                      <Check className="w-3.5 h-3.5 opacity-70" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default Skills;

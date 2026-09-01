import { FC } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Server, CheckCircle2, Sparkles, Layers, Cpu } from 'lucide-react';

interface SkillCategory {
  title: string;
  subtitle: string;
  icon: typeof Smartphone;
  iconBg: string;
  accentGradient: string;
  skills: string[];
  description: string;
  highlights: string[];
}

const skillCategories: SkillCategory[] = [
  {
    title: 'Android Development',
    subtitle: 'Native Mobile Engineering',
    icon: Smartphone,
    iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    accentGradient: 'from-emerald-500 via-teal-500 to-cyan-500',
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
    iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/25',
    accentGradient: 'from-blue-500 via-indigo-500 to-purple-500',
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
    iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/25',
    accentGradient: 'from-purple-500 via-pink-500 to-rose-500',
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
      {/* Background Subtle Mesh Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[20rem] bg-indigo-900/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 text-center space-y-4 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-slate-900/80 text-indigo-300 border border-indigo-500/30 backdrop-blur-md shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Core Capabilities</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white"
        >
          Technical Mastery &amp; Stack
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          A comprehensive breakdown of my engineering skill set across native Android mobile development, scalable backend systems, and next-generation AI workflows.
        </motion.p>
      </div>

      {/* Grid of 3 Glassmorphic Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skillCategories.map((category, idx) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="group relative flex flex-col justify-between rounded-3xl border border-white/[0.08] hover:border-white/[0.2] bg-slate-900/50 hover:bg-slate-900/75 p-7 sm:p-8 shadow-xl shadow-black/40 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-2 backdrop-blur-xl overflow-hidden"
            >
              {/* Top Gradient Highlight Line */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${category.accentGradient} opacity-75 group-hover:opacity-100 transition-opacity duration-300`}
              />

              {/* Card Header & Description */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`p-3.5 rounded-2xl border ${category.iconBg} shadow-inner group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all">
                      {category.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-400 mt-0.5">{category.subtitle}</p>
                  </div>
                </div>

                <p className="text-sm text-slate-300/90 mb-5 leading-relaxed">
                  {category.description}
                </p>

                {/* Proof points for this discipline */}
                <ul className="space-y-2 mb-6">
                  {category.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-start gap-2 text-[13px] leading-snug text-slate-400"
                    >
                      <Sparkles className="w-3 h-3 mt-1 shrink-0 text-amber-400/80" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technologies List */}
              <div className="pt-4 border-t border-white/[0.06]">
                <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Key Technologies</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/[0.08] hover:border-white/[0.18] transition-colors"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400/80 group-hover:text-emerald-400 transition-colors" />
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

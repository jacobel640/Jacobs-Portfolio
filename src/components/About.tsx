import { FC } from 'react';
import { motion } from 'framer-motion';
import { User, Smartphone, Server, Cpu, Layers, ShieldCheck, Rocket } from 'lucide-react';
import { RichText } from './RichText';
import { projects } from '../data/projects';

/** Narrative copy. Each entry renders as its own paragraph. */
const paragraphs: string[] = [
  "I'm an **Android Software Engineer** with over three years of experience building native applications end to end — from the persistence layer up through the domain rules to the interface, and frequently the backend service the app talks to.",
  '**The work starts at the architecture, not the screen.** Most small apps calcify the same way: business rules leak into the UI, the database schema quietly becomes the app model, and the next feature means touching every screen. Separating domain, data and presentation with dependencies pointing inwards is what keeps a codebase testable without an emulator and keeps a new feature a contained change instead of a rewrite.',
  "**I treat the network as optional and failure as normal.** Writes land locally first so the interface never waits on a spinner to confirm the user's own tap; background work is handed to schedulers that survive reboots; and inbound events are treated as repeatable, so a retried webhook delays a message instead of duplicating an invoice.",
  "**The backend half is not a side interest.** `Spring Boot` services, normalised `PostgreSQL` schemas, GraphQL/BFF layers and official Meta WABA messaging are part of the same job — which means I can design the contract between the app and the service rather than inherit one and work around it.",
  '**And it ships.** One of these apps is live on the Google Play Store, with everything that implies beyond the code: data-safety declarations, `targetSdk` compliance, signing, versioning and staged rollout — the parts of Android work that never appear in a tutorial and continue long after launch.',
];

interface Fact {
  label: string;
  value: string;
  icon: typeof User;
  accent: string;
}

const facts: Fact[] = [
  {
    label: 'Experience',
    value: '3+ years building production software',
    icon: Rocket,
    accent: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
  },
  {
    label: 'Primary craft',
    value: 'Native Android — Kotlin, Jetpack Compose, Clean Architecture',
    icon: Smartphone,
    accent: 'bg-blue-500/10 text-blue-400 border-blue-500/25',
  },
  {
    label: 'Second half of the stack',
    value: 'Java & Spring Boot services on PostgreSQL',
    icon: Server,
    accent: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/25',
  },
  {
    label: 'Toolchain',
    value: 'AI agents & MCP, CI/CD, JUnit and Mockito test suites',
    icon: Cpu,
    accent: 'bg-purple-500/10 text-purple-400 border-purple-500/25',
  },
];

const principles: string[] = [
  'Architecture before pixels — layers that can evolve independently',
  'Offline-first: the local store is the source of truth, not the request',
  'Every third-party integration inherits its failure modes; plan for them',
];

export const About: FC = () => {
  return (
    <section id="about" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Subtle Mesh Glow */}
      <div className="ambient-glow absolute top-1/3 right-0 w-[34rem] h-[20rem] bg-blue-900/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 text-center space-y-4 mb-14">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-slate-900/80 text-blue-300 border border-blue-500/30 backdrop-blur-md shadow-sm"
        >
          <User className="w-3.5 h-3.5 text-blue-400" />
          <span>About Me</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white"
        >
          Android Depth, Backend Range
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          A specialist in native Android engineering who owns the service behind the app as well — so the contract between them gets designed, not inherited.
        </motion.p>
      </div>

      {/* Narrative + At-a-glance */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Narrative */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-3 rounded-3xl border border-white/[0.08] bg-slate-900/50 p-7 sm:p-9 shadow-xl shadow-black/40 backdrop-blur-xl"
        >
          <div className="space-y-5">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-sm sm:text-[15px] text-slate-300/90 leading-relaxed">
                <RichText>{paragraph}</RichText>
              </p>
            ))}
          </div>

          {/* Working principles */}
          <div className="pt-6 mt-7 border-t border-white/[0.06]">
            <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>How I Build</span>
            </div>
            <ul className="space-y-2">
              {principles.map((principle) => (
                <li
                  key={principle}
                  className="flex items-start gap-2.5 text-[13px] leading-snug text-slate-300/90"
                >
                  <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
                  <span>{principle}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* At a glance */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="lg:col-span-2 rounded-3xl border border-white/[0.08] bg-slate-900/50 p-7 sm:p-8 shadow-xl shadow-black/40 backdrop-blur-xl"
        >
          <div className="flex items-center gap-2 mb-6 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>At a Glance</span>
          </div>

          <dl className="space-y-5">
            {facts.map((fact) => {
              const Icon = fact.icon;
              return (
                <div key={fact.label} className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl border shrink-0 ${fact.accent}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      {fact.label}
                    </dt>
                    <dd className="text-sm text-slate-200 leading-snug mt-0.5">{fact.value}</dd>
                  </div>
                </div>
              );
            })}
          </dl>

          {/* Counts are read from the project data so they cannot drift from it. */}
          <div className="pt-5 mt-6 border-t border-white/[0.06] grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                {projects.length}
              </div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400 mt-1">
                Case studies
              </div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                {projects.filter((project) => project.demo).length}
              </div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400 mt-1">
                Live on Google Play
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;

import { FC } from 'react';
import { motion } from 'framer-motion';
import {
  UserRound,
  GraduationCap,
  MapPin,
  Briefcase,
  CalendarClock,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { RichText } from './RichText';
import { PROFILE_IMAGE, PROFILE_IMAGE_ALT } from '../config/site';

/**
 * Narrative paragraphs. Kept as data rather than inline JSX so the copy reads
 * as copy, and so the `**bold**` markup goes through the same `RichText`
 * renderer the case studies use.
 */
const paragraphs: string[] = [
  "I'm an Android engineer with over three years of experience building native applications end to end. My work runs from an empty repository to a signed release on Google Play — including the parts that never appear in a tutorial: store listings, data-safety declarations, `targetSdk` compliance, versioning and staged rollout, all of which continue long after launch.",
  '**Architecture is the decision that ages.** Small apps calcify in predictable ways: business rules leak into the UI, the database schema quietly becomes the app model, and a new screen means touching every other one. I separate **Domain, Data and Presentation** with dependencies pointing inwards, so the domain layer knows nothing about `Room`, `Compose` or Android at all — which keeps it unit-testable without an emulator and makes swapping a data source a contained change rather than a rewrite.',
  '**I treat the network as optional and failure as normal.** Local storage is the source of truth, writes are reconciled outwards rather than awaited, and background work is handed to a scheduler that survives reboots. Inbound events from third parties are assumed to arrive late, twice, or out of order, so handlers are idempotent and outbound calls retry with backoff — a temporary outage delays a message instead of dropping an order.',
  'The backend half is `Java` and `Spring Boot` over `PostgreSQL`, where state that represents money or stock moves inside **managed transactions** or not at all. Alongside that I lean heavily on **AI-assisted workflows**, with one rule that makes them worth using: every subsystem gets a written specification — data contracts, endpoint shapes, edge cases, definition of done — **before any code is generated**, so the output is reviewed against a document rather than against intuition.',
];

interface Fact {
  label: string;
  value: string;
  icon: typeof UserRound;
  accent: string;
}

const facts: Fact[] = [
  {
    label: 'Experience',
    value: '3+ years building native Android',
    icon: CalendarClock,
    accent: 'text-blue-400 border-blue-500/25 bg-blue-500/10',
  },
  {
    label: 'Education',
    value: 'Practical Engineer, Software Engineering',
    icon: GraduationCap,
    accent: 'text-indigo-400 border-indigo-500/25 bg-indigo-500/10',
  },
  {
    label: 'Based in',
    value: 'Israel · Open to relocation',
    icon: MapPin,
    accent: 'text-purple-400 border-purple-500/25 bg-purple-500/10',
  },
  {
    label: 'Status',
    value: 'Freelancing · Open to full-time roles',
    icon: Briefcase,
    accent: 'text-emerald-400 border-emerald-500/25 bg-emerald-500/10',
  },
];

/** What the portrait frame holds while no photograph is configured. */
const MONOGRAM = 'JE';

export const About: FC = () => {
  return (
    <section
      id="about"
      className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Background Subtle Mesh Glow */}
      <div className="ambient-glow absolute top-1/3 left-1/4 -translate-x-1/2 w-[34rem] h-[18rem] bg-blue-900/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 text-center space-y-4 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-slate-900/80 text-blue-300 border border-blue-500/30 backdrop-blur-md shadow-sm"
        >
          <UserRound className="w-3.5 h-3.5 text-blue-400" />
          <span>About Me</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white"
        >
          The Engineer Behind the Work
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          How I approach building software, and the constraints I design for before writing the first line.
        </motion.p>
      </div>

      {/* Portrait and facts on the left, narrative on the right; stacked on
          narrow screens with the portrait first so the page still opens on a
          face rather than on a wall of prose. */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] gap-10 lg:gap-14 items-start">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center lg:items-stretch gap-6 w-full"
        >
          {/* Portrait */}
          <div className="relative w-44 sm:w-52 lg:w-full aspect-square">
            {/* Gradient halo, sized off the frame it sits behind. */}
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-tr from-blue-600/25 via-indigo-500/20 to-purple-600/25 blur-2xl pointer-events-none" />
            <div className="relative h-full w-full rounded-3xl overflow-hidden border border-white/[0.12] bg-slate-900/70 shadow-2xl shadow-black/50 backdrop-blur-xl">
              {PROFILE_IMAGE ? (
                <img
                  src={PROFILE_IMAGE}
                  alt={PROFILE_IMAGE_ALT}
                  width={512}
                  height={512}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800"
                >
                  <span className="text-5xl sm:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                    {MONOGRAM}
                  </span>
                </div>
              )}
              {/* Bottom scrim, so the frame reads as part of the dark page
                  rather than a bright rectangle pasted onto it. */}
              <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-slate-950/70 to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Quick facts — the details a recruiter scans for before reading. */}
          <ul className="w-full space-y-3">
            {facts.map((fact) => {
              const Icon = fact.icon;
              return (
                <li
                  key={fact.label}
                  className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-slate-900/50 px-4 py-3 backdrop-blur-xl shadow-lg shadow-black/30"
                >
                  <span className={`shrink-0 mt-0.5 rounded-xl border p-2 ${fact.accent}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      {fact.label}
                    </span>
                    <span className="block text-sm font-medium text-slate-200">{fact.value}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </motion.div>

        {/* Narrative */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative rounded-3xl border border-white/[0.08] bg-slate-900/50 p-7 sm:p-9 shadow-xl shadow-black/40 backdrop-blur-xl overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-75" />

          <div className="flex items-center gap-2 mb-6 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>How I Build</span>
          </div>

          <div className="space-y-5 text-[15px] sm:text-base text-slate-300/90 leading-relaxed">
            {paragraphs.map((paragraph, idx) => (
              <p key={idx}>
                <RichText>{paragraph}</RichText>
              </p>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/[0.06]">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
            >
              <span>See how that plays out in the case studies</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;

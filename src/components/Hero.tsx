import { FC } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight, Mail, Smartphone, Server, Cpu, Sparkles } from 'lucide-react';

export const Hero: FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 overflow-hidden pt-28 pb-16"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-purple-600/12 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Grid Overlay with Radial Fade */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center"
      >
        {/* Availability Badge */}
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 shadow-lg shadow-emerald-950/40 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            Available for new opportunities
          </span>
        </motion.div>

        {/* Main Heading with Glowing Gradient */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-4 leading-tight"
        >
          Hi, I'm{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 drop-shadow-sm">
            Jacob Elcharar
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.h2
          variants={itemVariants}
          className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-300 mb-6 flex items-center justify-center gap-2 flex-wrap"
        >
          <span>Android Software Engineer</span>
          <span className="text-indigo-400 hidden sm:inline">•</span>
          <span className="text-slate-400 font-normal">Fullstack Developer</span>
        </motion.h2>

        {/* Pitch / Bio */}
        <motion.p
          variants={itemVariants}
          className="max-w-2xl text-base sm:text-lg md:text-xl text-slate-400 leading-relaxed mb-8"
        >
          Over 3 years of experience building native applications end-to-end. Specialized in modern Android engineering with Kotlin, Jetpack Compose, Clean Architecture, and MVVM, complemented by scalable Spring Boot backend solutions and AI-driven workflows.
        </motion.p>

        {/* Tech Domain Pills */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-3 mb-10 text-xs sm:text-sm font-medium text-slate-300"
        >
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/60 border border-white/[0.08] hover:border-blue-500/40 hover:bg-slate-900/80 transition-all duration-300 backdrop-blur-md shadow-sm">
            <Smartphone className="w-4 h-4 text-blue-400" />
            <span>Native Android (Kotlin &amp; Compose)</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/60 border border-white/[0.08] hover:border-indigo-500/40 hover:bg-slate-900/80 transition-all duration-300 backdrop-blur-md shadow-sm">
            <Server className="w-4 h-4 text-indigo-400" />
            <span>Spring Boot &amp; Cloud Microservices</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/60 border border-white/[0.08] hover:border-purple-500/40 hover:bg-slate-900/80 transition-all duration-300 backdrop-blur-md shadow-sm">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>AI Agents &amp; Modern Tooling</span>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16"
        >
          <a
            href="#projects"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
          >
            <span>Explore Projects</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="#contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 text-slate-200 font-semibold border border-white/[0.12] hover:border-white/[0.2] hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 backdrop-blur-md"
          >
            <Mail className="w-4 h-4 text-slate-400" />
            <span>Get In Touch</span>
          </a>
        </motion.div>

        {/* Scroll Indicator.
            The reveal and the bobbing loop live on separate elements: an explicit
            `animate` object on a variant child overrides the inherited variant,
            which would leave this stuck at the `hidden` opacity of 0. */}
        <motion.div variants={itemVariants}>
          <motion.a
            href="#skills"
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="inline-flex flex-col items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-300 transition-colors duration-200 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70"
            aria-label="Scroll to Skills"
          >
            <span className="tracking-widest uppercase text-[10px] font-semibold text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" /> Explore Skills
            </span>
            <ArrowDown className="w-4 h-4 text-indigo-400" />
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

import { FC } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight, Mail, Smartphone, Server, Cpu } from 'lucide-react';

export const Hero: FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  // MD3 emphasized easing.
  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.2, 0, 0, 1],
      },
    },
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 overflow-hidden pt-28 pb-16"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center"
      >
        {/* Availability Badge: an MD3 assist chip with a live indicator dot */}
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-flex items-center gap-2.5 h-9 px-4 rounded-full text-sm font-medium bg-md-surface-container-high text-md-on-surface-variant border border-md-outline-variant">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-md-success opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-md-success" />
            </span>
            Available for new opportunities
          </span>
        </motion.div>

        {/* Display headline */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl md:text-7xl font-normal tracking-tight text-md-on-surface mb-5 leading-[1.1]"
        >
          Hi, I'm <span className="text-md-primary">Jacob Elcharar</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.h2
          variants={itemVariants}
          className="text-xl sm:text-2xl md:text-3xl font-normal text-md-on-surface mb-6 flex items-center justify-center gap-x-3 gap-y-1 flex-wrap"
        >
          <span>Android Software Engineer</span>
          <span className="text-md-tertiary hidden sm:inline" aria-hidden="true">
            •
          </span>
          <span className="text-md-on-surface-variant">Fullstack Developer</span>
        </motion.h2>

        {/* Pitch / Bio */}
        <motion.p
          variants={itemVariants}
          className="max-w-2xl text-base sm:text-lg text-md-on-surface-variant leading-relaxed mb-8"
        >
          Over 3 years of experience building native applications end-to-end. Specialized in modern Android engineering with Kotlin, Jetpack Compose, Clean Architecture, and MVVM, complemented by scalable Spring Boot backend solutions and AI-driven workflows.
        </motion.p>

        {/* Domain pills: MD3 assist chips */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-3 mb-10 text-sm font-medium text-md-on-surface"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-md-surface-container-low border border-md-outline-variant hover:bg-md-surface-container-high transition-colors duration-medium ease-emphasized">
            <Smartphone className="w-[18px] h-[18px] text-md-primary" />
            <span>Native Android (Kotlin &amp; Compose)</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-md-surface-container-low border border-md-outline-variant hover:bg-md-surface-container-high transition-colors duration-medium ease-emphasized">
            <Server className="w-[18px] h-[18px] text-md-secondary" />
            <span>Spring Boot &amp; Cloud Microservices</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-md-surface-container-low border border-md-outline-variant hover:bg-md-surface-container-high transition-colors duration-medium ease-emphasized">
            <Cpu className="w-[18px] h-[18px] text-md-tertiary" />
            <span>AI Agents &amp; Modern Tooling</span>
          </div>
        </motion.div>

        {/* CTA Buttons: filled + outlined */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16"
        >
          <a
            href="#projects"
            className="state-layer md-focus group w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-md-primary text-md-on-primary font-medium transition-shadow duration-medium ease-emphasized hover:shadow-md-1"
          >
            <span>Explore Projects</span>
            <ArrowRight className="w-[18px] h-[18px] group-hover:translate-x-1 transition-transform duration-medium ease-emphasized" />
          </a>

          <a
            href="#contact"
            className="state-layer md-focus w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full border border-md-outline text-md-primary font-medium"
          >
            <Mail className="w-[18px] h-[18px]" />
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
            className="md-focus inline-flex flex-col items-center gap-1.5 px-3 py-1 text-md-on-surface-variant hover:text-md-primary transition-colors duration-medium ease-emphasized rounded-full"
            aria-label="Scroll to Skills"
          >
            <span className="tracking-widest uppercase text-[11px] font-medium">Explore Skills</span>
            <ArrowDown className="w-4 h-4" />
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

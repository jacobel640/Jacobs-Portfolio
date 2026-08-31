import { useState, useEffect, FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Folder,
  Github,
  Globe,
  Smartphone,
  Server,
  X,
  Lock,
  CheckCircle2,
  Image as ImageIcon,
  ExternalLink,
  Sparkles,
  Layers,
  ZoomIn,
  ArrowRight,
} from 'lucide-react';

export interface ProjectDetails {
  overview: string;
  architecture: string[];
  features: string[];
  screenshots?: string[];
}

export interface Project {
  id: string;
  title: string;
  category: 'Android' | 'Fullstack' | 'Backend';
  categoryLabel: string;
  description: string;
  detailedContent: ProjectDetails;
  tags: string[];
  github?: string;
  demo?: string;
  isPrivate?: boolean;
  icon: typeof Folder;
  screenshots?: string[];
}

export const projects: Project[] = [
  {
    id: 'taskflow',
    title: 'TaskFlow',
    category: 'Android',
    categoryLabel: 'Native Android App',
    description:
      'Engineered a modular task-management application and enforced Clean Architecture and MVVM patterns for scalability. Integrated Hilt for dependency injection and Room for local persistence with parameterized SQL queries.',
    detailedContent: {
      overview:
        'TaskFlow is a robust, offline-first productivity platform built entirely natively for Android. The focus was heavily on establishing a scalable foundation utilizing industry-standard Clean Architecture, allowing the UI, domain, and data layers to evolve independently without tight coupling.',
      architecture: [
        'Clean Architecture separates Domain, Data, and Presentation layers',
        'MVVM Pattern paired with Jetpack Compose for declarative UI rendering',
        'Hilt for robust dependency injection across the application lifecycle',
        'Room Database with parameterized queries for secure, offline-first storage',
        'WorkManager for reliable background thread synchronization and daily scheduled notifications',
      ],
      features: [
        'Interactive task creation, sorting, and priority categorization',
        'Background synchronization ensuring zero data loss on network drops',
        'Dynamic Material Design 3 user interface with dark theme support',
        'Scheduled local notifications for task deadlines and calendar view',
      ],
      screenshots: [
        '/screenshots/taskflow/HomeScreen_filters.png',
        '/screenshots/taskflow/SingleTaskScreen.png',
        '/screenshots/taskflow/AddEditTaskScreen.png',
        '/screenshots/taskflow/CalendarScreen_day.png',
        '/screenshots/taskflow/CalendarScreen_month.png',
        '/screenshots/taskflow/HomeScreen_sorting.png',
        '/screenshots/taskflow/HomeScreen_mark-completed_undo-deletion.png',
        '/screenshots/taskflow/NotificationTimeDialog.png',
        '/screenshots/taskflow/app_icon.png',
      ],
    },
    screenshots: [
      '/screenshots/taskflow/HomeScreen_filters.png',
      '/screenshots/taskflow/SingleTaskScreen.png',
      '/screenshots/taskflow/AddEditTaskScreen.png',
      '/screenshots/taskflow/CalendarScreen_day.png',
      '/screenshots/taskflow/CalendarScreen_month.png',
      '/screenshots/taskflow/HomeScreen_sorting.png',
      '/screenshots/taskflow/HomeScreen_mark-completed_undo-deletion.png',
      '/screenshots/taskflow/NotificationTimeDialog.png',
      '/screenshots/taskflow/app_icon.png',
    ],
    tags: ['Kotlin', 'Compose', 'MVVM', 'Hilt', 'Room', 'WorkManager'],
    github: 'https://github.com/Jacobel640/TaskFlow',
    isPrivate: false,
    icon: Smartphone,
  },
  {
    id: 'gio-manetti',
    title: 'GIO MANETTI E-Commerce',
    category: 'Fullstack',
    categoryLabel: 'Fullstack E-Commerce Platform',
    description:
      'Architected the system design, data modeling schemas, and AI agent execution plans for a comprehensive full-stack platform leveraging Next.js, Spring Boot, PostgreSQL, and Headless CMS integrations.',
    detailedContent: {
      overview:
        'GIO MANETTI represents a modern, luxury e-commerce platform built to handle scale. This project involved designing the entire data schema from scratch and executing a full-stack implementation plan driven by AI agent workflows.',
      architecture: [
        'Frontend built with Next.js & React for SSR and optimal SEO performance',
        'Backend powered by Java Spring Boot for robust transaction handling',
        'PostgreSQL database utilizing normalized schemas for inventory management',
        'Headless CMS integration for dynamic marketing content',
        'GraphQL / BFF (Backend-For-Frontend) layer to optimize client data fetching',
      ],
      features: [
        'End-to-end shopping cart and secure checkout flows',
        'Dynamic product filtering and variant inventory management',
        'Administrative dashboard for order monitoring and metrics',
        'High-performance image serving and CDN caching',
      ],
      screenshots: [],
    },
    screenshots: [],
    tags: ['Next.js', 'Spring Boot', 'PostgreSQL', 'GraphQL', 'Headless CMS'],
    github: 'https://github.com/Jacobel640/GIO-online-shop',
    isPrivate: true,
    icon: Globe,
  },
  {
    id: 'tzachi-community',
    title: 'Tzachi (צח"י) Application',
    category: 'Android',
    categoryLabel: 'Published Native App',
    description:
      'Developed and successfully published a dedicated mobile application for the organization on the Google Play Store. Implemented time-based content flows by integrating external APIs for date-driven logic.',
    detailedContent: {
      overview:
        'The Tzachi app serves as a centralized digital platform for community organization and engagement. It required integrating complex external APIs to calculate date-specific content (zmanim) and deploying it fully to production on the Play Store.',
      architecture: [
        'Native Java/Kotlin hybrid codebase',
        'Material Design principles for an intuitive, accessible UI',
        'RESTful API integration with JSON parsing for real-time external data',
        'Time-based logic engine for precise zmanim calculation',
      ],
      features: [
        'Live in production on the Google Play Store',
        'Real-time content updates based on current date and geolocation',
        'Community announcement and emergency messaging hub',
        'Robust error handling for offline or poor network scenarios',
      ],
      screenshots: [],
    },
    screenshots: [],
    tags: ['Android', 'Java/Kotlin', 'External APIs', 'Play Store'],
    github: 'https://github.com/Jacobel640/TzachiApp',
    demo: 'https://play.google.com/store/apps/details?id=com.tzachi',
    isPrivate: false,
    icon: Smartphone,
  },
  {
    id: 'files-app',
    title: 'Advanced File Manager',
    category: 'Android',
    categoryLabel: 'Native Utility App',
    description:
      'A comprehensive file management application for Android featuring a built-in storage analyzer, advanced search filtering, and robust local file operations.',
    detailedContent: {
      overview:
        'This native Android application provides users with complete control over their local device storage. It was built to handle complex file operations efficiently, featuring a powerful storage analyzer, deep search capabilities with granular filters, and a seamless, intuitive UI for managing files and directories.',
      architecture: [
        'Native Android development utilizing modern Kotlin patterns',
        'Jetpack Compose for building a dynamic, responsive user interface',
        'Integration with Android Scoped Storage framework APIs',
        'Coroutines for asynchronous, non-blocking file processing and storage analysis',
      ],
      features: [
        'Deep storage analysis and capacity visualization',
        'Advanced file search with custom granular filters',
        'Multi-file selection with bulk actions (copy, move, delete)',
        'Intuitive grid and list layout viewing modes',
      ],
      screenshots: [
        '/screenshots/files-migration/main_screen.png',
        '/screenshots/files-migration/file_explorer_grid.png',
        '/screenshots/files-migration/file_explorer_row.png',
        '/screenshots/files-migration/file_actions.png',
        '/screenshots/files-migration/search_screen.png',
        '/screenshots/files-migration/search_filters_1.png',
        '/screenshots/files-migration/search_filters_2.png',
        '/screenshots/files-migration/sort_options_sheet.png',
        '/screenshots/files-migration/selected_file_details.png',
        '/screenshots/files-migration/multi_selected_details.png',
        '/screenshots/files-migration/last_files.png',
        '/screenshots/files-migration/storage_analizer.png',
        '/screenshots/files-migration/copy_navigation.png',
      ],
    },
    screenshots: [
      '/screenshots/files-migration/main_screen.png',
      '/screenshots/files-migration/file_explorer_grid.png',
      '/screenshots/files-migration/file_explorer_row.png',
      '/screenshots/files-migration/file_actions.png',
      '/screenshots/files-migration/search_screen.png',
      '/screenshots/files-migration/search_filters_1.png',
      '/screenshots/files-migration/search_filters_2.png',
      '/screenshots/files-migration/sort_options_sheet.png',
      '/screenshots/files-migration/selected_file_details.png',
      '/screenshots/files-migration/multi_selected_details.png',
      '/screenshots/files-migration/last_files.png',
      '/screenshots/files-migration/storage_analizer.png',
      '/screenshots/files-migration/copy_navigation.png',
    ],
    tags: ['Kotlin', 'Compose', 'Coroutines', 'Scoped Storage'],
    isPrivate: true,
    icon: Smartphone,
  },
  {
    id: 'e-commerce-waba',
    title: 'Minim4You Backend',
    category: 'Backend',
    categoryLabel: 'Automated E-Commerce & WABA',
    description:
      'Architected and deployed a backend service to automate end-to-end retail ordering and invoicing workflows. Transitioned messaging infrastructure to the official Meta WABA for enterprise reliability.',
    detailedContent: {
      overview:
        'Minim4You required a highly reliable backend to sync a customer-facing Wix interface with real-time WhatsApp business messaging. This system acts as the central nervous system for retail ordering and invoicing.',
      architecture: [
        'Java Spring Boot microservice deployed on Heroku',
        'Meta WhatsApp Business API (WABA) for official, reliable messaging',
        'Wix REST APIs to synchronize CRM customer records and inventory',
        'PostgreSQL database for transactional integrity',
      ],
      features: [
        'Real-time order synchronization from web to WhatsApp',
        'Automated invoice generation and PDF routing',
        'Fault-tolerant webhook processors for message delivery receipts',
      ],
      screenshots: [],
    },
    screenshots: [],
    tags: ['Spring Boot', 'PostgreSQL', 'Meta WABA', 'Wix APIs', 'Heroku'],
    github: 'https://github.com/Jacobel640/Minim4You',
    isPrivate: false,
    icon: Server,
  },
  {
    id: 'whatsapp-status',
    title: 'WhatsApp Status Utility',
    category: 'Android',
    categoryLabel: 'Android Utility App',
    description:
      'Designed and built a specialized Android application utilizing Kotlin and Jetpack Compose to streamline the saving and sharing of WhatsApp statuses.',
    detailedContent: {
      overview:
        'A lightweight, high-performance utility application that helps users manage, save, and share temporary media statuses from WhatsApp, built entirely with modern Android frameworks.',
      architecture: [
        '100% Kotlin codebase',
        'Jetpack Compose for UI rendering',
        'Android Scoped Storage and MediaStore integration for media management',
        'Coroutines for async media processing',
      ],
      features: [
        'Automatic detection of cached status media',
        'One-click save to local gallery',
        'In-app media viewer and sharing intents',
      ],
      screenshots: [],
    },
    screenshots: [],
    tags: ['Kotlin', 'Compose', 'MediaStore API', 'Coroutines'],
    github: 'https://github.com/Jacobel640/StatusSaver',
    isPrivate: false,
    icon: Smartphone,
  },
];

export type FilterType = 'All' | 'Android' | 'Fullstack' | 'Backend';

export const Projects: FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedProject || selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject, selectedImage]);

  const filteredProjects =
    activeFilter === 'All'
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  const filterTabs: FilterType[] = ['All', 'Android', 'Fullstack', 'Backend'];

  return (
    <section id="projects" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 right-1/4 w-[32rem] h-[32rem] bg-blue-900/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Section Header */}
      <div className="relative z-10 text-center mb-14">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-300 border border-blue-500/25 mb-4 shadow-sm"
        >
          <Folder className="w-3.5 h-3.5 text-blue-400" />
          <span>Featured Portfolio</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white"
        >
          Projects &amp; Case Studies
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          Explore a curated selection of native mobile applications, robust backend microservices, and fullstack platforms engineered for performance and scalability.
        </motion.p>
      </div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 flex flex-wrap items-center justify-center gap-2 mb-14"
      >
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-900/60 border border-white/[0.08] backdrop-blur-xl">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveFilter(tab)}
                className={`relative px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 focus:outline-none ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFilterTabIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/25 border border-blue-400/30"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        layout
        className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
      >
        <AnimatePresence>
          {filteredProjects.map((project) => {
            const IconComponent = project.icon;
            return (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedProject(project)}
                className="group relative flex flex-col justify-between rounded-3xl bg-slate-900/50 hover:bg-slate-900/80 border border-white/[0.08] hover:border-white/[0.22] p-6 sm:p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 backdrop-blur-xl cursor-pointer overflow-hidden"
              >
                {/* Subtle top card glow */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Card Content Top */}
                <div>
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:scale-105 group-hover:bg-blue-500/20 transition-all duration-300">
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {project.isPrivate ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-slate-800/80 text-slate-400 border border-slate-700/60">
                          <Lock className="w-3 h-3" />
                          Private
                        </span>
                      ) : project.github ? (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
                        >
                          <Github className="w-3 h-3" />
                          Code
                        </a>
                      ) : null}

                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Live
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-2">
                    {project.categoryLabel}
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-300 transition-all mb-3">
                    {project.title}
                  </h3>

                  <p className="text-sm text-slate-300/80 leading-relaxed line-clamp-3 mb-6">
                    {project.description}
                  </p>
                </div>

                {/* Card Content Bottom / Tags */}
                <div className="pt-4 border-t border-white/[0.06]">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white/[0.04] text-slate-300 border border-white/[0.06]"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="px-2 py-1 text-[11px] font-medium rounded-lg text-slate-400">
                        +{project.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold text-blue-400 group-hover:text-blue-300 transition-colors pt-1">
                    <span>View Case Study &amp; Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* High-End Glassmorphic Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl overflow-y-auto"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="bg-slate-900/95 border border-white/[0.12] rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/80 my-auto text-left relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-20 flex items-center justify-between p-6 sm:px-8 border-b border-white/[0.08] bg-slate-900/95 backdrop-blur-2xl">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/25 hidden sm:flex items-center justify-center">
                    {(() => {
                      const ModalIcon = selectedProject.icon;
                      return <ModalIcon className="w-6 h-6" />;
                    })()}
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {selectedProject.title}
                    </h3>
                    <p className="text-blue-400 font-medium text-xs sm:text-sm mt-0.5">
                      {selectedProject.categoryLabel}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2.5 text-slate-400 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] rounded-2xl transition-colors focus:outline-none"
                  aria-label="Close project modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-8">
                {/* Overview */}
                <div>
                  <h4 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                    <Folder className="w-4 h-4 text-blue-400" />
                    <span>Project Overview</span>
                  </h4>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed bg-white/[0.02] p-5 rounded-2xl border border-white/[0.06]">
                    {selectedProject.detailedContent.overview}
                  </p>
                </div>

                {/* Architecture & Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Architecture */}
                  <div className="bg-slate-950/40 p-5 rounded-2xl border border-white/[0.06]">
                    <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2 border-b border-white/[0.06] pb-2.5">
                      <Server className="w-4 h-4 text-indigo-400" />
                      <span>Architecture &amp; Engineering</span>
                    </h4>
                    <ul className="space-y-3">
                      {selectedProject.detailedContent.architecture.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-slate-300 text-xs sm:text-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Features */}
                  <div className="bg-slate-950/40 p-5 rounded-2xl border border-white/[0.06]">
                    <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2 border-b border-white/[0.06] pb-2.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Key Features &amp; Highlights</span>
                    </h4>
                    <ul className="space-y-3">
                      {selectedProject.detailedContent.features.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-slate-300 text-xs sm:text-sm">
                          <CheckCircle2 className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Tech Stack */}
                <div>
                  <h4 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span>Technology Stack</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-white/[0.05] text-slate-200 border border-white/[0.08] shadow-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Screenshots & Media Section */}
                <div>
                  <h4 className="text-base font-bold text-white mb-4 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-pink-400" />
                      <span>Screenshots &amp; Visual Artifacts</span>
                    </span>
                    {(selectedProject.detailedContent?.screenshots && selectedProject.detailedContent.screenshots.length > 0) ||
                    (selectedProject.screenshots && selectedProject.screenshots.length > 0) ? (
                      <span className="text-xs font-normal text-slate-400">
                        Click any image to zoom
                      </span>
                    ) : null}
                  </h4>

                  {(selectedProject.detailedContent?.screenshots &&
                    selectedProject.detailedContent.screenshots.length > 0) ||
                  (selectedProject.screenshots && selectedProject.screenshots.length > 0) ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {(selectedProject.detailedContent?.screenshots || selectedProject.screenshots || []).map(
                        (imgSrc, idx) => (
                          <div
                            key={idx}
                            onClick={() => setSelectedImage(imgSrc)}
                            className="group relative rounded-2xl overflow-hidden bg-slate-950/70 border border-white/[0.08] hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer aspect-video flex items-center justify-center"
                          >
                            <img
                              src={imgSrc}
                              alt={`${selectedProject.title} screenshot ${idx + 1}`}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-between p-3.5">
                              <span className="text-xs text-white font-medium truncate max-w-[80%]">
                                {imgSrc.split('/').pop()?.replace('.png', '').replace(/[-_]/g, ' ')}
                              </span>
                              <div className="p-1.5 rounded-lg bg-blue-600/80 text-white">
                                <ZoomIn className="w-3.5 h-3.5" />
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-white/[0.08] bg-slate-950/40 p-8 text-center backdrop-blur-sm">
                      <ImageIcon className="w-10 h-10 mx-auto text-slate-600 mb-3 opacity-60" />
                      <p className="text-sm font-medium text-slate-400">
                        No screenshots available to display
                      </p>
                    </div>
                  )}
                </div>

                {/* Repository & Live Demo Actions */}
                <div className="bg-slate-950/50 rounded-2xl p-5 sm:p-6 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h5 className="text-white font-semibold text-sm sm:text-base mb-1">
                      Project Repository &amp; Delivery
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-400 max-w-md">
                      {selectedProject.isPrivate
                        ? 'This repository is private due to client confidentiality, enterprise credentials, or proprietary intellectual property.'
                        : 'Explore the full source code, commit history, and architectural implementation on GitHub.'}
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    {selectedProject.isPrivate ? (
                      <div className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/80 text-slate-400 border border-white/[0.06] text-xs sm:text-sm font-medium">
                        <Lock className="w-4 h-4" />
                        <span>Private Repository</span>
                      </div>
                    ) : selectedProject.github ? (
                      <a
                        href={selectedProject.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
                      >
                        <Github className="w-4 h-4" />
                        <span>Source Code</span>
                      </a>
                    ) : null}

                    {selectedProject.demo && (
                      <a
                        href={selectedProject.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lightbox / Zoom Overlay */}
      <AnimatePresence>
        {selectedImage && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-5xl max-h-[90vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 p-2 text-slate-300 hover:text-white bg-white/[0.1] hover:bg-white/[0.2] border border-white/[0.15] rounded-full transition-colors focus:outline-none"
                aria-label="Close image preview"
              >
                <X className="w-5 h-5" />
              </button>

              <img
                src={selectedImage}
                alt="Screenshot Preview"
                className="max-w-full max-h-[80vh] object-contain rounded-2xl border border-white/[0.15] shadow-2xl"
              />

              <p className="mt-3 text-xs sm:text-sm text-slate-300 font-medium tracking-wide">
                {selectedImage.split('/').pop()?.replace('.png', '').replace(/[-_]/g, ' ')}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;

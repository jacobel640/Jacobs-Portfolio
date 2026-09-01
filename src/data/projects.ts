import { Folder, Globe, Server, Smartphone } from 'lucide-react';

/** A single project screenshot with a human-readable caption. */
export interface Screenshot {
  src: string;
  caption: string;
}

export interface ProjectDetails {
  overview: string;
  architecture: string[];
  features: string[];
  screenshots?: Screenshot[];
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
}

/**
 * Full-resolution screenshots live at `/screenshots/<project>/<name>.png`.
 * A downscaled WebP thumbnail sits alongside them in `thumbs/`, and is used for
 * the modal grid; the lightbox always loads the original PNG.
 */
export const thumbFor = (src: string): string =>
  src.replace(/\/([^/]+)\.png$/i, '/thumbs/$1.webp');

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
        { src: '/screenshots/taskflow/HomeScreen_filters.png', caption: 'Task list with live filtering' },
        { src: '/screenshots/taskflow/SingleTaskScreen.png', caption: 'Task detail view' },
        { src: '/screenshots/taskflow/AddEditTaskScreen.png', caption: 'Create and edit a task' },
        { src: '/screenshots/taskflow/CalendarScreen_day.png', caption: 'Calendar — day view' },
        { src: '/screenshots/taskflow/CalendarScreen_month.png', caption: 'Calendar — month view' },
        { src: '/screenshots/taskflow/HomeScreen_sorting.png', caption: 'Multi-criteria sorting' },
        {
          src: '/screenshots/taskflow/HomeScreen_mark-completed_undo-deletion.png',
          caption: 'Complete a task with undo',
        },
        { src: '/screenshots/taskflow/NotificationTimeDialog.png', caption: 'Reminder time picker' },
      ],
    },
    tags: ['Kotlin', 'Compose', 'MVVM', 'Hilt', 'Room', 'WorkManager'],
    github: 'https://github.com/jacobel640/TaskFlow',
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
    tags: ['Next.js', 'Spring Boot', 'PostgreSQL', 'GraphQL', 'Headless CMS'],
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
    tags: ['Android', 'Java/Kotlin', 'External APIs', 'Play Store'],
    github: 'https://github.com/jacobel640/TzachiApp',
    demo: 'https://play.google.com/store/apps/details?id=com.shahareinisim.tzachiapp',
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
        { src: '/screenshots/files-migration/main_screen.png', caption: 'Storage overview home screen' },
        { src: '/screenshots/files-migration/file_explorer_grid.png', caption: 'File explorer — grid layout' },
        { src: '/screenshots/files-migration/file_explorer_row.png', caption: 'File explorer — list layout' },
        { src: '/screenshots/files-migration/file_actions.png', caption: 'Per-file action sheet' },
        { src: '/screenshots/files-migration/search_screen.png', caption: 'Search across all storage' },
        { src: '/screenshots/files-migration/search_filters_1.png', caption: 'Search filters — file type' },
        { src: '/screenshots/files-migration/search_filters_2.png', caption: 'Search filters — size and date' },
        { src: '/screenshots/files-migration/sort_options_sheet.png', caption: 'Sorting options' },
        { src: '/screenshots/files-migration/selected_file_details.png', caption: 'File details panel' },
        { src: '/screenshots/files-migration/multi_selected_details.png', caption: 'Multi-select bulk actions' },
        { src: '/screenshots/files-migration/last_files.png', caption: 'Recently modified files' },
        { src: '/screenshots/files-migration/storage_analizer.png', caption: 'Storage analyzer breakdown' },
        { src: '/screenshots/files-migration/copy_navigation.png', caption: 'Copy and move navigation' },
      ],
    },
    tags: ['Kotlin', 'Compose', 'Coroutines', 'Scoped Storage'],
    github: 'https://github.com/jacobel640/Files',
    isPrivate: false,
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
    tags: ['Spring Boot', 'PostgreSQL', 'Meta WABA', 'Wix APIs', 'Heroku'],
    isPrivate: true,
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
    tags: ['Kotlin', 'Compose', 'MediaStore API', 'Coroutines'],
    github: 'https://github.com/jacobel640/StatusSaver',
    isPrivate: false,
    icon: Smartphone,
  },
];

export type FilterType = 'All' | 'Android' | 'Fullstack' | 'Backend';

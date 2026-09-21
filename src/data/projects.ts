import { Folder, Globe, Server, Smartphone } from 'lucide-react';

/** A single project screenshot with a human-readable caption. */
export interface Screenshot {
  src: string;
  caption: string;
}

export interface ProjectDetails {
  /** Multi-paragraph narrative. Each entry renders as its own paragraph. */
  overview: string[];
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
    // Mirrors the private repo Minim4You-waba-wix. Private projects carry no
    // `github` URL, so the name is noted here rather than derived from one.
    id: 'minim4you-waba-wix',
    title: 'Minim4You WhatsApp Commerce',
    category: 'Backend',
    categoryLabel: 'Live WhatsApp Commerce Platform',
    description:
      'A WhatsApp shopping bot, operator console and broadcast engine running in production for a seasonal Four Species retailer. Customers browse, fill a cart and pay entirely inside WhatsApp, on the official Meta Business API, against a live Wix store.',
    detailedContent: {
      overview: [
        'Minim4You sells the **Four Species for Sukkot**. It is a business that does almost all of its year in a few weeks, and its customers would rather send a WhatsApp message than open a website. This system lets them **shop without leaving the chat**. It is **live in production** at minim4you.org, on a `Spring Boot` service on Heroku that sits between the **official Meta WhatsApp Business API** and the store\'s **Wix** catalogue, carts, orders and CRM.',
        '**The bot is a full storefront in a chat thread.** A customer moves through onboarding, categories, products, variant options, quantity, cart editing and checkout using WhatsApp\'s own interactive lists, buttons and product cards. The cart is a real `Wix eCommerce` cart, so stock, pricing and discounts come from the store and are never copied. Payment happens on a **signed, expiring checkout link**. Each tap on it mints a fresh Wix redirect session, because a Wix session URL only opens once and link-preview crawlers would otherwise use it up before a person ever taps. When Wix reports that an order was approved or shipped, a signed webhook turns that into an **approved WhatsApp template message** to the customer.',
        '**Most of the engineering is about what goes wrong.** Meta delivers each message as its own webhook, retries freely and sends the same one more than once. Messages are therefore **deduplicated by WhatsApp message ID**, both in memory and against the database, and **handled one sender at a time** under a per-sender lock. Two quick taps can\'t race each other through the conversation state, and a retry can\'t get a second answer. Both webhooks are **cryptographically verified**: an `HMAC-SHA256` signature from Meta and an RSA-signed JWT from Wix. Bot sessions live in `PostgreSQL` rather than in memory, so a dyno restart in the middle of an order continues from a known state.',
        'Next to the bot sits a **real-time operator console** for the people who answer customers: a self-contained, mobile-first page with no build step, protected by authentication. Operators get a live queue with search and a "waiting for a reply" view, their own colour-coded tags, and real **sent, delivered and read receipts** taken from Meta\'s status webhooks. They also see a countdown of WhatsApp\'s **24-hour customer-service window**, and once it closes, a one-click approved template to reopen it. When an operator replies, **the bot pauses automatically** for that conversation, so a customer never gets a human answer and an automated one at the same moment. The pause always expires, so a conversation nobody hands back returns to the bot on its own. The console can also pull **the customer\'s Wix orders on demand**. It asks Wix only when an operator requests it, never just because a thread was opened.',
        'The third part is a **broadcast engine** for the season\'s marketing. It builds audiences from bot sessions, Wix orders, Wix contact labels or a pasted list, and shows exactly how many people each exclusion removed. Anyone who asked to unsubscribe is **always excluded, with no override**, and if the opt-out list can\'t be read, the campaign isn\'t created at all. Campaigns are paced under Meta\'s rate limits and can be paused, resumed and retried. Afterwards, everyone a campaign actually reached can be **tagged back into the Wix CRM**. That step is idempotent, and it matches phone numbers in all the formats Wix stores them in, so it never creates a duplicate contact.',
        'The codebase is roughly **20k lines of Java plus 12k lines of tests**, with **hundreds of automated tests** and 400+ commits across a year of live seasons. The tests go beyond the Java: they also check that every URL the dashboards call is a route the server actually maps, so a broken endpoint fails the build instead of reaching an operator.',
      ],
      architecture: [
        'Java 17 / Spring Boot 3 service on Heroku, with Heroku Postgres (Spring Data JPA)',
        'Meta WhatsApp Cloud API: interactive lists, buttons, product and CTA messages, approved templates and delivery-status webhooks',
        'Wix REST, eCommerce and CRM APIs for the catalogue, carts, checkout, orders, contacts and labels, plus signed Wix webhooks',
        'Webhook security: HMAC-SHA256 (Meta) and RS256 JWT (Wix) verification, with HMAC-signed, expiring checkout tokens',
        'Concurrency: per-sender locking, deduplication by message ID, and a token-bucket rate limiter for Wix calls',
        'Operator and campaign consoles as dependency-free, single-file HTML/JS pages served by the service',
      ],
      features: [
        'End-to-end ordering inside WhatsApp, from browsing and variants to the cart and a secure payment link',
        'Automatic order-status notifications to customers from Wix order webhooks',
        'Live operator inbox with delivery receipts, tags, search and a 24-hour-window countdown',
        'Automatic human handover that pauses the bot while an operator is on the thread',
        'Template broadcast campaigns with audience building, opt-out enforcement, pacing and retry',
        'Tagging of campaign recipients back into the Wix CRM, without duplicate contacts',
      ],
      screenshots: [
        { src: '/screenshots/minim4you/conversation_queue.png', caption: 'Operator console: live conversation queue' },
        { src: '/screenshots/minim4you/bot_order_flow.png', caption: 'Bot ordering flow with interactive buttons and lists' },
        { src: '/screenshots/minim4you/human_handover.png', caption: 'Operator reply with the bot paused automatically' },
        { src: '/screenshots/minim4you/customer_context.png', caption: 'Customer orders pulled live from Wix' },
        { src: '/screenshots/minim4you/broadcast_campaigns.png', caption: 'Broadcast campaigns' },
        { src: '/screenshots/minim4you/campaign_progress.png', caption: 'Campaign progress and delivery receipts' },
        { src: '/screenshots/minim4you/campaign_template.png', caption: 'New campaign: approved template and preview' },
        { src: '/screenshots/minim4you/conversation_queue_dark.png', caption: 'Operator console in dark mode' },
      ],
    },
    tags: ['Spring Boot', 'PostgreSQL', 'WhatsApp Cloud API', 'Wix APIs', 'Heroku'],
    demo: 'https://www.minim4you.org',
    isPrivate: true,
    icon: Server,
  },
  {
    id: 'taskflow',
    title: 'TaskFlow',
    category: 'Android',
    categoryLabel: 'Native Android App',
    description:
      'Engineered a modular task-management application and enforced Clean Architecture and MVVM patterns for scalability. Integrated Hilt for dependency injection and Room for local persistence with parameterized SQL queries.',
    detailedContent: {
      overview: [
        'TaskFlow is a robust, **offline-first** productivity platform built entirely natively for Android. The focus was heavily on establishing a scalable foundation utilizing industry-standard **Clean Architecture**, allowing the UI, domain, and data layers to evolve independently without tight coupling.',
        '**The network is optional.** Every action — creating a task, reordering priorities, marking something complete — is written to local storage first and only then reconciled with anything outside the device, so the user never waits on a spinner to see the result of their own tap. `Room` is the single source of truth: every query is exposed as a `Flow`, so a write anywhere in the app re-emits downstream and the list, the calendar and the notification scheduler all observe the same stream rather than keeping their own copies.',
        'Most small task apps start simple and then calcify: business rules leak into the UI, the database schema quietly becomes the app model, and adding something like a calendar view means touching every screen. Splitting the codebase into **Domain, Data and Presentation** layers with dependencies pointing inwards avoids that — the domain layer knows nothing about `Room`, `Compose` or Android at all, which keeps it **unit-testable without an emulator** and makes swapping a data source a contained change instead of a rewrite.',
        '**Scheduling was the other hard part.** Deadline reminders are not held in memory or tied to an activity; they are handed to `WorkManager`, which persists its queue and re-schedules across reboots and process restarts, with each job keyed by task ID so editing a due date replaces the pending work instead of stacking a duplicate. Completion and deletion are likewise modelled as **reversible transitions**, so an accidental swipe costs a tap through the undo snackbar rather than costing the task.',
        'On top of that foundation sits a **Material Design 3** interface written in `Jetpack Compose`: live filtering by status, priority and due date, multi-criteria sorting, and a calendar in both day and month modes driven by the same task store as the list.',
      ],
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
    // Mirrors the private repo gio-manetti.
    id: 'gio-manetti',
    title: 'GIO MANETTI E-Commerce',
    category: 'Fullstack',
    categoryLabel: 'Fullstack E-Commerce Platform',
    description:
      'Architected the system design, data modeling schemas, and AI agent execution plans for a comprehensive full-stack platform leveraging Next.js, Spring Boot, PostgreSQL, and Headless CMS integrations.',
    detailedContent: {
      overview: [
        'GIO MANETTI represents a modern, **luxury e-commerce platform built to handle scale**. This project involved designing the entire data schema from scratch and executing a full-stack implementation plan driven by **AI agent workflows**.',
        '**Luxury retail puts contradictory pressure on a storefront.** Pages must be fast and indexable, which pushes work to the server; merchandising copy changes constantly, which pushes content out of the codebase; and inventory and payment must stay strictly consistent, which pushes transactions into a system that will not lose a write. Each concern was therefore given the tier that actually suits it rather than forcing one stack to do everything.',
        'My work centred on **the design layer** rather than pixel-pushing. That meant modelling the entire schema from scratch — products, variants, media, stock, orders and customers as separate **normalised entities** with the relationships enforced by real constraints. **A product is not a row:** a single size can sell out without affecting its siblings, price history stays attached to the variant that carried it, and merchandising can reorder a collection without a data migration.',
        'Between the storefront and the services sits a **GraphQL / BFF** layer that composes **one response per view**, which collapses page-load waterfalls into a single round trip and insulates the frontend from backend decomposition. Behind it, `Spring Boot` owns money and stock: checkout runs inside **managed transactions** so stock reservation, order creation and payment state move together or not at all — preventing the failure modes that actually matter in retail, like double-selling the last unit or recording an order without payment.',
        'The implementation itself was executed through **structured AI agent workflows**. Each subsystem was specified as an explicit execution plan — data contracts, endpoint shapes, edge cases, definition of done — **before any code was generated**, so the output could be reviewed against a written specification rather than against intuition. That is what kept a fast build from turning into an inconsistent one.',
      ],
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
    id: 'tzachiapp',
    title: 'Tzachi (צח"י) Application',
    category: 'Android',
    categoryLabel: 'Published Native App',
    description:
      'Developed and successfully published a dedicated mobile application for the organization on the Google Play Store. Implemented time-based content flows by integrating external APIs for date-driven logic.',
    detailedContent: {
      overview: [
        'The Tzachi app serves as a **centralized digital platform for community organization** and engagement. It required integrating complex external APIs to calculate date-specific content (**zmanim**) and deploying it fully to production on the Google Play Store.',
        '**This is the project that went the full distance** — from an empty repository to a signed release on Google Play, with everything that implies about store listings, privacy and data-safety declarations, `targetSdk` compliance, versioning and staged rollout. Those are the parts of Android development that never appear in a tutorial, and they continue after launch as policy requirements change.',
        'The technically interesting part is that **most of the content is not static.** Zmanim — the day-dependent times that structure the community schedule — are derived from external data keyed to **both the current date and the device location**, so the same screen shows something different tomorrow, and different again in another city. The time logic was isolated into a dedicated component so it could be reasoned about and corrected in one place, and so it stays correct when the user travels, when the clock crosses midnight, and across daylight-saving boundaries — exactly the cases where naive implementations silently show yesterday.',
        'Because the app also carries announcements and **emergency messaging**, degraded network conditions were treated as a normal operating state rather than an error path. Responses are persisted as they arrive and the UI renders **from that store rather than from the request**, so a failed refresh degrades to slightly older content with a visible indicator instead of an empty screen — which matters most in the very situations where this app gets opened.',
        'The interface is Hebrew and **right-to-left end to end**, not a mirrored afterthought: layout direction, iconography, numerals and mixed-direction strings were each handled explicitly so Hebrew text with embedded Latin or numeric fragments renders in the correct order for an audience with a wide range of technical comfort.',
      ],
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
    id: 'files',
    title: 'Advanced File Manager',
    category: 'Android',
    categoryLabel: 'Native Utility App',
    description:
      'A comprehensive file management application for Android featuring a built-in storage analyzer, advanced search filtering, and robust local file operations.',
    detailedContent: {
      overview: [
        'This native Android application provides users with **complete control over their local device storage**. It was built to handle complex file operations efficiently, featuring a powerful storage analyzer, deep search with granular filters, and a seamless UI for managing files and directories.',
        'It is deliberately **the least forgiving kind of app to build well**: file systems are large, operations are slow, and mistakes are destructive. Directory trees are unbounded and recursive, so a naive storage analysis walks tens of thousands of nodes and freezes the interface. The analyser instead runs its traversal on a **background dispatcher** and emits partial aggregates as it descends, so the breakdown fills in progressively and can be **cancelled** the moment the user navigates away.',
        '**The defining constraint was Scoped Storage.** Modern Android no longer hands an app a raw filesystem path and permission to do as it pleases; access goes through document providers and `MediaStore`, with per-tree grants that must be requested, persisted and re-validated on use. A large part of the engineering was **a single abstraction over those APIs**, so the rest of the app works with domain objects instead of URIs and permission grants — and so it runs on current Android versions without leaning on legacy storage escape hatches.',
        'File operations are treated as things that **can partially fail**. Copy, move and delete run over a selection as a sequence of individually tracked operations, each succeeding or failing on its own with the result surfaced **per item**, so a name collision or a permission denial in the middle of a batch is reported rather than swallowed into a generic error.',
        'On the presentation side everything is `Jetpack Compose`. **Grid and list are two renderings of the same state**, not two screens — selection, sorting and filtering live in the `ViewModel`, so switching layout preserves whatever the user had set up. Search layers filters over file type, size range and modification date, and every piece of real work runs off the main thread on **coroutines** so the interface never blocks on a slow volume.',
      ],
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
    id: 'statussaver',
    title: 'WhatsApp Status Utility',
    category: 'Android',
    categoryLabel: 'Android Utility App',
    description:
      'Designed and built a specialized Android application utilizing Kotlin and Jetpack Compose to streamline the saving and sharing of WhatsApp statuses.',
    detailedContent: {
      overview: [
        'A **lightweight, high-performance utility** that helps users manage, save, and share temporary media statuses from WhatsApp, built entirely with modern Android frameworks.',
        'The app detects **cached status media** on the device, presents it in an in-app viewer, and saves selected items into the user gallery as ordinary, permanent files — keeping media that would otherwise be lost when the **24-hour window** closes.',
        'It is intentionally small: **the whole product is one job done cleanly**, which made it a good place to be strict about the things usually compromised in small apps. The codebase is **100% Kotlin** with a pure `Compose` UI and no legacy view interop, and all media I/O runs on **coroutines**.',
        'The interesting constraint is **storage access**. Status media lives in a cache the app does not own, on a platform that has deliberately made cross-app file access indirect — so getting from *"this video exists somewhere on the device"* to *"this video is permanently in the gallery and shareable"* happens entirely through mediated APIs. Saving is a `MediaStore` insert into the shared media collection rather than a copy to a hard-coded path, so the system **indexes the file on insert** and it appears in the gallery immediately, behaving like any other user media.',
        'Performance and sharing got the same treatment. Status media is largely video, and **decoding thumbnails on the UI thread is the fastest way to make a grid feel broken** — so decoding runs on background dispatchers with results cached and work bound to the composition lifecycle. Outbound sharing uses system intents carrying **content URIs with a temporary permission grant**, giving the receiving app exactly the access it needs for that one action and nothing more.',
      ],
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

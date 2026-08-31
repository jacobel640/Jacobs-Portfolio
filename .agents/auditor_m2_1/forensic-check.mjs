import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve('C:\\Users\\jacob\\Files\\Programming\\Antigravity\\Jacobs-protofilio');

console.log('======================================================================');
console.log('🔍 FORENSIC INTEGRITY AUDIT SUITE — MILESTONE 2 REDESIGN');
console.log('======================================================================');

let passCount = 0;
let failCount = 0;

function auditCheck(name, condition, errorMsg = '') {
  if (condition) {
    passCount++;
    console.log(`  [PASS] ${name}`);
  } else {
    failCount++;
    console.error(`  [FAIL] ${name}: ${errorMsg}`);
  }
}

// 1. Prohibited Pattern & Facade Detection
console.log('\n--- Phase 1: Prohibited Patterns & Facade Detection ---');

const srcFiles = [
  path.join(projectRoot, 'src', 'App.tsx'),
  path.join(projectRoot, 'src', 'components', 'Navbar.tsx'),
  path.join(projectRoot, 'src', 'components', 'Hero.tsx'),
  path.join(projectRoot, 'src', 'components', 'Skills.tsx'),
  path.join(projectRoot, 'src', 'components', 'Projects.tsx'),
  path.join(projectRoot, 'src', 'components', 'Contact.tsx'),
  path.join(projectRoot, 'tailwind.config.js'),
  path.join(projectRoot, 'src', 'index.css'),
];

for (const filePath of srcFiles) {
  const relPath = path.relative(projectRoot, filePath);
  auditCheck(`Source file exists: ${relPath}`, fs.existsSync(filePath));
  if (!fs.existsSync(filePath)) continue;

  const content = fs.readFileSync(filePath, 'utf-8');

  // Check for dummy return constants or empty implementations
  const isDummy = /return\s+(?:null|undefined|""|false|true|0)\s*;?\s*\}/.test(content) && !content.includes('modal') && !content.includes('copied');
  auditCheck(`No facade dummy return in ${relPath}`, !isDummy, 'Found potential dummy return');

  // Check for NotImplemented
  auditCheck(`No NotImplementedError or placeholder stubs in ${relPath}`, !content.includes('NotImplemented') && !content.includes('TODO: implement'));

  // Check for hardcoded test bypasses
  auditCheck(`No hardcoded test bypass flags in ${relPath}`, !content.includes('__MOCK_TEST_BYPASS__'));
}

// 2. Component Design & Glassmorphism Verification
console.log('\n--- Phase 2: Design System & Component Verification ---');

// Tailwind Config
const tailwindContent = fs.readFileSync(path.join(projectRoot, 'tailwind.config.js'), 'utf-8');
auditCheck('Tailwind config darkMode enabled', tailwindContent.includes("darkMode: 'class'"));
auditCheck('Tailwind config canvas colors defined', tailwindContent.includes('#030712') && tailwindContent.includes('canvas'));
auditCheck('Tailwind config radial-glow gradients defined', tailwindContent.includes('radial-glow-cyan') && tailwindContent.includes('radial-glow-indigo'));
auditCheck('Tailwind config glass shadows defined', tailwindContent.includes('glass-sm') && tailwindContent.includes('glass-md') && tailwindContent.includes('glass-lg'));

// index.css
const cssContent = fs.readFileSync(path.join(projectRoot, 'src', 'index.css'), 'utf-8');
auditCheck('index.css has dark background setup', cssContent.includes('#030712') && cssContent.includes('color-scheme: dark'));
auditCheck('index.css defines .glass-panel', cssContent.includes('.glass-panel') && cssContent.includes('backdrop-filter'));
auditCheck('index.css defines .glass-card', cssContent.includes('.glass-card') && cssContent.includes('backdrop-filter'));
auditCheck('index.css defines -webkit-backdrop-filter prefix', cssContent.includes('-webkit-backdrop-filter'));

// Navbar.tsx
const navbarContent = fs.readFileSync(path.join(projectRoot, 'src', 'components', 'Navbar.tsx'), 'utf-8');
auditCheck('Navbar.tsx has named & default export', navbarContent.includes('export const Navbar') && navbarContent.includes('export default Navbar'));
auditCheck('Navbar.tsx has active section detection', navbarContent.includes('activeSection') && navbarContent.includes('handleScroll'));
auditCheck('Navbar.tsx has layoutId indicator animation', navbarContent.includes('layoutId="activeNavbarIndicator"'));
auditCheck('Navbar.tsx has mobile menu toggle', navbarContent.includes('mobileMenuOpen') && navbarContent.includes('AnimatePresence'));
auditCheck('Navbar.tsx has Jacob.dev brand monogram', navbarContent.includes('Jacob') && navbarContent.includes('.dev'));

// Hero.tsx
const heroContent = fs.readFileSync(path.join(projectRoot, 'src', 'components', 'Hero.tsx'), 'utf-8');
auditCheck('Hero.tsx has named & default export', heroContent.includes('export const Hero') && heroContent.includes('export default Hero'));
auditCheck('Hero.tsx has Jacob Elcharar heading', heroContent.includes('Jacob Elcharar'));
auditCheck('Hero.tsx has availability badge', heroContent.includes('Available for new opportunities'));
auditCheck('Hero.tsx has interactive CTA buttons', heroContent.includes('Explore Projects') && heroContent.includes('Get In Touch'));
auditCheck('Hero.tsx has scroll indicator to #skills', heroContent.includes('href="#skills"'));

// Skills.tsx
const skillsContent = fs.readFileSync(path.join(projectRoot, 'src', 'components', 'Skills.tsx'), 'utf-8');
auditCheck('Skills.tsx has named & default export', skillsContent.includes('export const Skills') && skillsContent.includes('export default Skills'));
auditCheck('Skills.tsx has Android Development category', skillsContent.includes('Android Development') && skillsContent.includes('Jetpack Compose'));
auditCheck('Skills.tsx has Backend & Cloud Systems category', skillsContent.includes('Backend & Cloud Systems') && skillsContent.includes('Spring Boot'));
auditCheck('Skills.tsx has AI Workflows category', skillsContent.includes('AI Workflows & Dev Tools') && skillsContent.includes('Antigravity'));

// Projects.tsx
const projectsContent = fs.readFileSync(path.join(projectRoot, 'src', 'components', 'Projects.tsx'), 'utf-8');
auditCheck('Projects.tsx has named & default export', projectsContent.includes('export const Projects') && projectsContent.includes('export default Projects'));
auditCheck('Projects.tsx contains all 6 project entries',
  projectsContent.includes('taskflow') &&
  projectsContent.includes('gio-manetti') &&
  projectsContent.includes('tzachi-community') &&
  projectsContent.includes('files-migration') &&
  projectsContent.includes('e-commerce-waba') &&
  projectsContent.includes('whatsapp-status')
);
auditCheck('Projects.tsx contains verbatim fallback text', projectsContent.includes('No screenshots available to display'));
auditCheck('Projects.tsx has interactive filter tabs (All, Android, Fullstack, Backend)', projectsContent.includes('FilterType') && projectsContent.includes('activeFilter'));
auditCheck('Projects.tsx has modal with AnimatePresence', projectsContent.includes('selectedProject') && projectsContent.includes('AnimatePresence'));
auditCheck('Projects.tsx has image Lightbox zoom overlay', projectsContent.includes('selectedImage') && projectsContent.includes('max-w-5xl'));

// Contact.tsx
const contactContent = fs.readFileSync(path.join(projectRoot, 'src', 'components', 'Contact.tsx'), 'utf-8');
auditCheck('Contact.tsx has named & default export', contactContent.includes('export const Contact') && contactContent.includes('export default Contact'));
auditCheck('Contact.tsx has email copy interaction', contactContent.includes('navigator.clipboard.writeText') && contactContent.includes('Copied!'));
auditCheck('Contact.tsx has LinkedIn, GitHub, Email social cards', contactContent.includes('Linkedin') && contactContent.includes('Github') && contactContent.includes('mailto:Jacobel640@gmail.com'));
auditCheck('Contact.tsx has smooth scroll-to-top handler', contactContent.includes('scrollToTop') && contactContent.includes('window.scrollTo'));

// App.tsx
const appContent = fs.readFileSync(path.join(projectRoot, 'src', 'App.tsx'), 'utf-8');
auditCheck('App.tsx mounts Navbar, Hero, Skills, Projects, Contact',
  appContent.includes('<Navbar />') &&
  appContent.includes('<Hero />') &&
  appContent.includes('<Skills />') &&
  appContent.includes('<Projects />') &&
  appContent.includes('<Contact />')
);
auditCheck('App.tsx has ambient lighting layers', appContent.includes('blur-[140px]'));

// 3. Asset Integrity Verification
console.log('\n--- Phase 3: Asset Integrity (All 22 PNGs) ---');

const expectedScreenshots = {
  taskflow: [
    'HomeScreen_filters.png',
    'SingleTaskScreen.png',
    'AddEditTaskScreen.png',
    'CalendarScreen_day.png',
    'CalendarScreen_month.png',
    'HomeScreen_sorting.png',
    'HomeScreen_mark-completed_undo-deletion.png',
    'NotificationTimeDialog.png',
    'app_icon.png'
  ],
  'files-migration': [
    'main_screen.png',
    'file_explorer_grid.png',
    'file_explorer_row.png',
    'file_actions.png',
    'search_screen.png',
    'search_filters_1.png',
    'search_filters_2.png',
    'sort_options_sheet.png',
    'selected_file_details.png',
    'multi_selected_details.png',
    'last_files.png',
    'storage_analizer.png',
    'copy_navigation.png'
  ]
};

let verifiedPngCount = 0;
for (const [folder, files] of Object.entries(expectedScreenshots)) {
  const dirPath = path.join(projectRoot, 'public', 'screenshots', folder);
  auditCheck(`Screenshots folder exists: ${folder}`, fs.existsSync(dirPath));
  if (!fs.existsSync(dirPath)) continue;

  for (const f of files) {
    const filePath = path.join(dirPath, f);
    auditCheck(`Screenshot file exists: ${folder}/${f}`, fs.existsSync(filePath));
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      auditCheck(`Screenshot non-empty (>1024B): ${folder}/${f}`, stats.size > 1024, `Size is ${stats.size} bytes`);
      const buf = fs.readFileSync(filePath);
      const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47 &&
                    buf[4] === 0x0D && buf[5] === 0x0A && buf[6] === 0x1A && buf[7] === 0x0A;
      auditCheck(`Screenshot valid PNG magic bytes: ${folder}/${f}`, isPng);
      if (isPng) verifiedPngCount++;
    }
  }
}

auditCheck('Total verified PNGs count is exactly 22', verifiedPngCount === 22, `Found ${verifiedPngCount}`);

console.log('\n======================================================================');
console.log(`TOTAL FORENSIC AUDIT CHECKS: ${passCount + failCount}`);
console.log(`PASSED: ${passCount}`);
console.log(`FAILED: ${failCount}`);
console.log(`AUDIT VERDICT: ${failCount === 0 ? 'CLEAN (PASS)' : 'INTEGRITY VIOLATION (FAIL)'}`);
console.log('======================================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}

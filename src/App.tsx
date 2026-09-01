import { FC, lazy, Suspense } from 'react';
import { MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import { SkillsSkeleton, ProjectsSkeleton, ContactSkeleton } from './components/GlassSkeleton';
import { useHashScroll } from './hooks/useHashScroll';

const Skills = lazy(() => import('./components/Skills'));
const Projects = lazy(() => import('./components/Projects'));
const Contact = lazy(() => import('./components/Contact'));

export const App: FC = () => {
  useHashScroll();

  return (
    <MotionConfig reducedMotion="user">
    <div className="relative min-h-screen bg-[#030712] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Global Ambient Background Lights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-indigo-900/15 via-blue-900/10 to-transparent blur-[140px]" />
        <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[130px]" />
        <div className="absolute top-2/3 -right-40 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[140px]" />
      </div>

      <Navbar />

      <main className="relative">
        <Hero />
        <Suspense fallback={<SkillsSkeleton />}>
          <Skills />
        </Suspense>
        <Suspense fallback={<ProjectsSkeleton />}>
          <Projects />
        </Suspense>
      </main>

      <Suspense fallback={<ContactSkeleton />}>
        <Contact />
      </Suspense>
    </div>
    </MotionConfig>
  );
};

export default App;

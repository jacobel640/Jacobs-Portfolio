import { FC, lazy, Suspense, useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import { SkillsSkeleton, ProjectsSkeleton, ContactSkeleton } from './components/GlassSkeleton';
import { useHashScroll } from './hooks/useHashScroll';
import { useRouter } from './router-core';
import { resolveRoute, SITE_ORIGIN } from './routes';

const Skills = lazy(() => import('./components/Skills'));
const Projects = lazy(() => import('./components/Projects'));
const Contact = lazy(() => import('./components/Contact'));
const ProjectCaseStudy = lazy(() => import('./components/ProjectCaseStudy'));

const Home: FC = () => {
  useHashScroll();
  return (
    <main className="relative">
      <Hero />
      <Suspense fallback={<SkillsSkeleton />}>
        <Skills />
      </Suspense>
      <Suspense fallback={<ProjectsSkeleton />}>
        <Projects />
      </Suspense>
    </main>
  );
};

const NotFound: FC = () => (
  <main className="relative min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-32">
    <p className="text-sm font-bold uppercase tracking-wider text-blue-400 mb-3">404</p>
    <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Page not found</h1>
    <p className="text-slate-400 max-w-md mb-8">
      That page does not exist. The projects and case studies are all on the home page.
    </p>
    <a
      href="/"
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm"
    >
      Back to the portfolio
    </a>
  </main>
);

/**
 * Keeps the document head in step with client-side navigation.
 *
 * Each route ships as its own prerendered HTML file, so the head is already
 * correct on a cold load; this only matters once the router swaps pages
 * without a request, where the title in the tab and the canonical link would
 * otherwise still describe the page the visitor arrived on.
 */
const useDocumentMeta = (path: string): void => {
  useEffect(() => {
    const resolved = resolveRoute(path);
    if (resolved.kind === 'not-found') return;

    document.title = resolved.meta.title;

    const setAttr = (selector: string, attribute: string, value: string) => {
      const node = document.head.querySelector(selector);
      if (node) node.setAttribute(attribute, value);
    };
    setAttr('meta[name="description"]', 'content', resolved.meta.description);
    setAttr('link[rel="canonical"]', 'href', `${SITE_ORIGIN}${resolved.meta.path}`);
    setAttr('meta[property="og:title"]', 'content', resolved.meta.ogTitle);
    setAttr('meta[property="og:description"]', 'content', resolved.meta.ogDescription);
    setAttr('meta[property="og:url"]', 'content', `${SITE_ORIGIN}${resolved.meta.path}`);
    setAttr('meta[property="og:type"]', 'content', resolved.meta.ogType);
  }, [path]);
};

export const App: FC = () => {
  const { path } = useRouter();
  const resolved = resolveRoute(path);
  useDocumentMeta(path);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-[#030712] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
        {/* Global Ambient Background Lights */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="ambient-glow absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-indigo-900/15 via-blue-900/10 to-transparent blur-[140px]" />
          <div className="ambient-glow absolute top-1/3 -left-40 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[130px]" />
          <div className="ambient-glow absolute top-2/3 -right-40 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[140px]" />
        </div>

        <Navbar />

        {resolved.kind === 'home' && <Home />}

        {resolved.kind === 'project' && (
          <Suspense fallback={<ProjectsSkeleton />}>
            <ProjectCaseStudy project={resolved.project} />
          </Suspense>
        )}

        {resolved.kind === 'not-found' && <NotFound />}

        <Suspense fallback={<ContactSkeleton />}>
          <Contact />
        </Suspense>
      </div>
    </MotionConfig>
  );
};

export default App;

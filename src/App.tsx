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
    <p className="text-sm font-medium uppercase tracking-wider text-md-primary mb-3">404</p>
    <h1 className="text-3xl sm:text-4xl font-normal text-md-on-surface mb-4">Page not found</h1>
    <p className="text-md-on-surface-variant max-w-md mb-8">
      That page does not exist. The projects and case studies are all on the home page.
    </p>
    <a
      href="/"
      className="state-layer md-focus inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-md-primary text-md-on-primary font-medium text-sm transition-shadow duration-medium ease-emphasized hover:shadow-md-1"
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
      <div className="relative min-h-screen bg-md-surface text-md-on-surface">
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

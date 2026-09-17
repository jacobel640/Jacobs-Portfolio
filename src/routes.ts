import { projects, type Project } from './data/projects';
import { normalisePath } from './router-core';

/** Absolute origin, used for canonical and Open Graph URLs. */
export const SITE_ORIGIN = 'https://jacobelcharar.dev';

export const OG_IMAGE = `${SITE_ORIGIN}/og-image.png`;

/** The per-document head. Both the app and `scripts/prerender.mjs` read this. */
export interface RouteMeta {
  /** Path with no trailing slash, as `normalisePath` produces. */
  path: string;
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogType: 'website' | 'article';
}

/**
 * Trims to something a search result can show in full.
 *
 * Cuts on a word boundary and appends an ellipsis, rather than truncating
 * mid-word — the description is the line under the title in a result, and a
 * severed word reads as a broken page.
 */
export function clampDescription(text: string, limit = 155): string {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : limit).trimEnd()}…`;
}

export const HOME_META: RouteMeta = {
  path: '/',
  title: 'Jacob Elcharar | Android Software Engineer',
  description:
    'Jacob Elcharar — Android Software Engineer and Fullstack Developer. Native Android with Kotlin, Jetpack Compose, Clean Architecture and MVVM, backed by Spring Boot services.',
  ogTitle: 'Jacob Elcharar | Android Software Engineer',
  ogDescription:
    'Native Android engineering with Kotlin, Jetpack Compose, Clean Architecture and MVVM — complemented by scalable Spring Boot backend services.',
  ogType: 'website',
};

export const projectPath = (project: Project): string => `/projects/${project.id}`;

export function projectMeta(project: Project): RouteMeta {
  const description = clampDescription(project.description);
  return {
    path: projectPath(project),
    title: `${project.title} — ${project.categoryLabel} | Jacob Elcharar`,
    description,
    ogTitle: `${project.title} — ${project.categoryLabel}`,
    ogDescription: description,
    // A case study is a standalone piece of writing, not the site's front door.
    ogType: 'article',
  };
}

/** Every route the build prerenders, home first. */
export const ALL_ROUTES: RouteMeta[] = [HOME_META, ...projects.map(projectMeta)];

export type Resolved =
  | { kind: 'home'; meta: RouteMeta }
  | { kind: 'project'; project: Project; meta: RouteMeta }
  | { kind: 'not-found' };

export function resolveRoute(rawPath: string): Resolved {
  const path = normalisePath(rawPath);
  if (path === '/') return { kind: 'home', meta: HOME_META };

  const match = path.match(/^\/projects\/([A-Za-z0-9._-]+)$/);
  if (match) {
    const project = projects.find((candidate) => candidate.id === match[1]);
    if (project) return { kind: 'project', project, meta: projectMeta(project) };
  }

  return { kind: 'not-found' };
}

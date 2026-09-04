/**
 * Site-level switches for content that depends on a file being present in
 * `public/`.
 *
 * A portfolio that links to a résumé that is not deployed is worse than one
 * that does not offer it at all — a recruiter clicking through to a 404 is the
 * one moment the site cannot afford. So the assets below are opt-in: the UI
 * that depends on them renders only once the constant names a real file, and
 * the whole switch is a single line rather than a hunt through components.
 */

/**
 * Public path to the résumé PDF, or `null` while there is none.
 *
 * To turn it on: drop the file at `public/resume.pdf` and set this to
 * `'/resume.pdf'`. The Navbar and Hero links appear on the next build, opening
 * in a new tab rather than forcing a download — a recruiter skimming in the
 * browser should not have to manage a file to read one page.
 */
export const RESUME_URL: string | null = null;

/**
 * Public path to the profile photograph, or `null` while there is none.
 *
 * To turn it on: drop the file at `public/profile.jpg` (or `.webp`) and set
 * this to that path. Until then the About portrait frame renders an initials
 * monogram in the same geometry, so the section is complete either way rather
 * than carrying a hole where an image should be.
 *
 * Recommended source: a square headshot, at least 800×800, exported at roughly
 * 400×400 for the frame it is displayed in.
 */
export const PROFILE_IMAGE: string | null = null;

/** Alt text for the profile photograph. Ignored while `PROFILE_IMAGE` is null. */
export const PROFILE_IMAGE_ALT = 'Jacob Elcharar';

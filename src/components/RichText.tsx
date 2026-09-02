import { FC, Fragment, ReactNode } from 'react';

/**
 * Minimal inline markup for prose copy. Three tokens only:
 *
 *   **bold**   → emphasised, brighter than the surrounding text
 *   *italic*   → light emphasis, for quoted phrasing and asides
 *   `code`     → monospace chip, for APIs, types and library names
 *
 * Deliberately not a Markdown parser — the copy in `data/projects.ts` is
 * trusted, hand-written content, so a split on the three delimiters is enough
 * and avoids pulling a renderer into the bundle. The bold alternative is
 * listed first so `**x**` never matches as an empty italic pair.
 */
const TOKEN = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;

export const RichText: FC<{ children: string }> = ({ children }) => {
  const parts = children.split(TOKEN).filter(Boolean);

  return (
    <>
      {parts.map((part, idx): ReactNode => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={idx} className="font-semibold text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }

        if (part.startsWith('*') && part.endsWith('*')) {
          return (
            <em key={idx} className="italic text-slate-200">
              {part.slice(1, -1)}
            </em>
          );
        }

        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={idx}
              className="font-mono text-[0.85em] text-blue-300 bg-blue-500/[0.08] border border-blue-500/20 rounded-md px-1.5 py-0.5 whitespace-nowrap"
            >
              {part.slice(1, -1)}
            </code>
          );
        }

        return <Fragment key={idx}>{part}</Fragment>;
      })}
    </>
  );
};

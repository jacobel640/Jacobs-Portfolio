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
 * and avoids pulling a renderer into the bundle.
 *
 * Both asterisk forms require a non-space character immediately inside each
 * delimiter, the same rule Markdown uses. Without it, ordinary prose gets
 * eaten: "3 * 4 * 5" would tokenise as an italic " 4 " and lose its
 * asterisks. Bold is listed first so `**x**` never matches as an italic pair.
 */
const TOKEN = /(\*\*[^\s*](?:[^*]*[^\s*])?\*\*|\*[^\s*](?:[^*]*[^\s*])?\*|`[^`]+`)/g;

export const RichText: FC<{ children: string }> = ({ children }) => {
  // `split` with a capture group interleaves the two kinds of part: even
  // indices are always literal text, odd indices are always a matched token.
  // Classifying on that parity — rather than on how a part happens to start
  // and end — is what keeps an unpaired delimiter rendering as itself. Sniffing
  // the ends instead would read a stray "**" between two tokens as a bold pair
  // and swallow it into an empty <strong>. Empty strings are skipped in place
  // rather than filtered out, since filtering would break the parity.
  const parts = children.split(TOKEN);

  return (
    <>
      {parts.map((part, idx): ReactNode => {
        if (!part) return null;

        if (idx % 2 === 0) {
          return <Fragment key={idx}>{part}</Fragment>;
        }

        if (part.startsWith('**')) {
          return (
            <strong key={idx} className="font-semibold text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }

        if (part.startsWith('`')) {
          return (
            <code
              key={idx}
              className="font-mono text-[0.85em] text-blue-300 bg-blue-500/[0.08] border border-blue-500/20 rounded-md px-1.5 py-0.5 whitespace-nowrap"
            >
              {part.slice(1, -1)}
            </code>
          );
        }

        return (
          <em key={idx} className="italic text-slate-200">
            {part.slice(1, -1)}
          </em>
        );
      })}
    </>
  );
};

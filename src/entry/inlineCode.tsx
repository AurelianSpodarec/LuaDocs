import { Fragment, type ReactNode } from 'react';

/** Backtick-delimited spans, as markdown marks inline code. */
const CODE = /`([^`]+)`/g;

/**
 * A plain string with its identifiers set in the mono face.
 *
 * For the strings on an entry that do not come from MDX and therefore get no markdown
 * pass of their own. There are two: a change note, which is a string in the compat
 * dataset, and an entry's frontmatter `description`, which the route renders straight
 * into a paragraph. Both are prose that names code, and in both the identifier used to
 * arrive indistinguishable from the words around it — a note reading "Adds %p, extends
 * %q to more value kinds", or a description reading "without letting a __len metamethod
 * answer instead".
 *
 * Backticks rather than a richer syntax: these are one sentence each, the only markup
 * they have ever wanted is inline code, and every author on this project already writes
 * a backtick for it. An unmatched backtick is left as written rather than swallowed — a
 * stray tick is a typo worth seeing, not worth hiding.
 *
 * The `description` case has one constraint the change-note case does not: the raw
 * string is what a search index and a meta tag would want, backticks and all. Only the
 * rendered paragraph goes through here, so the frontmatter stays the source of truth.
 */
export function renderInlineCode(text: string): ReactNode {
  const parts: ReactNode[] = [];
  let last = 0;

  for (const match of text.matchAll(CODE)) {
    const start = match.index;
    if (start > last) parts.push(text.slice(last, start));
    parts.push(
      <code key={start} className="rounded bg-fd-muted px-1 py-0.5 font-mono text-[0.9em]">
        {match[1]}
      </code>,
    );
    last = start + match[0].length;
  }

  if (parts.length === 0) return text;
  if (last < text.length) parts.push(text.slice(last));

  return parts.map((part, index) => <Fragment key={index}>{part}</Fragment>);
}

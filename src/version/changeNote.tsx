import { Fragment, type ReactNode } from 'react';

/** Backtick-delimited spans, as markdown marks inline code. */
const CODE = /`([^`]+)`/g;

/**
 * A change note, with its identifiers set in the mono face.
 *
 * Notes are plain strings in the compat dataset, and a dataset entry is not MDX — so a
 * note reading "Adds %p, extends %q to more value kinds" arrived as prose, with the two
 * specifiers indistinguishable from the words around them. That is the one place on an
 * entry where code was not marked as code.
 *
 * Backticks rather than a richer syntax: the notes are one sentence each, the only
 * markup they have ever wanted is inline code, and every author on this project already
 * writes a backtick for it. An unmatched backtick is left as written rather than
 * swallowed — a stray tick is a typo worth seeing, not worth hiding.
 */
export function renderChangeNote(note: string): ReactNode {
  const parts: ReactNode[] = [];
  let last = 0;

  for (const match of note.matchAll(CODE)) {
    const start = match.index;
    if (start > last) parts.push(note.slice(last, start));
    parts.push(
      <code key={start} className="rounded bg-fd-muted px-1 py-0.5 font-mono text-[0.9em]">
        {match[1]}
      </code>,
    );
    last = start + match[0].length;
  }

  if (parts.length === 0) return note;
  if (last < note.length) parts.push(note.slice(last));

  return parts.map((part, index) => <Fragment key={index}>{part}</Fragment>);
}

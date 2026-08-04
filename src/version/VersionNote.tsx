import { changeNoteFor, isAvailable } from '@/compat/resolve';
import type { CompatNode } from '@/compat/schema';
import { CircleAlert, Info } from 'lucide-react';
import { useSelectedVersion } from './SelectedVersionProvider';

/**
 * The inline delta for the selected version — either an availability bound or a
 * change note. Always inline, never a modal.
 *
 * The two read as one family of callout and differ only in accent: amber for "this
 * does not exist where you are", blue for "it exists but behaves differently". The
 * heavy inline-start border is what makes it scannable when a reader skims the top
 * of an entry looking for the version facts.
 */
const noteClass =
  'not-prose flex items-start gap-2.5 rounded-lg border border-s-4 px-3.5 py-2.5 text-sm leading-6';

export function VersionNote({ node, name }: { node: CompatNode; name: string }) {
  const { version } = useSelectedVersion();

  if (!isAvailable(node, version)) {
    const added = node.support.lua.version_added;
    return (
      <p
        data-note="unavailable"
        className={`${noteClass} border-amber-500/30 border-s-amber-500 bg-amber-500/8`}
      >
        <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <span>
          <strong>Not in Lua {version}.</strong>{' '}
          {added === false
            ? `${name} is not part of any documented Lua version.`
            : `${name} was introduced in Lua ${added}.`}
        </span>
      </p>
    );
  }

  const note = changeNoteFor(node, version);
  if (!note) return null;

  return (
    <p
      data-note="changed"
      className={`${noteClass} border-blue-500/30 border-s-blue-500 bg-blue-500/8`}
    >
      <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-400" />
      <span>
        <strong>Changed in Lua {version}:</strong> {note}
      </span>
    </p>
  );
}

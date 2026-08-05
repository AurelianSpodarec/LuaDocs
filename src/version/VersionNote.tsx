import { changeNoteFor, isAvailable } from '@/compat/resolve';
import type { CompatNode } from '@/compat/schema';
import { Callout } from '@/entry/Callout';
import { renderChangeNote } from './changeNote';
import { useSelectedVersion } from './SelectedVersionProvider';

/**
 * The two inline deltas are split because they are not the same kind of fact.
 *
 * A change note *qualifies* the entry: everything below it still applies, with one
 * detail different. "Not in Lua 5.1" *invalidates* it — the syntax, the parameters, the
 * examples and the gotchas below all describe something the reader cannot call. So the
 * first belongs beside the version strip it elaborates, and the second belongs above
 * everything, before the reader has invested in reading.
 *
 * `data-note` is what `tests/e2e/string-format.test.tsx` queries; both keep theirs.
 */

/** Renders only when the entry does not exist in the selected version. */
export function VersionUnavailable({ node }: { node: CompatNode }) {
  const { version } = useSelectedVersion();
  if (isAvailable(node, version)) return null;

  const added = node.support.lua.version_added;

  return (
    <Callout kind="unavailable">
      <span data-note="unavailable">
        {/* Subject-free on purpose. Building the sentence from the entry's title read
            "Format strings for pack and unpack was introduced in Lua 5.3" — the verb
            cannot agree with a title it does not know the number of, and the title is
            directly above the callout anyway. */}
        <strong>Not in Lua {version}.</strong>{' '}
        {added === false
          ? 'Not part of any documented Lua version.'
          : `Introduced in Lua ${added}.`}{' '}
        Everything below describes it as it exists from then on.
      </span>
    </Callout>
  );
}

/** Renders only when the entry exists here but behaves differently. */
export function VersionChangeNote({ node }: { node: CompatNode }) {
  const { version } = useSelectedVersion();
  if (!isAvailable(node, version)) return null;

  const note = changeNoteFor(node, version);
  if (!note) return null;

  return (
    <Callout kind="changed">
      <span data-note="changed">
        <strong>Changed in Lua {version}:</strong> {renderChangeNote(note)}
      </span>
    </Callout>
  );
}

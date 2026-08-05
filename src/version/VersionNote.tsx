import { changeNoteFor, isAvailable } from '@/compat/resolve';
import type { CompatNode } from '@/compat/schema';
import { Callout } from '@/entry/Callout';
import { useSelectedVersion } from './SelectedVersionProvider';

/**
 * The inline delta for the selected version — either an availability bound or a
 * change note. Always inline, never a modal.
 *
 * It draws on the shared callout shell in two derived kinds: amber for "this does not
 * exist where you are", blue for "it exists but behaves differently". `data-note` is
 * what `tests/e2e/string-format.test.tsx` queries.
 */
export function VersionNote({ node }: { node: CompatNode }) {
  const { version } = useSelectedVersion();

  if (!isAvailable(node, version)) {
    const added = node.support.lua.version_added;
    return (
      <Callout kind="unavailable">
        <span data-note="unavailable">
          <strong>Not in Lua {version}.</strong>{' '}
          {/* Subject-free on purpose. Building the sentence from the entry's title read
              "Format strings for pack and unpack was introduced in Lua 5.3" — the verb
              cannot agree with a title it does not know the number of, and the title is
              directly above the callout anyway. */}
          {added === false
            ? 'Not part of any documented Lua version.'
            : `Introduced in Lua ${added}.`}
        </span>
      </Callout>
    );
  }

  const note = changeNoteFor(node, version);
  if (!note) return null;

  return (
    <Callout kind="changed">
      <span data-note="changed">
        <strong>Changed in Lua {version}:</strong> {note}
      </span>
    </Callout>
  );
}

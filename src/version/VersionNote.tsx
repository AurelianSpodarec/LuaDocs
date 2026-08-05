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
export function VersionNote({ node, name }: { node: CompatNode; name: string }) {
  const { version } = useSelectedVersion();

  if (!isAvailable(node, version)) {
    const added = node.support.lua.version_added;
    return (
      <Callout kind="unavailable">
        <span data-note="unavailable">
          <strong>Not in Lua {version}.</strong>{' '}
          {added === false
            ? `${name} is not part of any documented Lua version.`
            : `${name} was introduced in Lua ${added}.`}
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

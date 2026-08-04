import { changeNoteFor, isAvailable } from '@/compat/resolve';
import type { CompatNode } from '@/compat/schema';
import { useSelectedVersion } from './SelectedVersionProvider';

/**
 * The inline delta for the selected version — either an availability bound or a
 * change note. Always inline, never a modal.
 */
export function VersionNote({ node, name }: { node: CompatNode; name: string }) {
  const { version } = useSelectedVersion();

  if (!isAvailable(node, version)) {
    const added = node.support.lua.version_added;
    return (
      <p data-note="unavailable" className="rounded border px-3 py-2 text-sm">
        <strong>Not in Lua {version}.</strong>{' '}
        {added === false
          ? `${name} is not part of any documented Lua version.`
          : `${name} was introduced in Lua ${added}.`}
      </p>
    );
  }

  const note = changeNoteFor(node, version);
  if (!note) return null;

  return (
    <p data-note="changed" className="rounded border px-3 py-2 text-sm">
      <strong>Changed in Lua {version}:</strong> {note}
    </p>
  );
}

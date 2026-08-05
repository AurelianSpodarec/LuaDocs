import { LUA_VERSIONS, type CompatNode, type LuaVersion } from './schema';

const idx = (v: LuaVersion) => LUA_VERSIONS.indexOf(v);

export function isAvailable(node: CompatNode, v: LuaVersion): boolean {
  const added = node.support.lua.version_added;
  if (added === false) return false;
  const removed = node.support.lua.version_removed;
  if (idx(v) < idx(added)) return false;
  if (removed && idx(v) >= idx(removed)) return false;
  return true;
}

export function changeNoteFor(node: CompatNode, v: LuaVersion): string | null {
  return node.changed_in?.[v] ?? null;
}

export function supportRow(node: CompatNode) {
  return LUA_VERSIONS.map((version) => {
    if (!isAvailable(node, version)) return { version, state: 'no' as const };
    if (changeNoteFor(node, version)) return { version, state: 'changed' as const };
    return { version, state: 'yes' as const };
  });
}

/**
 * Does any documented version differ from the rest?
 *
 * The detailed matrix renders only when this is true. On an entry available
 * everywhere and changed nowhere it would be five identical rows restating the strip
 * at the top of the page — `page-structure.md`, prototype finding #2.
 */
export function varies(node: CompatNode): boolean {
  if (node.support.lua.version_added !== LUA_VERSIONS[0]) return true;
  if (node.support.lua.version_removed) return true;

  return Object.keys(node.changed_in ?? {}).length > 0;
}

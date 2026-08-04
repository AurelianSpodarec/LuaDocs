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

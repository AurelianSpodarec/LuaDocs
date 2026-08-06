import { LUA_VERSIONS, type CompatNode, type LuaVersion } from './schema';

const idx = (v: LuaVersion) => LUA_VERSIONS.indexOf(v);

/**
 * The one function that reads the bounds. Everything else here — and every surface
 * above it — asks this, per version, which is why the gap `version_restored` opens
 * needed no second branch anywhere downstream.
 */
export function isAvailable(node: CompatNode, v: LuaVersion): boolean {
  const { version_added: added, version_removed: removed, version_restored: restored } =
    node.support.lua;
  if (added === false) return false;
  if (idx(v) < idx(added)) return false;
  if (!removed || idx(v) < idx(removed)) return true;
  // Inside or past the gap: only a reopening puts the entry back.
  return restored ? idx(v) >= idx(restored) : false;
}

export function changeNoteFor(node: CompatNode, v: LuaVersion): string | null {
  return node.changed_in?.[v] ?? null;
}

/**
 * Why an entry is missing from a version — four cases, not one.
 *
 * `version_added` alone answered only the first of them, which is how a removed entry
 * came to be announced as "Introduced in Lua 5.1", full stop. The shapes are read off
 * the availability of every documented version rather than off the two bound fields, so
 * `restored` falls out of the same walk instead of needing its own field: whatever the
 * schema grows to express, a gap in availability is a gap here.
 *
 * ADR 0009's rule — a renderer states a version fact from the dataset, never from a
 * hand-written string — is why this returns versions rather than sentences.
 */
export type Unavailable =
  /** In no version the site documents. */
  | { kind: 'never' }
  /** Below `version_added`: the reader is early. */
  | { kind: 'not-yet'; addedIn: LuaVersion }
  /** Past the last version that has it, with nothing after. */
  | { kind: 'removed'; addedIn: LuaVersion; removedIn: LuaVersion; lastAvailable: LuaVersion }
  /** Inside a gap: gone here, documented again later — `math.frexp`, `math.ldexp`. */
  | {
      kind: 'restored';
      addedIn: LuaVersion;
      removedIn: LuaVersion;
      lastAvailable: LuaVersion;
      restoredIn: LuaVersion;
    };

/** `null` when the entry does exist in `v` — so this doubles as the render guard. */
export function unavailableIn(node: CompatNode, v: LuaVersion): Unavailable | null {
  if (isAvailable(node, v)) return null;

  const before = LUA_VERSIONS.slice(0, idx(v)).filter((other) => isAvailable(node, other));
  const after = LUA_VERSIONS.slice(idx(v) + 1).filter((other) => isAvailable(node, other));
  const restoredIn = after[0];
  const lastAvailable = before[before.length - 1];

  if (!lastAvailable) {
    return restoredIn ? { kind: 'not-yet', addedIn: restoredIn } : { kind: 'never' };
  }

  const addedIn = before[0];
  // Safe: `lastAvailable` sits strictly below `v`, so a version follows it.
  const removedIn = LUA_VERSIONS[idx(lastAvailable) + 1];

  return restoredIn
    ? { kind: 'restored', addedIn, removedIn, lastAvailable, restoredIn }
    : { kind: 'removed', addedIn, removedIn, lastAvailable };
}

/**
 * The runs of consecutive versions that have the entry, oldest first.
 *
 * One run for the ordinary entry, two for one that came back. Empty for a symbol no
 * documented version has.
 */
export function availabilityRanges(node: CompatNode): { from: LuaVersion; to: LuaVersion }[] {
  const ranges: { from: LuaVersion; to: LuaVersion }[] = [];

  for (const version of LUA_VERSIONS) {
    if (!isAvailable(node, version)) continue;
    const open = ranges[ranges.length - 1];
    if (open && idx(open.to) === idx(version) - 1) open.to = version;
    else ranges.push({ from: version, to: version });
  }

  return ranges;
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
 *
 * Read off availability rather than off the bounds — "added after 5.1, or removed" is
 * exactly "some version does not have it", so this answers identically for every node
 * either spelling can describe, including one with a gap in the middle. The point is
 * that it is no longer a second reading of the fields `isAvailable` owns: this was the
 * last place outside it that knew what the pair meant, and the matrix is the only
 * surface that spells a gap out row by row.
 */
export function varies(node: CompatNode): boolean {
  if (LUA_VERSIONS.some((version) => !isAvailable(node, version))) return true;

  return Object.keys(node.changed_in ?? {}).length > 0;
}

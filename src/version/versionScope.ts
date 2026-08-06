import { DEFAULT_VERSION, LUA_VERSIONS, type LuaVersion } from '@/compat/schema';

const idx = (v: LuaVersion) => LUA_VERSIONS.indexOf(v);

/**
 * The versions an authored block applies to.
 *
 * `since` is inclusive and `before` is exclusive, so the two are exact complements: a
 * pair written `before="5.4"` and `since="5.4"` covers every documented version once and
 * only once, with no version falling into both or neither. That property is the whole
 * reason for the second word — an "until" would have to be read as inclusive or
 * exclusive, and half the readings of a boundary are wrong.
 *
 * Both together bound a run: `since="5.4" before="5.5"` is exactly 5.4.
 */
export interface VersionScope {
  /** The first version the block applies to. */
  since?: LuaVersion;
  /** The first version the block *stops* applying to. */
  before?: LuaVersion;
}

/** `children` is React's, not ours; everything else must be one of the two. */
const KNOWN_PROPS = new Set(['since', 'before', 'children']);

function checkedVersion(value: unknown, prop: 'since' | 'before'): LuaVersion | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'string' || !(LUA_VERSIONS as readonly string[]).includes(value)) {
    throw new Error(
      `<Only ${prop}={${JSON.stringify(value)}}> — not a version this site documents. ` +
        `Use one of ${LUA_VERSIONS.join(', ')}.`,
    );
  }
  return value as LuaVersion;
}

/**
 * Read a scope off a component's props, or throw.
 *
 * This is `compatNodeSchema`'s `.strict()` plus its ordering refinements, applied to the
 * one marker an author writes by hand. The compat schema parses at module load precisely
 * because a misspelled key once rendered as a silently wrong support strip across four
 * surfaces; a misspelled *attribute* here has the same shape of failure and is worse,
 * because the block it should have scoped goes on rendering on every version and nothing
 * anywhere says so. So all three ways of being wrong are refused rather than ignored:
 *
 * 1. an attribute that is neither `since` nor `before` — `<Only sinse="5.4">`;
 * 2. a value that is not a documented version — `<Only since="5.40">`;
 * 3. a pair that names no version at all — `before` at or below `since`, which is the
 *    transposition `version_removed`/`version_restored` guards against in the dataset.
 *
 * A scope with neither word is refused too: it reads as a version marker and scopes
 * nothing, which is exactly what a typo in the only attribute leaves behind.
 */
export function assertScope(props: Record<string, unknown>): VersionScope {
  const unknown = Object.keys(props).filter((key) => !KNOWN_PROPS.has(key));
  if (unknown.length > 0) {
    throw new Error(
      `<Only> got ${unknown.map((key) => `\`${key}\``).join(', ')} — it takes ` +
        '`since` and `before` and nothing else.',
    );
  }

  const since = checkedVersion(props.since, 'since');
  const before = checkedVersion(props.before, 'before');

  if (!since && !before) {
    throw new Error('<Only> needs `since`, `before`, or both — with neither it scopes nothing.');
  }
  if (since && before && idx(before) <= idx(since)) {
    throw new Error(
      `<Only since="${since}" before="${before}"> applies to no version — ` +
        '`before` is exclusive and must be above `since`.',
    );
  }

  return { since, before };
}

/**
 * Does a scoped block apply to the selected version?
 *
 * With no selected version — no provider above, or the prerender pass, which renders the
 * default before the client resolves `?v=` — the answer is the default version's. Base
 * content is written against the default (ADR 0001), so that is the reading the rest of
 * the page is already showing.
 */
export function appliesTo(scope: VersionScope, selected: LuaVersion | null): boolean {
  const at = idx(selected ?? DEFAULT_VERSION);
  if (scope.since && at < idx(scope.since)) return false;
  if (scope.before && at >= idx(scope.before)) return false;
  return true;
}

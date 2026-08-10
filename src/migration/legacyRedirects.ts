/**
 * Every URL the old luadocs.com serves, and the entry that replaces it.
 *
 * The old site is a different site — its prose was never ported (ADR 0010), so this
 * moves URLs and ranking, not text. The map is written out rather than derived from a
 * pattern because a pattern gets six of these wrong: `setmetatable`, `getmetatable`,
 * `rawset`, `rawget`, `pairs` and `next` were filed under `table` on the old site and
 * are globals, so their new home is a different section (ADR 0006).
 *
 * Sources that already 404 on the old site are deliberately absent — a redirect for a
 * URL that has never returned 200 preserves nothing. See ADR 0012.
 */
export type LegacyRedirect = {
  /** Path on the old site, absolute and without a trailing slash. */
  readonly from: string;
  /** Path on this site. Never itself a `from` — chains are forbidden. */
  readonly to: string;
};

export const LEGACY_REDIRECTS: readonly LegacyRedirect[] = [
  // Prose pages. None has a successor: there is no FAQ, no governance page, and the
  // contribution surface is slice 7. All four point at the docs root rather than off to
  // GitHub, which would export the traffic for two paths slice 7 may want back.
  { from: '/docs/introduction', to: '/docs' },
  { from: '/docs/faq', to: '/docs' },
  { from: '/docs/governance', to: '/docs' },
  { from: '/docs/contribution-guide', to: '/docs' },

  // Section overviews.
  { from: '/docs/functions/string', to: '/docs/standard-library/string' },
  { from: '/docs/functions/table', to: '/docs/standard-library/table' },
  { from: '/docs/functions/math', to: '/docs/standard-library/math' },
  { from: '/docs/functions/coroutine', to: '/docs/standard-library/coroutine' },
  { from: '/docs/functions/io', to: '/docs/standard-library/io' },
  { from: '/docs/functions/os', to: '/docs/standard-library/os' },
  { from: '/docs/functions/package', to: '/docs/standard-library/package' },
  { from: '/docs/functions/debug', to: '/docs/standard-library/debug' },
  { from: '/docs/functions/utf8', to: '/docs/standard-library/utf8' },

  // Globals the old site mis-filed under `table`. `table.setmetatable` does not exist.
  { from: '/docs/functions/table/setmetatable', to: '/docs/standard-library/globals/setmetatable' },
  { from: '/docs/functions/table/getmetatable', to: '/docs/standard-library/globals/getmetatable' },
  { from: '/docs/functions/table/rawset', to: '/docs/standard-library/globals/rawset' },
  { from: '/docs/functions/table/rawget', to: '/docs/standard-library/globals/rawget' },
  { from: '/docs/functions/table/pairs', to: '/docs/standard-library/globals/pairs' },
  { from: '/docs/functions/table/next', to: '/docs/standard-library/globals/next' },

  // string
  { from: '/docs/functions/string/byte', to: '/docs/standard-library/string/byte' },
  { from: '/docs/functions/string/char', to: '/docs/standard-library/string/char' },
  { from: '/docs/functions/string/dump', to: '/docs/standard-library/string/dump' },
  { from: '/docs/functions/string/find', to: '/docs/standard-library/string/find' },
  { from: '/docs/functions/string/format', to: '/docs/standard-library/string/format' },
  { from: '/docs/functions/string/gmatch', to: '/docs/standard-library/string/gmatch' },
  { from: '/docs/functions/string/gsub', to: '/docs/standard-library/string/gsub' },
  { from: '/docs/functions/string/len', to: '/docs/standard-library/string/len' },
  { from: '/docs/functions/string/lower', to: '/docs/standard-library/string/lower' },
  { from: '/docs/functions/string/match', to: '/docs/standard-library/string/match' },
  { from: '/docs/functions/string/pack', to: '/docs/standard-library/string/pack' },
  { from: '/docs/functions/string/packsize', to: '/docs/standard-library/string/packsize' },
  { from: '/docs/functions/string/rep', to: '/docs/standard-library/string/rep' },
  { from: '/docs/functions/string/reverse', to: '/docs/standard-library/string/reverse' },
  { from: '/docs/functions/string/sub', to: '/docs/standard-library/string/sub' },
  { from: '/docs/functions/string/unpack', to: '/docs/standard-library/string/unpack' },
  { from: '/docs/functions/string/upper', to: '/docs/standard-library/string/upper' },

  // table
  { from: '/docs/functions/table/concat', to: '/docs/standard-library/table/concat' },
  { from: '/docs/functions/table/insert', to: '/docs/standard-library/table/insert' },
  { from: '/docs/functions/table/move', to: '/docs/standard-library/table/move' },
  { from: '/docs/functions/table/pack', to: '/docs/standard-library/table/pack' },
  { from: '/docs/functions/table/remove', to: '/docs/standard-library/table/remove' },
  { from: '/docs/functions/table/sort', to: '/docs/standard-library/table/sort' },
  { from: '/docs/functions/table/unpack', to: '/docs/standard-library/table/unpack' },

  // math
  { from: '/docs/functions/math/abs', to: '/docs/standard-library/math/abs' },
  { from: '/docs/functions/math/acos', to: '/docs/standard-library/math/acos' },
  { from: '/docs/functions/math/asin', to: '/docs/standard-library/math/asin' },
  { from: '/docs/functions/math/atan', to: '/docs/standard-library/math/atan' },
  { from: '/docs/functions/math/ceil', to: '/docs/standard-library/math/ceil' },
  { from: '/docs/functions/math/cos', to: '/docs/standard-library/math/cos' },
  { from: '/docs/functions/math/deg', to: '/docs/standard-library/math/deg' },
  { from: '/docs/functions/math/exp', to: '/docs/standard-library/math/exp' },
  { from: '/docs/functions/math/floor', to: '/docs/standard-library/math/floor' },
  { from: '/docs/functions/math/fmod', to: '/docs/standard-library/math/fmod' },
  { from: '/docs/functions/math/huge', to: '/docs/standard-library/math/huge' },
  { from: '/docs/functions/math/log', to: '/docs/standard-library/math/log' },
  { from: '/docs/functions/math/max', to: '/docs/standard-library/math/max' },
  { from: '/docs/functions/math/maxinteger', to: '/docs/standard-library/math/maxinteger' },
  { from: '/docs/functions/math/min', to: '/docs/standard-library/math/min' },
  { from: '/docs/functions/math/mininteger', to: '/docs/standard-library/math/mininteger' },
  { from: '/docs/functions/math/modf', to: '/docs/standard-library/math/modf' },
  { from: '/docs/functions/math/pi', to: '/docs/standard-library/math/pi' },
  { from: '/docs/functions/math/rad', to: '/docs/standard-library/math/rad' },
  { from: '/docs/functions/math/random', to: '/docs/standard-library/math/random' },
  { from: '/docs/functions/math/sin', to: '/docs/standard-library/math/sin' },
  { from: '/docs/functions/math/sqrt', to: '/docs/standard-library/math/sqrt' },
  { from: '/docs/functions/math/tan', to: '/docs/standard-library/math/tan' },
  { from: '/docs/functions/math/tointeger', to: '/docs/standard-library/math/tointeger' },
  { from: '/docs/functions/math/type', to: '/docs/standard-library/math/type' },
  { from: '/docs/functions/math/ult', to: '/docs/standard-library/math/ult' },
];

/**
 * The content tree as data. `src/content-tree/scaffold.ts` materialises it into
 * `content/docs/`; slice 3's coverage checks read it to find entries that have no
 * compat data. Nothing here touches the filesystem.
 */

import type { LuaVersion } from '../compat/schema';

/** Which section order from `docs/research/page-structure.md` an entry follows. */
export const ENTRY_TYPES = ['function', 'construct', 'constant', 'overview', 'guide'] as const;
export type EntryType = (typeof ENTRY_TYPES)[number];

/** The manual passage an entry is a rewrite of — the attribution link. */
export interface Source {
  /** The newest manual that still documents this symbol. */
  version: LuaVersion;
  /** Anchor within that manual's `manual.html`, without the leading `#`. */
  anchor: string;
}

export interface Entry {
  /** URL and filename segment — the bare member name, never the dotted form. */
  slug: string;
  /**
   * Frontmatter title — the symbol as a reader writes it, fully qualified and
   * parenthesised when callable (`string.format()`, `math.pi`, `__index`). Dotted
   * means library member, bare means global, which is what makes a cross-linked
   * `Related globals` row legible next to a native one (ADR 0006).
   */
  title: string;
  type: EntryType;
  /** Sidebar group this entry belongs to. Entries sharing one are shown together. */
  group: string;
  source: Source;
}

/** A sidebar row pointing at an entry that lives in another section. */
export interface CrossLink {
  title: string;
  url: string;
}

export interface Section {
  slug: string;
  /** Sidebar label, written to `meta.json`. */
  title: string;
  source: Source;
  entries: Entry[];
  sections: Section[];
  /** Cross-linked rows, shown last, under a "Related globals" group. */
  related?: CrossLink[];
}

const MANUAL_BASE = 'https://www.lua.org/manual';

export function sourceUrl(source: Source): string {
  return `${MANUAL_BASE}/${source.version}/manual.html#${source.anchor}`;
}

/** The group an entry falls into when its helper does not say otherwise. */
const GROUP_BY_TYPE: Record<EntryType, string> = {
  function: 'Functions',
  constant: 'Constants',
  construct: 'Concepts',
  guide: 'Guides',
  overview: 'Overview',
};

/**
 * A callable's title carries its parentheses, as MDN's do (`Math.abs()`). The title
 * is the page heading, the breadcrumb and the search result, not just a sidebar row,
 * so the distinction between `math.abs()` and `math.pi` belongs in the data.
 */
function call(name: string, type: EntryType): string {
  return type === 'function' ? `${name}()` : name;
}

export function entry(
  slug: string,
  title: string,
  type: EntryType,
  anchor: string,
  version: LuaVersion = '5.5',
  group: string = GROUP_BY_TYPE[type],
): Entry {
  return { slug, title: call(title, type), type, group, source: { version, anchor } };
}

/** A language construct, whose anchor is a manual section number like `3.3.5`. */
export function construct(slug: string, title: string, anchor: string): Entry {
  return entry(slug, title, 'construct', anchor);
}

function split(names: string): string[] {
  return names.trim().split(/\s+/).filter(Boolean);
}

/**
 * The manual anchors every standard-library identifier as `pdf-<title>` — including
 * the colon forms (`pdf-file:read`) and the underscore ones (`pdf-_G`) — so the whole
 * library can be built from a list of bare names.
 */
function build(
  lib: string,
  names: string,
  type: EntryType,
  version: LuaVersion,
  sep = '.',
  group?: string,
): Entry[] {
  return split(names).map((slug) => {
    // The bare name, because the manual anchors `pdf-string.format`, never
    // `pdf-string.format()`. `entry` adds the parentheses to the title only.
    const name = lib ? `${lib}${sep}${slug}` : slug;
    return entry(slug, name, type, `pdf-${name}`, version, group);
  });
}

/** `fns('string', 'byte char')` → slugs `byte`/`char`, titles `string.byte`/`string.char`. */
export function fns(lib: string, names: string): Entry[] {
  return build(lib, names, 'function', '5.5');
}

/** Functions the 5.5 manual no longer documents — sourced to an older manual. */
export function fnsFrom(version: LuaVersion, lib: string, names: string): Entry[] {
  return build(lib, names, 'function', version);
}

/** Tables, strings and numbers exposed by a library — `math.pi`, `package.loaded`. */
export function consts(lib: string, names: string): Entry[] {
  return build(lib, names, 'constant', '5.5');
}

/** Constants the 5.5 manual no longer documents. */
export function constsFrom(version: LuaVersion, lib: string, names: string): Entry[] {
  return build(lib, names, 'constant', version);
}

/**
 * `methods('file', 'read seek')` → slugs `file-read`/`file-seek`, titles
 * `file:read()`/`file:seek()`. The slug takes the receiver as a prefix because these
 * live beside `io`'s own functions, where `close`, `flush`, `lines`, `read` and
 * `write` would otherwise collide.
 */
export function methods(receiver: string, names: string): Entry[] {
  return split(names).map((name) =>
    entry(
      `${receiver}-${name}`,
      `${receiver}:${name}`,
      'function',
      `pdf-${receiver}:${name}`,
      '5.5',
      'File methods',
    ),
  );
}

/**
 * Metamethods are all documented together, in §2.4. The `__` prefix is dropped from the
 * slug and kept in the title — except for `__index`, whose bare slug would collide with
 * the `index.mdx` that a section's own overview occupies.
 */
export function metamethods(names: string): Entry[] {
  return split(names).map((slug) =>
    construct(slug === 'index' ? 'index-metamethod' : slug, `__${slug}`, '2.4'),
  );
}

export function section(
  slug: string,
  title: string,
  anchor: string,
  entries: Entry[] = [],
  sections: Section[] = [],
): Section {
  return { slug, title, source: { version: '5.5', anchor }, entries, sections };
}

/**
 * A section's `meta.json` `pages`, in manifest order. Child sections first, then
 * entries, then cross-links. `index` is deliberately absent — leaving it unlisted
 * lets the loader claim it as the folder's own link, so a section is one sidebar
 * row rather than two. A `---Group---` marker precedes each run of entries, but
 * only where a section holds more than one group: a single-kind section needs no
 * label, exactly as MDN gives a single-kind object none.
 */
export function pagesOf(sec: Section): string[] {
  const pages = sec.sections.map((s) => s.slug);
  const labelled = new Set(sec.entries.map((e) => e.group)).size > 1;
  let current: string | null = null;

  for (const e of sec.entries) {
    if (labelled && e.group !== current) {
      pages.push(`---${e.group}---`);
      current = e.group;
    }
    pages.push(e.slug);
  }

  if (sec.related?.length) {
    pages.push('---Related globals---');
    for (const r of sec.related) pages.push(`[${r.title}](${r.url})`);
  }
  return pages;
}

/**
 * Every docs URL the tree produces. The prerenderer discovers routes by crawling
 * links, which cannot see inside a collapsed sidebar folder — so the routes are also
 * listed explicitly, generated from the same source as the files themselves.
 */
export function contentTreeUrls(tree: Section[], prefix = '/docs'): string[] {
  return tree.flatMap((sec) => {
    const base = `${prefix}/${sec.slug}`;
    return [
      base,
      ...sec.sections.flatMap((child) => contentTreeUrls([child], base)),
      ...sec.entries.map((e) => `${base}/${e.slug}`),
    ];
  });
}

/**
 * Declared ahead of the tree so `relatedGlobals` can resolve names against it, and
 * spread into `standard-library` below.
 */
const GLOBALS = section('globals', 'Globals', '6.2', [
  ...fns('', 'assert collectgarbage dofile error getmetatable ipairs load loadfile next pairs pcall print rawequal rawget rawlen rawset require select setmetatable tonumber tostring type warn xpcall'),
  ...fnsFrom('5.1', '', 'getfenv loadstring module setfenv unpack'),
  entry('_g', '_G', 'constant', 'pdf-_G'),
  entry('_version', '_VERSION', 'constant', 'pdf-_VERSION'),
]);

/**
 * Rows for globals a reader would look for inside another section — `setmetatable()`
 * under `table`. The row is duplicated, the page is not: the URL stays in Globals,
 * because `table.setmetatable` does not exist and calling it is a runtime error
 * (ADR 0006). Throws on an unknown name, so a typo cannot ship a dead link.
 */
export function relatedGlobals(names: string): CrossLink[] {
  return split(names).map((slug) => {
    const found = GLOBALS.entries.find((e) => e.slug === slug);
    if (!found) throw new Error(`no global named "${slug}"`);
    return { title: found.title, url: `/docs/standard-library/globals/${slug}` };
  });
}

export const CONTENT_TREE: Section[] = [
  section('learn', 'Learn', '1'),
  section('guides', 'Guides', '1', [
    entry('lua-in-the-wild', 'Lua in the wild', 'guide', '1'),
    entry('luarocks-and-the-ecosystem', 'LuaRocks and the ecosystem', 'guide', '1'),
    entry('how-metatables-work', 'How metatables really work', 'guide', '2.4'),
    entry('history-of-lua', 'A history of Lua', 'guide', '1'),
  ]),
  section('standard-library', 'Standard Library', '6', [], [
    GLOBALS,
    { ...section('string', 'string', '6.5', [
        construct('patterns', 'Patterns', '6.5.1'),
        construct('pack-formats', 'Format strings for pack and unpack', '6.5.2'),
        ...fns('string', 'byte char dump find format gmatch gsub len lower match pack packsize rep reverse sub unpack upper'),
      ]),
      related: relatedGlobals('tostring') },
    { ...section('table', 'table', '6.7', [
        ...fns('table', 'concat create insert move pack remove sort unpack'),
        ...fnsFrom('5.1', 'table', 'foreach foreachi getn maxn'),
      ]),
      related: relatedGlobals(
        'getmetatable ipairs next pairs rawget rawlen rawset setmetatable',
      ) },
    section('math', 'math', '6.8', [
      ...fns('math', 'abs acos asin atan ceil cos deg exp floor fmod frexp ldexp log max min modf rad random randomseed sin sqrt tan tointeger type ult'),
      ...fnsFrom('5.1', 'math', 'atan2 cosh log10 pow sinh tanh'),
      ...consts('math', 'huge maxinteger mininteger pi'),
    ]),
    section('io', 'io', '6.9', [
      ...fns('io', 'close flush input lines open output popen read tmpfile type write'),
      ...consts('io', 'stderr stdin stdout'),
      ...methods('file', 'close flush lines read seek setvbuf write'),
    ]),
    section('os', 'os', '6.10',
      fns('os', 'clock date difftime execute exit getenv remove rename setlocale time tmpname')),
    section('coroutine', 'coroutine', '6.3',
      fns('coroutine', 'close create isyieldable resume running status wrap yield')),
    section('utf8', 'utf8', '6.6', [
      ...fns('utf8', 'char codepoint codes len offset'),
      ...consts('utf8', 'charpattern'),
    ]),
    { ...section('package', 'package', '6.4', [
        ...fns('package', 'loadlib searchpath'),
        ...fnsFrom('5.1', 'package', 'seeall'),
        ...consts('package', 'config cpath loaded path preload searchers'),
        ...constsFrom('5.1', 'package', 'loaders'),
      ]),
      related: relatedGlobals('dofile loadfile require') },
    section('debug', 'debug', '6.11', [
      ...fns('debug', 'debug gethook getinfo getlocal getmetatable getregistry getupvalue getuservalue sethook setlocal setmetatable setupvalue setuservalue traceback upvalueid upvaluejoin'),
      ...fnsFrom('5.1', 'debug', 'getfenv setfenv'),
    ]),
  ]),
  section('language', 'Language', '3', [
    construct('coroutines', 'Coroutines', '2.6'),
  ], [
    section('values-and-types', 'Values and types', '2.1', [
      construct('nil', 'nil', '2.1'),
      construct('boolean', 'boolean', '2.1'),
      construct('number', 'number', '2.1'),
      construct('string', 'string', '2.1'),
      construct('table', 'table', '2.1'),
      construct('function', 'function', '2.1'),
      construct('userdata', 'userdata', '2.1'),
      construct('thread', 'thread', '2.1'),
      construct('type-coercion', 'Coercions and conversions', '3.4.3'),
    ]),
    section('lexical-conventions', 'Lexical conventions', '3.1', [
      construct('comments', 'Comments', '3.1'),
      construct('identifiers-and-keywords', 'Identifiers and keywords', '3.1'),
      construct('numeric-literals', 'Numeric literals', '3.1'),
      construct('string-literals', 'String literals', '3.1'),
    ]),
    section('variables-and-scope', 'Variables and scope', '2.2', [
      construct('global-variables', 'Global variables', '2.2'),
      construct('local-variables', 'Local variables', '2.2'),
      construct('upvalues-and-closures', 'Upvalues and closures', '2.2'),
      construct('scope-rules', 'Scope', '2.2'),
      construct('variable-attributes', 'Variable attributes', '3.3.7'),
    ]),
    // Prose-named, so curated (ADR 0006): alphabetical would put `break` before
    // `do` and `goto` before `if`.
    section('statements', 'Statements', '3.3', [
      construct('assignment', 'Assignment', '3.3.3'),
      construct('local-declarations', 'local declarations', '3.3.7'),
      construct('global-declarations', 'global declarations', '3.3.7'),
      construct('if', 'if', '3.3.4'),
      construct('while', 'while', '3.3.4'),
      construct('repeat', 'repeat … until', '3.3.4'),
      construct('numeric-for', 'Numeric for', '3.3.5'),
      construct('generic-for', 'Generic for', '3.3.5'),
      construct('break', 'break', '3.3.4'),
      construct('goto', 'goto', '3.3.4'),
      construct('return', 'return', '3.3.4'),
      construct('do-blocks', 'do … end blocks', '3.3.1'),
      construct('function-declarations', 'Function declarations', '3.4.11'),
      construct('to-be-closed-variables', 'To-be-closed variables', '3.3.8'),
    ]),
    section('expressions', 'Expressions', '3.4', [
      construct('arithmetic-operators', 'Arithmetic operators', '3.4.1'),
      construct('bitwise-operators', 'Bitwise operators', '3.4.2'),
      construct('relational-operators', 'Relational operators', '3.4.4'),
      construct('logical-operators', 'Logical operators', '3.4.5'),
      construct('concatenation', 'Concatenation', '3.4.6'),
      construct('length-operator', 'Length operator', '3.4.7'),
      construct('operator-precedence', 'Operator precedence', '3.4.8'),
      construct('table-constructors', 'Table constructors', '3.4.9'),
      construct('function-calls', 'Function calls', '3.4.10'),
      construct('method-calls', 'Method calls', '3.4.10'),
      construct('anonymous-functions', 'Anonymous functions', '3.4.11'),
      construct('varargs', 'Varargs', '3.4.11'),
      construct('multiple-results', 'Multiple results and adjustment', '3.4.12'),
    ]),
    { ...section('metatables', 'Metatables and metamethods', '2.4', [
        ...metamethods('index newindex call tostring len eq lt le concat unm gc close mode name metatable pairs ipairs'),
        construct('arithmetic-metamethods', 'Arithmetic metamethods', '2.4'),
        construct('bitwise-metamethods', 'Bitwise metamethods', '2.4'),
      ]),
      related: relatedGlobals('getmetatable rawget rawlen rawset setmetatable') },
    section('environments', 'Environments', '2.2', [
      construct('env', '_ENV', '2.2'),
      construct('the-global-environment', 'The global environment', '2.2'),
    ]),
    section('error-handling', 'Error handling', '2.3', [
      construct('error-objects', 'Error objects', '2.3'),
      construct('protected-calls', 'Protected calls', '2.3'),
      construct('error-levels', 'Error levels', '2.3'),
      construct('warnings', 'Warnings', '2.3'),
    ]),
    section('garbage-collection', 'Garbage collection', '2.5', [
      construct('incremental-mode', 'Incremental mode', '2.5.1'),
      construct('generational-mode', 'Generational mode', '2.5.2'),
      construct('weak-tables', 'Weak tables', '2.5.4'),
      construct('finalizers', 'Finalizers', '2.5.3'),
    ]),
  ]),
  section('standalone', 'Standalone interpreter', '7', [
    construct('command-line-options', 'Command-line options', '7'),
    construct('script-execution', 'Script execution', '7'),
    entry('arg', 'arg', 'constant', '7'),
    entry('lua-path', 'LUA_PATH', 'constant', '6.4'),
    entry('lua-cpath', 'LUA_CPATH', 'constant', '6.4'),
    entry('lua-init', 'LUA_INIT', 'constant', '7'),
  ]),
  // Entries, not folders: none of these has content yet, and a folder wrapping a
  // lone overview is an accordion that opens onto itself (ADR 0006). They become
  // sections again when their entries are authored.
  section('c-api', 'C API', '4', [
    construct('types-and-values', 'Types and values', '4.6'),
    construct('stack-manipulation', 'Stack manipulation', '4.1'),
    construct('calling', 'Calling', '4.5'),
    construct('error-handling', 'Error handling', '4.4'),
    construct('references-and-registry', 'References and the registry', '4.3'),
    construct('userdata', 'Userdata', '4.6'),
    construct('coroutines', 'Coroutines', '4.5'),
    construct('debug-interface', 'Debug interface', '4.7'),
    construct('auxiliary-library', 'Auxiliary library', '5'),
    construct('constants', 'Constants', '4.6'),
  ]),
];

/** The areas, in sidebar order, plus the authored site root. */
export const ROOT_PAGES = ['index', ...CONTENT_TREE.map((s) => s.slug)];

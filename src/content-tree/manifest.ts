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
  /** Frontmatter title — the symbol as a reader writes it (`string.format`, `__index`). */
  title: string;
  type: EntryType;
  source: Source;
}

export interface Section {
  slug: string;
  /** Sidebar label, written to `meta.json`. */
  title: string;
  source: Source;
  /** Frontmatter title of the section's own `index.mdx`. Defaults to `title`. */
  indexTitle?: string;
  entries: Entry[];
  sections: Section[];
  /** Explicit `meta.json` page order. Defaults to `['index', '...']`. */
  pages?: string[];
}

export const MANUAL_BASE = 'https://www.lua.org/manual';

export function sourceUrl(source: Source): string {
  return `${MANUAL_BASE}/${source.version}/manual.html#${source.anchor}`;
}

export function entry(
  slug: string,
  title: string,
  type: EntryType,
  anchor: string,
  version: LuaVersion = '5.5',
): Entry {
  return { slug, title, type, source: { version, anchor } };
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
): Entry[] {
  return split(names).map((slug) => {
    const title = lib ? `${lib}${sep}${slug}` : slug;
    return entry(slug, title, type, `pdf-${title}`, version);
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

/** `methods('file', 'read seek')` → titles `file:read`, `file:seek`. */
export function methods(receiver: string, names: string): Entry[] {
  return build(receiver, names, 'function', '5.5', ':');
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

/** Order of the top-level groups in the sidebar. */
export const ROOT_PAGES = [
  'index',
  'learn',
  'guides',
  'language',
  'standard-library',
  'standalone',
  'c-api',
];

export const CONTENT_TREE: Section[] = [
  section('learn', 'Learn', '1'),
  section('guides', 'Guides', '1', [
    entry('lua-in-the-wild', 'Lua in the wild', 'guide', '1'),
    entry('luarocks-and-the-ecosystem', 'LuaRocks and the ecosystem', 'guide', '1'),
    entry('how-metatables-work', 'How metatables really work', 'guide', '2.4'),
    entry('history-of-lua', 'A history of Lua', 'guide', '1'),
  ]),
  section('language', 'Language', '3', [], [
    section('lexical-conventions', 'Lexical conventions', '3.1', [
      construct('comments', 'Comments', '3.1'),
      construct('identifiers-and-keywords', 'Identifiers and keywords', '3.1'),
      construct('numeric-literals', 'Numeric literals', '3.1'),
      construct('string-literals', 'String literals', '3.1'),
    ]),
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
    section('variables-and-scope', 'Variables and scope', '2.2', [
      construct('global-variables', 'Global variables', '2.2'),
      construct('local-variables', 'Local variables', '2.2'),
      construct('upvalues-and-closures', 'Upvalues and closures', '2.2'),
      construct('scope-rules', 'Scope', '2.2'),
      construct('variable-attributes', 'Variable attributes', '3.3.7'),
    ]),
    section('statements', 'Statements', '3.3', [
      construct('assignment', 'Assignment', '3.3.3'),
      construct('do-blocks', 'do … end blocks', '3.3.1'),
      construct('if', 'if', '3.3.4'),
      construct('while', 'while', '3.3.4'),
      construct('repeat', 'repeat … until', '3.3.4'),
      construct('numeric-for', 'Numeric for', '3.3.5'),
      construct('generic-for', 'Generic for', '3.3.5'),
      construct('break', 'break', '3.3.4'),
      construct('goto', 'goto', '3.3.4'),
      construct('return', 'return', '3.3.4'),
      construct('function-declarations', 'Function declarations', '3.4.11'),
      construct('local-declarations', 'local declarations', '3.3.7'),
      construct('global-declarations', 'global declarations', '3.3.7'),
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
    section('metatables', 'Metatables and metamethods', '2.4', [
      ...metamethods('index newindex call tostring len eq lt le concat unm gc close mode name metatable pairs ipairs'),
      construct('arithmetic-metamethods', 'Arithmetic metamethods', '2.4'),
      construct('bitwise-metamethods', 'Bitwise metamethods', '2.4'),
    ]),
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
    section('coroutines', 'Coroutines', '2.6'),
  ]),
  section('standard-library', 'Standard Library', '6', [], [
    section('basic', 'Basic functions', '6.2', [
      ...fns('', 'assert collectgarbage dofile error getmetatable ipairs load loadfile next pairs pcall print rawequal rawget rawlen rawset require select setmetatable tonumber tostring type warn xpcall'),
      ...fnsFrom('5.1', '', 'getfenv loadstring module setfenv unpack'),
      entry('_g', '_G', 'constant', 'pdf-_G'),
      entry('_version', '_VERSION', 'constant', 'pdf-_VERSION'),
    ]),
    section('coroutine', 'coroutine', '6.3',
      fns('coroutine', 'close create isyieldable resume running status wrap yield')),
    section('package', 'package', '6.4', [
      ...consts('package', 'config cpath loaded path preload searchers'),
      ...fns('package', 'loadlib searchpath'),
      ...constsFrom('5.1', 'package', 'loaders'),
      ...fnsFrom('5.1', 'package', 'seeall'),
    ]),
    section('string', 'string', '6.5', [
      ...fns('string', 'byte char dump find format gmatch gsub len lower match pack packsize rep reverse sub unpack upper'),
      construct('patterns', 'Patterns', '6.5.1'),
      construct('pack-formats', 'Format strings for pack and unpack', '6.5.2'),
    ]),
    section('utf8', 'utf8', '6.6', [
      ...fns('utf8', 'char codepoint codes len offset'),
      ...consts('utf8', 'charpattern'),
    ]),
    section('table', 'table', '6.7', [
      ...fns('table', 'concat create insert move pack remove sort unpack'),
      ...fnsFrom('5.1', 'table', 'foreach foreachi getn maxn'),
    ]),
    section('math', 'math', '6.8', [
      ...fns('math', 'abs acos asin atan ceil cos deg exp floor fmod frexp ldexp log max min modf rad random randomseed sin sqrt tan tointeger type ult'),
      ...fnsFrom('5.1', 'math', 'atan2 cosh log10 pow sinh tanh'),
      ...consts('math', 'huge maxinteger mininteger pi'),
    ]),
    section('io', 'io', '6.9', [
      ...fns('io', 'close flush input lines open output popen read tmpfile type write'),
      ...consts('io', 'stderr stdin stdout'),
    ], [
      section('file-methods', 'File methods', '6.9',
        methods('file', 'close flush lines read seek setvbuf write')),
    ]),
    section('os', 'os', '6.10',
      fns('os', 'clock date difftime execute exit getenv remove rename setlocale time tmpname')),
    section('debug', 'debug', '6.11', [
      ...fns('debug', 'debug gethook getinfo getlocal getmetatable getregistry getupvalue getuservalue sethook setlocal setmetatable setupvalue setuservalue traceback upvalueid upvaluejoin'),
      ...fnsFrom('5.1', 'debug', 'getfenv setfenv'),
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
  section('c-api', 'C API', '4', [], [
    section('types', 'Types', '4.6'),
    section('stack-manipulation', 'Stack manipulation', '4.1'),
    section('types-and-values', 'Types and values', '4.6'),
    section('calling', 'Calling', '4.5'),
    section('error-handling', 'Error handling', '4.4'),
    section('references-and-registry', 'References and the registry', '4.3'),
    section('userdata', 'Userdata', '4.6'),
    section('coroutines', 'Coroutines', '4.5'),
    section('debug-interface', 'Debug interface', '4.7'),
    section('auxiliary-library', 'Auxiliary library', '5'),
    section('constants', 'Constants', '4.6'),
  ]),
];

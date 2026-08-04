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

/** Metamethods are all documented together, in §2.4. */
export function metamethods(names: string): Entry[] {
  return split(names).map((slug) => construct(slug, `__${slug}`, '2.4'));
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
];

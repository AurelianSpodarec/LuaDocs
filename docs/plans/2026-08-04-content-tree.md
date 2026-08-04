# Content-Tree Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the three flat files in `content/docs/` with the full section and entry tree from [the design](2026-08-04-content-tree-design.md) — ~295 directories, `meta.json` files, and stub entries — so that authoring an entry becomes "fill in a file that already exists at the right URL".

**Architecture:** The tree is **data, not files-by-hand**. A declarative manifest in `src/content-tree/manifest.ts` describes every section and entry; `src/content-tree/scaffold.ts` materialises it into `content/docs/`, idempotently and without ever overwriting an authored body. `scripts/scaffold-content.ts` is a thin CLI over that. The manifest doubles as the machine-readable tree that slice 3's coverage checks will need.

**Tech Stack:** TypeScript, Zod (frontmatter schema), Fumadocs `meta.json` page conventions, Vitest, `tsx` (new devDependency, to run the TS script).

## Global Constraints

- **All work stays on `dev`.** Never merge into `main`; ask before any merge or push (CLAUDE.md).
- **Commit messages** follow `docs/conventions/commit-messages.md`: `type(scope): summary`, imperative, ≤ ~60 chars, no trailing period. **Never** a `Co-Authored-By` trailer.
- **Use the CONTEXT.md vocabulary** — entry, section, delta, base, selected version, version support. Avoid its listed alternatives (page, article, category, override, compat strip).
- **No prose is authored.** Every generated `.mdx` body is exactly `{/* Not yet written. */}`.
- **One file per symbol**, whatever its versions. Availability is a delta in compat data, never a per-version file fork (ADR 0001).
- **Leaf slugs are the bare member name**; the dotted or prefixed form is the `title`. `standard-library/string/format.mdx` has `title: string.format`.
- **`lua-compat` is never added to a stub.** It is added when the entry is authored.

### Correction to the design doc

The spec's "Stub anatomy" shows an HTML comment, `<!-- Not yet written. -->`. **That is invalid MDX** — MDX 3 parses `<` as JSX and fails on `<!`. Every stub uses the JSX expression comment `{/* Not yet written. */}` instead. This plan is correct; the spec is wrong on that one line.

---

## File Structure

- `src/content-tree/manifest.ts` — the tree as data: `ENTRY_TYPES`, the `Entry`/`Section` types, the builder helpers, and `CONTENT_TREE`. Pure data and pure functions; no I/O.
- `src/content-tree/scaffold.ts` — `scaffoldContent(destDir, tree)`: walks the tree and writes directories, `meta.json`, and stubs. All filesystem work lives here so it can be tested against a temp directory.
- `scripts/scaffold-content.ts` — CLI wrapper: calls `scaffoldContent('content/docs', CONTENT_TREE)` and prints a summary.
- `src/lib/source.ts` — gains the optional `entry-type` frontmatter field (modify).
- `vite.config.ts` — prerender `pages` seeded from the manifest (modify).
- `tests/content-tree/manifest.test.ts` — tree invariants and the counts the spec commits to.
- `tests/content-tree/scaffold.test.ts` — generation, idempotency, and the no-clobber guarantee.
- `tests/e2e/string-format.test.tsx` — the hardcoded `/docs/string.format` URLs move (modify).
- `docs/plans/ROADMAP.md` — gains a row for this work (modify).

---

## Task 1: Prove a nested entry prerenders

The build discovers pages by **crawling links** from `/docs` (`vite.config.ts`, `crawlLinks: true`). Fumadocs renders folders as collapsible, and a collapsed folder's children may not be in the initial HTML. If nested pages are not crawled they are not prerendered — and that would invalidate the whole tree shape. Find out now, with one folder, not after 295 files exist.

**Files:**
- Move: `content/docs/string.format.mdx` → `content/docs/standard-library/string/format.mdx`
- Create: `content/docs/standard-library/meta.json`, `content/docs/standard-library/string/meta.json`
- Modify: `tests/e2e/string-format.test.tsx:98-105`

**Interfaces:**
- Consumes: nothing.
- Produces: the fact recorded in Step 5 — whether crawling reaches nested pages. Task 3 relies on it.

- [ ] **Step 1: Move the entry, preserving history**

```bash
mkdir -p content/docs/standard-library/string
git mv content/docs/string.format.mdx content/docs/standard-library/string/format.mdx
```

The file's frontmatter does **not** change. `title: string.format` is already correct — only the path moves.

- [ ] **Step 2: Add the two `meta.json` files**

`content/docs/standard-library/meta.json`:

```json
{
  "title": "Standard Library",
  "pages": ["index", "..."]
}
```

`content/docs/standard-library/string/meta.json`:

```json
{
  "title": "string",
  "pages": ["index", "..."]
}
```

`"..."` is Fumadocs' rest item: it includes every remaining page in the folder, sorted alphabetically. That is why we never hand-list 171 filenames.

- [ ] **Step 3: Fix the two hardcoded URLs in the e2e test**

In `tests/e2e/string-format.test.tsx`, replace the `compatByUrl` map and the `stringItem` URL:

```tsx
const compatByUrl: Record<string, string> = {
  '/docs/math.tointeger': 'math.tointeger',
  '/docs/standard-library/string/format': 'string.format',
};
```

```tsx
const stringItem: PageTree.Item = {
  type: 'page',
  name: 'string.format',
  url: '/docs/standard-library/string/format',
};
```

Leave `math.tointeger` at its flat URL — it moves in Task 7.

- [ ] **Step 4: Run the tests**

Run: `npm test`
Expected: PASS, 46 tests. A failure here means the URL edit was incomplete.

- [ ] **Step 5: Build, and record whether the nested page was prerendered**

Run: `npm run build`

Read the `[prerender]` output. Then check the file actually exists:

```bash
ls .output/public/docs/standard-library/string/
```

Expected if crawling works: an `index.html` in that directory, and `/docs/standard-library/string/format` in the prerender list.

**If it is missing**, crawling does not reach nested pages. Add an explicit entry to the `pages` array in `vite.config.ts:24-37` and rebuild:

```ts
        {
          path: '/docs/standard-library/string/format',
        },
```

Either way, **write the outcome into the commit message body** — Task 3 branches on it.

- [ ] **Step 6: Confirm the prerendered HTML has real content**

```bash
grep -c "printf" .output/public/docs/standard-library/string/index.html
```

Expected: at least 1. This proves the page rendered its MDX body, not just a shell.

- [ ] **Step 7: Commit**

```bash
git add content/docs tests/e2e/string-format.test.tsx vite.config.ts
git commit -m "refactor(content): nest string.format under its section"
```

---

## Task 2: The manifest module

**Files:**
- Create: `src/content-tree/manifest.ts`
- Test: `tests/content-tree/manifest.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `ENTRY_TYPES: readonly EntryType[]`, `type EntryType`, `interface Entry { slug, title, type }`, `interface Section { slug, title, indexTitle?, entries, sections, pages? }`, the builders `entry`, `fns`, `consts`, `methods`, `metamethods`, `section`, and `CONTENT_TREE: Section[]`. Tasks 3–6 all build on these exact names.

- [ ] **Step 1: Write the failing test**

Create `tests/content-tree/manifest.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { CONTENT_TREE, ENTRY_TYPES, type Section } from '@/content-tree/manifest';

function walk(sections: Section[]): Section[] {
  return sections.flatMap((s) => [s, ...walk(s.sections)]);
}

const all = walk(CONTENT_TREE);

describe('the content tree', () => {
  it('slugs every entry with URL-safe characters only', () => {
    for (const section of all) {
      for (const e of section.entries) {
        expect(e.slug, `${section.slug}/${e.slug}`).toMatch(/^[a-z0-9_-]+$/);
      }
    }
  });

  it('never slugs an entry "index", which would collide with the overview', () => {
    for (const section of all) {
      expect(section.entries.map((e) => e.slug)).not.toContain('index');
    }
  });

  it('keeps every slug unique within its section', () => {
    for (const section of all) {
      const slugs = [...section.entries.map((e) => e.slug), ...section.sections.map((s) => s.slug)];
      expect(new Set(slugs).size, `duplicate in ${section.slug}`).toBe(slugs.length);
    }
  });

  it('gives every entry a non-empty title and a known type', () => {
    for (const section of all) {
      for (const e of section.entries) {
        expect(e.title.length, `${section.slug}/${e.slug}`).toBeGreaterThan(0);
        expect(ENTRY_TYPES).toContain(e.type);
      }
    }
  });

  it('has the string library the design commits to', () => {
    const string = all.find((s) => s.slug === 'string');
    expect(string?.entries).toHaveLength(19);
    expect(string?.entries.find((e) => e.slug === 'format')?.title).toBe('string.format');
  });
});
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `npm test -- tests/content-tree/manifest.test.ts`
Expected: FAIL — cannot resolve `@/content-tree/manifest`.

- [ ] **Step 3: Write the module**

Create `src/content-tree/manifest.ts`:

```ts
/**
 * The content tree as data. `src/content-tree/scaffold.ts` materialises it into
 * `content/docs/`; slice 3's coverage checks read it to find entries that have no
 * compat data. Nothing here touches the filesystem.
 */

/** Which section order from `docs/research/page-structure.md` an entry follows. */
export const ENTRY_TYPES = ['function', 'construct', 'constant', 'overview', 'guide'] as const;
export type EntryType = (typeof ENTRY_TYPES)[number];

export interface Entry {
  /** URL and filename segment — the bare member name, never the dotted form. */
  slug: string;
  /** Frontmatter title — the symbol as a reader writes it (`string.format`, `__index`). */
  title: string;
  type: EntryType;
}

export interface Section {
  slug: string;
  /** Sidebar label, written to `meta.json`. */
  title: string;
  /** Frontmatter title of the section's own `index.mdx`. Defaults to `title`. */
  indexTitle?: string;
  entries: Entry[];
  sections: Section[];
  /** Explicit `meta.json` page order. Defaults to `['index', '...']`. */
  pages?: string[];
}

export function entry(slug: string, title: string, type: EntryType): Entry {
  return { slug, title, type };
}

function split(names: string): string[] {
  return names.trim().split(/\s+/).filter(Boolean);
}

function build(lib: string, names: string, type: EntryType, sep = '.'): Entry[] {
  return split(names).map((slug) => entry(slug, lib ? `${lib}${sep}${slug}` : slug, type));
}

/** `fns('string', 'byte char')` → slugs `byte`/`char`, titles `string.byte`/`string.char`. */
export function fns(lib: string, names: string): Entry[] {
  return build(lib, names, 'function');
}

/** Tables, strings and numbers exposed by a library — `math.pi`, `package.loaded`. */
export function consts(lib: string, names: string): Entry[] {
  return build(lib, names, 'constant');
}

/** `methods('file', 'read seek')` → titles `file:read`, `file:seek`. */
export function methods(receiver: string, names: string): Entry[] {
  return build(receiver, names, 'function', ':');
}

/** `metamethods('index newindex')` → slugs `index`/`newindex`, titles `__index`/`__newindex`. */
export function metamethods(names: string): Entry[] {
  return split(names).map((slug) => entry(slug, `__${slug}`, 'construct'));
}

export function section(
  slug: string,
  title: string,
  entries: Entry[] = [],
  sections: Section[] = [],
): Section {
  return { slug, title, entries, sections };
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
  section('standard-library', 'Standard Library', [], [
    section('string', 'string', [
      ...fns('string', 'byte char dump find format gmatch gsub len lower match pack packsize rep reverse sub unpack upper'),
      entry('patterns', 'Patterns', 'construct'),
      entry('pack-formats', 'Format strings for pack and unpack', 'construct'),
    ]),
  ]),
];
```

Only the `string` library is populated here. Tasks 4–6 fill in the rest — the shape has to be proven against the generator before 295 entries ride on it.

- [ ] **Step 4: Run the tests**

Run: `npm test -- tests/content-tree/manifest.test.ts`
Expected: PASS, 5 tests.

- [ ] **Step 5: Typecheck**

Run: `npm run types:check`
Expected: no output.

- [ ] **Step 6: Commit**

```bash
git add src/content-tree/manifest.ts tests/content-tree/manifest.test.ts
git commit -m "feat(content-tree): add the tree manifest"
```

---

## Task 3: The scaffold generator

**Files:**
- Create: `src/content-tree/scaffold.ts`, `scripts/scaffold-content.ts`
- Modify: `package.json` (add `tsx` devDependency and a `content:scaffold` script), `vite.config.ts`
- Test: `tests/content-tree/scaffold.test.ts`

**Interfaces:**
- Consumes: `CONTENT_TREE`, `ROOT_PAGES`, `Section`, `Entry` from Task 2.
- Produces: `scaffoldContent(destDir: string, tree: Section[]): Promise<ScaffoldStats>` where `ScaffoldStats = { written: number; unchanged: number; kept: number }`, `PLACEHOLDER: string`, and `contentTreeUrls(tree: Section[]): string[]`.

- [ ] **Step 1: Write the failing test**

Create `tests/content-tree/scaffold.test.ts`:

```ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { scaffoldContent, contentTreeUrls, PLACEHOLDER } from '@/content-tree/scaffold';
import { section, fns, type Section } from '@/content-tree/manifest';

const tree: Section[] = [
  section('standard-library', 'Standard Library', [], [
    section('string', 'string', fns('string', 'format upper')),
  ]),
];

let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'luadocs-scaffold-'));
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe('scaffoldContent', () => {
  it('writes a stub with the entry title and type', async () => {
    await scaffoldContent(dir, tree);

    const text = await readFile(join(dir, 'standard-library/string/format.mdx'), 'utf8');
    expect(text).toContain('title: string.format');
    expect(text).toContain('entry-type: function');
    expect(text).toContain(PLACEHOLDER);
    expect(text).not.toContain('lua-compat');
  });

  it('writes a meta.json using the rest item rather than listing every page', async () => {
    await scaffoldContent(dir, tree);

    const meta = JSON.parse(await readFile(join(dir, 'standard-library/string/meta.json'), 'utf8'));
    expect(meta).toEqual({ title: 'string', pages: ['index', '...'] });
  });

  it('gives every section an overview entry', async () => {
    await scaffoldContent(dir, tree);

    const text = await readFile(join(dir, 'standard-library/index.mdx'), 'utf8');
    expect(text).toContain('entry-type: overview');
    expect(text).toContain('title: Standard Library');
  });

  it('is idempotent — a second run writes nothing', async () => {
    await scaffoldContent(dir, tree);
    const second = await scaffoldContent(dir, tree);

    expect(second.written).toBe(0);
  });

  it('never overwrites an authored body', async () => {
    await scaffoldContent(dir, tree);
    const path = join(dir, 'standard-library/string/format.mdx');
    await writeFile(path, '---\ntitle: string.format\n---\n\nReal authored prose.\n', 'utf8');

    const stats = await scaffoldContent(dir, tree);

    expect(stats.kept).toBe(1);
    expect(await readFile(path, 'utf8')).toContain('Real authored prose.');
  });

  it('lists every entry URL for the prerenderer', () => {
    expect(contentTreeUrls(tree)).toEqual([
      '/docs/standard-library',
      '/docs/standard-library/string',
      '/docs/standard-library/string/format',
      '/docs/standard-library/string/upper',
    ]);
  });
});
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `npm test -- tests/content-tree/scaffold.test.ts`
Expected: FAIL — cannot resolve `@/content-tree/scaffold`.

- [ ] **Step 3: Write the generator**

Create `src/content-tree/scaffold.ts`:

```ts
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ROOT_PAGES, type EntryType, type Section } from './manifest';

/** The entire body of an unwritten entry. A JSX comment — MDX rejects `<!-- -->`. */
export const PLACEHOLDER = '{/* Not yet written. */}';

export interface ScaffoldStats {
  written: number;
  unchanged: number;
  /** Files left alone because someone had authored a real body into them. */
  kept: number;
}

function stub(title: string, type: EntryType): string {
  return `---\ntitle: ${title}\ndescription: ""\nentry-type: ${type}\n---\n\n${PLACEHOLDER}\n`;
}

function body(text: string): string {
  return text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').trim();
}

/**
 * Writing a stub is only ever safe over nothing, or over another stub. Once an
 * entry has a real body the generator must leave it alone — regenerating the tree
 * is a routine operation and must never be able to destroy authored work.
 */
async function writeStub(path: string, contents: string, stats: ScaffoldStats): Promise<void> {
  if (existsSync(path)) {
    const existing = await readFile(path, 'utf8');
    if (body(existing) !== PLACEHOLDER) {
      stats.kept++;
      return;
    }
    if (existing === contents) {
      stats.unchanged++;
      return;
    }
  }
  await writeFile(path, contents, 'utf8');
  stats.written++;
}

async function writeMeta(path: string, contents: string, stats: ScaffoldStats): Promise<void> {
  if (existsSync(path) && (await readFile(path, 'utf8')) === contents) {
    stats.unchanged++;
    return;
  }
  await writeFile(path, contents, 'utf8');
  stats.written++;
}

async function walk(sec: Section, parentDir: string, stats: ScaffoldStats): Promise<void> {
  const dir = join(parentDir, sec.slug);
  await mkdir(dir, { recursive: true });

  const meta = { title: sec.title, pages: sec.pages ?? ['index', '...'] };
  await writeMeta(join(dir, 'meta.json'), `${JSON.stringify(meta, null, 2)}\n`, stats);
  await writeStub(join(dir, 'index.mdx'), stub(sec.indexTitle ?? sec.title, 'overview'), stats);

  for (const e of sec.entries) {
    await writeStub(join(dir, `${e.slug}.mdx`), stub(e.title, e.type), stats);
  }
  for (const child of sec.sections) {
    await walk(child, dir, stats);
  }
}

export async function scaffoldContent(destDir: string, tree: Section[]): Promise<ScaffoldStats> {
  const stats: ScaffoldStats = { written: 0, unchanged: 0, kept: 0 };
  await mkdir(destDir, { recursive: true });

  const rootMeta = { pages: ROOT_PAGES };
  await writeMeta(join(destDir, 'meta.json'), `${JSON.stringify(rootMeta, null, 2)}\n`, stats);

  for (const sec of tree) {
    await walk(sec, destDir, stats);
  }
  return stats;
}

/**
 * Every docs URL the tree produces. The prerenderer discovers pages by crawling
 * links, which cannot see inside a collapsed sidebar folder — so the routes are
 * also listed explicitly, generated from the same source as the files themselves.
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
```

Note the ordering inside `contentTreeUrls`: child sections before entries, which is what the test asserts.

- [ ] **Step 4: Run the tests**

Run: `npm test -- tests/content-tree/scaffold.test.ts`
Expected: PASS, 6 tests.

- [ ] **Step 5: Add the CLI and its dependency**

```bash
npm install -D tsx
```

Create `scripts/scaffold-content.ts`:

```ts
import { scaffoldContent } from '../src/content-tree/scaffold';
import { CONTENT_TREE } from '../src/content-tree/manifest';

const stats = await scaffoldContent('content/docs', CONTENT_TREE);

console.log(
  `scaffold: ${stats.written} written, ${stats.unchanged} unchanged, ` +
    `${stats.kept} authored ${stats.kept === 1 ? 'entry' : 'entries'} kept`,
);
```

Add to `package.json` scripts, after `"test"`:

```json
    "content:scaffold": "tsx scripts/scaffold-content.ts",
```

- [ ] **Step 6: Run it and confirm it reproduces Task 1's hand-built tree**

Run: `npm run content:scaffold`

Then:

```bash
git status --short content/docs
```

Expected: the only changes are **added** files (`standard-library/index.mdx`, `standard-library/string/index.mdx`, `content/docs/meta.json`). The `meta.json` files and `format.mdx` that Task 1 wrote by hand must be **unmodified** — the generator agreeing with the hand-built result is the point of this step. If `format.mdx` shows as modified, the no-clobber guard is broken; fix it before continuing.

- [ ] **Step 7: Seed the prerenderer from the manifest**

In `vite.config.ts`, add the imports at the top:

```ts
import { CONTENT_TREE } from './src/content-tree/manifest';
import { contentTreeUrls } from './src/content-tree/scaffold';
```

and replace the `pages` array (currently `vite.config.ts:24-37`) with:

```ts
      pages: [
        { path: '/docs' },
        { path: '/api/search' },
        { path: 'llms-full.txt' },
        { path: 'llms.txt' },
        ...contentTreeUrls(CONTENT_TREE).map((path) => ({ path })),
      ],
```

`crawlLinks` stays `true`, so the `.md` variant of each entry is still discovered from the page itself.

- [ ] **Step 8: Build**

Run: `npm run build`
Expected: the prerender list now includes `/docs/standard-library` and `/docs/standard-library/string`.

- [ ] **Step 9: Commit**

```bash
git add src/content-tree tests/content-tree scripts package.json package-lock.json vite.config.ts content/docs
git commit -m "feat(content-tree): generate the tree from the manifest"
```

---

## Task 4: Fill in the standard library

**Files:**
- Modify: `src/content-tree/manifest.ts`
- Test: `tests/content-tree/manifest.test.ts`

**Interfaces:**
- Consumes: `section`, `entry`, `fns`, `consts`, `methods` from Task 2.
- Produces: a `standard-library` section with 11 child sections and 171 entries.

- [ ] **Step 1: Write the failing test**

Append to `tests/content-tree/manifest.test.ts`:

```ts
describe('the standard library', () => {
  const counts: Record<string, number> = {
    basic: 31,
    coroutine: 8,
    package: 10,
    string: 19,
    utf8: 6,
    table: 12,
    math: 35,
    io: 14,
    'file-methods': 7,
    os: 11,
    debug: 18,
  };

  it.each(Object.entries(counts))('has %s with %i entries', (slug, count) => {
    expect(all.find((s) => s.slug === slug)?.entries).toHaveLength(count);
  });

  it('has 171 entries in total', () => {
    const lib = all.find((s) => s.slug === 'standard-library')!;
    const total = walk(lib.sections).reduce((n, s) => n + s.entries.length, 0);
    expect(total).toBe(171);
  });

  it('titles a bare global without a library prefix', () => {
    const basic = all.find((s) => s.slug === 'basic')!;
    expect(basic.entries.find((e) => e.slug === 'pcall')?.title).toBe('pcall');
    expect(basic.entries.find((e) => e.slug === '_g')?.title).toBe('_G');
  });

  it('titles a file method with a colon', () => {
    const file = all.find((s) => s.slug === 'file-methods')!;
    expect(file.entries.find((e) => e.slug === 'read')?.title).toBe('file:read');
  });
});
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `npm test -- tests/content-tree/manifest.test.ts`
Expected: FAIL — every count assertion but `string` fails on `undefined`.

- [ ] **Step 3: Replace the `standard-library` section in `CONTENT_TREE`**

```ts
  section('standard-library', 'Standard Library', [], [
    section('basic', 'Basic functions', [
      ...fns('', 'assert collectgarbage dofile error getfenv getmetatable ipairs load loadfile loadstring module next pairs pcall print rawequal rawget rawlen rawset require select setfenv setmetatable tonumber tostring type unpack warn xpcall'),
      entry('_g', '_G', 'constant'),
      entry('_version', '_VERSION', 'constant'),
    ]),
    section('coroutine', 'coroutine',
      fns('coroutine', 'close create isyieldable resume running status wrap yield')),
    section('package', 'package', [
      ...consts('package', 'config cpath loaded loaders path preload searchers'),
      ...fns('package', 'loadlib searchpath seeall'),
    ]),
    section('string', 'string', [
      ...fns('string', 'byte char dump find format gmatch gsub len lower match pack packsize rep reverse sub unpack upper'),
      entry('patterns', 'Patterns', 'construct'),
      entry('pack-formats', 'Format strings for pack and unpack', 'construct'),
    ]),
    section('utf8', 'utf8', [
      ...fns('utf8', 'char codepoint codes len offset'),
      ...consts('utf8', 'charpattern'),
    ]),
    section('table', 'table',
      fns('table', 'concat create foreach foreachi getn insert maxn move pack remove sort unpack')),
    section('math', 'math', [
      ...fns('math', 'abs acos asin atan atan2 ceil cos cosh deg exp floor fmod frexp ldexp log log10 max min modf pow rad random randomseed sin sinh sqrt tan tanh tointeger type ult'),
      ...consts('math', 'huge maxinteger mininteger pi'),
    ]),
    section('io', 'io', [
      ...fns('io', 'close flush input lines open output popen read tmpfile type write'),
      ...consts('io', 'stderr stdin stdout'),
    ], [
      section('file-methods', 'File methods',
        methods('file', 'close flush lines read seek setvbuf write')),
    ]),
    section('os', 'os',
      fns('os', 'clock date difftime execute exit getenv remove rename setlocale time tmpname')),
    section('debug', 'debug',
      fns('debug', 'debug getfenv gethook getinfo getlocal getmetatable getregistry getupvalue getuservalue sethook setfenv setlocal setmetatable setupvalue setuservalue traceback upvalueid upvaluejoin')),
  ]),
```

Every symbol the 5.5 manual omits — `getfenv`, `setfenv`, `loadstring`, `module`, `unpack`, `package.loaders`, `package.seeall`, `table.foreach`, `table.foreachi`, `table.getn`, `table.maxn`, `math.atan2`, `math.cosh`, `math.log10`, `math.pow`, `math.sinh`, `math.tanh`, `debug.getfenv`, `debug.setfenv` — is present on purpose. Those exist in 5.1 or 5.2, and one entry serves every version (ADR 0001).

- [ ] **Step 4: Run the tests**

Run: `npm test -- tests/content-tree/manifest.test.ts`
Expected: PASS. If a count is off by one, the space-separated list is the place to look.

- [ ] **Step 5: Generate and build**

```bash
npm run content:scaffold
npm run build
```

Expected: ~190 files written; the build prerenders them without error.

- [ ] **Step 6: Commit**

```bash
git add src/content-tree/manifest.ts tests/content-tree/manifest.test.ts content/docs
git commit -m "content: scaffold the standard library tree"
```

---

## Task 5: Fill in the language section

Titles here are prose, not mechanical, so entries are written out one by one rather than derived from a space-separated list.

**Files:**
- Modify: `src/content-tree/manifest.ts`
- Test: `tests/content-tree/manifest.test.ts`

**Interfaces:**
- Consumes: `section`, `entry`, `metamethods` from Task 2.
- Produces: a `language` section with 10 child sections and 74 entries.

- [ ] **Step 1: Write the failing test**

Append to `tests/content-tree/manifest.test.ts`:

```ts
describe('the language section', () => {
  it('has 74 entries in total', () => {
    const language = all.find((s) => s.slug === 'language')!;
    const total = walk(language.sections).reduce((n, s) => n + s.entries.length, 0);
    expect(total).toBe(74);
  });

  it('gives the coroutines concept an overview but no entries', () => {
    expect(all.find((s) => s.slug === 'coroutines')?.entries).toHaveLength(0);
  });

  it('slugs a metamethod without its underscores and titles it with them', () => {
    const meta = all.find((s) => s.slug === 'metatables')!;
    expect(meta.entries.find((e) => e.slug === 'index')?.title).toBe('__index');
  });

  it('groups the arithmetic and bitwise metamethods into one entry each', () => {
    const meta = all.find((s) => s.slug === 'metatables')!;
    expect(meta.entries).toHaveLength(19);
    expect(meta.entries.map((e) => e.slug)).toContain('arithmetic-metamethods');
    expect(meta.entries.map((e) => e.slug)).toContain('bitwise-metamethods');
  });

  it('puts to-be-closed variables under statements, as the manual does', () => {
    const statements = all.find((s) => s.slug === 'statements')!;
    expect(statements.entries.map((e) => e.slug)).toContain('to-be-closed-variables');
  });
});
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `npm test -- tests/content-tree/manifest.test.ts`
Expected: FAIL — `language` is not in the tree.

- [ ] **Step 3: Add the `language` section to `CONTENT_TREE`, before `standard-library`**

```ts
  section('language', 'Language', [], [
    section('lexical-conventions', 'Lexical conventions', [
      entry('comments', 'Comments', 'construct'),
      entry('identifiers-and-keywords', 'Identifiers and keywords', 'construct'),
      entry('numeric-literals', 'Numeric literals', 'construct'),
      entry('string-literals', 'String literals', 'construct'),
    ]),
    section('values-and-types', 'Values and types', [
      entry('nil', 'nil', 'construct'),
      entry('boolean', 'boolean', 'construct'),
      entry('number', 'number', 'construct'),
      entry('string', 'string', 'construct'),
      entry('table', 'table', 'construct'),
      entry('function', 'function', 'construct'),
      entry('userdata', 'userdata', 'construct'),
      entry('thread', 'thread', 'construct'),
      entry('type-coercion', 'Coercions and conversions', 'construct'),
    ]),
    section('variables-and-scope', 'Variables and scope', [
      entry('global-variables', 'Global variables', 'construct'),
      entry('local-variables', 'Local variables', 'construct'),
      entry('upvalues-and-closures', 'Upvalues and closures', 'construct'),
      entry('scope-rules', 'Scope', 'construct'),
      entry('variable-attributes', 'Variable attributes', 'construct'),
    ]),
    section('statements', 'Statements', [
      entry('assignment', 'Assignment', 'construct'),
      entry('do-blocks', 'do … end blocks', 'construct'),
      entry('if', 'if', 'construct'),
      entry('while', 'while', 'construct'),
      entry('repeat', 'repeat … until', 'construct'),
      entry('numeric-for', 'Numeric for', 'construct'),
      entry('generic-for', 'Generic for', 'construct'),
      entry('break', 'break', 'construct'),
      entry('goto', 'goto', 'construct'),
      entry('return', 'return', 'construct'),
      entry('function-declarations', 'Function declarations', 'construct'),
      entry('local-declarations', 'local declarations', 'construct'),
      entry('global-declarations', 'global declarations', 'construct'),
      entry('to-be-closed-variables', 'To-be-closed variables', 'construct'),
    ]),
    section('expressions', 'Expressions', [
      entry('arithmetic-operators', 'Arithmetic operators', 'construct'),
      entry('bitwise-operators', 'Bitwise operators', 'construct'),
      entry('relational-operators', 'Relational operators', 'construct'),
      entry('logical-operators', 'Logical operators', 'construct'),
      entry('concatenation', 'Concatenation', 'construct'),
      entry('length-operator', 'Length operator', 'construct'),
      entry('operator-precedence', 'Operator precedence', 'construct'),
      entry('table-constructors', 'Table constructors', 'construct'),
      entry('function-calls', 'Function calls', 'construct'),
      entry('method-calls', 'Method calls', 'construct'),
      entry('anonymous-functions', 'Anonymous functions', 'construct'),
      entry('varargs', 'Varargs', 'construct'),
      entry('multiple-results', 'Multiple results and adjustment', 'construct'),
    ]),
    section('metatables', 'Metatables and metamethods', [
      ...metamethods('index newindex call tostring len eq lt le concat unm gc close mode name metatable pairs ipairs'),
      entry('arithmetic-metamethods', 'Arithmetic metamethods', 'construct'),
      entry('bitwise-metamethods', 'Bitwise metamethods', 'construct'),
    ]),
    section('environments', 'Environments', [
      entry('env', '_ENV', 'construct'),
      entry('the-global-environment', 'The global environment', 'construct'),
    ]),
    section('error-handling', 'Error handling', [
      entry('error-objects', 'Error objects', 'construct'),
      entry('protected-calls', 'Protected calls', 'construct'),
      entry('error-levels', 'Error levels', 'construct'),
      entry('warnings', 'Warnings', 'construct'),
    ]),
    section('garbage-collection', 'Garbage collection', [
      entry('incremental-mode', 'Incremental mode', 'construct'),
      entry('generational-mode', 'Generational mode', 'construct'),
      entry('weak-tables', 'Weak tables', 'construct'),
      entry('finalizers', 'Finalizers', 'construct'),
    ]),
    section('coroutines', 'Coroutines'),
  ]),
```

- [ ] **Step 4: Run the tests**

Run: `npm test -- tests/content-tree/manifest.test.ts`
Expected: PASS.

- [ ] **Step 5: Generate and build**

```bash
npm run content:scaffold
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add src/content-tree/manifest.ts tests/content-tree/manifest.test.ts content/docs
git commit -m "content: scaffold the language tree"
```

---

## Task 6: Fill in standalone, C API, guides and learn

**Files:**
- Modify: `src/content-tree/manifest.ts`
- Test: `tests/content-tree/manifest.test.ts`

**Interfaces:**
- Consumes: `section`, `entry` from Task 2.
- Produces: the remaining four top-level sections, completing `CONTENT_TREE`.

- [ ] **Step 1: Write the failing test**

Append to `tests/content-tree/manifest.test.ts`:

```ts
describe('the remaining sections', () => {
  it('gives the standalone interpreter its own group', () => {
    const standalone = all.find((s) => s.slug === 'standalone')!;
    expect(standalone.entries).toHaveLength(6);
    expect(standalone.entries.find((e) => e.slug === 'lua-path')?.title).toBe('LUA_PATH');
  });

  it('stubs the C API to group level only', () => {
    const cApi = all.find((s) => s.slug === 'c-api')!;
    expect(cApi.sections).toHaveLength(11);
    for (const group of cApi.sections) {
      expect(group.entries, group.slug).toHaveLength(0);
    }
  });

  it('types every guide as a guide', () => {
    const guides = all.find((s) => s.slug === 'guides')!;
    expect(guides.entries).toHaveLength(4);
    for (const g of guides.entries) expect(g.type).toBe('guide');
  });

  it('orders the top-level groups', () => {
    expect(CONTENT_TREE.map((s) => s.slug)).toEqual([
      'learn',
      'guides',
      'language',
      'standard-library',
      'standalone',
      'c-api',
    ]);
  });
});
```

Add `CONTENT_TREE` to the existing import at the top of the file if it is not already there — it is, from Task 2.

- [ ] **Step 2: Run it to make sure it fails**

Run: `npm test -- tests/content-tree/manifest.test.ts`
Expected: FAIL — `standalone` is not in the tree.

- [ ] **Step 3: Complete `CONTENT_TREE`**

Put `learn` and `guides` first in the array, and `standalone` and `c-api` after `standard-library`:

```ts
  section('learn', 'Learn'),
  section('guides', 'Guides', [
    entry('lua-in-the-wild', 'Lua in the wild', 'guide'),
    entry('luarocks-and-the-ecosystem', 'LuaRocks and the ecosystem', 'guide'),
    entry('how-metatables-work', 'How metatables really work', 'guide'),
    entry('history-of-lua', 'A history of Lua', 'guide'),
  ]),
```

```ts
  section('standalone', 'Standalone interpreter', [
    entry('command-line-options', 'Command-line options', 'construct'),
    entry('script-execution', 'Script execution', 'construct'),
    entry('arg', 'arg', 'constant'),
    entry('lua-path', 'LUA_PATH', 'constant'),
    entry('lua-cpath', 'LUA_CPATH', 'constant'),
    entry('lua-init', 'LUA_INIT', 'constant'),
  ]),
  section('c-api', 'C API', [], [
    section('types', 'Types'),
    section('stack-manipulation', 'Stack manipulation'),
    section('types-and-values', 'Types and values'),
    section('calling', 'Calling'),
    section('error-handling', 'Error handling'),
    section('references-and-registry', 'References and the registry'),
    section('userdata', 'Userdata'),
    section('coroutines', 'Coroutines'),
    section('debug-interface', 'Debug interface'),
    section('auxiliary-library', 'Auxiliary library'),
    section('constants', 'Constants'),
  ]),
```

- [ ] **Step 4: Run the whole suite**

Run: `npm test`
Expected: PASS. The `keeps every slug unique within its section` invariant matters here — `c-api/error-handling` and `c-api/coroutines` repeat slugs used under `language`, which is fine because uniqueness is scoped to a section.

- [ ] **Step 5: Generate and build**

```bash
npm run content:scaffold
npm run build
```

Expected: the prerender list now covers every section. The build is much longer than before — roughly 295 pages plus their `.md` variants.

- [ ] **Step 6: Commit**

```bash
git add src/content-tree/manifest.ts tests/content-tree/manifest.test.ts content/docs
git commit -m "content: scaffold standalone, C API and guides"
```

---

## Task 7: Wire `entry-type` into the schema and close out

**Files:**
- Modify: `src/lib/source.ts:14-21`, `docs/plans/ROADMAP.md`
- Move: `content/docs/math.tointeger.mdx` → `content/docs/standard-library/math/tointeger.mdx`
- Modify: `tests/e2e/string-format.test.tsx:99`
- Test: `tests/content-tree/manifest.test.ts`

**Interfaces:**
- Consumes: `ENTRY_TYPES` from Task 2.
- Produces: nothing further.

- [ ] **Step 1: Write the failing test**

`defineDocs` is a build-time macro, so its schema must be written inline and cannot be imported into a test (see the comment at `src/lib/source.ts:8`). The enum is therefore duplicated — once in the manifest, once in the schema — and this test guards the duplication against drift.

Append to `tests/content-tree/manifest.test.ts`:

```ts
import { readFileSync } from 'node:fs';

describe('the frontmatter schema', () => {
  const source = readFileSync('src/lib/source.ts', 'utf8');

  it('declares every entry type the manifest can produce', () => {
    for (const type of ENTRY_TYPES) {
      expect(source, `entry-type '${type}' missing from source.ts`).toContain(`'${type}'`);
    }
  });
});
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `npm test -- tests/content-tree/manifest.test.ts`
Expected: FAIL — `'function'` is not in `source.ts`.

- [ ] **Step 3: Add the field**

In `src/lib/source.ts`, extend the schema:

```ts
    schema: pageSchema.extend({
      /** Key into the compat dataset — the entry's single source of version facts. */
      'lua-compat': z.string().optional(),
      /**
       * Which reference template the entry follows (see docs/research/page-structure.md).
       * Kept in sync with ENTRY_TYPES in src/content-tree/manifest.ts by a test —
       * `defineDocs` is a macro, so this list cannot be imported.
       */
      'entry-type': z
        .enum(['function', 'construct', 'constant', 'overview', 'guide'])
        .optional(),
    }),
```

- [ ] **Step 4: Run the tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Move the second authored entry**

```bash
git mv content/docs/math.tointeger.mdx content/docs/standard-library/math/tointeger.mdx
```

The generator already created `standard-library/math/tointeger.mdx` as a stub in Task 4, so this overwrites it — that is correct and is the one place a stub is meant to lose. Confirm the authored body survived:

```bash
grep -c "tointeger" content/docs/standard-library/math/tointeger.mdx
```

Expected: at least 1, and the file must **not** contain `Not yet written`.

Then update the last flat URL in `tests/e2e/string-format.test.tsx`:

```tsx
const compatByUrl: Record<string, string> = {
  '/docs/standard-library/math/tointeger': 'math.tointeger',
  '/docs/standard-library/string/format': 'string.format',
};
```

and the `mathItem` URL:

```tsx
const mathItem: PageTree.Item = {
  type: 'page',
  name: 'math.tointeger',
  url: '/docs/standard-library/math/tointeger',
};
```

- [ ] **Step 6: Prove the generator cannot destroy authored work**

```bash
npm run content:scaffold
```

Expected output: `... 2 authored entries kept`. Then:

```bash
git status --short content/docs
```

Expected: no modifications to `standard-library/string/format.mdx` or `standard-library/math/tointeger.mdx`. This is the single most important guarantee in the whole plan — if it fails, stop and fix `writeStub`.

- [ ] **Step 7: Update the roadmap**

In `docs/plans/ROADMAP.md`, add a row to the Status table between slice 1 and slice 2:

```markdown
| 1.5 | Content tree — the blueprint | [2026-08-04-content-tree.md](2026-08-04-content-tree.md) | Done |
```

And in the "### 3. Content pipeline" prose, replace `the section /\nentry tree and sidebar generation from the page-tree` with:

```markdown
sidebar generation from the page-tree (the section/entry tree itself landed early —
see slice 1.5),
```

Add to the "### 8. Deploy" section:

```markdown
**Blocked on content:** slice 1.5 left ~285 entries as empty stubs. Deploy must not
ship them — either they are authored, or the build filters unwritten entries out of
the sidebar, search index and `llms.txt` first.
```

- [ ] **Step 8: Final gate**

Run all three, and confirm each:

```bash
npm test
```
Expected: PASS, every test.

```bash
npm run types:check
```
Expected: no output.

```bash
npm run build
```
Expected: completes; the prerender list includes `/docs/standard-library/math/tointeger` and `/docs/standard-library/string/format`.

Then confirm no stray flat entries survive:

```bash
ls content/docs/*.mdx
```
Expected: only `index.mdx`.

- [ ] **Step 9: Commit**

```bash
git add src/lib/source.ts tests content/docs docs/plans/ROADMAP.md
git commit -m "feat(content): add entry-type and finish the tree"
```

---

## Notes for the reviewer

Two things in this plan are judgement calls worth checking rather than assuming:

- **The `language` decomposition is not manual-verified** the way the standard library is. There is no identifier index for language constructs, so those 74 entries come from the manual's §2–§3 outline plus a decision about granularity (`method-calls` as its own entry rather than folded into `function-calls`, `scope-rules` separate from `local-variables`). Renaming or merging is cheap while the files are empty and expensive later.
- **The C API group names are invented.** The manual has no such grouping; it lists identifiers alphabetically. Eleven groups is a guess at a useful shape, not a derived fact.

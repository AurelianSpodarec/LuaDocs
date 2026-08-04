# Sidebar IA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the sidebar match [ADR 0006](../adr/0006-sidebar-order-and-grouping.md) — curated order, one row per section, and MDN-style collapsible groups inside a section.

**Architecture:** The manifest stays the single source of truth. Each entry gains a `group` name; the scaffold stops using the `"..."` glob and writes the manifest's explicit order, emitting `---Group---` separators where a section holds more than one kind of entry. The sidebar folds each separator and its following items into an index-less `PageTree.Folder`, which fumadocs already renders as a collapsible, non-link trigger — MDN's `<details>`/`<summary>`.

**Tech Stack:** TypeScript, `fumadocs-core` (page tree), `fumadocs-ui` (sidebar slots), React 19, Vitest.

## Global Constraints

- All work stays on `dev`. Never merge into `main`. Ask before any merge or push.
- Commit style: `type(scope): summary`, imperative, ≤ ~60 chars, no trailing period, **never** a `Co-Authored-By` trailer. See `docs/conventions/commit-messages.md`.
- Use the [CONTEXT.md](../../CONTEXT.md) vocabulary: **entry**, **section**, **group**, **overview**. A group is never called a divider, separator, or subsection.
- URL depth is exactly three: Area → Section → Entry. Nothing deeper.
- The scaffold **creates but never updates** (`src/content-tree/scaffold.ts`). Changing generated output means deleting the affected files and regenerating — a re-run alone does nothing.
- `npm test` and `npm run types:check` must pass at the end of every task.

## File Structure

| File | Responsibility | Change |
|---|---|---|
| `src/content-tree/manifest.ts` | The tree as data | Modify: add `group` to `Entry`, reorder, flatten, rename |
| `src/content-tree/scaffold.ts` | Manifest → `content/docs/` | Modify: emit explicit ordered `pages` with separators |
| `src/sidebar/groupPageTree.ts` | Fold separators into collapsible groups; rewrite entry labels | **Create** |
| `src/sidebar/Sidebar.tsx` | Per-item render (version dimming) | Unchanged |
| `src/routes/docs/$.tsx` | Loader + layout wiring | Modify: build `entryTypeByUrl`, apply the transform |
| `tests/content-tree/manifest.test.ts` | Tree invariants | Modify: update counts/order, add rule guards |
| `tests/content-tree/scaffold.test.ts` | Generator behaviour | Modify: `pages` expectations |
| `tests/sidebar/groupPageTree.test.ts` | Grouping + labelling | **Create** |
| `content/docs/**` | The committed tree | Regenerated |

---

### Task 1: Group every entry, and parenthesise callables

Two changes to what an `Entry` says about itself. A `group` names the collapsible
run it belongs to. And a callable's **title** carries `()` — as MDN titles its page
`Math.abs()`, not just its sidebar row — so the parentheses reach the page heading,
the breadcrumb, and search, not only the sidebar.

The manual's anchors have no parentheses (`pdf-string.format`), so the anchor must
be built from the bare name.

**Files:**
- Modify: `src/content-tree/manifest.ts`
- Test: `tests/content-tree/manifest.test.ts`

**Interfaces:**
- Produces: `Entry.group: string`; titles of `type: 'function'` entries end in `()`

- [ ] **Step 1: Write the failing test**

Add to `tests/content-tree/manifest.test.ts`:

```ts
describe('entry groups', () => {
  it('groups every entry by kind', () => {
    const math = all.find((s) => s.slug === 'math')!;
    expect(math.entries.find((e) => e.slug === 'abs')?.group).toBe('Functions');
    expect(math.entries.find((e) => e.slug === 'pi')?.group).toBe('Constants');
  });

  it('keeps a section\'s entries contiguous by group', () => {
    for (const s of all) {
      const seen = new Set<string>();
      let last: string | null = null;
      for (const e of s.entries) {
        if (e.group !== last) {
          expect(seen.has(e.group), `${s.slug} revisits ${e.group}`).toBe(false);
          seen.add(e.group);
          last = e.group;
        }
      }
    }
  });
});

describe('callable titles', () => {
  it('parenthesises a function and leaves a constant bare', () => {
    const math = all.find((s) => s.slug === 'math')!;
    expect(math.entries.find((e) => e.slug === 'abs')?.title).toBe('math.abs()');
    expect(math.entries.find((e) => e.slug === 'pi')?.title).toBe('math.pi');
  });

  it('parenthesises a bare global and a file method', () => {
    expect(all.find((s) => s.slug === 'globals')!.entries
      .find((e) => e.slug === 'pcall')?.title).toBe('pcall()');
    expect(all.find((s) => s.slug === 'io')!.entries
      .find((e) => e.slug === 'file-read')?.title).toBe('file:read()');
  });

  it('keeps the parentheses out of the manual anchor', () => {
    const math = all.find((s) => s.slug === 'math')!;
    expect(sourceUrl(math.entries.find((e) => e.slug === 'abs')!.source))
      .toBe('https://www.lua.org/manual/5.5/manual.html#pdf-math.abs');
  });
});
```

Update the existing `builds a manual URL from a source` test — the title gains
parentheses, the anchor does not:

```ts
    expect(format.title).toBe('string.format()');
    expect(sourceUrl(format.source)).toBe(
      'https://www.lua.org/manual/5.5/manual.html#pdf-string.format',
    );
```

Update `titles a bare global without a library prefix` to expect `pcall()`, and
leave `_G` bare.

- [ ] **Step 2: Run it and watch it fail**

```bash
npx vitest run tests/content-tree/manifest.test.ts -t "entry groups"
```
Expected: FAIL — `group` is `undefined`.

- [ ] **Step 3: Add the field and default it by type**

In `src/content-tree/manifest.ts`, add to `Entry`:

```ts
  /** Sidebar group this entry belongs to. Entries sharing one are shown together. */
  group: string;
```

Add above `entry()`:

```ts
/** The group an entry falls into when its helper does not say otherwise. */
const GROUP_BY_TYPE: Record<EntryType, string> = {
  function: 'Functions',
  constant: 'Constants',
  construct: 'Concepts',
  guide: 'Guides',
  overview: 'Overview',
};
```

Change `entry()` to take an optional group and default it:

```ts
export function entry(
  slug: string,
  title: string,
  type: EntryType,
  anchor: string,
  version: LuaVersion = '5.5',
  group: string = GROUP_BY_TYPE[type],
): Entry {
  return { slug, title, type, group, source: { version, anchor } };
}
```

Thread a `group` parameter through `build()`, and parenthesise the title while
keeping the anchor bare:

```ts
function build(
  lib: string, names: string, type: EntryType, version: LuaVersion,
  sep = '.', group?: string,
): Entry[] {
  return split(names).map((slug) => {
    const name = lib ? `${lib}${sep}${slug}` : slug;
    // The manual anchors the bare name — `pdf-string.format`, never `pdf-string.format()`.
    return entry(slug, call(name, type), type, `pdf-${name}`, version, group);
  });
}
```

Add the helper next to `GROUP_BY_TYPE`:

```ts
/**
 * A callable's title carries its parentheses, as MDN's do (`Math.abs()`). The title
 * is the page heading, the breadcrumb and the search result, not just a sidebar row,
 * so the distinction between `math.abs()` and `math.pi` belongs in the data.
 */
function call(name: string, type: EntryType): string {
  return type === 'function' ? `${name}()` : name;
}
```

- [ ] **Step 4: Run the test**

```bash
npx vitest run tests/content-tree/manifest.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/content-tree/manifest.ts tests/content-tree/manifest.test.ts
git commit -m "feat(content-tree): group entries and parenthesise callables"
```

---

### Task 2: Flatten file methods into `io`

`File methods` is a fourth level today. It becomes a group. Five of its slugs
(`close`, `flush`, `lines`, `read`, `write`) collide with `io.*`, so file-method
slugs take a `file-` prefix while titles keep the `file:` form.

**Files:**
- Modify: `src/content-tree/manifest.ts`
- Test: `tests/content-tree/manifest.test.ts`

**Interfaces:**
- Consumes: `Entry.group` (Task 1)
- Produces: `methods(receiver, names)` → slug `file-read`, title `file:read`, group `File methods`

- [ ] **Step 1: Write the failing test**

Replace the existing `titles a file method with a colon` test with:

```ts
it('folds file methods into io, prefixing their slugs to avoid collisions', () => {
  expect(all.find((s) => s.slug === 'file-methods')).toBeUndefined();

  const io = all.find((s) => s.slug === 'io')!;
  const read = io.entries.find((e) => e.slug === 'file-read')!;
  expect(read.title).toBe('file:read()');
  expect(read.group).toBe('File methods');

  // io.read and file:read now live side by side and must not collide.
  expect(io.entries.find((e) => e.slug === 'read')?.title).toBe('io.read()');
});
```

Update the `counts` record in `describe('the standard library')`: drop the
`'file-methods': 7` line and change `io: 14` to `io: 21`.

- [ ] **Step 2: Run it and watch it fail**

```bash
npx vitest run tests/content-tree/manifest.test.ts
```
Expected: FAIL — `file-methods` still exists, `io` has 14 entries.

- [ ] **Step 3: Rewrite `methods()` and fold the section in**

```ts
/** `methods('file', 'read seek')` → slugs `file-read`/`file-seek`, titles `file:read`/`file:seek`. */
export function methods(receiver: string, names: string): Entry[] {
  return split(names).map((name) =>
    entry(`${receiver}-${name}`, `${receiver}:${name}`, 'function',
      `pdf-${receiver}:${name}`, '5.5', 'File methods'),
  );
}
```

In `CONTENT_TREE`, replace the `io` section's third argument (the nested
`file-methods` section array) with `[]`, and append the methods to its entries:

```ts
    section('io', 'io', '6.9', [
      ...fns('io', 'close flush input lines open output popen read tmpfile type write'),
      ...consts('io', 'stderr stdin stdout'),
      ...methods('file', 'close flush lines read seek setvbuf write'),
    ]),
```

- [ ] **Step 4: Run the test**

```bash
npx vitest run tests/content-tree/manifest.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/content-tree/manifest.ts tests/content-tree/manifest.test.ts
git commit -m "refactor(content-tree): fold file methods into io"
```

---

### Task 3: Turn entry-less sections into entries

`Language > Coroutines` and all eleven C API sections are folders wrapping a lone
overview. They become entries. The C API's duplicate `Types` / `Types and values`
(both empty, both anchored `4.6`) merge into one.

**Files:**
- Modify: `src/content-tree/manifest.ts`
- Test: `tests/content-tree/manifest.test.ts`

- [ ] **Step 1: Write the failing test**

Replace `gives the coroutines concept an overview but no entries` and
`stubs the C API to group level only` with:

```ts
it('has no section without entries', () => {
  // An Area may be an empty placeholder (Learn); a Section may not.
  for (const area of CONTENT_TREE) {
    for (const s of walk(area.sections)) {
      expect(s.entries.length, `${s.slug} has no entries`).toBeGreaterThan(0);
    }
  }
});

it('makes coroutines an entry of language, not a folder', () => {
  const language = CONTENT_TREE.find((s) => s.slug === 'language')!;
  expect(language.sections.map((s) => s.slug)).not.toContain('coroutines');
  expect(language.entries.map((e) => e.slug)).toContain('coroutines');
});

it('lists the C API as entries, merging the duplicate types section', () => {
  const cApi = CONTENT_TREE.find((s) => s.slug === 'c-api')!;
  expect(cApi.sections).toHaveLength(0);
  expect(cApi.entries).toHaveLength(10);
  expect(cApi.entries.map((e) => e.slug)).toContain('types-and-values');
  expect(cApi.entries.map((e) => e.slug)).not.toContain('types');
});
```

- [ ] **Step 2: Run it and watch it fail**

```bash
npx vitest run tests/content-tree/manifest.test.ts
```
Expected: FAIL — `coroutines` is still a section, `c-api` still has 11.

- [ ] **Step 3: Convert them**

In the `language` section, delete `section('coroutines', 'Coroutines', '2.6')`
from its `sections` array and add to its (currently empty) `entries` array:

```ts
  section('language', 'Language', '3', [
    construct('coroutines', 'Coroutines', '2.6'),
  ], [
```

Replace the whole `c-api` section with entries:

```ts
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
```

- [ ] **Step 4: Run the test**

```bash
npx vitest run tests/content-tree/manifest.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/content-tree/manifest.ts tests/content-tree/manifest.test.ts
git commit -m "refactor(content-tree): demote entry-less sections to entries"
```

---

### Task 4: Apply the curated order

The orders are recorded in [ADR 0006](../adr/0006-sidebar-order-and-grouping.md)
under "The curated orders". `basic` is renamed to `globals`.

**Files:**
- Modify: `src/content-tree/manifest.ts`
- Test: `tests/content-tree/manifest.test.ts`

- [ ] **Step 1: Write the failing test**

Replace `orders the top-level groups` with:

```ts
it('orders the areas', () => {
  expect(CONTENT_TREE.map((s) => s.slug)).toEqual([
    'learn', 'guides', 'standard-library', 'language', 'standalone', 'c-api',
  ]);
});

it('orders the areas the same way in ROOT_PAGES', () => {
  expect(ROOT_PAGES).toEqual(['index', ...CONTENT_TREE.map((s) => s.slug)]);
});

it('orders the standard library by how often a reader reaches for it', () => {
  const lib = CONTENT_TREE.find((s) => s.slug === 'standard-library')!;
  expect(lib.sections.map((s) => s.slug)).toEqual([
    'globals', 'string', 'table', 'math', 'io',
    'os', 'coroutine', 'utf8', 'package', 'debug',
  ]);
});

it('orders the language sections for learning', () => {
  const language = CONTENT_TREE.find((s) => s.slug === 'language')!;
  expect(language.sections.map((s) => s.slug)).toEqual([
    'values-and-types', 'lexical-conventions', 'variables-and-scope',
    'statements', 'expressions', 'metatables', 'environments',
    'error-handling', 'garbage-collection',
  ]);
});
```

Add `ROOT_PAGES` to the imports at the top of the file. Update the `counts`
record: rename the `basic: 31` key to `globals: 31`.

- [ ] **Step 2: Run it and watch it fail**

```bash
npx vitest run tests/content-tree/manifest.test.ts
```
Expected: FAIL — order mismatches, `basic` not `globals`.

- [ ] **Step 3: Reorder**

Derive `ROOT_PAGES` rather than hand-listing it, so it cannot drift:

```ts
/** Order of the areas in the sidebar. `index` is the authored site root. */
export const ROOT_PAGES = ['index', ...CONTENT_TREE.map((s) => s.slug)];
```

Move this declaration **below** `CONTENT_TREE` — a `const` cannot be read before
it is initialised.

Reorder the top level of `CONTENT_TREE` to `learn, guides, standard-library,
language, standalone, c-api`. Reorder `standard-library`'s sections to `globals,
string, table, math, io, os, coroutine, utf8, package, debug`, renaming
`section('basic', 'Basic functions', '6.2', …)` to
`section('globals', 'Globals', '6.2', …)`. Reorder `language`'s sections per the
test above. Reorder the `statements` entries to the ADR's curated list.

- [ ] **Step 4: Run the full suite**

```bash
npm test && npm run types:check
```
Expected: PASS, except `tests/content-tree/committed-tree.test.ts` — the tree on
disk still has `basic/` and no `globals/`. Task 6 fixes that.

- [ ] **Step 5: Commit**

```bash
git add src/content-tree/manifest.ts tests/content-tree/manifest.test.ts
git commit -m "feat(content-tree): order the tree for readers, not the manual"
```

---

### Task 5: Emit the explicit order, with group separators

**Files:**
- Modify: `src/content-tree/manifest.ts`, `src/content-tree/scaffold.ts`
- Test: `tests/content-tree/scaffold.test.ts`

**Interfaces:**
- Produces: `pagesOf(sec: Section): string[]`

- [ ] **Step 1: Write the failing test**

Replace `writes a meta.json using the rest item rather than listing every entry`:

```ts
it('writes a meta.json listing pages in manifest order, without the index', async () => {
  await scaffoldContent(dir, tree);

  const meta = JSON.parse(await readFile(join(dir, 'standard-library/string/meta.json'), 'utf8'));
  // No `index`: the folder claims its own overview, so it is one row, not two.
  expect(meta).toEqual({ title: 'string', pages: ['format', 'upper'] });
});

it('separates groups only when a section holds more than one kind of entry', async () => {
  const mixed: Section[] = [
    section('standard-library', 'Standard Library', '6', [], [
      section('math', 'math', '6.8', [...fns('math', 'abs ceil'), ...consts('math', 'pi')]),
    ]),
  ];
  await scaffoldContent(dir, mixed);

  const meta = JSON.parse(await readFile(join(dir, 'standard-library/math/meta.json'), 'utf8'));
  expect(meta.pages).toEqual(['---Functions---', 'abs', 'ceil', '---Constants---', 'pi']);
});
```

Add `consts` to the manifest imports in this test file.

- [ ] **Step 2: Run it and watch it fail**

```bash
npx vitest run tests/content-tree/scaffold.test.ts
```
Expected: FAIL — `pages` is `['index', '...']`.

- [ ] **Step 3: Add `pagesOf` and use it**

In `src/content-tree/manifest.ts`:

```ts
/**
 * A section's `meta.json` `pages`, in manifest order. Child sections first, then
 * entries. `index` is deliberately absent — leaving it unlisted lets the loader
 * claim it as the folder's own link, so a section is one sidebar row, not two.
 * A `---Group---` marker precedes each run of entries, but only where a section
 * holds more than one group: a single-group section needs no label.
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
  return pages;
}
```

In `src/content-tree/scaffold.ts`, import `pagesOf` and change the one line:

```ts
    files.set(`${dir}/meta.json`, meta({ title: sec.title, pages: pagesOf(sec) }));
```

- [ ] **Step 4: Run the test**

```bash
npx vitest run tests/content-tree/scaffold.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/content-tree/manifest.ts src/content-tree/scaffold.ts tests/content-tree/scaffold.test.ts
git commit -m "feat(content-tree): write an explicit page order"
```

---

### Task 6: Regenerate the committed tree

The scaffold creates but never updates, so every existing `meta.json` would be
reported as `kept`. They must be deleted first. Renamed and flattened sections
leave directories behind, which the scaffold reports as orphans rather than
deleting.

**Files:**
- Modify: `content/docs/**`

- [ ] **Step 1: Confirm nothing under the moving paths is authored**

```bash
git grep -L "Not yet written" -- 'content/docs/standard-library/basic/*' 'content/docs/standard-library/io/*' 'content/docs/language/coroutines/*' 'content/docs/c-api/*'
```
Expected: no output. Any file listed here has real prose — stop and move it by
hand instead of deleting it.

- [ ] **Step 2: Delete every generated `meta.json`**

```bash
git rm -q $(git ls-files 'content/docs/**/meta.json' 'content/docs/meta.json')
```

- [ ] **Step 3: Remove the directories that became entries or moved**

```bash
git rm -rq content/docs/standard-library/basic content/docs/language/coroutines content/docs/c-api content/docs/standard-library/io
```

- [ ] **Step 4: Regenerate**

```bash
npm run content:scaffold
```
Expected: a non-zero `written` count and `orphans: []`. If orphans are reported,
they are files the manifest no longer calls for — inspect each, then `git rm` it.

- [ ] **Step 5: Retitle the authored entries by hand**

The scaffold never updates an authored file, so entries written during the version
slice keep their old parenthesis-free title. Find them and fix the frontmatter:

```bash
git grep -n "^title: .*\." -- 'content/docs/**/*.mdx'
```

Any entry whose manifest type is `function` needs `()` appended to its `title:`
line — `title: string.format` becomes `title: string.format()`. Leave constants
and overviews alone. `lua-compat:` keys are unrelated and must **not** gain
parentheses.

- [ ] **Step 6: Verify the tree matches the manifest**

```bash
npx vitest run tests/content-tree/committed-tree.test.ts
```
Expected: PASS. A `kept` file here means its text differs from the stub — check
whether that is authored prose (fine) or a stale title (fix it).

- [ ] **Step 7: Commit**

```bash
git add -A content/docs
git commit -m "content: regenerate the tree in reader order"
```

---

### Task 7: Fold separators into collapsible groups

fumadocs' `Separator` slot renders a flat node that owns no children, so it cannot
collapse. A `PageTree.Folder` with no `index`, however, renders through
`SidebarFolderTrigger` as a collapsible, non-link heading — MDN's
`<details>`/`<summary>`. So we transform the tree before handing it to the layout.

The same pass shortens labels: an entry drops the prefix its section already
supplies. The parentheses are already in the title (Task 1), so this pass only
strips — it never appends.

**Files:**
- Create: `src/sidebar/groupPageTree.ts`
- Test: `tests/sidebar/groupPageTree.test.ts`

**Interfaces:**
- Consumes: titles of the form `math.abs()` / `math.pi` (Task 1)
- Produces: `groupPageTree<T extends PageTree.Root | PageTree.Folder>(node: T): T`

- [ ] **Step 1: Write the failing test**

Create `tests/sidebar/groupPageTree.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import type * as PageTree from 'fumadocs-core/page-tree';
import { groupPageTree } from '@/sidebar/groupPageTree';

const item = (name: string, url: string): PageTree.Item => ({ type: 'page', name, url });

const tree = {
  name: 'docs',
  children: [
    {
      type: 'folder',
      name: 'math',
      index: item('math', '/docs/standard-library/math'),
      children: [
        { type: 'separator', name: 'Functions' },
        item('math.abs()', '/docs/standard-library/math/abs'),
        { type: 'separator', name: 'Constants' },
        item('math.pi', '/docs/standard-library/math/pi'),
      ],
    },
  ],
} as unknown as PageTree.Root;

describe('groupPageTree', () => {
  it('folds a separator and its following items into an index-less folder', () => {
    const math = groupPageTree(tree).children[0] as PageTree.Folder;

    expect(math.children).toHaveLength(2);
    const [functions, constants] = math.children as PageTree.Folder[];
    expect(functions.type).toBe('folder');
    expect(functions.name).toBe('Functions');
    // No index: the group is a collapse trigger, never a link.
    expect(functions.index).toBeUndefined();
    expect(constants.name).toBe('Constants');
  });

  it('drops the prefix its section supplies, keeping the parentheses', () => {
    const math = groupPageTree(tree).children[0] as PageTree.Folder;
    const [functions, constants] = math.children as PageTree.Folder[];

    expect((functions.children[0] as PageTree.Item).name).toBe('abs()');
    expect((constants.children[0] as PageTree.Item).name).toBe('pi');
  });

  it('keeps a prefix the section does not supply', () => {
    const io = {
      name: 'docs',
      children: [{
        type: 'folder', name: 'io', index: item('io', '/docs/standard-library/io'),
        children: [item('file:read()', '/docs/standard-library/io/file-read')],
      }],
    } as unknown as PageTree.Root;

    const folder = groupPageTree(io).children[0] as PageTree.Folder;
    // Stripping `file:` would collide with io.read → read().
    expect((folder.children[0] as PageTree.Item).name).toBe('file:read()');
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

```bash
npx vitest run tests/sidebar/groupPageTree.test.ts
```
Expected: FAIL — module not found.

- [ ] **Step 3: Write the transform**

Create `src/sidebar/groupPageTree.ts`:

```ts
import type * as PageTree from 'fumadocs-core/page-tree';

/**
 * A sidebar group is a labelled, collapsible run of entries with no page behind it
 * (ADR 0006). fumadocs has no such node: its `separator` is flat and owns nothing,
 * so it cannot collapse. A `folder` with no `index` renders through
 * `SidebarFolderTrigger` as exactly that — a collapse trigger that is not a link.
 * So each separator and the items that follow it become one index-less folder.
 *
 * The same pass shortens labels: an entry drops the prefix its section already
 * supplies (`math.abs()` under `math` → `abs()`). Parentheses come from the title
 * itself, so nothing is appended here. `file:read()` under `io` keeps its prefix —
 * the section supplies `io.`, not `file:`, and stripping it would collide with
 * `io.read()`.
 */
export function groupPageTree<T extends PageTree.Root | PageTree.Folder>(
  node: T,
  sectionTitle?: string,
): T {
  const children: PageTree.Node[] = [];
  let group: PageTree.Folder | null = null;

  for (const child of node.children) {
    if (child.type === 'separator') {
      group = { type: 'folder', name: child.name, children: [] } as PageTree.Folder;
      children.push(group);
      continue;
    }

    const next =
      child.type === 'folder'
        ? groupPageTree(child, typeof child.name === 'string' ? child.name : undefined)
        : relabel(child, sectionTitle);

    if (group) group.children.push(next);
    else children.push(next);
  }

  return { ...node, children };
}

function relabel(item: PageTree.Item, sectionTitle?: string): PageTree.Item {
  if (typeof item.name !== 'string' || !sectionTitle) return item;

  const prefix = `${sectionTitle}.`;
  if (!item.name.startsWith(prefix)) return item;

  return { ...item, name: item.name.slice(prefix.length) };
}
```

- [ ] **Step 4: Run the test**

```bash
npx vitest run tests/sidebar/groupPageTree.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/sidebar/groupPageTree.ts tests/sidebar/groupPageTree.test.ts
git commit -m "feat(sidebar): render entry groups as collapsible folders"
```

---

### Task 8: Wire the transform into the docs route

**Files:**
- Modify: `src/routes/docs/$.tsx`

**Interfaces:**
- Consumes: `groupPageTree` (Task 7)

- [ ] **Step 1: Apply the transform in the component**

The loader needs no change — the titles already carry their parentheses, so the
transform reads only the tree. In `Page()`:

```ts
  const { pageTree, path, markdownUrl, luaCompat, compatByUrl } = useFumadocsLoader(
    Route.useLoaderData(),
  );
  const SidebarItem = useMemo(() => createSidebarItem(compatByUrl), [compatByUrl]);
  const tree = useMemo(() => groupPageTree(pageTree), [pageTree]);
```

Pass `tree={tree}` to `DocsLayout` in place of `tree={pageTree}`, and import
`groupPageTree` from `@/sidebar/groupPageTree`.

- [ ] **Step 2: Check types and tests**

```bash
npm run types:check && npm test
```
Expected: PASS.

- [ ] **Step 3: Verify in the browser**

Start the dev server and open `/docs/standard-library/math`. Confirm, in order:
`math` appears **once** as the folder heading and links to the overview;
`Functions` and `Constants` are collapsible headings that do **not** navigate;
entries read `abs()` not `math.abs()`; `pi` has no parentheses; the page heading
reads `math.abs()` in full; the standard library lists `Globals, string, table,
math, io, os, coroutine, utf8, package, debug`. Then open `/docs/language` and
confirm `Coroutines` is a plain entry with no accordion.

- [ ] **Step 4: Commit**

```bash
git add src/routes/docs/'$'.tsx
git commit -m "feat(sidebar): group and shorten entries in the docs layout"
```

---

### Task 9: Guard the rules

The rules in ADR 0006 are only worth writing down if they hold at entry 292.

**Files:**
- Test: `tests/content-tree/manifest.test.ts`

- [ ] **Step 1: Write the guards**

```ts
describe('ADR 0006 rules', () => {
  it('keeps URL depth at three: area, section, entry', () => {
    for (const area of CONTENT_TREE) {
      for (const s of area.sections) {
        expect(s.sections, `${area.slug}/${s.slug} nests too deep`).toHaveLength(0);
      }
    }
  });

  it('sorts identifier-named entries alphabetically within their group', () => {
    // Prose-named entries are curated (ADR 0006, rule 2) and are exempt.
    const identifier = (e: { title: string }) => /^[a-z_][\w.:]*$/i.test(e.title);

    for (const s of all) {
      const byGroup = new Map<string, string[]>();
      for (const e of s.entries) {
        if (!identifier(e)) continue;
        byGroup.set(e.group, [...(byGroup.get(e.group) ?? []), e.slug]);
      }
      for (const [group, slugs] of byGroup) {
        expect(slugs, `${s.slug} / ${group}`).toEqual([...slugs].sort());
      }
    }
  });
});
```

- [ ] **Step 2: Run them**

```bash
npx vitest run tests/content-tree/manifest.test.ts -t "ADR 0006"
```
Expected: PASS. A failure here means the manifest drifted — fix the manifest, not
the test. `fnsFrom` lists (removed symbols) form their own run inside a group and
may need sorting into the main list.

- [ ] **Step 3: Commit**

```bash
git add tests/content-tree/manifest.test.ts
git commit -m "test(content-tree): guard the sidebar order rules"
```

---

### Task 10: Record the slice

**Files:**
- Modify: `docs/plans/ROADMAP.md`

- [ ] **Step 1: Add the row**

In the Status table, after the slice 1.5 row:

```markdown
| 1.6 | Sidebar IA — order, grouping, labels | [2026-08-04-sidebar-ia.md](2026-08-04-sidebar-ia.md) | Done |
```

- [ ] **Step 2: Add the description**

After the "1.5" prose, add a section noting that the slice implements ADR 0006 and
that the sidebar group is our own node, folded in from separators, because
fumadocs has no collapsible group.

- [ ] **Step 3: Commit**

```bash
git add docs/plans/ROADMAP.md
git commit -m "docs(roadmap): record the sidebar IA slice"
```

---

## Deferred

**Area-scoped sidebar.** ADR 0006 says the sidebar shows one Area at a time with a
link back up. That is a layout change, not a tree change, and nothing above depends
on it — the order, grouping, and labels are correct whether the sidebar is scoped
or not. It also carries the only open deviation from MDN: MDN scopes per built-in
object, and the ADR scopes one notch coarser, per Area. Settle that before
implementing, and do it as its own slice or as part of slice 2's bespoke chrome.

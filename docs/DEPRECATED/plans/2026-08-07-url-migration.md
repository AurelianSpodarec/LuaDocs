# URL migration implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> (recommended) or superpowers:executing-plans to implement this plan task-by-task.
> Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every URL the old luadocs.com serves answers with a permanent redirect to the
entry that replaces it, the new site ships the indexing hygiene the old one never had, and
nothing it publishes — page, index, sitemap or export — advertises an entry nobody has
written or states a version fact it cannot date.

**Architecture:** Two data spines, and everything is derived from one of them.

The sixty-nine pairs live once, as TypeScript data in `src/migration/legacyRedirects.ts`.
`vercel.json` is generated from it and checked against the committed copy, and the tests
read it directly. Nothing is hand-transcribed twice.

The second spine is **one predicate, `isAuthored`, with five consumers** — the sidebar, the
search index, the sitemap, the `llms.txt` index, and the `noindex` tag on the page itself.
ADR 0012 commits to "one rule, three consumers"; the two export surfaces make it five. It is
derived rather than flagged, for the reason the ROADMAP already gives for the version-badge
debt: *it must be derived; hand-written badges go stale.* Sitemap, `robots.txt` and
canonicals are TanStack Start routes and route `head` config, following the `llms.txt` route
already in the repo.

**Tech Stack:** TanStack Start, Fumadocs, Vitest, `tsx` for scripts, Vercel for hosting,
GitHub Actions for CI.

**Amended 2026-08-10.** Tasks 1–8 were written on 2026-08-07, when the standard library was
four sections short. Three things changed and this plan changed with them:

- **Task 3's gate is discharged.** `io`, `os`, `package` and `debug` are authored. All 66
  redirect targets have bodies. The task is kept as a record and its ratchet starts empty.
- **The counts moved.** 184 pages are authored (182 under `content/docs`, plus two blog
  posts) and 110 are unwritten, against the 121/171 this plan was written against.
- **Tasks 9–13 are new.** The original stopped at the sitemap, which is one of the five
  consumers above. The sidebar and the search index still advertise all 110 stubs, the two
  export surfaces still serve version claims they cannot date, and there is no CI at all —
  `.github/workflows` does not exist, so every "CI asserts…" line in Tasks 2 and 7 asserts
  nothing today.

## Global Constraints

- **The spec is [ADR 0012](../adr/0012-legacy-url-migration.md).** It holds the full map
  and the reasoning. Do not change a redirect target without amending the ADR.
- **All work stays on `dev`.** Never merge into `main` (`CLAUDE.md`).
- **Commit messages:** `type(scope): summary`, imperative, ≤ ~60 characters, no trailing
  period, **never** a `Co-Authored-By` trailer.
- **Canonical host is `https://www.luadocs.com`** — with `www`, over HTTPS, no trailing
  slash on any path except the root.
- **Redirects are permanent** — `"permanent": true`, which Vercel emits as a 308. Never
  remove one.
- **Vocabulary:** use `CONTEXT.md`'s terms — entry, section, delta, selected version.
  Migration mechanics (redirect, cutover) are not domain vocabulary and do not go in
  `CONTEXT.md`.
- **Never author into `.output/`** — it is build output.

## File structure

| File | Responsibility |
| --- | --- |
| `src/migration/legacyRedirects.ts` | The sixty-nine pairs. The single source of truth. |
| `src/migration/authored.ts` | The one predicate deciding whether an entry has a body. |
| `scripts/generate-vercel-json.ts` | Renders `vercel.json` from the pairs. |
| `vercel.json` | Generated, committed, and checked against the generator. |
| `src/routes/sitemap[.]xml.ts` | Sitemap over authored entries only. |
| `src/routes/robots[.]txt.ts` | `robots.txt` pointing at the sitemap. |
| `src/routes/docs/$.tsx` | Gains a canonical link and `noindex` on unwritten entries. |
| `src/lib/shared.ts` | Gains `siteOrigin`. |
| `tests/migration/legacy-redirects.test.ts` | Map shape, and targets against the content tree. |
| `tests/migration/indexing.test.ts` | The authored predicate, sitemap and robots content. |
| `scripts/check-build-output.ts` | Post-build: every target is a real prerendered file, and every internal link resolves. |
| `src/sidebar/filterUnwritten.ts` | Drops unwritten entries from the page tree (Task 9). |
| `src/routes/api/search.ts` | Gains the authored filter (Task 9). |
| `src/content/UnwrittenEntry.tsx` | What an unwritten entry renders instead of nothing (Task 10). |
| `src/lib/exportText.ts` | Resolves `<Only>` against one version for the text surfaces (Task 11). |
| `src/routes/llms[.]txt.ts`, `src/routes/llms-full[.]txt.ts`, `src/routes/docs/{$}[.]md.ts` | Gain the filter and the resolved export (Task 11). |
| `.github/workflows/ci.yml` | The first CI workflow: types, tests, build, post-build checks (Task 13). |

---

### Task 1: The redirect map as data

**Files:**
- Create: `src/migration/legacyRedirects.ts`
- Test: `tests/migration/legacy-redirects.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `type LegacyRedirect = { readonly from: string; readonly to: string }` and
  `export const LEGACY_REDIRECTS: readonly LegacyRedirect[]`. Tasks 2, 4 and 7 all read
  `LEGACY_REDIRECTS`.

- [ ] **Step 1: Write the failing test**

Create `tests/migration/legacy-redirects.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { LEGACY_REDIRECTS } from '@/migration/legacyRedirects';

describe('the legacy redirect map', () => {
  it('has one entry per live URL on the old site', () => {
    // 70 live old URLs, less the homepage, which does not move. See ADR 0012.
    expect(LEGACY_REDIRECTS).toHaveLength(69);
  });

  it('never lists a source twice', () => {
    const seen = new Map<string, number>();
    for (const { from } of LEGACY_REDIRECTS) seen.set(from, (seen.get(from) ?? 0) + 1);
    expect([...seen].filter(([, n]) => n > 1).map(([from]) => from)).toEqual([]);
  });

  it('never chains one redirect into another', () => {
    // A target that is also a source costs every reader on that path an extra hop,
    // and Google discounts a chain it has to follow.
    const sources = new Set(LEGACY_REDIRECTS.map((r) => r.from));
    expect(LEGACY_REDIRECTS.filter((r) => sources.has(r.to)).map((r) => r.from)).toEqual([]);
  });

  it('never redirects a path to itself', () => {
    expect(LEGACY_REDIRECTS.filter((r) => r.from === r.to)).toEqual([]);
  });

  it('uses absolute, same-origin, slash-free paths at both ends', () => {
    const bad = LEGACY_REDIRECTS.filter(
      ({ from, to }) =>
        !from.startsWith('/docs/') ||
        !to.startsWith('/docs') ||
        from.endsWith('/') ||
        to.endsWith('/'),
    );
    expect(bad).toEqual([]);
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

```bash
npx vitest run tests/migration/legacy-redirects.test.ts
```

Expected: FAIL — `Failed to resolve import "@/migration/legacyRedirects"`.

- [ ] **Step 3: Write the data file**

Create `src/migration/legacyRedirects.ts`. Every pair is copied from ADR 0012's map;
the ADR is the spec and this file is its machine-readable form.

```ts
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
```

- [ ] **Step 4: Run it and watch it pass**

```bash
npx vitest run tests/migration/legacy-redirects.test.ts
```

Expected: PASS, 5 tests.

- [ ] **Step 5: Commit**

```bash
git add src/migration/legacyRedirects.ts tests/migration/legacy-redirects.test.ts
git commit -m "feat(migration): add the legacy redirect map"
```

---

### Task 2: Every target is a real entry

A redirect to a page that does not exist is worse than no redirect — it turns an
indexed 200 into a 404. This binds the map to the content tree so a later rename breaks
the build.

**Files:**
- Create: `src/migration/authored.ts`
- Modify: `tests/migration/legacy-redirects.test.ts` (append a `describe` block)

**Interfaces:**
- Consumes: `LEGACY_REDIRECTS` from Task 1.
- Produces: `entryFileFor(url: string): string` (a path relative to `content/docs`) and
  `isAuthored(source: string): boolean`. Task 5 uses `isAuthored`.

- [ ] **Step 1: Write the failing test**

Append to `tests/migration/legacy-redirects.test.ts`:

```ts
import { readFileSync, existsSync } from 'node:fs';
import { LEGACY_REDIRECTS } from '@/migration/legacyRedirects';
import { entryFileFor, isAuthored } from '@/migration/authored';

/**
 * Empty, and it stays empty. A redirect target without a body turns an indexed 200 on the
 * old site into a page that says nothing — worse than the 404 it was avoiding.
 *
 * This started as a four-item ratchet holding the `io`, `os`, `package` and `debug`
 * overviews. All four were authored (Task 3), so it starts empty and nothing may be added.
 */
const KNOWN_STUB_TARGETS: string[] = [];

const targets = [...new Set(LEGACY_REDIRECTS.map((r) => r.to))].sort();

describe('every redirect target', () => {
  it('is a file in the content tree', () => {
    const missing = targets.filter((to) => !existsSync(`content/docs/${entryFileFor(to)}`));
    expect(missing).toEqual([]);
  });

  it('has a body — every one of them', () => {
    const stubs = targets.filter(
      (to) => !isAuthored(readFileSync(`content/docs/${entryFileFor(to)}`, 'utf8')),
    );
    // Fails both ways on purpose: a new stub target is a regression, and clearing one
    // is a prompt to delete it from KNOWN_STUB_TARGETS rather than leave the list lying.
    expect(stubs).toEqual(KNOWN_STUB_TARGETS);
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

```bash
npx vitest run tests/migration/legacy-redirects.test.ts
```

Expected: FAIL — `Failed to resolve import "@/migration/authored"`.

- [ ] **Step 3: Write the module**

Create `src/migration/authored.ts`:

```ts
import { docsRoute } from '@/lib/shared';

/**
 * The file under `content/docs` that serves a docs URL.
 *
 * Fumadocs maps `<dir>/index.mdx` to the directory's own URL, so a section overview and
 * an entry differ only in whether a directory of that name exists — which is why this
 * takes the URL and not the other way round.
 */
export function entryFileFor(url: string): string {
  const rel = url.slice(docsRoute.length).replace(/^\//, '');
  return rel === '' ? 'index.mdx' : `${rel}.mdx`;
}

/**
 * Whether an entry has been written, given its raw MDX source.
 *
 * The scaffold gives every unwritten entry an empty `description` and a
 * `{/* Not yet written. *\/}` body. The two agree on all 292 files in the tree, and the
 * description is the cheaper of the two to read — it is frontmatter, so a consumer that
 * already has the page metadata never has to touch the body.
 */
export function isAuthored(source: string): boolean {
  const description = /^description:\s*(.*)$/m.exec(source)?.[1]?.trim() ?? '';
  return description !== '' && description !== '""' && description !== "''";
}
```

Note: `entryFileFor` returns `index.mdx` for `/docs`, and the four prose redirects all
point there, so the deduplicated target list resolves it once.

**Section overviews** live at `content/docs/standard-library/<lib>/index.mdx` while the
URL is `/docs/standard-library/<lib>`. Handle it by checking for the directory form
first — replace the body of `entryFileFor` with:

```ts
export function entryFileFor(url: string): string {
  const rel = url.slice(docsRoute.length).replace(/^\//, '');
  if (rel === '') return 'index.mdx';
  return existsSync(`content/docs/${rel}`) ? `${rel}/index.mdx` : `${rel}.mdx`;
}
```

and add `import { existsSync } from 'node:fs';` at the top.

- [ ] **Step 4: Run it and watch it pass**

```bash
npx vitest run tests/migration/legacy-redirects.test.ts
```

Expected: PASS, 7 tests. The stub test passes on an empty list — if it reports anything at
all, the map or the tree has moved and the discrepancy is the finding.

- [ ] **Step 5: Commit**

```bash
git add src/migration/authored.ts tests/migration/legacy-redirects.test.ts
git commit -m "test(migration): bind redirect targets to the content tree"
```

---

### Task 3: Author the four owed overviews — **DONE (2026-08-10)**

> **Discharged.** `io`, `os`, `package` and `debug` were authored as part of the remaining-
> libraries slice, not here. All 66 redirect targets have bodies, and the ratchet in Task 2
> starts empty. **The steps below are kept as a record — do not re-run them.** The one thing
> still owed from this task is Step 8, which is new.

This was the cutover gate and the only content work in the plan. Four section overviews
were 8-line stubs whose old counterparts are live and indexed.

**Files:**
- Modify: `content/docs/standard-library/io/index.mdx`
- Modify: `content/docs/standard-library/os/index.mdx`
- Modify: `content/docs/standard-library/package/index.mdx`
- Modify: `content/docs/standard-library/debug/index.mdx`
- Modify: `tests/migration/legacy-redirects.test.ts` (empty the ratchet)

**Interfaces:**
- Consumes: `KNOWN_STUB_TARGETS` from Task 2.
- Produces: nothing importable. Clears the gate for Task 13 (cutover).

- [ ] **Step 1: Read the proven pattern**

Read `content/docs/standard-library/math/index.mdx` and
`content/docs/standard-library/string/index.mdx` end to end before writing anything.
The overview fork is settled and proven on three sections — see the ROADMAP's
"The overview fork, now proven on three sections". The shape is: summary, then a
common-patterns example, then a task-grouped index in `##` headings, then `## See also`.

Three rules that section carries, which apply here:

- **Groups are authored by task**, not by directory order and not by the sidebar's order.
  The right rail is H2-only, so a `###` sub-index renders as one navigable word and is
  not available.
- **Symbols that left the library get their own final group**, glossed by what to write
  instead — but only the ones that stayed gone.
- **A version qualification in a gloss is spent where the absence changes the advice**,
  not wherever an entry is missing from some line.

- [ ] **Step 2: Author each overview against the manual**

One section at a time, in this order: `io`, `os`, `package`, `debug`.

Per [ADR 0010](../adr/0010-entries-are-written-from-the-manual.md), each is written from
the reference manual, not from the old site and not from memory. The `source:` frontmatter
field on each stub already points at the manual passage.

Replace the `{/* Not yet written. */}` body and fill in the empty `description:`.

- [ ] **Step 3: Run the absolutist-word sweep**

Before committing each section, grep its own file for absolutist words and read each hit
against that entry's own Description and its own examples:

```bash
grep -nE '\b(every|always|never|all|any|cannot|none|no|only|exactly|identical)\b' content/docs/standard-library/io/index.mdx
```

This is the check that found defects an adversarial review had already looked at and
missed, in five separate batches. It is a different operation from reading for sense.

- [ ] **Step 4: Run the content guards**

```bash
npx vitest run tests/content
```

Expected: PASS. `overview-index.test.ts` checks an overview's index against its
directory — a symbol in the directory but missing from the index fails here.

- [ ] **Step 5: Empty the ratchet**

In `tests/migration/legacy-redirects.test.ts`, change:

```ts
const KNOWN_STUB_TARGETS = [
  '/docs/standard-library/debug',
  '/docs/standard-library/io',
  '/docs/standard-library/os',
  '/docs/standard-library/package',
];
```

to:

```ts
/**
 * Empty, and it stays empty. A redirect target without a body turns an indexed 200 on
 * the old site into a page that says nothing — worse than the 404 it was avoiding.
 */
const KNOWN_STUB_TARGETS: string[] = [];
```

- [ ] **Step 6: Run the migration tests**

```bash
npx vitest run tests/migration
```

Expected: PASS. If the stub test still reports entries, one of the four is not actually
authored — `isAuthored` reads the `description` frontmatter, so an empty description is
the likely cause.

- [ ] **Step 7: Commit**

```bash
git add content/docs/standard-library tests/migration/legacy-redirects.test.ts
git commit -m "content(stdlib): author the four owed overviews"
```

- [ ] **Step 8 (new, still owed): author `standard-library/index.mdx`**

`content/docs/standard-library/index.mdx` is the chapter's own front door and is still an
8-line stub with an empty `description`. It is **not** a redirect target, so it does not
block cutover — but it is the page the Standard Library destination lands on, and with the
authored filter from Task 9 in place an empty description would drop the chapter root out
of the sidebar, the search index and the sitemap.

It is **not a section overview**: it indexes ten sections rather than nineteen entries, and
`overview-index.test.ts` does not apply to it. Do not copy the overview fork. What it owes
is a summary of what the standard library is, and a list of the ten sections with a
one-line gloss each.

```bash
npx vitest run tests/content
git add content/docs/standard-library/index.mdx
git commit -m "content(stdlib): author the chapter front door"
```

---

### Task 4: Generate and commit `vercel.json`

The repo already has this pattern: `content:scaffold` generates files and
`committed-tree.test.ts` fails if the committed copy has drifted. `vercel.json` follows it,
because a hand-edited redirect config and a checked-in map would drift silently and only
surface as a 404 in production.

**Files:**
- Create: `scripts/generate-vercel-json.ts`
- Create: `vercel.json` (generated)
- Modify: `package.json` (one script)
- Test: `tests/migration/vercel-json.test.ts`

**Interfaces:**
- Consumes: `LEGACY_REDIRECTS` from Task 1.
- Produces: `renderVercelJson(): string` — the exact file contents, trailing newline
  included. Task 7 does not use it.

- [ ] **Step 1: Write the failing test**

Create `tests/migration/vercel-json.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import { renderVercelJson } from '../../scripts/generate-vercel-json';
import { LEGACY_REDIRECTS } from '@/migration/legacyRedirects';

describe('the committed vercel.json', () => {
  it('matches what the generator produces', () => {
    expect(readFileSync('vercel.json', 'utf8')).toBe(renderVercelJson());
  });

  it('marks every redirect permanent', () => {
    const config = JSON.parse(renderVercelJson());
    expect(config.redirects.every((r: { permanent: boolean }) => r.permanent)).toBe(true);
  });

  it('carries one rule per pair in the map', () => {
    const config = JSON.parse(renderVercelJson());
    expect(config.redirects).toHaveLength(LEGACY_REDIRECTS.length);
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

```bash
npx vitest run tests/migration/vercel-json.test.ts
```

Expected: FAIL — cannot resolve `../../scripts/generate-vercel-json`.

- [ ] **Step 3: Write the generator**

Create `scripts/generate-vercel-json.ts`:

```ts
import { writeFileSync } from 'node:fs';
import { LEGACY_REDIRECTS } from '../src/migration/legacyRedirects';

/**
 * `vercel.json` is generated rather than hand-written, for the same reason the content
 * tree is: two hand-maintained copies of one list drift, and this one drifts into a 404
 * on a URL that used to rank.
 *
 * `permanent: true` is a 308, not a 301. Both are permanent and both pass ranking; 308
 * additionally forbids a client from rewriting the method, which is stricter than we
 * need and harmless.
 */
export function renderVercelJson(): string {
  const config = {
    $schema: 'https://openapi.vercel.sh/vercel.json',
    redirects: LEGACY_REDIRECTS.map(({ from, to }) => ({
      source: from,
      destination: to,
      permanent: true,
    })),
  };

  return `${JSON.stringify(config, null, 2)}\n`;
}

// Only writes when run directly, so importing it from a test has no side effect.
if (process.argv[1]?.endsWith('generate-vercel-json.ts')) {
  writeFileSync('vercel.json', renderVercelJson());
  console.log(`vercel.json: ${LEGACY_REDIRECTS.length} redirects`);
}
```

- [ ] **Step 4: Add the npm script**

In `package.json`, add to `"scripts"`, after `"content:scaffold"`:

```json
"redirects:generate": "tsx scripts/generate-vercel-json.ts",
```

- [ ] **Step 5: Generate the file and run the tests**

```bash
npm run redirects:generate
```

Expected: `vercel.json: 69 redirects`.

```bash
npx vitest run tests/migration
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add scripts/generate-vercel-json.ts vercel.json package.json tests/migration/vercel-json.test.ts
git commit -m "feat(migration): generate vercel.json from the map"
```

---

### Task 5: `sitemap.xml` and `robots.txt`

The old site has neither, and no canonical tags. This is the cheapest indexing win
available. The sitemap lists **authored entries only** — submitting 110 near-empty pages
is the fastest way to get a young site classified as thin.

**The sitemap is not docs-only.** `source.getPages()` covers `content/docs` and nothing
else, so the homepage, `/blog` and the two blog posts are absent unless they are added
explicitly. A sitemap that omits the homepage is a bad first impression to hand a crawler.

**Files:**
- Modify: `src/lib/shared.ts` (add `siteOrigin`)
- Create: `src/routes/sitemap[.]xml.ts`
- Create: `src/routes/robots[.]txt.ts`
- Test: `tests/migration/indexing.test.ts`

**Interfaces:**
- Consumes: `isAuthored` from Task 2; `source` from `@/lib/source`.
- Produces: `siteOrigin` from `@/lib/shared`, and `renderSitemap(urls: string[]): string`
  exported from the sitemap route module. Task 6 uses `siteOrigin`.

- [ ] **Step 1: Add the origin constant**

In `src/lib/shared.ts`, below `export const docsRoute = '/docs';`:

```ts
/**
 * The canonical origin. `www`, because that is the host the old site has been indexed
 * under since 2022 — moving to the apex would put a second hop on every redirect in
 * the migration. See ADR 0012.
 */
export const siteOrigin = 'https://www.luadocs.com';
```

- [ ] **Step 2: Write the failing test**

Create `tests/migration/indexing.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { isAuthored } from '@/migration/authored';
import { renderSitemap } from '@/routes/sitemap[.]xml';
import { siteOrigin } from '@/lib/shared';

describe('isAuthored', () => {
  it('rejects a scaffolded stub', () => {
    expect(isAuthored('---\ntitle: os.date()\ndescription: ""\n---\n')).toBe(false);
  });

  it('accepts an entry with a description', () => {
    expect(isAuthored('---\ntitle: os.date()\ndescription: Format a time.\n---\n')).toBe(true);
  });
});

describe('the sitemap', () => {
  const xml = renderSitemap(['/docs', '/docs/standard-library/string/format']);

  it('is a urlset', () => {
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
  });

  it('writes absolute URLs on the canonical origin', () => {
    expect(xml).toContain(`<loc>${siteOrigin}/docs/standard-library/string/format</loc>`);
  });

  it('lists one entry per URL', () => {
    expect(xml.match(/<url>/g)).toHaveLength(2);
  });
});
```

- [ ] **Step 3: Run it and watch it fail**

```bash
npx vitest run tests/migration/indexing.test.ts
```

Expected: FAIL — cannot resolve the sitemap route.

- [ ] **Step 4: Write the routes**

Create `src/routes/sitemap[.]xml.ts`, following the shape of `src/routes/llms[.]txt.ts`:

```ts
import { createFileRoute } from '@tanstack/react-router';
import { source } from '@/lib/source';
import { siteOrigin } from '@/lib/shared';

/** Exported for the test — the route handler is not callable from Vitest. */
export function renderSitemap(urls: string[]): string {
  const entries = urls
    .map((url) => `  <url>\n    <loc>${siteOrigin}${url}</loc>\n  </url>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET() {
        // Authored entries only. An unwritten entry is excluded here by the same fact
        // that dims it in the sidebar — it has nothing to read. See ADR 0012.
        const urls = source
          .getPages()
          .filter((page) => (page.data.description ?? '') !== '')
          .map((page) => page.url)
          .sort();

        return new Response(renderSitemap(['/playground', ...urls]), {
          headers: { 'Content-Type': 'application/xml' },
        });
      },
    },
  },
});
```

Create `src/routes/robots[.]txt.ts`:

```ts
import { createFileRoute } from '@tanstack/react-router';
import { siteOrigin } from '@/lib/shared';

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET() {
        // Nothing is disallowed: the site is static, public, and has no private surface.
        // The one thing kept out of the index is unwritten entries, and that is done with
        // `noindex` on the page itself rather than here — a `Disallow` would stop the
        // crawler reading the tag it needs to obey.
        return new Response(
          `User-agent: *\nAllow: /\n\nSitemap: ${siteOrigin}/sitemap.xml\n`,
          { headers: { 'Content-Type': 'text/plain' } },
        );
      },
    },
  },
});
```

- [ ] **Step 5: Run the tests**

```bash
npx vitest run tests/migration
```

Expected: PASS.

- [ ] **Step 6: Verify against a real build**

```bash
npm run build
```

then

```bash
node -e "console.log(require('fs').readFileSync('.output/public/sitemap.xml','utf8').match(/<url>/g).length + ' urls')"
```

Expected: **187** — the 182 authored pages under `content/docs`, plus `/`, `/playground`,
`/blog` and the two blog posts. If it reports ~292, the `description` filter is not being
applied; if it reports 183, the non-docs routes were not added; if it reports 0, the route
did not prerender.

These counts are load-bearing and will move as content lands. Assert them in
`tests/migration/indexing.test.ts` rather than only eyeballing the build, so growth is a
visible diff rather than a silent one.

- [ ] **Step 7: Commit**

```bash
git add src/lib/shared.ts 'src/routes/sitemap[.]xml.ts' 'src/routes/robots[.]txt.ts' tests/migration/indexing.test.ts
git commit -m "feat(seo): add sitemap.xml and robots.txt"
```

---

### Task 6: Canonicals, and `noindex` on unwritten entries

**Files:**
- Modify: `src/routes/docs/$.tsx` — the `Route` definition at line 37, and the loader's
  return value

**Interfaces:**
- Consumes: `siteOrigin` from Task 5; the loader's existing page data.
- Produces: nothing importable.

- [ ] **Step 1: Return the page's own URL and authored-ness from the loader**

In `src/routes/docs/$.tsx`, the server loader already resolves `page`. Add to its
returned object:

```ts
url: page.url,
indexable: (page.data.description ?? '') !== '',
```

- [ ] **Step 2: Add the head config**

On the `createFileRoute('/docs/$')` call, alongside `component` and `loader`:

```ts
head: ({ loaderData }) => ({
  links: loaderData ? [{ rel: 'canonical', href: `${siteOrigin}${loaderData.url}` }] : [],
  // An entry with no body has nothing to rank for, and 110 of them would read as a thin
  // site. The tag comes off by itself the moment someone writes a description.
  meta: loaderData?.indexable === false ? [{ name: 'robots', content: 'noindex' }] : [],
}),
```

and add `siteOrigin` to the existing `@/lib/shared` import on line 14.

- [ ] **Step 3: Build and check both tags land**

```bash
npm run build
```

An authored entry must have a canonical and no `noindex`:

```bash
grep -o 'rel="canonical"[^>]*\|name="robots"[^>]*' .output/public/docs/standard-library/string/format/index.html
```

Expected: one `rel="canonical" href="https://www.luadocs.com/docs/standard-library/string/format"`, and **no** `robots` line.

An unwritten entry must have both:

```bash
grep -o 'rel="canonical"[^>]*\|name="robots"[^>]*' .output/public/docs/language/statements/while/index.html
```

Expected: a canonical **and** `name="robots" content="noindex"`.

(The original named `debug/gethook` here. That entry is authored now — pick any of the 110
still-unwritten pages; every page under `content/docs/language/` qualifies.)

- [ ] **Step 4: Commit**

```bash
git add src/routes/docs/\$.tsx
git commit -m "feat(seo): add canonicals and noindex unwritten entries"
```

---

### Task 7: Verify the map against build output

The dev server answers every path with the same 200 SPA shell, nonsense routes included,
so a check against it can never fail. The site prerenders, so this belongs after
`npm run build`, over `.output/public`, where a missing page is a missing file. This is
the same reason the ROADMAP already owes a link check.

**Files:**
- Create: `scripts/check-build-output.ts`
- Modify: `package.json` (one script)

**Interfaces:**
- Consumes: `LEGACY_REDIRECTS` from Task 1.
- Produces: an executable check. Exit code 1 on any failure.

- [ ] **Step 1: Write the script**

Create `scripts/check-build-output.ts`:

```ts
import { existsSync, readFileSync } from 'node:fs';
import { LEGACY_REDIRECTS } from '../src/migration/legacyRedirects';

const OUT = '.output/public';

if (!existsSync(OUT)) {
  console.error(`${OUT} does not exist — run \`npm run build\` first.`);
  process.exit(1);
}

const failures: string[] = [];

// Every redirect target is a real prerendered page.
for (const to of new Set(LEGACY_REDIRECTS.map((r) => r.to))) {
  if (!existsSync(`${OUT}${to}/index.html`)) failures.push(`target has no page: ${to}`);
}

// Every redirect source is a rule Vercel will actually serve. A source that is also a
// prerendered file would be served as a page and the rule would never fire.
const config = JSON.parse(readFileSync('vercel.json', 'utf8'));
const sources = new Set(config.redirects.map((r: { source: string }) => r.source));
for (const { from } of LEGACY_REDIRECTS) {
  if (!sources.has(from)) failures.push(`source missing from vercel.json: ${from}`);
  if (existsSync(`${OUT}${from}/index.html`)) failures.push(`source is also a page: ${from}`);
}

// robots.txt and the sitemap prerendered.
for (const f of ['robots.txt', 'sitemap.xml']) {
  if (!existsSync(`${OUT}/${f}`)) failures.push(`not prerendered: ${f}`);
}

if (failures.length > 0) {
  console.error(failures.map((f) => `  ✗ ${f}`).join('\n'));
  process.exit(1);
}

console.log(`✓ ${LEGACY_REDIRECTS.length} redirects, all targets prerendered`);
```

- [ ] **Step 2: Add the npm script**

In `package.json`, after `"redirects:generate"`:

```json
"redirects:check": "tsx scripts/check-build-output.ts",
```

- [ ] **Step 3: Run it against a real build**

```bash
npm run build && npm run redirects:check
```

Expected: `✓ 69 redirects, all targets prerendered`.

- [ ] **Step 4: Commit**

```bash
git add scripts/check-build-output.ts package.json
git commit -m "test(migration): check redirects against build output"
```

---

### Task 8: The predicate reaches the sidebar and the search index

Tasks 5 and 6 applied `isAuthored` to the sitemap and to `noindex`. ADR 0012 commits it to
the sidebar and the search index too — *"one rule, three consumers"* — and neither has it.
Today the sidebar lists all 110 unwritten entries as ordinary rows, and
`createFromSource(source)` indexes their titles, so searching `while` returns a page with
no body.

**These are the two consumers a reader meets first.** A sitemap they never see; a sidebar
row that goes nowhere is the site telling them it has a page it does not have.

**Files:**
- Create: `src/sidebar/filterUnwritten.ts`
- Modify: `src/routes/docs/$.tsx` (apply it in the tree pipeline)
- Modify: `src/routes/api/search.ts`
- Test: `tests/sidebar/filter-unwritten.test.ts`

**Interfaces:**
- Consumes: `isAuthored` from Task 2, `PageTree` from Fumadocs.
- Produces: `filterUnwritten(tree: PageTree.Root): PageTree.Root`.

- [ ] **Step 1: Write the failing test**

Assert three things, the third being the one that bites:

1. A tree containing an unwritten page returns without it.
2. An authored page survives.
3. **A folder whose children are all unwritten disappears with them.** Otherwise the
   Language chapter renders as eleven empty collapse triggers — worse than the rows it
   replaced, because a chevron promises something is behind it.

Compose with the existing transforms rather than reimplementing: `groupPageTree` folds
separators into folders and `filterPageTree` handles the text query. This runs **first**,
before grouping, so a group emptied by it never forms.

- [ ] **Step 2: Run it and watch it fail**

```bash
npx vitest run tests/sidebar/filter-unwritten.test.ts
```

- [ ] **Step 3: Write the module and wire it in**

In `src/routes/docs/$.tsx` the pipeline at line ~175 currently reads
`filterPageTree(groupPageTree(scopeToDestination(pageTree, pathname)), query)`. It becomes
`filterPageTree(groupPageTree(scopeToDestination(filterUnwritten(pageTree), pathname)), query)`.

For search, filter the pages handed to `createFromSource`. Fumadocs takes the source; if it
does not accept a page list directly, pass a shallow wrapper whose `getPages()` returns only
authored pages.

- [ ] **Step 4: Verify in the browser, both destinations**

Start the dev server and check the Standard Library sidebar is unchanged, then that the
Language destination shows only what is written. Search `while` and confirm the unwritten
entry no longer appears.

- [ ] **Step 5: Commit**

```bash
git add src/sidebar/filterUnwritten.ts src/routes/docs/\$.tsx src/routes/api/search.ts tests/sidebar/filter-unwritten.test.ts
git commit -m "feat(sidebar): hide unwritten entries from tree and search"
```

---

### Task 9: What an unwritten entry renders

Task 8 removes the ways a reader *discovers* a stub. It does not change what happens when
they land on one — from a `## See also` link, from an old bookmark, or from a search engine
that crawled it before the `noindex` landed. Today that is a blank page under a title.

Entries cross-link heavily into not-yet-written targets, so this is not an edge case.

**The alternative considered and refused: 404 them by not prerendering.** Cleaner in the
abstract, and it turns every existing cross-link into a hard error — Task 11's link check
would open with a large backlog belonging to future content slices, not to this one. It
also throws away the one useful thing the stub already has.

**Every stub carries a `source:` frontmatter field pointing at the exact manual anchor.**
So the page can say what it is and send the reader somewhere that answers them.

**Files:**
- Create: `src/content/UnwrittenEntry.tsx`
- Modify: `src/routes/docs/$.tsx` (render it when `indexable === false`)
- Test: `tests/content/unwritten-entry.test.tsx`

**Interfaces:**
- Consumes: the loader's `indexable` flag from Task 6, and `page.data.source`.
- Produces: a component. Nothing else imports it.

- [ ] **Step 1: Write the failing test**

- Renders the entry title.
- Renders a link to `page.data.source` when present.
- Renders no broken affordance when `source` is absent — every stub has one today, but the
  component must not assume it.
- Says plainly that the entry is not written yet. Do not dress this up; a reader who hit a
  dead end is owed a straight sentence.

- [ ] **Step 2: Run it and watch it fail**

- [ ] **Step 3: Write the component and branch the route**

Keep the entry chrome — title, sidebar, version switcher — and replace the body. The page
still carries `noindex` from Task 6, so this changes what a person sees and nothing a
crawler indexes.

- [ ] **Step 4: Verify in the browser**

Visit `/docs/language/statements/while` and confirm the manual link resolves.

- [ ] **Step 5: Commit**

```bash
git add src/content/UnwrittenEntry.tsx src/routes/docs/\$.tsx tests/content/unwritten-entry.test.tsx
git commit -m "feat(content): give unwritten entries an honest page"
```

---

### Task 10: The text surfaces stop contradicting themselves

Three routes serve entry text: `llms[.]txt.ts`, `llms-full[.]txt.ts` and
`docs/{$}[.]md.ts`. All three have the same two defects.

**Defect one — they serve stubs.** Every one walks `source.getPages()` unfiltered, so they
publish 110 "Not yet written" bodies. `isAuthored` fixes it, and for `llms.txt` — which is
`llms(source).index()`, titles and links only — that is the whole fix.

**Defect two, and the reason this task exists.** `<Only before="…">` and `<Only since="…">`
both survive into the export, adjacent and unlabelled. `error()`'s markdown states that
`nil` reaches a catcher as `nil` and then states that it does not, with nothing saying which
version either sentence belongs to. The ROADMAP is blunt about it: *"a reader or a model
gets version data that is false."* This is why Fumadocs's page-actions row was deleted from
the entry page rather than left pointing at it.

**Fix, not defer.** On a site whose premise is being right about versions, the export is
where a model reads us, and shipping a self-contradictory one is the worst available option.

**The approach:** resolve `<Only>` against a single version at export time rather than
letting both branches through. `src/version/versionScope.ts` already decides what a given
version keeps — the export reuses it with `DEFAULT_VERSION`, and the file states which
version it describes in its header. One version's coherent text beats five versions' worth
of contradictions.

**What this does not do:** it does not restore the Copy Markdown affordance to the entry
page. That is the ROADMAP's call for slice 3 and it stays there. This makes the surfaces
correct; deciding to advertise them again is separate.

**Files:**
- Create: `src/lib/exportText.ts`
- Modify: `src/lib/source.ts` (`getLLMText` uses it)
- Modify: all three routes
- Test: `tests/content/export-text.test.ts`

**Interfaces:**
- Consumes: `versionScope`, `DEFAULT_VERSION`, `isAuthored`.
- Produces: `resolveExportText(page, version): Promise<string>`.

- [ ] **Step 1: Write the failing test, using `error()` as the fixture**

It is the worked example the ROADMAP names. Assert that the resolved export contains the
`<Only since>` branch and **not** the `<Only before>` branch, and that no `<Only` tag
survives in the output at all. Add a general assertion across every authored page: the
export contains no `<Only`, no `{/*`, and no unresolved JSX tag.

- [ ] **Step 2: Run it and watch it fail**

- [ ] **Step 3: Write the resolver and wire up all three routes**

Each export gets a header line naming the version it describes. Filter to authored pages in
all three.

- [ ] **Step 4: Verify against a real build**

```bash
npm run build
```

```bash
grep -c 'Only' .output/public/llms-full.txt; grep -c 'Not yet written' .output/public/llms-full.txt
```

Expected: `0` and `0`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/exportText.ts src/lib/source.ts 'src/routes/llms[.]txt.ts' 'src/routes/llms-full[.]txt.ts' 'src/routes/docs/{$}[.]md.ts' tests/content/export-text.test.ts
git commit -m "fix(export): resolve version scoping in text surfaces"
```

---

### Task 11: The link check

The ROADMAP has owed this since the page-anatomy slice, and for the reason Task 7 already
states: the dev server answers every path with the same 200 SPA shell, so a crawl of it can
never 404 and would pass over a wholly broken set of links. It belongs in
`scripts/check-build-output.ts` beside the redirect assertion — same job, same reason, one
script.

Entries cross-link heavily in `## See also` and in prose. `fragment-links.test.ts` already
covers `#anchor` targets; this covers the page paths.

**Files:**
- Modify: `scripts/check-build-output.ts`

- [ ] **Step 1: Extend the script**

Walk every `.html` in `.output/public`, collect internal `href`s, and assert each resolves
to a prerendered file. Ignore external links, `mailto:`, and bare fragments.

- [ ] **Step 2: Run it and read the output before fixing anything**

```bash
npm run build && npm run redirects:check
```

**Expect failures on the first run, and triage before fixing.** A link into an unwritten
entry is *not* a failure — Task 9 makes those real pages. A genuine failure is a typo or a
renamed path. If the count is large, list the distinct targets first; do not start editing
content until you know which kind you have.

- [ ] **Step 3: Fix what is genuinely broken, then commit**

```bash
git add scripts/check-build-output.ts
git commit -m "test(build): check internal links against build output"
```

---

### Task 12: CI

There is no CI. `.github/workflows` does not exist, so every "CI asserts…" line in Tasks 2
and 7 currently asserts nothing, and the redirect map is guarded only by whoever remembers
to run the script.

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Write the workflow**

On push and pull request: checkout, Node from `.nvmrc` or the current LTS, `npm ci`, then
`npm run types:check`, `npm test`, `npm run build`, `npm run redirects:check`.

Order matters — `redirects:check` reads `.output/public` and must follow the build.

- [ ] **Step 2: Verify it passes on `dev`**

Push and read the run. **If it fails, fix the workflow or the code — do not weaken the
checks to make it green.**

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add build, test and redirect checks"
```

---

### Task 13: Cutover

Not code. Do these in order, and stop at the first one that does not behave as described.

**Prerequisite:** Tasks 1–12 committed, CI green on `dev`, and `npm run build && npm run
redirects:check && npm test` all green locally.

**This is the point at which the work becomes public and irreversible-ish** — a 301 is
permanent by design and search engines will cache it. Do not begin Task 13 without saying
so explicitly and getting a clear yes.

- [ ] **Step 1: Deploy to a Vercel preview URL** (not the production domain)

- [ ] **Step 2: Verify redirects against the preview**

Replace `<preview>` with the deployment host:

```bash
curl -sS -o /dev/null -w '%{http_code} %{redirect_url}\n' https://<preview>/docs/functions/string/format
```

Expected: `308 https://<preview>/docs/standard-library/string/format`.

Then all sixty-nine at once — every line must show a 3xx:

```bash
node -e "require('./src/migration/legacyRedirects')" 2>/dev/null; npx tsx -e "import {LEGACY_REDIRECTS} from './src/migration/legacyRedirects'; for (const r of LEGACY_REDIRECTS) console.log(r.from)" | while read -r p; do printf '%s %s\n' "$(curl -sS -o /dev/null -w '%{http_code}' "https://<preview>$p")" "$p"; done | grep -v '^30' || echo "all redirect"
```

Expected: `all redirect`.

- [ ] **Step 3: Point `www.luadocs.com` at the new deployment**

Keep the apex → `www` redirect exactly as it is today. Do not move to the apex — that
would put a second hop on every one of these redirects.

- [ ] **Step 4: Verify against the live domain**

```bash
curl -sSI https://www.luadocs.com/docs/functions/string/format | head -5
```

Expected: a 308 with `Location: https://www.luadocs.com/docs/standard-library/string/format`.

- [ ] **Step 5: Search Console**

Keep the existing property — **same domain, so no change-of-address is needed, and
submitting one would be wrong.** Submit `https://www.luadocs.com/sitemap.xml`.

## Post-launch verification

Run these after cutover. The first two are same-day; the rest need Google to re-crawl,
which takes weeks.

- [ ] **Day 0 — every old URL redirects.** Re-run the Step 2 loop against
      `https://www.luadocs.com`. Expect `all redirect`. This is the one check that
      cannot wait.
- [ ] **Day 0 — no chains.** `curl` follows redirects with `-L`; anything needing two
      hops is a defect:

      ```bash
      curl -sS -o /dev/null -w '%{num_redirects}\n' -L https://www.luadocs.com/docs/functions/math/pi
      ```

      Expected: `1`.
- [ ] **Day 1 — the sitemap is being read.** Search Console → Sitemaps. Expect
      "Success" and ~187 discovered URLs. A number near 292 means the authored-only
      filter regressed.
- [ ] **Week 2 — coverage.** Search Console → Pages. Old `/docs/functions/…` URLs should
      be moving to "Page with redirect". New URLs should be entering "Indexed".
- [ ] **Week 2 — no soft 404s.** A 301 that Google reports as a soft 404 means the
      *target* is thin, not that the redirect is wrong. All 66 targets are authored, so a
      soft 404 here means a real page is reading as thin — check that one, do not assume
      the redirect is at fault.
- [ ] **Week 4 — rankings.** Search Console → Performance, compare the 28 days after
      cutover against the 28 before. A dip of 10–20% during weeks 1–3 is normal and
      recovers. A dip that is still there at week 6 is not, and the first thing to check
      is whether `noindex` is on a page that should be indexed.
- [ ] **Week 4 — every redirect target is still authored.** `npx vitest run
      tests/migration` — the ratchet in Task 2 fails if any target lost its body.

## What this plan does not do

- **No content is ported from the old site.** ADR 0010 stands; the old prose is not a
  source. The only content work here is Task 3's four overviews, written from the manual.
- **No redirect is written for a path that already 404s** — the fifty-seven dead sidebar
  targets and the Tailwind template leftovers (`/quickstart`, `/sdks`, `/webhooks`, …).
  A redirect for a URL that has never returned 200 preserves nothing.
- **No structured data and no OG image work.**
- **Analytics is not this plan's, but it is no longer hypothetical.** When this was written,
  whether the new site had analytics at all was open. There is now an implementation sitting
  uncommitted in the working tree — `src/analytics/googleAnalytics.ts`, `tests/analytics/`
  and a `scripts:` line in `src/routes/__root.tsx`. Commit it on its own before starting
  Task 1 so it is not tangled into the migration diff, and note that shipping it is what
  makes the ROADMAP's "translations, prioritised by analytics" item actionable.
- **`gitConfig.repo` is not updated.** The GitHub repo has been renamed to
  `AurelianSpodarec/luadocs`, and `src/lib/shared.ts` still says `LuaDocs`. GitHub's
  redirect covers it today. It is a real defect and it is not this plan's.

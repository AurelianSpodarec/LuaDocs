# Page Anatomy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the reference-entry template from [page-structure.md](../research/page-structure.md) as real components, and prove it on four entries of the `string` section.

**Architecture:** Structure lives in the MDX body. Every section heading a reader sees at H2 — `## Syntax`, `## Description`, `## Examples`, `## Gotchas`, `## See also` — is a real markdown heading, so the right-rail TOC, `llms.txt` and the `.md` route keep working with no change. Components handle only what sits *below* H2: parameter and return lists, the errors list, and the three callouts. Two blocks are derived rather than authored — the detailed version matrix and the source citation — so the route renders them after the body and splices their headings into the TOC.

**Tech Stack:** TypeScript, React 19, `fumadocs-mdx` (MDX v3), `fumadocs-ui`, Tailwind v4, Vitest + Testing Library.

**Design:** [2026-08-05-page-anatomy-string-design.md](2026-08-05-page-anatomy-string-design.md)

## Global Constraints

- All work stays on `dev`. **Never merge into `main`.** Ask before any merge or push.
- Commit style: `type(scope): summary`, imperative, ≤ ~60 chars, no trailing period, **never** a `Co-Authored-By` trailer. See `docs/conventions/commit-messages.md`.
- Use the [CONTEXT.md](../../CONTEXT.md) vocabulary: **entry**, **delta**, **change note**, **selected version**, **version support**, **gotcha**. Never "compat strip", "pitfall", "caveat", "snippet".
- Every example obeys [ADR 0008](../adr/0008-example-conventions.md): spelled-out `snake_case` names, no single-letter identifiers at all, no local shadowing a standard-library global, real data, self-contained, expected output as a trailing comment.
- **Expected-output comment form.** One output line: `-- Expected output: 5`. More than one: a trailing block, `-- Expected output:` followed by one `--` line per output line.
- The **Syntax** block quotes the manual's own parameter names (`formatstring`, `···`). ADR 0008's naming rules do not apply inside it.
- Version facts come from the compat dataset, never from prose. If a fact belongs in `changed_in`, it does not get hand-written into a paragraph as well.
- **Every factual claim in an entry traces to a passage in the reference manual.** Not to memory, not to a draft in this plan. Task 0 puts all five manuals on disk; read the passage, then write. The MDX in Tasks 11 and 13–15 is a **draft to check against the manual**, not text to paste — where the manual contradicts it, the manual wins and the correction gets noted in the commit.
- **Rewrite, never copy.** [ADR 0003](../adr/0003-dual-license-prose-and-code.md) licenses the prose as ours because it is ours. Read the passage, close it, write the entry in the site's own voice and vocabulary. Reproducing the manual's sentences is the one failure this slice cannot ship.
- `npm test`, `npm run types:check` and `npm run build` must pass at the end of every task.

## File Structure

| File | Responsibility | Change |
|---|---|---|
| `src/compat/resolve.ts` | Compat questions answered from a node | Modify: add `varies()` |
| `src/version/VersionChip.tsx` | One version pill, four states | **Create** |
| `src/version/VersionSupportStrip.tsx` | The top strip | Modify: render `VersionChip` |
| `src/version/VersionMatrix.tsx` | The detailed matrix, conditional | **Create** |
| `src/version/VersionNote.tsx` | The inline delta | Modify: render on the shared callout shell |
| `src/entry/manualSource.ts` | Parse a manual URL back into version + anchor | **Create** |
| `src/entry/EntrySource.tsx` | The source citation | **Create** |
| `src/entry/Parameters.tsx` | `<Parameters>` / `<Param>` | **Create** |
| `src/entry/Returns.tsx` | `<Returns>` / `<Return>` | **Create** |
| `src/entry/Errors.tsx` | `<Errors>` / `<Since>` | **Create** |
| `src/entry/Callout.tsx` | The shell, plus `<Note>` `<Warning>` `<Gotcha>` | **Create** |
| `src/components/mdx.tsx` | MDX component registry | Modify: register the entry components |
| `src/routes/docs/$.tsx` | Loader + page assembly | Modify: return `source`, render matrix + citation, extend the TOC |
| `src/compat/registry.ts` | Compat datasets by key | Modify: register three more |
| `src/compat/data/string.len.json` | Version facts | **Create** |
| `src/compat/data/string.gsub.json` | Version facts | **Create** |
| `src/compat/data/string.patterns.json` | Version facts | **Create** |
| `content/docs/standard-library/string/format.mdx` | The entry | Rewritten |
| `content/docs/standard-library/string/len.mdx` | The entry | Authored |
| `content/docs/standard-library/string/gsub.mdx` | The entry | Authored |
| `content/docs/standard-library/string/patterns.mdx` | The entry | Authored |
| `content/docs/standard-library/math/tointeger.mdx` | Existing entry | Modify: conform its example |
| `tests/compat/resolve.test.ts` | Compat helpers | Modify: `varies()` |
| `tests/version/version-matrix.test.tsx` | Conditional matrix | **Create** |
| `tests/entry/manual-source.test.ts` | URL parsing, round-trip against the manifest | **Create** |
| `tests/entry/entry-source.test.tsx` | The citation | **Create** |
| `tests/entry/lists.test.tsx` | Parameters / Returns / Errors | **Create** |
| `tests/entry/callout.test.tsx` | The three callouts | **Create** |
| `tests/content/entry-anatomy.test.ts` | Every written entry has its sections | **Create** |
| `tests/content/examples.test.ts` | ADR 0008 rules 1 and 3 | **Create** |
| `docs/plans/ROADMAP.md` | The slice list | Modify: split slice 2 |

---

### Task 0: Put all five manuals on disk

Nothing in this slice may be written from memory, and the manual cannot be read over
the network in one piece: `manual.html` runs from 255 KB (5.1) to 381 KB (5.5), and a
web fetch truncates it partway through §4 — before the standard libraries chapter
begins. Every attempt to "just look it up" therefore silently reads nothing.

Downloading them once fixes that for the whole slice, and gives exact text rather than
a summary of it.

**Files:**
- Create: five files under the session scratchpad. Nothing enters the repository.

- [ ] **Step 1: Download every manual**

```bash
mkdir -p manuals
for v in 5.1 5.2 5.3 5.4 5.5; do
  curl -sS -o "manuals/$v.html" "https://www.lua.org/manual/$v/manual.html"
done
wc -c manuals/*.html
```

Run this inside the scratchpad directory named in your environment, **not** in the
repository. Expected: five files, 255 KB through 381 KB, largest last.

- [ ] **Step 2: Verify a passage can be read out of them**

Save this as `manuals/passage.py` — every later task uses it:

```python
import html, re, sys

# Usage: python passage.py <anchor> [version ...]
#   python passage.py pdf-string.gsub 5.1 5.5
#   python passage.py 6.5.1 5.5
anchor, versions = sys.argv[1], sys.argv[2:] or ['5.1', '5.2', '5.3', '5.4', '5.5']

for version in versions:
    text = open(f'{version}.html', encoding='utf-8', errors='replace').read()
    start = text.find(f'"{anchor}"')
    if start < 0:
        print(f'===== {version}: absent')
        continue
    end = text.find('<hr>', start)
    body = html.unescape(re.sub(r'<[^>]+>', '', text[start:end]))
    print(f'===== {version}\n{body.strip()}\n')
```

Run: `cd manuals && python passage.py pdf-string.gsub 5.1 5.5`

Expected: both entries print in full. The 5.5 text ends with an examples block; the 5.1
text says "if the pattern specifies no captures" separately for the table and function
forms, where 5.5 states it once for both. Seeing that difference is the check — if the
output is empty or identical, the extraction is broken and every later task is reading
nothing.

- [ ] **Step 3: Note the anchors this slice needs**

| Entry | Anchor | Manual |
|---|---|---|
| `string.format()` | `pdf-string.format` | all five |
| `string.len()` | `pdf-string.len` | all five |
| `string.gsub()` | `pdf-string.gsub` | all five |
| Patterns | `5.4.1` in 5.1; `6.4.1` in 5.2, 5.3 and 5.4; `6.5.1` in 5.5 | all five |

The Patterns anchor moves twice, because the chapter moves twice: the standard libraries
were §5 in 5.1 and became §6 in 5.2, then 5.5 inserted §6.1 and pushed String
Manipulation from §6.4 to §6.5. That is the same fact ADR 0006 relies on when it refuses
to order the sidebar by manual section number, and the reason the citation names the
manual version it is citing.

These four rows were themselves checked against the downloaded files rather than
recalled — the first draft of this table had 5.2 at `5.4.1`, and it is wrong. Verify
before trusting, including here.

There is nothing to commit — the manuals stay out of the repository.

---

### Task 1: Answer "does any version differ?"

The detailed matrix exists to show a per-version breakdown. On an entry available in
every version and changed in none, that breakdown is five identical rows restating the
strip at the top of the page — prototype finding #2 in `page-structure.md`. One
predicate decides it, and it lives beside the other compat questions rather than
inside the component, so a test can pin it without rendering anything.

**Files:**
- Modify: `src/compat/resolve.ts`
- Test: `tests/compat/resolve.test.ts`

**Interfaces:**
- Produces: `varies(node: CompatNode): boolean`

- [ ] **Step 1: Write the failing test**

Append to `tests/compat/resolve.test.ts`:

```ts
describe('varies', () => {
  it('is false for an entry present since 5.1 and never changed', () => {
    expect(varies({ support: { lua: { version_added: '5.1' } } })).toBe(false);
  });

  it('is false when changed_in is present but empty', () => {
    expect(varies({ support: { lua: { version_added: '5.1' } }, changed_in: {} })).toBe(false);
  });

  it('is true when the entry arrived later than 5.1', () => {
    expect(varies({ support: { lua: { version_added: '5.3' } } })).toBe(true);
  });

  it('is true when the entry was removed', () => {
    expect(
      varies({ support: { lua: { version_added: '5.1', version_removed: '5.4' } } }),
    ).toBe(true);
  });

  it('is true when any version carries a change note', () => {
    expect(
      varies({ support: { lua: { version_added: '5.1' } }, changed_in: { '5.3': 'x' } }),
    ).toBe(true);
  });

  it('is true for a symbol in no documented version', () => {
    expect(varies({ support: { lua: { version_added: false } } })).toBe(true);
  });
});
```

Add `varies` to the existing import from `@/compat/resolve` at the top of the file.

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run tests/compat/resolve.test.ts`
Expected: FAIL — `varies is not a function`.

- [ ] **Step 3: Implement it**

Append to `src/compat/resolve.ts`:

```ts
/**
 * Does any documented version differ from the rest?
 *
 * The detailed matrix renders only when this is true. On an entry available
 * everywhere and changed nowhere it would be five identical rows restating the strip
 * at the top of the page — `page-structure.md`, prototype finding #2.
 */
export function varies(node: CompatNode): boolean {
  if (node.support.lua.version_added !== LUA_VERSIONS[0]) return true;
  if (node.support.lua.version_removed) return true;

  return Object.keys(node.changed_in ?? {}).length > 0;
}
```

- [ ] **Step 4: Run it and watch it pass**

Run: `npx vitest run tests/compat/resolve.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/compat/resolve.ts tests/compat/resolve.test.ts
git commit -m "feat(compat): answer whether any version differs"
```

---

### Task 2: One version pill, four states

Three places now want a version pill: the support strip, the errors list (`5.3+` on a
version-scoped error), and the matrix. The strip's styling is currently inline in
`VersionSupportStrip.tsx`; extracting it before the second caller appears is what
stops a third copy from being written.

The strip's tests read `getByText('5.1')` and assert `data-state` on that same
element, so the version must stay the pill's own direct text.

**Files:**
- Create: `src/version/VersionChip.tsx`
- Modify: `src/version/VersionSupportStrip.tsx`
- Test: `tests/version/support-strip.test.tsx` (unchanged — it must keep passing)

**Interfaces:**
- Produces: `ChipState = 'yes' | 'changed' | 'no' | 'since'`; `<VersionChip version={LuaVersion} state={ChipState} label?={string} />`

- [ ] **Step 1: Write the failing test**

Append to `tests/version/support-strip.test.tsx`:

```ts
import { VersionChip } from '@/version/VersionChip';

describe('VersionChip', () => {
  it('shows the version as its own text, with the state on the element', () => {
    render(<VersionChip version="5.3" state="yes" />);
    const chip = screen.getByText('5.3');
    expect(chip).toHaveAttribute('data-state', 'yes');
    expect(chip).toHaveAttribute('title', 'Available');
  });

  it('takes a label when the version alone would not read', () => {
    render(<VersionChip version="5.3" state="since" label="5.3+" />);
    expect(screen.getByText('5.3+')).toHaveAttribute('data-state', 'since');
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run tests/version/support-strip.test.tsx`
Expected: FAIL — cannot resolve `@/version/VersionChip`.

- [ ] **Step 3: Create the component**

Create `src/version/VersionChip.tsx`:

```tsx
import type { LuaVersion } from '@/compat/schema';

/**
 * `since` is the errors list's pill — "this error only happens from 5.3" — and is
 * deliberately neutral. The other three carry the support strip's meaning, where
 * colour is the signal and `title` plus the strikethrough are what carry it when
 * colour does not reach the reader.
 */
export type ChipState = 'yes' | 'changed' | 'no' | 'since';

const chipClass: Record<ChipState, string> = {
  yes: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  changed: 'border-amber-500/35 bg-amber-500/10 text-amber-700 dark:text-amber-400',
  no: 'border-fd-border bg-fd-muted text-fd-muted-foreground/70 line-through decoration-1',
  since: 'border-fd-border bg-fd-muted text-fd-muted-foreground',
};

const chipTitle: Record<ChipState, string> = {
  yes: 'Available',
  changed: 'Available, with changes',
  no: 'Not available',
  since: 'From this version onward',
};

export function VersionChip({
  version,
  state,
  label,
}: {
  version: LuaVersion;
  state: ChipState;
  /** Overrides the pill's text. The version stays the accessible fallback. */
  label?: string;
}) {
  return (
    <span
      data-state={state}
      title={chipTitle[state]}
      className={`rounded-md border px-2 py-0.5 text-xs font-medium tabular-nums ${chipClass[state]}`}
    >
      {label ?? version}
    </span>
  );
}
```

- [ ] **Step 4: Render it from the strip**

Replace the whole body of `src/version/VersionSupportStrip.tsx` with:

```tsx
import { supportRow } from '@/compat/resolve';
import type { CompatNode } from '@/compat/schema';
import { VersionChip } from './VersionChip';

export function VersionSupportStrip({ node }: { node: CompatNode }) {
  return (
    <div className="not-prose flex flex-wrap gap-1.5" aria-label="Version support">
      {supportRow(node).map(({ version, state }) => (
        <VersionChip key={version} version={version} state={state} />
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Run the version and e2e tests and watch them pass**

Run: `npx vitest run tests/version tests/e2e`
Expected: PASS — the strip's existing assertions and the new chip tests.

- [ ] **Step 6: Commit**

```bash
git add src/version/VersionChip.tsx src/version/VersionSupportStrip.tsx tests/version/support-strip.test.tsx
git commit -m "refactor(version): give the chip one home before it spreads"
```

---

### Task 3: The detailed version matrix

The bottom-of-page breakdown: one row per version, with the change note for that
version where there is one. It renders nothing at all when `varies()` is false.

**Files:**
- Create: `src/version/VersionMatrix.tsx`
- Test: `tests/version/version-matrix.test.tsx`

**Interfaces:**
- Consumes: `varies()` from Task 1, `<VersionChip>` from Task 2
- Produces: `<VersionMatrix node={CompatNode} />`, rendering a `<section id="version-support">` or `null`

- [ ] **Step 1: Write the failing test**

Create `tests/version/version-matrix.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VersionMatrix } from '@/version/VersionMatrix';
import type { CompatNode } from '@/compat/schema';

const unchanged: CompatNode = { support: { lua: { version_added: '5.1' } } };
const changed: CompatNode = {
  support: { lua: { version_added: '5.3' } },
  changed_in: { '5.4': 'Tightened coercion.' },
};

describe('VersionMatrix', () => {
  it('renders nothing when no version differs', () => {
    const { container } = render(<VersionMatrix node={unchanged} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders one row per version when something differs', () => {
    render(<VersionMatrix node={changed} />);
    expect(screen.getAllByRole('row')).toHaveLength(6); // header + five versions
  });

  it('states the status of each version in words, not only in colour', () => {
    render(<VersionMatrix node={changed} />);
    expect(screen.getByRole('row', { name: /5\.1/ })).toHaveTextContent('Not available');
    expect(screen.getByRole('row', { name: /5\.3/ })).toHaveTextContent('Available');
    expect(screen.getByRole('row', { name: /5\.4/ })).toHaveTextContent('Changed');
  });

  it('puts the change note on its own version, and an em dash on the rest', () => {
    render(<VersionMatrix node={changed} />);
    expect(screen.getByRole('row', { name: /5\.4/ })).toHaveTextContent('Tightened coercion.');
    expect(screen.getByRole('row', { name: /5\.5/ })).toHaveTextContent('—');
  });

  it('carries a heading the table of contents can link to', () => {
    const { container } = render(<VersionMatrix node={changed} />);
    expect(container.querySelector('#version-support')).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run tests/version/version-matrix.test.tsx`
Expected: FAIL — cannot resolve `@/version/VersionMatrix`.

- [ ] **Step 3: Create the component**

Create `src/version/VersionMatrix.tsx`:

```tsx
import { changeNoteFor, supportRow, varies } from '@/compat/resolve';
import type { CompatNode } from '@/compat/schema';
import { VersionChip, type ChipState } from './VersionChip';

/** The word behind the colour. A row that only differs by hue says nothing. */
const statusText: Record<Exclude<ChipState, 'since'>, string> = {
  yes: 'Available',
  changed: 'Changed',
  no: 'Not available',
};

/**
 * The fuller per-version breakdown, at the foot of an entry — the low half of MDN's
 * split, where the strip at the top is the glanceable half.
 *
 * It renders only when a version actually differs. On an unchanged entry it would
 * restate the strip five times, which is prototype finding #2 in `page-structure.md`.
 */
export function VersionMatrix({ node }: { node: CompatNode }) {
  if (!varies(node)) return null;

  return (
    <section id="version-support" className="not-prose mt-10">
      <h2 className="mb-3 text-xl font-semibold text-fd-foreground">Version support</h2>
      <div className="overflow-x-auto rounded-xl border bg-fd-card">
        <table className="w-full text-sm">
          <thead className="border-b bg-fd-muted/50 text-fd-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-2 text-start font-medium">Version</th>
              <th scope="col" className="px-4 py-2 text-start font-medium">Status</th>
              <th scope="col" className="px-4 py-2 text-start font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {supportRow(node).map(({ version, state }) => (
              <tr key={version} className="border-b last:border-b-0">
                <td className="px-4 py-2">
                  <VersionChip version={version} state={state} />
                </td>
                <td className="px-4 py-2 text-fd-foreground">{statusText[state]}</td>
                <td className="px-4 py-2 text-fd-muted-foreground">
                  {changeNoteFor(node, version) ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run it and watch it pass**

Run: `npx vitest run tests/version/version-matrix.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/version/VersionMatrix.tsx tests/version/version-matrix.test.tsx
git commit -m "feat(version): break the versions out when they differ"
```

---

### Task 4: Cite the manual, by version

Every entry already carries a `source` URL, generated from `Source { version, anchor }`
in `src/content-tree/manifest.ts`. Nothing has ever rendered it.

The citation names the manual version rather than only linking, because manual section
numbers move: Lua 5.5 added §6.1, "Loading the Libraries in C code", so String
Manipulation is §6.4 in the 5.4 manual and §6.5 in 5.5. A bare "Source" link invites
the reader to treat the anchor as stable, and it is not — the same fact ADR 0006 leans
on when it refuses to order the sidebar by manual section number.

`manualSource.ts` is the inverse of the manifest's `sourceUrl()`. It does not import
the manifest — that module carries all 292 entries and belongs to the build, not the
bundle — so a test pins the two together instead.

**Files:**
- Create: `src/entry/manualSource.ts`
- Create: `src/entry/EntrySource.tsx`
- Test: `tests/entry/manual-source.test.ts`
- Test: `tests/entry/entry-source.test.tsx`

**Interfaces:**
- Produces: `parseManualUrl(url: string): { version: string; anchor: string } | null`; `citationFor(anchor: string): string`; `<EntrySource url={string} />`

- [ ] **Step 1: Write the failing parser test**

Create `tests/entry/manual-source.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { citationFor, parseManualUrl } from '@/entry/manualSource';
import { CONTENT_TREE } from '@/content-tree/manifest';
import { sourceUrl, type Section } from '@/content-tree/manifest';

describe('parseManualUrl', () => {
  it('splits a manual URL into its version and anchor', () => {
    expect(parseManualUrl('https://www.lua.org/manual/5.5/manual.html#pdf-string.format')).toEqual(
      { version: '5.5', anchor: 'pdf-string.format' },
    );
  });

  it('reads a section anchor as readily as a symbol anchor', () => {
    expect(parseManualUrl('https://www.lua.org/manual/5.4/manual.html#6.4.1')).toEqual({
      version: '5.4',
      anchor: '6.4.1',
    });
  });

  it('returns null for anything that is not a manual URL', () => {
    expect(parseManualUrl('https://example.com/whatever')).toBeNull();
    expect(parseManualUrl('https://www.lua.org/manual/5.5/manual.html')).toBeNull();
  });

  // The parser is the manifest generator run backwards. Nothing links the two at
  // runtime — importing the manifest into a component would pull 292 entries into the
  // bundle — so this is what keeps them from drifting apart.
  it('round-trips every source the manifest generates', () => {
    const sources = (function collect(sections: Section[]): Section['source'][] {
      return sections.flatMap((s) => [
        s.source,
        ...s.entries.map((e) => e.source),
        ...collect(s.sections),
      ]);
    })(CONTENT_TREE);

    expect(sources.length).toBeGreaterThan(200);
    for (const source of sources) {
      expect(parseManualUrl(sourceUrl(source))).toEqual({
        version: source.version,
        anchor: source.anchor,
      });
    }
  });
});

describe('citationFor', () => {
  it('reads a symbol anchor as the symbol', () => {
    expect(citationFor('pdf-string.format')).toBe('string.format');
  });

  it('reads a numeric anchor as a section', () => {
    expect(citationFor('6.5.1')).toBe('§6.5.1');
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run tests/entry/manual-source.test.ts`
Expected: FAIL — cannot resolve `@/entry/manualSource`.

- [ ] **Step 3: Write the parser**

Create `src/entry/manualSource.ts`:

```ts
/**
 * The inverse of `sourceUrl()` in `src/content-tree/manifest.ts`.
 *
 * It re-derives rather than importing, because the manifest is the whole 292-entry
 * tree and belongs to the build. `tests/entry/manual-source.test.ts` round-trips every
 * source the manifest generates, which is what keeps the pair honest.
 */
const MANUAL_URL = /^https:\/\/www\.lua\.org\/manual\/(\d+\.\d+)\/manual\.html#(.+)$/;

export interface ManualRef {
  /** The manual this anchor is valid in. Section numbers move between versions. */
  version: string;
  anchor: string;
}

export function parseManualUrl(url: string): ManualRef | null {
  const match = MANUAL_URL.exec(url);
  if (!match) return null;

  return { version: match[1], anchor: match[2] };
}

/**
 * How the anchor reads in prose. The manual anchors every standard-library identifier
 * as `pdf-<name>` and every section as its number.
 */
export function citationFor(anchor: string): string {
  return anchor.startsWith('pdf-') ? anchor.slice(4) : `§${anchor}`;
}
```

- [ ] **Step 4: Run it and watch it pass**

Run: `npx vitest run tests/entry/manual-source.test.ts`
Expected: PASS, including the round-trip over the whole manifest.

- [ ] **Step 5: Write the failing citation test**

Create `tests/entry/entry-source.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EntrySource } from '@/entry/EntrySource';

describe('EntrySource', () => {
  it('names the manual version it is citing, not just the link', () => {
    render(<EntrySource url="https://www.lua.org/manual/5.5/manual.html#pdf-string.format" />);
    expect(screen.getByRole('link', { name: /Lua 5\.5 reference manual/i })).toHaveAttribute(
      'href',
      'https://www.lua.org/manual/5.5/manual.html#pdf-string.format',
    );
  });

  it('cites a symbol by name', () => {
    render(<EntrySource url="https://www.lua.org/manual/5.5/manual.html#pdf-string.format" />);
    expect(screen.getByText('string.format')).toBeInTheDocument();
  });

  it('cites a section by number', () => {
    render(<EntrySource url="https://www.lua.org/manual/5.5/manual.html#6.5.1" />);
    expect(screen.getByText('§6.5.1')).toBeInTheDocument();
  });

  it('renders nothing when the URL is not a manual URL', () => {
    const { container } = render(<EntrySource url="https://example.com/x" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('carries a heading the table of contents can link to', () => {
    const { container } = render(
      <EntrySource url="https://www.lua.org/manual/5.5/manual.html#6.5.1" />,
    );
    expect(container.querySelector('#source')).not.toBeNull();
  });
});
```

- [ ] **Step 6: Run it and watch it fail**

Run: `npx vitest run tests/entry/entry-source.test.tsx`
Expected: FAIL — cannot resolve `@/entry/EntrySource`.

- [ ] **Step 7: Write the component**

Create `src/entry/EntrySource.tsx`:

```tsx
import { citationFor, parseManualUrl } from './manualSource';

/**
 * The attribution line at the foot of an entry (ADR 0003 — the prose is a rewrite,
 * not a copy, and says which passage it rewrites).
 *
 * It names the manual version deliberately. Section numbers are not stable across
 * versions: 5.5 added §6.1 and pushed String Manipulation from §6.4 to §6.5, so
 * "§6.5.1" is only true of the manual it was read from.
 */
export function EntrySource({ url }: { url: string }) {
  const ref = parseManualUrl(url);
  if (!ref) return null;

  return (
    <section id="source" className="not-prose mt-10 border-t pt-4">
      <h2 className="mb-2 text-sm font-semibold text-fd-foreground">Source</h2>
      <p className="text-sm text-fd-muted-foreground">
        Rewritten from the{' '}
        <a
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          className="underline decoration-fd-muted-foreground/40 underline-offset-2 hover:text-fd-primary"
        >
          Lua {ref.version} reference manual
        </a>
        {' — '}
        <span className="font-mono text-xs">{citationFor(ref.anchor)}</span>.
      </p>
    </section>
  );
}
```

- [ ] **Step 8: Run it and watch it pass**

Run: `npx vitest run tests/entry`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/entry/manualSource.ts src/entry/EntrySource.tsx tests/entry/manual-source.test.ts tests/entry/entry-source.test.tsx
git commit -m "feat(entry): cite the manual, and say which one"
```

---

### Task 5: Parameters and return values

Both are name-and-description pairs, so both are `<dl>`s — the element that means
exactly that. They are components rather than markdown lists because the anatomy test
in Task 12 checks for them by name, and because a parameter's name must be in the mono
face without an author remembering backticks every time.

Lua returns multiple values, so `Returns` is a list even when there is one. That is
the whole reason page-structure.md calls the section "Return values" and not "Return
value".

**Files:**
- Create: `src/entry/Parameters.tsx`
- Create: `src/entry/Returns.tsx`
- Test: `tests/entry/lists.test.tsx`

**Interfaces:**
- Produces: `<Parameters>`, `<Param name={string}>`, `<Returns>`, `<Return type={string}>`

- [ ] **Step 1: Write the failing test**

Create `tests/entry/lists.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Param, Parameters } from '@/entry/Parameters';
import { Return, Returns } from '@/entry/Returns';

describe('Parameters', () => {
  it('heads the list and pairs each name with its description', () => {
    render(
      <Parameters>
        <Param name="formatstring">a template.</Param>
        <Param name="···">one value per directive.</Param>
      </Parameters>,
    );

    expect(screen.getByRole('heading', { name: 'Parameters' })).toBeInTheDocument();
    expect(screen.getByText('formatstring').tagName).toBe('DT');
    expect(screen.getByText('a template.').tagName).toBe('DD');
    expect(screen.getByText('···')).toBeInTheDocument();
  });
});

describe('Returns', () => {
  it('heads the list "Return values", because Lua returns more than one', () => {
    render(
      <Returns>
        <Return type="string">the formatted copy.</Return>
      </Returns>,
    );

    expect(screen.getByRole('heading', { name: 'Return values' })).toBeInTheDocument();
    expect(screen.getByText('string').tagName).toBe('DT');
    expect(screen.getByText('the formatted copy.').tagName).toBe('DD');
  });

  it('keeps two returns in the order they were written', () => {
    render(
      <Returns>
        <Return type="string">the modified copy.</Return>
        <Return type="integer">the number of matches.</Return>
      </Returns>,
    );

    const terms = screen.getAllByRole('term').map((node) => node.textContent);
    expect(terms).toEqual(['string', 'integer']);
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run tests/entry/lists.test.tsx`
Expected: FAIL — cannot resolve `@/entry/Parameters`.

- [ ] **Step 3: Write both components**

Create `src/entry/Parameters.tsx`:

```tsx
import type { ReactNode } from 'react';

/** Shared by `Parameters` and `Returns` — the same shape, a different heading. */
export const termListClass = 'my-3 grid gap-y-2';
export const termClass = 'font-mono text-sm text-fd-foreground';
export const descriptionClass = 'ms-0 ps-4 text-sm text-fd-muted-foreground';
export const subheadingClass = 'mt-6 mb-1 text-base font-semibold text-fd-foreground';

export function Parameters({ children }: { children: ReactNode }) {
  return (
    <>
      <h3 className={subheadingClass}>Parameters</h3>
      <dl className={termListClass}>{children}</dl>
    </>
  );
}

export function Param({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div>
      <dt className={termClass}>{name}</dt>
      <dd className={descriptionClass}>{children}</dd>
    </div>
  );
}
```

Create `src/entry/Returns.tsx`:

```tsx
import type { ReactNode } from 'react';
import { descriptionClass, subheadingClass, termClass, termListClass } from './Parameters';

/**
 * "Return values", plural, always. A Lua function returning two values is ordinary,
 * which is what makes this section richer than MDN's single "Return value".
 */
export function Returns({ children }: { children: ReactNode }) {
  return (
    <>
      <h3 className={subheadingClass}>Return values</h3>
      <dl className={termListClass}>{children}</dl>
    </>
  );
}

export function Return({ type, children }: { type: string; children: ReactNode }) {
  return (
    <div>
      <dt className={termClass}>{type}</dt>
      <dd className={descriptionClass}>{children}</dd>
    </div>
  );
}
```

- [ ] **Step 4: Run it and watch it pass**

Run: `npx vitest run tests/entry/lists.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/entry/Parameters.tsx src/entry/Returns.tsx tests/entry/lists.test.tsx
git commit -m "feat(entry): pair parameters and returns with their names"
```

---

### Task 6: The errors list, and version-scoped errors

An error is a sentence, so `<Errors>` wraps a plain markdown list rather than inventing
a component per bullet. What it does add is `<Since v="5.3" />` — an inline pill for the
errors that only exist from a given version, so a reader on 5.1 can see at a glance
which of these can happen to them.

MDX renders markdown inside a JSX block when the markdown is separated from the tags by
blank lines. That is why the authored form has them.

**Files:**
- Create: `src/entry/Errors.tsx`
- Test: `tests/entry/lists.test.tsx` (extend)

**Interfaces:**
- Consumes: `<VersionChip>` from Task 2
- Produces: `<Errors>`, `<Since v={LuaVersion} />`

- [ ] **Step 1: Write the failing test**

Append to `tests/entry/lists.test.tsx`:

```tsx
import { Errors, Since } from '@/entry/Errors';

describe('Errors', () => {
  it('heads the list and keeps its items as a list', () => {
    render(
      <Errors>
        <ul>
          <li>Raises if a directive is invalid.</li>
        </ul>
      </Errors>,
    );

    expect(screen.getByRole('heading', { name: 'Errors' })).toBeInTheDocument();
    expect(screen.getByRole('listitem')).toHaveTextContent('Raises if a directive is invalid.');
  });
});

describe('Since', () => {
  it('marks the version an error starts happening in', () => {
    render(<Since v="5.3" />);
    const chip = screen.getByText('5.3+');
    expect(chip).toHaveAttribute('data-state', 'since');
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run tests/entry/lists.test.tsx`
Expected: FAIL — cannot resolve `@/entry/Errors`.

- [ ] **Step 3: Write the component**

Create `src/entry/Errors.tsx`:

```tsx
import type { ReactNode } from 'react';
import type { LuaVersion } from '@/compat/schema';
import { VersionChip } from '@/version/VersionChip';
import { subheadingClass } from './Parameters';

/**
 * "Errors", never "Exceptions" — Lua raises, it does not throw. Shown only where an
 * entry has any; `page-structure.md` makes the section conditional.
 */
export function Errors({ children }: { children: ReactNode }) {
  return (
    <>
      <h3 className={subheadingClass}>Errors</h3>
      <div className="text-sm [&_li]:mb-1 [&_ul]:list-disc [&_ul]:ps-5">{children}</div>
    </>
  );
}

/**
 * An error that only exists from a given version onward. It is a pill rather than a
 * parenthesis because a reader scanning this list on 5.1 needs to skip these without
 * reading them.
 */
export function Since({ v }: { v: LuaVersion }) {
  return (
    <span className="me-1.5 inline-block align-middle">
      <VersionChip version={v} state="since" label={`${v}+`} />
    </span>
  );
}
```

- [ ] **Step 4: Run it and watch it pass**

Run: `npx vitest run tests/entry/lists.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/entry/Errors.tsx tests/entry/lists.test.tsx
git commit -m "feat(entry): list the errors, and when they started"
```

---

### Task 7: Three callouts, and only three

`page-structure.md` allows Note, Warning and Gotcha, and says so because MDN's
experience is that callout types proliferate until none of them mean anything.
**Gotcha** is the site's own — CONTEXT.md calls it "a first-class callout" — so it
takes its own colour rather than being a Note with a different word on it.

`VersionNote` already draws this exact shape by hand, in two more accents. It moves
onto the shared shell in the same task, so the site has one callout and not two
families of them.

**Files:**
- Create: `src/entry/Callout.tsx`
- Modify: `src/version/VersionNote.tsx`
- Test: `tests/entry/callout.test.tsx`
- Test: `tests/e2e/string-format.test.tsx` (unchanged — it must keep passing)

**Interfaces:**
- Produces: `<Callout kind={CalloutKind} title?={string}>`, `<Note>`, `<Warning>`, `<Gotcha>`; `CalloutKind = 'note' | 'warning' | 'gotcha' | 'changed' | 'unavailable'`

- [ ] **Step 1: Write the failing test**

Create `tests/entry/callout.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Gotcha, Note, Warning } from '@/entry/Callout';

describe('the callouts', () => {
  it('labels a note', () => {
    render(<Note>Nothing alarming.</Note>);
    const callout = screen.getByRole('note');
    expect(callout).toHaveAttribute('data-callout', 'note');
    expect(callout).toHaveTextContent('Note');
    expect(callout).toHaveTextContent('Nothing alarming.');
  });

  it('labels a warning', () => {
    render(<Warning>Undefined behaviour.</Warning>);
    expect(screen.getByRole('note')).toHaveAttribute('data-callout', 'warning');
    expect(screen.getByRole('note')).toHaveTextContent('Warning');
  });

  it('gives a gotcha its own kind and its own title', () => {
    render(<Gotcha title="Integers vs floats">Since 5.3, %d needs an integer.</Gotcha>);
    const callout = screen.getByRole('note');
    expect(callout).toHaveAttribute('data-callout', 'gotcha');
    expect(callout).toHaveTextContent('Gotcha: Integers vs floats');
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run tests/entry/callout.test.tsx`
Expected: FAIL — cannot resolve `@/entry/Callout`.

- [ ] **Step 3: Write the shell and the three callouts**

Create `src/entry/Callout.tsx`:

```tsx
import { CircleAlert, Info, Lightbulb, TriangleAlert } from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';

/**
 * Five kinds, and the list is closed.
 *
 * Three are authored — `page-structure.md` allows Note, Warning and Gotcha and no
 * more, because MDN's lesson is that callout types multiply until none of them carry
 * weight. Two are derived, drawn by `VersionNote` from the compat dataset; they live
 * here so the site has one callout rather than two families that drift apart.
 */
export type CalloutKind = 'note' | 'warning' | 'gotcha' | 'changed' | 'unavailable';

const kindClass: Record<CalloutKind, string> = {
  note: 'border-fd-border border-s-fd-muted-foreground/50 bg-fd-muted/40',
  warning: 'border-red-500/30 border-s-red-500 bg-red-500/8',
  gotcha: 'border-violet-500/30 border-s-violet-500 bg-violet-500/8',
  changed: 'border-blue-500/30 border-s-blue-500 bg-blue-500/8',
  unavailable: 'border-amber-500/30 border-s-amber-500 bg-amber-500/8',
};

const kindIconClass: Record<CalloutKind, string> = {
  note: 'text-fd-muted-foreground',
  warning: 'text-red-600 dark:text-red-400',
  gotcha: 'text-violet-600 dark:text-violet-400',
  changed: 'text-blue-600 dark:text-blue-400',
  unavailable: 'text-amber-600 dark:text-amber-400',
};

const kindIcon: Record<CalloutKind, ComponentType<{ className?: string }>> = {
  note: Info,
  warning: TriangleAlert,
  gotcha: Lightbulb,
  changed: Info,
  unavailable: CircleAlert,
};

export function Callout({
  kind,
  title,
  children,
}: {
  kind: CalloutKind;
  /** Omitted by the derived kinds, which put their own heading in `children`. */
  title?: string;
  children: ReactNode;
}) {
  const Icon = kindIcon[kind];

  return (
    <div
      role="note"
      data-callout={kind}
      className={`not-prose my-4 flex items-start gap-2.5 rounded-lg border border-s-4 px-3.5 py-2.5 text-sm leading-6 ${kindClass[kind]}`}
    >
      <Icon aria-hidden className={`mt-0.5 size-4 shrink-0 ${kindIconClass[kind]}`} />
      <div>
        {title && <strong className="me-1 text-fd-foreground">{title}</strong>}
        {children}
      </div>
    </div>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <Callout kind="note" title="Note">
      {children}
    </Callout>
  );
}

export function Warning({ children }: { children: ReactNode }) {
  return (
    <Callout kind="warning" title="Warning">
      {children}
    </Callout>
  );
}

/**
 * The site's signature callout: surprising-but-not-dangerous semantics — 1-based
 * indexing, `nil` holes, only `nil` and `false` being falsy. A gotcha that looked like
 * a Note would be a Note, so it takes its own colour and always carries a subject.
 */
export function Gotcha({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Callout kind="gotcha" title={`Gotcha: ${title}`}>
      {children}
    </Callout>
  );
}
```

- [ ] **Step 4: Move `VersionNote` onto the shell**

Replace the two returns in `src/version/VersionNote.tsx` so both render `Callout`,
keeping the `data-note` attribute the e2e test queries:

```tsx
import { changeNoteFor, isAvailable } from '@/compat/resolve';
import type { CompatNode } from '@/compat/schema';
import { Callout } from '@/entry/Callout';
import { useSelectedVersion } from './SelectedVersionProvider';

/**
 * The inline delta for the selected version — either an availability bound or a
 * change note. Always inline, never a modal.
 *
 * It draws on the shared callout shell in two derived kinds: amber for "this does not
 * exist where you are", blue for "it exists but behaves differently". `data-note` is
 * what `tests/e2e/string-format.test.tsx` queries.
 */
export function VersionNote({ node, name }: { node: CompatNode; name: string }) {
  const { version } = useSelectedVersion();

  if (!isAvailable(node, version)) {
    const added = node.support.lua.version_added;
    return (
      <Callout kind="unavailable">
        <span data-note="unavailable">
          <strong>Not in Lua {version}.</strong>{' '}
          {added === false
            ? `${name} is not part of any documented Lua version.`
            : `${name} was introduced in Lua ${added}.`}
        </span>
      </Callout>
    );
  }

  const note = changeNoteFor(node, version);
  if (!note) return null;

  return (
    <Callout kind="changed">
      <span data-note="changed">
        <strong>Changed in Lua {version}:</strong> {note}
      </span>
    </Callout>
  );
}
```

- [ ] **Step 5: Run the callout, version and e2e tests and watch them pass**

Run: `npx vitest run tests/entry tests/version tests/e2e`
Expected: PASS — including the e2e assertions on `[data-note="changed"]` and
`[data-note="unavailable"]`.

- [ ] **Step 6: Commit**

```bash
git add src/entry/Callout.tsx src/version/VersionNote.tsx tests/entry/callout.test.tsx
git commit -m "feat(entry): give the site one callout, in five kinds"
```

---

### Task 8: Wire the entry components into the page

Three changes to the route. The loader returns the `source` URL it already reads from
frontmatter. The page renders the matrix and the citation after the body. And the TOC
gains their two headings — without that, the right rail claims the page ends at "See
also" while two sections follow it.

**Files:**
- Modify: `src/components/mdx.tsx`
- Modify: `src/routes/docs/$.tsx`
- Test: none new — Task 12's content tests and a manual preview check cover this

**Interfaces:**
- Consumes: everything from Tasks 3–7
- Produces: `<Parameters>`, `<Param>`, `<Returns>`, `<Return>`, `<Errors>`, `<Since>`, `<Note>`, `<Warning>`, `<Gotcha>` available in every `.mdx` file; loader data gains `source: string | null`

- [ ] **Step 1: Register the components**

Replace `src/components/mdx.tsx` with:

```tsx
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { RunnableExample } from '@/runner/RunnableExample';
import { Param, Parameters } from '@/entry/Parameters';
import { Return, Returns } from '@/entry/Returns';
import { Errors, Since } from '@/entry/Errors';
import { Gotcha, Note, Warning } from '@/entry/Callout';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    RunnableExample,
    Parameters,
    Param,
    Returns,
    Return,
    Errors,
    Since,
    Note,
    Warning,
    Gotcha,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
```

- [ ] **Step 2: Return the source URL from the loader**

In `src/routes/docs/$.tsx`, inside the `loader` handler's returned object, add `source`
beside `luaCompat`:

```ts
    return {
      path: page.path,
      luaCompat: page.data['lua-compat'] ?? null,
      source: page.data.source ?? null,
      compatByUrl,
      markdownUrl: encodeMarkdownUrl(page.slugs, page.locale),
      pageTree: await source.serializePageTree(source.getPageTree()),
    };
```

Note the local name collision: the module already imports `source` from `@/lib/source`
and uses it in this handler. The returned key is `source:` on the object, which is
fine, but do not rename the import.

- [ ] **Step 3: Render the matrix and the citation, and extend the TOC**

In the same file, change `Content` to take the source URL and render both derived
blocks after `DocsBody`:

```tsx
function Content({
  path,
  markdownUrl,
  luaCompat,
  sourceUrl,
  Breadcrumb,
}: {
  path: string;
  markdownUrl: string;
  luaCompat: string | null;
  sourceUrl: string | null;
  Breadcrumb: FC<BreadcrumbProps>;
}) {
  const page = docs.getPage(path);
  if (!page) throw new Error(`unknown page: ${path}`);

  const { toc } = use(page.load());
  const MDX = page.body;
  const node = compatNodeFor(luaCompat);

  // The matrix and the citation are rendered by the route, so neither heading is in
  // the MDX-derived TOC. Without these the right rail claims the page ends at "See
  // also" while two sections follow it.
  const fullToc = [
    ...toc,
    ...(node && varies(node)
      ? [{ title: 'Version support', url: '#version-support', depth: 2 }]
      : []),
    ...(sourceUrl ? [{ title: 'Source', url: '#source', depth: 2 }] : []),
  ];

  return (
    <DocsPage toc={fullToc} slots={{ breadcrumb: Breadcrumb }}>
      <DocsTitle>{page.title}</DocsTitle>
      <DocsDescription>{page.description}</DocsDescription>
      {/* The version switcher used to sit here. It moved to the header, where it is
          visible on every page rather than only on entries (ADR 0007). */}
      <div className="flex flex-row gap-2 items-center border-b -mt-4 pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${path}`}
        />
      </div>
      {node && (
        <div className="flex flex-col gap-3">
          <VersionSupportStrip node={node} />
          <VersionNote node={node} name={page.title} />
        </div>
      )}
      <DocsBody>
        <MDX components={useMDXComponents()} />
      </DocsBody>
      {/* Derived, not authored — see the amendment in page-structure.md. Both sit
          after "See also" so neither is a thing an author has to remember to place. */}
      {node && <VersionMatrix node={node} />}
      {sourceUrl && <EntrySource url={sourceUrl} />}
    </DocsPage>
  );
}
```

Add the imports at the top of the file:

```ts
import { varies } from '@/compat/resolve';
import { VersionMatrix } from '@/version/VersionMatrix';
import { EntrySource } from '@/entry/EntrySource';
```

- [ ] **Step 4: Pass the new field through `Page`**

In `Page`, destructure `source` from the loader data under a non-colliding name and
hand it to `Content`:

```tsx
  const { pageTree, path, markdownUrl, luaCompat, compatByUrl, source: sourceUrl } =
    useFumadocsLoader(Route.useLoaderData());
```

and

```tsx
          <Content
            path={path}
            markdownUrl={markdownUrl}
            luaCompat={luaCompat}
            sourceUrl={sourceUrl}
            Breadcrumb={Breadcrumb}
          />
```

- [ ] **Step 5: Verify the whole suite and the build**

Run: `npm test`
Expected: PASS.

Run: `npm run types:check`
Expected: no output.

Run: `npm run build`
Expected: exit 0, prerender completes.

- [ ] **Step 6: Verify it in the browser**

Start the preview (`luadocs-dev` in `.claude/launch.json`) and open
`/docs/standard-library/string/format`. Confirm:
- A **Version support** table appears below the body, with five rows.
- A **Source** line appears below it, reading "Rewritten from the Lua 5.5 reference
  manual — string.format."
- The right-rail TOC lists **Version support** and **Source** as its last two items.
- Open `/docs/standard-library/math/tointeger` and confirm the matrix is **present**
  there too (it was added in 5.3, so it varies).

- [ ] **Step 7: Commit**

```bash
git add src/components/mdx.tsx src/routes/docs/$.tsx
git commit -m "feat(entry): render the matrix and the citation"
```

---

### Task 9: Version facts for the three new entries

Three entries need a compat node before they can be authored. **Do not write a change
note you have not read in two manuals.** The whole point of the dataset is that the
strip, the note, the matrix and the sidebar badge all come from one place; a guessed
note is wrong in four places at once.

Read each entry in all five manuals and record only differences you can see:

- <https://www.lua.org/manual/5.1/manual.html>
- <https://www.lua.org/manual/5.2/manual.html>
- <https://www.lua.org/manual/5.3/manual.html>
- <https://www.lua.org/manual/5.4/manual.html>
- <https://www.lua.org/manual/5.5/manual.html>

`string.len` is expected to come out empty — present since 5.1, never changed. That is
not a shortcut, it is the case Task 13 exists to prove: an entry with no variation
renders no matrix. Confirm it rather than assuming it.

**Files:**
- Create: `src/compat/data/string.len.json`
- Create: `src/compat/data/string.gsub.json`
- Create: `src/compat/data/string.patterns.json`
- Modify: `src/compat/registry.ts`
- Test: `tests/compat/schema.test.ts` (extend)

**Interfaces:**
- Produces: compat keys `string.len`, `string.gsub`, `string.patterns`

- [ ] **Step 1: Write the failing test**

Append to `tests/compat/schema.test.ts`:

```ts
import { compatNodes } from '@/compat/registry';

describe('the registered datasets', () => {
  it('carries a node for every symbol the string pilot documents', () => {
    for (const key of ['string.format', 'string.len', 'string.gsub', 'string.patterns']) {
      expect(compatNodes[key], key).toBeDefined();
    }
  });

  it('records string.len as present since 5.1 and never changed', () => {
    const node = compatNodes['string.len'];
    expect(node.support.lua.version_added).toBe('5.1');
    expect(node.support.lua.version_removed).toBeUndefined();
    expect(node.changed_in ?? {}).toEqual({});
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run tests/compat/schema.test.ts`
Expected: FAIL — `string.len` is undefined.

- [ ] **Step 3: Read the manuals and write the three files**

Create `src/compat/data/string.len.json`:

```json
{
  "support": { "lua": { "version_added": "5.1" } }
}
```

Create `src/compat/data/string.gsub.json` and `src/compat/data/string.patterns.json` in
the same shape, with a `changed_in` entry for each difference you actually found. The
schema is strict — unknown keys fail at module load — so the only fields available are
`support.lua.version_added`, `support.lua.version_removed`, `changed_in` and `notes`.

A change note is one sentence, present tense, describing what that version does
differently. Match the voice already in `string.format.json`:
`"Adds %a/%A (hexadecimal float)."`

If a symbol turns out to have no differences, write the file with `support` alone and
no `changed_in`, exactly as `string.len` above.

- [ ] **Step 4: Register them**

In `src/compat/registry.ts`, add three imports beside the existing two:

```ts
import stringLen from './data/string.len.json';
import stringGsub from './data/string.gsub.json';
import stringPatterns from './data/string.patterns.json';
```

and three keys to `raw`:

```ts
const raw: Record<string, unknown> = {
  'string.format': stringFormat,
  'string.len': stringLen,
  'string.gsub': stringGsub,
  'string.patterns': stringPatterns,
  'math.tointeger': mathTointeger,
};
```

- [ ] **Step 5: Run it and watch it pass**

Run: `npx vitest run tests/compat`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/compat/data src/compat/registry.ts tests/compat/schema.test.ts
git commit -m "feat(compat): record version facts for three string entries"
```

---

### Task 10: Conform the one example outside the pilot

`math.tointeger` carries the other example written during the version slice. ADR 0008
grandfathers nothing, so it is rewritten now rather than exempted — otherwise Task 12's
test needs an exemption list on the day it is written.

**Files:**
- Modify: `content/docs/standard-library/math/tointeger.mdx`

- [ ] **Step 1: Rewrite the example**

Replace the `<RunnableExample>` line in `content/docs/standard-library/math/tointeger.mdx`
with:

```mdx
<RunnableExample code={`local exact_value = 3.0\nlocal fractional_value = 3.5\nprint(math.tointeger(exact_value))\nprint(math.tointeger(fractional_value))\n-- Expected output:\n-- 3\n-- nil`} />
```

The locals exist so the example names what it is demonstrating — one float with an
exact integer representation and one without — which the bare literals did not.

- [ ] **Step 2: Verify it runs what it claims**

Start the preview (`luadocs-dev` in `.claude/launch.json`) and open
`/docs/standard-library/math/tointeger`. The example runs on load; confirm the output
pane reads `3` then `nil`, matching the comment.

- [ ] **Step 3: Commit**

```bash
git add content/docs/standard-library/math/tointeger.mdx
git commit -m "content: name what the tointeger example demonstrates"
```

---

### Task 11: `string.format()` — the full skeleton

The richest of the four: every section the template has, and three changed versions in
the matrix.

One rule this entry exists to demonstrate: **the Gotcha does not name a version.**
Prototype finding #1 was that the same version fact got hand-repeated three or four
times per entry and would drift. `<Since v="5.3" />` in Errors and the matrix at the
foot both come from the dataset; the Gotcha describes the trap itself, undated.

**Files:**
- Modify: `content/docs/standard-library/string/format.mdx`

- [ ] **Step 0: Read the manual first**

Run: `cd manuals && python passage.py pdf-string.format 5.5`

Then read the C `printf` conversions the entry lists. The draft below names `%s %d %f
%g %e %x %X %c %q %%` — confirm each against the passage, and confirm the manual does
not document a conversion the draft omits. Check in particular what the manual says
about `%q`'s output and about which conversions accept which argument types.

Everything below is a **draft**. Where the manual disagrees, the manual wins. Write the
entry in the site's own voice — do not paste the manual's sentences (ADR 0003).

- [ ] **Step 1: Write the entry**

Replace the whole file with:

````mdx
---
title: string.format()
description: Build a string by inserting values into a template.
lua-compat: string.format
entry-type: function
source: https://www.lua.org/manual/5.5/manual.html#pdf-string.format
---

Builds a string by inserting values into a template, using the same directives as C's
`printf`. The first argument is the template; every directive in it consumes one of the
arguments that follow.

<RunnableExample code={`local person_name = "Ada"\nlocal person_age = 36\nprint(string.format("%s is %d years old", person_name, person_age))\n-- Expected output: Ada is 36 years old`} />

## Syntax

```lua
string.format(formatstring, ···)
```

<Parameters>
  <Param name="formatstring">The template — literal text with `%` directives embedded in it.</Param>
  <Param name="···">One value per directive, in the order the directives appear. `%%` consumes nothing.</Param>
</Parameters>

<Returns>
  <Return type="string">A copy of `formatstring` with every directive replaced by its formatted value.</Return>
</Returns>

<Errors>

- Raises when a directive is not one Lua recognises, such as `%y`.
- Raises `bad argument` when a value is missing, or is the wrong kind for its directive.
- <Since v="5.3" /> Raises `number has no integer representation` when a float with a fractional part reaches an integer directive such as `%d`.

</Errors>

## Description

Every directive begins with `%`, may carry flags, a width and a precision, and ends
with a letter naming the conversion:

- `%s` — the value as a string. Any value works: `tostring()` is applied first.
- `%d` — an integer.
- `%f`, `%g`, `%e` — a float, in fixed, shortest, and exponential notation.
- `%x`, `%X` — an integer in lower- or upper-case hexadecimal.
- `%c` — the character with the given byte value.
- `%q` — a value written so that Lua can read it back.
- `%%` — a literal `%`, consuming no argument.

Flags, width and precision behave as they do in C. `%5d` pads to five columns, `%-5d`
pads on the right instead, and `%.3f` keeps three decimal places.

<Note>
`%q` writes a value Lua itself can read back, which makes it the directive to reach for
when saving simple data as source code rather than as text.
</Note>

## Examples

### Padding and precision

<RunnableExample code={`local item_count = 42\nprint(string.format("[%5d]", item_count))\nprint(string.format("[%-5d]", item_count))\nprint(string.format("%.3f", math.pi))\n-- Expected output:\n-- [   42]\n-- [42   ]\n-- 3.142`} />

### Quoting a value so Lua can read it back

<RunnableExample code={`local quoted_line = string.format("%q", 'she said "hello"')\nprint(quoted_line)`} />

## Gotchas

<Gotcha title="Integer directives reject fractional floats">
`%d` needs a value with an exact integer representation. `string.format("%d", 3.0)`
works, because 3.0 *is* 3 — but `string.format("%d", 3.5)` raises. Reach for `%g`, or
round with `math.floor()`, whenever the value might be fractional.
</Gotcha>

## See also

- [`string.rep()`](/docs/standard-library/string/rep) — repeating a string rather than filling a template
- [`tostring()`](/docs/standard-library/globals/tostring) — the conversion `%s` performs
````

- [ ] **Step 2: Give the `%q` example its expected output**

That example is written above without an expected-output comment, because `%q`'s exact
escaping is a thing to read rather than predict. Open the page, read the output pane,
and add the comment to match what Lua actually printed — never the other way round.

ADR 0008 rule 6 is not optional: the example is not finished until the comment is there.

- [ ] **Step 3: Verify the whole page in the browser**

Open `/docs/standard-library/string/format`. Confirm, in order: breadcrumb, title,
version support strip, summary, the runnable example (which runs on load and prints
`Ada is 36 years old`), **Syntax** as a highlighted `lua` code block, Parameters, Return
values, Errors with a `5.3+` pill on the third item, Description, the Note, two Examples
under their own headings, the Gotcha in violet, See also, the **Version support** table,
and the **Source** line.

Check the right-rail TOC lists exactly: Syntax, Description, Examples, Gotchas, See
also, Version support, Source.

Switch the header version to 5.3 and confirm the change note appears below the strip.

- [ ] **Step 4: Run the suite and the build**

Run: `npm test && npm run types:check && npm run build`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add content/docs/standard-library/string/format.mdx
git commit -m "content: write string.format() to the template"
```

---

### Task 12: Guard the anatomy and the example rules

Structure lives in MDX, which means nothing but a test stops it drifting across 292
entries. This is that test, and it is the reason the design chose MDX over a frontmatter
schema.

It lands now rather than at the end because from here every authoring task has to keep
it green — the enforcement doing its job, rather than a sweep at the finish.

Both tests read `content/docs/**` directly and skip stubs, the same way
`tests/content-tree/committed-tree.test.ts` reads the committed tree.

**Files:**
- Create: `tests/content/entry-anatomy.test.ts`
- Create: `tests/content/examples.test.ts`

**Interfaces:**
- Consumes: `listContentFiles` and `PLACEHOLDER` from `@/content-tree/scaffold`; `CONTENT_TREE` and `sourceUrl` from `@/content-tree/manifest`

- [ ] **Step 1: Write the anatomy test**

Create `tests/content/entry-anatomy.test.ts`:

```ts
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { CONTENT_TREE, sourceUrl, type Section } from '@/content-tree/manifest';
import { listContentFiles, PLACEHOLDER } from '@/content-tree/scaffold';

const DEST = 'content/docs';

interface WrittenEntry {
  rel: string;
  frontmatter: string;
  body: string;
}

/** Every entry actually authored. A stub has nothing to check. */
const written: WrittenEntry[] = [];

for (const rel of await listContentFiles(DEST)) {
  if (!rel.endsWith('.mdx')) continue;

  const text = await readFile(join(DEST, rel), 'utf8');
  if (text.includes(PLACEHOLDER)) continue;

  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(text);
  if (!match) throw new Error(`${rel} has no frontmatter`);

  written.push({ rel, frontmatter: match[1], body: match[2] });
}

function fieldOf(frontmatter: string, key: string): string | null {
  const found = new RegExp(`^${key}: (.*)$`, 'm').exec(frontmatter);
  return found ? found[1].trim() : null;
}

const functions = written.filter((e) => fieldOf(e.frontmatter, 'entry-type') === 'function');

/** Every entry's expected source URL, keyed the way `listContentFiles` reports paths. */
const expectedSource = new Map<string, string>();
(function collect(sections: Section[], prefix: string): void {
  for (const section of sections) {
    const dir = prefix ? `${prefix}/${section.slug}` : section.slug;
    expectedSource.set(`${dir}/index.mdx`, sourceUrl(section.source));
    for (const entry of section.entries) {
      expectedSource.set(`${dir}/${entry.slug}.mdx`, sourceUrl(entry.source));
    }
    collect(section.sections, dir);
  }
})(CONTENT_TREE, '');

describe('the anatomy of a written entry', () => {
  it('has entries to check at all', () => {
    // A guard that silently checks nothing is worse than no guard.
    expect(written.length).toBeGreaterThan(1);
    expect(functions.length).toBeGreaterThan(0);
  });

  it('gives every function entry a Syntax section', () => {
    for (const entry of functions) {
      expect(entry.body, entry.rel).toContain('## Syntax');
    }
  });

  it('gives every function entry its parameters and return values', () => {
    for (const entry of functions) {
      expect(entry.body, entry.rel).toContain('<Parameters>');
      expect(entry.body, entry.rel).toContain('<Returns>');
    }
  });

  it('ends every function entry with a See also section', () => {
    for (const entry of functions) {
      expect(entry.body, entry.rel).toContain('## See also');
    }
  });

  it('cites exactly the manual passage the manifest generates for it', () => {
    for (const entry of written) {
      const want = expectedSource.get(entry.rel);
      // `content/docs/index.mdx` is the authored site root, not an entry.
      if (!want) continue;
      expect(fieldOf(entry.frontmatter, 'source'), entry.rel).toBe(want);
    }
  });
});
```

- [ ] **Step 2: Run it and watch it pass**

Run: `npx vitest run tests/content/entry-anatomy.test.ts`
Expected: PASS. Only `string.format` and `math.tointeger` are written, and Tasks 10 and
11 conformed both. If it fails, the message names the file — fix the entry, not the test.

- [ ] **Step 3: Write the examples test**

Create `tests/content/examples.test.ts`:

```ts
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { listContentFiles, PLACEHOLDER } from '@/content-tree/scaffold';

const DEST = 'content/docs';

/**
 * ADR 0008 rules 1 and 3 — the two that are mechanically checkable. Rules 2, 4 and 5
 * (type-named locals, real data, self-containment) are judgement and stay human.
 */
const SHADOWED = [
  'string', 'table', 'math', 'io', 'os', 'coroutine', 'utf8', 'debug', 'package',
  'type', 'select', 'next', 'print', 'pairs', 'ipairs', 'error', 'assert', 'pcall',
  'xpcall', 'require', 'tostring', 'tonumber', 'setmetatable', 'getmetatable',
  'rawget', 'rawset', 'rawequal', 'rawlen', 'load', 'loadfile', 'dofile', 'unpack',
  'collectgarbage', 'warn',
];

const EXAMPLE = /<RunnableExample\s+code=\{`([\s\S]*?)`\}/g;
const LOCAL = /\blocal\s+([A-Za-z_]\w*(?:\s*,\s*[A-Za-z_]\w*)*)/g;

interface Example {
  rel: string;
  code: string;
}

const examples: Example[] = [];

for (const rel of await listContentFiles(DEST)) {
  if (!rel.endsWith('.mdx')) continue;

  const text = await readFile(join(DEST, rel), 'utf8');
  if (text.includes(PLACEHOLDER)) continue;

  for (const match of text.matchAll(EXAMPLE)) {
    examples.push({ rel, code: match[1] });
  }
}

/** Every name bound by a `local` in this example, including `local first, second`. */
function localsIn(code: string): string[] {
  return [...code.matchAll(LOCAL)].flatMap((match) =>
    match[1].split(',').map((name) => name.trim()),
  );
}

describe('every example follows ADR 0008', () => {
  it('has examples to check at all', () => {
    expect(examples.length).toBeGreaterThan(0);
  });

  it('spells its names out — no single-letter identifiers', () => {
    for (const example of examples) {
      const short = localsIn(example.code).filter((name) => name.replace(/_/g, '').length < 2);
      expect(short, example.rel).toEqual([]);
    }
  });

  it('never binds over a name the standard library defines', () => {
    for (const example of examples) {
      const shadowed = localsIn(example.code).filter((name) => SHADOWED.includes(name));
      expect(shadowed, example.rel).toEqual([]);
    }
  });
});
```

- [ ] **Step 4: Run it and watch it pass**

Run: `npx vitest run tests/content`
Expected: PASS.

- [ ] **Step 5: Prove the guard actually bites**

Temporarily add `local s = "x"` to any written example, re-run
`npx vitest run tests/content/examples.test.ts`, and confirm it FAILS naming that file.
Then revert. A guard nobody has watched fail is a guard nobody knows works.

- [ ] **Step 6: Commit**

```bash
git add tests/content
git commit -m "test(content): guard the entry anatomy and example rules"
```

---

### Task 13: `string.len()` — the minimum, and no matrix

The opposite end of the template from `string.format`. It proves two things: an entry
with no Errors section is still complete, and an entry whose versions do not differ
renders **no** matrix at all.

**Files:**
- Modify: `content/docs/standard-library/string/len.mdx`

- [ ] **Step 0: Read the manual first**

Run: `cd manuals && python passage.py pdf-string.len`

All five versions, because this entry's claim is that nothing changed. Confirm the
wording is equivalent across them rather than glancing at 5.5 alone.

The draft claims two things the manual must support: that the length is in **bytes**,
and that embedded zeros are counted. Verify both — the second is the sort of detail a
reader relies on and a writer half-remembers.

Everything below is a **draft**. Where the manual disagrees, the manual wins. Write the
entry in the site's own voice — do not paste the manual's sentences (ADR 0003).

- [ ] **Step 1: Write the entry**

Replace the whole file with:

````mdx
---
title: string.len()
description: Return the number of bytes in a string.
lua-compat: string.len
entry-type: function
source: https://www.lua.org/manual/5.5/manual.html#pdf-string.len
---

Returns the length of a string in **bytes**. The
[`#` operator](/docs/language/expressions/length-operator) does the same thing and is
what most Lua code uses; `string.len()` exists so the operation is available as a
function too.

<RunnableExample code={`local greeting = "hello"\nprint(string.len(greeting))\n-- Expected output: 5`} />

## Syntax

```lua
string.len(s)
```

<Parameters>
  <Param name="s">The string to measure.</Param>
</Parameters>

<Returns>
  <Return type="integer">The number of bytes in `s`.</Return>
</Returns>

## Description

`string.len(text)` and `#text` return the same number. Neither stops at an embedded
zero byte: a Lua string may contain any byte value, `\0` included, and the length counts
all of them.

## Gotchas

<Gotcha title="Bytes are not characters">
A Lua string is a sequence of bytes with no encoding attached to it, so a UTF-8 string
reports the bytes it occupies rather than the characters it spells — `"café"` is five
bytes, not four. Use [`utf8.len()`](/docs/standard-library/utf8/len) when you mean
characters.
</Gotcha>

## See also

- [`#` length operator](/docs/language/expressions/length-operator) — the same operation, as an operator
- [`utf8.len()`](/docs/standard-library/utf8/len) — counting characters instead of bytes
- [`string.sub()`](/docs/standard-library/string/sub) — taking part of a string
````

- [ ] **Step 2: Verify the matrix is absent**

Open `/docs/standard-library/string/len`. Confirm:
- There is **no** Version support table at the foot of the page.
- The right-rail TOC ends at **Source**, with no Version support item.
- The Source line still renders.
- The example prints `5`.

If a matrix appears, `string.len.json` picked up a `changed_in` entry in Task 9 — check
the data, not the component.

- [ ] **Step 3: Run the suite**

Run: `npm test && npm run types:check`
Expected: PASS, with the content guards green.

- [ ] **Step 4: Commit**

```bash
git add content/docs/standard-library/string/len.mdx
git commit -m "content: write string.len(), the template's floor"
```

---

### Task 14: `string.gsub()` — two return values

The entry that proves **Return values** is a list, not a field. It also carries the
section's most involved Description, because `repl` accepts three different kinds of
value and each behaves differently.

**Files:**
- Modify: `content/docs/standard-library/string/gsub.mdx`

- [ ] **Step 0: Read the manual first**

Run: `cd manuals && python passage.py pdf-string.gsub`

One difference is already known and is what makes this worth doing properly: **5.5
states "if the pattern specifies no captures, then it behaves as if the whole pattern
was inside a capture" once, covering all three forms of `repl`, where 5.1 states the
no-capture fallback separately for the table form and the function form.** Decide
whether that is a wording change or a behavioural one, and whether Task 9's
`string.gsub.json` should carry a note for it.

Then verify the draft's three claims about `repl`: that a string replacement reads `%1`
to `%9` and `%0`, that a table is keyed by the first capture, and that a `nil` or
`false` result keeps the original match rather than deleting it.

Everything below is a **draft**. Where the manual disagrees, the manual wins. Write the
entry in the site's own voice — do not paste the manual's sentences (ADR 0003).

- [ ] **Step 1: Write the entry**

Replace the whole file with:

````mdx
---
title: string.gsub()
description: Replace every match of a pattern in a string.
lua-compat: string.gsub
entry-type: function
source: https://www.lua.org/manual/5.5/manual.html#pdf-string.gsub
---

Returns a copy of a string with every match of a pattern replaced, together with the
number of replacements it made. The original is untouched — Lua strings are immutable.

<RunnableExample code={`local sentence = "the quick brown fox"\nlocal shouted, replacement_count = string.gsub(sentence, "%a+", string.upper)\nprint(shouted)\nprint(replacement_count)\n-- Expected output:\n-- THE QUICK BROWN FOX\n-- 4`} />

## Syntax

```lua
string.gsub(s, pattern, repl [, n])
```

<Parameters>
  <Param name="s">The string to search.</Param>
  <Param name="pattern">The [pattern](/docs/standard-library/string/patterns) to match.</Param>
  <Param name="repl">What each match becomes — a string, a table, or a function. See Description.</Param>
  <Param name="n">The most replacements to make. Omitted, every match is replaced.</Param>
</Parameters>

<Returns>
  <Return type="string">A copy of `s` with the replacements applied.</Return>
  <Return type="integer">How many matches were replaced.</Return>
</Returns>

<Errors>

- Raises `invalid capture index` when the replacement string names a capture the pattern does not have, such as `%2` against a one-capture pattern.
- Raises `bad argument` when `repl` is not a string, number, table or function.

</Errors>

## Description

`repl` decides what each match turns into, and it takes three forms:

- **A string.** Used literally, except that `%1` to `%9` stand for the pattern's
  captures and `%0` stands for the whole match. `%%` is a literal `%`.
- **A table.** The first capture — or the whole match, when the pattern captures
  nothing — is looked up as a key, and the value found there is the replacement.
- **A function.** Called with the captures as arguments; its result is the replacement.

For a table or a function, a result of `nil` or `false` leaves the match **unchanged**
rather than deleting it. That is what makes a lookup table safe against text containing
words it does not know.

The second return value counts matches, not substitutions, so a match left unchanged by
a `nil` lookup still counts.

## Examples

### Filling a template from a table

<RunnableExample code={`local values = { name = "Ada", city = "London" }\nlocal filled = string.gsub("$name lives in $city", "%$(%w+)", values)\nprint(filled)\n-- Expected output: Ada lives in London`} />

### Stopping after a fixed number of replacements

<RunnableExample code={`local shopping_list = "eggs, eggs, eggs"\nlocal corrected, replacement_count = string.gsub(shopping_list, "eggs", "flour", 2)\nprint(corrected)\nprint(replacement_count)\n-- Expected output:\n-- flour, flour, eggs\n-- 2`} />

## Gotchas

<Gotcha title="It returns two values, and print shows both">
`string.gsub()` returns the new string *and* the replacement count. Passing the call
straight into another function hands over both — `print(string.gsub(text, "a", "b"))`
prints the count after the string, and `string.len(string.gsub(...))` measures the wrong
argument. Assign to two locals, or wrap the call in parentheses to keep only the first
value.
</Gotcha>

## See also

- [Patterns](/docs/standard-library/string/patterns) — the notation `pattern` is written in
- [`string.find()`](/docs/standard-library/string/find) — locating a match instead of replacing it
- [`string.gmatch()`](/docs/standard-library/string/gmatch) — iterating over matches instead of replacing them
````

- [ ] **Step 2: Verify every example against what actually runs**

Open `/docs/standard-library/string/gsub`. All three examples run on load. Read each
output pane and confirm it matches its `-- Expected output:` comment exactly, counts
included. Where they differ, the comment is what is wrong.

Confirm **Return values** lists two entries, and that Errors shows no version pill —
neither error is version-scoped.

- [ ] **Step 3: Run the suite**

Run: `npm test && npm run types:check`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add content/docs/standard-library/string/gsub.mdx
git commit -m "content: write string.gsub(), which returns two things"
```

---

### Task 15: Patterns — the concept entry

The fourth fork: an entry with no call to make, so no Parameters and no Return values.

It also turns up the template's one open question. `page-structure.md` says a construct
entry keeps **Syntax** to show its grammatical form — but a pattern is a notation, not a
construct with a form to show, and a `## Syntax` block here would be invented pseudo-Lua.
This entry drops it and puts the notation in tables under Description instead. Task 16
records that as a finding.

**Files:**
- Modify: `content/docs/standard-library/string/patterns.mdx`

- [ ] **Step 0: Read the manual first**

The anchor differs per manual, so run them separately:

```bash
cd manuals
python passage.py 5.4.1 5.1
python passage.py 6.4.1 5.2 5.3 5.4
python passage.py 6.5.1 5.5
```

This is the entry with the most claims per paragraph, and the two tables are the part
most likely to be wrong from memory. Check every row:

- The ten character classes, and that the upper-case form of each is its complement.
- The four quantifiers, and specifically that `-` is lazy rather than a range.
- Whether the manual documents classes the draft omits — `%g` is one to look for, and
  whether it is present in 5.1 — and whether `%f` (the frontier pattern) belongs here.
- The position capture `()`, and what it returns.
- Where `^` and `$` are anchors and where they are ordinary characters.

Anything the five manuals disagree on is a `changed_in` note for
`src/compat/data/string.patterns.json` from Task 9, not a sentence in the prose.

Everything below is a **draft**. Where the manual disagrees, the manual wins. Write the
entry in the site's own voice — do not paste the manual's sentences (ADR 0003).

- [ ] **Step 1: Write the entry**

Replace the whole file with:

````mdx
---
title: Patterns
description: The matching notation Lua's string functions use in place of regular expressions.
lua-compat: string.patterns
entry-type: construct
source: https://www.lua.org/manual/5.5/manual.html#6.5.1
---

Lua has no regular expressions. It has **patterns** — a smaller notation, built into the
language rather than into a library, and read by
[`string.find()`](/docs/standard-library/string/find),
[`string.match()`](/docs/standard-library/string/match),
[`string.gmatch()`](/docs/standard-library/string/gmatch) and
[`string.gsub()`](/docs/standard-library/string/gsub).

<RunnableExample code={`local log_line = "2026-08-05 disk full"\nlocal year, month, day = string.match(log_line, "(%d+)-(%d+)-(%d+)")\nprint(year, month, day)`} />

## Character classes

A class matches one character. The upper-case form of each matches its complement, so
`%D` is any character that is *not* a digit.

| Class | Matches |
|---|---|
| `%a` | a letter |
| `%d` | a digit |
| `%l` | a lower-case letter |
| `%u` | an upper-case letter |
| `%s` | a space character |
| `%p` | punctuation |
| `%c` | a control character |
| `%x` | a hexadecimal digit |
| `%w` | a letter or a digit |
| `.` | any character at all |

A set in square brackets matches any one of its members: `[aeiou]` is a vowel, `[%a_]`
is a letter or an underscore, `[0-9]` is a range. A set starting with `^` is negated —
`[^,]` is anything but a comma.

<Note>
`%` is the escape character, not `\`. To match a literal `.` or `%`, write `%.` and `%%`.
</Note>

## Repetition

A class followed by a quantifier matches a run:

| Quantifier | Matches |
|---|---|
| `*` | zero or more, as many as possible |
| `+` | one or more, as many as possible |
| `-` | zero or more, as **few** as possible |
| `?` | zero or one |

## Captures

Parentheses mark the parts of a match you want back. `string.match()` returns them in
order, and `string.gsub()` offers them to its replacement as `%1` to `%9`.

A capture written as `()` is a **position capture**: it returns the index at that point
in the string rather than any text.

## Anchors

`^` at the start of a pattern anchors the match to the beginning of the string, and `$`
at the end anchors it to the end. Anywhere else, both are ordinary characters.

## Examples

### Trimming whitespace from both ends

<RunnableExample code={`local padded_name = "   Ada Lovelace   "\nlocal trimmed_name = string.match(padded_name, "^%s*(.-)%s*$")\nprint("[" .. trimmed_name .. "]")\n-- Expected output: [Ada Lovelace]`} />

### Splitting a line into fields

<RunnableExample code={`local record = "flour,eggs,butter"\nfor ingredient in string.gmatch(record, "[^,]+") do\n  print(ingredient)\nend\n-- Expected output:\n-- flour\n-- eggs\n-- butter`} />

## Gotchas

<Gotcha title="These are not regular expressions">
Patterns have no alternation — there is no `|` — and no grouping for repetition.
`(ab)+` does not mean "one or more `ab`": the parentheses are a capture, and the `+`
applies to the `b` before it. When you need alternation, match twice, or reach for a
real regex library.
</Gotcha>

<Gotcha title="Outside a set, `-` is lazy, not a range">
`-` is the lazy quantifier, matching as few characters as it can. It is the counterpart
of `*`, not a subtraction and not a range — ranges exist only inside `[ ]`. `".-"`
matching the shortest run it can is exactly what makes `"^%s*(.-)%s*$"` trim correctly.
</Gotcha>

## See also

- [`string.match()`](/docs/standard-library/string/match) — pulling captures out of a string
- [`string.gsub()`](/docs/standard-library/string/gsub) — replacing what a pattern matches
- [`string.gmatch()`](/docs/standard-library/string/gmatch) — iterating over every match
````

- [ ] **Step 2: Give the first example its expected output**

The opening example prints three tab-separated values, and the exact spacing is a thing
to read rather than predict. Open the page, read the output pane, and add the
`-- Expected output:` comment to match.

- [ ] **Step 3: Verify the tables and the examples**

Confirm both markdown tables render, all three examples run and match their comments,
and both Gotchas appear in violet.

Confirm the anatomy test still passes despite this entry having no `## Syntax` — it is
`entry-type: construct`, and the guard checks function entries only.

- [ ] **Step 4: Run the suite and the build**

Run: `npm test && npm run types:check && npm run build`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add content/docs/standard-library/string/patterns.mdx
git commit -m "content: write Patterns, the concept-entry fork"
```

---

### Task 16: Record the slice

**Files:**
- Modify: `docs/plans/ROADMAP.md`
- Modify: `docs/research/page-structure.md`

- [ ] **Step 1: Split slice 2 in the roadmap**

In the status table of `docs/plans/ROADMAP.md`, replace the slice 2 row with:

```markdown
| 2 | Page anatomy — piloted on `string` | [2026-08-05-page-anatomy-string.md](2026-08-05-page-anatomy-string.md) | Done |
| 2.5 | Page anatomy — the rest of `string`, and the bespoke UI | — | Next |
```

Then add this beneath the prose of "### 2. Page anatomy — and the bespoke UI":

```markdown
**Split, 2026-08-05.** The entry template landed first, proven on four `string` entries
— one function with the full skeleton, one with none of the optional sections, one with
two return values, and one concept entry. The remainder — the other sixteen `string`
entries, the constant and overview templates, and replacing Fumadocs's chrome — is
slice 2.5. Authoring twenty entries against an unused template would have put the same
mistake in twenty files.
```

- [ ] **Step 2: Record what the pilot found**

Append to `docs/research/page-structure.md`, after the "## Prototype findings" section:

```markdown
## Pilot findings (2026-08-05)

Four `string` entries built against the real components rather than by hand:

4. **A concept entry has no Syntax block.** The construct fork keeps Syntax "to show the
   grammatical form", which works for `#` or a `for` statement and does not work for
   Patterns: there is no call and no statement, so the block would be invented
   pseudo-Lua. Patterns puts the notation in tables under Description instead. Syntax is
   for entries with a form to quote.
5. **A Gotcha must not name a version.** Finding #1 said version facts drift when
   hand-repeated; the same fact reaching Errors, the Gotcha *and* the matrix is exactly
   that. The dataset carries *when*, through `<Since>` and the matrix; the Gotcha
   carries *what*, undated.
```

- [ ] **Step 3: Verify every link resolves**

Run: `npm run build`
Expected: exit 0.

Then open `/docs/standard-library/string/format`, `/len`, `/gsub` and `/patterns` in the
preview and click every link in each **See also** list, plus the inline links in
Parameters and Gotchas. None may 404.

- [ ] **Step 4: Commit**

```bash
git add docs/plans/ROADMAP.md docs/research/page-structure.md
git commit -m "docs: split slice 2 and record the pilot findings"
```

---

## Deferred

Named here so they are not rediscovered as gaps:

- **The other sixteen `string` entries.** Slice 2.5, and cheap once the template holds.
- **The constant and overview templates.** `string` has no constants, and a section
  overview is a grouped index with its own decisions to make.
- **Replacing Fumadocs's chrome.** The other half of the original slice 2.
- **The version filter and collapse persistence** (ADR 0007). The filter waits on compat
  coverage, and five symbols is not coverage.
- **CI proof that every example still runs.** ADR 0008 rule 6 exists partly to give that
  something to compare against, but the runner belongs to the content-pipeline slice.

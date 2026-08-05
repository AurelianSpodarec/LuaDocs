# Design: page anatomy, piloted on `string`

*The reference-entry template from [page-structure.md](../research/page-structure.md),
built as real components and proven on four entries of the `string` section — one of
each structural fork. The remaining sixteen entries are a later, cheaper pass.*

## Why only four entries

Slice 2 is "page anatomy **and the bespoke UI**". This is the anatomy half, and it is
scoped to one section on purpose: authoring twenty entries against a template nobody
has used yet is how the template ends up wrong in twenty places. `ROADMAP.md` already
makes this argument about plans — "writing them all up front guarantees they go stale
against the codebase" — and it holds for content against a template.

Four entries cover every fork the template has to survive:

| Entry | Type | What it proves |
|---|---|---|
| `string.format()` | function | The full skeleton — parameters, multiple errors, version-scoped errors, gotcha, a matrix with three changed versions |
| `string.len()` | function | The minimum. Unchanged since 5.1, so it proves the **matrix is absent** when nothing varies |
| `string.gsub()` | function | Multiple return values, a function/table/string parameter union, the richest Description in the section |
| Patterns | construct | The skeleton **minus** Parameters and Return values, and a section-length prose entry |

## Scope

In:

- The component set, registered in `src/components/mdx.tsx`.
- The conditional detailed version matrix, and rendered source attribution.
- Compat data for `string.len`, `string.gsub` and Patterns.
- Those four entries, authored.
- [ADR 0008](../adr/0008-example-conventions.md) — how examples are written.
- `math.tointeger`'s example, rewritten to conform. It is the only written example
  outside the pilot, and the examples test runs over all written content — so there
  is no grandfathered tier from the first commit onward.

Out:

- The other sixteen `string` entries, and every other section.
- The constant and overview templates. `string` has no constants, and the section
  overview is its own shape (grouped index) with its own decisions to make.
- ADR 0007's remaining debts — collapse persistence and the version filter. The
  second waits on compat coverage anyway, and four entries is not coverage.
- Search, `llms.txt`, and the contribution surface. Separate slices.

## Where structure lives

**In the MDX body, as headings and components** — not in frontmatter.

The alternative was structured frontmatter (`params:`, `returns:`, `errors:` as YAML)
rendered by the route. It buys schema enforcement and machine-readable output, and it
costs three things that work today:

- The right-rail TOC is extracted from MDX headings. Frontmatter sections would need
  synthetic entries spliced into the array.
- `llms.txt` is `page.data.getText('processed')` — the body only. Parameters in
  frontmatter would silently vanish from it.
- The `.md` route (`src/routes/docs/{$}[.]md.ts`) serves that same body.

MDN is also prose plus conventions rather than a schema, and this site is modelled on
MDN. What frontmatter would have enforced, a content test enforces instead — see
**Verification**.

## Three zones

Top to bottom, and who owns each:

**Route, above the body** — already built. Breadcrumb, title, description, the
copy/view row, the version support strip, the change note.

**The MDX body** — authored:

1. Summary (one or two sentences, no heading)
2. The quick runnable example
3. `## Syntax`, with `<Parameters>`, `<Returns>`, `<Errors>` beneath it
4. `## Description`
5. `## Examples`
6. `## Gotchas`
7. `## See also`

**Route, below the body** — new. The detailed version matrix, then Source.

### The one deviation from page-structure.md

That document orders the detailed matrix at 9 and See also at 10. This design swaps
them: **See also is last in the body, and the matrix renders after it.**

The matrix is derived entirely from the compat node. Putting it above See also means
either an author hand-placing a `<VersionMatrix />` in all 292 entries — data
pretending to be prose, and a thing to forget — or moving See also into frontmatter,
which contradicts the decision above. Grouping both derived blocks at the bottom costs
one position in an ordering that was never load-bearing.

`page-structure.md` gains an amendment note, in the shape ADR 0006 already uses.

## Components

New feature folder `src/entry/`, following `src/version/`, `src/sidebar/`,
`src/runner/`.

| Component | Renders |
|---|---|
| `<Parameters>` / `<Param name>` | A `<dl>`; the name in mono, the description as prose |
| `<Returns>` / `<Return type>` | The same, plural by default — Lua returns multiple values, so this is a list even when there is one |
| `<Errors>` / `<Error since>` | A list; `since` draws a version chip, reusing the support strip's chip styling so one visual language covers both |
| `<Note>`, `<Warning>`, `<Gotcha>` | The three callouts page-structure.md allows, and no more |

`<Gotcha>` gets its own visual identity rather than being a variant of `<Note>`.
CONTEXT.md calls it "a first-class callout" and "LuaDocs's signature callout"; a
callout that looks like a Note is a Note.

**Every H2 a reader sees is a real markdown heading** — `## Syntax`, `## Description`,
`## Examples`, `## Gotchas`, `## See also`. None of them is a component, because the
TOC is extracted from the MDX headings and a component's heading is invisible to it.
Components handle only what sits *below* H2, which the H2-only TOC never lists anyway.

That leaves the two route-rendered blocks with no TOC entry, so the route splices them
in: `[...toc, 'Version support', 'Source']`. Without it the right rail claims the page
ends at See also while two sections follow.

**Syntax is a plain ` ```lua ` fence, not a component.** It is code, fumadocs already
highlights fences at build time through `rehype-code`, and it would be the first
fenced block anywhere in `content/` — a path with no coverage at all today.

Two pieces stay with the route, because both are derived rather than authored:

- **`VersionMatrix`** lands in `src/version/`, beside `VersionSupportStrip`, reading
  the same `CompatNode`. It renders **only when a version actually varies** — a
  bounded availability or a non-empty `changed_in`. On `string.len` it is absent,
  which is prototype finding #2: on an unchanged entry the matrix only restates the
  strip above it.
- **`EntrySource`** reads the `source` frontmatter every entry already carries.

## Source attribution

No new data. `source` is generated for all 292 entries from `Source { version,
anchor }` in `src/content-tree/manifest.ts`; nothing has ever rendered it.

The anchors were verified against the 5.5 manual's own contents list: §6.5 String
Manipulation, §6.5.1 Patterns, §6.5.2 Format Strings for Pack and Unpack, and
`pdf-string.format` for functions. All correct.

**The rendered line must name the manual version, not just link to it.** Lua 5.5 added
§6.1, "Loading the Libraries in C code", which shifted the whole chapter — String
Manipulation is §6.4 in the 5.4 manual and §6.5 in 5.5. A bare "source" link invites
the reader to assume the anchor is stable across versions, and it is not. This is the
same fact ADR 0006 relies on when it refuses to order the sidebar by manual section
number.

So: *Rewritten from the Lua 5.5 reference manual, §6.5.1.*

## Examples

[ADR 0008](../adr/0008-example-conventions.md) carries the rules. In summary: names
are spelled out and `snake_case`, never a local shadowing a standard library or type,
realistic data over `foo`/`bar`, every example self-contained, expected output as a
trailing comment, and non-runnable examples marked.

The Syntax line is the exception to spelling out — it quotes the manual's own
parameter names (`formatstring`, `···`), because those are the documented API surface
and not ours to rename.

## Verification

- `tests/entry/` — the components render what they are given, and `<Error since>`
  draws its chip.
- `tests/version/version-matrix.test.tsx` — present when a version varies, **absent**
  when none does.
- `tests/content/entry-anatomy.test.ts` — over every *written* entry, skipping stubs:
  a `function` entry has `## Syntax`, `<Parameters>` and `<Returns>`; every entry's
  `source` frontmatter matches what the manifest generates for it. This is what
  replaces a schema, and it is why structure-in-MDX is safe at 292 entries. It is the
  same idea as `tests/content-tree/committed-tree.test.ts`, which already checks the
  committed tree against the manifest.
- `tests/content/examples.test.ts` — ADR 0008's rules 1 and 3, over every
  `<RunnableExample>` in written content: no single-letter identifiers, and no local
  shadowing a global the standard library defines. Rules 2, 4 and 5 — type-named
  locals, realism, self-containment — are judgement and stay human review.

`npm test`, `npm run types:check` and `npm run build` pass at the end of every task.

## Consequences

- The template is proven against four entries and will change before the other
  sixteen are written. That is the point of piloting; the anatomy test is what makes
  the change cheap to propagate.
- `content/` gains its first fenced code block, so the MDX code-block path — and the
  `fd-card` surface it renders on — is exercised for the first time.
- Compat data grows from two symbols to five. Still not coverage: the version filter
  (ADR 0007) stays deferred.
- `page-structure.md` carries an amendment, and `ROADMAP.md` gains a row splitting
  slice 2 into the anatomy pilot and the bespoke-UI remainder.

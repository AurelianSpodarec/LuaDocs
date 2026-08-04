# Roadmap

The ordered list of slices. Each slice gets its own detailed plan file **written just
before it is executed** — writing them all up front guarantees they go stale against
the codebase. This file is the only place that looks further ahead than the current
slice.

A slice is done when its plan's final GATE passes and the work is on `main`.

## Status

| # | Slice | Plan | Status |
|---|-------|------|--------|
| 1 | Version slice — prove the risky stack on one page | [2026-08-04-version-slice.md](2026-08-04-version-slice.md) | Done |
| — | **Spike:** per-version Lua runtimes | [2026-08-04-per-version-lua-spike.md](2026-08-04-per-version-lua-spike.md) | Parked — see below |
| 1.5 | Content tree — the blueprint | [2026-08-04-content-tree.md](2026-08-04-content-tree.md) | Done |
| 1.6 | Sidebar IA — order, grouping, labels | [2026-08-04-sidebar-ia.md](2026-08-04-sidebar-ia.md) | Done |
| 2 | Page anatomy | — | Next |
| 3 | Content pipeline | — | Not started |
| 4 | Search + `llms.txt` | — | Not started |
| 5 | Playground | — | Not started |
| 6 | Per-version Lua runtimes | — | Not started |
| 7 | Contribution surface | — | Not started |
| 8 | Deploy | — | Not started |

## The slices

### 1. Version slice — prove the risky stack on one page

Static-prerendered Fumadocs-on-TanStack-Start, custom UI, compat-data-driven version
switching, and a real Wasmoon runnable example, using `string.format` as the vehicle.
Proves feasibility, not completeness.

### 1.6. Sidebar IA — order, grouping, labels

Implements [ADR 0006](../adr/0006-sidebar-order-and-grouping.md). Slice 1.5 built the
tree but let `meta.json`'s `"..."` glob sort it alphabetically, and listed each
section's overview as its own child — so `string` sat below `package`, and opening
Standard Library gave you Standard Library again.

The sidebar now carries the curated order, one row per section, fully-qualified
titles with parentheses on callables, and MDN-style collapsible groups. The group is
**our node, not Fumadocs's**: its `separator` is flat and cannot collapse, so the
tree transform in `src/sidebar/groupPageTree.ts` folds each separator and the items
after it into an index-less `PageTree.Folder`, which renders as a collapse trigger
that is not a link. A section may also end with a `Related globals` group —
cross-linked rows whose pages stay in `Globals`, because `table.setmetatable` does
not exist.

Scoping was deferred at first and then pulled in, because it turned out not to be
optional. With every Section listed, navigating silently expanded one and collapsed
another, with no chevron to explain it — so the sidebar now shows one Section at a
time, exactly as MDN does. See the amendment in ADR 0006.

### 2. Page anatomy — and the bespoke UI

Replaces Fumadocs's theme with our own chrome, which the version slice deferred
(see the amendment on [ADR 0005](../adr/0005-platform-fumadocs-on-tanstack-start.md)).

The shell is decided in [ADR 0007](../adr/0007-documentation-shell.md): a sidebar
destinations block above the tree, the text filter between them, version in the header
with theme and language, and no context bar. It also names three things this slice
owes that the sidebar work left open — scrolling the active entry into view, collapse
persistence that stores only explicit clicks, and the deferred version filter.

The full reference-entry template from
[page-structure.md](../research/page-structure.md): syntax block, parameters, return
values, the Note/Warning/Gotcha callout set, source link to the original manual, and
the lighter template variant for constants. Includes the conditional compat matrix
(prototype findings #2/#3), which the version slice deliberately deferred.

### 3. Content pipeline

What it takes to author entries at volume rather than one at a time: sidebar
generation from the page-tree (the section/entry tree itself landed early —
see slice 1.5), authoring conventions for base+delta content
([ADR 0001](../adr/0001-single-canonical-docs-with-version-deltas.md)),
compat-data coverage checks in CI, and Vitest-in-CI verification that every runnable
example actually runs. Blocks any serious porting effort.

### 4. Search + `llms.txt`

Fumadocs's static search index and static `llms.txt` generation — the plumbing
[ADR 0005](../adr/0005-platform-fumadocs-on-tanstack-start.md) picked Fumadocs for.
Must be the static path, not `Accept`-header negotiation: there is no server
([ADR 0004](../adr/0004-self-hosted-on-github-no-third-parties.md)).

### 5. Playground

The standalone full-page editor: CodeMirror 6 with real Lua syntax highlighting,
shareable state in the URL, and the same worker-plus-timeout runner the inline
examples use. Also the natural point to swap the version slice's `<textarea>` and
native `<select>` for CodeMirror and Base UI (`@base-ui/react`).

### 6. Per-version Lua runtimes

Wasmoon ships one Lua version (5.4). Running an example "as 5.1" requires our own
WASM builds per minor line, plus the loader that picks one from the selected version.
The single largest unknown left after the version slice — and the one the version
slice did **not** prove, so it is being spiked before the slices above it.

**Decision, 2026-08-04: parked. The site runs Lua 5.4 for every selected version, and
says so in the UI.**

It was briefly sequenced ahead of everything else on the grounds that it was the
largest unretired risk. That was wrong, for three reasons:

- **The runtime is swappable.** It lives entirely behind `runLua(code, opts)` in
  `src/runner/runLua.ts` and `src/runner/luaWorker.ts`. No other module knows Wasmoon
  exists. Going from one runtime to five later touches those two files plus a loader.
- **The load-bearing risk was the version *system*, and that is proven** — one
  canonical entry plus compat-data deltas driving per-version rendering out of static
  output. Runtime fidelity sits on top of that, not under it.
- **Research narrowed it without building anything** (see the spike plan's "What we
  already know"): Wasmoon's WASM build is version-agnostic, the per-version cost is an
  exported-symbol list plus binding shims, and 5.3/5.4/5.5 are nearly free. Probably
  feasible; not urgent.

The honest cost of parking it: examples execute 5.4 semantics whatever the reader
selects. `RunnableExample` discloses this inline rather than hiding it.

**Bring it forward when** any of these becomes true: a reader-facing complaint about
wrong output; enough 5.1/5.2-specific entries that static-only examples there are a
real gap; or Emscripten is already installed for another reason, making the spike
cheap. The plan is written and ready to run.

### 7. Contribution surface

"Edit this page" → PR, feedback → prefilled GitHub Issue, the dual-license LICENSE
file and footer ([ADR 0003](../adr/0003-dual-license-prose-and-code.md)), and
contribution terms that match it.

### 8. Deploy

GitHub Actions build + deploy of the static output. Host is deliberately open
([ADR 0004](../adr/0004-self-hosted-on-github-no-third-parties.md)); the output is
static, so this is a late, cheap decision.

**Blocked on content:** slice 1.5 left 291 entries as empty stubs. Deploy must not
ship them — either they are authored, or the build filters unwritten entries out of
the sidebar, search index and `llms.txt` first.

## Deliberately unscheduled

- **Guides and the Learn path** — depend on the content pipeline; sequence once
  Reference entries exist in volume.
- **"Lua in the wild" survey** and **LuaRocks/ecosystem guide** — single Guides,
  cheap, no dependencies ([ADR 0002](../adr/0002-scope-standard-lua-only.md)).
- **Blog** — optional, explicitly deferred.
- **Sentiment metric (👍/👎)** — parked; did not clear the "is this worth a backend?"
  bar (ADR 0004).

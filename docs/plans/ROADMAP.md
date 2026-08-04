# Roadmap

The ordered list of slices. Each slice gets its own detailed plan file **written just
before it is executed** — writing them all up front guarantees they go stale against
the codebase. This file is the only place that looks further ahead than the current
slice.

A slice is done when its plan's final GATE passes and the work is on `main`.

## Status

| # | Slice | Plan | Status |
|---|-------|------|--------|
| 1 | Version slice — prove the risky stack on one page | [2026-08-04-version-slice.md](2026-08-04-version-slice.md) | In progress |
| 2 | Page anatomy | — | Not started |
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

### 2. Page anatomy

The full reference-entry template from
[page-structure.md](../research/page-structure.md): syntax block, parameters, return
values, the Note/Warning/Gotcha callout set, source link to the original manual, and
the lighter template variant for constants. Includes the conditional compat matrix
(prototype findings #2/#3), which the version slice deliberately deferred.

### 3. Content pipeline

What it takes to author entries at volume rather than one at a time: the section /
entry tree and sidebar generation from the page-tree, authoring conventions for
base+delta content ([ADR 0001](../adr/0001-single-canonical-docs-with-version-deltas.md)),
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

Wasmoon ships one Lua version. Running an example "as 5.1" requires our own WASM
builds per minor line, plus the loader that picks one from the selected version. The
single largest unknown left after the version slice.

### 7. Contribution surface

"Edit this page" → PR, feedback → prefilled GitHub Issue, the dual-license LICENSE
file and footer ([ADR 0003](../adr/0003-dual-license-prose-and-code.md)), and
contribution terms that match it.

### 8. Deploy

GitHub Actions build + deploy of the static output. Host is deliberately open
([ADR 0004](../adr/0004-self-hosted-on-github-no-third-parties.md)); the output is
static, so this is a late, cheap decision.

## Deliberately unscheduled

- **Guides and the Learn path** — depend on the content pipeline; sequence once
  Reference entries exist in volume.
- **"Lua in the wild" survey** and **LuaRocks/ecosystem guide** — single Guides,
  cheap, no dependencies ([ADR 0002](../adr/0002-scope-standard-lua-only.md)).
- **Blog** — optional, explicitly deferred.
- **Sentiment metric (👍/👎)** — parked; did not clear the "is this worth a backend?"
  bar (ADR 0004).

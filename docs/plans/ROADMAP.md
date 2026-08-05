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
| 2 | Page anatomy — piloted on `string` | [2026-08-05-page-anatomy-string.md](2026-08-05-page-anatomy-string.md) | Done |
| 2.5 | Page anatomy — the rest of `string`, and the bespoke UI | — | Next |
| 3 | Content pipeline | — | Not started |
| 4 | Search + `llms.txt` | — | Not started |
| 5 | Playground | [2026-08-05-playground.md](2026-08-05-playground.md) | Done |
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

**Split, 2026-08-05.** The entry template landed first, proven on four `string` entries
— one function with the full skeleton, one with none of the optional sections, one with
two return values, and one concept entry. The remainder — the other sixteen `string`
entries, the constant and overview templates, and replacing Fumadocs's chrome — is
slice 2.5. Authoring twenty entries against an unused template would have put the same
mistake in twenty files.

**Owed an ADR: `<Return type="integer">` before 5.3.** `integer` is correct for the
base, which is written against the default version, and weakening it to `number` would
make an entry wrong for 5.3–5.5 in order to be right for 5.1 and 5.2. It nonetheless
names a subtype those two versions do not have. It was raised on two of the four pilot
entries and will reach every entry returning a count or an index, and none of the three
delta forms — availability bound, change note, example variant — can express it, so it
cannot be settled per entry without settling it twenty times. The proposal is one
site-wide behaviour: the `<Return>` renderer surfaces a standing footnote when the
**selected version** is 5.1 or 5.2, linking to the numeric-types entry. One
implementation, no authoring cost, correct everywhere at once. Slice 2.5 owns it, and
owes the ADR before the next entry returning a count is authored.

**Owed to the content pipeline: the `.md` route and `llms.txt` degraded.** Both serve
the MDX body, and the page-anatomy slice changed what the body holds. Examples are now a `RunnableExample`
component taking its Lua in a `code` prop, so the two text surfaces carry a program as an
entity-escaped JSX attribute rather than as readable code. The version matrix and the
manual citation are rendered by the route rather than authored into the body, so the
markdown copy of an entry carries no version data and no attribution at all —
`page.data.getText('processed')` never sees either. This is not cosmetic:
[ADR 0008](../adr/0008-example-conventions.md) rule 6 keeps the expected-output comment
specifically because "the prerendered page, the `.md` route, and `llms.txt` are all
read", and one of those three is now unreadable. Slice 3 owns it, alongside the CI
verification that every runnable example still runs.

**Owed to CI: the link check must run against build output, not the dev server.** The
dev server answers every path with the same 200 SPA shell — nonsense routes included —
so a crawl of it can never 404 and would pass over a wholly broken set of links. The
site prerenders, so the check belongs after `npm run build`, over `.output/public`,
where a missing page is a missing file. Worth having: entries cross-link heavily in
`## See also` and in prose, and most of those targets are still unwritten stubs today,
so the first real check will have a backlog to work through.

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
examples use.

**Built out of order, 2026-08-05**, ahead of slice 2.5. It depends on nothing 2.5 owns,
and the two touch different files.

Tailwind Play was the reference and three of its choices were deliberately not copied —
see the plan. The short version: its 50/50 split is earned by a rendered page where Lua
output is a transcript, so the divider drags and remembers; it has no Run button because
CSS compilation always terminates and `while true do end` does not; and its version chip
swaps the compiler where ours cannot, so ours is pinned to 5.4 and disabled.

**The playground has no selected version.** It documents nothing, so no version chooses
any content on it. It neither reads nor writes `SelectedVersionProvider`: the control
states the runtime, and the disclosure compares against `DEFAULT_VERSION` — now derived
from `LUA_VERSIONS` in `src/compat/schema.ts` rather than written out a second time in the
provider. The header is a wordmark and nothing else — not a back button, and not a link:
most readers arriving on a shared link were never in the docs, so "back" named a direction
they had not come from, and a title that navigates is a control wearing a label's clothes.
The way into the docs is the way into the playground, the sidebar destinations block
([ADR 0007](../adr/0007-documentation-shell.md)).

The load-bearing feature is not the editor, it is the seam: every inline example carries
an **Open in Playground** link that hands over the reader's *current* buffer, edits
included, in the URL hash. No server, nothing stored, nothing to rot
([ADR 0004](../adr/0004-self-hosted-on-github-no-third-parties.md)).

**Tidy re-indents; it does not pretty-print.** A formatter needs a parser and moves
comments, which [ADR 0008](../adr/0008-example-conventions.md) rule 6 cannot afford. The
re-indenter needs only a lexer, touches leading and trailing whitespace and nothing else,
and preserves the line count so a reported error line stays valid.

**Still owed:**

- **The Base UI select swap.** Slice 5 was called "the natural point" for it; it is not
  playground work. `VersionSwitcher` is site-wide and tested, and replacing it belongs
  with the rest of the chrome in slice 2.5. The playground reuses it as it stands.
- **A theme toggle.** The playground escapes the docs chrome, and the toggle went with
  it. Theme follows whatever the docs were left on, which is right until someone opens
  the playground first.
- **Version-aware linting** — flagging `//` as 5.3+, `goto` as 5.2+, `setfenv` as
  5.1-only from the compat data already in `src/compat/`. This is what would make the
  switcher mean something before slice 6, and `src/playground/lexLua.ts` was built with
  it in mind.
- **Multiple files and `require`**, which needs a virtual filesystem and a
  `package.searchers` shim in the worker.
- **A bytecode drawer**, the honest analogue of Play's "Generated CSS" panel. It needs a
  Lua 5.4 bytecode disassembler, because `string.dump` returns a binary chunk.

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

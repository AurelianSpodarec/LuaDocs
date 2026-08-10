# Roadmap

The ordered list of slices. Each slice gets its own detailed plan file **written just
before it is executed** — writing them all up front guarantees they go stale against
the codebase. This file is the only place that looks further ahead than the current
slice.

A slice is done when its plan's final GATE passes and the work is committed on `dev`.
Nothing in this repository is merged into `main` — see `CLAUDE.md`. The definition used to
say "on `main`"; that was never how this repository worked, and slices were being marked
Done against a condition nothing would ever meet.

## Status

| # | Slice | Plan | Status |
|---|-------|------|--------|
| 1 | Version slice — prove the risky stack on one page | [2026-08-04-version-slice.md](2026-08-04-version-slice.md) | Done |
| — | **Spike:** per-version Lua runtimes | [2026-08-04-per-version-lua-spike.md](2026-08-04-per-version-lua-spike.md) | Parked — see below |
| 1.5 | Content tree — the blueprint | [2026-08-04-content-tree.md](2026-08-04-content-tree.md) | Done |
| 1.6 | Sidebar IA — order, grouping, labels | [2026-08-04-sidebar-ia.md](2026-08-04-sidebar-ia.md) | Done |
| 2 | Page anatomy — piloted on `string` | [2026-08-05-page-anatomy-string.md](2026-08-05-page-anatomy-string.md) | Done |
| 2.5 | `string` section — the remaining sixteen entries | [2026-08-05-string-section.md](2026-08-05-string-section.md) | Done |
| 2.6 | `table` and `math` sections | [2026-08-05-table-and-math.md](2026-08-05-table-and-math.md) | Done — see below |
| 2.6.1 | `globals` section | [2026-08-06-globals.md](2026-08-06-globals.md) | Done — see below |
| 2.6.2 | The remaining six libraries | [2026-08-06-remaining-libraries.md](2026-08-06-remaining-libraries.md) | Done — see below |
| 2.7 | The bespoke UI — replacing Fumadocs's chrome | — | Not started |
| 3 | Content pipeline | — | Not started |
| 4 | Search + `llms.txt` | — | Not started |
| 5 | Playground | [2026-08-05-playground.md](2026-08-05-playground.md) | Done |
| 6 | Per-version Lua runtimes | — | Not started |
| 7 | Contribution surface | — | Not started |
| 8 | Deploy | [2026-08-07-url-migration.md](2026-08-07-url-migration.md) — the migration half only | Not started |

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

**Amended 2026-08-07: it is contradictory, not merely incomplete, and the UI exposing it
has been removed.** Reading a real body rather than reasoning about the pipeline turned
up the sharper failure: `<Only before="…">` and `<Only since="…">` both survive into the
export, adjacent and unlabelled. So `error()`'s markdown states that `nil` reaches a
catcher as `nil` and then states that it does not, with nothing saying which version
either sentence belongs to. "No version data" understates it — a reader or a model gets
version data that is false.

Fumadocs's page-actions row — Copy Markdown, plus a popover holding View as Markdown,
Open in GitHub and four AI deep links — is therefore **deleted from the entry page**
rather than left pointing at that. Handing a model a self-contradictory export, on a
site whose premise is being right about versions, is worse than offering nothing:
nothing on screen tells the reader what was exported, and a clipboard cannot carry a
caveat. Open in GitHub was the one sound item and duplicated "Improve this page" in the
provenance panel ([ADR 0011](../adr/0011-the-foot-of-an-entry.md)).

**Slice 3 restores Copy Markdown when the export is trustworthy, and only that.** It is
the item worth having, and worth more here than on most documentation sites — version
confusion is exactly what a model gets wrong about Lua, so an export that carries the
deltas is the fix for a real failure. The four vendor deep-links do not come back:
Copy Markdown does the same job without betting the page's chrome on which AI products
still exist in two years. The `.md` route and `llms.txt` themselves stay live throughout
— this removes the affordance, not the surface, and slice 4 still needs them.

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

**It is also a migration.** Deploy takes over `www.luadocs.com` from the old site
rather than standing up somewhere new, so it owes the sixty-nine permanent redirects,
the sitemap, `robots.txt` and canonicals in
[ADR 0012](../adr/0012-legacy-url-migration.md). Two things that ADR settles which
this slice would otherwise decide badly: the host is no longer fully open — it must
issue real 301s, which rules out bare GitHub Pages — and the sitemap's
authored-entries-only predicate is the same one the stub filter above needs, so they
are one piece of work and not two.

**Its own content gate is four pages.** Sixty-two of the sixty-six distinct redirect
targets are authored today; the exceptions are the `io`, `os`, `package` and `debug`
section overviews, still 8-line stubs, whose old counterparts are live and indexed.
Until they are written, four 301s land on an empty page.

## Deliberately unscheduled

- **Guides and the Learn path** — depend on the content pipeline; sequence once
  Reference entries exist in volume.
- **"Lua in the wild" survey** and **LuaRocks/ecosystem guide** — single Guides,
  cheap, no dependencies ([ADR 0002](../adr/0002-scope-standard-lua-only.md)).
- **Blog** — optional, explicitly deferred.
- **Sentiment metric (👍/👎)** — parked; did not clear the "is this worth a backend?"
  bar (ADR 0004).
- **Translations, prioritised by analytics.** Once the site is deployed and there are
  readership numbers, translate in the order the analytics support. The candidate
  languages:

  🇷🇺 Russian · 🇨🇳 Simplified Chinese · 🇧🇷 Portuguese · 🇵🇱 Polish · 🇮🇹 Italian ·
  🇪🇸 Spanish · 🇯🇵 Japanese · 🇩🇪 German

  The analytics decide the order and how far down the list to go. Locale routing does
  not exist yet, so the content pipeline (slice 3) is the cheap moment to leave room
  for it.

## `string` is finished (2026-08-05)

All twenty entries are authored: sixteen functions, two concepts (Patterns, Format
strings for pack and unpack) and the section overview. It is the first complete section,
and the proof that the template survives contact with a whole library rather than four
hand-picked entries.

What the section cost, and what it bought:

- **Twenty entries needed 6, 5, 9, 11 and more corrections against the manuals**, several
  of them flatly false rather than stylistic. [ADR 0010](../adr/0010-entries-are-written-from-the-manual.md)
  is the rule that catches them and the evidence for why it exists.
- **Three template forks now have a built example**, not just a specification: the
  function fork, the concept fork (findings #4, #9) and the overview fork (#9, #10).
  `table` and `math` follow these rather than the original spec lines, which carry
  in-place amendments saying so.
- **Five guards** now hold the section: entry anatomy, ADR 0008's mechanical example
  rules, every example executed against its expected output, an overview's index against
  its directory, and change notes against unbalanced markup.

Two things the section surfaced that are **not** content problems and are owed elsewhere:

- **The index and See-also lists make no per-entry version claim.** The sidebar dims an
  entry the selected version does not have; a link in an overview's body does not. The
  route already loads the map that would fix it. Slice 3 or the version-filter work.
- **`math.tointeger` is an unwritten stub no slice claims.** It was reverted during the
  anatomy pilot rather than authored, and `math`'s own slice should pick it up.
  *(Discharged — authored in slice 2.6.)*

## `table` and `math` are finished (2026-08-06)

Both sections are complete: `table` is twelve entries plus its overview, `math` is
thirty-five plus its overview. Forty-nine entries in twelve authoring batches, every one
reviewed adversarially and every one needing a fix round — two of them needing two —
seventeen Criticals in all, and on the order of a hundred recorded corrections against the
manuals. The detail lives in the batch reports under
`.superpowers/sdd/2026-08-05-table-and-math/`; what follows is what outlives them.

### Removal: which axis decides that a symbol is gone

`math` has eight symbols that leave, and three plausible axes give three different answers —
whether a manual gives the symbol its own *entry*, whether the manual *mentions* it at all,
or whether a build from the shipped makefile *has* it. They are not close: a stock 5.3
provides `math.pow` behind a compatibility switch its manual never names.

The ruling, which every removal after this one inherits: **a version has the symbol if and
only if that version's manual says something that asserts its existence. Deprecation asserts
existence; silence does not. `version_removed` is the first version whose manual stops
mentioning the symbol at all.** So `math.log10` leaves at 5.3, and the other seven at 5.4 —
one line later than the entry count suggests, because 5.3's Incompatibilities chapter names
all seven in a single sentence, and any ruling that splits that sentence is incoherent on its
face.

`table` reached the same answer on `table.maxn` and never had to defend it: there, only the
manual axis supported it. `math` is where two axes agreed and the rule had to be stated
generally rather than decided per symbol. Its accepted cost is unchanged from `maxn`: a stock
build keeps these symbols alive one line further than the dataset says, and the dataset
deliberately does not record what is a property of a makefile rather than of a Lua version.

The failure asymmetry is what decided it. Read the other way, the site tells a reader on 5.3
that a function they can call does not exist — the same trap that produced a Critical in the
`table.unpack` batch.

### `version_restored`, for the two that came back

`math.frexp` and `math.ldexp` are documented in 5.1 and 5.2, absent from 5.3 and 5.4, and
documented again in 5.5. A pair of bounds is one half-open interval, so both encodings it
allowed said something false about two of the five lines. `src/compat/schema.ts` gained one
optional field, `version_restored`, plus four cross-field ordering checks — `.strict()`
catches a misspelled *key*, and this field's characteristic mistake is a bad *value*, which
parses cleanly and then renders as "available in all five".

An interval list was the alternative and was refused: it gives an ordinary entry two spellings
of one fact, and every existing dataset would have had to move or the two spellings would
drift. It cannot express a symbol that leaves twice, and nothing in 5.1–5.5 does.

Nothing downstream needed changing, which is the part worth carrying forward: `resolve.ts`
derives availability by walking the version list through `isAvailable` rather than by reading
the bound fields, so a third bound was free on every surface that displays one. The surfaces
that *were* reading the bounds second-hand were wrong before this and are fixed — a removed
entry used to be described as "introduced in 5.1" on a version that had dropped it, and a
removed sidebar row used to carry a `5.1+` badge asserting the availability its own dimming
denied. `+` now means exactly one thing: this version and every one after it.

### The constant fork: a heading, not a component

Settled as `## Value` carrying prose, with no `## Syntax`, no `<Parameters>`, no `<Returns>`
and no `<Errors>`. No `<Value>` component: what the section carries is one or two paragraphs
whose useful content differs completely between the four constants, not a list of rows the way
`<Returns>` is, and a component taking arbitrary children plus a type is an H2 with extra
syntax. `entry-anatomy.test.ts` asserts the shape, including the *absence* of `## Syntax` —
the section a function-shaped copy leaks in first.

ADR 0009's numeric disclosure was considered for the Value section and deliberately not added.
`maxinteger` and `mininteger` are unavailable on the two lines where the word `integer` would
be anachronistic, so a reader there already meets the availability callout, a dimmed sidebar
row and suppressed examples — strictly more than a footnote would give them. `pi` and `huge`
are floats, and a float is anachronistic nowhere. The gap ADR 0009 covers is closed for
constants by availability rather than by a type field. The case that would reopen it, a
constant that is an integer *and* present on 5.1, does not exist in the standard library.

### The overview fork, now proven on three sections

`string` invented it, `table` made it a fork, `math` is where it stopped being a copy job. The
shape is settled: summary before the example, common-patterns example, task-grouped index in
H2s, `## See also`. Three rules the two later sections added:

- **Groups are authored by task and their membership is a judgement**, not the directory order
  and not the sidebar's. `math`'s eight groups run three to eight entries; the right rail is
  H2-only, so a `###` sub-index renders as one navigable word and is not available.
- **Symbols that left the library get their own final group**, glossed by what to write
  instead, and are never mixed into a task group — but *only* the ones that stayed gone.
  `math` is the case that proves it: a legacy group holding `frexp` and `ldexp` would be
  simply false for a reader on the newest line, so those two sit with the float-inspection
  functions, where they are true at both ends of the range.
- **A version qualification in a gloss is spent where the absence changes the advice**, not
  wherever an entry is missing from some line. `math` spends two, on the pair whose
  availability a reader cannot infer from anything else on the page. The rest of what varies
  in `math` varies with the integer subtype, which the summary and the group lead-ins explain
  once.

### What kept going wrong, and the one check that catches it

Across all ten batches the version reasoning held. What failed, over and over, was an
**unqualified prose generalisation in an entry whose specifics were already correct** — a
summary, a Gotcha or a `<Return>` body stating flatly what the Description forty lines away
had qualified properly, and often refuted by the entry's own example six lines above. In four
consecutive batches the Criticals moved no compat dataset at all.

Neither an end-to-end re-read nor an adversarial review catches this class reliably. One thing
does: a **mechanical sweep for absolutist words** — `every`, `always`, `never`, `all`, `any`,
`cannot`, `none`, `no`, `only`, `exactly`, `identical` — followed by reading each hit against
that entry's own Description and its own examples. It is a different operation from reading
for sense, which is why it finds what reading for sense does not. It has found defects an
adversarial review had already looked at and missed, in five separate batches.

**The sweep must include `<Return>`, `<Param>` and `<Errors>` attribute bodies, not only
prose paragraphs.** Two Criticals in one batch sat in `<Return>` bodies that the prose-only
sweep never read — which is where they would be, since a `<Return>` body is one sentence
trying to cover every case at once and is the least re-read line on the page. Any section
after this one should run the sweep as the last step before committing, and treat it as part
of authoring rather than as review.

### Debts this slice logged and did not solve

- **No version-conditional form exists for Syntax, Parameters or Returns.** `<Since v="…" />`
  is licensed on an `<Errors>` bullet and has no counterpart anywhere else, and two entries
  ship wrong because of it: `math.randomseed` renders a Return-values list for two returns it
  does not have on three of the five lines, and the constant fork has nowhere to put a
  `<Since>` at all, because a constant has no `<Errors>`. Both forks ran into the same gap
  from opposite directions. This wants a human and a decision, not a workaround.
- **An overview's index still makes no per-entry version claim** while the sidebar beside it
  dims what the selected version lacks — the same debt `string` logged, now on three pages.
  The editorial rules above narrow it and do not remove it. The fix is component work and the
  route already loads the map (`compatByUrl`): render each index bullet through it and mark a
  link the selected version lacks the *same way the sidebar marks it*, same treatment and same
  vocabulary. It must be derived; hand-written badges go stale.

  **It would not retire the third rule above, and the next overview author should not plan as
  though it will.** The fix can only mark what the selected version *lacks*, and the two
  glosses on `math`'s page that most needed qualifying — `math.log()`, whose base argument
  arrived later, and `math.atan()`, whose second argument arrived later still — are on entries
  present on all five lines. Nothing about them is dimmable; only their *arity* moved. So the
  rule survives in reduced form: a gloss still needs a hand-written qualification wherever what
  changed is what a call accepts rather than whether it exists. That is the same root cause as
  the first debt in this list — the site can say "this argument arrived later" nowhere except
  an `<Errors>` bullet — and fixing that one would retire more of the rule than the badge work
  would.
- **No mechanism gates an example on another entry's availability.** `RunnableExample` gained
  a per-example `usesEntry` prop this slice — auto-run had been keyed on the entry rather than
  on the example, so on a removed entry every card showing the *replacement* sat silent for
  exactly the readers it was written for. The prop fixes that and can still only ask about
  *this* entry. A card that depends on a symbol from another entry, or on a `changed_in`,
  needs the example-variant delta form, which nothing has built yet.
- **A printed long transcendental decimal is an assertion about the runtime's libm, not about
  Lua.** It bit three times in `math` — two runtimes disagreeing in the sixth significant
  figure, and 26 mismatches in one probe that a second runtime showed none of. Nothing records
  this outside one paragraph on `sqrt.mdx`; it belongs in the authoring context.
- **Two expected outputs assume 64-bit integers.** Standard Lua, but a `LUA_32BITS` build
  prints differently and nothing on the site says so. Site-wide; `math` is where it first bites.
- **`string/format.mdx` phrases a claim by error-message text**, which the rules forbid — found
  in passing, outside this slice's files, and left for whoever edits that entry next.

## The standard library is finished (2026-08-10)

All ten sections are written: `string` 20, `table` 13, `math` 36, `globals` 32, `coroutine` 9,
`utf8` 7, `os` 12, `io` 22, `package` 11 and `debug` 19 — **181 entries**, each with its own
compat dataset, and 739 runnable examples all executed against their expected-output comments on
every run of the suite. Every entry was written from the five manuals with a batch report beside
it, adversarially reviewed, and fixed. The detail is in
`.superpowers/sdd/2026-08-05-table-and-math/`; what follows is what outlives it.

**One stub is left under `content/docs/standard-library/`, and it is the front door**:
`standard-library/index.mdx`, the chapter's own page. It is not a section overview — it would
index ten sections rather than nineteen entries, `overview-index.test.ts` does not apply to it,
and nothing in these slices claimed it. It belongs with the top-level navigation work.

### Three things built during the later sections that the `table`/`math` debts asked for

- **`<Only since="…" before="…">` scopes a Syntax line, a `<Param>` or a `<Return>` to a version
  range** (`src/version/versionScope.ts`). This discharges the first debt logged above — there
  was no version-conditional form for anything but an `<Errors>` bullet, and two entries shipped
  wrong because of it. `since` is inclusive and `before` exclusive, so a pair is an exact
  complement. It **shows and hides and renders no chip**: the dataset's `changed_in` already
  reaches the reader on the support strip, in the inline note and in the matrix, and a chip would
  be a fourth telling in a second voice. `<Parameters>` and `<Returns>` decide their heading from
  what survives scoping, so a version with no returns no longer renders an empty Return-values
  block. `debug.setmetatable` is the worked example: a `<Return type="boolean">` before 5.2 and a
  `<Return type="any">` from it, the exact complement, verified in the browser both ways.
- **`tests/content/fragment-links.test.ts` checks every in-repo `#anchor` link.** The
  shared-rule-owner convention — one entry owns a rule under a named H2 and everyone else links
  to it — produced cross-page fragment links that nothing verified, and retitling one heading
  broke every link to it *silently*: no test failed, no build error, the link simply landed at
  the top of the page while the sentence went on promising a section by name. Sixteen entries
  point at `math.floor#which-subtype-comes-back` alone. The guard runs the real MDX compiler and
  the real heading plugin rather than reimplementing the slug rule, because a hand-written regex
  would pass links the reader finds broken.
- **`version_restored`** is described under `table` and `math` above and needed nothing further.

### The absolutist sweep grew two more legs, and they are where the defects were

The sweep recorded above is one leg: read each hit against the entry's own Description and
examples. The later sections added two, and by the end the split was not close.

2. **Read the hit against the manual passage the clause depends on.** This is the commonest
   Critical in the whole effort: a claim entirely consistent with its own page and false against
   the manual. Roughly half the Criticals found, and *every one of them passed leg 1*.
3. **Read the hit against the entry's own `changed_in`** — including any register that borrows a
   fact belonging to *another* entry's dataset, which is the shape that hides best. A
   `file:flush` page carrying no `changed_in` of its own asserted that `file:write` hands the
   file back, which is false on the oldest line, with no surface anywhere on that page to date
   it. A borrowed fact arrives without the surface that dates it.

Two refinements worth carrying: **a See-also gloss and an index gloss are component bodies for
all three legs** — structurally the most exposed register on any page, because a gloss states a
fact whose dated surface lives on someone else's page, and two Criticals shipped there — and
**when leg 3 fires once on an entry, re-run it over every component body on that entry**, because
a batch that caught the shape twice in one `<Errors>` list stopped there and shipped a third
instance in a `<Return>` body of the same file.

### Two more page forks, both built and both with worked examples

- **The method fork** (`io/file-read.mdx` and six siblings). These document methods on a file
  handle rather than functions in a table; their manual anchors are `pdf-file:read`, and five of
  the seven have a same-named library function that is **not** the same call. Each pair is two
  entries, not one, and each pair's two pages say where they part.
- **The rename fork** (`package/loaders.mdx` against `package/searchers.mdx`). One list under two
  spellings. It is not the removal fork — nothing was replaced, so "what to write instead" is the
  same object under a different name — and it is not two entries about two different things
  either. The older spelling carries the removal bounds and the explanation of the change; the
  newer carries the behaviour.

### The removal ruling held everywhere, and its shorthand would not have

The ruling stated under `table` and `math` — *a version has the symbol iff that version's manual
says something asserting its existence; deprecation asserts existence, silence does not* — was
applied to `globals`' five departures, `package`'s two and `debug`'s two, and needed no
amendment. **The forbidden shorthand** ("the first version whose manual does not mention the
symbol at all") would have been wrong twice: `loadstring` and `module` have no anchor in the 5.2
manual and are named there as *deprecated*, so the shorthand puts them out a whole line early.
One paragraph of an Incompatibilities chapter can carry three different verbs for five symbols;
read it verb by verb.

The one place it is worth recording the evidence rather than the rule: `debug.getfenv` and
`debug.setfenv` are removed by **silence**, not by 5.2 §8.2. That sentence is about the basic
library's pair and §8.3's is about the C API's; the `debug` pair is absent from `ldblib.c` from
`v5.2.0` on, with no compatibility switch on any line, and that is the evidence.

### The overview fork after ten sections

Settled, and nothing strained it: group counts from three to nine, group sizes from one to eight,
and a legacy group on exactly five of the ten. Three additions to what is recorded above:

- **A one-bullet H2 is allowed.** Prefer a pairing; ship a singleton rather than a forced pair,
  because a junk-drawer heading is not a task and the reader loses the scent.
- **A section whose own preamble is thin should look one level up.** `globals` took its defining
  fact from the chapter preamble, because the Basic Functions preamble is four lines about C
  hosts in every manual.
- **The index and the sidebar can be made to agree, and it is worth aiming at.** On `debug` all
  eighteen rows agree at every version: the two removals are quarantined in the legacy group and
  dimmed from 5.2, and the four arrivals carry "on the lines that have it" and are dimmed on 5.1
  and nowhere else. `globals` managed the same. `table` left three plain bullets beside dimmed
  rows and `math` five.

### Debts still open

The `table`/`math` list above still stands except for its first item, which `<Only>` discharged.
Four more, all logged rather than solved:

- **A card cannot be scoped to a version.** `<Only>` hides a card from a reader, but
  `examples-run.test.ts` executes every card in the tree regardless of scoping and compares it
  against its comment — so an example that uses a version-scoped feature *of its own entry* still
  has to record the runtime's output, and a card wrapped in `<Only before="5.4">` is not a
  solution to anything. Three sections hit this from different directions and each worked around
  it with a non-runnable fenced listing. What is wanted is the example-variant delta form.
- **An overview's index still makes no per-entry version claim.** Unchanged from above, now on
  ten pages, and the editorial rules narrow it without closing it.
- **The compat schema cannot state a value *at* `version_added`.** `_VERSION` is the case:
  `changed_in` carries its 5.2, 5.3, 5.4 and 5.5 strings and there is nowhere to put the 5.1 one,
  so the value a reader on the oldest line wants is derivable from the pattern and stated
  nowhere. Every note the schema holds is a *change*, and the first value of anything is not one.
- **Thirteen C-API and language pages are empty stubs, and much of `debug`'s subject matter
  belongs on them.** `c-api/debug-interface.mdx` is where `lua_getinfo`, `lua_Hook`,
  `lua_getlocal` and `lua_getupvalue` are documented — for several `debug` entries that C-API
  passage *is* the manual source, and 5.4 and 5.5 point it back at `debug.getupvalue`.
  `c-api/references-and-registry.mdx`, `c-api/userdata.mdx`, `language/metatables/metatable.mdx`
  and `language/garbage-collection/finalizers.mdx` are the others that will overlap heavily. Two
  facts have no owner at all today: the 5.2 rule that a userdata's finalizer must already be in
  the metatable when it is attached, and where `__metatable` is actually defined.

### What it cost

Roughly 4–6 entries an hour was the handoff's estimate and it held. Every batch of every section
needed a fix round. What kept failing was never the version reasoning and almost never the
research: it was an unqualified prose generalisation in an entry whose specifics were already
right. The sweep is the answer, it is cheap, and it belongs to authoring rather than to review.

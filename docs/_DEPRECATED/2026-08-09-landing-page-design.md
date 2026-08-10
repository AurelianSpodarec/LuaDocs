# The landing page

*What `/` holds, in what order, and why. The surface was decided in
[`surface-expansion.md`](../../research/surface-expansion.md#landing); the evidence
behind the reference sites is in
[`site-surfaces.md`](../../research/site-surfaces.md) §1. Vocabulary is in
[`CONTEXT.md`](../../../CONTEXT.md), the shell rules in
[ADR 0007](../../adr/0007-documentation-shell.md), the no-backend rule in
[ADR 0004](../../adr/0004-self-hosted-on-github-no-third-parties.md).*

Today `/` is a heading and one button ([src/routes/index.tsx](../../../src/routes/index.tsx)).
The marketing shell around it already exists — `marketingOptions()` in
[src/lib/layout.shared.tsx](../../../src/lib/layout.shared.tsx) and
[src/marketing/Footer.tsx](../../../src/marketing/Footer.tsx) — and this spec does not
change either.

## Who the page is for

Two readers, wanting opposite things:

- **The searcher.** Arrived from a query for `string.format` or "lua sort table by
  value". This is the majority, permanently, and they want a way in immediately.
- **The referred reader.** Was told "look at luadocs". They want to know why this
  exists next to lua.org's manual.

The reference homepages surveyed in `site-surfaces.md` §1 — fumadocs.dev, astro.build,
bun.com, vite.dev — all run the same spine: hero and install command → social proof →
differentiator sections each carrying a *number* or a *code sample* → final CTA. That
spine is built for a third reader, the one being sold a product they have not heard of,
and that reader barely visits a documentation site for a thirty-year-old language.

**Two consequences follow, and they shape every section below.**

First, **the site sells Lua and it sells itself, and those are different pitches.** We
do not own Lua. Astro can write a slogan for Astro; we do not get to write one for
someone else's language, and a page that tries reads as speaking with an authority the
project has not got. The "why Lua" material is therefore one short factual beat, not the
hero.

Second, **the social-proof slots cannot be filled honestly.** There are no testimonials,
no adopters of *LuaDocs*, no benchmark, and a star count would be both small and, under
ADR 0004, either a build-time number that rots or a third-party fetch we do not make.
Every one of those slots is dropped rather than faked. What replaces them is
demonstration: the two things this site has that no other Lua site has are the version
machinery and a Lua runtime in the browser, and both can be shown working on the page
instead of described.

## The shell

Unchanged. `HomeLayout` with `marketingOptions()` — Documentation, Playground, Blog,
with search, theme and GitHub on the right — and `Footer` at the foot. Libraries joins
that row when it is a route, per the comment already in `layout.shared.tsx`.

**The header carries no version switcher.** The landing page documents nothing, so
nothing on it has a selected version — the same reasoning that keeps the switcher off
the playground. The one component that needs a version owns a local one; see §2 below.

## The sections, in order

### 1. Hero — the search field, not a slogan

An H1 stating what the site is, one sentence of positioning, the version range in plain
words ("Lua 5.1 through 5.5"), and a **real search input** with three example queries
beneath it (`string.format`, `pcall`, `metatables`). Two secondary links: Open the
reference, Open the Playground.

MDN's front door is essentially a search box, which is the right instinct for a lookup
site and matches the reader who actually arrives.

**The input is real, not a decoy that opens the dialog.** It renders results in a panel
below itself using the same `useDocsSearch` + `staticClient` pair that
[src/components/search.tsx](../../../src/components/search.tsx) already uses, and the
same Fumadocs list primitives, so there is one search implementation and not two.

**The static index is fetched on first focus or first keystroke, never on page load.**
It is the largest asset the site has, and the landing page is the one page most visitors
bounce off; paying for the index before anyone types is the wrong default.

A result click goes to the entry. There is no `/search` results route and this spec does
not add one.

### 2. The live entry — a demonstration in the differentiator slot

Where astro.build puts a Core Web Vitals chart and bun.com puts a benchmark, this page
puts a working miniature of a real entry with a version switcher wired to it. Flipping
5.4 → 5.1 visibly rewrites the page and relights the version support row.

**`math.frexp` is the subject.** It is documented in 5.1 and 5.2, absent from 5.3 and
5.4, documented again in 5.5 — the entry `version_restored` was added to the schema for.
A reader who moves the control sees availability appear, vanish and return in five
clicks, which states the site's whole premise without a sentence of copy. `table.unpack`
is the fallback if a simpler story reads better in the space.

Under the miniature, one line of prose and a link through to the full entry.

**The demo holds its own version state and must not touch the global one.** This is the
load-bearing constraint of the section. `SelectedVersionProvider` is mounted in
[__root.tsx](../../../src/routes/__root.tsx), so it wraps this page, and its `setVersion`
writes `localStorage` *and* rewrites `?v=`. Wired to the global provider, a visitor
playing with a marketing widget would silently repoint every docs page they later open.
A toy does not get to set a persistent preference.

The mechanism: **`VersionSupportStrip` gains an optional `version` prop**, and falls back
to `useSelectedVersion()` when it is absent. Every existing call site is unchanged; the
demo passes its own `useState` value. This is preferred over mounting a second provider,
which would still persist on `setVersion` and would need a non-persisting variant to be
written — more code for a worse boundary.

### 3. The Playground, live and prefilled

An editor with a program already in it and a Run button, not a link to one. This is the
surface a first-time reader is most likely to stay for.

It sits second rather than in the hero because the hero belongs to search, and the
searcher outnumbers everyone else.

**It is a cut-down embed, not the `/playground` route.** `Playground` in
[src/playground/Playground.tsx](../../../src/playground/Playground.tsx) is `h-dvh`, owns
its own header, and carries Share, Reset, Tidy, layout modes and a resizable divider —
none of which belong in a page section. The embed is a new component over the same
`Editor` and the same `runLua`, with an editor pane, an output pane, Run, and an "Open in
Playground" link that hands over the reader's current buffer through the existing
`hashForProgram` seam. Nothing new is invented; the two share the runner and the editor,
not the chrome.

It carries the same runtime disclosure the playground does — this runs Lua
`RUNTIME_LUA_VERSION`, output may differ from `DEFAULT_VERSION` — for as long as slice 6
is parked. Sitting a few hundred pixels under a widget that switches versions, an
undisclosed 5.4-only runtime would be actively misleading.

### 4. The map — a directory, not a feature grid

Cards for the site's areas: Reference, Guides, Learn, Installation, Libraries,
Playground. Each gets one honest line and, where the number means something, a derived
count — "*n* entries across `string`, `table` and `math`", with *n* counted, never
typed.

This replaces the "Fully Featured" grid the reference sites run, and it doubles as the
page's internal linking.

**It is generated from what exists, never from the roadmap.** The manifest already
carries the predicate: `CONTENT_TREE` entries have a `hidden` flag, and `ROOT_PAGES` in
[src/content-tree/manifest.ts](../../../src/content-tree/manifest.ts) is already
"non-hidden areas only". Cards come from that list. Counts come from counting entries
whose body is not `PLACEHOLDER`
([src/content-tree/scaffold.ts](../../../src/content-tree/scaffold.ts)) — the same
authored-vs-stub question slice 8 owes for the sitemap, and it should be one predicate in
one place, used by both.

This is the section that lies most easily. A card for Libraries while Libraries is not a
route is exactly the dead front-door link `layout.shared.tsx` already refuses in the nav.

### 5. Why not just read the manual

Four rows, in our voice, no snark: the manual is the specification, this is the reference
you read at work. One page per version against per-symbol permalinks; no examples against
runnable ones; no search; no cross-links.

It closes by stating that every entry links back to the manual it was written from. That
is [ADR 0010](../../adr/0010-entries-are-written-from-the-manual.md) shown rather than
claimed, and it is a credibility move, not a concession — the comparison is only fair
coming from a site that cites its source on every page.

**Tone is a hard constraint here.** The project depends on lua.org, rewrites its manual,
and links to it from every entry and from the footer. The section describes two different
jobs; it does not grade the manual.

### 6. Who uses Lua — a strip of names

Wikipedia · Neovim · Redis · OpenResty · LÖVE · Adobe Lightroom · Factorio · World of
Warcraft · Grim Fandango. Links through to the "Lua in the wild" guide.

**Text, not logos.** Logos mean trademark permission per holder, tens of megabytes of
committed assets, and a curation queue — the Astro showcase in `site-surfaces.md` §2
costs 151 MB of permanent git history for exactly this. Names as text cost nothing and
rot slowly.

`surface-expansion.md` already settled that this is a strip and not a gallery: lua.org
publishes a rotating showcase and a `uses.html` that hands off to Wikipedia, so a LuaDocs
gallery would be the third such surface. This strip exists to orient a first-time reader,
not to be the definitive list, and it should say so in its own heading.

### 7. Why Lua — one short factual beat

MIT-licensed. The whole interpreter is a few hundred kilobytes. Designed and still
maintained by the same three people at PUC-Rio since 1993. The default answer when a
program needs an embedded language.

One paragraph and three numbers. Short enough to be obviously honest, and the only place
the page speaks about Lua rather than about the site.

### 8. Foot

The existing `Footer`, unchanged. It already carries GitHub, the dual-licence statement
ADR 0003 requires, the non-affiliation line, and the upstream "Support Lua" link that
belongs in the footer rather than in the nav.

No final CTA band. The hero is a search field and the page has offered four ways in
already; a "Get started" strip at the bottom of a reference site's homepage is cargo from
a product-marketing template.

## Data, and what is allowed to be hardcoded

**Derived at build time:** every count, and the list of area cards. A hand-written "90
entries" is the same rot that the library entries' last-reviewed dates exist to prevent,
and it is wrong the first time a section lands.

**Authored:** the prose, the example queries, the names strip, the manual comparison, the
"why Lua" numbers. These change on human timescales and a build step over them would be
machinery for nothing.

**Fetched at runtime:** nothing. ADR 0004.

## Deliberately absent

Testimonials and star counts — none exist, and a build-time star count rots. Sponsor
wall — the site takes no money. Benchmark chart — nothing to benchmark, and the honest
comparison is against a static HTML manual. Newsletter signup — needs a backend.
Showcase gallery — lua.org's is the second one already. An animated install terminal —
there is no `npm create luadocs`, and installing *Lua* is a version-aware section, not a
hero prop.

## Open questions

- **Whether the hero search shows results inline or opens the existing dialog.** The spec
  chooses inline, on the grounds that a landing-page input that opens a modal on the
  first keystroke is a jump-scare. If the dialog's list primitives turn out not to render
  outside `SearchDialogContent`, the fallback is the dialog carrying the typed query over.
- **What the map section shows for an area with no route yet.** Omit it entirely (the
  nav's rule) or show it unlinked with "in progress"? Omission is the safer default and is
  what this spec assumes.
- **Whether the live-entry demo animates on scroll into view.** It demonstrates nothing
  if the reader never touches the control, and it is patronising if it moves by itself.
  Not decided.

## Sequencing

Sections 1–4 are the first cut: they run entirely on machinery that already exists —
search client, compat data, editor, runner, manifest — and they are what the two readers
above actually came for. Sections 5–7 are prose and can land after, incrementally,
without a second design pass.

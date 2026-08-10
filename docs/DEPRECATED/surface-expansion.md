# LuaDocs — Beyond the reference

*What the site grows into past Reference and Playground, and why. The vision is in
[`luadocs-idea.md`](luadocs-idea.md); the v1 feature inventory is in
[`luadocs-features.md`](luadocs-features.md); the primary-source evidence behind
these surfaces is in [`site-surfaces.md`](site-surfaces.md). Vocabulary lives in
[`CONTEXT.md`](../../CONTEXT.md), decisions in [`docs/adr/`](../adr/).*

## Where this came from

LuaDocs was scoped as reference entries plus a Playground. Readers have asked for
more than that — most concretely for a list of the libraries and frameworks people
actually use. This document records what the site takes on beyond the reference,
what each thing costs, and where each one sits against the existing ADRs.

Some of it is already anticipated in the content tree. `guides/history-of-lua`,
`guides/lua-in-the-wild` and `guides/luarocks-and-the-ecosystem` exist today as
stubs marked *Not yet written*, and `learn/` is an empty section. The question for
those three is not whether they exist but whether each stays a single guide or
grows into a section of its own.

## The surfaces

### Landing

A front page that explains what Lua is, who uses it, and why it is worth caring
about, in the manner of a project home page rather than a documentation index.
Today the front door is the content tree, which sells nothing to a reader arriving
cold.

Static, authored once, no ongoing cost. It carries the Playground above the fold
and a short strip of well-known users, which is the cheap form of a showcase: a
run of names, not a submissions gallery. The full gallery form is the expensive
version and is not worth running a review queue for.

That judgement is reinforced by something the research turned up: **lua.org
already publishes a showcase**, rotating a different selection daily, alongside a
`uses.html` that deliberately hands off to Wikipedia and community lists. A
LuaDocs gallery would be the third such surface rather than the first, which is a
poor return for a permanent curation commitment. A strip of names on the landing
page is a different thing — it is there to orient a first-time reader, not to be
the definitive list.

### Libraries and frameworks

The surface readers asked for. It is a destination of its own, not entries mixed
into the standard library tree: Libraries joins the block of destinations at the
top of the sidebar that [ADR 0007](../adr/0007-documentation-shell.md) rule 2
already defines, and selecting it swaps the tree beneath. This needs no new
mechanism. The standard library tree has one job, which is to answer what is
actually in Lua, and that answer stops being legible the moment `LÖVE` sits beside
`string.format`.

Inside the section, two kinds of thing are kept apart:

- **Runtimes and dialects** — LuaJIT, Luau, Ravi. These are documented as
  divergences from the standard Lua the site already defines, which is the same
  delta reasoning pointed sideways instead of backwards.
- **Libraries and frameworks** — LÖVE, OpenResty, Penlight and so on, grouped by
  what they are for: game development, web and networking, testing, data and
  serialization, utility, CLI.

Each library entry mirrors the reference entry anatomy: what it is in one
paragraph in our own words, when a reader would reach for it, its install line, a
runnable example where the code is pure Lua, links out to repository and
documentation, and **version support** showing which Lua versions it works on.
That last row is the part no existing list has, and it is machinery the site
already owns.

Every library entry carries a last-reviewed date. Staleness is what kills
directories, and a visible date makes the rot self-reporting rather than silent.

**Cost.** This is the only surface here with a permanent human cost, and the
research removed the cheap alternative rather than confirming it. **LuaRocks has
no public read API** — every `/api/1/*` route is gated behind a key, and the one
machine-readable artefact is a 4.4 MB manifest carrying names, versions and
architecture only, with no description, licence or homepage. Richer metadata means
one rockspec fetch per module, across roughly 5,350 of them. There is no feed
either, so there is nothing to watch for changes. `awesome-lua` is not a fallback:
GitHub reports it as unlicensed, and it was last pushed in August 2024.

So hand curation is not the expensive option chosen over an automated one. It is
the only option there is. That settles the shape: a small number of libraries with
a real paragraph each, not a generated index. Google's own spam policies put the
test on per-page editorial value rather than page count, which is the same fact
seen from the other side — the thing that makes a directory rank is exactly the
thing that makes it expensive.

**Tension.** [ADR 0002](../adr/0002-scope-standard-lua-only.md) scopes the site to
standard Lua. A libraries section is a deliberate, reader-driven exception to that
scope, and the ADR should be amended to say so rather than quietly contradicted.
The runtimes-and-dialects framing is the part that sits most comfortably inside the
existing scope, since it is defined relative to standard Lua.

### Installation

A version-aware section covering what lua.org does not: installing Lua per
platform, verifying it, installing LuaRocks, running several versions side by
side, and editor setup.

It follows the same contract as every entry under
[ADR 0010](../adr/0010-entries-are-written-from-the-manual.md) — read the official
material, write it in our own words, carry a source link back. The difference is
that lua.org has no real Windows or macOS story, so those parts are not a rewrite
but original documentation, which is also the most valuable part of the section.

The version switcher applies here as it does everywhere else: selecting 5.3
changes the commands shown. The thing that makes this section age is that package
channels drift — each one ships whichever Lua line it ships — so every channel
must state the version it actually gives you, and that statement needs
re-checking.

**The drift is worse than "needs re-checking" suggests, and that is the argument
for the section.** Across the channels surveyed, what a reader gets today spans
2018 to last week: Chocolatey ships 5.1.5 from 2018; winget has no `Lua.Lua` at
all, only `DEVCOM.Lua` at 5.4.6; Homebrew has dropped both `lua@5.3` and
`lua@5.1`; Arch, Homebrew and MSYS2 are at 5.5.1. Of the version managers,
`luaver` is the most-starred and has not been committed to since 2017 without
being archived. A reader following the top search result for their platform has a
real chance of installing a seven-year-old Lua without being told. Nobody
documents this, and it is exactly what a version-aware install section is for.

### History, and the versions hub

`guides/history-of-lua` is already reserved. The larger opportunity is the guide
that fuses history with the version model: the 5.1 through 5.5 story, what changed
in each line and why, with every change linking into the entries where the delta
is already recorded.

That guide is simultaneously the narrative history, the migration reference, and
the answer readers are looking for when they compare two versions. It is also the
one piece of writing here that no one else could produce, because it depends on
having the deltas.

### Learn, and curated material

`learn/` exists as an empty section. It holds the **learn path** — an ordered
curation of existing guides — and alongside it a curated list of primary material:
the books, the papers on Lua's evolution, and recorded talks by Lua's authors.

This is one authored list, revisited occasionally, not a database with a
submissions flow. Note that embedding video players pulls in a third party on page
load, which [ADR 0004](../adr/0004-self-hosted-on-github-no-third-parties.md)
rules out; links with self-hosted thumbnails stay within it.

### Blog

The editorial surface: release coverage as it lands, per-version "what changed"
write-ups, talk round-ups, project notes.

The constraint worth holding is that task-shaped writing ("split a string", "sort
a table by value") belongs in guides, not posts. Those are the highest-intent
queries the site can answer and they want one evergreen home; publishing both a
guide and a post on the same task means the two compete and both do worse. The
blog links into evergreen material rather than duplicating it.

A blog is cheap to build and expensive to sustain. Three posts and a long silence
reads worse than no blog at all, so it is worth starting only when there is
something to say on a regular beat.

### Supporting Lua upstream

Outbound links only, pointing at whatever support channel lua.org itself
publishes, plus a plain credit to the institutions behind the language. The site
takes no money and runs no button of its own — it is built on someone else's
manual, and the acknowledgement belongs upstream. This pairs with the per-entry
source link as the same instinct applied at site level.

**The channel exists and is concrete.** `lua.org/donations.html` routes through
Software in the Public Interest, confirmed on SPI's own site, with book proceeds
named as a second channel. What makes the link worth carrying is that lua.org's
homepage does not link to it: a reader who wants to support Lua is unlikely to
find it unaided.

## Two shells, and where the new surfaces are reached from

Fumadocs puts Documentation, Blog, Showcase and Sponsors in its navbar. That is a
marketing navbar for a product that needs adoption and funding, and it is the
arrangement [ADR 0007](../adr/0007-documentation-shell.md) already refused: rule 5
keeps the navbar to controls, and rule 1 puts destinations in the sidebar.

Nothing here reopens that. Instead the site has **two shells**:

- **The documentation shell**, unchanged. Libraries, Learn and Installation are
  destinations in the sidebar block; the navbar keeps its controls. History is not
  a destination — it is a guide inside Documentation, and giving it top-level
  weight would misstate its size next to destinations that own whole trees.
- **A marketing shell** for the pages that sit outside the tree — landing and
  blog. These have no sidebar and no content tree, so they carry a conventional
  header of links instead. This is the shell that resembles the Fumadocs
  screenshot, and it is the right place for that arrangement.

  Its nav is four items — **Documentation, Playground, Libraries, Blog** — with
  search, theme and GitHub on the right. Playground sits second because it is the
  surface a first-time reader is most likely to stay for, and the one no other Lua
  site offers. Showcase is absent because the landing page *is* the showcase; an
  anchor to that strip is fine, a peer destination is not. History is absent
  because it is a single guide inside Documentation. Supporting Lua is in the
  footer, for the reason below.

  The two shells do not nest. Following **Documentation** leaves the marketing
  header behind and enters the documentation shell; the wordmark is the way back.
  The marketing nav is not persistent site chrome, which is what keeps it from
  turning into one overloaded bar serving two different sites.

Supporting Lua upstream is a footer link in both, never a destination. It points
away from this site to someone else's channel, and top-level placement would read
as the site asking on its own behalf.

## Mods and modding ecosystems

Raised, and deliberately not taken on here. Roblox, WoW addons, Factorio and the
rest are each a non-standard dialect with its own API surface, which is precisely
what [ADR 0002](../adr/0002-scope-standard-lua-only.md) exists to keep out; and a
directory of them is a freshness commitment the site cannot honour without a
server, given [ADR 0004](../adr/0004-self-hosted-on-github-no-third-parties.md).

It is a reasonable product. It is a different one.

## What this adds up to

Reference, Libraries, Guides, Learn, Installation, Playground, Blog. Every one of
those except Libraries runs on machinery the site already has. Libraries is the
one that costs continuous human attention, and it is taken on because readers
asked for it rather than because it was cheap.

Worth naming plainly: this is three things sharing a domain — a reference, an
interactive runtime, and an editorial and ecosystem surface. The first two share
their machinery. The third shares nothing but the shell and needs a person
tending it indefinitely.

## Open questions

- Does the sidebar switcher between Reference and Libraries belong in the sidebar
  itself or in the site header? This is a
  [`page-structure.md`](page-structure.md) question, not settled here.
- [ADR 0002](../adr/0002-scope-standard-lua-only.md) needs amending to admit the
  libraries section, and its wording should draw the line clearly enough that
  modding ecosystems stay out.
- The vocabulary in [`CONTEXT.md`](../../CONTEXT.md) covers entries, sections and
  guides but has no term for a top-level area of the site. If Libraries and
  Reference are peers, they need a name.
- Whether a library entry's version support can be established reliably enough to
  publish, or whether it has to be stated as "tested against" rather than claimed.
- What the review cadence is for library entries and installation channels, and
  who does it.

## Source outage, noted

lua.org was unreachable while this was written (both the site root and the manual
timing out, with luarocks.org responding normally from the same machine). It is
worth recording that the upstream this project rewrites is a single point of
failure with no obvious mirror, which is an argument for the site existing and a
risk to the entry-writing process that depends on reading it.

## A vendored copy of the manual

The response to that outage is to keep every version's manual in the repository:
5.1 through 5.5, committed, so that writing entries never depends on lua.org being
up. The manual ships inside the Lua source distribution, so the copies come from
the distribution rather than by scraping the site.

Two things this is not:

- **It is not a new download surface.** The site does not become a place to get
  Lua. The vendored manuals exist for authoring and as a fallback target, and the
  installation section keeps sending readers to the official downloads.
- **It does not change attribution.** The `source:` link on an entry points at
  lua.org, because that is where the entry came from and attribution names the
  origin, not the most reachable copy. A fallback is offered next to it and
  labelled as an archived copy, never silently swapped in.

This sits well with
[ADR 0004](../adr/0004-self-hosted-on-github-no-third-parties.md), which already
prefers content the project holds itself over content fetched from elsewhere at
read time.

**The licence question is settled and the answer is yes.** Every shipped
`doc/manual.html`, 5.1 through 5.5, carries its own notice placing it under the
Lua licence, which is MIT — the grant comes from the manual itself, not from
lua.org's licence page, and Debian's ftp-master review independently declared the
whole tarball including `doc/` to be Expat. Three conditions follow, all recorded
with sources in [`site-surfaces.md`](site-surfaces.md) §11:

- The vendored copy keeps the manual's own copyright line and its link to the Lua
  licence, and carries the MIT text alongside.
- What gets vendored is the whole `doc/` directory from each release tarball, not
  `manual.html` alone — the stylesheets ship beside it and the document does not
  render without them.
- The tarballs come from a distributor's archive and are checked against lua.org's
  published checksums. `github.com/lua/lua` is authentic but is not a substitute:
  it carries `manual/manual.of`, the source markup, rather than the rendered
  manual, and has no tags for 5.1.5 or 5.2.4.

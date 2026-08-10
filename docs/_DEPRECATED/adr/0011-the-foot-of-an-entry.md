# The foot of an entry

Below an entry's last authored section, the page carries **three derived blocks and
nothing else**: the version matrix, the source citation, and a provenance panel. There
is no previous/next pair.

Four rules:

1. **The source citation is one link.** The manual name and the passage name point at
   the same place, so they are one anchor. Sentence punctuation stays outside it.
2. **Provenance is one panel, and it is the last thing on the page.** Review status,
   last-updated stamp and the two contribution links render together, bordered, from
   one component.
3. **The panel carries no heading and is not in the right rail.** `Source` above it
   stays an addressable section; the panel is not one.
4. **A reference entry has no previous/next.** Fumadocs's page footer is disabled site-wide.
   It returns only where a curated reading order exists — Learn — and never in Reference.

## Why

### The citation's specific half was the dead half

`sourceUrl` already carries the anchor: `…/manual.html#pdf-error` goes to `error`, not to
the top of the manual. The line rendered as *the [Lua 5.5 reference manual] — error*, with
only the bracketed span inside the `<a>`. So the generic half — true of all 292 entries —
was clickable, and the half naming the passage the reader wants was plain text sitting
next to it, pointing nowhere despite being exactly what the href resolves to.

That is not a judgement call about hit areas. It is one destination described by one
phrase, and it was split for no reason beyond how the JSX happened to be nested.

"The" and the full stop stay outside. They belong to the sentence rather than to the
citation, and a link that swallows its own trailing period reads as a typo — the
underline extends past the last word and looks like a mistake in the prose.

### What MDN's box is actually made of

MDN's "Help improve MDN" panel was the reference for this end of the page, and it does
**three** things inside one border: an ask (a 👍/👎 survey and a contribute link),
provenance (last modified, by whom), and two exits (view on GitHub, report a problem).

The border is earned almost entirely by the ask, because that is the part with
interactive controls in it — and the ask is precisely the part this site is not
building. [ADR 0004](0004-self-hosted-on-github-no-third-parties.md) has no backend to
receive a vote, and the roadmap parked the sentiment metric for exactly that reason. So
copying the box wholesale would have drawn a border around the two jobs we do have,
which is decoration.

The border is kept anyway, on a different justification: **rule 4 removed the page's
ending.** Previous/next was the terminal anchor, and without it an entry stopped on a
grey line of metadata with nothing saying the article was over. A panel ends a page
without inventing a sequence to do it — which is the one structural job MDN's box does
that survives the removal of its survey.

Two smaller things are taken and one is refused:

- **The exits get their own line**, as MDN's do, instead of trailing the status
  sentence.
- **The date is a link**, where MDN's names an actor ("by MDN contributors"). Ours is
  derived from git, so the commits behind it are a real page a reader can open; *what
  changed* is the question a date raises, and an unverifiable byline is the weaker half
  of that trade.
- **The illustration is refused.** A decorative SVG on 292 pages is weight, and it is
  warmth this reference is not reaching for.

The one thing MDN's panel does not say at all is whether anybody has read the page.
That is the most load-bearing sentence at the foot of an entry here, so it leads.

### Two related facts were rendered as two unrelated widgets

Review status is an icon plus a sentence, so its text begins indented by the icon's
width. The last-updated stamp was a sibling of that whole unit, so it began at the
container's left margin — **level with the icon, not with the words above it**. A ragged
left edge between two lines that describe the same page is enough on its own to make them
read as unrelated chrome.

The fix is placement, not styling. `EntryProvenance` renders both, so the alignment
follows from the structure. `LastUpdated` and `ReviewStatus` stay separate components
with their own tests: how vetted and how old are different questions, and the day one of
them grows it should grow without touching the other.

The stamp had previously been pinned right with `ms-auto`, which was worse than either:
the gap between the two grew with the viewport, until on a wide screen the date read as
belonging to the page frame rather than to the entry.

### The citation is about Lua; the panel is about this website

These are not the same kind of fact, which is why they are not merged into one
"About this page" section. *This entry documents §6.2 of the Lua 5.5 manual* is a claim
about the subject matter, and under
[ADR 0003](0003-dual-license-prose-and-code.md) it is also a licensing obligation — it
earns a heading, an anchor and a rail entry. *Nobody has read this page yet, it last
moved on 6 August, here is where to complain* is a claim about this site's copy of it,
and belongs to the page furniture rather than to its contents.

MDN draws the same line: Specifications is a section in the article and in the rail,
and the box sits after it, outside both. A heading on the panel would put
page-maintenance metadata into a rail that otherwise lists what the entry documents.

### One sentence was doing three jobs

The status line used to end "…and by running every example. Improve this page or report
a problem." — a status report, then two calls to action arriving as its trailing clause.
That is the prose equivalent of hiding a button: the reader who has decided to fix
something has to re-read a sentence about review state to find the way to do it.

Status is what a reader needs first, so it leads and the ask gets its own line one tier
down. The links keep their original justification — an unchecked page is worth more when
whoever spots the problem can act without leaving it — and are simply given somewhere to
be seen.

### Previous/next describes a sequence a reference does not have

In sequential documentation the pair is genuinely useful — it is the reading order, made
clickable. A reference has no reading order. The footer on `error()` offered `dofile()`
and `getmetatable()`, which are its alphabetical neighbours within Globals and have
nothing else to do with it. Nobody finishing `error()` wants `getmetatable()` next.

Worse than useless: it *asserts* a relationship. A reader who trusts the site's structure
is being told these three pages form a progression, and they do not.

**It is not replaced by a "See also" block.** Every entry already authors `## See also` in
its body, curated per entry and version-aware in a way a generated neighbour list can
never be. A footer copy would be a worse duplicate of a better thing six lines above it.
The foot of a reference entry is allowed to simply end.

The pair returns for **Learn**, which is a curated reading order and is the one place on
this site where "next" names something real. That is the same distinction
[ADR 0006](0006-sidebar-order-and-grouping.md) drew when Learn left the Area sequence, and
[ADR 0007](0007-documentation-shell.md) drew again when Learn became its own destination.

## Consequences

- `DocsPage` takes `footer={{ enabled: false }}` in `src/routes/docs/$.tsx`. The docs route
  serves Learn and Guides too, so re-enabling it for Learn is a per-destination decision
  that route will have to make; today Learn is a single empty placeholder and there is
  nothing to sequence.
- `src/entry/EntryProvenance.tsx` is the panel and owns the arrangement. `ReviewStatus`
  is back to one sentence about vetting — no links, no date — and `LastUpdated` takes an
  optional `path` so it can link to that file's commits. The route renders one component
  where it used to render two in a flex row.
- The panel is `rounded-xl border bg-fd-card`, matching `VersionMatrix` two sections
  above it rather than introducing a second panel treatment on the same page.
- It is a `<section aria-label="About this page">`: labelled for a screen reader, which
  a heading would otherwise have done, without putting a heading on the page.
- The rule in the first line — derived blocks only, below the authored body — is what
  keeps this end of the page out of an author's hands. Nothing here is written in MDX, so
  no entry can forget it, misorder it, or word it differently
  ([ADR 0001](0001-single-canonical-docs-with-version-deltas.md)'s single-canonical
  principle applied to page furniture).
- **If the sentiment metric is ever unparked, it goes in this panel**, above the exits,
  which is where MDN puts it and what the panel was shaped to hold. That would not
  reopen anything decided here.

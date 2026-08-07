# The foot of an entry

Below an entry's last authored section, the page carries **three derived blocks and
nothing else**: the version matrix, the source citation, and provenance. There is no
previous/next pair.

Three rules:

1. **The source citation is one link.** The manual name and the passage name point at
   the same place, so they are one anchor. Sentence punctuation stays outside it.
2. **Provenance is one block.** Review status and the last-updated stamp render
   together, in one text column, from one component.
3. **A reference entry has no previous/next.** Fumadocs's page footer is disabled site-wide.
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

### Two related facts were rendered as two unrelated widgets

Review status is an icon plus a sentence, so its text begins indented by the icon's
width. The last-updated stamp was a sibling of that whole unit, so it began at the
container's left margin — **level with the icon, not with the words above it**. A ragged
left edge between two lines that describe the same page is enough on its own to make them
read as unrelated chrome.

The fix is placement, not styling. `ReviewStatus` renders `LastUpdated` inside its own
text column, so the alignment follows from the structure and there is no indent constant
to keep in sync with the icon size. `LastUpdated` stays a separate component with its own
tests: how vetted and how old are still different questions, and the day one of them
grows (a reviewer's name, a diff link) it should grow without touching the other.

The stamp had previously been pinned right with `ms-auto`, which was worse than either:
the gap between the two grew with the viewport, until on a wide screen the date read as
belonging to the page frame rather than to the entry.

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
- `ReviewStatus` gained a `lastModified` prop and renders `LastUpdated` itself. The route
  no longer imports `LastUpdated`, and the flex row that used to hold both is gone.
- `ReviewStatus`'s outer element is a `div` rather than a `p`, because it now contains a
  paragraph.
- The rule in the first line — derived blocks only, below the authored body — is what
  keeps this end of the page out of an author's hands. Nothing here is written in MDX, so
  no entry can forget it, misorder it, or word it differently
  ([ADR 0001](0001-single-canonical-docs-with-version-deltas.md)'s single-canonical
  principle applied to page furniture).

## Open

**Whether provenance should be a box rather than a paragraph.** MDN puts this class of
information in a bordered panel, and the block here now has enough in it — status, date,
two actions — that a panel may read better than loose lines under a rule. Not decided;
the structure above is what a box would be built from either way, so nothing here blocks it.

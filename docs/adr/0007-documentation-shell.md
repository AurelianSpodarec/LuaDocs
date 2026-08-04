# The documentation shell

Everything around the entry: the header, the left sidebar, and what is *not* between
them. [ADR 0006](0006-sidebar-order-and-grouping.md) decides what the sidebar tree
contains and how it is ordered; this decides the furniture the tree sits in.

Five rules govern it:

1. **Every control is a destination, content state, or a preference, and each kind
   has one home.** Destinations go in the sidebar; content state and preferences go
   in the header. They are never mixed.
2. **The sidebar has two zones**: a block of destinations at the top, and below it
   the tree belonging to whichever destination is active.
3. **The filter sits between them**, because it acts on the tree and not on the
   block.
4. **Only the tree scrolls.** The destinations block and the filter are pinned.
5. **There is no context bar.** The breadcrumb goes in the article column, above the
   `<h1>`.

## Why

### Two references, because they solve two different problems

MDN remains the reference for the page and for the tree
([mdn-case-study.md](../research/mdn-case-study.md), ADR 0006). It is not the
reference for the shell, and the reason is visible on its own
[`Math.min()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/min)
page: the top nav reads HTML · CSS · JavaScript · Web APIs · All, because MDN is five
reference sites wearing one hat and that bar is how you pick one. LuaDocs documents a
single language. Copying that nav would give us a row of buttons duplicating the
sidebar's own top level.

The [Tailwind CSS docs](https://tailwindcss.com/docs) sidebar answers the question we
actually have — *which part of one product am I in* — with a block of destinations
above the content tree: Documentation, Components, Templates, UI Kit, Playground,
Course, Community, each with an icon, the active one in bold. Underneath it, section
headings (`GETTING STARTED`, `CORE CONCEPTS`) and their entries. That is our shape,
so that is what the shell copies.

### Destinations, not settings

The discipline in that block matters more than its shape: **it contains only places.**
Tailwind's theme control is not in it. Ours holds Reference, Learn, Guides, Playground
and Community, and nothing a reader *sets*.

This is what sorts the rest of the list. A destination is somewhere you go. Content
state changes what the page says. A preference changes how it looks. Three kinds,
three homes, and the moment a preference appears among the destinations the block
stops meaning anything.

### The selected version is not a preference

The rule this exists to prevent: **the version switcher never goes in a settings
menu.** Theme and language are set once and forgotten. The selected version decides
which facts on the page are true — it drives the version support strip, which change
notes render, and which example variant runs ([ADR
0001](0001-single-canonical-docs-with-version-deltas.md)). Hiding the control behind a
gear icon would hide the thing the site is *for*. It stays visible and labelled in the
header.

Language is the awkward one, because it is a preference that also changes content. It
is grouped with theme rather than with version, which is where MDN puts it and where
readers already look for it.

### The filter belongs to the tree, not to the sidebar

MDN's filter sits at the top of its sidebar, and it is tempting to copy the position.
But MDN's sidebar contains *nothing but* the tree, so top-of-sidebar and top-of-tree
are the same pixel. Ours has two zones, and a control placed above things it does not
act on is claiming a scope it does not have. Copying MDN's reasoning rather than its
coordinates puts the filter directly above the tree.

The filter and search are also deliberately different jobs, and must not converge into
one worse thing. **Search takes you somewhere; the filter narrows what is on screen
and keeps you oriented** — preserving the tree, keeping group headings, expanding
sections that contain matches. On an unscoped tree this is worth more than it is to
MDN: typing `meta` surfaces `getmetatable()` under Globals *and* `__index` under
Language › Metatables, each still in place.

### Only the tree scrolls

Tailwind can let its whole sidebar scroll because its tree runs to a few dozen rows.
Reference is ~295 entries. A filter that scrolls out of reach is unreachable exactly
where it earns its keep, which is deep inside `math`.

### No context bar

MDN carries a second bar under its header: breadcrumb on the left, Theme and Language
on the right. It is a clean arrangement and we do not copy it, because our page is not
MDN's page — under the `<h1>` we carry a **version support** strip that MDN has no
equivalent of. Header, plus context bar, plus strip, and the prose starts a long way
down. Moving the breadcrumb into the article column buys that row back, and theme and
language are perfectly at home in the header.

### The tree belongs to the active destination

Clicking Learn does not scroll you to a distant part of one enormous tree; it replaces
the tree with Learn's. This is what earns the block its place, and it is why the
active destination is the only bold row in it.

## Consequences

- **ADR 0006's area order is amended.** Learn and Guides become destinations, so the
  Reference tree is `Standard Library · Language · Standalone interpreter · C API`.
  The reasoning for that order is untouched — lookups outnumber learning, so Standard
  Library still leads. What changes is that a curated reading order and `C API` are no
  longer presented as the same kind of thing.
- **The tree drops from five levels to four**: Area → Section → Group → Entry, with
  the destination above it rather than inside it.
- **No restyling is owed.** ADR 0006 already sets an Area at 12px, weight 600,
  uppercase and tracked — which is exactly Tailwind's `CORE CONCEPTS` treatment. The
  restructure is cheaper than it looks.
- **There are two filters, not one.** The text filter is this ADR. The version filter
  — "Hide unavailable in 5.x", off by default
  ([luadocs-features.md](../research/luadocs-features.md), F7) — waits for compat
  coverage, since over stubs with no compat data it would hide nothing.
- **Collapse persistence must store only explicit chevron clicks.** F7 asks for
  `localStorage`; ADR 0006 says navigation opens a Section and crossing its boundary
  resets that. Persisting navigation-driven opens would put the two rules in direct
  contradiction.
- **The active entry must be scrolled into view.** F7 already asks for it. While the
  tree was scoped it did not matter; unscoped, landing on `debug.sethook` can leave
  the highlighted row well below the fold.
- **The i18n URL shape is deliberately left open and is owed its own ADR.** Language
  most likely wants a path segment (`/fr/docs/...`) while the selected version stays a
  query param on purpose (ADR 0001). Both are right for their own reason — one
  canonical URL per entry across versions, distinct indexable URLs per language — and
  they contradict on their face, so the resolution should be written rather than
  discovered during v2. i18n itself stays deferred to v2.
- The destinations block needs an icon per row, which is the first place the site
  commits to icon vocabulary beyond incidental `lucide-react` use.

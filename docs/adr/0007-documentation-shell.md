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
3. **The block scrolls with the tree.** It is links a reader clicks about once a
   session, and it is not worth a quarter of the panel.
4. **The filter is pinned**, in the controls cluster with Search. It is the one thing
   in the sidebar that stops working when it scrolls away.
5. **One full-width navbar, and it holds controls rather than navigation** —
   wordmark and selected version on the left, search in the middle, theme, language
   and GitHub on the right.
6. **There is no context bar.** The breadcrumb goes in the article column, above the
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

### The filter is a control, so it is pinned; the block is links, so it is not

This was first written the other way — filter directly below the block, both pinned
above a scrolling tree — on the reasoning that a control placed above things it does
not act on claims a scope it does not have. Measuring the built result overturned it:

| | |
|---|---|
| Sidebar height | 720px |
| Pinned block + filter | **184px — 26%** |
| Tree viewport | **362px** |
| Tree content | 1142px |

The tree had half the panel, and the destinations block alone took more than a third
of what the tree got, to show five links a reader clicks about once a session.
Tailwind scrolls its whole sidebar and is right to; what does not transfer is doing
the same to the filter, because **Tailwind's sidebar contains no controls.** It is
links all the way down, so nothing stops working when it scrolls off. Ours has an
input in it.

So the two are split by what they are rather than by what they point at. The block
scrolls away with the tree. The filter is pinned, which puts it beside Search — two
text-entry controls in a chrome cluster, with the scroll boundary separating chrome
from content. That reads as a controls group rather than as a header for the block,
which is what the original ordering argument was trying to prevent.

The measured result: the pinned region falls from 184px to 159px while absorbing the
filter, and the tree viewport goes from 362px to 561px — **55% more tree**.

The filter and search remain deliberately different jobs, and must not converge into
one worse thing. **Search takes you somewhere; the filter narrows what is on screen
and keeps you oriented** — preserving the tree, keeping group headings, expanding
sections that contain matches. On an unscoped tree this is worth more than it is to
MDN: typing `meta` surfaces `getmetatable()` under Globals *and* `__index` under
Language › Metatables, each still in place.

**The rejected third option** was a filter that scrolls with the block and then sticks
to the top of the viewport, which would cost nothing at all. It is not buildable on
today's layout: fumadocs renders `banner` outside the scroll viewport and `links`
inside it, and a `custom` link item's wrapper is only as tall as its own content, so a
sticky child has no distance to travel. Getting it would mean reproducing ~200 lines
of fumadocs's sidebar internals, which drift on upgrade. Worth revisiting when slice 2
owns the shell outright — the design is right, the plumbing is not there yet.

### The navbar holds controls, not navigation

Tailwind has **both** a header nav and a sidebar block, and the split is a tier one:
Docs · Blog · Showcase · Partners · Plus are *site sections*, while Documentation ·
Components · Templates · Playground · Community are *product areas*. LuaDocs has no
marketing tier. There is one product, so the navbar carries no links at all — only the
wordmark, the selected version, search, theme, language and GitHub.

That is why the earlier argument against copying MDN's top nav still holds. The
objection was to a bar of *technologies* duplicating the sidebar's own top level, and
a bar with no navigation in it duplicates nothing. The destinations stay in the
sidebar, where they scroll.

The reason to add it at all was that the sidebar was cramped, and measurably so: five
controls shared one 30px row inside a 268px panel, which wrapped `Lua version 5.4`
onto two lines. Moving the wordmark, version, theme and search into a navbar takes the
sidebar's pinned region from 159px to **58px** — just the filter — and the tree
viewport from 561px to **606px**. The navbar's own 56px is spent against the article's
top margin, not against the tree.

The selected version sits beside the wordmark because that is exactly where Tailwind
puts its `v4.3` chip, and for the same reason: it is the one control that changes what
the whole site is showing you.

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
- **The sidebar's footer bar is dropped.** It held a GitHub icon and the theme switch.
  GitHub is already the Community destination, and theme belongs with the other
  preferences in the header row, so the bar had nothing left to hold — fumadocs
  removes the element entirely once `githubUrl`, `themeSwitch` and `languageSelect`
  are all absent. That is another 60px back.
- **Theme is a three-way control** — light, dark, system — not a two-state toggle.
  System is what most readers actually want and neither fixed choice expresses it.
- The docs pages use fumadocs's **notebook** layout rather than its **docs** layout,
  which is what supplies `nav.mode: 'top'`. Two couplings in it are worth knowing
  before someone "tidies up" the options: enabling the `themeSwitch` option puts the
  switch in the navbar *and* re-creates the sidebar footer bar, so theme is passed
  through `nav.children` instead; and a link without `on: 'menu'` renders in the
  navbar as well as the sidebar, which would put the destinations in both.
- **`tabs` is off.** Left on, fumadocs derives a tab dropdown from the tree's top
  level and offers a second, competing way to switch Area.

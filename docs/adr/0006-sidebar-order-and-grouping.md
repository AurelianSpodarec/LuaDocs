# Sidebar order and grouping

The sidebar's shape is decided by what a reader needs, not by the reference
manual's section numbering and not by what the current tooling makes cheap. Four
rules govern it:

1. **The manual is the source of truth for content and attribution, never for
   presentation.** Its order is preserved as data — every entry carries a
   `source` anchor — and discarded as layout.
2. **Identifier-named entries sort alphabetically. Prose-named entries are
   curated.**
3. **URL depth is exactly three: Area → Section → Entry.** Runs of entries inside
   a section are **groups**: labelled and collapsible, with no page and no URL —
   structurally identical to MDN's `Static methods`.
4. **A section's overview is reached by clicking the section itself.** It never
   also appears as a child.

## Why

### Not the manual's order

The manual is a specification: written to be read once, linearly, by someone
implementing Lua. The sidebar is a lookup surface: scanned repeatedly by someone
who already has a problem. Ordering the second by the first puts `package` third
and `math` seventh in the standard library, which no reader wants.

The decisive argument is narrower, though. **There is no single "the manual's
order."** LuaDocs documents 5.1 through 5.5 in one tree
([ADR 0001](0001-single-canonical-docs-with-version-deltas.md)). In the 5.1
manual the standard libraries are §5 and there is no `utf8` at all; in 5.5 they
are §6. Ordering by manual section number would mean the tree changes shape
depending on which manual we happened to read — which is not something a sidebar
can do.

### Alphabetical only where it helps

Alphabetical order is only useful to a reader who already knows the name — and a
reader who knows the name uses search. Applied to prose-named entries it actively
misleads: it puts `break` before `do`, `goto` before `if`, and buries `Patterns`
between `match()` and `rep()`.

Applied to identifier-named entries it is the fastest possible scan and needs no
maintenance. So the split follows the name, not the position: `format()`,
`__index`, and `LUA_PATH` sort; `Numeric for`, `Patterns`, and `Weak tables` are
placed. This maps onto the existing `entry-type` field — `function` and
`constant` are identifier-named, `construct` and `guide` are prose-named — with
one exception: metamethods are typed `construct` but named like code, so they
sort.

### Groups, not folders

Grouping entries inside a section is a presentational need, not a structural one.
A folder for it costs a URL segment, an overview entry nobody will write, and a
click that leads somewhere empty. A group costs none of that: it labels a run of
entries and collapses it, and there is nothing behind it to click into.

MDN's `Math` page is the reference implementation, and this is a straight copy of
it. `Math` is a link to the overview. `Static methods` and `Static properties` are
`<details>`/`<summary>` pairs — collapsible, chevroned, with no page behind them.
That is what lets `io` group its file methods without becoming four levels deep,
and what lets `string` put `Patterns` above its function list without a special
case.

A group is **not** a separator. A separator is a static label or rule between
items; a group is an interactive disclosure that owns its children and can be
collapsed. Building a group as a separator would lose the collapse, which on a
33-entry section like `math` is the whole point.

### One row per section

A section appearing twice — once as its own folder, once as the folder's first
child — is a defect, not a convention. Every reference site we looked at,
including MDN, shows it once.

## The curated orders

These are judgement calls and cannot be derived, so they are recorded here.

**Areas**

```
Learn · Guides · Standard Library · Language · Standalone interpreter · C API
```

Standard Library sits above Language because most lookups that bring a reader
here are `string.format` or `table.insert`, not `goto`. MDN orders its JavaScript
reference the same way, with "Standard built-in objects" above "Statements".

**Standard Library sections** — by how often a reader reaches for them

```
Globals · string · table · math · io · os · coroutine · utf8 · package · debug
```

"Globals" rather than the manual's "Basic Functions": these are the things
callable without a prefix, and that is what the name should say.

**Language sections** — in learning order

```
Values and types · Lexical conventions · Variables and scope · Statements ·
Expressions · Metatables and metamethods · Environments · Error handling ·
Garbage collection · Coroutines
```

"What is a table, what is nil" is a more common landing point than "how do I
write a long comment", so Values and types leads.

**C API sections** — in dependency order

```
Types and values · Stack manipulation · Calling · Error handling ·
References and the registry · Userdata · Coroutines · Debug interface ·
Auxiliary library · Constants
```

**Statements** — all prose-named, therefore all curated

```
Assignment · local declarations · global declarations · if · while ·
repeat … until · Numeric for · Generic for · break · goto · return ·
do … end blocks · Function declarations · To-be-closed variables
```

## Labels and scope

**Entry titles are fully qualified and take parentheses when callable** —
`string.format()`, `math.pi`, `file:read()` — in the sidebar, the page heading, the
breadcrumb and search alike. MDN shortens its sidebar rows to `abs()` because
`Array.prototype.` is sixteen characters of noise; Lua's prefixes are five to seven,
and keeping them buys two things worth more than the width. A row can be pasted
straight into code. And **dotted means library member, bare means global** — which
is what makes the cross-links below legible.

**Groups appear only when a section holds more than one kind of entry.** `table`
and `os` are all functions and get none, exactly as MDN gives a single-kind object
none. `math` gets Functions and Constants; `io` gets Functions, Constants, and File
methods; `string` gets Concepts and Functions. Groups are open by default — they
exist to let a reader collapse noise, not to hide entries from them.

`entry-type` determines the group for `function`, `constant`, and `construct`
entries, but not for file methods, which are typed `function` and still belong
apart. Each entry therefore carries its group name explicitly, defaulted from its
type.

## Cross-links

A section may end with a **Related globals** group: rows linking to entries that
live in `Globals` but that a reader would look for here first. `setmetatable()` is
entirely about tables, and someone reading `table` should see it.

**The row appears twice; the entry does not.** The page stays at
`/docs/standard-library/globals/setmetatable`. Relocating it under `table` would
put it at a URL asserting that `table.setmetatable` exists — it does not, and
calling it is a runtime error — and would leave `Globals` missing its most-used
functions. Sidebar rows are free; pages are not
([ADR 0001](0001-single-canonical-docs-with-version-deltas.md)).

Fully-qualified titles are what make this readable: `table.concat()` is dotted,
`setmetatable()` is bare, and the reader can see which is which without being told.

Cross-links are deliberately rare — only where a reader would plausibly search a
section first and find nothing:

| Section | Related globals |
|---|---|
| `table` | `getmetatable()` `ipairs()` `next()` `pairs()` `rawget()` `rawlen()` `rawset()` `setmetatable()` |
| `string` | `tostring()` |
| `package` | `dofile()` `loadfile()` `require()` |
| `Language > Metatables and metamethods` | `getmetatable()` `rawget()` `rawlen()` `rawset()` `setmetatable()` |

Everything else uses the entry's **See also** and its section overview, which is
where a task-oriented view belongs: the sidebar says where a thing lives, the
overview says what to reach for. `math` does not cross-link `tonumber()`, and
`Error handling` does not cross-link `pcall()`; both are prose links.

The group is always the last thing in a section, and always titled "Related
globals". Native entries are never behind a disclosure; borrowed ones always are.

**The sidebar shows one Section at a time**, with the Area's row above it as the way
back up — MDN's arrangement exactly, and its `Standard built-in objects` link.

This was first written the other way: scoped per *Area*, so all ten libraries stayed
listed, on the reasoning that JavaScript has eighty built-in objects and Lua has ten,
so hopping between them was worth keeping. Building it disproved that. A Section's
label is a link with no chevron (rule 3), so leaving the siblings on screen meant
navigating between them silently expanded one and collapsed another — an accordion
with no affordance to explain it. Dropping the siblings removes the illusion: nothing
opens or closes, there is simply less of the tree.

The cost is MDN's cost. Reaching `table` from `string` goes up through the Area
first. Two clicks, and the Area row is always visible.

## Visual hierarchy

MDN is the reference for how the sidebar *looks*, not only how it is ordered. Two
things are copied from its `Math` page, measured rather than eyeballed:

- **Typeface carries the hierarchy.** An identifier is set in the mono face
  (`math.abs()`, `nil`, `_G`); a structural label is set in the UI face
  (`Functions`, `Values and types`). This is the single largest readability win and
  the thing the sidebar was missing.
- **Indentation barely does.** 8px per level. MDN does not need more, because type
  is already doing the work.

One deliberate departure: MDN sets **every** row at 16px. It can, because its
sidebar is scoped to one built-in object and shows two or three levels at a time.
Ours is unscoped and four deep, so size and case separate the levels that are
*labels* from the levels that are *content*:

| Level | Face | Size | Weight | Case |
|---|---|---|---|---|
| Area — `Standard Library` | UI | 12px | 600 | upper, tracked |
| Section — `math` | mono | 15px | 600 | — |
| Group — `Functions` | UI | 12px | 500 | — |
| Entry — `math.abs()` | mono | 14px | 400 | — |

The Area and the Group share a size but never read alike: the Area is uppercase and
unindented, the Group is sentence case, indented, and carries a chevron.

Whether a name is code is decided from its shape, in `src/sidebar/Label.tsx`:
whitespace means prose; a leading lowercase letter or underscore means an
identifier; and what remains is code only if it carries a dot, colon, underscore or
call parens — which is what keeps `LUA_PATH` mono while leaving `Functions`,
`Globals` and `Language` in the UI face.

## Consequences

- The generated `meta.json` shape — `{"pages": ["index", "..."]}` — is wrong on
  both counts. The `"..."` glob sorts alphabetically, discarding rule 2; listing
  `index` explicitly makes the overview a sibling of its own section, breaking
  rule 4. The scaffold must emit the manifest's explicit order and omit `index`.
- Sections with no entries (`Language > Coroutines`, every C API section as
  currently scaffolded) are entries, not folders, until they have content.
- `Standard Library > io > File methods` loses its folder and becomes a group. Its
  entries move up into `io`, where five of them (`close`, `flush`, `lines`, `read`,
  `write`) would collide with `io.*` slugs — so file-method slugs take a `file-`
  prefix while their titles keep the `file:` form.
- The rules are mechanically checkable and should be enforced by test, not
  review: URL depth, identifier-named entries in alphabetical order within their
  section, and no section listing its own overview as a child. Without that they
  drift back the first time someone adds an entry by hand.
- The glossary gains **Group** for the collapsible run of entries, and **Section**
  drops "group" from its _Avoid_ list, since the word now names a real thing.
- Today's tooling expresses part of this and not the rest. `fumadocs-core` claims
  an unlisted `index.mdx` as the folder's own link, which gives rule 4 for free,
  and its `pages` array accepts `[Name](/url)` items, which gives cross-links for
  free. It has no group: its `---Label---` `pages` entry is a static separator,
  which cannot collapse and does not own the entries beneath it. **We build the
  group ourselves.** Per [ADR 0005](0005-platform-fumadocs-on-tanstack-start.md)
  the UI is ours anyway; the design is not cut down to what the plumbing has.
- Version availability is out of scope here. Dimming unavailable entries rather
  than hiding them is already settled, and is orthogonal to order and grouping.

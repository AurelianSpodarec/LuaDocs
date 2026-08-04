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
   a section are separated by **dividers**, not folders.
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

### Dividers, not folders

Separating entries inside a section is a visual need, not a structural one. A
folder for it costs a URL segment, an overview entry nobody will write, and a
click that leads somewhere empty. A divider costs nothing and cannot be clicked
into a dead end.

MDN's `Math` page is the reference implementation: `Math` is a link, `Static
methods` and `Static properties` are headings with no page behind them. This is
what lets `io` separate its file methods without becoming four levels deep, and
what lets `string` put `Patterns` above its function list without a special case.

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

**Entry labels drop the prefix their section already supplies and take parentheses
when callable.** Under `string`, entries read `format()` and `byte()`, not
`string.format`. Under `math`, `pi` and `huge` stay bare. Frontmatter titles are
unaffected — the page is still titled `string.format`.

**Dividers appear only when a section holds more than one kind of entry**, which
`entry-type` already determines. `table` and `os` are all functions and get none;
`math` gets Functions and Constants; `io` gets Functions, Constants, and File
methods.

**The sidebar is scoped to one Area at a time**, with a link back up. MDN scopes
per built-in object because JavaScript has around eighty of them; Lua has ten
standard libraries, and being able to move from `math` to `string` without
navigating up is worth keeping. Same idea, one notch coarser.

## Consequences

- The generated `meta.json` shape — `{"pages": ["index", "..."]}` — is wrong on
  both counts. The `"..."` glob sorts alphabetically, discarding rule 2; listing
  `index` explicitly makes the overview a sibling of its own section, breaking
  rule 4. The scaffold must emit the manifest's explicit order and omit `index`.
- Sections with no entries (`Language > Coroutines`, every C API section as
  currently scaffolded) are entries, not folders, until they have content.
- `Standard Library > io > File methods` loses its folder and becomes a divider.
- The rules are mechanically checkable and should be enforced by test, not
  review: URL depth, identifier-named entries in alphabetical order within their
  section, and no section listing its own overview as a child. Without that they
  drift back the first time someone adds an entry by hand.
- The glossary gains **Divider** for the labelled break. It is not a **Section** —
  no overview entry, no URL — and "subsection" or "group" would imply the
  structure it deliberately lacks.
- Today's tooling happens to express all of this: `fumadocs-core` claims an
  unlisted `index.mdx` as the folder's own link, and supports `---Label---`
  entries in `pages` as non-clickable separators. That is convenient, not
  load-bearing. Per [ADR 0005](0005-platform-fumadocs-on-tanstack-start.md) the
  UI is ours; if the plumbing stops expressing what the design needs, the
  plumbing gets replaced, not the design.
- Version availability is out of scope here. Dimming unavailable entries rather
  than hiding them is already settled, and is orthogonal to order and grouping.

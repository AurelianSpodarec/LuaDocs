# LuaDocs

An MDN-style documentation site for the Lua language, fully rewritten from the
official manual, with per-version content and runnable examples. This glossary
defines the project's shared vocabulary.

## Language

### Content units

**Entry**:
The atomic unit of documentation — a single function, operator, concept, or
library overview. An entry carries version metadata and is what the sidebar
lists and the compat strip describes.
_Avoid_: page, article, topic, doc

**Section**:
A named group of entries (e.g. the `string` library, or "Language Basics"). A
section has its own overview entry that acts as its landing page.
_Avoid_: category, folder, group

### Versioning

**Version**:
A minor Lua line the site documents: `5.1`, `5.2`, `5.3`, `5.4`, `5.5`. The site
tracks minor lines only, never patch releases (it documents `5.4`, not `5.4.6`).
_Avoid_: release, edition

**Default version**:
The version shown when a reader arrives with no preference — always the latest
(currently `5.5`).
_Avoid_: canonical

**Selected version**:
The version the reader has currently chosen via the switcher. It drives sidebar
state, which examples run, and the compat strip.
_Avoid_: active, current, chosen

### Content model

**Base**:
The authored content of an entry, written against the default version. Every
version inherits the base unless a delta overrides it.
_Avoid_: default content, canonical content, master

**Delta**:
Any authored, version-scoped difference from the base. It takes one of three
forms: an availability bound (`introduced`/`removed`), a change note, or an
example variant. Deltas never fork a whole entry into per-version copies.
_Avoid_: override, patch, diff

**Change note**:
An inline callout in an entry describing how behavior differs in a specific
version (e.g. "Changed in 5.3: dividing two integers with `/` now yields a
float"). One kind of delta.
_Avoid_: version note, compat note, changelog

### Content types

**Reference**:
Precise, lookup-oriented content — one entry per symbol or language construct.
Skimmable, exhaustive, version-tagged.
_Avoid_: docs, spec, API

**Guide**:
Prose that explains a concept or task in depth (e.g. "how metatables really
work", "history of Lua", "Lua in the wild"). Narrative, not lookup.
_Avoid_: article, tutorial, how-to

**Learn path**:
An ordered sequence of guides curated for beginners. A curation of existing
guides, not a separate content type.
_Avoid_: course, track

### Interactivity

**Example**:
A code snippet shown inside an entry or guide. It is *runnable* only when the
in-browser runtime can execute it; C API and `io`/`os`-dependent snippets render
static, with no Run button. May declare version-specific variants.
_Avoid_: snippet, sample, listing

**Playground**:
The standalone, full-page editor where a reader writes and runs arbitrary Lua,
separate from inline examples.
_Avoid_: REPL, sandbox, editor

### Interface elements

**Version switcher**:
The global header control that sets the selected version.
_Avoid_: version selector, picker, toggle

**Version support**:
The row of version chips at the top of a reference entry, showing availability
and "changed" state across all versions at once.
_Avoid_: compat strip, compatibility table, availability, support matrix, version bar

**Gotcha**:
A first-class callout flagging a common mistake or surprising behavior (1-based
indexing, `nil` holes in tables, only `nil`/`false` being falsy). A named,
recurring element, not an ad-hoc warning.
_Avoid_: pitfall, caveat, footgun, warning

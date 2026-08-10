# LuaDocs

An MDN-style reference for the Lua language, rewritten from the official manual, with
per-version content and runnable examples.

**This file is a glossary and nothing else.** No rules, no specifications, no implementation.
A rule belongs in `docs/adr/` or `docs/conventions/`; a word belongs here. Each term lists the
words it displaces under _Avoid_ — those are not stylistic preferences, they are terms that
were tried and caused confusion.

## The two bodies of writing

**Documentation**:
What a reader comes for — the Lua reference itself, in `content/`.
_Avoid_: the docs, the site (both ambiguous between this and the record)

**Record**:
How the project thinks, in `docs/`. Its decisions, conventions, findings and open questions.
A reader never sees it; builders and agents do.
_Avoid_: internal docs, meta-docs, the wiki

## The record's parts

**Decision**:
A choice that is hard to reverse, surprising without context, and the result of a genuine
trade-off. Recorded as an ADR. Missing any of the three makes it a convention instead.
_Avoid_: rule, policy

**Convention**:
A reversible rule about how something is written or built. Cheaper to change than a decision
and not argued from scratch each time.
_Avoid_: standard, guideline, style rule

**Finding**:
Something building taught us, dated and never edited afterwards. A finding is what justifies
editing a decision.
_Avoid_: lesson, retro, postmortem

**Question**:
Something unsettled, with what blocks it. Deleted once answered — the answer becomes a
decision or a convention.
_Avoid_: debt, TODO, issue

**Proving surface**:
Where a proposal about rendered output is put beside the current behaviour so the two can be
compared. Not reader-facing.
_Avoid_: storybook, sandbox, playground (that word is taken)

## Content units

**Entry**:
The atomic unit of documentation — a single function, operator, concept, or library overview.
Carries version metadata, and is what the sidebar lists.
_Avoid_: page, article, topic, doc

**Section**:
A named group of entries, such as the `string` library. A section has its own overview entry
acting as its landing page.
_Avoid_: category, folder

**Group**:
A labelled, collapsible run of entries inside a section. It has no overview and no URL:
clicking it collapses its entries rather than navigating.
_Avoid_: divider, separator, subsection

## Versioning

**Version**:
A minor Lua line the site documents: `5.1` through `5.5`. Minor lines only — `5.4`, never
`5.4.6`.
_Avoid_: release, edition

**Default version**:
The version shown to a reader with no preference. Always the latest.
_Avoid_: canonical

**Selected version**:
The version a reader has currently chosen. It drives sidebar state, which examples run, and
what version support shows.
_Avoid_: active, current, chosen

**Version switcher**:
The control that sets the selected version.
_Avoid_: version selector, picker, toggle

**Version support**:
An entry's availability and "changed" state across every version at once.
_Avoid_: compat strip, compatibility table, support matrix

## Content model

**Base**:
An entry's authored content, written against the default version. Every version inherits it
unless a delta overrides it.
_Avoid_: default content, canonical content, master

**Delta**:
An authored, version-scoped difference from the base. It takes one of three forms: an
availability bound, a change note, or an example variant. A delta never forks an entry into
per-version copies.
_Avoid_: override, patch, diff

**Change note**:
A note inside an entry describing how behaviour differs in a specific version. One kind of
delta.
_Avoid_: version note, compat note, changelog

## Content types

**Reference**:
Precise, lookup-oriented content — one entry per symbol or language construct.
_Avoid_: docs, spec, API

**Guide**:
Prose explaining a concept or task in depth. Narrative, not lookup.
_Avoid_: article, tutorial, how-to

**Learn path**:
An ordered sequence of guides curated for beginners. A curation of existing guides, not a
separate content type.
_Avoid_: course, track

## Interactivity

**Example**:
A code snippet inside an entry or guide. It is *runnable* only when the in-browser runtime can
execute it.
_Avoid_: snippet, sample, listing

**Playground**:
The standalone editor where a reader writes and runs arbitrary Lua, separate from examples.
_Avoid_: REPL, sandbox, editor

## Callouts

**Gotcha**:
A callout flagging a common mistake or surprising behaviour. A named, recurring element rather
than an ad-hoc warning.
_Avoid_: pitfall, caveat, footgun, warning

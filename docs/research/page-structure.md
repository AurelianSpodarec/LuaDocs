# Page structure

*The decision (bucket: features). Reader-facing page anatomy for LuaDocs, modeled
on MDN. Rationale and evidence are in [`mdn-case-study.md`](mdn-case-study.md).
The **data mechanism** that powers the version strip/matrix (compat dataset,
frontmatter keys) is deliberately deferred to the technical pass. These details
are low-risk and expected to be tuned after prototyping a few real entries.*

## Entry types

The structural forks, each a variant of one shared reference skeleton:

- **Function / method** — has **Parameters** and **Return values**.
- **Language construct / operator / statement / metamethod** — **no**
  Parameters/Return; **Syntax** shows the grammatical form and **Description**
  carries the weight (mirrors MDN's `extends`).
- **Property / constant** (`math.pi`, `_VERSION`) — a **Value** section instead of
  Parameters/Return.
- **Section / library overview** — intro plus a grouped index of its entries.
- **Guide** — free-form narrative.
- **Glossary entry** — a short one-definition term page. *(Likely later.)*

## Reference entry (function) — section order

Top to bottom:

1. **Breadcrumb + title** — breadcrumb mirrors the hierarchy; the last crumb is
   plain text, not a link.
2. **Compact version-support strip** *(top)* — availability across 5.1–5.5 at a
   glance.
3. **Summary** — one or two sentences.
4. **Quick runnable example** — the "Try it" analog, immediately usable.
5. **Syntax** — with **Parameters**, **Return values**, and **Errors** as
   sub-parts beneath it. "Errors" (not "Exceptions"); shown only when relevant.
   Lua's multiple return values make Return values richer than MDN's.
6. **Description** — full semantics and edge cases.
7. **Examples** — always plural, each under its own heading.
8. **Gotchas** — common mistakes / surprising behavior.
9. **Detailed version matrix** *(bottom)* — the fuller per-version breakdown.
10. **See also** — curated: reference → guides, internal before external,
    alphabetical/simple-first within a group.
11. **Source** — attribution link to the original manual entry.
12. **Review status** — whether a person has read the entry, and the two ways to act on
    the answer.

> **Amendment, 2026-08-05 — 9 and 10 are swapped.** See also comes last in the
> authored body; the matrix and Source render after it. Both are derived — the matrix
> entirely from the compat node, Source from `source` frontmatter — so grouping them
> below everything authored is what keeps them out of an author's hands. The
> alternative was a `<VersionMatrix />` placed by hand in all 292 entries, which is
> data pretending to be prose and a thing to forget. See
> [the page-anatomy design](../plans/2026-08-05-page-anatomy-string-design.md).

Plus a right-rail **"In this article" TOC** — flat, H2-only, sticky on desktop and
collapsing to the top on mobile.

**Language construct / operator / metamethod entry:** the same skeleton **minus
Parameters and Return values**.

**Property / constant entry:** the same skeleton, with **Value** replacing
Parameters/Return.

## Section / library overview

Breadcrumb + title → summary → common-patterns example → **grouped index of the
section's entries** → See also → Source.

## Guide

Title → intro → TOC → narrative headings with inline runnable examples → See also
→ Source *(if derived)*.

## In-page callouts

A deliberately small set (MDN rejects proliferation):

- **Note** — neutral supplementary information.
- **Warning** — a real hazard (undefined behavior, crashes, data loss, security).
- **Gotcha** — surprising-but-not-dangerous semantics (1-based indexing, `nil` vs
  `false`, integer/float coercion). LuaDocs's signature callout.

## Version display

- **Compact version-support strip at the top** + a **detailed version matrix at
  the bottom** (MDN's split: a glanceable badge high, the full breakdown low).
- **Change notes render inline** where relevant, are **always shown**, and the note
  matching the reader's selected version is **emphasized** (policy A). All callouts
  and banners are **inline**, never modals.

## Prototype findings

Stress-tested by hand-writing five real entries (one per type) in
`prototype/`. The anatomy held; three refinements emerged:

1. **Version facts must be data-driven.** In a rich entry the same version fact was
   hand-repeated 3–4× (Errors + Gotcha + inline note + matrix), which will drift.
   This is the concrete justification to un-park **F9** (the structured
   compat-data model) in the technical pass — the version strip, matrix, banners,
   and sidebar badges should all be *generated from one source*.
2. **The detailed version matrix is conditional** — show it only when a version
   actually varies. On unchanged entries (`math.pi`) and overviews (`table`) it
   just restates the compact top strip and per-entry badges; drop it there.
3. **Constants use a lighter template** — minimal entries collapse optional
   sections rather than carrying the full skeleton.

Overviews also read better with **authored sub-groups** than a flat alphabetical
index.

## Pilot findings (2026-08-05)

Four `string` entries built against the real components rather than by hand:

4. **A concept entry has no Syntax block, and no single Description either.** The
   construct fork keeps Syntax "to show the grammatical form", which works for `#` or a
   `for` statement and does not work for Patterns: there is no call and no statement, so
   the block would be invented pseudo-Lua. Syntax is for entries with a form to quote.
   What shipped drops `## Description` as well: Patterns has six bespoke H2s in its
   place — Character classes, Sets, Repetition, Anchors, Captures, and Balanced and
   frontier items — each covering one part of the notation, with the tables sitting
   under the two that have a list to tabulate. One `## Description` holding all six
   would have been a section long enough to need its own subheadings, and the right
   rail is H2-only, so those subheadings would not have been navigable. The fixed part
   of the fork is therefore only its tail — `## Examples`, `## Gotchas`, `## See also`,
   preceded by as many topic headings as the concept takes. `Parameters`, `Returns` and
   `Errors` have nothing to describe on a concept and are absent.
5. **A Gotcha must not name a version.** Finding #1 said version facts drift when
   hand-repeated; the same fact reaching Errors, the Gotcha *and* the matrix is exactly
   that. The dataset carries *when*, through `<Since>` and the matrix; the Gotcha
   carries *what*, undated.
6. **A version fact belongs on every entry where it is observable.** Lua 5.4 rejects an
   empty match ending where the previous match ended. The manual files that rule in the
   shared Patterns section, but it changes what `string.gsub` returns:
   `("abc"):gsub("a*", "-")` gives `"--b-c-"` and 4 before 5.4, `"-b-c-"` and 3 after.
   The compat dataset is organised per entry and drives that entry's version support,
   change note and matrix, so a fact is replicated wherever it is observable — where the
   manual files a rule is an editorial choice about their document, not about ours. Left
   on Patterns alone, four surfaces would have told a reader that the most-used pattern
   function never changed. `string.gmatch` needs the same fact when it is authored.
7. **A concept entry needs `lua-compat` in its frontmatter, and nothing will say so.**
   Patterns was authored from a stub whose frontmatter had no `lua-compat` key. Without
   it nothing links the entry to its dataset, so no version support, no change note and
   no matrix render, and the entry silently claims to be version-invariant. No test
   catches this: a stub legitimately has no compat key, and the content guards check
   written entries for structure, not for compat linkage. A guard could — every written
   entry resolves a compat node — and belongs with the coverage checks in the
   content-pipeline slice.
8. **Entries are written from the manual because drafts are wrong.** All four were
   drafted from memory in the implementation plan, then checked passage by passage
   against the five manuals; they needed 6, 5, 9 and 11 corrections. Several were not
   stylistic but false: a Gotcha claiming `string.len(string.gsub(...))` measures the
   wrong argument (it does not — `string.len` ignores extra arguments), a claim that `n`
   caps replacements when it caps matches, and a claim that in `(ab)+` the `+` applies
   to the `b` when a dangling quantifier has nothing to repeat. The rule that every
   factual claim traces to a passage is what caught them, and it earned a home outside
   the plan that happened to state it.

## Section-overview findings (2026-08-05)

The first page of the overview fork, `string`, built after the nineteen entries it
indexes:

9. **An overview's groups are its table of contents, and they are authored.** The fork
   above is one line — summary, common-patterns example, grouped index, See also,
   Source — and building the first one moved three parts of it. The **groups are H2s**:
   the rail is H2-only, so the `###`-under-`## Functions` shape the `table` prototype
   used renders a right-hand column containing the single word "Functions", on the one
   page whose whole job is orientation. They are grouped
   **by task, not by kind** — the sidebar groups by kind because it must also carry
   constants and cross-links, while an overview's reader has a job, and grouping by task
   is what dissolves the Concepts box and puts Patterns at the head of the four functions
   that read it. And the index is **authored**, per the prototype finding, for a reason
   only visible once written: a derived list cannot gloss an entry for *this* page, cannot
   say why two entries are adjacent, and cannot order a group locate → extract → iterate →
   replace. What that costs is the one thing a derived list cannot lose — the index can
   silently omit a sibling — so it wants a guard asserting an overview's links and its
   directory's `.mdx` files are the same set, both directions.

   Two smaller corrections. The fork needs a slot the line does not name, between the
   example and the index, for the **library-wide facts the manual's section preamble
   carries and no entry owns** — for `string`, method syntax, byte positions counted from
   either end, and the one-byte-encoding assumption. And `Source` is listed as an authored
   step but is derived by the route, like the matrix and the review status; the 2026-08-05
   amendment applies to this fork too.

10. **An overview carries `lua-compat`, and its node describes the library's own existence
    and membership — never the union of its members' behaviour.** Five uniform chips on a
    library whose membership changed is the objection, and the answer is to record the
    membership change rather than to drop the node: `string.library` is added at 5.1 and
    `changed_in` 5.3 names the three packing functions that arrived there, so the strip
    marks 5.3 as changed, the matrix renders, and a reader on 5.3 gets the inline note.
    The rule has to be *what* an overview claims rather than *whether*, because `utf8` does
    not exist before 5.3 at all and a silent overview would omit the most important fact
    about it. Member-level changes stay on their members. What is still missing is
    per-entry availability *inside* the index: the sidebar dims an entry the selected
    version lacks and the index beside it does not, and hand-written badges are ruled out
    by finding #1 — the fix is derived badges from the `compatByUrl` map the route already
    loads.

## Review status (2026-08-05)

Every entry states at its foot whether a person has read it, beside the manual
attribution — the two are both provenance and belong together.

The frontmatter key is `reviewed: YYYY-MM-DD`. Absent means nobody has. There is no
`reviewed: false`: an omission and a denial say the same thing, and one of them is a
field an author can forget to update.

**Why it says "Awaiting review" rather than nothing.** Entries here are written from
the reference manual, reviewed, and have every example executed on each build. None of
that is a person reading the page. A site that shows no review state invites the reader
to assume the better answer, and a site that says "reviewed" without qualifying it is
simply wrong. The honest position is to name which of the two happened.

The label does not say "human reviewed". Who read it is carried by the sentence, which
names a person and a date; putting it in the badge foregrounds a human-versus-machine
contrast a reader did not come for.

It carries an **Improve this page** link to the file on GitHub and a **report a problem**
link to a prefilled issue. Both stay when an entry has been checked, because a checked
entry can still be wrong and removing the way to say so would be the worse failure.

This is not the contribution surface the roadmap plans (slice 7) — that is edit-to-PR
flow, feedback widgets and the licence footer. This is the smallest thing that lets a
reader who has just found a mistake do something about it.

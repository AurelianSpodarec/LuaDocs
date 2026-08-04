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

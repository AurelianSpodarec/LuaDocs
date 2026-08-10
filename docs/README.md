# The record

How this project thinks. Not the product — `content/` is the product, and a reader never
comes here.

The two are easy to conflate in conversation and were never named apart, so: **`content/` is
the documentation. `docs/` is the record.**

## The four parts, and why they are four

Each part has a different **lifecycle**, and mixing lifecycles is what broke the previous
record — 97,000 words in which decisions, findings and open questions were interleaved, so
amendments piled up at the feet of documents that had no other way to say "this changed".

| Part | Holds | Lifecycle |
| --- | --- | --- |
| [`adr/`](adr/) | Decisions | **Edited** when the decision changes. Always current state, present tense. |
| [`conventions/`](conventions/) | How we write and build things | **Edited freely.** Reversible rules. |
| [`findings.md`](findings.md) | What building taught us | **Append-only.** Never edited, never reordered. |
| [`questions.md`](questions.md) | What is not settled | **Deleted** when answered — the answer moves to a decision or a convention. |
| [`plans/`](plans/) | The ordered slices, and the current slice's plan | Slices are edited; a finished plan is left alone. |
| [`research/`](research/) | Studies of things outside this project | Written once, dated, rarely revised. |

**The invariant that keeps them apart:**

> A decision states the current state. A finding says what changed it.

An ADR never grows an amendment tail. When a rule changes, the rule is edited and a finding
records what forced the edit. That is the whole mechanism, and it is the one thing the
previous record could not do.

## What is an ADR, and what is not

An ADR requires **all three**. Miss one and it belongs in `conventions/`:

1. **Hard to reverse** — changing your mind later has a real cost.
2. **Surprising without context** — a future reader will ask "why on earth this way?"
3. **A genuine trade-off** — there were real alternatives and one was chosen for reasons.

Sidebar ordering is reversible, so it is a convention. Dual-licensing prose and code is not,
so it is an ADR. This test is why the previous record contained two 2,500-word ADRs: they were
conventions forced into an ADR's shape, so every reason they had was crammed into a "Why"
section justifying a decision that was never really one.

## `CONTEXT.md` is a glossary and nothing else

At the repository root. Terms, what they mean, and the words to avoid. **No implementation
detail, no specification, no decisions.** If it is a rule, it belongs in `adr/` or
`conventions/`; if it is a word, it belongs there.

## `CLAUDE.md` is the agent contract

Also at the root, and deliberately *not* part of the rebuild's clean slate: every session
loads it, so it is edited in place rather than deprecated.

## `DEPRECATED/`

The previous record, moved intact rather than deleted, because its evidence is the reason its
successors are believable — the four `string` entries that needed 6, 5, 9 and 11 corrections,
the three rules a single rendered page falsified, the measurement showing 963 words where 214
carry the same facts.

A rebuilt document **cites** the deprecated one for evidence rather than restating it. Nothing
in `DEPRECATED/` is authoritative, and nothing in it should be edited except to correct a
factual error — there is one such correction, at the head of `DEPRECATED/adr/0015`.

## Status

The rebuild is in progress. Until a part exists here, `DEPRECATED/` is where the answer is.

- [x] This index
- [ ] `CONTEXT.md` rebuilt as a pure glossary
- [ ] `findings.md` populated from `DEPRECATED/page-structure.md`, the roadmap's retrospective
      tail, and the 2026-08-10 falsifications
- [ ] `questions.md` populated from the roadmap's open debts and the four unsettled items
- [ ] ADRs rebuilt — the eight that pass the three-part test
- [ ] Conventions extracted — the seven that do not
- [ ] `plans/ROADMAP.md` reduced to the ordered slices
- [ ] `CLAUDE.md` rewritten in place
- [ ] **References repointed.** The move left **14 `docs/adr/…` links across 12 source files**
      (`EntryProvenance`, `NumericTypeNote`, `layout.shared`, `Footer`, and others) and
      references in **21 files under `plans/` and `research/`**. They are deliberately *not*
      being fixed yet: the rebuild renumbers ADRs, so repointing now means doing it twice. The
      old-number → new-location mapping produced during the rebuild is what these get updated
      against, and it doubles as the review artefact proving nothing was dropped.

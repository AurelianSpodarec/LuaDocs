# Finishing the `string` section

> **For agentic workers:** each batch below is one dispatch. Read the manual first — this plan deliberately contains no draft prose (see [ADR 0010](../adr/0010-entries-are-written-from-the-manual.md)).

**Goal:** author the sixteen remaining `string` entries, giving the site its first complete section.

**Why now:** the entry template is proven on four entries, and four is not enough to trust it. `string.find` returns an index pair *and* captures, `pack`/`unpack` are the gnarliest thing in the library, `byte`/`char` are trivial. Gaps found at sixteen are cheap; gaps found at 288 are not. Deploy is blocked on content ([ROADMAP](ROADMAP.md)), and one finished section is the proof the whole thing is viable.

**What is different from the pilot:** entries are authored in batches of related symbols rather than one task each, and this plan carries anchors rather than drafts. The pilot's four entries needed 6, 5, 9 and 11 corrections to plan-supplied drafts — the drafts were not a shortcut, they were four rounds of correcting fiction.

## Global constraints

- All work stays on `dev`. **Never merge into `main`.**
- Commit style: `type(scope): summary`, imperative, ≤ ~60 chars, no trailing period, **never** a `Co-Authored-By` trailer. A bare `content:` prefix is sanctioned for content.
- [ADR 0010](../adr/0010-entries-are-written-from-the-manual.md) — every factual claim traces to a manual passage read while writing. Rewrite, never copy ([ADR 0003](../adr/0003-dual-license-prose-and-code.md)).
- [ADR 0008](../adr/0008-example-conventions.md) — spelled-out `snake_case`, no single-letter identifiers *including loop variables*, no local shadowing a standard-library global, real data, self-contained, an expected-output comment on every example.
- [ADR 0009](../adr/0009-type-names-across-versions.md) — write the 5.5 type name. `integer` is correct; the renderer discloses the 5.1/5.2 gap. Never hand-write that caveat.
- **No version may be named in prose.** Version facts live in the compat dataset. The only licensed authored version reference is `<Since v="…" />` on an `<Errors>` bullet.
- A **Gotcha** carries *what*, never *when*.
- Emphasis is *italics*, never **bold**.
- `npm test`, `npm run types:check` and `npm run build` pass before every commit.

## The manuals

On disk in the session scratchpad as `5.1.html` … `5.5.html` with `passage.py`:

    python passage.py pdf-string.rep          # all five versions
    python passage.py pdf-string.find 5.1 5.5 # named versions
    python passage.py 6.5.2 5.5               # a section anchor

Anchors for functions are `pdf-string.<name>` in every version. Section anchors move: **Pack formats** is `6.5.2` in 5.5, `6.4.2` in 5.2–5.4, and absent from 5.1. The section overview is `6.5` in 5.5, `6.4` in 5.2–5.4, `5.4` in 5.1.

## The batches

Each batch: research compat for its symbols → write the entries → verify every example in the browser → commit. One dispatch per batch, one review per batch.

| # | Entries | Why grouped | Expect to find (verify, do not assume) |
|---|---|---|---|
| 1 | `byte`, `char` | Inverses of each other; both are strings-as-bytes | Whether either gained or changed arguments |
| 2 | `lower`, `upper`, `reverse`, `rep` | The simple transforms | `rep`'s separator argument is not in every version |
| 3 | `sub` | Indexing rules deserve their own attention | Negative-index behaviour, and how out-of-range is clamped |
| 4 | `find`, `match`, `gmatch` | One pattern-search family, shared concepts | `gmatch`'s caret caveat; the 5.4 empty-match rule applies to `gmatch` — see finding #6 |
| 5 | `pack`, `packsize`, `unpack`, `pack-formats` | One binary-packing unit; useless apart | These arrived together in one version; `pack-formats` is a concept entry like Patterns |
| 6 | `dump` | Unrelated to everything else | A strip argument, and portability caveats worth a Warning |
| 7 | `index` (section overview) | A different template fork | See below |

### Batch 7 is a new fork

`page-structure.md` specifies a section overview as: breadcrumb + title → summary → common-patterns example → **grouped index of the section's entries** → See also → Source. No entry on the site uses that shape yet.

It has decisions in it the pilot did not face: whether the grouped index is authored or derived from the page tree, and whether the groups match the sidebar's (`Concepts`, `Functions`, `Related globals`). Prefer **authored** sub-groups — prototype findings already say overviews read better that way than as a flat alphabetical list — and record the fork as a pilot finding.

The content guard exempts it: `entry-anatomy.test.ts` asserts Syntax/Parameters/Returns only for `entry-type: function`, and this is `overview`.

## Verification

Per batch, in the browser at the running dev server:

- Every example runs on load and matches its `-- Expected output:` comment. Where they differ, the comment is wrong.
- The version-support matrix appears where a version varies and is absent where none does.
- Every See-also link resolves.
- The right-rail lists only H2s.

Per batch, in the suite: `tests/content/entry-anatomy.test.ts` and `tests/content/examples.test.ts` stay green. They enforce the anatomy and ADR 0008 mechanically; a batch is not done until they pass.

## Done when

Sixteen entries authored, `content/docs/standard-library/string/` has no `{/* Not yet written. */}` left, and `ROADMAP.md` records the section as complete with any template findings the batches turned up.

# Entry body migration — types on parameters, names on returns

Executes [ADR 0013](../adr/0013-the-body-of-a-reference-entry.md) and
[ADR 0014](../adr/0014-where-a-closed-vocabulary-lives.md) across the finished standard
library. The worked example is
[`2026-08-10-entry-body-demo.md`](2026-08-10-entry-body-demo.md); read it before Phase 1.

**No draft prose in this document**, per
[ADR 0010](../adr/0010-entries-are-written-from-the-manual.md). Where a batch needs wording
it names the passage to read, not the sentence to write. That rule cost the page-anatomy
slice four rounds of correcting fiction and it is not being relearned.

## Read before the first batch

- [ADR 0013](../adr/0013-the-body-of-a-reference-entry.md) — the six rules and the canonical
  name table, **as amended by Phase 0 below**.
- [ADR 0014](../adr/0014-where-a-closed-vocabulary-lives.md) — rule 4 is the only part with
  content consequences here.
- The [ADR 0009 amendment](../adr/0009-type-names-across-versions.md) — parameters now
  declare `integer`, so the numeric disclosure moves.
- [`2026-08-10-entry-body-demo.md`](2026-08-10-entry-body-demo.md) — and in particular its
  four findings, two of which change the rules.
- ROADMAP's *What it cost* (2026-08-10): **4–6 entries an hour** for authoring, and *every*
  batch of *every* section needed a fix round. This work is lighter than authoring and
  heavier than mechanical.

## The scale

| Section | Function entries | Params | Returns |
| --- | --- | --- | --- |
| `globals` | 29 | 66 | 53 |
| `math` | 31 | 45 | 41 |
| `debug` | 18 | 45 | 35 |
| `io` | 18 | 19 | 65 |
| `string` | 17 | 44 | 22 |
| `table` | 12 | 28 | 12 |
| `os` | 11 | 15 | 22 |
| `coroutine` | 8 | 9 | 12 |
| `utf8` | 5 | 14 | 9 |
| `package` | 3 | 8 | 9 |
| **Total** | **152** | **293** | **280** |

`language/` and `c-api/` hold **no** function entries, so neither is touched.

Of the 280 returns, 14 are `type="none"` and 85 sit on single-return entries — so after
Phase 0's amendment, **195 return names on 67 entries**, not 266 on 152.

## Two blockers, both real

**1. The manuals are not on disk.** ADR 0010 requires them; `find` turns up none, no script
fetches them, `.gitignore` does not mention them. Every type word this migration adds is a
new factual claim, so Phase 2 onward cannot be verified without them. `surface-expansion.md`
has an open section on vendoring. **This blocks Phase 2, not Phase 0 or 1.**

**2. `start_position` versus `first`/`last` is undecided.** Demo finding #1: rule 7 sends
`i`/`j` to `first`/`last`, which was written for the pair bounding a run. A lone starting
point has no partner, and `start_position`, `position` and `first` are now three spellings
of one idea — the exact defect rule 9 exists to prevent. Affects `string.find`,
`string.match`, `string.gmatch`, `string.gsub`, `io.file-seek` and `utf8` at minimum.
**Decide in Phase 0.** Do not let a batch settle it locally; that is how `fmt`, `format` and
`formatstring` happened.

## Phase 0 — amend the ADRs the demo falsified

No code, no content. The migration executes these rules and three of them are wrong as
written.

1. **Rule 4 becomes conditional.** Required on two or more returns; permitted on one.
   85 single-return entries would otherwise need invented labels — `uppercased` for
   `string.upper` — to fix an ambiguity that exists only where there are two rows. The
   stated reason for requiring it everywhere was ragged rows, and a single-return entry has
   one row, so there is nothing to be ragged against.
2. **Rule 3 splits by severity.** `function` and `local` are Lua **keywords** and are
   forbidden — a parameter named `end` or `local` is unreadable in the Lua that Syntax
   quotes. `table` and `string` name a library and a type but are **not** keywords, and MDN
   writes `array: Array` without difficulty, so they are discouraged where a better word
   exists and permitted where none does. Delete `table_argument` from the canonical table.
3. **Rule 5 stops being universal.** Use cases is expected where a function has three or
   more genuinely distinct applications and **omitted** where it does one thing. Mandating
   it on all 152 produces "Use cases: computing a sine" on `math.sin`. The old site carried
   it on `format` and `gsub` — rich, multi-purpose calls — and nowhere else.
4. **Rule 4 gains a sourcing clause.** Demo finding #2: return names are usually not
   invented. `string.find`'s examples already destructure into `start_index, end_index`, so
   the migration **reads an entry's examples first** and adopts their identifiers. Choosing
   fresh names where the examples already have them would put three vocabularies on one
   page.
5. **Settle blocker 2** and record the outcome in the canonical table.

**Gate:** ADR 0013 amended and committed before Phase 1 begins.

## Phase 1 — the components and the guard

Code only, no content. Every entry still renders because the new props are optional at this
stage.

- `Param` gains `type`, `optional`, `default`. `Return` gains `name`. Both render as the
  same two-column term list, so Parameters and Return values stay one visual device.
- `optional` and `default` render together in the term column, not in the description —
  the whole point is that they are scannable. `default` accepts markdown, because real
  defaults are `#list`, "the running coroutine", "the whole string".
- `NumericTypeNote` moves per the ADR 0009 amendment: placed above whichever of Parameters
  or Return values comes first when **either** names `integer`, and **once per entry**.
  `string.sub` is the test case — `string` return, `integer` parameters, no note today.
- `Returns` keeps its existing version-scoping behaviour (`inScope`) unchanged; a name is
  not a reason to re-derive when the heading renders.
- Unit tests in `tests/entry/` for the new rendering, and for the note firing from a
  parameter with no `integer` return present.

**Gate:** `npm test` and `npm run types:check` green. No `.mdx` file changed in this phase.

## Phase 2 — content, by section

Blocked on the vendored manuals. One section per batch, and a fix round is expected in
every one.

Per entry: read the manual passage for the types (not the shipped prose — the prose is
evidence of behaviour, not of the manual's type words), add types and names, rename per the
canonical table, update every prose and example reference to a renamed parameter, add
Use cases only where rule 5 as amended calls for it.

**Order, and why:**

1. **`coroutine` (8)** — pilot. Smallest, uniform, and its `co` → `coroutine` is the
   plainest shorthand case in the tree. Do not proceed until this batch needs no fix round.
2. **`table` (12)** — the demo's neighbour; `table.concat` and `table.insert` are where the
   optional-versus-`nil` distinction is load-bearing, and `table.sort`'s `comp` exercises
   the `comparator` override.
3. **`math` (31)** — proves the `x`/`y` carve-out at its largest, and it is otherwise the
   most uniform section in the tree. Watch `math.max`/`math.min`/`math.atan`/`math.log`,
   all of which return two of the same type.
4. **`string` (17)** — the override cases (`subject`), and four of the seven ADR 0014
   rule-4 headings.
5. **`utf8` (5)**, **`os` (11)**, **`package` (11 params over 3 entries)** — small, and
   `os.date` is the inline-vocabulary case that must be left alone.
6. **`io` (18)** — 65 returns over 18 entries, the multi-return heart of the migration.
   `io.read` already satisfies ADR 0014 rule 4 in substance and wants checking, not
   rewriting.
7. **`globals` (29)** — largest by params, and `load`, `xpcall`, `pcall`, `next`, `pairs`
   and `tonumber` are all duplicate-type returns.
8. **`debug` (18)** — last, because it holds the worst names in the tree:
   `<Param name="local">` and `<Param name="function">` are keywords, plus `up`, `udata`,
   `nrec`, `nseq`, `varname`, `funcname`.

**Gate per batch:** `npm test` green, and no renamed parameter left referenced by its old
name anywhere in the entry — prose, examples, Gotchas or See also.

## Phase 3 — ADR 0014 rule 4 headings

Seven entries gain a `##` heading naming the vocabulary they take and linking to it:
`string.pack`, `string.unpack`, `string.packsize` for the format notation;
`string.find`, `string.match`, `string.gmatch`, `string.gsub` for patterns.

The heading carries a sentence saying what the notation is for, so the section is worth
landing on rather than being a bare link under a title. Both sentences are assembled from
claims the entries and `patterns.mdx` / `pack-formats.mdx` already make, so this phase adds
no new factual claims and is **not** blocked on the manuals.

Can run in parallel with Phase 2, or before it.

## Phase 4 — make the rules enforceable

Last, because the guards fail until the content is migrated.

In `tests/content/entry-anatomy.test.ts`:

- every `<Param>` on a function entry carries a `type`
- every `<Return>` on an entry with two or more returns carries a `name`
- no parameter name is a Lua keyword
- every parameter name appears in ADR 0013's canonical table or its override column
- **the ADR 0014 guard checks members, not markup** — an entry whose parameter references a
  named set documents or links every member of it. Written as "has a table" it would fail
  `string.format`, which documents all eighteen directives as bullets, and pass an entry
  with an empty table. This is the mistake the research doc records; the guard is where it
  gets prevented rather than re-made.

The canonical-table check is the one that matters most: rule 9's failure mode was drift, and
a table nothing verifies drifts exactly as the manual's names did.

## Verification and gates

- `npm test` — content anatomy, examples execute and match their comments, version scoping
- `npm run types:check`
- Every renamed parameter: no stale reference anywhere in its entry
- Spot-render `string.find`, `string.sub`, `table.concat` and `math.max` — the four shapes
  (override rename, note-from-parameter, optional-with-default, duplicate return types)

## Done when

- 293 parameters carry a type; 195 return names sit on the 67 multi-return entries
- No parameter name is a keyword, and none is outside the canonical table
- The seven rule-4 headings are in place and appear in their entries' right-hand rails
- `entry-anatomy.test.ts` enforces all of it, and fails if it is undone
- ADR 0013 records the Phase 0 amendments, so the ADR and the tree agree

## Not in this slice

- **The `example.lua` label.** Recorded in
  [`old-site-content.md`](../research/old-site-content.md); no ADR claims it, and it is a
  shell question rather than an entry-body one.
- **`%F` in `string.format`.** Blocked on the same vendored manual; it is a content
  correction, not a shape migration.
- **Vendoring the manuals.** A prerequisite, not a phase. It has its own work.
- **This slice is not in ROADMAP's list of eight.** It is post-completion remedial work on
  a finished library and wants adding there, positioned after slice 3 (Content pipeline),
  whose guards it extends.

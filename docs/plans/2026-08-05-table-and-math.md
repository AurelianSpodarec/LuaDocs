# The `table` and `math` sections

> **For agentic workers:** one dispatch per batch. Read the manual first — this plan carries anchors, not drafts ([ADR 0010](../adr/0010-entries-are-written-from-the-manual.md)).

**Goal:** author `table` (13 entries) and `math` (35 entries), after `string`.

**Why these two next:** they are where the version system finally does real work. `string` had three change notes across sixteen symbols. These sections have symbols that were *added* in 5.2 and 5.3, and a whole family — `math.pow`, `atan2`, `cosh`, `sinh`, `tanh`, `log10`, `ldexp`, `frexp` — deprecated at 5.3 and **removed** at 5.4. `table.getn`, `maxn`, `foreach` and `foreachi` are gone even earlier. Until now nothing has exercised `version_removed`, the dimmed sidebar entry, or the "not in this version" callout on a real page.

They also force two template forks nothing has used: a **constant** entry (`math.pi`, `math.huge`, `math.maxinteger`) and a **section overview**.

## On luadocs.com

It was raised as a possible reference. It is worth a look for how it *presents* examples — self-contained, realistic data, an explicit expected-output block — and that has already been absorbed into
[ADR 0008](../adr/0008-example-conventions.md).

It is **not** a source of facts, and not a style model. It is Roblox/Garry's-Mod flavoured, where this site is standard Lua only ([ADR 0002](../adr/0002-scope-standard-lua-only.md)) — which is why its `camelCase` was rejected for `snake_case`. Under
[ADR 0010](../adr/0010-entries-are-written-from-the-manual.md) the manual is the only source a claim may trace to. Do not copy from it, and do not check our facts against it.

## Global constraints

Identical to [the string plan](2026-08-05-string-section.md) — read its constraints section. In particular: no version named in prose, a Gotcha carries *what* and never *when*, italics never bold, write the 5.5 type name and let the renderer disclose the numeric gap, and every claim traces to a passage read while writing.

Manuals on disk in the session scratchpad. Function anchors are `pdf-table.insert`, `pdf-math.floor`, and so on. Section anchors move between versions — check rather than assume.

## What is different here: removal

An entry for a removed symbol is the first of its kind. Three things follow, and the first batch to hit one should verify them rather than trust this plan:

- The dataset carries `version_removed`. A symbol deprecated at 5.3 and removed at 5.4 is `version_added: "5.1"`, `version_removed: "5.4"` — the field means *first version without it*.
- The entry still gets written. A reader on 5.1 needs it, and a reader on 5.4 needs to know where it went and what replaced it. `math.pow` → the `^` operator, `math.log10` → `math.log(x, 10)`, `atan2` → `math.atan(y, x)`.
- **The replacement belongs in the prose; the removal belongs in the dataset.** "Use `^` instead" is undated and always true. "Removed in 5.4" is a version fact and never appears in prose.

Deprecation and removal are different events and the manuals record them in different places — a symbol may be deprecated in one version's incompatibilities section and survive for another whole version. Read both the symbol's passage and the incompatibilities chapter.

## The batches

Each: research compat → author → verify every example in the browser → commit. One dispatch, one review.

### `table`

| # | Entries | Notes |
|---|---|---|
| T1 | `insert`, `remove` | The two that mutate. Position arguments, and what happens at the boundaries |
| T2 | `concat`, `sort` | `sort`'s comparator is the subtle one — invalid order functions raise |
| T3 | `pack`, `unpack`, `move` | Arrived later than the rest; `unpack` also exists as a global with a different history |
| T4 | `getn`, `maxn`, `foreach`, `foreachi` | All removed. The batch that proves the removal shape |
| T5 | `create`, `index` | `create` is recent — establish when. `index` is the section overview fork |

### `math`

| # | Entries | Notes |
|---|---|---|
| M1 | `abs`, `ceil`, `floor`, `fmod`, `modf`, `sqrt` | Core numeric. `fmod` and `modf` are easily confused — say how they differ |
| M2 | `sin`, `cos`, `tan`, `asin`, `acos`, `atan` | Trig. `atan` absorbed `atan2`'s second argument at some point — find out when |
| M3 | `deg`, `rad`, `exp`, `log`, `max`, `min` | `log`'s optional base arrived later than `log` |
| M4 | `random`, `randomseed`, `ult`, `tointeger`, `type` | `random`'s behaviour and guarantees changed materially; `randomseed` changed what it returns |
| M5 | `pi`, `huge`, `maxinteger`, `mininteger` | **The constant fork.** No entry uses it yet — see below |
| M6 | `pow`, `atan2`, `cosh`, `sinh`, `tanh`, `log10`, `ldexp`, `frexp` | The removed family. Each needs its replacement in prose |
| M7 | `index` | The section overview |

## The constant fork (M5)

`page-structure.md` says a constant entry is the same skeleton with **Value** replacing Parameters and Return values, and prototype finding #3 says constants "collapse optional sections rather than carrying the full skeleton".

Nothing implements a `<Value>` component. M5 decides whether one is needed or whether a constant is better served by prose under `## Value` — prefer the smaller answer, and remember every H2 must be a real markdown heading for the right rail. If a component is added, it goes in `src/entry/`, is registered in `src/components/mdx.tsx`, gets a test in `tests/entry/`, and `tests/content/entry-anatomy.test.ts` gains an assertion for `entry-type: constant`.

`math.pi` is a float and `math.maxinteger` is an integer, so M5 also decides whether [ADR 0009](../adr/0009-type-names-across-versions.md)'s numeric disclosure should reach the Value section. It currently only reaches `<Returns>`.

## The overview fork (T5, M7)

Breadcrumb + title → summary → common-patterns example → grouped index of the section's entries → See also → Source. Prefer **authored** sub-groups over a flat list, matching the sidebar's grouping. Whichever batch writes the first overview establishes the shape; the second follows it.

## Verification and gates

Per batch, unchanged from the string plan: every example runs on load and matches its comment; the matrix appears iff a version varies; See-also links resolve; the rail lists only H2s; `npx vitest run tests/content` green, plus `npm test`, `npm run types:check`, `npm run build`.

**Additionally, for any entry with a `version_removed`:** load it, select a version after the removal, and confirm the "not in Lua X" callout renders and the sidebar row is dimmed. That path has never been exercised on a real entry.

## Done when

Both sections have no `{/* Not yet written. */}` left, and `ROADMAP.md` records what the removal and constant forks turned up.

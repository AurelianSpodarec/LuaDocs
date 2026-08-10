# The remaining six libraries

> **For agentic workers:** one dispatch per batch. Read the manual first — this plan carries
> anchors and open questions, never draft prose ([ADR 0010](../adr/0010-entries-are-written-from-the-manual.md)).

**Goal:** the 80 entries left after `string`, `table`, `math` and `globals` — `io` (22),
`debug` (19), `os` (12), `package` (11), `coroutine` (9), `utf8` (7).

## Read before the first batch

`.superpowers/sdd/2026-08-05-table-and-math/authoring-context.md` is the accumulated
conventions and is binding. It is longer than any ADR and every rule in it was bought with a
Critical. The three template forks are settled and have worked-example entries:

| Fork | Copy from | Settled by |
|---|---|---|
| Function | `string/gsub.mdx` | the `string` pilot |
| Concept | `string/patterns.mdx` | the `string` pilot |
| Overview | `table/index.mdx`, `math/index.mdx` | `task-T5-report.md`, `task-M7-report.md` |
| Removal | `table/getn.mdx`, `math/pow.mdx`, `globals/unpack.mdx` | `task-T4-report.md`, `task-M6-report.md` |
| Constant | `math/pi.mdx`, `globals/_version.mdx` | `task-M5-report.md` |

**The removal ruling is settled and must not be re-derived:** *a version has the symbol iff
that version's manual says something asserting its existence; deprecation asserts existence,
silence does not.* Re-derive every *number* per symbol, and check `luaconf.h` and the shipped
makefile as well as the manual — the two axes disagree often.

## What is genuinely new here

**`io` needs a fork nothing has built: the method entry.** `file-close.mdx`,
`file-flush.mdx`, `file-lines.mdx`, `file-read.mdx`, `file-seek.mdx`, `file-setvbuf.mdx` and
`file-write.mdx` document methods on a file handle, not functions in a library table. Their
anchors are `pdf-file:read`, not `pdf-io.read`, and several have a same-named library
function that is *not* the same thing (`io.read` reads the default input; `file:read` reads
that file). The first `io` batch decides the shape: how the Syntax line spells a method
call, whether the entry names the receiver, and how it cross-links to its library-level
twin without either page claiming to be the other. Write it down; six entries copy it.

**`utf8` is the first library that does not exist on two of the five lines.** The whole
library arrives at 5.3, so every entry carries `version_added: "5.3"` and the section
overview is the first `library` node that is unavailable on 5.1 and 5.2. Check what the
overview and the sidebar do in that case before writing prose around it.
`utf8.charpattern` is a **constant** and takes that fork.

## The batches

Each: research compat → author → run every example → verify in the browser → commit.
One dispatch, one review, fix rounds for Critical and Important only.

### `coroutine` (9) — start here

Small, self-contained, and the concepts are load-bearing for `io.lines` and `require` later.

| # | Entries | Notes |
|---|---|---|
| C1 | `create`, `resume`, `yield` | The core three. What `resume` returns on both paths |
| C2 | `status`, `running`, `isyieldable` | `running` changed **what it returns**; `isyieldable` arrives later. Establish both |
| C3 | `wrap`, `close`, `index` | `close` is recent; `wrap`'s error behaviour differs from `resume`'s and that difference is the entry |

### `utf8` (7)

| # | Entries | Notes |
|---|---|---|
| U1 | `char`, `codepoint`, `len` | `len`'s `i`/`j` arguments and what it returns on malformed input — two values, and the second is the useful one |
| U2 | `codes`, `offset`, `charpattern`, `index` | `charpattern` is the constant fork. Establish whether `codes` raises or returns on malformed input, and whether `offset` gained an argument |

### `os` (12)

| # | Entries | Notes |
|---|---|---|
| O1 | `time`, `date`, `difftime` | The version-heavy trio and the section's real work. `date`'s format string, the `!` prefix, the `*t` table, and what `time` accepts |
| O2 | `clock`, `getenv`, `tmpname` | What the manual actually guarantees about each — much less than readers assume |
| O3 | `execute`, `exit`, `remove`, `rename` | **`execute`'s return changed materially**; `exit`'s arguments arrived at different times |
| O4 | `setlocale`, `index` | `setlocale` interacts with number formatting, which is worth stating carefully |

### `io` (22) — the largest, and the new fork

| # | Entries | Notes |
|---|---|---|
| I1 | `open`, `close`, `type` | **Decides the method fork.** `io.close` and `file:close` are different entries; `io.type` is linked from `globals/type.mdx`, which is authored — do not contradict it |
| I2 | `file-read`, `read` | The formats are the section's hardest research. `"l"`/`"L"`/`"n"`/`"a"` versus the older `"*l"` spellings — establish when the star became optional |
| I3 | `file-write`, `write`, `file-flush`, `flush` | What each returns, and when that changed |
| I4 | `file-lines`, `lines` | **`io.lines` owes a 5.4 §8.2 fact** recorded by the `globals/load` batch — find it and carry it |
| I5 | `file-seek`, `file-setvbuf` | Whence values, defaults, and what `setvbuf` promises |
| I6 | `input`, `output`, `stdin`, `stdout`, `stderr` | The three standard handles are **constants**, not functions |
| I7 | `popen`, `tmpfile`, `index` | `popen`'s availability is platform-dependent and the manual says so |

### `package` (11)

`globals/require.mdx` is authored and reviewed and **deliberately does not link to any
`package.*` page**, naming them in prose instead. The first `package` batch should add those
links back in one pass — read `task-G10-report.md`, which records exactly what was left
unlinked and why.

| # | Entries | Notes |
|---|---|---|
| P1 | `path`, `cpath`, `config` | `config` arrives later. What each string means and how it is consumed |
| P2 | `loaded`, `preload`, `searchers`, `loaders` | **`loaders` → `searchers` is a rename at 5.2**, so `loaders` is a removal and `searchers` an addition of the same thing. Settle how a rename is modelled — no fork covers it yet, and `debug` has none of these |
| P3 | `searchpath`, `loadlib`, `seeall`, `index` | `seeall` goes with `module`; `searchpath` arrives later |

### `debug` (19)

Last, because it is the least-read section and the most C-facing.

| # | Entries | Notes |
|---|---|---|
| D1 | `getinfo`, `traceback` | The two anyone actually calls. `getinfo`'s `what` string is per-version data, like `collectgarbage`'s options |
| D2 | `sethook`, `gethook` | Masks and counts |
| D3 | `getlocal`, `setlocal` | Negative indices for varargs arrived at some version |
| D4 | `getupvalue`, `setupvalue`, `upvalueid`, `upvaluejoin` | The last two arrive later |
| D5 | `getuservalue`, `setuservalue`, `getregistry` | The user-value pair **changed shape** at 5.4 — establish exactly how |
| D6 | `getmetatable`, `setmetatable`, `getfenv`, `setfenv`, `debug`, `index` | `getfenv`/`setfenv` are removals; `debug.debug` is an interactive prompt and cannot carry a runnable card |

## Verification and gates

Unchanged, per batch: `npx vitest run tests/content` — nine files, including the
fragment-link guard and the version-scope guard — plus `npm test`, `npm run types:check`,
`npm run build`. Every example executed and its expected output recorded rather than
predicted. Browser verification at 1280×900.

**Every batch runs the three-leg absolutist sweep before committing**, including inside
`<Return>`, `<Param>`, `<Errors>` and `<Gotcha title>` bodies. Every batch in the previous
two slices shipped at least one defect of that shape; the second and third legs are the ones
that catch them.

**Two sections here will strain the example harness.** `io` and `os` reach a filesystem, a
clock, an environment and a subprocess. The sandbox **does** have a writable in-memory
filesystem — a card can write a file and read it back — so establish what actually works
before concluding a card is impossible. A wall-clock or environment value can never appear
in an expected-output comment; print comparisons, types or invariants instead.

## Done when

No `{/* Not yet written. */}` remains anywhere under `content/docs/standard-library/`, every
section has an overview, and `ROADMAP.md` records what the method fork and the rename
question turned up.

# Design: the content tree

*The blueprint for `content/docs/` — the section and entry tree, materialised as
real directories, `meta.json` ordering files, and stub entries. Structure only:
no entry is authored here.*

## Why now

The roadmap puts **page anatomy** (slice 2) next and the **content pipeline**
(slice 3) after it. This work is the tree half of slice 3, pulled ahead of slice 2.

The reason is that page anatomy designs a single entry, and an entry is easier to
design once the shelf it sits on exists — breadcrumbs, "See also" targets, and the
section-overview entry type all need real neighbours to be exercised against.
Pulling the tree forward also front-loads the decision that is most expensive to
reverse (URL shape), while the site has three pages and nothing is deployed.

`ROADMAP.md` gains a row for this and slice 3 loses its tree half.

## Scope

In:

- The directory tree under `content/docs/`, with `meta.json` per directory.
- A stub `.mdx` for every entry we intend to document in Language and Standard
  Library, plus section overviews everywhere.
- Relocating the two authored entries (`string.format`, `math.tointeger`) into it.

Out:

- Any prose. Stubs carry frontmatter and a single placeholder line.
- Sidebar *rendering* changes. The sidebar already derives from the page-tree;
  this work changes the tree it derives from, not `Sidebar.tsx`.
- Compat data for the new entries.
- C API leaves (see below).

## URL shape

Directory = hierarchy = URL = breadcrumb, following MDN's slug convention
([mdn-case-study.md](../research/mdn-case-study.md), §2 and §5), with the leaf as
the **bare member name** and the `title` as the **dotted symbol**:

| | |
|---|---|
| File | `content/docs/standard-library/string/format.mdx` |
| URL | `/docs/standard-library/string/format` |
| Breadcrumb | Standard Library › string › `string.format` |
| `title` | `string.format` |

The one deliberate departure from mirroring: the selected version stays a `?v=`
query param and never becomes a path segment, so each entry keeps one canonical
URL ([luadocs-features.md](../research/luadocs-features.md), F2).

Both existing entries move. `/docs/string.format` and `/docs/math.tointeger`
cease to exist; nothing is deployed, so no redirects are owed.

## Stub anatomy

```mdx
---
title: string.gsub
description: ""
entry-type: function
---

<!-- Not yet written. -->
```

Three decisions embedded here:

- **`entry-type`** is added to the schema in `src/lib/source.ts` as an optional
  enum: `function | construct | constant | overview | guide`. It records the one
  fact the blueprint genuinely knows — which section order from
  [page-structure.md](../research/page-structure.md) the entry follows. Nothing
  reads it yet; slice 2 switches the template on it instead of re-deriving it.
- **`lua-compat` is omitted.** The key must resolve into the compat dataset, and
  ~285 stubs pointing at absent data would either break the version-support strip
  or demand ~285 empty JSON files. A stub gains the key when it gains content.
- **`description` is empty**, not invented. An invented description is content,
  and it would survive into search and `llms.txt` unreviewed.

Section overviews (`index.mdx` in each directory) get `entry-type: overview` and
a plain-text list of the section's entries, per the grouped-index shape in
page-structure.md. Names become links as entries are authored.

## Version-only symbols

Every symbol gets exactly **one** file regardless of which versions have it —
`math.pow`, `table.maxn`, `loadstring`, `setfenv`, `math.tointeger` alike. The
availability bound is a delta in compat data, never a per-version file fork
([ADR 0001](../adr/0001-single-canonical-docs-with-version-deltas.md)).

The enumeration below was written from the 5.1–5.4 manuals and then checked
against the [5.5 manual](https://www.lua.org/manual/5.5/) — its identifier index,
its section outline, and its "changes since 5.4" list. Six corrections came out of
that check and are folded in below:

| Correction | Source |
|---|---|
| `table.create` is new in 5.5 | changes list; 5.5 index |
| `global` declarations are new in 5.5 — a declaration form, not just a scope | changes list; §3.3.7 is retitled "Variable Declarations" |
| **Named vararg tables** are new in 5.5 | changes list |
| `math.frexp` / `math.ldexp` are **present in 5.5**, so they are not 5.1–5.2-only | 5.5 index |
| §3.4.12 "Lists of Expressions, Multiple Results, and Adjustment" had no entry | 5.5 outline |
| §6.5.2 "Format Strings for Pack and Unpack" had no entry | 5.5 outline |

Named vararg tables are folded into the existing `varargs` entry as a delta rather
than given their own file — they are a new form of the same construct, which is
exactly what a delta is for.

Three further 5.5 changes are **change notes on existing entries, not new files**:
for-loop variables became read-only, floats now print with enough digits to round-
trip, and `utf8.offset` also returns the character's final position. The rest of
the 5.5 changes list (external strings, `luaL_openselectedlibs`, `luaL_makeseed`,
incremental major collections, compact arrays, dump/undump interning) is C API or
implementation-internal and touches no entry here.

One item stays open: **`__pairs` and `__ipairs`**. Neither appears in §2.4's
metamethod list in the 5.5 manual, but neither appears in 5.4's §2.4 either —
they are documented under `pairs` in §6.2, which the fetched manual text truncated
before reaching. Both keep an entry; confirming whether `__pairs` survives into
5.5 is a task in the implementation plan and affects compat data, not the tree.

## The tree

```
content/docs/
├─ index.mdx
├─ learn/
├─ guides/
├─ language/
├─ standard-library/
└─ c-api/
```

### `learn/` and `guides/`

Overviews only, plus stubs for the guides already named in the roadmap's
"deliberately unscheduled" list: `lua-in-the-wild`, `luarocks-and-the-ecosystem`,
`how-metatables-work`, `history-of-lua`. `learn/index.mdx` is the curated ordering
of guides, not a content type of its own ([CONTEXT.md](../../CONTEXT.md)).

### `language/` — 74 entries

Sub-grouping follows the manual's own §2–§3 outline, so a reader who knows the
manual can find things where they expect them.

| Directory | Entries |
|---|---|
| `lexical-conventions/` | comments, identifiers-and-keywords, numeric-literals, string-literals |
| `values-and-types/` | nil, boolean, number, string, table, function, userdata, thread, type-coercion |
| `variables-and-scope/` | global-variables, local-variables, upvalues-and-closures, scope-rules, variable-attributes |
| `statements/` | assignment, do-blocks, if, while, repeat, numeric-for, generic-for, break, goto, return, function-declarations, local-declarations, global-declarations, to-be-closed-variables |
| `expressions/` | arithmetic-operators, bitwise-operators, relational-operators, logical-operators, concatenation, length-operator, operator-precedence, table-constructors, function-calls, method-calls, anonymous-functions, varargs, multiple-results |
| `metatables/` | index, newindex, call, tostring, len, eq, lt, le, concat, unm, arithmetic-metamethods, bitwise-metamethods, gc, close, mode, name, metatable, pairs, ipairs |
| `environments/` | env, the-global-environment |
| `error-handling/` | error-objects, protected-calls, error-levels, warnings |
| `garbage-collection/` | incremental-mode, generational-mode, weak-tables, finalizers |
| `coroutines/` | *(overview only — the functions live in the library)* |

`to-be-closed-variables` sits under `statements/`, not `garbage-collection/`,
because the manual makes it §3.3.8 — a statement-level construct that happens to
involve finalization.

Metamethod leaves drop the `__` prefix in the slug and keep it in the title
(`metatables/index` → title `__index`), because a leading double underscore in a
URL is noise. The seven arithmetic and six bitwise metamethods are grouped into
one entry each rather than thirteen near-identical pages.

`length-operator` already exists as a hand-written prototype in
[`docs/research/prototype/`](../research/prototype/) and is the model for the
construct entry type.

### `standard-library/` — 171 entries

| Directory | Count | Entries |
|---|---|---|
| `basic/` | 31 | assert, collectgarbage, dofile, error, getfenv, getmetatable, ipairs, load, loadfile, loadstring, module, next, pairs, pcall, print, rawequal, rawget, rawlen, rawset, require, select, setfenv, setmetatable, tonumber, tostring, type, unpack, warn, xpcall, _G, _VERSION |
| `coroutine/` | 8 | close, create, isyieldable, resume, running, status, wrap, yield |
| `package/` | 10 | config, cpath, loaded, loaders, loadlib, path, preload, searchers, searchpath, seeall |
| `string/` | 19 | byte, char, dump, find, format, gmatch, gsub, len, lower, match, pack, pack-formats, packsize, patterns, rep, reverse, sub, unpack, upper |
| `utf8/` | 6 | char, charpattern, codepoint, codes, len, offset |
| `table/` | 12 | concat, create, foreach, foreachi, getn, insert, maxn, move, pack, remove, sort, unpack |
| `math/` | 35 | abs, acos, asin, atan, atan2, ceil, cos, cosh, deg, exp, floor, fmod, frexp, huge, ldexp, log, log10, max, maxinteger, min, mininteger, modf, pi, pow, rad, random, randomseed, sin, sinh, sqrt, tan, tanh, tointeger, type, ult |
| `io/` | 14 | close, flush, input, lines, open, output, popen, read, stderr, stdin, stdout, tmpfile, type, write |
| `io/file-methods/` | 7 | close, flush, lines, read, seek, setvbuf, write |
| `os/` | 11 | clock, date, difftime, execute, exit, getenv, remove, rename, setlocale, time, tmpname |
| `debug/` | 18 | debug, getfenv, gethook, getinfo, getlocal, getmetatable, getregistry, getupvalue, getuservalue, sethook, setfenv, setlocal, setmetatable, setupvalue, setuservalue, traceback, upvalueid, upvaluejoin |

Three entries in that table are not symbols, each matching a subsection the manual
itself breaks out: `string/patterns` (§6.5.1) documents the pattern language,
referenced by five functions and belonging in one place, and `string/pack-formats`
(§6.5.2) does the same for the pack/unpack format strings. `io/file-methods/`
holds the `file:*` methods, whose titles are `file:read` and so on.

`math.frexp` and `math.ldexp` are the awkward pair: dropped from the documented
surface in 5.3 and 5.4 (available only under a compatibility flag), but documented
again in 5.5. They get one entry each like everything else, and their compat data
carries a gap rather than a clean `removed` bound — worth knowing before the
compat schema meets them.

`math.pi` and `table.sort` also exist as prototypes and are the models for the
constant and function entry types.

### `c-api/` — groups only

Stubbed to group level, not leaf level: `stack-manipulation/`, `types-and-values/`,
`calling/`, `error-handling/`, `references-and-registry/`, `userdata/`,
`coroutines/`, `debug-interface/`, `auxiliary-library/` — nine overviews and no
leaves.

The C API is ~250 `lua_*`/`luaL_*` functions, more than Language and Standard
Library combined, and none of it can carry a runnable example. Stubbing its leaves
would double the tree in exchange for the least-trafficked area of the site. The
group overviews are enough to prove the shape; leaves arrive when someone authors
there.

## Verification

The tree is structural, so verification is structural:

- `npm run build` prerenders every stub without error — this is the real test, since
  a bad `meta.json` reference or a schema violation fails the build.
- The page-tree yields the expected top-level groups in order, and the two moved
  entries resolve at their new URLs.
- `entry-type` accepts the five valid values and rejects a sixth, matching how
  `lua-compat` already rejects unknown keys.
- Every `.mdx` under `content/docs/` is either a stub or one of the two authored
  entries — no half-written third state.

## Consequences

- The sidebar becomes ~285 entries of mostly-empty pages. This is fine while
  nothing is deployed and is the point of the exercise; slice 8 (deploy) must not
  ship with the tree in this state, and the roadmap should say so.
- `llms.txt` and the search index will both cover the stubs. Neither is wired to
  anything reader-facing yet.
- Authoring an entry becomes "fill in a file that already exists at the right
  URL," which is the outcome slice 3 wants.

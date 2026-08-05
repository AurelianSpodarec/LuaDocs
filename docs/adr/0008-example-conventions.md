# How examples are written

Every example on the site is code a reader could have written for a real problem,
readable without a decoder ring. Six rules govern it:

1. **Names are spelled out, in `snake_case`.** `item_count`, not `n`. `template`, not
   `fmt`. No single-letter identifiers, including loop variables.
2. **A name says what the value *is*, never what type it is.** `grocery_list`, not
   `table`. `item_count`, not `number`.
3. **No local may shadow a global the standard library defines.** `string`, `table`,
   `math`, `type`, `select`, `next` and their neighbours are live values; binding over
   one silently breaks the rest of the example.
4. **Examples use real data.** A grocery list, a config table, a log line — never
   `foo`, `bar`, `baz`.
5. **Every example is self-contained.** It runs on its own, in any order, and depends
   on no other example's state.
6. **Expected output is a trailing comment**, and an example the browser cannot run
   says so.

The **Syntax** block is the one place these do not apply: it quotes the manual's own
parameter names (`formatstring`, `···`), which are the documented API surface and not
ours to rename.

## Why

### Spelled out, because the reader is mid-problem

A reference entry is read by someone who already has a bug. They scan the example,
not the prose. `local n = #t` requires holding two bindings in your head to read one
line; `local item_count = #grocery_list` requires none. The manual writes for someone
implementing Lua, and can afford `s` and `n`. We write for someone using it.

The cost is real and accepted: `for index, item in ipairs(grocery_list)` is longer
than `for i, v in ipairs(t)`, and departs from what most Lua in the wild looks like.
Consistency across 292 entries is worth more than matching an idiom the reader can
adopt on their own once they understand the call.

### `snake_case`, because this site is standard Lua

[ADR 0002](0002-scope-standard-lua-only.md) scopes the site to standard Lua and puts
Roblox and host embeddings explicitly out of it. `snake_case` is what the reference
manual, *Programming in Lua*, and the common Lua style guides use; `camelCase` reaches
Lua largely through Luau and Garry's Mod. Following the Roblox idiom on a standard-Lua
site would be quietly off-key on every page.

### Type-named locals, because rule 1 has a trap in it

"Spell it out" points straight at the worst available name. The obvious spelled-out
name for a string is `string`, for a table is `table`, for a number is `number` — and
the first two shadow the libraries this site documents. `local string = "hi"` makes
every later `string.format` in the same example a runtime error, and it will happen in
an example *on the `string` page*.

Rule 3 catches the dangerous half. Rule 2 exists because the safe half is still bad
writing: `number` tells the reader the type, which the value already told them, and
withholds the only thing they wanted to know — what it is *for*.

### Real data, because recognition is the point

`local t = {1, 2, 3}` demonstrates the API. `local grocery_list = { "cocoa", "flour" }`
demonstrates the API and shows the reader their own problem in it. The second costs
nothing and is the difference between an example that is read and one that is skipped.

### Self-contained, because ours are editable

Every inline example is individually runnable and individually editable. A chain —
example 2 relying on a local from example 1 — breaks the moment a reader edits the
first one, which is the whole feature. Examples also run automatically on load, so a
chained example would fail before anyone touched it.

### Expected output, even though it now runs

An example prints its real output in the browser. The comment looks redundant there
and is not, because three surfaces carry the code without a runtime: the prerendered
page before hydration, the `.md` route, and `llms.txt`. All three are read.

It is also the only assertable statement of what an example *should* do. The roadmap's
content-pipeline slice wants CI to prove every runnable example still runs; the comment
is what it compares against.

## Consequences

- Rules 1 and 3 are mechanically checkable and are enforced by test over every
  `<RunnableExample>` in written content, not by review. Rules 2, 4 and 5 are
  judgement and stay human.
- Existing examples predate this and are non-conforming. `string.format`'s current
  example uses `"Ada"` and `36`, which is real data with no locals at all; entries
  authored from here follow the rules, and older ones are corrected when touched.
- The `Syntax` carve-out means one entry shows two naming styles — the manual's in the
  signature, ours in the examples below it. That is the honest presentation: the
  signature is a quotation and the examples are ours.
- A "no single-letter identifiers" rule has no exception for `i`, `j`, `k`. This will
  read as unusual to experienced Lua programmers, and is the deliberate cost of
  writing for the reader who is not one.

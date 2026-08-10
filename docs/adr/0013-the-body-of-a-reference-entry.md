# The body of a reference entry

[`page-structure.md`](../research/page-structure.md) fixes an entry's **section order** and
puts Parameters, Return values and Errors beneath Syntax. It never says what a **row** in
those lists contains, and 292 entries were authored into the gap. This ADR closes it.

Six rules:

1. **Parameters and Return values are one shape: name, then type.** A parameter adds
   `optional` and, when it has one, `default`.
2. **The type field names what the call expects** — the manual's word for it. Coercion is
   prose. Optionality is never spelled as a type union.
3. **A name says what the argument is for**, and comes from the canonical table below.
   No shorthand, no Lua keyword, no library or type name.
4. **A return's name is a label this site chose**, not a claim traced to the manual. It is
   required except on `type="none"`.
5. **`## Use cases` sits between Examples and Gotchas** — three to five one-line tasks.
6. **A paragraph earns its place or goes.** The summary states the behaviour once; the
   Description does not restate it.

Rule 4 is the only rule here that permits an invention, and rule 3 is what keeps it
disciplined.

## Why

### The lists are asymmetric, and it is a bug, not an infelicity

`Return.tsx` takes `type` and no name. `Param.tsx` takes `name` and no type. So an entry
declares that `table.concat` **returns** a string and leaves a reader to infer from prose
that `list` is a table.

The missing half of each is doing real damage in opposite directions.

**Twenty-four entries** return two or more values of the same type, and render as
identical `<dt>` terms in a row with nothing to tell them apart — among them
`collectgarbage`, `xpcall`, `load`, `next`, `pairs`, `require`, `tonumber`,
`getuservalue`, `math.max`, `math.min`, `math.atan`, `math.log`, `io.read`, `io.write`,
`file-read`, `file-seek` and `file-write`. `string.find` is the clearest case: two
`integer` rows, and its own second row reaches for names the page does not have —

> `string.sub(s, start_index, end_index)` is the text that matched

`start_index` and `end_index` appear **nowhere else on the entry**. The prose had to
invent them because the schema would not let it declare them. That is the schema being
wrong, evidenced by an author working around it.

In the other direction, 293 parameters carry no type at all. The information is not merely
absent from the field — it is often absent from the entry, because a description written
beside a type field says different things than one written instead of it.

### `string|nil` is the one thing not to copy from the old site

The old luadocs.com typed an optional parameter as `string|nil`, and it reads as the
obvious fix. It is wrong twice.

It is wrong about what optional means. `table.concat`'s separator is not "a string or
nil" — it is **absent**, and absence is not a value. Writing `nil` into the type tells a
reader that passing `nil` explicitly is a documented way to ask for the default.

For some functions that is flatly false. `table.insert` dispatches on **arity**: called
with three arguments it inserts at a position, called with two it appends. Passing an
explicit `nil` as the position is not "take the default", it raises. A `number|nil` there
would be a documented lie, and it is exactly the kind of claim
[ADR 0010](0010-entries-are-written-from-the-manual.md) exists to keep off the page.

Optional and default are therefore separate fields. A default also needs to hold prose —
`#list`, "the whole string", "the running coroutine" — which a type union could not carry
even where it was true.

### The type promises what the call expects, because promising more invites reliance

Lua coerces a number to a string throughout the `string` library, so `string.rep(5, 3)`
works. Documenting the parameter as `string or number` would be more literally true of the
implementation and worse documentation: it spreads `or number` across most of a library,
and it reads as an invitation to depend on a coercion the manual is lukewarm about and 5.4
tightened.

The old site agrees, and its own type field is the evidence — it types the table argument
as `table`, not `table or string`.

Coercion is still documented, just not in a field two words wide. `table.concat` already
does it the right way: its Errors section says a position holding anything but a string or
a number raises, and a Gotcha explains that there is no conversion step. That is the
pattern.

### One concept had six names because nothing fixed them

Grepped across `content/docs`, the same concept is labelled differently on neighbouring
entries:

| Concept | Names in use before this ADR |
| --- | --- |
| a format string | `fmt`, `format`, `formatstring` |
| a function argument | `f`, `function`, `callback`, `hook` |
| an object | `o`, `obj`, `object` |
| a module name | `modname`, `module`, `libname` |
| a value | `v`, `value`, `v1`, `val1` |
| a table | `t`, `table`, `t1`, `t2` |
| userdata | `u`, `udata` |

This is not a style complaint. Three spellings of one concept means a reader who has
learned `fmt` on one entry meets `formatstring` on the next and cannot tell whether
something different is meant. The names came from the manual, one entry at a time, and the
manual is not consistent either — so authoring from the manual reproduces its
inconsistency unless something else fixes the name.

Two of those names are worse than inconsistent. **`function` and `local` are Lua
keywords**, and `table` and `string` name both a library and a type — so a row renders
`table` in the name column and `table` in the type column, which reads as a mistake. The
tree currently holds `<Param name="local">` twice, `<Param name="function">` three times
and `<Param name="table">` twelve times.

### `first` and `last`, not `start` and `end`

`i` and `j` are the manual's names for the ends of a run and say nothing. The obvious
expansion is `start`/`end`, and `end` is a Lua keyword — in an entry whose Syntax block is
Lua, a parameter named `end` is unreadable. `first`/`last` also states that both ends are
included, which is the fact readers get wrong.

### `x` and `y` survive in `math`, and only there

Rule 3 kills shorthand because shorthand is an abbreviation of a real word. `x` is not.
It is the mathematical convention, it is what the manual, every textbook and every other
language's reference uses, and `math.sin(angle)` is not clearer than `math.sin(x)` — it is
narrower, since the argument is in radians and "angle" invites degrees. Expanding it would
lose meaning rather than add it.

The carve-out is scoped to the `math` library by name so it cannot spread. `x` outside
`math` is shorthand for something and expands.

### Use cases, because the reference answers a question nobody asked first

Measured in [`old-site-content.md`](../research/old-site-content.md): the old site carries
a Use Cases section on `string.format` and `string.gsub` — three one-line tasks each — and
we carry nothing equivalent.

Our entries answer *what does it do* and *how does it behave at the edges*. Neither is
*what would I reach for this for*, and the two devices that look like they cover it do
not: an Example heading is a task but sits past the Description, and a See also gloss
describes a neighbour rather than this entry.

It goes after Examples rather than before them because it is a summary of ground already
walked, not a promise about ground to come — and a reader who wants it early gets it from
the right-hand rail, which is what the rail is for.

### A word budget would cut the wrong sentences

We run 2–4× the old site's prose. Most of that is Errors, Gotchas, version deltas and a
real Description, which is to say most of it is the reason to prefer us.

Some is repetition. `table.concat` states in its summary that the separator goes between
each pair of neighbours, and states it again in the first line of its Description. At 963
words for a four-argument call, and 1186 for `math.random`, that is worth a rule — but a
line count would delete an Errors bullet to save a redundant paragraph. Rule 6 names the
redundancy instead, and follows the shape finding #9 already established for overviews:
what goes after the example is whatever the example earned.

## The canonical table

A concept gets one name site-wide. An entry may override only where the role has an
established term, and only from this column.

| Concept | Canonical | Override permitted |
| --- | --- | --- |
| a format string | `format` | — |
| a separator | `separator` | — |
| a position in a sequence | `position` | — |
| the ends of a run | `first`, `last` | — |
| a userdata | `userdata` | — |
| an upvalue | `upvalue` | — |
| an option | `option` | — |
| a replacement | `replacement` | — |
| a count | `count` | — |
| a coroutine | `coroutine` | — |
| the string operated on | `text` | `subject` — the string a pattern searches |
| a function argument | `callback` | `comparator` — `table.sort`; `hook` — `debug.sethook` |
| a table argument | `list` when ordered, `table_argument` when not | — |

Multi-word names are `snake_case`, matching example identifiers under
[ADR 0008](0008-example-conventions.md).

`···` stays as it is. It is the manual's varargs notation, not an abbreviation of a word.

## Consequences

- `Param` gains `type`, `optional` and `default`; `Return` gains `name`. Both render as the
  same two-column term list, so the two sections stay visually one device.
- **293 parameters and 266 return values need editing** across 152 function entries — 280
  `<Return>` tags less the 14 carrying `type="none"`. Renaming is not mechanical: prose
  references the names (`Omitted, it is `#list``, "`j` is a position to read"), so a
  rename edits sentences too. That migration is a slice with its own plan, not a step in
  this ADR.
- `entry-anatomy.test.ts` is where rules 1, 3 and 4 become enforceable — every `<Param>`
  carries a type, every `<Return>` but `none` carries a name, and no name is a keyword, a
  library name, or absent from the canonical table. Rule 9's failure mode was drift, and a
  table nothing checks drifts the same way.
- **[ADR 0009](0009-type-names-across-versions.md) needs the amendment recorded there.** It
  states that `<Return type>` is the only place a type is declared as data, which rule 1
  makes false, and its `NumericTypeNote` fires only above the returns list. Parameters that
  will now declare `integer` — `first`, `last`, `position`, `count` — carry the same
  pre-5.3 anachronism and want the same disclosure.
- Rule 5 adds a section to 152 entries. It is three lines each and it is the only rule here
  a reader sees as new content rather than as a tidier version of what was already there.
- Rule 6 is a judgement, not a check. No test can tell a summary restated from a summary
  developed, which is why it is written as what to look for rather than as a limit.

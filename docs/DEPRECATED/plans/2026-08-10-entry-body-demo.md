# Worked example — `string.find` under ADR 0013 and 0014

*A **shape** demo, not a draft. [ADR 0010](../adr/0010-entries-are-written-from-the-manual.md)
forbids draft prose in implementation plans, which is why this is a separate document and
why it **carries no new factual claims**: every sentence below is the shipped
[`string/find.mdx`](../../content/docs/standard-library/string/find.mdx) verbatim, rearranged.
The genuinely new content is four type words, two defaults and a Use cases section, each
marked ⚠ and each needing manual verification before it ships.*

`string.find` was chosen because it exercises more of the two ADRs at once than any other
entry: two same-type returns (the bug), a parameter rename under the override clause, an
optional-with-default, an `integer` parameter that triggers the ADR 0009 amendment, and a
shared vocabulary needing an ADR 0014 rule-4 heading.

## Before

```mdx
<Parameters>
  <Param name="s">The string to search.</Param>
  <Param name="pattern">The [pattern](…/patterns) to look for — or, with `plain` switched on, literal text.</Param>
  <Param name="init">The position to start searching from. Omitted, the search starts at the first byte.</Param>
  <Param name="plain">`true` turns pattern matching off, making this a search for `pattern` as it stands.</Param>
</Parameters>

<Returns>
  <Return type="integer">Where the match starts. …</Return>
  <Return type="integer">Where the match ends. That byte belongs to it, so `string.sub(s, start_index, end_index)` is …</Return>
  <Return type="string or integer">Then one value per capture …</Return>
</Returns>
```

Rendered, the Return values list is three terms reading `integer`, `integer`,
`string or integer` — the first two indistinguishable — above a description that refers to
`start_index` and `end_index`, which appear nowhere on the page.

## After

```mdx
## Syntax

```lua
string.find(subject, pattern [, start_position [, plain]])
```

<Parameters>
  <Param name="subject" type="string">The string to search.</Param>
  <Param name="pattern" type="string">The [pattern](/docs/standard-library/string/patterns) to look for — or, with `plain` switched on, literal text.</Param>
  <Param name="start_position" type="integer" optional default="1">The position to start searching from. Omitted, the search starts at the first byte.</Param>
  <Param name="plain" type="boolean" optional default="false">`true` turns pattern matching off, making this a search for `pattern` as it stands.</Param>
</Parameters>

<Returns>
  <Return name="start_index" type="integer">Where the match starts. A search that finds nothing returns `nil` on its own, with nothing after it.</Return>
  <Return name="end_index" type="integer">Where the match ends. That byte belongs to it, so `string.sub(subject, start_index, end_index)` is the text that matched and the match is `end_index - start_index + 1` bytes long.</Return>
  <Return name="captures" type="string or integer">Then one value per capture the pattern has, in the order the captures open — after the two indices, not instead of them. A pattern that captures nothing adds nothing here.</Return>
</Returns>
```

Rendered as a two-column term list:

```
Parameters
  subject          string                        The string to search.
  pattern          string                        The pattern to look for — or, with plain…
  start_position   integer   optional, 1         The position to start searching from…
  plain            boolean   optional, false     true turns pattern matching off…

Return values
  ⓘ Before 5.3 every number was a float; integer names a subtype…    ← ADR 0009, now also above Parameters
  start_index      integer    Where the match starts…
  end_index        integer    Where the match ends…
  captures         string or integer    Then one value per capture…
```

### The ADR 0014 rule-4 heading

New `##`, in the bespoke slot between Description and Examples:

```mdx
## The pattern notation

`pattern` is written in Lua's own matching notation, not in regular expressions — a
smaller set of classes, quantifiers and captures with no alternation and no backtracking
control. [Patterns](/docs/standard-library/string/patterns) is the full reference.
```

Two sentences, both assembled from claims `patterns.mdx` and this entry already make. What
it buys is the right-hand rail: `string.find`'s rail becomes Syntax, Description, **The
pattern notation**, Examples, Use cases, Gotchas, See also — so a reader scanning it can
see that the notation is documented. Today it cannot.

### The Use cases section ⚠

Between Examples and Gotchas. Genuinely new content, and the only part of this demo not
recoverable from the shipped entry:

```mdx
## Use cases

- **Locating a delimiter** — finding where to cut, then handing the positions to `string.sub()`.
- **Testing for a substring safely** — with `plain` on, an ordinary containment check that cannot misread punctuation as notation.
- **Walking every match by hand** — feeding the previous end index back in, when `string.gmatch()`'s loop is the wrong shape.
```

Three tasks, one line each, each already demonstrated by one of the entry's three examples
— which is the test of whether the section is honest rather than filler.

## What the demo exposed

Four things, three of them problems with the ADRs rather than with the entry.

### 1. `start_position` versus `first`/`last` — an unresolved tension

ADR 0013 rule 7 sends `i`/`j` to `first`/`last`. That rule was written for the pair that
bounds a run — `table.concat`'s and `string.sub`'s `i` and `j`. `string.find`'s `init` is a
lone starting point with no partner, and `first` without a `last` reads like half of
something.

`start_position` is used above, and it is not obviously right: the canonical table says a
position is `position`, and now three spellings of a position-ish idea are in play —
`position`, `first`/`last`, `start_position`. That is the `fmt`/`format`/`formatstring`
shape reappearing inside the rule meant to prevent it.

**Not settled by this demo.** The options are to accept `start_position` as a distinct
concept (a search's origin, not a range bound), or to fold it into `first`, or to widen the
canonical table with an explicit "a lone starting point" row. It needs deciding before the
migration touches `string.find`, `string.gmatch`, `string.match` or `io.file-seek`.

### 2. Return names were not invented — the entry already had them

`start_index` and `end_index` are what the shipped prose and all three shipped examples
already call these values:

```lua
local start_index, end_index = string.find(log_line, "WARN")
```

So rule 4's "a return's name is a label this site chose" understates it. On any entry whose
examples destructure the returns, the names already exist in the example code and the
schema simply could not hold them. The migration should **read the examples first** and
adopt their identifiers rather than choosing fresh ones — which is both cheaper and gives
prose, examples and the returns list one vocabulary instead of three.

### 3. `plain` survives rule 3 unchanged, and that is the rule working

`plain` is a word, not an abbreviation, and it says what the argument does. `literal` might
be marginally clearer; the manual says `plain`, and rule 3 asks whether a name says what
the argument is for, not whether a better synonym exists. Renaming here would be churn.

Worth recording because most of the migration will look like this: the rule leaves a name
alone. Only the shorthand moves.

### 4. `subject` earns its override

`s` → `text` is the canonical; `subject` is the permitted override for the string a
pattern searches, and this is the entry it was written for. Reading the result confirms it:
`string.find(subject, pattern …)` states the relationship between the two arguments in a
way `string.find(text, pattern …)` does not.

## Claims needing manual verification before this ships ⚠

Per ADR 0010, none of these are settled by the shipped entry's prose and none can be
checked from this machine — there is no vendored manual and lua.org was unreachable during
the earlier research pass.

| Claim | Status |
| --- | --- |
| `pattern` is typed `string` | Very likely; the manual's signature says so. Unverified. |
| `start_position` is typed `integer` | Prose says "a position in `s`, counted from 1"; subtype wording needs the 5.3+ manual. |
| `start_position` defaults to `1` | Prose says the search starts at the first byte. Consistent, not quoted. |
| `plain` is typed `boolean` | Prose says `true` turns matching off. The manual may permit any truthy value. |
| `plain` defaults to `false` | Derived from the prose, not stated by it. |
| `captures` is the right collective name | Site label, no manual claim. Safe. |

The `plain` row is the one to be careful with: if the manual says the argument is merely
*tested* for truth rather than typed boolean, then `boolean` is the ADR 0013 rule 2
question — what the call expects versus what it accepts — and `boolean` is the right answer
under that rule regardless. Worth confirming rather than assuming.

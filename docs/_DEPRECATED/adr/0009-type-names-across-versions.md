# Type names across versions

An entry's **Parameters** and **Return values** name types as Lua 5.5 names them —
`integer` where 5.5 says integer — and the site explains the one place that is
anachronistic **once, globally**, rather than in every entry it touches.

Three rules:

1. **The type field is base content.** It is written against the default version, like
   all base prose ([ADR 0001](0001-single-canonical-docs-with-version-deltas.md)).
2. **`integer` is not weakened to `number`** to accommodate 5.1 and 5.2.
3. **The gap is disclosed by the renderer, not by the author.** When the selected
   version is 5.1 or 5.2, a `Return values` list that names `integer` carries a standing
   note saying the subtype does not exist there. No entry writes it.

`<Return type>` is the only place on an entry where a type is declared as data rather
than written into prose, which is what makes rule 3 placeable at all. A parameter
described as "an integer position" is prose, and is covered by the same note appearing
above it on the entries where it matters.

## Why

### It is one fact, not three hundred

Lua 5.3 introduced an integer subtype. Before it, every number was a float. So
`string.len()` returning `integer` is precisely true for 5.3, 5.4 and 5.5, and an
anachronism for 5.1 and 5.2.

That is not a fact about `string.len`. It is a fact about Lua's numeric model, and it is
identical on every entry that returns a count, a length, an index or a byte —
`string.find`, `string.byte`, `string.packsize`, `string.rep`, `os.time`, `math.floor`,
`#`, and so on down the standard library. Recording it per entry means writing one
sentence hundreds of times and maintaining it hundreds of times, to say the same thing
each time.

The version slice's own prototype finding #1 is the general form of this: a version fact
hand-repeated across an entry drifts. Repeating it across entries is the same defect at
larger scale.

### The delta model cannot express it anyway

CONTEXT.md gives a delta exactly three forms: an availability bound, a change note, or
an example variant. "The word in this field means something narrower than it did" is
none of them. `string.len` is available in 5.1 and its behaviour did not change — a
`changed_in` note there would be false, because nothing about `string.len` changed. What
changed was the language underneath it.

Adding a fourth delta form for this alone would be disproportionate, and it would invite
a fifth.

### Weakening the field is worse than the anachronism

The alternative is writing `number` everywhere. That is wrong for 5.3, 5.4 and 5.5 — the
three versions most readers are on, and the versions the base is written against — in
order to be right for two. It also discards real information: on 5.5, `string.len()`
returning an integer rather than a float is a thing a reader wants to know.

An anachronism a reader can be told about beats a vagueness that tells nobody anything.

### The reader who needs it is identifiable

This only misleads someone reading an entry *with 5.1 or 5.2 selected*. The site knows
when that is. A note surfaced exactly then, and never otherwise, reaches everyone it
concerns and nobody it does not — which is the whole argument for having a selected
version at all.

## Consequences

- `src/entry/NumericTypeNote.tsx` renders the disclosure; `src/entry/Returns.tsx` places
  it when a return names `integer` and the selected version is 5.1 or 5.2. One
  implementation, no authoring cost, correct on every entry at once, and silent on the
  entries it does not concern.
- The disclosure links to `/docs/language/values-and-types/number`, which is where the
  numeric model belongs. That entry is currently a stub; the link is correct now and
  becomes useful when it is written.
- Authors write the 5.5 type name and do not think about this. An entry that hand-writes
  a version caveat into a type description is wrong twice — it duplicates the renderer,
  and it names a version in prose, which
  [ADR 0008](0008-example-conventions.md)'s neighbouring rule already forbids outside an
  `<Errors>` bullet.
- The same reasoning extends to any other language-wide anachronism that later turns up
  in a type name — goto, integer division, bitwise operators. The rule is the shape:
  language-wide facts get one site-wide disclosure, never a per-entry delta.

## Amendment — 2026-08-10, on parameters declaring types

[ADR 0013](0013-the-body-of-a-reference-entry.md) gives `<Param>` a `type` field. Two
sentences above are now wrong, and the mechanism is now due somewhere it could not reach.

**What is wrong.** The claim that `<Return type>` "is the only place on an entry where a
type is declared as data rather than written into prose" held when it was written and does
not hold now. So does the sentence following it: a parameter described as "an integer
position" was prose *because there was nowhere else to put it*, not because a parameter's
type belongs in prose.

**What follows.** Rule 3 said the gap is disclosed by the renderer rather than by the
author, and placeability was the argument for it. Parameters are now placeable, and several
of the canonical names ADR 0013 fixes — `first`, `last`, `position`, `count` — will declare
`integer` on entries whose returns declare nothing of the kind. `string.sub` is the plain
case: it returns a `string`, so `Returns.tsx` finds no `integer`, renders no note, and a
reader on 5.1 is left with two parameters typed `integer` and no disclosure anywhere on the
page.

So `NumericTypeNote` places itself above the **Parameters** list on the same test
`Returns.tsx` already applies to returns, and an entry whose parameters and returns both
name `integer` shows it once, above the first of the two lists. One note per entry, not one
per list — it discloses a fact about Lua, and repeating it under two headings would say
twice on one page what this ADR exists to stop saying three hundred times across the site.

**What does not change.** Rules 1 and 2 are untouched: the type field is base content
written against the default version, and `integer` is not weakened to `number` to
accommodate 5.1 and 5.2. The argument for both is about the word in the field, and it does
not care which of the two lists the field sits in.

# Rendered before ratified

A decision that constrains what a reader sees is not ratified until one subject has been
**rendered** under it. The proving surface is `/demo`, it is permanent, and it is not
deleted when the decision it served has shipped.

Four rules:

1. **A decision about rendered output carries a rendered counterpart before it is
   ratified.** Page anatomy, component shape, field lists, layout, label wording. Not
   decisions with nothing to render.
2. **One subject, chosen for rule coverage.** The case that exercises the most rules at
   once, not the simplest and not the most typical.
3. **The current behaviour renders from the real components; the proposal is a copy.** Never
   an edit of the shipping component, and never a mock of the baseline.
4. **The falsifications are written down**, and the decision is amended before any content
   migrates.

## Why

### Because it has now happened three times

Every refinement in [`page-structure.md`](../research/page-structure.md) came from building,
and the document says so in its own words:

- findings #1–#3 — *"stress-tested by hand-writing five real entries in `prototype/`"*
- findings #4–#8 — *"four `string` entries built against the real components rather than by
  hand"*
- findings #9–#10 — *"the first page of the overview fork, built after the nineteen entries
  it indexes"*

Both of that document's *"this line is superseded"* amendments arrived the same way. Not one
refinement in it came from re-reading the spec.

> **Correction, 2026-08-10.** This section originally claimed `prototype/` had been deleted.
> It has not: `docs/research/prototype/` holds all five entries — `length-operator.md`,
> `math.pi.md`, `string.format.md`, `table.md`, `table.sort.md`. The claim came from checking
> for `prototype/` at the repository root, finding nothing, and concluding it was gone.

The accurate version is a better argument. Those five files are **markdown, hand-written** —
prose describing what an entry would contain, never rendered by the components that would
render it. The list above says so: findings #4–#8 came from entries *"built against the real
components **rather than by hand**"*, and it is those findings that superseded the spec in
four places, not the hand-written ones before them.

So nothing was thrown away. The gap was that a *rendered* artefact never had a home — the
prototypes were prose about pixels, and the four `string` entries that were real pixels lived
in `content/docs` as shipped pages, where they could not be set beside an alternative. `/demo`
is the first place an artefact and its alternative can sit side by side.

### Because the third time was measured

[ADR 0013](0013-the-body-of-a-reference-entry.md) was written in prose, reviewed in prose,
and committed. Then one entry — `string.find` — was rendered under its six rules before any
content moved.

**Three of the six rules were wrong**, and all three failed the same way: stated
unconditionally where they were only conditionally right.

- Rule 4 required a name on every return value. 85 of 152 function entries return exactly
  one value, where the ambiguity the rule addresses cannot occur. It bought 85 invented
  labels and fixed nothing on any of those pages.
- Rule 3 forbade Lua keywords and library names in one breath. `function` and `local` are
  keywords and genuinely break a signature; `table` and `string` are not, and MDN writes
  `array: Array` without difficulty.
- Rule 5 mandated a Use cases section on all 152 entries, including `math.sin`, where the
  only honest content is the summary one screen higher.

Rule 4's stated justification — ragged rows — was not merely over-broad but false: a
single-return entry renders one row, so there is nothing for it to be ragged against. That
error survived writing, reading and committing. It did not survive being looked at.

### Because prose review shares the author's blind spot

The failure above is not inattention. Each rule reads well, and a second person reading the
same prose would have to reconstruct the rendered result in their head to catch it — which
is the thing the author already did wrong.

The renderer has no blind spot. It shows 85 rows with invented labels, or two identical
`integer` terms, and the argument ends.

### Because the alternative is discovering it at file 200

The migration ADR 0013 implies is 293 parameters and 195 return names across 152 entries. A
rule found wrong at the two-thirds mark is 100 entries done to a rule being abandoned, and
by then the rule is expensive to change for reasons that have nothing to do with whether it
is right.

One rendered page cost under an hour.

### Why the surface is permanent

Rule 1 needs somewhere to put the artefact, and the two places this project has used instead
both fail differently. `docs/research/prototype/` is markdown, so it can describe a rendering
but never be one. A shipped entry under `content/docs` is real pixels, but it is the *current*
answer by definition — there is nowhere beside it to put the alternative, which is what a
comparison needs.

`/demo` therefore keeps pages after their decision has landed. A page that recorded why a
rule is conditional is the cheapest available answer to someone proposing to make it
unconditional again.

## What `/demo` is

An internal gallery at `/demo`, four pages at first:

| Page | Serves |
| --- | --- |
| `entry-body` | ADR 0013 — the A/B that falsified three rules |
| `entry-length` | ADR 0013 rule 6 — one entry at three lengths |
| `kitchen-sink` | every entry component at once, across all five versions |
| `example-label` | unresolved — the example card's header |

Two modes, and both are needed. A **component A/B** catches rule defects and is blind to
rhythm; a **full-page** rendering catches "this is exhausting" and is blind to fine-grained
rule errors. Rule 6 — prose economy — is only judgeable in the second, which is why the
963-word measurement sat unactioned until `entry-length` existed.

Kept out of the index three ways, because one is not enough: `noindex` on every page via one
shared `demoHead`, absence from `STANDALONE_URLS` in `src/migration/sitemap.ts`, and no link
from anywhere in the site. `robots.txt` deliberately does **not** disallow it — a `Disallow`
would stop a crawler reading the `noindex` it needs to obey, the same reasoning
[ADR 0011](0011-the-foot-of-an-entry.md)'s neighbourhood already uses for unwritten entries.

## Consequences

- ADRs 0006, 0007, 0011, 0013 and `page-structure.md` are all in this rule's scope. They are
  not retro-fitted — the rule binds decisions from here on — but a page proving any of them
  is welcome on `/demo` when one is next in question.
- ADRs 0001–0005, 0010, 0012 and 0014 are out of scope. Licensing, URL maps and sourcing
  rules have nothing to render, and demanding an artefact for them would make the rule
  something to route around.
- **The demo shell carries a version switcher.** Half of what these pages prove is version
  scoping — `<Only>` around a parameter, `<Since>` inside Errors, the numeric disclosure
  below 5.3 — and the shell is deliberately not the docs shell, so without one the kitchen
  sink asks a reader to change something they cannot reach. It did, briefly, before the page
  was looked at. The rule caught its own surface.
- A proposal component under `src/demo/` is a copy, and it is deleted when the real component
  gains the behaviour. A copy left behind after the change ships is a second renderer nobody
  is maintaining.
- `/demo` ships to production. Excluding it from the build would mean it is only viewable on
  a machine with the branch checked out, and the point is to be sendable as a link.
- `robots.txt` still says the site "has no private surface", which this makes untrue. It
  wants a sentence, and the reasoning above is what it should say.
- The portable half of this rule is `.claude/skills/render-before-ratifying/`, so it fires
  without being remembered. **Its baseline is the three failures above; its verification with
  the skill present has not been run.** That gap is recorded rather than papered over.

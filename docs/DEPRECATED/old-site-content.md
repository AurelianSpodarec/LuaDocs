# What the old luadocs.com teaches

*Measured 2026-08-10 against the live site. [ADR 0012](../adr/0012-legacy-url-migration.md)
maps the old site's **URLs**; [`mdn-case-study.md`](mdn-case-study.md) studies MDN's
**anatomy**. Nobody had studied the old site's **content**, which is what this does.*

Structure only. Per [ADR 0003](../adr/0003-dual-license-prose-and-code.md) and
[ADR 0010](../adr/0010-entries-are-written-from-the-manual.md) no prose is carried over
from it — the old site is not a source for claims, only for shape.

**The headline: it teaches us two things.** A first pass found two, one of which was wrong in
the site's favour; the correction is recorded below rather than deleted, because the mistake
is instructive — the gap looked obvious and the entry was already complete. A later pass,
prompted by looking at the old page rather than reading a summary of it, found a real second
one that the summary had thrown away.

## Confidence

Two kinds of number, labelled differently on purpose.

- **Grepped** — counted in this repository. Reliable.
- **Fetched** — read off the live site through a summarising fetch. Treat as ±20%. Good
  enough to decide whether a section exists; not good enough to quote.

## The measurement

Prose words, code excluded. Ours grepped, theirs fetched.

| Entry | luadocs.com | LuaDocs | Ratio |
| --- | --- | --- | --- |
| `table.sort` | ~210 | 902 | 4.3× |
| `string.gsub` | ~375 | 804 | 2.1× |
| `string.format` | ~375 | 508 | 1.4× |
| `table.concat` | — | 963 | — |
| `math.random` | — | 1186 | — |

Ours, grepped across all 152 function entries: **min 51 lines, median 146, max 321
(`io/file-read`), mean 150.**

## What it does better: a Use Cases section

`string.format` and `string.gsub` each carry one, sitting between Examples and See also.
Three items, one line apiece, each naming a **task** rather than a mechanism — for
`gsub`: search and replace, dynamic replacements, formatting.

We have no equivalent. Our entries answer *what does it do* (the summary) and *how does it
behave at the edges* (Description, Errors, Gotchas), and never *what would I reach for
this for* in a form that can be scanned. Two of our devices gesture at it and neither
lands: an Example heading is a task ("Joining part of a list") but sits two screens down
past the Description, and a See also gloss describes a **neighbour** ("building up the list
this reads") rather than this entry. A reader arriving cold from a search engine gets
neither.

This is the whole of what the old site has and we do not.

## What it does better, 2: the name is boxed and the type is not

On `string.pack`, the old site draws `format` in a **bordered pill** — rounded, mono, its own
box — with `string` in muted mono beside it, unboxed. Ours renders both as plain text.

Copying it is worth it for a reason the old site probably did not intend. Under
[ADR 0013](../adr/0013-the-body-of-a-reference-entry.md) a parameter row carries four things
— name, type, optional, default — and with no anchor the eye must work out where the name
stops. The pill also removes the one genuine ambiguity in the plain version, which the
rendered comparison on `/demo/entry-body` shows directly: a row whose name and type are the
same word reads as

```
table table
```

— two words with no visual grammar. Its raw text content is literally `tabletable`. Boxed, it
is a labelled thing with its type beside it, and the ambiguity is gone without renaming
anything.

That is load-bearing for ADR 0013's amended rule 3. Library and type names are *discouraged,
not forbidden*, and `table` stays permitted where no better word exists — a permission that
only survives contact with a reader if the name is visually distinguishable from its type.

**Method note.** This was missed on the first pass because that pass read a summarising fetch
of the page, which reports structure and discards presentation. It was found by looking at
the page. The same failure produced the `string.format` error below, from the same cause:
substituting a description of an artefact for the artefact. That is the argument for
[ADR 0015](../adr/0015-rendered-before-ratified.md) arriving twice in one afternoon.

## The correction: `string.format` was not a gap

The first pass reported that `string.format` has no specifier table while the old site does,
and called it the largest content gap of the comparison. Both halves were wrong.

**What is true.** Grepped: `string/format.mdx` contains no markdown table. It documents
every directive as a **bulleted list** — 13 bullets covering 18 letters (`%s %d %i %f %e %E
%g %G %a %A %x %X %o %u %c %p %q %%`), followed by a paragraph fixing the flag set (`-`,
`+`, `#`, `0`, space) and the two-digit limit on width and precision.

The old site, fetched: **6 rows**, under a heading reading "Common Format Specifiers".

So we document roughly three times as many directives as the old site, including `%p`,
plus the flags and sizing rules it does not cover at all. We are ahead here, and the
first pass reached the opposite conclusion by grepping for `^|`, finding nothing, and
treating the absence of a *table* as the absence of the *content*.

**The one thing still open.** Our entry does not mention `%F`. Whether Lua documents `%F`
at all cannot be settled from this machine: there is no vendored copy of the manual in the
repository, and lua.org was unreachable for the whole of the earlier research pass
([`site-surfaces.md`](site-surfaces.md)). Per ADR 0010 rule 4 it is recorded as unverified
rather than asserted either way.

**Why the mistake is worth keeping.** [ADR 0010](../adr/0010-entries-are-written-from-the-manual.md)
recorded that a *draft* of this entry "omitted eight specifiers the manual documents". That
correction did reach the shipped entry — as bullets. Reading the ADR and grepping for a
table reproduced the original error's shape while the entry itself was fine.

## Where copying it would make us worse

- **No callouts of any kind.** `table.sort` carries no note, no warning, no gotcha.
  `page-structure.md` calls Gotcha "LuaDocs's signature callout" and it is right to.
- **No version information.** The page is stamped "Version 5.4 Docs" and says nothing
  comparative anywhere. Our entire delta model
  ([ADR 0001](../adr/0001-single-canonical-docs-with-version-deltas.md)) is a strict
  addition.
- **No pattern documentation and no link to any.** `gsub` uses `%a%d` and `%w+` in its
  examples and explains neither, with nothing on the page pointing at an explanation.
  [`patterns.mdx`](../../content/docs/standard-library/string/patterns.mdx) is a decisive
  win, and it is the evidence for extracting a shared vocabulary rather than inlining it.
- **Overviews are near-empty.** `functions/string` is ~200 words, a flat bulleted list of
  17 functions, no per-function gloss, no example. Ours is grouped by task with authored
  glosses (finding #9 in [`page-structure.md`](page-structure.md)).
- **Globals mis-scoped.** `setmetatable`, `getmetatable`, `rawset`, `rawget`, `pairs` and
  `next` all filed under `table`. Already recorded in
  [ADR 0012](../adr/0012-legacy-url-migration.md).

## Parity

- **Every example shows its expected output.** So do ours, by
  [ADR 0008](../adr/0008-example-conventions.md).
- **Example count.** Theirs 4–5 per entry; ours 3–7. No lesson either way.

## What the tree actually does with closed vocabularies

Not a finding about the old site — a finding about ours, turned up while checking the one
above. Four forms are in use, and the split between them is principled:

| Form | Where | When |
| --- | --- | --- |
| Extracted `construct` entry | `patterns` (173 lines, 4 callers), `pack-formats` (205 lines, 3 callers) | shared and large |
| Owned by one entry, siblings link its anchor | `file-read#the-formats` ← `io.read` | shared by two, one plainly primary |
| Inline table | `os/date`, `io/open`, `io/file-seek`, `io/file-setvbuf`, `io/type`, `os/setlocale`, `globals/type`, `globals/rawget`, `debug/getinfo`, `debug/sethook`, `package/config` | single use, 2+ facts per member |
| Inline bulleted list | `string/format` directives, `globals/collectgarbage` options | single use, one fact per member |

Fourteen files carry a markdown table, of which two are the extracted entries — so **twelve
inline tables**, not the fourteen an earlier draft of this document claimed.

The table-versus-list split is the interesting part. `file-read` tabulates because each
format carries three facts (the format, what it reads, what it does at end of file);
`string.format` lists because each directive carries one. That is a real rule and it was
never written down.

## Try It, and what MDN has that we do not

Our lead example already exceeds MDN's Try It.
[`RunnableExample.tsx`](../../src/runner/RunnableExample.tsx) gives an editable
syntax-highlighted editor, Run, Reset, an Output pane, a `ran in N ms` marker proving
something executed just now, a badge when the runtime's Lua differs from the selected
version, and an *Open in Playground* link that carries the reader's own edits in the URL
hash. MDN's Try It is editable, Run, Reset, console.

What MDN has is the **label**. Its box says "Try it", which is an invitation. Ours says
`example.lua` — a filename for a file that does not exist — and says it identically on the
lead example and on every example further down. So the card announces "here is code"
rather than "you can edit this", and the lead example is not distinguishable from the
others despite doing a different job.

The interactivity is not undiscoverable, since Run and Reset sit in the toolbar. But it is
the same shape as the `string.pack` problem: the capability is built, complete, and
unadvertised at the moment a reader would use it.

## The conciseness signal

We are 2–4× longer, and most of that is earned: the old site has no Errors section, no
Gotchas, no version deltas, and on `string.format` no Description at all. Those sections
carry the length and they are the reason to prefer us.

Some is not earned. `table.concat` states in its summary that the separator goes between
each pair of neighbours, and states it again in the first line of its Description. At 963
words for a four-argument call, and 1186 for `math.random`, that is worth a rule — but a
line count would delete an Errors bullet to save a redundant paragraph. Name the redundancy
instead, following the shape finding #9 already established for overviews: what goes after
the example is whatever the example earned.

## What this feeds

- **A Use cases section, and the prose-economy rule** →
  [ADR 0013](../adr/0013-the-body-of-a-reference-entry.md).
- **The boxed name treatment** → rendered both ways on `/demo/entry-body`; wants folding into
  ADR 0013 once picked.
- **The four vocabulary forms, and `string.pack`'s discoverability** →
  [ADR 0014](../adr/0014-where-a-closed-vocabulary-lives.md).
- **`%F` in `string.format`** → unverified; needs a vendored manual.
- **The `example.lua` label** → unresolved. Recorded here; no ADR claims it yet.

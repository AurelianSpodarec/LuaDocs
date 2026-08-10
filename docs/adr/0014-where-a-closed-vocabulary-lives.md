# Where a closed vocabulary lives

Some entries take an argument drawn from a **fixed set of spellings** rather than from a
type: `string.pack`'s option letters, `os.date`'s conversion specifiers, `io.open`'s mode
strings, `collectgarbage`'s options, `string.format`'s directives. The set is finite and
authored, and where it goes has been decided sixteen times without being written down.

Four rules:

1. **Shared by three or more entries → its own `construct` entry**, in the section's
   `---Concepts---` group.
2. **Shared by two, one plainly primary → the primary owns it**, under a `##` heading the
   sibling links by anchor.
3. **Used by one entry → it stays in that entry.** A **table** when each member carries two
   or more facts; a **bulleted list** when each carries one.
4. **A vocabulary that lives elsewhere is reachable from a heading in every entry that
   takes it** — not from a prose link alone.

Rules 1–3 ratify what the tree already does. Rule 4 is the new one, and the only rule here
that requires editing entries.

## Why

### The rule already exists, four times over

Grepped across `content/docs`, four forms are in use and the split between them is not
arbitrary:

| Form | Where | Shape |
| --- | --- | --- |
| Extracted `construct` entry | `patterns` — 173 lines, read by `find`, `match`, `gmatch`, `gsub`; `pack-formats` — 205 lines, 34 rows, read by `pack`, `unpack`, `packsize` | shared, large |
| Owned by the primary, linked by anchor | `file-read#the-formats`, linked from `io.read` | shared by two |
| Inline table | `os/date`, `os/setlocale`, `io/open`, `io/file-seek`, `io/file-setvbuf`, `io/type`, `globals/type`, `globals/rawget`, `debug/getinfo`, `debug/sethook`, `package/config` | single use, multi-fact |
| Inline bulleted list | `string/format` directives, `globals/collectgarbage` options | single use, single-fact |

Fourteen files carry a markdown table; two of them are the extracted entries, so twelve are
inline.

Extraction earns its cost when the vocabulary is large and has several callers. Inlining
`patterns` would copy 173 lines four times, and finding #6 in
[`page-structure.md`](../research/page-structure.md) is the record of what a hand-replicated
fact does: the 5.4 empty-match change would need applying to all four copies, and nothing
would look broken when it was not, because the copies do not disagree with each other —
they fall out of date together.

It also earns something the sidebar makes visible: a reader who wants to know how Lua
patterns work has somewhere to go. On the old luadocs.com there is nowhere — `gsub` uses
`%a%d` and `%w+`, explains neither, and links to no explanation
([`old-site-content.md`](../research/old-site-content.md)).

### Table or list is decided by facts per member, not by taste

This is the rule that was least visible and is most useful.

`file-read` tabulates its formats because each one carries three facts — the format, what it
reads, and what it does at end of file — and a bulleted list cannot align a third column or
be scanned down it.

`string.format` lists its directives because each carries one: `%o` is an integer in octal,
and there is nothing else to say in a second column. Thirteen bullets covering eighteen
letters read better than an eighteen-row table with a column of dashes, and the paragraph
that follows them — the flag set, the two-digit limit on width and precision — is prose that
a table would have had nowhere to put.

So the two forms are not a stylistic inconsistency to be normalised. Normalising them in
either direction would make one of the two entries worse.

### `string.format` is the counter-example, not the gap

An earlier pass through this reported `string.format` as the largest content gap of the
comparison: no table, while the old site has one. Recorded here because the reasoning failed
in a way this ADR should prevent.

The grep was for `^|`, it found nothing, and the absence of a *table* was read as the
absence of the *content*. The entry documents every directive as bullets, covering roughly
three times what the old site's six rows cover, plus flags and sizing the old site omits
entirely.

**Absence of a table is not evidence.** A guard written against rule 3 must ask whether the
members are documented, not whether they are tabulated — the same check that would have
caught the mistake catches the real thing.

One item stays open: our entry does not mention `%F`, and whether Lua documents it cannot be
settled without a vendored manual. It is filed as unverified, per
[ADR 0010](0010-entries-are-written-from-the-manual.md) rule 4.

### The `string.pack` complaint was real, and it was about the rail

The reported problem was that `string.pack` has no format specification. It has one — 205
lines, 34 rows, the manual's entire alphabet (`b B h H l L j J T i[n] I[n] f d n c[n] z
s[n] < > = ![n] x X[op]` and the space option) — linked twice from the entry, from the
`format` parameter and again from the Description.

The complaint was still correct, about something else. On the old site the alphabet is a
heading **on the page the reader is already on**, so it appears in that page's table of
contents. On ours it is a sentence containing a link, and the right-hand rail is H2-only
([`page-structure.md`](../research/page-structure.md)) — so `string.pack`'s rail reads
Syntax, Description, Examples, Gotchas, See also, and gives a reader scanning it no
indication that the notation the entire function is built on is documented anywhere at all.

A reader who does not already know the alphabet exists cannot go looking for it. That is the
same failure as the entry having no table, arriving by a different route, and it is why
rule 4 says *reachable from a heading* rather than *linked*.

Rule 4 rather than abandoning extraction, because discoverability is the cheaper half of the
trade: one heading per calling entry fixes it, and nothing fixes four divergent copies of the
pattern notation.

## Consequences

- Seven entries gain a `##` heading naming the vocabulary they take and linking to it —
  `string.pack`, `string.unpack`, `string.packsize` for the format notation;
  `string.find`, `string.match`, `string.gmatch`, `string.gsub` for patterns. The heading
  carries a sentence saying what the notation is for, so the section is worth landing on
  rather than being a bare link beneath a title. `io.read` already satisfies rule 4 in
  substance and wants checking against it rather than rewriting.
- A vocabulary that gains a third caller moves from rule 2 to rule 1, and the entry that
  owned it keeps a rule-4 heading in its place. Nothing in the tree needs this today; it is
  written down so the first case is not argued from scratch.
- **The guard checks members, not markup.** An entry whose parameter references a named set
  must document or link every member of it. Written as "has a table" it would fail
  `string.format` and pass an entry with an empty one. That check belongs with the content
  checks in `tests/content/`.
- Rule 4 is checkable directly: an entry whose Parameters link to a `construct` entry
  without a heading of its own doing the same is exactly the defect this ADR was written
  for.
- The `---Concepts---` group in a section's `meta.json` is where an extracted vocabulary is
  listed, ahead of `---Functions---`, which is what `string/meta.json` already does.
  [ADR 0006](0006-sidebar-order-and-grouping.md) governs the group labels.
- `os.date`'s specifiers and `string.format`'s directives both use `%` and are **different
  sets for different functions**. They stay separate. Merging them because they share a
  sigil would produce a table wrong for both readers.

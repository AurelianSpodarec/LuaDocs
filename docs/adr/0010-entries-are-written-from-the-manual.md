# Entries are written from the manual

Every factual claim in an entry traces to a passage in the Lua reference manual that the
author read while writing. Not to memory, not to a draft, not to another documentation
site. Four rules:

1. **Read the passage first.** Before writing an entry, read its manual passage in every
   version the entry covers — not only the newest.
2. **Rewrite, never copy.** Read it, then write in the site's own voice
   ([ADR 0003](0003-dual-license-prose-and-code.md)). Reproducing the manual's sentences
   is the one failure a documentation slice cannot ship.
3. **Where the manual is silent, say what was done instead.** Behaviour established by
   running Lua or by reading `lstrlib.c` is legitimate and often necessary — but it is
   recorded as such, and it is phrased so it cannot silently become false.
4. **Where the manual cannot settle it, leave it out.** An undated claim is better than
   a dated guess.

## Why

### Because the drafts were wrong, measurably

The page-anatomy slice drafted four `string` entries from memory into its implementation
plan, then checked each against the five manuals before authoring. They needed **6, 5, 9
and 11 corrections**.

Several were not stylistic:

- A Gotcha stated that `string.len(string.gsub(...))` measures the wrong argument. It
  does not — `string.len` ignores extra arguments. Falsified in one line.
- `string.gsub`'s `n` was documented as capping *replacements*. It caps *matches*: a
  table lookup that declines still consumes one.
- `(ab)+` was explained as the `+` applying to the `b`. After a capture closes there is
  nothing for a quantifier to repeat.
- `string.format`'s directive list omitted eight specifiers the manual documents, and
  claimed `%s` accepts any value where the manual says it *expects a string*.

Every one of these is the kind of claim that reads as obviously true and is not. None
would have been caught by a test, a type-checker or a reviewer working from the same
memory.

### Because a wrong fact here is wrong in more places than it looks

Version facts drive four surfaces from one dataset — the support strip, the inline
change note, the detailed matrix, and the sidebar badge. A guessed change note is wrong
in four places simultaneously, and none of them disagree with each other, so nothing
looks broken.

The same slice caught this in the other direction: a wording difference in `string.gsub`
between 5.1 and 5.2 *looked* like a behavioural change and was not. Reading both
passages, and then `lstrlib.c`, showed the two spellings describe identical behaviour. A
change note there would have told every reader on 5.1 that something changed under them
that had not.

### Because the manual cannot be read casually

`manual.html` runs from 255 KB (5.1) to 381 KB (5.5). A network fetch truncates it part
way through §4 — *before* the standard libraries chapter begins. So the natural gesture,
"just look it up", silently returns nothing relevant and reads as an absence of
evidence. The manuals must be on disk and read locally.

Section numbers also move between versions: the standard libraries were §5 in 5.1 and
§6 from 5.2, and 5.5 inserted §6.1, pushing String Manipulation from §6.4 to §6.5.
An anchor is only valid for the manual it came from — which is why a citation names its
version ([ADR 0006](0006-sidebar-order-and-grouping.md) relies on the same fact).

## Consequences

- Entry-authoring tasks begin by reading the passage, and record the commands they ran
  and the corrections the manual forced. That record is part of the work, not overhead.
- **Draft prose does not go in implementation plans.** Writing four entries from memory
  into a plan produced four rounds of correcting fiction; a plan that says "read this
  anchor in all five manuals, then write the entry" reaches the same place without them.
  This is the single largest saving available to a content slice.
- Claims established by probe rather than by the manual are phrased behaviourally, never
  by error message text, so an upstream wording change does not make them false.
- Two `string`-section questions stay deliberately unrecorded because the manuals cannot
  settle them: whether 5.1 implemented `%f[set]` (first *documented* at 5.2), and the
  5.3 paragraph on a closing bracket or hyphen inside a set. They are noted rather than
  guessed.
- This rule is stronger than ADR 0008, which governs how examples are *written*. This
  one governs whether anything on the page is *true*.

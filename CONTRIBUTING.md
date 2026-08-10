# Contributing

**This guide is not written yet.** It is coming, and it will be amended as the project's
conventions are rebuilt — they were deprecated wholesale on 2026-08-10 and have no live home to
point at yet. See [docs/_DEPRECATED/](docs/_DEPRECATED/) for what was previously decided; treat
it as evidence, not as rules.

Until then, four things that would otherwise waste your time.

**Target `dev`, never `main`.** All work happens on `dev`. Please don't open a pull request
against `main`.

**Don't correct a fact from memory.** Every claim in an entry traces to a passage in the official
Lua reference manual, read in each version the entry covers. This sounds pedantic until you see
the number: four entries drafted from memory needed **6, 5, 9 and 11 corrections** once checked
against the manuals, and several were not stylistic — they were false. If you have found a
mistake, an issue naming the manual passage is worth more than a patch.

**Don't port prose from another documentation site**, including the old luadocs.com. Entries are
rewrites from the manual. The licence position in [LICENSE.md](LICENSE.md) depends on that being
true.

**Examples must actually run.** Every snippet executes at build time and its output is compared
against the `-- Expected output:` comment beneath it. A snippet that does not run, or whose stated
output is wrong, fails CI.

## What is most useful right now

**Not entries — yet.** 109 of 292 entries are unwritten stubs, which looks like the obvious place
to help, and it is currently blocked: the reference manuals are not vendored into this repository,
and the rule above cannot be followed without them. Vendoring them is the unlock, and it is a
better first contribution than any single entry.

Otherwise: bug reports against the site, anything about the runtime or the playground, and issues
pointing at a specific manual passage that contradicts an entry.

## Licensing your contribution

Contributing prose means licensing it under **CC BY 4.0**; contributing example code means
releasing it under **CC0 1.0**. See [LICENSE.md](LICENSE.md), which explains where the boundary
between the two falls.

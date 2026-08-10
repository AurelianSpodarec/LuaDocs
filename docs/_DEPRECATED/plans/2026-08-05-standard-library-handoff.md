# Handoff: authoring the rest of the standard library

> Written at the end of the session that finished `string`, for whoever picks up `table`,
> `math` and the rest. Everything here is either a decision already made or a thing that
> cost real time to discover. Read it before opening a plan file.

## Where things stand

`string` is complete — 20 of 20 entries. **162 stubs remain** across the standard
library:

| Section | Stubs | Section | Stubs |
|---|---|---|---|
| globals | 32 | os | 12 |
| math | 36 | package | 11 |
| io | 22 | coroutine | 9 |
| debug | 19 | utf8 | 7 |
| table | 13 | | |

The next slice is [`table` and `math`](2026-08-05-table-and-math.md) — that plan is
written and current. The sections after it have no plan yet, deliberately: write one
slice at a time, just before executing it.

**Throughput, measured rather than guessed:** roughly **4–6 entries an hour** at the
rigour below — five manuals read per symbol, every claim probed, adversarial review, fix
rounds. `table` + `math` is about eight hours. All 162 is 30–40. Plan around that number
rather than discovering it at hour six.

## The rules that bind every entry

Three ADRs, all short, all worth reading in full before the first batch:

- [**ADR 0008**](../adr/0008-example-conventions.md) — how examples are written. Spelled-out
  `snake_case`, no single-letter identifiers *including loop variables*, no local
  shadowing a standard-library global, real data, self-contained, an expected-output
  comment on every example.
- [**ADR 0009**](../adr/0009-type-names-across-versions.md) — write the 5.5 type name.
  `integer` is correct even for 5.1; the renderer discloses the gap. Never hand-write
  that caveat.
- [**ADR 0010**](../adr/0010-entries-are-written-from-the-manual.md) — every factual claim
  traces to a passage read while writing. **This is the one that matters most.** Its
  evidence is that four entries drafted from memory needed 6, 5, 9 and 11 corrections,
  several of them flatly false.

Plus two rules that emerged during `string` and are now settled:

- **A version never appears in prose.** The dataset carries *when*. The only licensed
  authored version reference is `<Since v="…" />` on an `<Errors>` bullet. A Gotcha
  carries *what*, undated.
- **A version fact belongs on every entry where it is observable**, even when the manual
  files it in a shared section. See pilot finding #6.

## Forks: three built, two not

Built, with a worked example to copy:

| Fork | Example | Shape |
|---|---|---|
| Function | `string/gsub.mdx` | Syntax → Parameters/Returns/Errors → Description → Examples → Gotchas → See also |
| Concept | `string/patterns.mdx` | **No Syntax, no single Description** — as many topic H2s as the concept needs, then Examples/Gotchas/See also |
| Overview | `string/index.mdx` | Summary (longer than "one or two sentences", *before* the example) → example → task-grouped index in H2s → See also |

**Not built — `math` forces both, and they want a human in the room:**

- **The constant fork.** `math.pi`, `math.huge`, `math.maxinteger`, `math.mininteger`.
  `page-structure.md` says a `Value` section replaces Parameters and Returns. No `<Value>`
  component exists, and it is an open question whether one is wanted or whether prose
  under a `## Value` heading is enough. Prefer the smaller answer. Also decide whether
  ADR 0009's numeric disclosure should reach the Value section — it currently only reaches
  `<Returns>`.
- **Removal.** `math.pow`, `atan2`, `cosh`, `sinh`, `tanh`, `log10`, `ldexp`, `frexp` were
  deprecated at 5.3 and removed at 5.4; `table.getn`, `maxn`, `foreach`, `foreachi` went
  earlier. Nothing has exercised `version_removed` on a real entry. The dataset carries
  the removal; **the replacement belongs in prose, undated** — "use `^` instead" is true
  in every version. Deprecation and removal are different events recorded in different
  places: read both the symbol's passage and the Incompatibilities chapter.

## The batch shape that worked

One dispatch per batch of 2–5 related symbols, one review per batch, fix rounds only for
Critical and Important findings. Each batch: research compat from the manuals → author →
verify in the browser → commit.

**Do not put draft prose in a plan.** The `string` pilot did, and it produced four rounds
of correcting fiction. A plan carries anchors and open questions; the entry is written
from the manual.

Review dispatches earn their cost — they found a Critical in the packing family (byte
order does reach floats), a Critical in `sub` (`-0` returns the whole string), and a false
claim in `char` about bytes that "cannot be typed". Give the reviewer the manuals and tell
it to probe; do not let it review from the diff alone.

## Environment, and what it costs to learn the hard way

**The manuals must be on disk.** `manual.html` is 255–381 KB and a web fetch truncates it
partway through §4 — *before* the standard libraries chapter. So "just looking it up"
silently returns nothing relevant. Recreate them in the session scratchpad:

```bash
mkdir -p manuals && cd manuals
for v in 5.1 5.2 5.3 5.4 5.5; do curl -sS -o "$v.html" "https://www.lua.org/manual/$v/manual.html"; done
```

with this extractor beside them as `passage.py`:

```python
import html, re, sys
try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')  # section text has U+2264
except AttributeError:
    pass
anchor, versions = sys.argv[1], sys.argv[2:] or ['5.1', '5.2', '5.3', '5.4', '5.5']
for version in versions:
    text = open(f'{version}.html', encoding='utf-8', errors='replace').read()
    start = text.find(f'"{anchor}"')
    if start < 0:
        print(f'===== {version}: absent'); continue
    end = text.find('<hr>', start)
    print(f'===== {version}\n{html.unescape(re.sub(r"<[^>]+>", "", text[start:end])).strip()}\n')
```

Function anchors are `pdf-table.insert`, `pdf-math.floor`. **Section anchors move between
versions** — the standard libraries were §5 in 5.1 and §6 from 5.2, and 5.5 inserted §6.1
and pushed everything down one. Check, never assume.

Three more that each cost time:

- **The dev server returns HTTP 200 for every path, including nonsense.** Fetching a URL
  proves nothing about whether a page exists. Check links against the filesystem.
- **The browser pane can report `innerWidth: 0`**, which makes every geometry measurement
  garbage — including ones that look plausible. Call `resize_window` to 1280×900 before
  trusting any layout reading.
- **Never `git add -A`.** Another session may be working in the same tree. Stage by name.
  A single `add -A` here swept an unrelated slice's files into a commit whose message
  described something else.

## The guards, and what each one catches

Six tests hold content. A batch is not done until all pass.

| Guard | Catches |
|---|---|
| `tests/content/entry-anatomy.test.ts` | A function entry missing Syntax/Parameters/Returns/See also; a `source` that disagrees with the manifest; a function or construct entry with no `lua-compat` key |
| `tests/content/examples.test.ts` | ADR 0008 rules 1 and 3 — single-letter identifiers (locals *and* loop variables), and a local shadowing any of the 31 documented globals |
| `tests/content/examples-run.test.ts` | **Every example is executed and compared to its `-- Expected output:` comment.** A wrong output fails the suite |
| `tests/content/overview-index.test.ts` | An overview's index and its directory disagreeing, in either direction |
| `tests/version/change-note.test.tsx` | A change note with unbalanced backticks, or a bare `%x` left unmarked |
| `tests/entry/*` | The components themselves |

The third is the one that changes how authoring feels: an expected-output comment is no
longer a claim, it is an assertion. Write the code, run it, record what it printed.

## Debts, named so they are not rediscovered

- **Links in an overview's index and See-also lists make no per-entry version claim.** The
  sidebar dims an entry the selected version lacks; a link in a body does not. The route
  already loads the map that would fix it (`compatByUrl`). Component work.
- **`math.tointeger` is an unwritten stub** — reverted during the anatomy pilot rather
  than authored. `math`'s slice should pick it up.
- **The `.md` route and `llms.txt` carry examples as entity-escaped JSX attributes**, and
  no version data or attribution, because the matrix and citation are route-rendered.
  ADR 0008 rule 6 names those surfaces as reasons the expected-output comment exists.
- **A CI link check must run against build output**, not the dev server, for the reason
  above.
- **`<Return type="integer">` before 5.3** is settled in ADR 0009 but the disclosure only
  reaches `<Returns>`. Revisit if the constant fork gains a `Value` section.

## One habit worth keeping

The most valuable corrections in the `string` slice came from someone reading the page and
saying "that looks wrong" — the review label, unmarked identifiers in change notes, the
"rewritten" licensing claim, a notice that scrolled away. None of them would have been
caught by a test or a reviewer agent. Budget for a human reading the output, not only for
agents producing it.

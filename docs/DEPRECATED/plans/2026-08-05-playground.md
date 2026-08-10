# Playground Implementation Plan

**Goal:** Build the standalone full-page editor — slice 5 of the roadmap — as the escape
hatch from an inline example rather than as a separate product.

**Architecture:** A new `src/playground/` module. Four pure, unit-tested files carry the
logic (`lexLua`, `tidy`, `shareUrl`, `errorLine`); two components carry the surface
(`Editor`, `Playground`). The runner is untouched — the playground calls the same
`runLua(code, opts)` worker the inline examples call, so there is one execution path on
the site and one place per-version runtimes will land in slice 6.

**Tech Stack:** TypeScript, React 19, CodeMirror 6, TanStack Router, Tailwind v4,
Vitest + Testing Library. Wasmoon via the existing worker.

## Why not a Tailwind Play clone

Tailwind Play was the reference this slice started from, and three of its defining
choices are wrong here:

- **Its 50/50 split is earned by a rendered page.** Lua output is a terminal transcript
  — often three lines, sometimes thirty when a table is dumped. The answer is not a
  fixed ratio in either direction but a **draggable splitter** with a remembered
  position, because the playground's viewport is fixed where an entry's page scrolls.
- **It has no Run button** because CSS compilation always terminates. `while true do end`
  does not. Explicit Run, plus the existing worker timeout, is the only honest model.
- **Its version chip swaps the compiler.** Ours cannot — slice 6 is parked and every
  version executes Lua 5.4. So the control ships **pinned to 5.4 and disabled**, stating
  what runs rather than offering a choice that changes nothing.

What is worth taking: full-bleed chrome, layout toggles, share-by-URL, and a seeded
buffer rather than an empty box.

## Decisions

- **Tidy re-indents; it does not pretty-print.** A full formatter needs a Lua parser. A
  re-indenter needs only a lexer, and it has a property a formatter does not: it changes
  **leading whitespace only**, so it can never move or eat the expected-output comments
  [ADR 0008](../adr/0008-example-conventions.md) rule 6 depends on.
- **Tidy is a toggle, not a drawer.** Press it and the buffer formats; press it again and
  the exact original comes back. A drawer showing the same program twice is a worse undo
  button.
- **Tidy lives in the Input pane's header, not the global one** — label left, Tidy right,
  as Tailwind Play arranges it. Share, Reset and Run act on the session; Tidy acts on the
  buffer directly beneath it. It also keeps Tidy reachable in editor-only mode.
- **The panes are Input and Output**, in the same small caps with an icon each. A
  filename (`main.lua`) said less and matched nothing: there is one buffer, it is never
  saved, and naming a file implied a project that does not exist. Both headers come from
  one `PANE_HEADER` constant with a fixed height, because sizing them by their contents
  had already made them 33.5px and 29.5px.
- **No bytecode drawer.** The honest analogue of Play's "Generated CSS" panel is a
  `luac -l` listing, but `string.dump` returns a *binary* chunk — rendering it means
  writing a Lua 5.4 bytecode disassembler. That is its own slice.
- **Share is base64url in the hash, not a short link.**
  [ADR 0004](../adr/0004-self-hosted-on-github-no-third-parties.md) rules out the server
  Play uses for short IDs. The hash also never leaves the browser, which a query string
  would not guarantee. No compression: a 5 KB program makes a 6.7 KB URL, which is well
  inside what browsers carry, and `CompressionStream` would buy a smaller URL for an
  async path and a fallback branch.
- **The playground has no selected version.** It documents nothing, so there is no
  content for a version to choose. It does not read or write `SelectedVersionProvider`:
  the control states the runtime (5.4, disabled), and the disclosure beside it compares
  against `DEFAULT_VERSION` — the latest line the site documents.

  This replaced a first attempt that used the real `VersionSwitcher` and compared against
  the reader's docs selection. Two things were wrong with it. The switcher was a control
  whose only effect was to change the label in the sentence disclaiming it, so a reader
  had to act before the site would admit the act did nothing. And the disclosure said
  "differ from 5.1" to one reader and "differ from 5.5" to another about output that is
  byte-for-byte identical, because it was reporting a preference rather than a fact.

  Sharing still carries `?v=` when the arriving link had one — the URL is built from the
  current one rather than from scratch — but the playground never sets it.

## Deferred, deliberately

- **Multiple files / `require`.** Real Lua is module-shaped and Play's HTML/CSS tabs are
  the equivalent, but it means a virtual filesystem and a `package.searchers` shim in the
  worker — most of this slice's budget for a feature a docs playground rarely needs.
- **The Base UI select swap.** The roadmap calls slice 5 "the natural point" to replace
  the native `<select>`. It is not playground work: `VersionSwitcher` is site-wide and
  tested, and replacing it belongs with the rest of the chrome in slice 2.5. The
  playground reuses it as it stands.
- **Version-aware linting** — flagging `//` as 5.3+, `goto` as 5.2+, `setfenv` as
  5.1-only from the compat data already in `src/compat/`. This is what would make the
  switcher mean something before slice 6 lands, and it is the first thing to add next.
  `lexLua` is built with it in mind.

## Global Constraints

- All work stays on `dev`. **Never merge into `main`.** Ask before any merge or push.
- Commit style: `type(scope): summary`, imperative, ≤ ~60 chars, no trailing period,
  **never** a `Co-Authored-By` trailer.
- Use the [CONTEXT.md](../../CONTEXT.md) vocabulary: the page is the **playground**,
  never a REPL, sandbox or editor-as-noun. What runs in an entry is an **example**.
- The seeded program obeys [ADR 0008](../adr/0008-example-conventions.md) like any
  authored example, including the expected-output comment.
- `npm test`, `npm run types:check` and `npm run build` must pass at the end.

## Found while building

**The editor opened on the wrong program when a link was shared.** CodeMirror is created
after an `await` — the packages are dynamically imported so they stay off every reference
entry — and the mount effect closed over the first render's `value`. A shared link lands
in precisely that window: the page reads the program out of the hash and sets it while
the import is still in flight, so the editor showed the starter program while the output
pane showed the result of running the shared one. The view now opens on the value current
when it is built, not when the import began.

Worth recording because the stubbed-editor tests could not see it and the first attempt at
a regression test could not either: racing the import with a timer passed against the bug
as readily as against the fix. `tests/playground/editor.test.tsx` re-renders synchronously
instead, which a microtask cannot get in front of, and was confirmed to fail without the
fix before being kept.

**The caret was invisible in dark mode.** CodeMirror ships a light base theme and a dark
one and chooses between them from a flag fixed when the theme is built. This site switches
theme at runtime with a class on `<html>`, so that flag is wrong half the time by
construction: it resolved to the light theme's `caret-color: black`, painted on an editor
whose background is `rgb(18, 18, 18)`. The theme now names the caret and selection colours
as CSS variables, which follow the class. The same trap applies to anything else the base
themes colour per-theme — reach for a variable, never a literal.

**Tidy read as broken twice, and was working both times.** The starter program arrives
already tidy and hand-written Lua usually is, so the ordinary first encounter was a greyed
button that did nothing when pressed. A tooltip was not enough — it needs a hover to find,
and the report came back a second time. Tidy is now **never disabled**: it always acts and
always says which of three things it did, through the same status line Share uses. "Nothing,
because there was nothing to do" is an answer; silence is not.

The general lesson, since it caught two controls here: an action whose whole outcome is
invisible — a clipboard write, a no-op re-indent — has to say so. Disabling it instead
moves the question from "did that work?" to "is this broken?", which is worse.

## File Structure

| File | Responsibility | Change |
|---|---|---|
| `src/playground/lexLua.ts` | Lua tokenizer — strings, comments, names, operators | **Create** |
| `src/playground/tidy.ts` | Re-indent from block depth over the token stream | **Create** |
| `src/playground/shareUrl.ts` | Program ↔ URL hash | **Create** |
| `src/playground/errorLine.ts` | Lua error message → line number | **Create** |
| `src/playground/seed.ts` | The starter program | **Create** |
| `src/playground/Editor.tsx` | CodeMirror 6 wrapper | **Create** |
| `src/playground/Playground.tsx` | The page: header, panes, splitter, output | **Create** |
| `src/routes/playground.tsx` | The route | Rewritten |
| `src/runner/RunnableExample.tsx` | Inline example | Modify: "Open in Playground" |
| `package.json` | Dependencies | Modify: CodeMirror 6 |
| `src/styles/app.css` | Global styles | Modify: the Lua token palette |
| `tests/playground/lex-lua.test.ts` | Tokenizer | **Create** |
| `tests/playground/tidy.test.ts` | Re-indent, and what it must not touch | **Create** |
| `tests/playground/share-url.test.ts` | Round-trip, incl. non-ASCII | **Create** |
| `tests/playground/error-line.test.ts` | Both wasmoon message shapes | **Create** |
| `tests/playground/seed.test.ts` | The starter program, run against real Lua | **Create** |
| `tests/playground/editor.test.tsx` | The real CodeMirror, in jsdom | **Create** |
| `tests/playground/playground.test.tsx` | Run, Tidy, Share, layout, disclosure | **Create** |
| `tests/runner/runnable-example.test.tsx` | Inline example | Modify: the handoff link |
| `docs/plans/ROADMAP.md` | The slice list | Modify: slice 5 status |

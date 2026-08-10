# Welcome to LuaDocs

An MDN-style reference for the Lua language — one page per function, operator and language
construct, rewritten from the official manual, covering **Lua 5.1 through 5.5**.

Not affiliated with Lua.org or PUC-Rio. The official manual is
[at lua.org](https://www.lua.org/manual/5.5/); this is an independent rewrite of it.

## What's different about it

**Every version on one page.** Lua's five minor lines differ in ways that matter, and most
references pick one and leave you guessing. Here a single entry covers all five: pick a version
in the header and the page tells you whether the function exists, what changed, and when. No
separate site per version, no changelog to cross-check.

**The examples actually run.** Every snippet executes in your browser on real Lua compiled to
WebAssembly ([Wasmoon](https://github.com/ceifa/wasmoon)) — editable in place, with a standalone
Playground for anything bigger. Nothing runs on a server.

**No output is written by hand.** Every example is executed at build time and its result checked
against what the page claims. An entry whose output drifted from reality fails the build.

**Every claim traces to the manual.** Entries are written by reading the reference manual passage
in each version they cover — not from memory, and not from other documentation sites. That rule
exists because it was tested: four entries drafted from memory needed 6, 5, 9 and 11 corrections
once checked against the manuals.

## Status

**183 of 292 entries are written.** The standard library is finished; everything else is a
scaffolded stub with a title and a manual link and no body yet.

| Area | Written |
| --- | --- |
| Standard library | 182 / 182 |
| Language | 0 / 85 |
| C API | 0 / 11 |
| Guides | 0 / 5 |
| Learn | 0 / 1 |

Stubs are excluded from the sitemap and carry `noindex`, so an unwritten page is reachable but
never advertised.

Wasmoon ships a single Lua (5.4), so an example viewed at another selected version says so rather
than pretending. Per-version runtimes are
[a parked spike](docs/_DEPRECATED/plans/2026-08-04-per-version-lua-spike.md); the upstream project
is the place to help.

## Development

```bash
npm install
npm run dev
```

- `npm run build` — build to static output in `.output/public`
- `npm run start` — serve the built output
- `npm test` — run the suite
- `npm run types:check` — typecheck

Built on TanStack Start, prerendered to static HTML, with Fumadocs providing the content
pipeline. The UI currently uses Fumadocs's theme; a bespoke one is planned.

## The record

Separate from the documentation this site publishes, `docs/` holds how the project thinks — its
decisions, the conventions entries are written to, and what building taught us.

**It is being rebuilt.** As of 2026-08-10 it had reached 97,000 words in which decisions,
findings and open questions had grown into each other, so all of it was deprecated in one move
and none of it has been replaced yet.

- [docs/_DEPRECATED/](docs/_DEPRECATED/) — the whole previous record, kept rather than deleted,
  because its evidence is what makes its replacements believable. **Not authoritative.**

Comments in `src/` still cite `docs/adr/…` paths that now live under `docs/_DEPRECATED/adr/`.
They are repointed once the rebuilt decisions are numbered.

## Licence

Prose is CC BY 4.0; example code is CC0. Entries are written from the official Lua reference
manual, which is © Lua.org, PUC-Rio and freely available under the Lua (MIT) licence. See
[LICENSE](LICENSE).

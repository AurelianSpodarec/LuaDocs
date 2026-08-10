# LuaDocs

An MDN-style documentation site for the Lua language, rewritten from the official
manual, with per-version content (5.1–5.5) and runnable examples.

Built on TanStack Start, prerendered to static HTML, with Fumadocs providing the
content pipeline. The UI currently uses Fumadocs's theme; a bespoke UI is planned.
See [ADR 0005](docs/DEPRECATED/adr/0005-platform-fumadocs-on-tanstack-start.md).

Examples run in the reader's own browser on real Lua, compiled to WebAssembly by
[Wasmoon](https://github.com/ceifa/wasmoon). Nothing is executed on a server and no
output is baked in — every example on the site is run and its output checked against
what the entry claims, on every build. Wasmoon ships a single Lua (5.4), so an example
viewed at another selected version says so rather than pretending; per-version runtimes
are [a parked spike](docs/DEPRECATED/plans/2026-08-04-per-version-lua-spike.md). If you
want to help there, the upstream project is the place.

## Development

```bash
npm install
npm run dev
```

- `npm run build` — build to static output in `.output/public`
- `npm run start` — serve the built static output
- `npm test` — run the test suite
- `npm run types:check` — typecheck

## The record

How the project thinks, as distinct from the documentation it publishes — its decisions,
conventions, and what building taught us.

**It is being rebuilt from scratch.** As of 2026-08-10 the previous record had reached 97,000
words in which decisions, findings and open questions had grown into each other, so all of it
was deprecated in one move and none of it has been replaced yet.

- [docs/DEPRECATED/](docs/DEPRECATED/) — the whole previous record, kept intact rather than
  deleted, because its evidence is what makes its successors believable. Not authoritative.

Anyone reading the code will find comments citing `docs/adr/…` paths that now live under
`docs/DEPRECATED/adr/`. They are repointed when the rebuilt decisions are numbered.

## Licence

Prose is CC BY 4.0; example code is CC0. Entries are written from the official Lua
reference manual, which is © Lua.org, PUC-Rio and freely available under the Lua
(MIT) licence. See [LICENSE](LICENSE).

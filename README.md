# LuaDocs

An MDN-style documentation site for the Lua language, rewritten from the official
manual, with per-version content (5.1–5.5) and runnable examples.

Built on TanStack Start (static prerender) with Fumadocs used headless for the
content pipeline. See [ADR 0005](docs/adr/0005-platform-fumadocs-on-tanstack-start.md).

## Development

```bash
npm install
npm run dev
```

- `npm run build` — build to static output in `.output/public`
- `npm run start` — serve the built static output
- `npm test` — run the test suite
- `npm run types:check` — typecheck

## Documentation

- [CONTEXT.md](CONTEXT.md) — project glossary
- [docs/adr/](docs/adr/) — architecture decision records
- [docs/plans/](docs/plans/) — implementation plans
- [docs/conventions/commit-messages.md](docs/conventions/commit-messages.md) — commit style

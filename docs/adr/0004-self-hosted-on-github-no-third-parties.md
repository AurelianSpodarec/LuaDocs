# Lean on GitHub primitives; avoid unjustified backends

LuaDocs uses GitHub's free primitives for what they do well — **Pull Requests**
for contributions and "edit this page", **Issues** for feedback and problem
reports, **Discussions** for Q&A (later), **Actions** for build, deploy, and
example-testing. It does **not** stand up a backend or adopt a paid third-party
service unless a feature clearly justifies one. The site is **static-first**
(content plus a client-side WASM runtime); the hosting platform (GitHub Pages,
Vercel, or similar) is deferred to the technical pass.

## Why

Most of what this site needs — contributions, feedback, running examples, search —
maps cleanly onto GitHub primitives or the browser, at zero cost and with nothing
to keep paying for or that can lapse. Adding server-side infrastructure for a
low-value feature (a 👍/👎 sentiment metric) would introduce hosting, storage, and
spam concerns out of all proportion to the signal it returns, so it is dropped
for now.

## Consequences

- **Feedback** is a prefilled GitHub Issue; **contributions** are PRs; **runnable
  examples** run client-side via WASM; **search** is a client-side prebuilt index.
  None of these need a server.
- **Hosting is static-first but platform-open** — not locked to GitHub Pages. The
  choice (and whether it offers serverless capacity) is a technical-pass decision.
- Server-side state is not forbidden; it must clear a "is this worth a backend?"
  bar. The sentiment metric did not, and is parked.

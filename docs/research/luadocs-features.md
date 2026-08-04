# LuaDocs — Features

*What the site does. The vision lives in [`luadocs-idea.md`](luadocs-idea.md);
technical decisions are a separate later pass. Vocabulary is in
[`CONTEXT.md`](../../CONTEXT.md); recorded decisions in [`docs/adr/`](../adr/).*

All features are designed for v1 except where noted. Everything is GitHub-native
or client-side per [ADR 0004](../adr/0004-self-hosted-on-github-no-third-parties.md).

## Feature inventory

**Built for v1:** content shell (Reference + Guide rendering, TOC, source-link
attribution), sidebar navigation with Option C, version switcher + version-support
strip, runnable examples, standalone Playground, search, cross-linking,
edit-this-page, feedback.

**Deferred to v2:** i18n (content model designed to be i18n-ready now; translation
layer built later); multi-file/module Playground.

**Parked:** 👍/👎 sentiment metric (needs server-side state; not worth it — see
ADR 0004).

**Baseline (always on, not a toggle):** SEO — semantic HTML + metadata on every
page.

## Version switching *(F2)*

- **Global** — the reader picks a Lua version once and it applies site-wide.
- **Persisted** across pages and visits via `localStorage`.
- **Reflected in the URL as a query param** — `?v=5.3`; the default (latest)
  version carries no param, keeping one canonical URL per entry (better SEO than a
  `/5.3/` path segment).
- **Default is always the latest** version; no auto-detection of the reader's
  installed Lua.
- **Switching never rewrites a page** — it re-renders the same base + deltas: the
  sidebar dims/badges unavailable entries, the version-support strip highlights the
  selected version, the applicable example variant loads, and an availability
  banner appears if the entry doesn't exist in that version.
- **Change-note display: always shown**, with the note relevant to the selected
  version emphasized (policy A). Nothing is hidden.
- **All callouts are inline** boxes/banners — never modals.

## Runnable examples *(F3)*

- **Editable in place** and re-runnable, with a **Reset** to restore the original
  and an **"Open in Playground"** for a bigger canvas.
- **Output panel** below the code captures `print` output and shows runtime errors.
- **Runs in a sandboxed Web Worker with a hard timeout** so a runaway example
  can't freeze the tab.
- **Shareable via a URL-encoded snippet** — no backend.
- **No real `io`/`os`** — the browser has no filesystem; `io.write` routes to the
  output panel, filesystem/`os` calls are stubbed. Examples needing real `io`/`os`
  render as static, non-runnable snippets.

## Standalone Playground *(F4)*

A marquee, first-class destination (north star: play.tailwindcss.com).

- **Top-nav link**, own route (e.g. `/play`) — a definite, first-class feature;
  static page + client WASM.
- **Two-pane layout** — editor | output console.
- **In-playground version selector** — run code on any of 5.1–5.5 via the
  per-version WASM builds; the showcase for the version system.
- **Shareable URL** (shared mechanism with runnable examples).
- **Starter templates** — one-click load of small examples (hello world,
  coroutines, metatables, string patterns).
- **Multi-file/module `require`** — deferred to v2 (needs a browser virtual
  filesystem).

## Feedback *(F1)*

- A **"Suggest a change / report a problem"** action that opens a **prefilled
  GitHub Issue** — page URL, entry title, and section auto-filled via an issue
  template, tagged with a `page-feedback` label. No backend, no thumbs metric.
- Community Q&A via **GitHub Discussions** — later.

## Edit this page *(F1)*

- An **"Edit on GitHub"** link on every page, pointing at the source file for a PR.
  Trivial; no in-browser editor.

## Search *(F5)*

Client-side per ADR 0004.

- **Command-palette style** — `Ctrl/⌘-K` (and `/`) opens an instant, as-you-type
  search overlay; keyboard-first.
- **Indexed and ranked** with symbol name + signature weighted highest, then
  summary, then body prose — so `format` surfaces `string.format` at the top, not
  a paragraph that merely mentions "format".
- **Results grouped** into Reference vs Guides, each showing its section
  breadcrumb and a snippet.
- **Version-aware, Option-C style** — searches all entries regardless of selected
  version, but badges results not in that version (`5.3+`) rather than hiding them.
- **Offline** — nice-to-have, not a v1 requirement. (A prebuilt static index makes
  it feasible; exact library is a tech-pass decision.)

## Cross-linking *(F6)*

- **Auto-linked symbol mentions** — prose that names a documented symbol
  (`string.format`, `pcall`) auto-links to its entry, generated at build time from
  the symbol registry, on **first mention per entry** only.
- **Authored "See also"** — each entry ends with a human-curated list of related
  entries and guides.
- **Broken cross-links fail the build** — a link to a symbol that doesn't exist is
  a build error, a payoff of structured content.
- **Prose links only** — identifiers inside code blocks are not auto-linked (too
  noisy).

## Sidebar details *(F7)*

Option C (dim + badge + optional filter) is already decided; this is the
surrounding behavior. *(Low-risk details, easy to tweak later.)*

- **Top-level grouping** — Guides / Learn, Language, Standard Library, C API; each
  library (e.g. `string`) is a collapsible section with entries beneath it.
- **Collapse behavior** — the section containing the current entry auto-expands;
  others start collapsed; state persists in `localStorage`.
- **Option-C filter toggle** ("Hide unavailable in 5.x") sits at the top of the
  sidebar, off by default.
- **Active entry** is highlighted and scrolled into view on navigation.
- **Mobile** — sidebar collapses to an off-canvas drawer (hamburger); search is
  promoted to the top bar.

## Content shell / page anatomy *(F8)*

The reader-facing page anatomy — entry types, section order per type, callout set,
and version display — is specified in **[`page-structure.md`](page-structure.md)**,
informed by the **[`mdn-case-study.md`](mdn-case-study.md)** research. The data
mechanism behind the version strip/matrix is deferred to the technical pass.

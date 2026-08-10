# LuaDocs — Idea & Research

*The vision and its principles. Features and technical decisions live in their own
docs; this one is only "what this is and why." Vocabulary lives in
[`CONTEXT.md`](../../CONTEXT.md); recorded decisions live in
[`docs/adr/`](../adr/).*

## The problem

The official manual at lua.org is a single giant page: hard to navigate, weak and
hard-to-follow examples, dated prose, no learning path, and nothing interactive.
People bounce off it or fall back to scattered third-party material.

## The vision

An **MDN-style documentation site for standard Lua** — the best place to both
*learn* and *reference* the language. Reference entries and narrative guides,
version-aware, with runnable examples, written in clear modern English.

## Guiding principles

- **Full rewrite, always attributed.** Every entry is rewritten in our own words;
  the original manual is used only as a reference for *what* to document, and each
  entry carries a **source link** back to its lua.org origin.
- **Follow MDN** for page structure, information architecture, and reading feel.
- **Lean on GitHub's free primitives** (PRs, Issues, Discussions, Actions) and the
  browser; don't add a backend or paid third-party service without clear
  justification. Static-first; hosting platform is a later decision. See
  [ADR 0004](../adr/0004-self-hosted-on-github-no-third-parties.md).
- **One canonical set of docs**, defaulting to the latest version, with content
  authored once and varied only by deltas — see
  [ADR 0001](../adr/0001-single-canonical-docs-with-version-deltas.md).
- **Real Lua, really running.** Runnable examples execute genuine official Lua
  semantics (the C source compiled to WebAssembly), never a JavaScript
  reimplementation. This is what makes "verified to run" trustworthy. *(Which
  build delivers this is a deferred technical decision.)*

## Editorial promises (the differentiators)

These are the reasons someone would pick LuaDocs over lua.org:

- **Every runnable example is verified to actually run** (checked on every build).
- **Gotchas are first-class** — common mistakes and surprising behavior (1-based
  indexing, `nil` holes in tables, only `nil`/`false` being falsy) are a named,
  recurring callout, not an afterthought.
- **Version-aware throughout** — a version switcher, a per-entry version-support
  strip, and a sidebar that dims + badges entries unavailable in the selected
  version.
- **Dense cross-linking** between related entries and guides.

## Audience

Both, served by one site:

- **Beginners** via a **Learn path** and narrative **Guides**.
- **Experienced developers** via precise, skimmable **Reference** — reference
  content up top, depth below, so both readers are served on the same page.

## Content types

- **Reference** — one entry per symbol or language construct.
- **Guide** — in-depth prose on a concept or task.
- **Learn path** — a curated ordering of guides for beginners (not a new type).

## Versioning model *(summary; see [ADR 0001](../adr/0001-single-canonical-docs-with-version-deltas.md))*

- Documents Lua **5.1–5.5** (minor lines only, never patch releases).
- Each entry is a **base** authored against the default (latest) version; older or
  newer versions inherit it unless a **delta** (availability bound, change note,
  or example variant) overrides it. Entries are never forked per version.
- The reader's **selected version** drives rendering: sidebar state (Option C —
  dim + badge + optional "hide unavailable" filter), which change notes show, and
  which example variant runs.

## Interactivity

- **Examples** run inline where the runtime supports them; C API and
  `io`/`os`-dependent snippets render as static, highlighted code with no Run
  button.
- A standalone **Playground** for writing and running arbitrary Lua.

## Scope *(see [ADR 0002](../adr/0002-scope-standard-lua-only.md))*

**In scope:**
1. **The language** — syntax and semantics.
2. **The standard library** — `string`, `table`, `math`, `io`, `os`,
   `coroutine`, etc.
3. **The C API** — in scope, but as its own clearly separated section for
   embedders, at lower initial priority (examples are static C).
4. **Front door & flavor** — a homepage with a "why Lua" pitch and links to
   **official** downloads (we link, never host binaries); a **History of Lua**
   guide; a **"Lua in the wild"** guide surveying where Lua is used.

**Deferred (later):** a curated **Ecosystem** guide pointing to LuaRocks and
notable libraries (not a package registry); a **blog**.

**Out of scope:** **Luau/Roblox** and host-specific mod APIs (WoW, LÖVE, Garry's
Mod, etc.) — different languages/hosts, covered only in the "Lua in the wild"
survey.

## Openness & licensing *(see [ADR 0003](../adr/0003-dual-license-prose-and-code.md))*

- **Open source and public from day one**, with an "Edit this page" flow and a
  short style guide for contributors.
- **Prose under CC-BY 4.0**, **example code under CC0**, plus the per-entry source
  link to the original manual.

## Deliberately deferred to separate passes

- **Features doc** — version switcher, version-support strip, Option-C sidebar,
  examples, playground, search, edit-this-page, feedback, SEO, migration guides,
  i18n.
- **Technical doc** — framework/stack, per-version WASM builds, CI-tested
  examples, search engine, content format, hosting.

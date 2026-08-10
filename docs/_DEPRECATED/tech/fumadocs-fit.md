# Fumadocs implementation-fit assessment

*Technical-pass research. Evaluates whether every LuaDocs decision (the ADRs and
feature specs) can be implemented on **Fumadocs**, used **headless** — because the
UI is bespoke and built from scratch, so the value we want from a framework is the
**plumbing**, not its default theme. Not a final framework decision; a feasibility
record. Companion evaluation to the Astro option.*

## How we'd use Fumadocs

Fumadocs has two layers. `fumadocs-ui` is the default themed components — which a
bespoke build largely discards. Underneath, **`fumadocs-core` + `fumadocs-mdx` is
headless**: we supply our own layout, sidebar, and page components and keep
Fumadocs for the plumbing — **content source, page-tree, MDX pipeline (with
remark/rehype hooks), static search, and llms.txt output**. Frontmatter is
validated with Zod via `defineDocs` (`pageSchema.extend(...)`).

## The version system (F2 + F9)

Fumadocs ships a built-in **versioned-docs** feature, but it is the *multi-copy*
model that [ADR 0001](../../adr/0001-single-canonical-docs-with-version-deltas.md)
explicitly rejects. We **do not use it.** Instead:

- **Plumbing:** a single content source → page-tree; each page's frontmatter holds
  a `lua-compat` key (Zod-validated).
- **Custom layer (built from scratch, framework-independent):** a React
  `SelectedVersion` context (persisted to `localStorage`, synced to the `?v=`
  query param); the version switcher; a compat-data JSON tree (Zod-validated); and
  components that read compat data to render the version-support strip, the
  Option-C dim/badge sidebar, change-note emphasis, and example-variant selection.

**Verdict:** ✅ fully implementable. The version system sits *on top of* the
page-tree; Fumadocs neither helps nor hinders it. This custom layer exists in any
framework, so it is not a Fumadocs-specific cost.

## ADR-by-ADR

| ADR | Implementation on Fumadocs | Verdict |
|---|---|---|
| **0001** single canonical + deltas | single content source; deltas = compat JSON + inline MDX conditionals + example variants | ✅ no friction |
| **0002** scope: standard Lua only | pure editorial/content | ✅ framework-agnostic |
| **0003** dual license | LICENSE file + footer | ✅ framework-agnostic |
| **0004** GitHub primitives, static-first | see caveat below | ⚠️ one adjustment |

### ADR 0004 caveat (the one real gotcha)

Fumadocs builds **fully static** (static export on Astro/Vite/Next), so GitHub
Pages / Vercel is fine. **But** its slickest LLM feature — `Accept`-header markdown
**negotiation** — needs a **server/middleware**, which static hosting lacks. The
fix: use Fumadocs's **static** llms path instead — pre-generate `llms.txt` (via
`llms(source).index()` as a static route) and per-page `.md` files at build time.
Same LLM output, generated rather than negotiated. Feedback = a prefilled
GitHub-Issue link (custom); edit-this-page = a link. ✅ with that adjustment.

## Feature / plumbing map

| Decision | Fumadocs gives | We build | Verdict |
|---|---|---|---|
| Runnable examples (F3) / Playground (F4) | MDX custom-component mapping | `<RunnableExample>` island (WASM + Web Worker), version selector | ✅ clean |
| Search (F5) | **built-in static search (Orama), client-side** | version-badging of results | ✅ free win |
| Cross-linking (F6) | remark/rehype hooks in the MDX pipeline | auto-link-first-mention plugin; broken-link-fails-build check | ✅ |
| Sidebar Option C (F7) | page-tree data + component slots | dim/badge sidebar renderer from compat data | ✅ (UI custom anyway) |
| Page anatomy (F8) | MDX + custom page layout | entry/section templates | ✅ |
| llms.txt / LLM text | **built-in generator** (use static path) | wire the static route | ✅ free-ish win |

## Net verdict

Fumadocs's plumbing covers the boring-but-hard parts — **content source,
page-tree, MDX + plugins, static search, and llms.txt** — and **none of the custom
version system fights it**, since it all decorates the page-tree. The only thing to
design around is [ADR 0004](../../adr/0004-self-hosted-on-github-no-third-parties.md):
on static hosting, use Fumadocs's **static** llms generation, not its server-side
negotiation. Compared with Astro-custom, Fumadocs makes **search and llms.txt come
cheaper**; Astro's edges are zero-JS output and native Zod validation of the
compat JSON as a `file()` collection. Both can implement every decision.

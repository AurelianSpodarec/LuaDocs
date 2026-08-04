# Platform: Fumadocs (headless) on TanStack Start, static

LuaDocs is built on **TanStack Start** (Vite-based, prerendered to static via SPA
mode) as the host, with **Fumadocs used headless** (`fumadocs-core` +
`fumadocs-mdx`) for the plumbing — content source, page-tree, MDX pipeline, static
search, and `llms.txt`. The entire UI is custom-built. Supporting libraries:
**Tailwind CSS** (styling), **Base UI** (accessible primitives), **CodeMirror 6**
(example/playground editor), **Shiki** (highlighting), **Wasmoon** + our own
per-version WASM builds (Lua runtime), **Vitest** (example testing in CI), and
**React Context / Zustand** for client state.

## Why

The UI is 100% bespoke, so a framework's value is its *plumbing*, not its theme —
and Fumadocs's headless core gives search and `llms.txt` cheaper than building them
by hand (see [fumadocs-fit](../research/tech/fumadocs-fit.md)). TanStack Start was
chosen over Next.js to avoid Vercel/host gravity — it is host-agnostic and
prerenders to static, deployable anywhere per
[ADR 0004](0004-self-hosted-on-github-no-third-parties.md). Astro-custom (would
rebuild search + llms) and Starlight (opinionated, conflicts with a fully custom
UI) were rejected; the version system is a custom layer on the page-tree in every
option, so it is not a differentiator between frameworks.

## Consequences

- **Static hosting** → use Fumadocs's **static `llms.txt` generation**, not its
  server-side `Accept`-header markdown negotiation (no server exists).
- **TanStack Start is alpha and non-RSC**; Fumadocs runs via its Vite/client path,
  and static output is **SPA-prerender** (HTML prerendered for SEO, app JS
  hydrates). Accepted maturity trade-off.
- **Scaffold step 1 is to validate** Fumadocs + TanStack Start + static prerender
  end-to-end before building features — fail fast.
- Secondary styling decisions (design tokens, plain CSS vs Tailwind layers, no
  Sass) are deferred; Tailwind + Fumadocs largely set the token layer.

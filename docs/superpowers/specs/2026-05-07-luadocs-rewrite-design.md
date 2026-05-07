# LuaDocs Rewrite — Design Spec

**Date:** 2026-05-07
**Branch:** dev
**Status:** Approved

---

## Overview

Full rewrite of LuaDocs from Next.js + Fumadocs to TanStack Start + Fumadocs. The goal is to move away from Vercel hosting while keeping the Fumadocs docs engine. Architecture is built first with placeholder content; actual documentation content is filled in separately.

---

## 1. Architecture

| Layer | Choice |
|---|---|
| Framework | TanStack Start (SSR, deploys to Cloudflare/Netlify/anywhere) |
| Docs engine | Fumadocs Core + UI |
| Content | MDX via `fumadocs-mdx` with browser collections (non-RSC) |
| Styling | Tailwind CSS 4 |
| Language | TypeScript |

TanStack Start is used instead of Next.js to remove Vercel hosting dependency. Fumadocs officially supports TanStack Start. Since TanStack Start has no React Server Components, Fumadocs renders via browser collections (client-side).

---

## 2. Content Structure

Two content directories — one per major Lua version — each loaded as a separate Fumadocs source.

```
content/
├── lua4/       # Lua 4.x docs — own Fumadocs source
└── lua5/       # Lua 5.x docs — own Fumadocs source
```

Content organisation within each version (module breakdown, sub-groupings) is deferred to the content-filling phase. Structure is placeholder for now.

### Frontmatter Schema

All MDX pages extend the base Fumadocs schema with optional version fields, validated with Zod at build time:

```yaml
---
title: math.tointeger()
description: Short description.
since: "5.3"        # optional — minor version introduced
deprecated: "5.4"   # optional — minor version deprecated
removed: "5.4"      # optional — minor version removed
---
```

`title` and `description` are required. Version fields are optional and drive badge and VersionBlock behaviour automatically.

```typescript
// source.config.ts
export const lua5Docs = defineDocs({
  dir: 'content/lua5',
  docs: {
    schema: pageSchema.extend({
      since: z.string().optional(),
      deprecated: z.string().optional(),
      removed: z.string().optional(),
    }),
  },
});
```

---

## 3. Versioning System

Two-tier system: major versions are URL-based, minor versions are URL query param based.

### Major Versions (Lua 4 / Lua 5 / future Lua 6)

- Separate content directories and Fumadocs sources per major version
- Separate URL trees: `/docs/lua4/...` and `/docs/lua5/...`
- Nav pill tabs switch between major versions, navigating to the equivalent path in the other tree; if the equivalent page doesn't exist, falls back to the other version's root (`/docs/lua4/` or `/docs/lua5/`)
- Each major version has its own scoped search and navigation

### Minor Versions (5.3 / 5.4)

- Controlled via URL query param `?v=5.4` — fully shareable, type-safe
- Validated with Zod in TanStack Router: defaults to latest (`5.4`) if absent or invalid
- Docs layout route defines the `v` search param; all child routes inherit it
- React context populated from `useSearch()` so MDX components can read the selected version without knowing about routing
- `localStorage` stores user preference for first-visit default before URL param is set
- Start with 5.3 and 5.4 only — expand to earlier versions when content warrants it

```typescript
// version search param schema
const versionSchema = z.object({
  v: fallback(z.enum(['5.3', '5.4']), '5.4').default('5.4'),
});
```

**Data flow:** `localStorage (first visit)` → `URL ?v=5.4` → `useSearch() in docs layout` → `VersionContext` → `<VersionBlock>`

### Version Components

**`<VersionBadge>`** — rendered automatically in the page header from the `since` frontmatter field. No manual placement in MDX.
```
math.tointeger()  [5.3+]
```

**`<VersionBlock>`** — wraps MDX content, shows or hides based on selected minor version. Supports both `since` and `until` for precise ranges. `since` is inclusive, `until` is exclusive. Version comparison is numeric (not string) to handle future versions like 5.10 correctly.
```mdx
<VersionBlock since="5.4">
  This parameter was added in 5.4.
</VersionBlock>

<VersionBlock since="5.3" until="5.4">
  Only shown when viewing 5.3 (not 5.4 or above).
</VersionBlock>
```

**`<DeprecatedBlock>`** — shows a warning callout (does not hide content) for deprecated or removed features.
```mdx
<DeprecatedBlock in="5.4" removed="5.5">
  This function was deprecated in 5.4.
</DeprecatedBlock>
```

---

## 4. Project Structure

```
/
├── src/
│   ├── routes/
│   │   ├── __root.tsx              # root layout, global providers
│   │   ├── index.tsx               # home page (/)
│   │   └── docs/
│   │       ├── route.tsx           # docs layout — v search param, VersionContext, sidebar
│   │       ├── lua4/
│   │       │   └── $.tsx           # splat — renders any /docs/lua4/... page via params._splat
│   │       └── lua5/
│   │           └── $.tsx           # splat — renders any /docs/lua5/... page via params._splat
│   ├── components/
│   │   ├── VersionBlock.tsx
│   │   ├── VersionBadge.tsx
│   │   ├── VersionSelector.tsx     # minor version pill toggle (5.3 / 5.4)
│   │   └── MajorVersionSelector.tsx # Lua 4 / Lua 5 pill tabs in nav
│   ├── contexts/
│   │   └── VersionContext.tsx      # populated from useSearch(), consumed by VersionBlock
│   └── lib/
│       └── source.ts               # Fumadocs loaders for lua4Docs + lua5Docs
├── content/
│   ├── lua4/
│   └── lua5/
├── collections/                    # Fumadocs browser collections (required for non-RSC)
│   └── index.ts
├── source.config.ts                # defineDocs per major version + schema extensions
├── app.config.ts                   # TanStack Start / Vinxi config
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 5. Navigation & UX

### Top Nav
- Logo
- Major version selector: `Lua 4` | `Lua 5` pill tabs
- Search (Fumadocs built-in, scoped to current major version)
- GitHub link
- Dark/light theme toggle

### Sidebar
- Minor version selector at top: `5.3` | `5.4` pill toggle — updates `?v=` param
- Module groups: Math, String, Table, Coroutine, IO, OS, Package, Debug, UTF-8, Globals
- Each module expands to individual functions
- Active page highlighted

### Function Page Layout
```
Breadcrumb: Functions > Math > math.tointeger

math.tointeger()  [5.3+]
Short description.

## Syntax
## Parameters
## Return Value
## Examples
## Use Cases       (optional)
## See Also        (optional)
```
- TOC floats right, tracks headings on scroll
- `<VersionBlock>` and `<DeprecatedBlock>` can wrap any section

### Homepage
Minimal landing page outside of Fumadocs. Two CTAs: "Lua 4 Docs" and "Lua 5 Docs". Brief tagline. Nothing more.

---

## 6. Out of Scope (this phase)

- Actual documentation content — filled in separately using archive as reference
- Content organisation within modules (which functions go where, sub-groupings)
- Search configuration / Orama vs Flexsearch decision
- Deployment target configuration (Cloudflare / Netlify / other)
- Custom UI theme beyond Fumadocs defaults
- Lua 3 or earlier versions

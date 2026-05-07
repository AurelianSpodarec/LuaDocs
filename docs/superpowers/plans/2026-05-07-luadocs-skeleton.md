# LuaDocs Skeleton Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing Next.js project with a working TanStack Start + Fumadocs docs site that renders Lua 4 and Lua 5 documentation pages at `/docs/lua4/...` and `/docs/lua5/...`.

**Architecture:** TanStack Start handles routing via file-based routes. Two splat routes (`/docs/lua4/$` and `/docs/lua5/$`) use Fumadocs browser collections (non-RSC client-side rendering) to render MDX pages. A shared docs layout wraps both. Content lives in `content/lua4/` and `content/lua5/`, each a separate Fumadocs source.

**Tech Stack:** TanStack Start, TanStack Router, Fumadocs Core + UI, fumadocs-mdx (Vite plugin), Tailwind CSS 4, TypeScript, Zod

---

## File Map

### Delete (Next.js specific)
- `src/app/` — entire directory
- `next.config.*` — if present
- `mdx-components.tsx` — root level (will be recreated in `src/`)

### Create
- `vite.config.ts` — TanStack Start + fumadocs-mdx Vite plugins
- `source.config.ts` — Fumadocs `defineDocs` for lua4 and lua5 with custom schema
- `src/routes/__root.tsx` — root layout with Fumadocs `RootProvider`
- `src/routes/index.tsx` — homepage (two CTAs)
- `src/routes/docs/route.tsx` — docs layout (sidebar, breadcrumbs)
- `src/routes/docs/lua5/$.tsx` — lua5 splat route (renders any `/docs/lua5/...` page)
- `src/routes/docs/lua4/$.tsx` — lua4 splat route (renders any `/docs/lua4/...` page)
- `src/lib/source.ts` — Fumadocs source loaders for lua4 and lua5
- `src/mdx-components.tsx` — MDX component overrides
- `content/lua4/index.mdx` — placeholder root page for Lua 4
- `content/lua5/index.mdx` — root page for Lua 5 (migrate existing)

### Modify
- `package.json` — remove Next.js, add TanStack Start + Fumadocs deps
- `tsconfig.json` — update `paths` for `@/*` alias
- `tailwind.config.ts` — update content paths
- `.gitignore` — add `.source/` (Fumadocs generated output)
- `content/docs/**` → `content/lua5/**` (rename/move)

---

## Task 1: Replace package.json dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Replace package.json**

```json
{
  "name": "luadocs",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "start": "vite preview",
    "postinstall": "fumadocs-mdx"
  },
  "dependencies": {
    "@tanstack/react-router": "^1",
    "@tanstack/react-start": "^1",
    "@tanstack/zod-adapter": "^1",
    "fumadocs-core": "^15",
    "fumadocs-mdx": "^11",
    "fumadocs-ui": "^15",
    "react": "^19",
    "react-dom": "^19",
    "zod": "^3"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "tailwindcss": "^4",
    "typescript": "^5",
    "vite": "^6"
  }
}
```

- [ ] **Step 2: Install dependencies**

```bash
npm install
```

Expected: installs without errors. The `postinstall` script runs `fumadocs-mdx` to generate the `.source/` directory (it will be empty until `source.config.ts` exists — that's fine).

- [ ] **Step 3: Update .gitignore**

Add to `.gitignore`:
```
.source/
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json .gitignore
git commit -m "chore: replace Next.js with TanStack Start + Fumadocs deps"
```

---

## Task 2: Remove Next.js files and create Vite config

**Files:**
- Delete: `src/app/` (entire directory)
- Create: `vite.config.ts`

- [ ] **Step 1: Delete the Next.js app directory**

```bash
rm -rf src/app
```

Also delete if present:
```bash
rm -f next.config.ts next.config.js next.config.mjs
```

- [ ] **Step 2: Create vite.config.ts**

```typescript
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import tailwindcss from '@tailwindcss/vite';
import mdx from 'fumadocs-mdx/vite';
import * as MdxConfig from './source.config.js';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    tanstackStart(),
    tailwindcss(),
    mdx(MdxConfig),
  ],
});
```

- [ ] **Step 3: Create tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/fumadocs-ui/dist/**/*.js',
  ],
} satisfies Config;
```

- [ ] **Step 4: Update tsconfig.json**

Replace contents with:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src", "vite.config.ts", "source.config.ts"]
}
```

- [ ] **Step 5: Commit**

```bash
git add vite.config.ts tailwind.config.ts tsconfig.json
git commit -m "chore: add Vite, Tailwind and TypeScript config for TanStack Start"
```

---

## Task 3: Configure Fumadocs sources

**Files:**
- Create: `source.config.ts`
- Create: `src/lib/source.ts`
- Create: `src/global.css`

- [ ] **Step 1: Create source.config.ts**

```typescript
import { defineDocs } from 'fumadocs-mdx/config';
import { pageSchema } from 'fumadocs-core/source/schema';
import { z } from 'zod';

const versionedPageSchema = pageSchema.extend({
  since: z.string().optional(),
  deprecated: z.string().optional(),
  removed: z.string().optional(),
});

export const lua5Docs = defineDocs({
  dir: 'content/lua5',
  docs: { schema: versionedPageSchema },
});

export const lua4Docs = defineDocs({
  dir: 'content/lua4',
  docs: { schema: versionedPageSchema },
});
```

- [ ] **Step 2: Run postinstall to generate .source/**

```bash
npm run postinstall
```

Expected: `.source/` directory is created with generated types for `lua5Docs` and `lua4Docs`.

- [ ] **Step 3: Create src/lib/source.ts**

```typescript
import { lua5Docs, lua4Docs } from 'collections/server';
import { loader } from 'fumadocs-core/source';

export const lua5Source = loader({
  baseUrl: '/docs/lua5',
  source: lua5Docs.toFumadocsSource(),
});

export const lua4Source = loader({
  baseUrl: '/docs/lua4',
  source: lua4Docs.toFumadocsSource(),
});
```

- [ ] **Step 4: Create src/global.css**

```css
@import 'tailwindcss';
@import 'fumadocs-ui/style.css';
```

- [ ] **Step 5: Commit**

```bash
git add source.config.ts src/lib/source.ts src/global.css .source/
git commit -m "feat: configure Fumadocs sources for lua4 and lua5"
```

---

## Task 4: Migrate content

**Files:**
- Rename: `content/docs/` → `content/lua5/`
- Create: `content/lua4/index.mdx`

- [ ] **Step 1: Rename content/docs to content/lua5**

```bash
mv content/docs content/lua5
```

- [ ] **Step 2: Create content/lua4/index.mdx placeholder**

```bash
mkdir -p content/lua4
```

Create `content/lua4/index.mdx`:
```mdx
---
title: Lua 4 Documentation
description: Reference documentation for Lua 4.x.
---

Lua 4 documentation is coming soon.
```

- [ ] **Step 3: Create content/lua5/index.mdx if it doesn't exist**

Create `content/lua5/index.mdx`:
```mdx
---
title: Lua 5 Documentation
description: Reference documentation for Lua 5.x.
---

Welcome to the Lua 5 reference documentation.
```

- [ ] **Step 4: Regenerate .source/ after content move**

```bash
npm run postinstall
```

- [ ] **Step 5: Commit**

```bash
git add content/
git commit -m "feat: migrate content to lua4/ and lua5/ directories"
```

---

## Task 5: Create TanStack Router setup

**Files:**
- Create: `src/router.tsx`

TanStack Start requires a router factory function and a module augmentation so the router type is available globally. The `routeTree.gen.ts` file is auto-generated by the Vite plugin on first `npm run dev` — do not create it manually.

- [ ] **Step 1: Create src/router.tsx**

```tsx
import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

export function createRouter() {
  return createTanStackRouter({
    routeTree,
    scrollRestoration: true,
  });
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/router.tsx
git commit -m "feat: add TanStack Router setup"
```

---

## Task 6: Create root layout

**Files:**
- Create: `src/routes/__root.tsx`

- [ ] **Step 1: Create src/routes/__root.tsx**

```tsx
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router';
import { RootProvider } from 'fumadocs-ui/provider/tanstack';
import '@/global.css';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <HeadContent />
      </head>
      <body className="flex flex-col min-h-screen">
        <RootProvider>
          <Outlet />
        </RootProvider>
        <Scripts />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/routes/__root.tsx
git commit -m "feat: add root layout with Fumadocs RootProvider"
```

---

## Task 6: Create homepage

**Files:**
- Create: `src/routes/index.tsx`

- [ ] **Step 1: Create src/routes/index.tsx**

```tsx
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 text-center p-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">LuaDocs</h1>
        <p className="text-fd-muted-foreground text-lg">
          Reference documentation for the Lua programming language.
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          to="/docs/lua5"
          className="px-6 py-3 bg-fd-primary text-fd-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Lua 5 Docs
        </Link>
        <Link
          to="/docs/lua4"
          className="px-6 py-3 border border-fd-border rounded-lg font-semibold hover:bg-fd-accent transition-colors"
        >
          Lua 4 Docs
        </Link>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/routes/index.tsx
git commit -m "feat: add homepage with Lua 4 and Lua 5 doc links"
```

---

## Task 7: Create Lua 5 docs route

**Files:**
- Create: `src/routes/docs/lua5/$.tsx`

- [ ] **Step 1: Create src/routes/docs/lua5/$.tsx**

```tsx
import { createFileRoute, notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { lua5Source } from '@/lib/source';
import browserCollections from 'collections/browser';
import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from 'fumadocs-ui/page';

export const Route = createFileRoute('/docs/lua5/$')({
  component: Page,
  loader: async ({ params }) => {
    const slugs = params._splat?.split('/').filter(Boolean) ?? [];
    const data = await getPage({ data: slugs });
    await clientLoader.preload(data.path);
    return data;
  },
});

const getPage = createServerFn({ method: 'GET' })
  .inputValidator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }) => {
    const page = lua5Source.getPage(slugs);
    if (!page) throw notFound();
    return {
      path: page.path,
      toc: page.data.toc,
      title: page.data.title,
      description: page.data.description ?? '',
    };
  });

const clientLoader = browserCollections.lua5Docs.createClientLoader({
  component({ default: MDX }) {
    return (
      <DocsBody>
        <MDX />
      </DocsBody>
    );
  },
});

function Page() {
  const { toc, title, description } = Route.useLoaderData();

  return (
    <DocsPage toc={toc}>
      <DocsTitle>{title}</DocsTitle>
      <DocsDescription>{description}</DocsDescription>
      {clientLoader.useContent(Route.useLoaderData().path)}
    </DocsPage>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/routes/docs/lua5/$.tsx
git commit -m "feat: add lua5 splat route for Fumadocs page rendering"
```

---

## Task 8: Create Lua 4 docs route

**Files:**
- Create: `src/routes/docs/lua4/$.tsx`

- [ ] **Step 1: Create src/routes/docs/lua4/$.tsx**

```tsx
import { createFileRoute, notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { lua4Source } from '@/lib/source';
import browserCollections from 'collections/browser';
import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from 'fumadocs-ui/page';

export const Route = createFileRoute('/docs/lua4/$')({
  component: Page,
  loader: async ({ params }) => {
    const slugs = params._splat?.split('/').filter(Boolean) ?? [];
    const data = await getPage({ data: slugs });
    await clientLoader.preload(data.path);
    return data;
  },
});

const getPage = createServerFn({ method: 'GET' })
  .inputValidator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }) => {
    const page = lua4Source.getPage(slugs);
    if (!page) throw notFound();
    return {
      path: page.path,
      toc: page.data.toc,
      title: page.data.title,
      description: page.data.description ?? '',
    };
  });

const clientLoader = browserCollections.lua4Docs.createClientLoader({
  component({ default: MDX }) {
    return (
      <DocsBody>
        <MDX />
      </DocsBody>
    );
  },
});

function Page() {
  const { toc, title, description } = Route.useLoaderData();

  return (
    <DocsPage toc={toc}>
      <DocsTitle>{title}</DocsTitle>
      <DocsDescription>{description}</DocsDescription>
      {clientLoader.useContent(Route.useLoaderData().path)}
    </DocsPage>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/routes/docs/lua4/$.tsx
git commit -m "feat: add lua4 splat route for Fumadocs page rendering"
```

---

## Task 9: Create docs layout with sidebar

**Files:**
- Create: `src/routes/docs/route.tsx`

- [ ] **Step 1: Create src/routes/docs/route.tsx**

```tsx
import { createFileRoute, Outlet, Link, useRouterState } from '@tanstack/react-router';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { lua5Source, lua4Source } from '@/lib/source';

export const Route = createFileRoute('/docs')({
  component: DocsLayoutComponent,
});

function DocsLayoutComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLua4 = pathname.startsWith('/docs/lua4');
  const source = isLua4 ? lua4Source : lua5Source;

  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{
        title: (
          <Link to="/" className="font-bold text-lg">
            LuaDocs
          </Link>
        ),
        children: (
          <div className="flex gap-1 ml-4">
            <Link
              to="/docs/lua5/$"
              params={{ _splat: '' }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                !isLua4
                  ? 'bg-fd-primary text-fd-primary-foreground'
                  : 'hover:bg-fd-accent'
              }`}
            >
              Lua 5
            </Link>
            <Link
              to="/docs/lua4/$"
              params={{ _splat: '' }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                isLua4
                  ? 'bg-fd-primary text-fd-primary-foreground'
                  : 'hover:bg-fd-accent'
              }`}
            >
              Lua 4
            </Link>
          </div>
        ),
      }}
    >
      <Outlet />
    </DocsLayout>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/routes/docs/route.tsx
git commit -m "feat: add docs layout with Fumadocs sidebar and major version selector"
```

---

## Task 10: Create MDX components

**Files:**
- Create: `src/mdx-components.tsx`

- [ ] **Step 1: Create src/mdx-components.tsx**

```tsx
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...components,
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/mdx-components.tsx
git commit -m "feat: add MDX components with Fumadocs defaults"
```

---

## Task 11: Smoke test

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

Expected: server starts on `http://localhost:3000` with no errors.

- [ ] **Step 2: Check the homepage**

Open `http://localhost:3000`. Expected: page shows "LuaDocs" heading with "Lua 5 Docs" and "Lua 4 Docs" buttons.

- [ ] **Step 3: Check Lua 5 docs**

Click "Lua 5 Docs" or navigate to `http://localhost:3000/docs/lua5/`. Expected: Fumadocs layout renders with sidebar showing the lua5 page tree, content area shows the index page.

- [ ] **Step 4: Check Lua 4 docs**

Navigate to `http://localhost:3000/docs/lua4/`. Expected: same layout with lua4 sidebar and placeholder index page.

- [ ] **Step 5: Check a nested page**

Navigate to `http://localhost:3000/docs/lua5/functions/math/abs`. Expected: page renders (even if content is "Coming Soon"). If 404, check that `content/lua5/functions/math/abs.mdx` exists and `npm run postinstall` has been run.

- [ ] **Step 6: Check version selector pills**

Verify "Lua 5" and "Lua 4" pills appear in the nav and clicking them switches the sidebar tree and URL correctly.

- [ ] **Step 7: Push to origin**

```bash
git push origin dev
```

---

## What's Next

Plan 2 (`2026-05-07-luadocs-versioning.md`) covers:
- `VersionContext` populated from `?v=` URL search param
- `<VersionBlock since="5.4">` / `<VersionBlock since="5.3" until="5.4">`
- `<VersionBadge>` auto-rendered from frontmatter `since` field
- `<DeprecatedBlock>` warning callout
- `<VersionSelector>` minor version pill toggle in sidebar (5.3 / 5.4)

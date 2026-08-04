# Version-Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prove the whole risky stack on one page — static-prerendered Fumadocs-on-TanStack-Start, a fully custom UI, the compat-data-driven version-switching system, and a real Wasmoon runnable example — using `string.format` as the vehicle.

**Architecture:** TanStack Start (Vite) hosts the app and prerenders to static HTML. Fumadocs is used **headless** (`fumadocs-core` + `fumadocs-mdx`) for content source, page-tree, and MDX. A `SelectedVersion` React context (localStorage + `?v=` URL param) drives version-aware rendering. A separate **Zod-validated compat JSON** is the single source of version facts, feeding the version-support strip and the Option-C sidebar. Runnable examples execute **Wasmoon in a Web Worker** with a hard timeout.

**Tech Stack:** TanStack Start, `fumadocs-core`, `fumadocs-mdx`, Tailwind CSS, Base UI, CodeMirror 6, Shiki, Wasmoon, Vitest, Zustand (only if context proves insufficient).

## Global Constraints

- **Static output only, no server-side code** (ADR 0004). Deployable to any static host.
- **Versions are the minor lines `5.1`–`5.5` only** (ADR 0001); default/latest is `5.5`.
- **One canonical page + deltas; version facts live in the compat dataset, never hand-repeated in prose** (ADR 0001 / prototype finding #1).
- **Selected version:** global, `localStorage`-persisted, mirrored to a `?v=` query param, default `5.5` renders with **no** param (F2).
- **Runnable examples:** Web Worker + hard timeout; real `print` output routed to an output panel (F3).
- **Callouts are inline, never modals**; the callout set is Note / Warning / Gotcha only (F2, page-structure).
- **Commit messages** follow `docs/conventions/commit-messages.md` (MDN/Conventional style); **never** add a `Co-Authored-By` trailer.

---

## File Structure

- `vite.config.ts` — TanStack Start + Fumadocs MDX + Tailwind + prerender config.
- `src/lib/source.ts` — Fumadocs MDX collection (`defineDocs`) + Zod frontmatter schema
  (`lua-compat` key). **Note:** current `fumadocs-mdx` has no `source.config.ts`;
  `defineDocs` comes from `fumadocs-mdx/macro` and lives in this file.
- `src/routes/docs/$.tsx` — the catch-all docs route (loader + custom render).
- `content/docs/string.format.mdx` — the first ported entry. **Note:** content lives at
  `content/docs/`, not `src/content/docs/`.
- `src/compat/schema.ts` — Zod schema for a compat node.
- `src/compat/data/string.format.json` — compat facts for the entry.
- `src/compat/resolve.ts` — pure version-resolution functions.
- `src/version/SelectedVersionProvider.tsx` — React context (localStorage + `?v=`).
- `src/version/VersionSwitcher.tsx` — Base UI switcher.
- `src/version/VersionSupportStrip.tsx` — the compact strip.
- `src/sidebar/Sidebar.tsx` — minimal Option-C sidebar (dim + badge).
- `src/runner/luaWorker.ts` — Web Worker running Wasmoon.
- `src/runner/runLua.ts` — main-thread controller (spawn worker + timeout).
- `src/runner/RunnableExample.tsx` — the island (editor + Run + output panel).
- `tests/**` — Vitest unit tests mirroring the above.

---

## Task 1: Scaffold Fumadocs + TanStack Start and prove static prerender

> **DONE — as built (commit `cfa9f56`).** The steps below are kept as the original
> record; where they disagree with the repo, the repo wins. Differences: the
> `create-fumadocs-app` CLI is interactive and has no `--no-install`, so the template
> was extracted from the published tarball; the `tanstack-start-spa` template was used
> (it already ships the SPA+prerender config of Step 3, so Step 3 was a no-op); there
> is no `source.config.ts`; content lives in `content/docs/`. Gate passed —
> `.output/public/docs/test/index.html` contains real prerendered page text.

**Files:**
- Create: project scaffold at repo root (`package.json`, `vite.config.ts`, `src/`).
- Modify: `.gitignore` (add `node_modules`, `dist`, `.output`, `.tanstack`).

**Interfaces:**
- Produces: a working `npm run build` that emits static HTML for at least one docs page.

- [ ] **Step 1: Scaffold from the Fumadocs TanStack Start template**

Run (non-interactive):
```bash
npm create fumadocs-app@latest luadocs-app -- --template tanstack-start --no-install
```
Move the generated files into the repo root (keeping existing `docs/`, `CONTEXT.md`), or scaffold into a temp dir and copy. Preserve the existing `docs/` tree.

- [ ] **Step 2: Install dependencies**

Run: `npm install`
Then add slice deps: `npm install wasmoon @base-ui-components/react codemirror @codemirror/lang-javascript`
And dev deps: `npm install -D vitest @vitest/ui jsdom`

- [ ] **Step 3: Enable static prerender in `vite.config.ts`**

```ts
import react from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import { fumadocsMdx } from 'fumadocs-mdx/vite';

export default defineConfig({
  plugins: [
    fumadocsMdx({ forcedConfig: await import('./source.config') }),
    tailwindcss(),
    tsConfigPaths({ projects: ['./tsconfig.json'] }),
    tanstackStart({
      spa: { enabled: true, prerender: { enabled: true } },
    }),
    react(),
  ],
});
```

- [ ] **Step 4: Build and verify static output exists**

Run: `npm run build`
Expected: build succeeds and a static HTML file for the default docs route exists under the build output (e.g. `.output/public/**/index.html` or `dist/**`). Confirm by listing the output dir and finding at least one prerendered `*.html` containing page text.

- [ ] **Step 5: Add Vitest config**

Create `vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: { environment: 'jsdom', globals: true },
});
```
Run: `npx vitest run` — expected: passes with "no test files found" (0 tests) — confirms the runner is wired.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold Fumadocs on TanStack Start with static prerender"
```

**GATE:** If static prerender does not produce HTML, STOP — this is ADR 0005's fail-fast checkpoint. Re-evaluate the host before continuing.

---

## Task 2: Compat schema + data (single source of version facts)

**Files:**
- Create: `src/compat/schema.ts`, `src/compat/data/string.format.json`
- Test: `tests/compat/schema.test.ts`

**Interfaces:**
- Produces: `compatNodeSchema` (Zod), `type CompatNode`, and a validated JSON compat node keyed by version.

- [ ] **Step 1: Write the failing test**

`tests/compat/schema.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { compatNodeSchema } from '@/compat/schema';

const valid = {
  support: {
    lua: { version_added: '5.1' },
  },
  changed_in: { '5.3': 'Integer directives now require an integer representation.' },
};

describe('compatNodeSchema', () => {
  it('accepts a valid compat node', () => {
    expect(() => compatNodeSchema.parse(valid)).not.toThrow();
  });

  it('rejects an unknown version key in changed_in', () => {
    const bad = { support: { lua: { version_added: '5.1' } }, changed_in: { '4.0': 'nope' } };
    expect(() => compatNodeSchema.parse(bad)).toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/compat/schema.test.ts`
Expected: FAIL — `@/compat/schema` not found.

- [ ] **Step 3: Write the schema**

`src/compat/schema.ts`:
```ts
import { z } from 'zod';

export const LUA_VERSIONS = ['5.1', '5.2', '5.3', '5.4', '5.5'] as const;
export type LuaVersion = (typeof LUA_VERSIONS)[number];
const versionEnum = z.enum(LUA_VERSIONS);

export const compatNodeSchema = z.object({
  support: z.object({
    lua: z.object({
      version_added: z.union([versionEnum, z.literal(false)]),
      version_removed: versionEnum.optional(),
    }),
  }),
  changed_in: z.record(versionEnum, z.string()).optional(),
  notes: z.string().optional(),
});

export type CompatNode = z.infer<typeof compatNodeSchema>;
```

- [ ] **Step 4: Create the compat data file**

`src/compat/data/string.format.json`:
```json
{
  "support": { "lua": { "version_added": "5.1" } },
  "changed_in": {
    "5.2": "Adds %a/%A (hexadecimal float).",
    "5.3": "Integer directives require an integer representation or raise.",
    "5.4": "%q handles more value kinds (floats, nil)."
  }
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run tests/compat/schema.test.ts`
Expected: PASS (both tests).

- [ ] **Step 6: Commit**

```bash
git add src/compat tests/compat
git commit -m "feat: add compat node schema and string.format data"
```

---

## Task 3: Version-resolution logic (pure functions)

**Files:**
- Create: `src/compat/resolve.ts`
- Test: `tests/compat/resolve.test.ts`

**Interfaces:**
- Consumes: `CompatNode`, `LuaVersion` from `@/compat/schema`.
- Produces:
  - `isAvailable(node: CompatNode, v: LuaVersion): boolean`
  - `changeNoteFor(node: CompatNode, v: LuaVersion): string | null`
  - `supportRow(node: CompatNode): { version: LuaVersion; state: 'yes' | 'no' | 'changed' }[]`

- [ ] **Step 1: Write the failing test**

`tests/compat/resolve.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { isAvailable, changeNoteFor, supportRow } from '@/compat/resolve';
import type { CompatNode } from '@/compat/schema';

const node: CompatNode = {
  support: { lua: { version_added: '5.3' } },
  changed_in: { '5.4': 'Tightened coercion.' },
};

describe('isAvailable', () => {
  it('false before version_added', () => expect(isAvailable(node, '5.1')).toBe(false));
  it('true from version_added onward', () => expect(isAvailable(node, '5.3')).toBe(true));
});

describe('changeNoteFor', () => {
  it('returns the note for a changed version', () =>
    expect(changeNoteFor(node, '5.4')).toBe('Tightened coercion.'));
  it('returns null when unchanged', () => expect(changeNoteFor(node, '5.5')).toBeNull());
});

describe('supportRow', () => {
  it('marks unavailable, available, and changed states', () => {
    expect(supportRow(node)).toEqual([
      { version: '5.1', state: 'no' },
      { version: '5.2', state: 'no' },
      { version: '5.3', state: 'yes' },
      { version: '5.4', state: 'changed' },
      { version: '5.5', state: 'yes' },
    ]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/compat/resolve.test.ts`
Expected: FAIL — `@/compat/resolve` not found.

- [ ] **Step 3: Write the implementation**

`src/compat/resolve.ts`:
```ts
import { LUA_VERSIONS, type CompatNode, type LuaVersion } from './schema';

const idx = (v: LuaVersion) => LUA_VERSIONS.indexOf(v);

export function isAvailable(node: CompatNode, v: LuaVersion): boolean {
  const added = node.support.lua.version_added;
  if (added === false) return false;
  const removed = node.support.lua.version_removed;
  if (idx(v) < idx(added)) return false;
  if (removed && idx(v) >= idx(removed)) return false;
  return true;
}

export function changeNoteFor(node: CompatNode, v: LuaVersion): string | null {
  return node.changed_in?.[v] ?? null;
}

export function supportRow(node: CompatNode) {
  return LUA_VERSIONS.map((version) => {
    if (!isAvailable(node, version)) return { version, state: 'no' as const };
    if (changeNoteFor(node, version)) return { version, state: 'changed' as const };
    return { version, state: 'yes' as const };
  });
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/compat/resolve.test.ts`
Expected: PASS (all).

- [ ] **Step 5: Commit**

```bash
git add src/compat/resolve.ts tests/compat/resolve.test.ts
git commit -m "feat: add version-resolution logic"
```

---

## Task 4: SelectedVersion context (default latest, localStorage, `?v=`)

**Files:**
- Create: `src/version/SelectedVersionProvider.tsx`
- Test: `tests/version/selected-version.test.tsx`

**Interfaces:**
- Consumes: `LUA_VERSIONS`, `LuaVersion` from `@/compat/schema`.
- Produces: `<SelectedVersionProvider>` and `useSelectedVersion(): { version: LuaVersion; setVersion(v: LuaVersion): void }`.

- [ ] **Step 1: Write the failing test**

`tests/version/selected-version.test.tsx`:
```tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { SelectedVersionProvider, useSelectedVersion } from '@/version/SelectedVersionProvider';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SelectedVersionProvider>{children}</SelectedVersionProvider>
);

describe('useSelectedVersion', () => {
  beforeEach(() => localStorage.clear());

  it('defaults to 5.5', () => {
    const { result } = renderHook(() => useSelectedVersion(), { wrapper });
    expect(result.current.version).toBe('5.5');
  });

  it('persists a set version to localStorage', () => {
    const { result } = renderHook(() => useSelectedVersion(), { wrapper });
    act(() => result.current.setVersion('5.1'));
    expect(result.current.version).toBe('5.1');
    expect(localStorage.getItem('luadocs.version')).toBe('5.1');
  });
});
```

Install test deps: `npm install -D @testing-library/react @testing-library/dom`

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/version/selected-version.test.tsx`
Expected: FAIL — provider not found.

- [ ] **Step 3: Write the provider**

`src/version/SelectedVersionProvider.tsx`:
```tsx
import { createContext, useContext, useCallback, useState, type ReactNode } from 'react';
import { LUA_VERSIONS, type LuaVersion } from '@/compat/schema';

const DEFAULT: LuaVersion = '5.5';
const KEY = 'luadocs.version';

function isLuaVersion(v: string | null): v is LuaVersion {
  return !!v && (LUA_VERSIONS as readonly string[]).includes(v);
}

function initialVersion(): LuaVersion {
  if (typeof window === 'undefined') return DEFAULT;
  const url = new URLSearchParams(window.location.search).get('v');
  if (isLuaVersion(url)) return url;
  const stored = localStorage.getItem(KEY);
  return isLuaVersion(stored) ? stored : DEFAULT;
}

type Ctx = { version: LuaVersion; setVersion: (v: LuaVersion) => void };
const SelectedVersion = createContext<Ctx | null>(null);

export function SelectedVersionProvider({ children }: { children: ReactNode }) {
  const [version, setVersionState] = useState<LuaVersion>(initialVersion);

  const setVersion = useCallback((v: LuaVersion) => {
    setVersionState(v);
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEY, v);
    const url = new URL(window.location.href);
    if (v === DEFAULT) url.searchParams.delete('v');
    else url.searchParams.set('v', v);
    window.history.replaceState({}, '', url);
  }, []);

  return <SelectedVersion.Provider value={{ version, setVersion }}>{children}</SelectedVersion.Provider>;
}

export function useSelectedVersion(): Ctx {
  const ctx = useContext(SelectedVersion);
  if (!ctx) throw new Error('useSelectedVersion must be used within SelectedVersionProvider');
  return ctx;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/version/selected-version.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/version tests/version
git commit -m "feat: add selected-version context"
```

---

## Task 5: Lua runner — Web Worker + timeout + print capture

**Files:**
- Create: `src/runner/luaWorker.ts`, `src/runner/runLua.ts`
- Test: `tests/runner/run-lua.test.ts`

**Interfaces:**
- Produces: `runLua(code: string, opts?: { timeoutMs?: number }): Promise<{ output: string; error: string | null }>`.
- The worker message protocol: post `{ code }` → receive `{ output, error }`.

- [ ] **Step 1: Write the failing test (against an injectable runner core)**

To keep the worker testable without a real Worker in jsdom, factor the Lua execution into a pure `executeLua` used by the worker, and test it directly.

`tests/runner/run-lua.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { executeLua } from '@/runner/luaWorker';

describe('executeLua', () => {
  it('captures print output', async () => {
    const r = await executeLua('print("hi", 42)');
    expect(r.output.trim()).toBe('hi\t42');
    expect(r.error).toBeNull();
  });

  it('reports a Lua error', async () => {
    const r = await executeLua('error("boom")');
    expect(r.error).toMatch(/boom/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/runner/run-lua.test.ts`
Expected: FAIL — `executeLua` not found.

- [ ] **Step 3: Implement `executeLua` and the worker wrapper**

`src/runner/luaWorker.ts`:
```ts
import { LuaFactory } from 'wasmoon';

export async function executeLua(code: string): Promise<{ output: string; error: string | null }> {
  const factory = new LuaFactory();
  const lua = await factory.createEngine();
  let output = '';
  try {
    lua.global.set('print', (...args: unknown[]) => {
      output += args.map((a) => (a === undefined ? 'nil' : String(a))).join('\t') + '\n';
    });
    await lua.doString(code);
    return { output, error: null };
  } catch (e) {
    return { output, error: e instanceof Error ? e.message : String(e) };
  } finally {
    lua.global.close();
  }
}

// Worker entry (only runs in a Worker context)
if (typeof self !== 'undefined' && 'onmessage' in self) {
  self.onmessage = async (e: MessageEvent<{ code: string }>) => {
    const result = await executeLua(e.data.code);
    (self as unknown as Worker).postMessage(result);
  };
}
```

`src/runner/runLua.ts`:
```ts
export function runLua(code: string, opts: { timeoutMs?: number } = {}): Promise<{ output: string; error: string | null }> {
  const timeoutMs = opts.timeoutMs ?? 3000;
  return new Promise((resolve) => {
    const worker = new Worker(new URL('./luaWorker.ts', import.meta.url), { type: 'module' });
    const timer = setTimeout(() => {
      worker.terminate();
      resolve({ output: '', error: `Execution timed out after ${timeoutMs}ms` });
    }, timeoutMs);
    worker.onmessage = (e: MessageEvent<{ output: string; error: string | null }>) => {
      clearTimeout(timer);
      worker.terminate();
      resolve(e.data);
    };
  });
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/runner/run-lua.test.ts`
Expected: PASS. (If Wasmoon needs the wasm asset resolved in the test env, add `server.deps.inline: ['wasmoon']` to `vitest.config.ts`.)

- [ ] **Step 5: Commit**

```bash
git add src/runner tests/runner
git commit -m "feat: add Wasmoon lua runner with timeout"
```

---

## Task 6: UI components — VersionSupportStrip, VersionSwitcher, RunnableExample

**Files:**
- Create: `src/version/VersionSupportStrip.tsx`, `src/version/VersionSwitcher.tsx`, `src/runner/RunnableExample.tsx`
- Test: `tests/version/support-strip.test.tsx`

**Interfaces:**
- Consumes: `useSelectedVersion`, `supportRow`, `runLua`.
- `VersionSupportStrip` props: `{ node: CompatNode }`.
- `VersionSwitcher` props: none (reads/writes context).
- `RunnableExample` props: `{ code: string }`.

- [ ] **Step 1: Write the failing test**

`tests/version/support-strip.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VersionSupportStrip } from '@/version/VersionSupportStrip';
import type { CompatNode } from '@/compat/schema';

const node: CompatNode = { support: { lua: { version_added: '5.3' } }, changed_in: { '5.4': 'x' } };

describe('VersionSupportStrip', () => {
  it('shows a chip per version with state labels', () => {
    render(<VersionSupportStrip node={node} />);
    expect(screen.getByText('5.1')).toHaveAttribute('data-state', 'no');
    expect(screen.getByText('5.3')).toHaveAttribute('data-state', 'yes');
    expect(screen.getByText('5.4')).toHaveAttribute('data-state', 'changed');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/version/support-strip.test.tsx`
Expected: FAIL — component not found.

- [ ] **Step 3: Implement the components**

`src/version/VersionSupportStrip.tsx`:
```tsx
import { supportRow } from '@/compat/resolve';
import type { CompatNode } from '@/compat/schema';

export function VersionSupportStrip({ node }: { node: CompatNode }) {
  return (
    <div className="flex gap-2 text-sm" aria-label="Version support">
      {supportRow(node).map(({ version, state }) => (
        <span key={version} data-state={state} className="rounded px-2 py-0.5 border">
          {version}
        </span>
      ))}
    </div>
  );
}
```

`src/version/VersionSwitcher.tsx`:
```tsx
import { LUA_VERSIONS } from '@/compat/schema';
import { useSelectedVersion } from './SelectedVersionProvider';

export function VersionSwitcher() {
  const { version, setVersion } = useSelectedVersion();
  return (
    <label className="text-sm">
      Lua version{' '}
      <select value={version} onChange={(e) => setVersion(e.target.value as (typeof LUA_VERSIONS)[number])}>
        {LUA_VERSIONS.map((v) => (
          <option key={v} value={v}>{v}</option>
        ))}
      </select>
    </label>
  );
}
```
(Base UI's `Select` replaces the native `<select>` in a later polish pass; native is fine for the slice and keeps the test simple.)

`src/runner/RunnableExample.tsx`:
```tsx
import { useState } from 'react';
import { runLua } from './runLua';

export function RunnableExample({ code }: { code: string }) {
  const [source, setSource] = useState(code);
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);

  async function run() {
    setRunning(true);
    const r = await runLua(source);
    setOutput(r.error ? `error: ${r.error}` : r.output);
    setRunning(false);
  }

  return (
    <div className="rounded border">
      <textarea value={source} onChange={(e) => setSource(e.target.value)} className="w-full font-mono" rows={4} />
      <div className="flex gap-2 p-2">
        <button onClick={run} disabled={running}>{running ? 'Running…' : 'Run'}</button>
        <button onClick={() => setSource(code)}>Reset</button>
      </div>
      {output && <pre className="p-2" aria-label="output">{output}</pre>}
    </div>
  );
}
```
(CodeMirror replaces the `<textarea>` in a later polish pass; textarea keeps the slice testable.)

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/version/support-strip.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/version src/runner tests/version/support-strip.test.tsx
git commit -m "feat: add version strip, switcher, and runnable-example components"
```

---

## Task 7: Wire the `string.format` page end-to-end

**Files:**
- Create: `content/docs/string.format.mdx`
- Modify: `src/routes/docs/$.tsx` (render strip + switcher + compat wiring), `src/lib/source.ts` (frontmatter schema with `lua-compat`)
- Create: `src/sidebar/Sidebar.tsx`
- Test: `tests/e2e/string-format.test.tsx` (component-level render of the assembled page)

**Interfaces:**
- Consumes: everything above.
- Produces: a rendered `string.format` page showing the switcher, the version-support strip, an inline change-note that reflects the selected version, an Option-C sidebar entry, and a working runnable example.

- [ ] **Step 1: Author the entry MDX (ported from the prototype)**

`content/docs/string.format.mdx` — frontmatter carries the compat pointer; prose omits hand-written version facts (they come from compat data):
```mdx
---
title: string.format
lua-compat: string.format
---

Builds a string by inserting values into a template, using the same directives as C's `printf`.

<RunnableExample code={`print(string.format("%s is %d years old", "Ada", 36))`} />
```

- [ ] **Step 2: Extend the Fumadocs frontmatter schema**

There is no `source.config.ts` in current `fumadocs-mdx` — the collection is declared
inline via the `fumadocs-mdx/macro` `defineDocs`. Extend the existing call in
`src/lib/source.ts`, keeping the `async` and `postprocess` options already there:

```ts
import { defineDocs } from 'fumadocs-mdx/macro';
import { pageSchema } from 'fumadocs-core/source/schema';
import { z } from 'zod';

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    async: true,
    schema: pageSchema.extend({ 'lua-compat': z.string().optional() }),
    postprocess: { includeProcessedMarkdown: true },
  },
});
```

`defineDocs` is a build-time macro: its arguments must be statically analyzable, so
the schema has to be written inline rather than imported from another module.

- [ ] **Step 3: Assemble the page in the docs route**

In `src/routes/docs/$.tsx`, wrap content in `SelectedVersionProvider`, load the page's compat JSON by its `lua-compat` key, and render `VersionSwitcher` + `VersionSupportStrip` + the MDX body (with `RunnableExample` in the MDX component map). Render the selected-version change note via `changeNoteFor`.

- [ ] **Step 4: Build the Option-C sidebar**

`src/sidebar/Sidebar.tsx`: given the page-tree and a map of compat nodes, render each entry; if `!isAvailable(node, selectedVersion)`, add `data-unavailable="true"` (dim) and a `5.3+`-style badge. Keep entries clickable.

- [ ] **Step 5: Write a component test for version-reactive rendering**

`tests/e2e/string-format.test.tsx`: render the assembled page inside `SelectedVersionProvider`; assert that switching to `5.1` marks `string.format`'s strip chip for 5.1 as `data-state="no"` and shows the availability note, and that switching to `5.4` surfaces the 5.4 change note.

- [ ] **Step 6: Run tests + build**

Run: `npx vitest run` then `npm run build`
Expected: tests PASS; build emits a prerendered `string.format` HTML page.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: wire string.format page with version system and runnable example"
```

**GATE:** Manually run `npm run dev`, open the page, switch versions, and Run the example. Confirm: the strip/notes react to the switch, the sidebar dims correctly, and the example prints real output. This is the slice's success criterion.

---

## Self-review notes

- **Spec coverage:** static prerender (ADR 0004) → Task 1; compat-data single-source (ADR 0001 / F9) → Tasks 2–3, 7; version selection F2 → Task 4; runnable example F3 → Tasks 5–6; page anatomy/version display F8 → Tasks 6–7; Option-C sidebar F7 → Task 7. Search (F5), full page anatomy, cross-linking (F6), Playground (F4), and per-version WASM builds (T4) are **out of this slice** by design — this slice proves feasibility, not completeness.
- **Deferred within the slice:** Base UI Select and CodeMirror are swapped in during a later polish pass (native `<select>`/`<textarea>` keep tasks testable); noted inline so it is intentional, not forgotten.
- **Constant/lighter template and conditional matrix (prototype findings #2/#3)** are page-anatomy polish, not part of proving the stack — deferred.

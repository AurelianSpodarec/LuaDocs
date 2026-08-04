# Per-Version Lua Runtime Spike — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Answer, with working artifacts rather than argument, whether LuaDocs can execute examples in the reader's *selected* Lua version — and what that costs in build complexity, bundle size, and ongoing maintenance.

**Architecture:** This is a **spike**, not a feature slice. Its deliverable is a decision document backed by real builds. The approach: Wasmoon's WASM build step is already version-agnostic (its `build.sh` globs `./lua/*.c`), so the Lua VM itself should compile for any version by swapping the source tree. The version-specific cost lives in two places — the ~150-symbol `EXPORTED_FUNCTIONS` list, and Wasmoon's JS binding layer, both of which are shaped around Lua 5.4's C API. The spike builds the two extremes (5.1, the furthest from 5.4; and 5.5, the newest) to bracket that cost, then extrapolates.

**Tech Stack:** Emscripten (`wasm32-unknown-emscripten` — Lua needs `setjmp`, so `wasm32-unknown-unknown` is not an option), Lua 5.1.5 / 5.4.x / 5.5.0 sources from lua.org, Wasmoon as the reference binding layer, Vitest.

## Global Constraints

- **This is timeboxed.** If Task 4 (Lua 5.1) is not producing output after a focused effort, stop and write the decision doc with "5.1 is expensive" as the finding. A negative result delivered early is the point of a spike.
- **Work stays on `dev`.** Never merge to `main`; ask explicitly before any merge or push (`CLAUDE.md`).
- **Versions are the minor lines `5.1`–`5.5`**; default/latest is `5.5` (ADR 0001).
- **Static output only, no server-side code** (ADR 0004). Every WASM binary must be a static asset the browser fetches.
- **Nothing in this spike changes the authoring model.** Compat data stays the single source of version facts (ADR 0001).
- **Commit messages** follow `docs/conventions/commit-messages.md`; **never** a `Co-Authored-By` trailer.
- Spike artifacts live in `spike/per-version-lua/` and are **not** wired into the site, except Task 1.

## What we already know (do not re-research)

- Wasmoon is Lua **5.4** only. Its `build.sh` compiles `./lua/*.c` (excluding `lua.c`, `luac.c`) with Emscripten, `-O3`, `MODULARIZE=1`, `EXPORT_NAME="initWasmModule"`, `ENVIRONMENT="web,worker,node"`. The Lua version is **not** hardcoded — it is whatever is in `./lua/`.
- The `EXPORTED_FUNCTIONS` list **is** 5.4-shaped. Confirmed present: `lua_rawlen`, `lua_absindex`, `lua_pcallk`, `luaL_setfuncs` (5.2+); `lua_geti`, `lua_seti`, `lua_isinteger`, `lua_tointegerx` (5.3+); `lua_newuserdatauv`, `lua_resetthread`, `lua_setwarnf`, `lua_toclose` (5.4 only). Confirmed absent: `lua_objlen`, `lua_getfenv`, `luaL_register` (5.1 spellings).
- So the per-version work shrinks as versions approach 5.4: **5.1 is the worst case**, 5.2 and 5.3 are intermediate, 5.4 is free, 5.5 is unknown.
- A third-party fork exists — `wasmoon-lua5.1` (`github.com/X3ZvaWQ/wasmoon-lua5.1`), last published **February 2024**. Useful as a **reference for what had to change**; too stale to depend on.
- **Lua 5.5.0 was released 22 December 2025**, so documenting 5.5 is legitimate.
- Lua's own sources are small and have no dependencies beyond libc.

## File Structure

- `spike/per-version-lua/README.md` — how to run the spike, and its findings.
- `spike/per-version-lua/build-lua.sh` — parameterised build: takes a Lua version, produces a `.wasm` + JS loader.
- `spike/per-version-lua/symbols/<version>.txt` — the exported-symbol list per version.
- `spike/per-version-lua/out/` — build artifacts (git-ignored).
- `spike/per-version-lua/smoke.test.ts` — runs the same Lua snippets against each built version and records what each prints.
- `docs/research/tech/per-version-lua.md` — **the deliverable**: findings, costs, recommendation.
- `src/runner/RunnableExample.tsx` — modified in Task 1 only.

---

## Task 1: Disclose the current 5.4-only limitation

This ships regardless of how the spike turns out. Today a reader can select 5.1, press Run, and silently get Lua 5.4 semantics — the site is quietly wrong about its central promise.

**Files:**
- Modify: `src/runner/RunnableExample.tsx`
- Test: `tests/runner/runnable-example.test.tsx`

**Interfaces:**
- Consumes: `useSelectedVersion()` from `@/version/SelectedVersionProvider` — returns `{ version: LuaVersion; setVersion(v: LuaVersion): void }`.
- Produces: no new exports. `RunnableExample`'s props are unchanged: `{ code: string }`.

- [ ] **Step 1: Write the failing test**

Add to `tests/runner/runnable-example.test.tsx`. Note the existing tests in this file mock `@/runner/runLua`; keep that mock. Render inside `SelectedVersionProvider` and drive the switcher the same way `tests/e2e/string-format.test.tsx` does.

```tsx
it('discloses that examples run 5.4 when another version is selected', () => {
  renderWithVersion('5.1');
  expect(screen.getByRole('note', { name: /runtime version/i })).toHaveTextContent(
    /runs Lua 5\.4/i,
  );
});

it('shows no runtime disclosure when the selected version is what actually runs', () => {
  renderWithVersion('5.4');
  expect(screen.queryByRole('note', { name: /runtime version/i })).toBeNull();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/runner/runnable-example.test.tsx`
Expected: FAIL — no element with that role/name.

- [ ] **Step 3: Implement the disclosure**

In `RunnableExample`, read the selected version and render an inline note — never a modal (Global Constraints of the version slice) — when it differs from the runtime's actual version. Add a module constant so the value has one home:

```tsx
/** The Lua version Wasmoon actually executes, regardless of the selected version. */
export const RUNTIME_LUA_VERSION = '5.4';
```

Render it next to the Run button, with `role="note"` and an accessible name matching `/runtime version/i`. Keep the wording factual: that examples execute Lua `5.4` and output may differ from the selected version.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run` — expected: all pass, including the pre-existing 44.

- [ ] **Step 5: Commit**

```bash
git add src/runner tests/runner
git commit -m "feat(runner): disclose that examples run Lua 5.4"
```

---

## Task 2: Reproduce the baseline — build Lua 5.4 to WASM ourselves

Before proving anything about other versions, prove we can rebuild what we already have. If this fails, nothing downstream matters.

**Files:**
- Create: `spike/per-version-lua/build-lua.sh`, `spike/per-version-lua/README.md`
- Modify: `.gitignore` (add `spike/per-version-lua/out/`, `spike/per-version-lua/lua-*/`)

**Interfaces:**
- Produces: `build-lua.sh <version>` → `out/lua-<version>.wasm` and `out/lua-<version>.js`, where `<version>` is a full Lua release like `5.4.7`.

- [ ] **Step 1: Confirm the toolchain**

Run: `emcc --version`
If absent, install Emscripten (emsdk) and re-run. Record the version in the README. Do not proceed without a working `emcc` — everything below depends on it.

- [ ] **Step 2: Write the parameterised build script**

`spike/per-version-lua/build-lua.sh` takes a full Lua version, downloads that release from `https://www.lua.org/ftp/lua-<version>.tar.gz`, unpacks it, and compiles every `.c` in `src/` except `lua.c` and `luac.c` — mirroring Wasmoon's approach, which is version-agnostic by design.

Use these Emscripten flags, matching Wasmoon's production build:

```
-O3 -s WASM=1 -s MODULARIZE=1 -s EXPORT_NAME="initWasmModule"
-s ALLOW_MEMORY_GROWTH=1 -s MALLOC=emmalloc
-s ENVIRONMENT="web,worker,node"
-s EXPORTED_FUNCTIONS=@symbols/<major.minor>.txt
-s EXPORTED_RUNTIME_METHODS=["ccall","cwrap","addFunction","removeFunction","UTF8ToString","stringToUTF8","lengthBytesUTF8"]
-s ALLOW_TABLE_GROWTH=1
```

Take the symbol list from a file so each version can differ — that difference is the thing we are measuring.

- [ ] **Step 3: Capture the 5.4 symbol list**

Create `spike/per-version-lua/symbols/5.4.txt` from Wasmoon's `EXPORTED_FUNCTIONS` (see `github.com/ceifa/wasmoon/blob/main/build.sh`), one `_`-prefixed symbol per line.

- [ ] **Step 4: Build and verify**

Run: `bash build-lua.sh 5.4.7`
Expected: `out/lua-5.4.7.wasm` exists. Record its size in bytes in the README — this is the baseline every other version is compared against.

- [ ] **Step 5: Commit**

```bash
git add spike/per-version-lua .gitignore
git commit -m "spike: build Lua 5.4 to wasm from source"
```

---

## Task 3: Build Lua 5.5 — the near neighbour

**Files:**
- Create: `spike/per-version-lua/symbols/5.5.txt`
- Modify: `spike/per-version-lua/README.md`

**Interfaces:**
- Consumes: `build-lua.sh` from Task 2.
- Produces: `out/lua-5.5.0.wasm`, plus a recorded diff between the 5.4 and 5.5 symbol lists.

- [ ] **Step 1: Attempt the build with the unmodified 5.4 symbol list**

Run: `bash build-lua.sh 5.5.0`
This will likely fail or warn on symbols that no longer exist. **Record the exact error output** — that list *is* the finding.

- [ ] **Step 2: Derive the real 5.5 symbol list**

For each symbol Emscripten reports as undefined, check it against the Lua 5.5 manual and headers (`lua-5.5.0/src/lua.h`, `lauxlib.h`). Remove what genuinely no longer exists; add 5.5 additions the 5.4 list lacks. Write `symbols/5.5.txt`.

- [ ] **Step 3: Rebuild and record**

Run: `bash build-lua.sh 5.5.0`
Expected: `out/lua-5.5.0.wasm` exists. Record its size, and record in the README exactly which symbols were added and removed versus 5.4.

- [ ] **Step 4: Commit**

```bash
git add spike/per-version-lua
git commit -m "spike: build Lua 5.5 to wasm"
```

---

## Task 4: Build Lua 5.1 — the worst case, and the real answer

This is the task the spike exists for. 5.1 is furthest from the API Wasmoon's bindings assume.

**Files:**
- Create: `spike/per-version-lua/symbols/5.1.txt`
- Modify: `spike/per-version-lua/README.md`

**Interfaces:**
- Consumes: `build-lua.sh` from Task 2.
- Produces: `out/lua-5.1.5.wasm`, plus a written account of every C API difference that the JS binding layer would have to absorb.

- [ ] **Step 1: Write the 5.1 symbol list from the 5.1 headers, not from the 5.4 list**

Start from `lua-5.1.5/src/lua.h` and `lauxlib.h` and export what actually exists. These are known differences to expect — verify each against the headers rather than trusting this list:

| 5.4 symbol | Lua 5.1 situation |
|---|---|
| `lua_rawlen` | absent — 5.1 has `lua_objlen` |
| `lua_absindex` | absent (5.2+) |
| `lua_pcallk` | absent — 5.1 has only `lua_pcall` |
| `luaL_setfuncs` | absent — 5.1 has `luaL_register` |
| `lua_geti` / `lua_seti` | absent (5.3+) |
| `lua_isinteger` / `lua_tointegerx` | absent — 5.1 has no integer subtype |
| `lua_newuserdatauv` | absent — 5.1 has `lua_newuserdata` |
| `lua_resetthread`, `lua_setwarnf`, `lua_toclose` | absent (5.4 only) |
| — | 5.1 additionally has `lua_getfenv` / `lua_setfenv` |

- [ ] **Step 2: Build**

Run: `bash build-lua.sh 5.1.5`
Expected: `out/lua-5.1.5.wasm` exists. If it does not, record the blocking error and **go to Task 6** — that is a legitimate spike outcome.

- [ ] **Step 3: Write down the binding-layer cost**

The WASM building is only half the question. Read Wasmoon's JS binding layer and list every call site that uses a symbol from the table above. For each, note what the 5.1 equivalent would be. Consult `github.com/X3ZvaWQ/wasmoon-lua5.1` as a reference for what a real 5.1 fork had to change — but treat it as evidence, not a dependency; it has not been published since February 2024.

Record this as a **count of call sites and a difficulty judgement**, not a plan to fix them. The spike answers "how big", not "here is the fix".

- [ ] **Step 4: Commit**

```bash
git add spike/per-version-lua
git commit -m "spike: build Lua 5.1 to wasm and cost the bindings"
```

---

## Task 5: Measure what shipping five runtimes actually costs

**Files:**
- Create: `spike/per-version-lua/smoke.test.ts`
- Modify: `spike/per-version-lua/README.md`

**Interfaces:**
- Consumes: the `out/*.wasm` artifacts from Tasks 2–4.
- Produces: a size table and a behavioural difference table.

- [ ] **Step 1: Write the smoke test**

`smoke.test.ts` runs the same snippets against each built runtime and records — not asserts — what each prints. The point is to *observe* version differences, which is the whole product premise:

```ts
const SNIPPETS = [
  'print(_VERSION)',
  'print(1/2)',            // 5.3+ integer division semantics differ
  'print(math.type and math.type(1) or "no math.type")',
  'print(#"héllo")',
  'print(string.format("%d", 3.0))',  // errors in 5.3+, works in 5.1/5.2
];
```

Record a table of version × snippet → output.

- [ ] **Step 2: Record the size table**

For each built `.wasm`: raw bytes and gzipped bytes. State the total if all five shipped, and the per-page cost if exactly one is fetched on demand (which is the only sane loading strategy — a reader uses one version at a time).

- [ ] **Step 3: Commit**

```bash
git add spike/per-version-lua
git commit -m "spike: measure per-version runtime size and behaviour"
```

---

## Task 6: Write the decision document

**Files:**
- Create: `docs/research/tech/per-version-lua.md`

This is the spike's actual deliverable. Everything above exists to make this document evidence-based.

- [ ] **Step 1: Write it**

Structure it as: what was attempted, what built and what did not, the measured sizes, the observed behavioural differences between versions, the counted binding-layer cost for 5.1, and a recommendation among these options — stated plainly, with the cost of each:

1. **Build all five ourselves.** Highest cost, fully delivers the promise.
2. **Build the subset that is cheap** (5.3, 5.4, 5.5 — closest to Wasmoon's API) and mark 5.1/5.2 examples as non-runnable, showing static code with the version note.
3. **Keep one runtime** and permanently disclose the limitation (Task 1's note becomes the permanent answer).
4. **Abandon runnable examples for non-default versions** and make the Playground 5.4-only.

Recommend one. Say what would change your mind.

- [ ] **Step 2: Update the roadmap**

Move the per-version runtime work in `docs/plans/ROADMAP.md` to reflect the finding, and note the decision under slice 6 with a link to this document.

- [ ] **Step 3: Commit**

```bash
git add docs/research/tech/per-version-lua.md docs/plans/ROADMAP.md
git commit -m "docs: record per-version Lua runtime findings"
```

**GATE:** Present the decision document. The choice among the four options is the user's, not the implementer's — do not start building on the recommendation without an explicit yes.

---

## Self-review notes

- **Spec coverage:** the chosen goal was "find out whether we can build and load Lua 5.1–5.5 as separate WASM modules, and what it costs in bundle size and build complexity". Feasibility → Tasks 2–4; bundle size → Task 5; build complexity → Tasks 2–4's recorded symbol diffs plus Task 4's binding-layer count; decision → Task 6. Task 1 is separate: it ships a correctness fix that is right regardless of the outcome.
- **Deliberately not in this spike:** actually forking Wasmoon, writing per-version bindings, wiring a version-aware loader into `runLua`, or per-version example variants in content. Those are the *implementation*, and they only make sense once Task 6 picks an option.
- **Intentionally unproven until built:** that 5.2/5.3 fall between 5.1 and 5.4 in cost. The spike builds the extremes and extrapolates rather than building all five, because the extremes bracket the answer and building all five is the implementation this spike is meant to justify or prevent.
- **Kill criteria are real.** Task 4 Step 2 routes a failed 5.1 build directly to the decision document. Do not spend effort rescuing a build that is telling you the answer.

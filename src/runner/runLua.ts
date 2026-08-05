/**
 * The Lua version the runtime actually executes. Wasmoon ships a single Lua, so code
 * runs this version whatever the reader has selected — see
 * `docs/plans/2026-08-04-per-version-lua-spike.md`. Until per-version runtimes exist,
 * the mismatch is disclosed rather than hidden.
 *
 * It lives beside the runner rather than inside a component because both surfaces that
 * execute Lua — the inline example and the playground — have to disclose the same fact.
 */
export const RUNTIME_LUA_VERSION = '5.4';

export interface RunLuaOptions {
  timeoutMs?: number;
  /** Injectable worker factory, primarily for testing the timeout/message handling. */
  createWorker?: () => Worker;
}

const defaultCreateWorker = (): Worker =>
  new Worker(new URL('./luaWorker.ts', import.meta.url), { type: 'module' });

export function runLua(
  code: string,
  opts: RunLuaOptions = {},
): Promise<{ output: string; error: string | null; ms?: number }> {
  const timeoutMs = opts.timeoutMs ?? 3000;
  const createWorker = opts.createWorker ?? defaultCreateWorker;
  return new Promise((resolve) => {
    const worker = createWorker();
    const timer = setTimeout(() => {
      worker.terminate();
      resolve({ output: '', error: `Execution timed out after ${timeoutMs}ms` });
    }, timeoutMs);
    worker.onmessage = (e: MessageEvent<{ output: string; error: string | null; ms?: number }>) => {
      clearTimeout(timer);
      worker.terminate();
      resolve(e.data);
    };
    worker.postMessage({ code });
  });
}

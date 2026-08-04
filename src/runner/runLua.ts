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
): Promise<{ output: string; error: string | null }> {
  const timeoutMs = opts.timeoutMs ?? 3000;
  const createWorker = opts.createWorker ?? defaultCreateWorker;
  return new Promise((resolve) => {
    const worker = createWorker();
    const timer = setTimeout(() => {
      worker.terminate();
      resolve({ output: '', error: `Execution timed out after ${timeoutMs}ms` });
    }, timeoutMs);
    worker.onmessage = (e: MessageEvent<{ output: string; error: string | null }>) => {
      clearTimeout(timer);
      worker.terminate();
      resolve(e.data);
    };
    worker.postMessage({ code });
  });
}

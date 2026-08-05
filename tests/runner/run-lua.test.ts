// @vitest-environment node
//
// COVERAGE NOTE: this file runs under the Vitest `node` environment, not the
// default `jsdom` one used elsewhere in this repo. Wasmoon's Emscripten glue
// (node_modules/wasmoon/dist/index.js) picks its wasm-loading strategy by
// branching on `typeof process` / `typeof document`. Under `node` it takes
// the `fs.readFileSync` loader path. Under a real browser (or jsdom, which
// defines `document`) it is meant to take the fetch/XHR loader path instead
// — but jsdom's `document` collides with Node's `process` in that glue code
// and throws before ever reaching the fetch/XHR branch (see the exact error
// captured in task-5-report.md, under "server.deps.inline attempt"). Adding
// `server: { deps: { inline: ['wasmoon'] } }` to vitest.config.ts does NOT
// fix this — verified, error unchanged.
//
// Net effect: these tests exercise `executeLua`'s Lua-execution logic and
// `runLua`'s timeout/message orchestration (against a fake injected worker),
// but they do NOT exercise, and cannot prove anything about, the real
// browser fetch/XHR wasm-loading path, nor `luaWorker.ts`'s `self.onmessage`
// worker-entry branch (jsdom has no `Worker`). Do not read a green run here
// as evidence the browser Worker path works — that needs a manual/browser
// check, tracked as a follow-up.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LuaGlobal } from 'wasmoon';
import { executeLua } from '@/runner/luaWorker';
import { runLua } from '@/runner/runLua';

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

  it('reports a Lua syntax error', async () => {
    const r = await executeLua('this is not valid lua ((');
    expect(r.error).not.toBeNull();
    expect(typeof r.output).toBe('string');
  });

  it('prints Lua nil as "nil", never as "null"', async () => {
    const r = await executeLua('print(nil)');
    expect(r.output).toContain('nil');
    expect(r.output).not.toContain('null');
  });

  it('resolves with the normal result shape even if cleanup (global.close) throws', async () => {
    const closeSpy = vi.spyOn(LuaGlobal.prototype, 'close').mockImplementationOnce(() => {
      throw new Error('close failed');
    });
    try {
      // `toMatchObject`, not `toEqual`: the result also carries the chunk's run time,
      // which is a real measurement and not worth pinning to a value.
      await expect(executeLua('print("still works")')).resolves.toMatchObject({
        output: 'still works\n',
        error: null,
      });
    } finally {
      closeSpy.mockRestore();
    }
  });
});

describe('runLua', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('resolves with a timeout error and terminates the worker when no message ever arrives', async () => {
    const terminate = vi.fn();
    const fakeWorker = {
      onmessage: null,
      postMessage: vi.fn(),
      terminate,
    } as unknown as Worker;
    const createWorker = vi.fn(() => fakeWorker);

    const promise = runLua('while true do end', { timeoutMs: 1000, createWorker });

    let resolved: { output: string; error: string | null } | undefined;
    promise.then((r) => {
      resolved = r;
    });

    await vi.advanceTimersByTimeAsync(1000);

    expect(resolved).toEqual({
      output: '',
      error: 'Execution timed out after 1000ms',
    });
    expect(terminate).toHaveBeenCalledTimes(1);
    expect(fakeWorker.postMessage).toHaveBeenCalledTimes(1);
    expect(fakeWorker.postMessage).toHaveBeenCalledWith({ code: 'while true do end' });
  });

  it('resolves with the worker result and clears the timer so timeout never fires', async () => {
    const terminate = vi.fn();
    const fakeWorker = {
      onmessage: null,
      postMessage: vi.fn(),
      terminate,
    } as unknown as Worker;
    const createWorker = vi.fn(() => fakeWorker);

    const promise = runLua('print("hi")', { timeoutMs: 1000, createWorker });

    const result = { output: 'hi\n', error: null };
    fakeWorker.onmessage!({ data: result } as MessageEvent);

    const resolved = await promise;

    expect(resolved).toEqual(result);
    expect(terminate).toHaveBeenCalledTimes(1);
    expect(fakeWorker.postMessage).toHaveBeenCalledTimes(1);
    expect(fakeWorker.postMessage).toHaveBeenCalledWith({ code: 'print("hi")' });

    // Advance well past the timeout; nothing further should happen because
    // the timer was cleared on message receipt.
    terminate.mockClear();
    await vi.advanceTimersByTimeAsync(5000);
    expect(terminate).not.toHaveBeenCalled();
  });
});

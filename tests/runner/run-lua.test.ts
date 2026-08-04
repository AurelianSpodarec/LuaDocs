// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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

    // Advance well past the timeout; nothing further should happen because
    // the timer was cleared on message receipt.
    terminate.mockClear();
    await vi.advanceTimersByTimeAsync(5000);
    expect(terminate).not.toHaveBeenCalled();
  });
});

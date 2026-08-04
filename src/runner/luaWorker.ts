import { LuaFactory } from 'wasmoon';

export async function executeLua(code: string): Promise<{ output: string; error: string | null }> {
  const factory = new LuaFactory();
  const lua = await factory.createEngine();
  let output = '';
  try {
    lua.global.set('print', (...args: unknown[]) => {
      output += args.map((a) => (a === undefined || a === null ? 'nil' : String(a))).join('\t') + '\n';
    });
    await lua.doString(code);
    return { output, error: null };
  } catch (e) {
    return { output, error: e instanceof Error ? e.message : String(e) };
  } finally {
    // A failure while closing the engine must never turn a resolved
    // { output, error } result into a rejected promise — cleanup errors are
    // swallowed rather than propagated.
    try {
      lua.global.close();
    } catch {
      // Intentionally ignored.
    }
  }
}

// Worker entry (only runs in a Worker context)
if (typeof self !== 'undefined' && 'onmessage' in self) {
  self.onmessage = async (e: MessageEvent<{ code: string }>) => {
    const result = await executeLua(e.data.code);
    (self as unknown as Worker).postMessage(result);
  };
}

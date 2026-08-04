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

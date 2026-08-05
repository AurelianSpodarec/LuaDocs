import { LuaFactory } from 'wasmoon';

/** Where the Lua-side `print` accumulates. Read back after the chunk runs. */
const BUFFER = '__luadocs_output';

/**
 * `print`, defined in Lua rather than in JavaScript.
 *
 * Handing each value to JavaScript and calling `String` on it looks equivalent and is
 * not: it formats numbers by JavaScript's rules, so Lua's `3.0` arrives as `3` and every
 * float in every example prints as an integer. That is invisible in the `string` section
 * and ruinous in `math`, where the float/integer distinction is frequently the point.
 *
 * Going through Lua's own `tostring` means the output is whatever the real interpreter
 * would have written — `3.0`, `nil`, `true`, `table: 0x…` — because it is the same
 * function doing the work.
 */
const PRINT = `
${BUFFER} = ''
function print(...)
  local count = select('#', ...)
  local parts = {}
  for index = 1, count do
    parts[index] = tostring((select(index, ...)))
  end
  ${BUFFER} = ${BUFFER} .. table.concat(parts, '\\t') .. '\\n'
end
`;

export async function executeLua(code: string): Promise<{ output: string; error: string | null }> {
  const factory = new LuaFactory();
  const lua = await factory.createEngine();

  /** Whatever was printed before an error, so a failing example still shows its output. */
  const printed = (): string => {
    const value = lua.global.get(BUFFER);
    return typeof value === 'string' ? value : '';
  };

  try {
    await lua.doString(PRINT);
    await lua.doString(code);
    return { output: printed(), error: null };
  } catch (e) {
    return { output: printed(), error: e instanceof Error ? e.message : String(e) };
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

import { LuaFactory } from 'wasmoon';

/**
 * Running a standalone program against the real Lua engine and reading back what it
 * printed, so a program written in TypeScript can be held to the same standard as one
 * authored in MDX.
 *
 * `tests/content/examples-run.test.ts` covers the examples inside entries by walking MDX
 * files. It cannot see these: the playground's starter program and the landing page's
 * example both live in `.ts`, which would otherwise make them the only Lua on the site
 * nobody checks — while being the first Lua most readers see.
 *
 * Shared rather than copied because the two callers must agree on what "prints exactly
 * what its comment claims" means. Two copies of this harness would be two definitions of
 * correct, and the one that drifted would be the one nobody was reading.
 *
 * Requires the node environment — it loads the real runtime, not a stub.
 */

const BUFFER = '__luadocs_output';

/**
 * `print` replaced with one that appends to a global, because the engine's own writes
 * to stdout are not readable from here. Tab-separated, exactly as Lua's `print` is.
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

/** The payload of the trailing `-- Expected output:` block. */
export function expectedOf(code: string): string {
  const found = /--[ \t]*Expected output:[ \t]*([\s\S]*)$/.exec(code);
  if (!found) return '';

  const [first, ...rest] = found[1].split('\n');
  const lines = [first.trim()];
  for (const line of rest) {
    const trimmed = line.trim();
    // `slice(2)` only — the leading spaces of a formatted column are part of the
    // expected output, and trimming them would let a misaligned total pass.
    if (trimmed.startsWith('--')) lines.push(trimmed.slice(2).replace(/^ /, ''));
  }

  return lines.filter((line) => line !== '').join('\n');
}

export const normalise = (text: string) => text.replace(/\r/g, '').replace(/\n+$/, '');

/** Everything `program` printed, as one string. */
export async function outputOf(program: string): Promise<string> {
  const lua = await new LuaFactory().createEngine();
  try {
    await lua.doString(PRINT);
    await lua.doString(program);
    return String(lua.global.get(BUFFER) ?? '');
  } finally {
    try {
      lua.global.close();
    } catch {
      // Cleanup failures must not mask the caller's assertion.
    }
  }
}

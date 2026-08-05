// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { LuaFactory } from 'wasmoon';
import { SEED_PROGRAM } from '@/playground/seed';
import { tidy } from '@/playground/tidy';

/**
 * The starter program is held to the same standard as an authored example, by the same
 * means: it is executed against the real Lua runtime and its output compared with the
 * `-- Expected output:` comment it carries.
 *
 * `tests/content/examples-run.test.ts` cannot cover it — that test walks MDX files, and
 * this program lives in TypeScript. It would otherwise be the one piece of Lua on the
 * site nobody checks, while being the first piece of Lua most readers see.
 *
 * Node environment, not jsdom: this loads the real Lua runtime rather than a stub.
 */
const BUFFER = '__luadocs_output';
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

const SHADOWED = [
  'string', 'table', 'math', 'io', 'os', 'coroutine', 'utf8', 'debug', 'package',
  'type', 'select', 'next', 'print', 'pairs', 'ipairs', 'error', 'assert', 'pcall',
  'require', 'tostring', 'tonumber', 'setmetatable', 'getmetatable', 'load',
  '_G', '_VERSION',
];

/** The payload of the trailing `-- Expected output:` block. */
function expectedOf(code: string): string {
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

const normalise = (text: string) => text.replace(/\r/g, '').replace(/\n+$/, '');

describe('the starter program', () => {
  it('prints exactly what its comment claims', async () => {
    const lua = await new LuaFactory().createEngine();
    let ran = '';
    try {
      await lua.doString(PRINT);
      await lua.doString(SEED_PROGRAM);
      ran = String(lua.global.get(BUFFER) ?? '');
    } finally {
      try {
        lua.global.close();
      } catch {
        // Cleanup failures must not mask the assertion below.
      }
    }

    expect(normalise(ran)).toBe(normalise(expectedOf(SEED_PROGRAM)));
  }, 120_000);

  it('carries an expected-output comment at all', () => {
    expect(expectedOf(SEED_PROGRAM)).not.toBe('');
  });

  it('spells its names out, and binds over nothing the standard library defines', () => {
    const bound = [
      ...SEED_PROGRAM.matchAll(/\blocal\s+([A-Za-z_]\w*)/g),
      ...SEED_PROGRAM.matchAll(/\bfor\s+([A-Za-z_]\w*(?:\s*,\s*[A-Za-z_]\w*)*)\s*(?:=|\bin\b)/g),
    ].flatMap((match) => match[1].split(',').map((name) => name.trim()));

    expect(bound.length).toBeGreaterThan(0);
    expect(bound.filter((name) => name.replace(/_/g, '').length < 2)).toEqual([]);
    expect(bound.filter((name) => SHADOWED.includes(name))).toEqual([]);
  });

  it('is already tidy, so pressing Tidy on arrival changes nothing', () => {
    // Exactly equal, trailing newline included — tidy preserves the line count, so the
    // empty final line the program ends on survives as an empty final line.
    expect(tidy(SEED_PROGRAM)).toBe(SEED_PROGRAM);
  });
});

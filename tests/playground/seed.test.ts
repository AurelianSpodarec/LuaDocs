// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { SEED_PROGRAM } from '@/playground/seed';
import { tidy } from '@/playground/tidy';
import { expectedOf, normalise, outputOf } from '../support/expectedOutput';

/**
 * The starter program is held to the same standard as an authored example, by the same
 * means: it is executed against the real Lua runtime and its output compared with the
 * `-- Expected output:` comment it carries.
 *
 * The harness for that lives in `tests/support/expectedOutput.ts`, shared with the
 * landing page's example — the two programs are the same kind of thing and must be
 * judged by the same rule.
 *
 * Node environment, not jsdom: this loads the real Lua runtime rather than a stub.
 */
const SHADOWED = [
  'string', 'table', 'math', 'io', 'os', 'coroutine', 'utf8', 'debug', 'package',
  'type', 'select', 'next', 'print', 'pairs', 'ipairs', 'error', 'assert', 'pcall',
  'require', 'tostring', 'tonumber', 'setmetatable', 'getmetatable', 'load',
  '_G', '_VERSION',
];

describe('the starter program', () => {
  it('prints exactly what its comment claims', async () => {
    expect(normalise(await outputOf(SEED_PROGRAM))).toBe(normalise(expectedOf(SEED_PROGRAM)));
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

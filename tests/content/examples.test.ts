import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { listContentFiles, PLACEHOLDER } from '@/content-tree/scaffold';

const DEST = 'content/docs';

/**
 * ADR 0008 rules 1 and 3 — the two that are mechanically checkable. Rules 2, 4 and 5
 * (type-named locals, real data, self-containment) are judgement and stay human.
 */
const SHADOWED = [
  'string', 'table', 'math', 'io', 'os', 'coroutine', 'utf8', 'debug', 'package',
  'type', 'select', 'next', 'print', 'pairs', 'ipairs', 'error', 'assert', 'pcall',
  'xpcall', 'require', 'tostring', 'tonumber', 'setmetatable', 'getmetatable',
  'rawget', 'rawset', 'rawequal', 'rawlen', 'load', 'loadfile', 'dofile', 'unpack',
  'collectgarbage', 'warn', 'getfenv', 'setfenv', 'loadstring', 'module',
  '_G', '_VERSION',
];

const EXAMPLE = /<RunnableExample\s+code=\{`([\s\S]*?)`\}/g;
// A Lua 5.4 attribute (`<const>`, `<close>`) can sit between a name and its comma —
// `local a <const>, b <close> = 1, 2` — and must not stop the match before `b`.
const LOCAL = /\blocal\s+([A-Za-z_]\w*(?:\s*<\w+>)?(?:\s*,\s*[A-Za-z_]\w*(?:\s*<\w+>)?)*)/g;
// ADR 0008 rule 1 says "including loop variables", and `for index, item in ...` binds
// names no `local` ever mentions. Checking locals alone would let `for i, v` through —
// the single most common place a one-letter name appears in Lua.
const LOOP = /\bfor\s+([A-Za-z_]\w*(?:\s*,\s*[A-Za-z_]\w*)*)\s*(?:=|\bin\b)/g;

interface Example {
  rel: string;
  code: string;
}

const examples: Example[] = [];

for (const rel of await listContentFiles(DEST)) {
  if (!rel.endsWith('.mdx')) continue;

  const text = await readFile(join(DEST, rel), 'utf8');
  if (text.includes(PLACEHOLDER)) continue;

  for (const match of text.matchAll(EXAMPLE)) {
    examples.push({ rel, code: match[1] });
  }
}

/** Every name this example binds — by `local`, or as a `for` loop variable. */
function boundNamesIn(code: string): string[] {
  const names = (pattern: RegExp) =>
    [...code.matchAll(pattern)].flatMap((match) =>
      match[1].split(',').map((name) => name.trim().replace(/\s*<\w+>$/, '')),
    );

  return [...names(LOCAL), ...names(LOOP)];
}

describe('every example follows ADR 0008', () => {
  it('has examples to check at all', () => {
    expect(examples.length).toBeGreaterThan(0);
  });

  it('spells its names out — no single-letter identifiers', () => {
    for (const example of examples) {
      const short = boundNamesIn(example.code).filter((name) => name.replace(/_/g, '').length < 2);
      expect(short, example.rel).toEqual([]);
    }
  });

  it('catches a one-letter loop variable, not only a one-letter local', () => {
    // The rule's most common violation is `for i, v in ipairs(t)`, which binds nothing
    // with `local`. Pinning it here means the LOOP pattern cannot quietly rot.
    expect(boundNamesIn('for index, item in ipairs(list) do end')).toContain('index');
    expect(boundNamesIn('for i = 1, 10 do end')).toEqual(['i']);
  });

  it('captures every name even with a Lua 5.4 attribute attached', () => {
    // `<const>` and `<close>` sit between a name and its comma; the LOCAL pattern
    // must not stop there, or a one-letter name after one would slip through unseen.
    expect(boundNamesIn('local first_value <const>, x <close> = 1, 2')).toEqual([
      'first_value',
      'x',
    ]);
  });

  it('never binds over a name the standard library defines', () => {
    for (const example of examples) {
      const shadowed = boundNamesIn(example.code).filter((name) => SHADOWED.includes(name));
      expect(shadowed, example.rel).toEqual([]);
    }
  });
});

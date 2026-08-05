// @vitest-environment node
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, expect, beforeAll } from 'vitest';
import { LuaFactory } from 'wasmoon';
import { listContentFiles, PLACEHOLDER } from '@/content-tree/scaffold';

/**
 * Every runnable example is executed, and its output compared against the
 * `-- Expected output:` comment [ADR 0008](../../docs/adr/0008-example-conventions.md)
 * requires it to carry.
 *
 * That comment exists partly so this test can exist: it is the only assertable statement
 * of what an example should do, and three surfaces — the prerendered page, the `.md`
 * route and `llms.txt` — show the code without ever running it. Until now the comment was
 * checked by a person reading the output pane, which caught a wrong replacement count on
 * one entry and would not have caught the next one.
 *
 * Node environment, not jsdom: this loads the real Lua runtime rather than a stub.
 */
const DEST = 'content/docs';
const EXAMPLE = /<RunnableExample\s+code=\{`([\s\S]*?)`\}/g;
const EXPECTED = /--[ \t]*Expected output:[ \t]*([\s\S]*)$/;

/** The buffer the Lua-side `print` writes into — the same shim `luaWorker.ts` installs. */
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

interface Example {
  name: string;
  code: string;
  expected: string;
}

/** Undo the escapes an MDX template-literal attribute puts around the source. */
function unescape(raw: string): string {
  return raw
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\`/g, '`')
    .replace(/\\\$/g, '$')
    .replace(/\\\\/g, '\\');
}

/** The comment's payload: the trailing text, plus any following `--` lines. */
function expectedOf(code: string): string {
  const found = EXPECTED.exec(code);
  if (!found) return '';

  const [first, ...rest] = found[1].split('\n');
  const lines = [first.trim()];
  for (const line of rest) {
    const trimmed = line.trim();
    if (trimmed.startsWith('--')) lines.push(trimmed.slice(2).trim());
  }

  return lines.filter(Boolean).join('\n');
}

const examples: Example[] = [];

beforeAll(async () => {
  for (const rel of await listContentFiles(DEST)) {
    if (!rel.endsWith('.mdx')) continue;

    const text = await readFile(join(DEST, rel), 'utf8');
    if (text.includes(PLACEHOLDER)) continue;

    let index = 0;
    for (const match of text.matchAll(EXAMPLE)) {
      const code = unescape(match[1]);
      examples.push({ name: `${rel}#${index}`, code, expected: expectedOf(code) });
      index += 1;
    }
  }
});

const normalise = (text: string) => text.replace(/\r/g, '').replace(/\n+$/, '').trim();

describe('every runnable example', () => {
  it('has examples to run at all', () => {
    // A run of nothing passes vacuously; the tree currently holds far more than this.
    expect(examples.length).toBeGreaterThanOrEqual(12);
  });

  it('carries an expected-output comment', () => {
    const missing = examples.filter((e) => !e.expected).map((e) => e.name);
    expect(missing, 'ADR 0008 rule 6').toEqual([]);
  });

  it('prints exactly what its comment claims', async () => {
    // One engine for all of them: creating a Lua state per example dominates the runtime.
    // Each example is wrapped in a `do … end` block so its locals cannot reach the next.
    const lua = await new LuaFactory().createEngine();
    let ran = '';
    try {
      await lua.doString(PRINT);
      await lua.doString(examples.map((e) => `do\n${e.code}\nend\nprint("@@@")`).join('\n'));
      ran = String(lua.global.get(BUFFER) ?? '');
    } finally {
      try {
        lua.global.close();
      } catch {
        // Cleanup failures must not mask a real assertion below.
      }
    }

    const chunks = ran.split('@@@\n');
    const wrong = examples
      .map((example, index) => ({
        name: example.name,
        want: normalise(example.expected),
        got: normalise(chunks[index] ?? ''),
      }))
      .filter((result) => result.want !== result.got);

    expect(wrong).toEqual([]);
  }, 120_000);
});

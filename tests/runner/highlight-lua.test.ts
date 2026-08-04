import { describe, it, expect } from 'vitest';
import { highlightLua } from '@/runner/highlightLua';

/** Flattens a highlighted line back to the text it was made from. */
const textOf = (line: { content: string }[]) => line.map((t) => t.content).join('');

describe('highlightLua', () => {
  it('returns one entry per line, and gives every line back verbatim', async () => {
    const code = 'local n = 1\nprint(n)';
    const lines = await highlightLua(code);

    expect(lines).toHaveLength(2);
    expect(lines.map(textOf).join('\n')).toBe(code);
  });

  it('colours a keyword differently from a string, in both themes', async () => {
    const [line] = await highlightLua('local greeting = "hi"');

    const keyword = line.find((t) => t.content.trim() === 'local');
    const string = line.find((t) => t.content.includes('"hi"'));

    expect(keyword?.style['--shiki-light']).toBeDefined();
    expect(keyword?.style['--shiki-dark']).toBeDefined();
    // Both themes must actually distinguish the two, or the highlighting says nothing.
    expect(keyword?.style['--shiki-light']).not.toBe(string?.style['--shiki-light']);
    expect(keyword?.style['--shiki-dark']).not.toBe(string?.style['--shiki-dark']);
  });

  it('recognises Lua rather than falling back to plain text', async () => {
    const [line] = await highlightLua('function f() return nil end');

    // Plain text is one token per line; a parsed grammar is not.
    expect(line.length).toBeGreaterThan(1);
  });
});

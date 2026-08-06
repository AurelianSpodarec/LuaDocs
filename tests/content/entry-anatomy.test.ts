import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { CONTENT_TREE, sourceUrl, type Section } from '@/content-tree/manifest';
import { listContentFiles, PLACEHOLDER } from '@/content-tree/scaffold';
import { compatNodeFor } from '@/compat/registry';

const DEST = 'content/docs';

interface WrittenEntry {
  rel: string;
  frontmatter: string;
  body: string;
}

/** Every entry actually authored. A stub has nothing to check. */
const written: WrittenEntry[] = [];

for (const rel of await listContentFiles(DEST)) {
  if (!rel.endsWith('.mdx')) continue;

  const text = await readFile(join(DEST, rel), 'utf8');
  if (text.includes(PLACEHOLDER)) continue;

  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(text);
  if (!match) throw new Error(`${rel} has no frontmatter`);

  written.push({ rel, frontmatter: match[1], body: match[2] });
}

function fieldOf(frontmatter: string, key: string): string | null {
  const found = new RegExp(`^${key}: (.*)$`, 'm').exec(frontmatter);
  return found ? found[1].trim() : null;
}

const functions = written.filter((e) => fieldOf(e.frontmatter, 'entry-type') === 'function');

/**
 * The construct fork — Patterns and, later, `#`, `for`, the operators. It is the shape
 * this slice invented, and it is deliberately *not* the function shape: pilot finding
 * #4 records that a concept entry has no call to quote, so Syntax, Parameters and
 * Return values are all absent by design and must not be required here.
 */
const constructs = written.filter((e) => fieldOf(e.frontmatter, 'entry-type') === 'construct');

/**
 * The constant fork — `math.pi`, `math.huge`, the two integer bounds, and later
 * `_VERSION`. `page-structure.md` gives it the shared skeleton with **Value** replacing
 * Parameters and Return values, and the prototype finding that constants "collapse
 * optional sections" is what settles the rest: there is no call to quote, so no Syntax,
 * and nothing to raise, so no Errors. `## Value` is a real markdown heading rather than a
 * component because the right rail is built from H2s and a constant's value is a
 * paragraph, not a list of rows.
 *
 * Asserting its *absence* of Syntax matters as much as its Value: the fork is one an
 * author reaches by copying a function entry, and a Syntax block quoting `math.pi` would
 * be invented notation for a call that does not exist.
 */
const constants = written.filter((e) => fieldOf(e.frontmatter, 'entry-type') === 'constant');

/** Every entry that documents something, of any fork. */
const entries = [...functions, ...constructs, ...constants];

/** Every entry's expected source URL, keyed the way `listContentFiles` reports paths. */
const expectedSource = new Map<string, string>();
(function collect(sections: Section[], prefix: string): void {
  for (const section of sections) {
    const dir = prefix ? `${prefix}/${section.slug}` : section.slug;
    expectedSource.set(`${dir}/index.mdx`, sourceUrl(section.source));
    for (const entry of section.entries) {
      expectedSource.set(`${dir}/${entry.slug}.mdx`, sourceUrl(entry.source));
    }
    collect(section.sections, dir);
  }
})(CONTENT_TREE, '');

describe('the anatomy of a written entry', () => {
  it('has entries to check at all', () => {
    // A guard that silently checks nothing is worse than no guard.
    expect(written.length).toBeGreaterThan(1);
    expect(functions.length).toBeGreaterThan(0);
    // Every other assertion below used to filter to `function`, which left the fork
    // this slice invented completely unguarded.
    expect(constructs.length).toBeGreaterThan(0);
    expect(constants.length).toBeGreaterThan(0);
  });

  it('gives every function entry a Syntax section', () => {
    for (const entry of functions) {
      expect(entry.body, entry.rel).toContain('## Syntax');
    }
  });

  it('gives every function entry its parameters and return values', () => {
    for (const entry of functions) {
      expect(entry.body, entry.rel).toContain('<Parameters>');
      expect(entry.body, entry.rel).toContain('<Returns>');
    }
  });

  it('ends every function entry with a See also section', () => {
    for (const entry of functions) {
      expect(entry.body, entry.rel).toContain('## See also');
    }
  });

  it('ends every construct entry with a See also section', () => {
    // The only structural rule the construct fork shares with the function one. It
    // deliberately has no Syntax, Parameters or Return values — see `constructs`.
    for (const entry of constructs) {
      expect(entry.body, entry.rel).toContain('## See also');
    }
  });

  it('gives every constant entry a Value section, and no Syntax', () => {
    for (const entry of constants) {
      // Anchored to a whole line. `toContain('## Value')` also passes on `### Value`,
      // which would let the one structural fact this fork exists to enforce through as
      // a subheading buried under Description.
      expect(entry.body, entry.rel).toMatch(/^## Value$/m);
      // A constant has no call to quote and nothing that can raise. The sections that
      // would hold either are where the function shape leaks into this fork, so they
      // are asserted absent rather than left to review.
      expect(entry.body, entry.rel).not.toContain('## Syntax');
      expect(entry.body, entry.rel).not.toContain('<Parameters>');
      expect(entry.body, entry.rel).not.toContain('<Returns>');
      expect(entry.body, entry.rel).not.toContain('<Errors>');
    }
  });

  it('ends every constant entry with a See also section', () => {
    for (const entry of constants) {
      expect(entry.body, entry.rel).toContain('## See also');
    }
  });

  it('links every entry of any fork to a registered compat node', () => {
    // Pilot finding #7: Patterns was authored from a stub whose frontmatter had no
    // `lua-compat` key, and nothing would have said so — the entry would simply have
    // rendered no support strip, no change note and no matrix, silently claiming to
    // be version-invariant. A stub legitimately has no compat key, which is why this
    // runs over written entries only.
    for (const entry of entries) {
      const key = fieldOf(entry.frontmatter, 'lua-compat');
      expect(key, `${entry.rel} declares no lua-compat key`).not.toBeNull();
      expect(
        compatNodeFor(key),
        `${entry.rel} declares lua-compat: ${key}, which no dataset is registered under`,
      ).not.toBeNull();
    }
  });

  it('cites exactly the manual passage the manifest generates for it', () => {
    for (const entry of written) {
      const want = expectedSource.get(entry.rel);
      // `content/docs/index.mdx` is the authored site root, not an entry.
      if (!want) continue;
      expect(fieldOf(entry.frontmatter, 'source'), entry.rel).toBe(want);
    }
  });
});

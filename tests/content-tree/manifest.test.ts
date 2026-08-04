import { describe, it, expect } from 'vitest';
import { CONTENT_TREE, ENTRY_TYPES, sourceUrl, type Section } from '@/content-tree/manifest';
import { LUA_VERSIONS } from '@/compat/schema';

function walk(sections: Section[]): Section[] {
  return sections.flatMap((s) => [s, ...walk(s.sections)]);
}

const all = walk(CONTENT_TREE);

describe('the content tree', () => {
  it('slugs every entry with URL-safe characters only', () => {
    for (const section of all) {
      for (const e of section.entries) {
        expect(e.slug, `${section.slug}/${e.slug}`).toMatch(/^[a-z0-9_-]+$/);
      }
    }
  });

  it('never slugs an entry "index", which would collide with the overview', () => {
    for (const section of all) {
      expect(section.entries.map((e) => e.slug)).not.toContain('index');
    }
  });

  it('keeps every slug unique within its section', () => {
    for (const section of all) {
      const slugs = [...section.entries.map((e) => e.slug), ...section.sections.map((s) => s.slug)];
      expect(new Set(slugs).size, `duplicate in ${section.slug}`).toBe(slugs.length);
    }
  });

  it('gives every entry a non-empty title and a known type', () => {
    for (const section of all) {
      for (const e of section.entries) {
        expect(e.title.length, `${section.slug}/${e.slug}`).toBeGreaterThan(0);
        expect(ENTRY_TYPES).toContain(e.type);
      }
    }
  });

  it('has the string library the design commits to', () => {
    const string = all.find((s) => s.slug === 'string');
    expect(string?.entries).toHaveLength(19);
    expect(string?.entries.find((e) => e.slug === 'format')?.title).toBe('string.format');
  });

  it('points every entry at a manual passage', () => {
    for (const section of all) {
      for (const e of section.entries) {
        expect(e.source.anchor.length, `${section.slug}/${e.slug}`).toBeGreaterThan(0);
        expect(LUA_VERSIONS).toContain(e.source.version);
      }
      expect(section.source.anchor.length, section.slug).toBeGreaterThan(0);
    }
  });

  it('builds a manual URL from a source', () => {
    const string = all.find((s) => s.slug === 'string')!;
    const format = string.entries.find((e) => e.slug === 'format')!;
    expect(sourceUrl(format.source)).toBe(
      'https://www.lua.org/manual/5.5/manual.html#pdf-string.format',
    );
  });
});

describe('the standard library', () => {
  const counts: Record<string, number> = {
    basic: 31,
    coroutine: 8,
    package: 10,
    string: 19,
    utf8: 6,
    table: 12,
    math: 35,
    io: 14,
    'file-methods': 7,
    os: 11,
    debug: 18,
  };

  it.each(Object.entries(counts))('has %s with %i entries', (slug, count) => {
    expect(all.find((s) => s.slug === slug)?.entries).toHaveLength(count);
  });

  it('has 171 entries in total', () => {
    const lib = all.find((s) => s.slug === 'standard-library')!;
    const total = walk(lib.sections).reduce((n, s) => n + s.entries.length, 0);
    expect(total).toBe(171);
  });

  it('titles a bare global without a library prefix', () => {
    const basic = all.find((s) => s.slug === 'basic')!;
    expect(basic.entries.find((e) => e.slug === 'pcall')?.title).toBe('pcall');
    expect(basic.entries.find((e) => e.slug === '_g')?.title).toBe('_G');
  });

  it('titles a file method with a colon', () => {
    const file = all.find((s) => s.slug === 'file-methods')!;
    expect(file.entries.find((e) => e.slug === 'read')?.title).toBe('file:read');
  });

  it('sources a symbol 5.5 dropped to the newest manual that has it', () => {
    const math = all.find((s) => s.slug === 'math')!;
    expect(math.entries.find((e) => e.slug === 'pow')?.source).toEqual({
      version: '5.1',
      anchor: 'pdf-math.pow',
    });
    expect(math.entries.find((e) => e.slug === 'abs')?.source.version).toBe('5.5');
  });
});

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

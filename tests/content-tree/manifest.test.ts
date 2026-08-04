import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import {
  CONTENT_TREE,
  ENTRY_TYPES,
  ROOT_PAGES,
  contentTreeUrls,
  fns,
  relatedGlobals,
  section,
  sourceUrl,
  type Section,
} from '@/content-tree/manifest';
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
    expect(format.title).toBe('string.format()');
    expect(sourceUrl(format.source)).toBe(
      'https://www.lua.org/manual/5.5/manual.html#pdf-string.format',
    );
  });

  it('lists every entry URL for the prerenderer', () => {
    const tree: Section[] = [
      section('standard-library', 'Standard Library', '6', [], [
        section('string', 'string', '6.5', fns('string', 'format upper')),
      ]),
    ];

    expect(contentTreeUrls(tree)).toEqual([
      '/docs/standard-library',
      '/docs/standard-library/string',
      '/docs/standard-library/string/format',
      '/docs/standard-library/string/upper',
    ]);
  });
});

describe('entry groups', () => {
  it('groups every entry by kind', () => {
    const math = all.find((s) => s.slug === 'math')!;
    expect(math.entries.find((e) => e.slug === 'abs')?.group).toBe('Functions');
    expect(math.entries.find((e) => e.slug === 'pi')?.group).toBe('Constants');
  });

  it("keeps a section's entries contiguous by group", () => {
    for (const s of all) {
      const seen = new Set<string>();
      let last: string | null = null;
      for (const e of s.entries) {
        if (e.group !== last) {
          expect(seen.has(e.group), `${s.slug} revisits ${e.group}`).toBe(false);
          seen.add(e.group);
          last = e.group;
        }
      }
    }
  });
});

describe('callable titles', () => {
  it('parenthesises a function and leaves a constant bare', () => {
    const math = all.find((s) => s.slug === 'math')!;
    expect(math.entries.find((e) => e.slug === 'abs')?.title).toBe('math.abs()');
    expect(math.entries.find((e) => e.slug === 'pi')?.title).toBe('math.pi');
  });

  it('keeps the parentheses out of the manual anchor', () => {
    const math = all.find((s) => s.slug === 'math')!;
    expect(sourceUrl(math.entries.find((e) => e.slug === 'abs')!.source)).toBe(
      'https://www.lua.org/manual/5.5/manual.html#pdf-math.abs',
    );
  });

  it('leaves constructs, constants and guides unparenthesised', () => {
    const statements = all.find((s) => s.slug === 'statements')!;
    expect(statements.entries.find((e) => e.slug === 'goto')?.title).toBe('goto');

    const standalone = all.find((s) => s.slug === 'standalone')!;
    expect(standalone.entries.find((e) => e.slug === 'lua-path')?.title).toBe('LUA_PATH');
  });
});

describe('the standard library', () => {
  const counts: Record<string, number> = {
    globals: 31,
    coroutine: 8,
    package: 10,
    string: 19,
    utf8: 6,
    table: 12,
    math: 35,
    // 11 io functions + 3 constants + 7 file methods, which no longer nest.
    io: 21,
    os: 11,
    debug: 18,
  };

  it.each(Object.entries(counts))('has %s with %i entries', (slug, count) => {
    expect(all.find((s) => s.slug === slug)?.entries).toHaveLength(count);
  });

  it('titles a bare global without a library prefix', () => {
    const globals = all.find((s) => s.slug === 'globals')!;
    expect(globals.entries.find((e) => e.slug === 'pcall')?.title).toBe('pcall()');
    expect(globals.entries.find((e) => e.slug === '_g')?.title).toBe('_G');
  });

  it('folds file methods into io, prefixing their slugs to avoid collisions', () => {
    expect(all.find((s) => s.slug === 'file-methods')).toBeUndefined();

    const io = all.find((s) => s.slug === 'io')!;
    const read = io.entries.find((e) => e.slug === 'file-read')!;
    expect(read.title).toBe('file:read()');
    expect(read.group).toBe('File methods');

    // io.read and file:read now sit side by side and must not collide.
    expect(io.entries.find((e) => e.slug === 'read')?.title).toBe('io.read()');
  });

  it('cross-links the globals a reader would look for in a library', () => {
    const table = all.find((s) => s.slug === 'table')!;
    expect(table.related?.map((r) => r.title)).toContain('setmetatable()');
    // The row lives under `table`; the page stays in Globals, because
    // `table.setmetatable` does not exist.
    expect(table.related?.find((r) => r.title === 'setmetatable()')?.url).toBe(
      '/docs/standard-library/globals/setmetatable',
    );
  });

  it('refuses to cross-link a global that does not exist', () => {
    expect(() => relatedGlobals('nosuchthing')).toThrow('no global named "nosuchthing"');
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

describe('the language section', () => {
  it('has 74 entries in total', () => {
    const language = all.find((s) => s.slug === 'language')!;
    const total = walk(language.sections).reduce((n, s) => n + s.entries.length, 0);
    expect(total).toBe(74);
  });

  it('makes coroutines an entry of language, not a folder', () => {
    const language = CONTENT_TREE.find((s) => s.slug === 'language')!;
    expect(language.sections.map((s) => s.slug)).not.toContain('coroutines');
    expect(language.entries.map((e) => e.slug)).toContain('coroutines');
  });

  it('drops the underscores from a metamethod slug, exempting only __index', () => {
    const meta = all.find((s) => s.slug === 'metatables')!;
    const slugs = meta.entries.map((e) => e.slug);
    // A bare `index` slug would collide with the section's own overview.
    expect(slugs).toContain('index-metamethod');
    expect(slugs).not.toContain('index');
    expect(meta.entries.find((e) => e.slug === 'index-metamethod')?.title).toBe('__index');
    expect(meta.entries.find((e) => e.slug === 'newindex')?.title).toBe('__newindex');
  });

  it('groups the arithmetic and bitwise metamethods into one entry each', () => {
    const meta = all.find((s) => s.slug === 'metatables')!;
    expect(meta.entries).toHaveLength(19);
    expect(meta.entries.map((e) => e.slug)).toContain('arithmetic-metamethods');
    expect(meta.entries.map((e) => e.slug)).toContain('bitwise-metamethods');
  });

  it('puts to-be-closed variables under statements, as the manual does', () => {
    const statements = all.find((s) => s.slug === 'statements')!;
    expect(statements.entries.map((e) => e.slug)).toContain('to-be-closed-variables');
  });
});

describe('the remaining sections', () => {
  it('gives the standalone interpreter its own group', () => {
    const standalone = all.find((s) => s.slug === 'standalone')!;
    expect(standalone.entries).toHaveLength(6);
    expect(standalone.entries.find((e) => e.slug === 'lua-path')?.title).toBe('LUA_PATH');
  });

  it('lists the C API as entries, merging the duplicate types section', () => {
    const cApi = all.find((s) => s.slug === 'c-api')!;
    expect(cApi.sections).toHaveLength(0);
    expect(cApi.entries).toHaveLength(10);
    expect(cApi.entries.map((e) => e.slug)).toContain('types-and-values');
    expect(cApi.entries.map((e) => e.slug)).not.toContain('types');
  });

  it('has no section without entries', () => {
    // An Area may be an empty placeholder (Learn); a Section may not.
    for (const area of CONTENT_TREE) {
      for (const s of walk(area.sections)) {
        expect(s.entries.length, `${s.slug} has no entries`).toBeGreaterThan(0);
      }
    }
  });

  it('keeps URL depth at three: area, section, entry', () => {
    for (const area of CONTENT_TREE) {
      for (const s of area.sections) {
        expect(s.sections, `${area.slug}/${s.slug} nests too deep`).toHaveLength(0);
      }
    }
  });

  it('types every guide as a guide', () => {
    const guides = all.find((s) => s.slug === 'guides')!;
    expect(guides.entries).toHaveLength(4);
    for (const g of guides.entries) expect(g.type).toBe('guide');
  });

  it('orders the areas', () => {
    expect(CONTENT_TREE.map((s) => s.slug)).toEqual([
      'learn',
      'guides',
      'standard-library',
      'language',
      'standalone',
      'c-api',
    ]);
  });

  it('orders the areas the same way in ROOT_PAGES', () => {
    expect(ROOT_PAGES).toEqual(['index', ...CONTENT_TREE.map((s) => s.slug)]);
  });

  it('orders the standard library by how often a reader reaches for it', () => {
    const lib = CONTENT_TREE.find((s) => s.slug === 'standard-library')!;
    expect(lib.sections.map((s) => s.slug)).toEqual([
      'globals', 'string', 'table', 'math', 'io',
      'os', 'coroutine', 'utf8', 'package', 'debug',
    ]);
  });

  it('orders the language sections for learning', () => {
    const language = CONTENT_TREE.find((s) => s.slug === 'language')!;
    expect(language.sections.map((s) => s.slug)).toEqual([
      'values-and-types', 'lexical-conventions', 'variables-and-scope',
      'statements', 'expressions', 'metatables', 'environments',
      'error-handling', 'garbage-collection',
    ]);
  });
});

describe('the frontmatter schema', () => {
  // `defineDocs` is a build-time macro, so the schema's enum cannot import
  // ENTRY_TYPES — it is written out by hand and has to be read back as text.
  const source = readFileSync('src/lib/source.ts', 'utf8');

  it('declares exactly the entry types the manifest can produce', () => {
    const declared = source.match(/'entry-type':[\s\S]*?\.enum\(\[([^\]]*)\]\)/);
    expect(declared, "no `'entry-type': z.enum([...])` found in source.ts").not.toBeNull();

    const types = declared![1]
      .split(',')
      .map((t) => t.trim().replace(/^'|'$/g, ''))
      .filter(Boolean);

    expect(new Set(types)).toEqual(new Set(ENTRY_TYPES));
  });
});

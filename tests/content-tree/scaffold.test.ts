import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { scaffoldContent, PLACEHOLDER } from '@/content-tree/scaffold';
import { section, fns, consts, relatedGlobals, type Section } from '@/content-tree/manifest';

const tree: Section[] = [
  section('standard-library', 'Standard Library', '6', [], [
    section('string', 'string', '6.5', fns('string', 'format upper')),
  ]),
];

let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'luadocs-scaffold-'));
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe('scaffoldContent', () => {
  it('writes a stub with the entry title and type', async () => {
    await scaffoldContent(dir, tree);

    const text = await readFile(join(dir, 'standard-library/string/format.mdx'), 'utf8');
    expect(text).toContain('title: string.format');
    expect(text).toContain('entry-type: function');
    expect(text).toContain('source: https://www.lua.org/manual/5.5/manual.html#pdf-string.format');
    expect(text).toContain(PLACEHOLDER);
    expect(text).not.toContain('lua-compat');
  });

  it('writes a meta.json listing pages in manifest order, without the index', async () => {
    await scaffoldContent(dir, tree);

    const meta = JSON.parse(await readFile(join(dir, 'standard-library/string/meta.json'), 'utf8'));
    // No `index`: leaving it unlisted lets the loader claim it as the folder's own
    // link, so the section is one sidebar row rather than two.
    expect(meta).toEqual({ title: 'string', pages: ['format', 'upper'] });
  });

  it('separates groups only when a section holds more than one kind of entry', async () => {
    const mixed: Section[] = [
      section('standard-library', 'Standard Library', '6', [], [
        section('math', 'math', '6.8', [...fns('math', 'abs ceil'), ...consts('math', 'pi')]),
      ]),
    ];
    await scaffoldContent(dir, mixed);

    const meta = JSON.parse(await readFile(join(dir, 'standard-library/math/meta.json'), 'utf8'));
    expect(meta.pages).toEqual(['---Functions---', 'abs', 'ceil', '---Constants---', 'pi']);
  });

  it('ends a section with its cross-linked globals', async () => {
    const withRelated: Section[] = [
      section('standard-library', 'Standard Library', '6', [], [
        {
          ...section('table', 'table', '6.7', fns('table', 'insert')),
          related: relatedGlobals('pairs'),
        },
      ]),
    ];
    await scaffoldContent(dir, withRelated);

    const meta = JSON.parse(await readFile(join(dir, 'standard-library/table/meta.json'), 'utf8'));
    expect(meta.pages).toEqual([
      'insert',
      '---Related globals---',
      '[pairs()](/docs/standard-library/globals/pairs)',
    ]);
  });

  it('gives every section an overview entry', async () => {
    await scaffoldContent(dir, tree);

    const text = await readFile(join(dir, 'standard-library/index.mdx'), 'utf8');
    expect(text).toContain('entry-type: overview');
    expect(text).toContain('title: Standard Library');
    expect(text).toContain('source: https://www.lua.org/manual/5.5/manual.html#6');
  });

  it('is idempotent — a second run writes nothing', async () => {
    await scaffoldContent(dir, tree);
    const second = await scaffoldContent(dir, tree);

    expect(second.written).toBe(0);
    expect(second.kept).toBe(0);
  });

  it('never overwrites a file that differs from the stub it would write', async () => {
    await scaffoldContent(dir, tree);
    const path = join(dir, 'standard-library/string/format.mdx');
    await writeFile(path, '---\ntitle: string.format\n---\n\nReal authored prose.\n', 'utf8');

    const stats = await scaffoldContent(dir, tree);

    expect(stats.kept).toBe(1);
    expect(stats.written).toBe(0);
    expect(await readFile(path, 'utf8')).toContain('Real authored prose.');
  });

  it('keeps a stub whose frontmatter was filled in but whose body is still the placeholder', async () => {
    await scaffoldContent(dir, tree);
    const path = join(dir, 'standard-library/string/format.mdx');
    const started = [
      '---',
      'title: string.format',
      'description: "Formats a string."',
      'entry-type: function',
      'lua-compat: string.format',
      'source: https://www.lua.org/manual/5.5/manual.html#pdf-string.format',
      '---',
      '',
      PLACEHOLDER,
      '',
    ].join('\n');
    await writeFile(path, started, 'utf8');

    const stats = await scaffoldContent(dir, tree);

    expect(stats.kept).toBe(1);
    expect(stats.written).toBe(0);
    expect(await readFile(path, 'utf8')).toBe(started);
  });

  it('never overwrites a hand-edited meta.json', async () => {
    await scaffoldContent(dir, tree);
    const path = join(dir, 'standard-library/string/meta.json');
    const handEdited = JSON.stringify(
      { title: 'string', pages: ['index', '---Core---', 'format'] },
      null,
      2,
    ) + '\n';
    await writeFile(path, handEdited, 'utf8');

    const stats = await scaffoldContent(dir, tree);

    // Only the hand-edited meta.json — everything else in this fresh temp dir
    // is untouched, so it counts as unchanged rather than kept.
    expect(stats.kept).toBe(1);
    expect(await readFile(path, 'utf8')).toBe(handEdited);
  });

  it('reads a CRLF checkout as identical to the LF text it generates', async () => {
    const first = await scaffoldContent(dir, tree);
    const paths = ['standard-library/string/format.mdx', 'standard-library/string/meta.json'];
    for (const rel of paths) {
      const path = join(dir, rel);
      const lf = await readFile(path, 'utf8');
      await writeFile(path, lf.replace(/\n/g, '\r\n'), 'utf8');
    }

    const stats = await scaffoldContent(dir, tree);

    expect(stats.written).toBe(0);
    expect(stats.kept).toBe(0);
    expect(stats.unchanged).toBe(first.written);
    // The CRLF bytes survive: recognising a file costs nothing, rewriting it would
    // churn the whole tree on the first run after a clone.
    expect(await readFile(join(dir, paths[0]), 'utf8')).toContain('\r\n');
  });

  it('reports a file the manifest no longer calls for, without deleting it', async () => {
    await scaffoldContent(dir, tree);
    const stale = join(dir, 'standard-library/string/formatt.mdx');
    await writeFile(stale, 'renamed slug left this behind\n', 'utf8');
    await mkdir(join(dir, 'standard-library/strings'), { recursive: true });
    await writeFile(join(dir, 'standard-library/strings/meta.json'), '{}\n', 'utf8');

    const stats = await scaffoldContent(dir, tree);

    expect(stats.orphans).toEqual([
      'standard-library/string/formatt.mdx',
      'standard-library/strings/meta.json',
    ]);
    expect(await readFile(stale, 'utf8')).toContain('renamed slug left this behind');
  });

  it('does not call the authored root entry an orphan', async () => {
    await writeFile(join(dir, 'index.mdx'), '---\ntitle: Lua\n---\n\nAuthored.\n', 'utf8');

    const stats = await scaffoldContent(dir, tree);

    expect(stats.orphans).toEqual([]);
  });
});

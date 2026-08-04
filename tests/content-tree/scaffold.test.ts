import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { scaffoldContent, contentTreeUrls, PLACEHOLDER } from '@/content-tree/scaffold';
import { section, fns, type Section } from '@/content-tree/manifest';

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

  it('writes a meta.json using the rest item rather than listing every page', async () => {
    await scaffoldContent(dir, tree);

    const meta = JSON.parse(await readFile(join(dir, 'standard-library/string/meta.json'), 'utf8'));
    expect(meta).toEqual({ title: 'string', pages: ['index', '...'] });
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
  });

  it('never overwrites an authored body', async () => {
    await scaffoldContent(dir, tree);
    const path = join(dir, 'standard-library/string/format.mdx');
    await writeFile(path, '---\ntitle: string.format\n---\n\nReal authored prose.\n', 'utf8');

    const stats = await scaffoldContent(dir, tree);

    expect(stats.kept).toBe(1);
    expect(await readFile(path, 'utf8')).toContain('Real authored prose.');
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

  it('lists every entry URL for the prerenderer', () => {
    expect(contentTreeUrls(tree)).toEqual([
      '/docs/standard-library',
      '/docs/standard-library/string',
      '/docs/standard-library/string/format',
      '/docs/standard-library/string/upper',
    ]);
  });
});

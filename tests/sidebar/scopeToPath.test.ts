import { describe, it, expect } from 'vitest';
import type * as PageTree from 'fumadocs-core/page-tree';
import { scopeToPath } from '@/sidebar/scopeToPath';

const page = (name: string, url: string): PageTree.Item => ({ type: 'page', name, url });

const section = (slug: string, entries: string[]) => ({
  type: 'folder',
  name: slug,
  index: page(slug, `/docs/standard-library/${slug}`),
  children: entries.map((e) => page(e, `/docs/standard-library/${slug}/${e}`)),
});

const tree = {
  name: 'docs',
  children: [
    {
      type: 'folder',
      name: 'Standard Library',
      index: page('Standard Library', '/docs/standard-library'),
      children: [section('string', ['format']), section('table', ['insert'])],
    },
    {
      type: 'folder',
      name: 'C API',
      index: page('C API', '/docs/c-api'),
      children: [page('Calling', '/docs/c-api/calling'), page('Userdata', '/docs/c-api/userdata')],
    },
  ],
} as unknown as PageTree.Root;

const areaNames = (t: PageTree.Root) => t.children.map((c) => (c as PageTree.Folder).name);
const childrenOf = (t: PageTree.Root, i: number) =>
  (t.children[i] as PageTree.Folder).children.map((c) =>
    c.type === 'folder' ? c.name : (c as PageTree.Item).name,
  );

describe('scopeToPath', () => {
  it('keeps only the section you are inside', () => {
    const out = scopeToPath(tree, '/docs/standard-library/string/format');
    expect(childrenOf(out, 0)).toEqual(['string']);
  });

  it('keeps the section when you are on its own overview', () => {
    const out = scopeToPath(tree, '/docs/standard-library/string');
    expect(childrenOf(out, 0)).toEqual(['string']);
  });

  it('lists every section from the area overview', () => {
    const out = scopeToPath(tree, '/docs/standard-library');
    expect(childrenOf(out, 0)).toEqual(['string', 'table']);
  });

  it('leaves other areas alone, so they stay one click away', () => {
    const out = scopeToPath(tree, '/docs/standard-library/string');
    expect(areaNames(out)).toEqual(['Standard Library', 'C API']);
    expect(childrenOf(out, 1)).toEqual(['Calling', 'Userdata']);
  });

  it('does not scope an area whose children are entries, not sections', () => {
    const out = scopeToPath(tree, '/docs/c-api/calling');
    expect(childrenOf(out, 1)).toEqual(['Calling', 'Userdata']);
  });

  it('does not treat a prefix match as being inside', () => {
    // `/docs/standard-library/stringx` must not scope to `string`.
    const out = scopeToPath(tree, '/docs/standard-library/stringx');
    expect(childrenOf(out, 0)).toEqual(['string', 'table']);
  });

  it('gives each scope its own id, so the layout stops reusing a stale tree', () => {
    // The layout memoises on `$id` alone. A scoped copy that kept the original id
    // was ignored, leaving whichever scope was built on first load on screen.
    const inString = scopeToPath(tree, '/docs/standard-library/string');
    const inTable = scopeToPath(tree, '/docs/standard-library/table');
    const unscoped = scopeToPath(tree, '/docs/standard-library');

    expect(inString.$id).not.toBe(inTable.$id);
    expect(inString.$id).not.toBe(unscoped.$id);
    expect(inString.$id).not.toBe(tree.$id);
  });

  it('gives the same scope the same id, so navigating within a section is stable', () => {
    expect(scopeToPath(tree, '/docs/standard-library/string').$id).toBe(
      scopeToPath(tree, '/docs/standard-library/string/format').$id,
    );
  });

  it('does not mutate the tree it is given', () => {
    const before = JSON.stringify(tree);
    scopeToPath(tree, '/docs/standard-library/string');
    expect(JSON.stringify(tree)).toBe(before);
  });
});

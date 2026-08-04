import { describe, it, expect } from 'vitest';
import type * as PageTree from 'fumadocs-core/page-tree';
import { countEntries, filterPageTree } from '@/sidebar/filterPageTree';

const page = (name: string, url: string): PageTree.Item => ({ type: 'page', name, url });

const group = (name: string, children: PageTree.Node[]) => ({
  type: 'folder',
  name,
  children,
});

const tree = {
  $id: 'docs',
  name: 'docs',
  children: [
    {
      type: 'folder',
      name: 'Standard Library',
      index: page('Standard Library', '/docs/standard-library'),
      children: [
        {
          type: 'folder',
          name: 'Globals',
          index: page('Globals', '/docs/standard-library/globals'),
          children: [
            group('Functions', [
              page('getmetatable()', '/docs/standard-library/globals/getmetatable'),
              page('pairs()', '/docs/standard-library/globals/pairs'),
            ]),
          ],
        },
        {
          type: 'folder',
          name: 'math',
          index: page('math', '/docs/standard-library/math'),
          children: [page('math.abs()', '/docs/standard-library/math/abs')],
        },
      ],
    },
  ],
} as unknown as PageTree.Root;

/** Every page url left in the tree, in order. */
function urls(node: PageTree.Root | PageTree.Folder): string[] {
  return node.children.flatMap((child) => {
    if (child.type === 'folder') return urls(child);
    return child.type === 'page' ? [child.url] : [];
  });
}

describe('filterPageTree', () => {
  it('returns the tree untouched for an empty query', () => {
    expect(filterPageTree(tree, '')).toBe(tree);
    expect(filterPageTree(tree, '   ')).toBe(tree);
  });

  it('keeps a match in place, under its group, section and area', () => {
    const out = filterPageTree(tree, 'getmetatable');

    expect(urls(out)).toEqual(['/docs/standard-library/globals/getmetatable']);

    // Not flattened into a result list: the ancestors are still there.
    const area = out.children[0] as PageTree.Folder;
    const section = area.children[0] as PageTree.Folder;
    const grp = section.children[0] as PageTree.Folder;
    expect(area.name).toBe('Standard Library');
    expect(section.name).toBe('Globals');
    expect(grp.name).toBe('Functions');
  });

  it('drops sections that contain no match', () => {
    const out = filterPageTree(tree, 'getmetatable');
    expect(urls(out)).not.toContain('/docs/standard-library/math/abs');
  });

  it('keeps every child of a folder whose own name matches', () => {
    // Filtering to `math` means the library, not just the entry named after it.
    const out = filterPageTree(tree, 'math');
    expect(urls(out)).toEqual(['/docs/standard-library/math/abs']);
  });

  it('is case-insensitive and ignores surrounding whitespace', () => {
    expect(urls(filterPageTree(tree, '  PAIRS  '))).toEqual([
      '/docs/standard-library/globals/pairs',
    ]);
  });

  it('yields an empty tree when nothing matches', () => {
    const out = filterPageTree(tree, 'zzzznope');
    expect(urls(out)).toEqual([]);
    expect(countEntries(out)).toBe(0);
  });

  it('gives each query its own id, so the layout stops reusing a stale tree', () => {
    expect(filterPageTree(tree, 'pairs').$id).not.toBe(filterPageTree(tree, 'math').$id);
    expect(filterPageTree(tree, 'pairs').$id).not.toBe(tree.$id);
  });

  it('does not mutate the tree it is given', () => {
    const before = JSON.stringify(tree);
    filterPageTree(tree, 'pairs');
    expect(JSON.stringify(tree)).toBe(before);
  });
});

describe('countEntries', () => {
  it('counts pages at every depth, and no folders', () => {
    expect(countEntries(tree)).toBe(3);
  });
});

import { describe, it, expect } from 'vitest';
import type * as PageTree from 'fumadocs-core/page-tree';
import { groupPageTree } from '@/sidebar/groupPageTree';

const item = (name: string, url: string): PageTree.Item => ({ type: 'page', name, url });

const tree = {
  name: 'docs',
  children: [
    {
      type: 'folder',
      name: 'math',
      index: item('math', '/docs/standard-library/math'),
      children: [
        { type: 'separator', name: 'Functions' },
        item('math.abs()', '/docs/standard-library/math/abs'),
        { type: 'separator', name: 'Constants' },
        item('math.pi', '/docs/standard-library/math/pi'),
      ],
    },
  ],
} as unknown as PageTree.Root;

describe('groupPageTree', () => {
  it('folds a separator and its following items into an index-less folder', () => {
    const math = groupPageTree(tree).children[0] as PageTree.Folder;

    expect(math.children).toHaveLength(2);
    const [functions, constants] = math.children as PageTree.Folder[];
    expect(functions.type).toBe('folder');
    expect(functions.name).toBe('Functions');
    // No index: the group is a collapse trigger, never a link.
    expect(functions.index).toBeUndefined();
    // Open by default — a group is there to be collapsed, not to hide entries.
    expect(functions.defaultOpen).toBe(true);
    expect(constants.name).toBe('Constants');
    expect(constants.children).toHaveLength(1);
  });

  it('leaves every label fully qualified', () => {
    const math = groupPageTree(tree).children[0] as PageTree.Folder;
    const [functions, constants] = math.children as PageTree.Folder[];

    // Dotted means library member, bare means global — the distinction that makes
    // a Related globals group legible, so nothing is shortened.
    expect((functions.children[0] as PageTree.Item).name).toBe('math.abs()');
    expect((constants.children[0] as PageTree.Item).name).toBe('math.pi');
  });

  it('keeps the section overview as the folder link, not a child', () => {
    const math = groupPageTree(tree).children[0] as PageTree.Folder;

    expect((math.index as PageTree.Item).url).toBe('/docs/standard-library/math');
    expect(JSON.stringify(math.children)).not.toContain('"math"');
  });

  it('folds a cross-linked global into its group, pointing at the canonical URL', () => {
    const table = {
      name: 'docs',
      children: [
        {
          type: 'folder',
          name: 'table',
          index: item('table', '/docs/standard-library/table'),
          children: [
            item('table.insert()', '/docs/standard-library/table/insert'),
            { type: 'separator', name: 'Related globals' },
            item('setmetatable()', '/docs/standard-library/globals/setmetatable'),
          ],
        },
      ],
    } as unknown as PageTree.Root;

    const folder = groupPageTree(table).children[0] as PageTree.Folder;

    // Entries before the first separator stay directly under the section: native
    // content is never behind a disclosure, borrowed content always is.
    expect((folder.children[0] as PageTree.Item).name).toBe('table.insert()');

    const related = folder.children[1] as PageTree.Folder;
    expect(related.name).toBe('Related globals');
    // The row lives under `table`; the page stays in Globals.
    expect((related.children[0] as PageTree.Item).url).toBe(
      '/docs/standard-library/globals/setmetatable',
    );
  });

  it('does not mutate the tree it is given', () => {
    // The breadcrumb reads the ungrouped tree, because a group is not a level of
    // hierarchy. That only works while this stays a copy.
    const before = JSON.stringify(tree);
    groupPageTree(tree);
    expect(JSON.stringify(tree)).toBe(before);
  });

  it('leaves a section with no separators untouched', () => {
    const os = {
      name: 'docs',
      children: [
        {
          type: 'folder',
          name: 'os',
          index: item('os', '/docs/standard-library/os'),
          children: [item('os.time()', '/docs/standard-library/os/time')],
        },
      ],
    } as unknown as PageTree.Root;

    const folder = groupPageTree(os).children[0] as PageTree.Folder;
    expect(folder.children).toHaveLength(1);
    expect(folder.children[0].type).toBe('page');
  });
});

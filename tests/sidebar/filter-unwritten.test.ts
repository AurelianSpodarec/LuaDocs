import { describe, it, expect } from 'vitest';
import type * as PageTree from 'fumadocs-core/page-tree';
import { filterUnwritten } from '@/sidebar/filterUnwritten';

const page = (name: string, url: string): PageTree.Node => ({ type: 'page', name, url });

const folder = (
  name: string,
  children: PageTree.Node[],
  index?: PageTree.Item,
): PageTree.Node => ({ type: 'folder', name, children, index }) as PageTree.Node;

const root = (children: PageTree.Node[]): PageTree.Root => ({ name: 'docs', children });

const names = (tree: PageTree.Root | PageTree.Folder): string[] =>
  tree.children.map((child) => ('name' in child ? String(child.name) : child.type));

describe('filterUnwritten', () => {
  it('keeps an authored page', () => {
    const tree = filterUnwritten(root([page('format', '/docs/string/format')]), new Set(['/docs/string/format']));
    expect(names(tree)).toEqual(['format']);
  });

  it('drops an unwritten page', () => {
    const tree = filterUnwritten(root([page('while', '/docs/language/while')]), new Set());
    expect(names(tree)).toEqual([]);
  });

  it('keeps a folder that still has an authored child', () => {
    const tree = filterUnwritten(
      root([folder('string', [page('format', '/a'), page('rep', '/b')])]),
      new Set(['/a']),
    );
    expect(names(tree)).toEqual(['string']);
    expect(names(tree.children[0] as PageTree.Folder)).toEqual(['format']);
  });

  it('drops a folder whose children are all unwritten', () => {
    // Otherwise the Language chapter renders as empty collapse triggers — a chevron
    // promising something is behind it.
    const tree = filterUnwritten(
      root([folder('statements', [page('while', '/a'), page('goto', '/b')])]),
      new Set(),
    );
    expect(names(tree)).toEqual([]);
  });

  it('keeps a folder whose own index is authored even with no children left', () => {
    const index = { type: 'page', name: 'Statements', url: '/idx' } as PageTree.Item;
    const tree = filterUnwritten(
      root([folder('statements', [page('while', '/a')], index)]),
      new Set(['/idx']),
    );
    expect(names(tree)).toEqual(['statements']);
  });

  it('keeps an unwritten index on a folder that survives on its children', () => {
    // `scopeToDestination` selects a destination's areas by `folder.index.url`. Stripping
    // the index off `/docs/standard-library`, whose front door is still a stub, removed
    // the entire Reference tree from the sidebar — an empty sidebar on every entry.
    const index = { type: 'page', name: 'Standard Library', url: '/idx' } as PageTree.Item;
    const tree = filterUnwritten(
      root([folder('standard-library', [page('format', '/a')], index)]),
      new Set(['/a']),
    );
    expect((tree.children[0] as PageTree.Folder).index).toBe(index);
  });

  it('drops a folder whose children and index are all unwritten', () => {
    const index = { type: 'page', name: 'C API', url: '/idx' } as PageTree.Item;
    const tree = filterUnwritten(
      root([folder('c-api', [page('userdata', '/a')], index)]),
      new Set(),
    );
    expect(names(tree)).toEqual([]);
  });

  it('drops nested folders all the way up', () => {
    const tree = filterUnwritten(
      root([folder('language', [folder('statements', [page('while', '/a')])])]),
      new Set(),
    );
    expect(names(tree)).toEqual([]);
  });

  it('drops a separator whose whole run was filtered away', () => {
    const tree = filterUnwritten(
      root([{ type: 'separator', name: 'Legacy' } as PageTree.Node, page('maxn', '/a')]),
      new Set(),
    );
    expect(names(tree)).toEqual([]);
  });

  it('keeps a separator that still labels something', () => {
    const tree = filterUnwritten(
      root([{ type: 'separator', name: 'Legacy' } as PageTree.Node, page('maxn', '/a')]),
      new Set(['/a']),
    );
    expect(names(tree)).toEqual(['Legacy', 'maxn']);
  });
});

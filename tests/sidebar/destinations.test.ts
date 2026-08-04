import { describe, it, expect } from 'vitest';
import type * as PageTree from 'fumadocs-core/page-tree';
import { destinationFor, scopeToDestination } from '@/sidebar/destinations';

const page = (name: string, url: string): PageTree.Item => ({ type: 'page', name, url });

const area = (name: string, slug: string) => ({
  type: 'folder',
  name,
  index: page(name, `/docs/${slug}`),
  children: [page(`${slug} entry`, `/docs/${slug}/entry`)],
});

const tree = {
  $id: 'docs',
  name: 'docs',
  children: [
    area('Learn', 'learn'),
    area('Guides', 'guides'),
    area('Standard Library', 'standard-library'),
    area('Language', 'language'),
    area('Standalone interpreter', 'standalone'),
    area('C API', 'c-api'),
  ],
} as unknown as PageTree.Root;

const areasOf = (t: PageTree.Root) => t.children.map((c) => (c as PageTree.Folder).name);

describe('destinationFor', () => {
  it('sends the lookup areas to Reference', () => {
    expect(destinationFor('/docs/standard-library/string/format').name).toBe('Reference');
    expect(destinationFor('/docs/language/statements/goto').name).toBe('Reference');
    expect(destinationFor('/docs/c-api').name).toBe('Reference');
  });

  it('sends the narrative areas to their own destinations', () => {
    expect(destinationFor('/docs/learn').name).toBe('Learn');
    expect(destinationFor('/docs/guides/history-of-lua').name).toBe('Guides');
  });

  it('falls back to Reference, so /docs itself lands somewhere', () => {
    expect(destinationFor('/docs').name).toBe('Reference');
  });

  it('does not treat a prefix match as being inside', () => {
    // `/docs/learners` is not `/docs/learn`.
    expect(destinationFor('/docs/learners').name).toBe('Reference');
  });
});

describe('scopeToDestination', () => {
  it('gives Reference the four lookup areas and neither narrative one', () => {
    const out = scopeToDestination(tree, '/docs/standard-library/string/format');

    expect(areasOf(out)).toEqual([
      'Standard Library',
      'Language',
      'Standalone interpreter',
      'C API',
    ]);
  });

  it('replaces the tree rather than scrolling within one', () => {
    expect(areasOf(scopeToDestination(tree, '/docs/learn'))).toEqual(['Learn']);
    expect(areasOf(scopeToDestination(tree, '/docs/guides'))).toEqual(['Guides']);
  });

  it('gives each destination its own id, so the layout stops reusing a stale tree', () => {
    // The layout memoises on `$id` alone; a scoped copy keeping the original id is
    // silently ignored. This cost a bug once already.
    const reference = scopeToDestination(tree, '/docs/standard-library');
    const learn = scopeToDestination(tree, '/docs/learn');

    expect(reference.$id).not.toBe(learn.$id);
    expect(reference.$id).not.toBe(tree.$id);
  });

  it('gives the same destination the same id, so navigating within it is stable', () => {
    expect(scopeToDestination(tree, '/docs/standard-library').$id).toBe(
      scopeToDestination(tree, '/docs/language/statements/goto').$id,
    );
  });

  it('does not mutate the tree it is given', () => {
    const before = JSON.stringify(tree);
    scopeToDestination(tree, '/docs/learn');
    expect(JSON.stringify(tree)).toBe(before);
  });
});

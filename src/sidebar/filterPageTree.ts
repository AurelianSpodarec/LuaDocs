import type { ReactNode } from 'react';
import type * as PageTree from 'fumadocs-core/page-tree';
import { textOf } from './Label';

/**
 * The sidebar filter, which is **not** search (ADR 0007).
 *
 * Search takes you somewhere. The filter narrows what is on screen and keeps you
 * oriented, so it preserves the tree rather than flattening it into a result list: a
 * match keeps its Group, its Section and its Area above it. On an unscoped tree this
 * is worth more than it is to MDN — typing `meta` surfaces `getmetatable()` under
 * Globals *and* `__index` under Language › Metatables, each still in place.
 *
 * A folder whose own name matches keeps all of its children, so filtering to `string`
 * gives you the whole library rather than the one entry named after it.
 */
function matches(name: ReactNode, query: string): boolean {
  const text = textOf(name);
  return text !== null && text.toLowerCase().includes(query);
}

function filterChildren(children: PageTree.Node[], query: string): PageTree.Node[] {
  const kept: PageTree.Node[] = [];

  for (const child of children) {
    // Separators are folded into folders by `groupPageTree` before this runs. One
    // arriving here would be a bare label with nothing under it, so it is dropped.
    if (child.type === 'separator') continue;

    if (child.type !== 'folder') {
      if (matches(child.name, query)) kept.push(child);
      continue;
    }

    if (matches(child.name, query)) {
      kept.push(child);
      continue;
    }

    const inner = filterChildren(child.children, query);
    if (inner.length > 0) kept.push({ ...child, children: inner });
  }

  return kept;
}

/**
 * The `$id` carries the query for the same reason it carries the destination: the
 * layout memoises on it, and a filtered tree that kept the unfiltered id would never
 * reach the screen.
 */
export function filterPageTree(tree: PageTree.Root, query: string): PageTree.Root {
  const normalised = query.trim().toLowerCase();
  if (normalised.length === 0) return tree;

  return {
    ...tree,
    $id: `${tree.$id ?? 'tree'}|filter:${normalised}`,
    children: filterChildren(tree.children, normalised),
  };
}

/** How many entries survived, so the sidebar can say when nothing did. */
export function countEntries(tree: PageTree.Root | PageTree.Folder): number {
  return tree.children.reduce((total, child) => {
    if (child.type === 'folder') return total + countEntries(child);
    return child.type === 'page' ? total + 1 : total;
  }, 0);
}

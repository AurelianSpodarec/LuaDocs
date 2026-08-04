import type * as PageTree from 'fumadocs-core/page-tree';

function isInside(pathname: string, url: string): boolean {
  return pathname === url || pathname.startsWith(`${url}/`);
}

/**
 * Show one Section at a time, as MDN does: on its `Math` page the sidebar lists
 * `Math`'s members and no other built-in object.
 *
 * Without this, every Section in an Area stays listed and the one you are in expands
 * — which turns navigation into an accordion with no affordance, since a Section's
 * label is a link and carries no chevron (ADR 0006). Dropping the siblings removes
 * the illusion: nothing opens or closes, there is simply less of the tree.
 *
 * The cost is MDN's cost. Reaching `table` from `string` means going up through the
 * Area first, which is why the Area's own row stays visible and linked.
 */
export function scopeToPath(tree: PageTree.Root, pathname: string): PageTree.Root {
  const kept: string[] = [];

  const children = tree.children.map((area) => {
    if (area.type !== 'folder') return area;

    const current = area.children.find(
      (child) => child.type === 'folder' && child.index && isInside(pathname, child.index.url),
    );

    // An Area whose children are entries rather than Sections — Guides, C API —
    // has nothing to scope, and keeps all of them.
    if (!current) return area;

    kept.push((current as PageTree.Folder).index!.url);
    return { ...area, children: [current] };
  });

  // The layout memoises the tree on `$id` alone, so a scoped copy that inherits the
  // original id is silently ignored: the sidebar keeps rendering whichever scope was
  // built on first load, while each Section's own expand check stays live. The result
  // reads as an accordion — click a Section and it opens among its siblings. Keying
  // the id to what was kept makes the identity change exactly when the scope does.
  return { ...tree, $id: `${tree.$id ?? 'tree'}|${kept.join(',')}`, children };
}

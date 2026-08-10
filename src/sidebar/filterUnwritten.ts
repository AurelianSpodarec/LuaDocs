import type * as PageTree from 'fumadocs-core/page-tree';

/**
 * Drop entries nobody has written from the sidebar.
 *
 * 110 of the 292 pages under `content/docs` are scaffolded stubs. Listed as ordinary rows
 * they are the site claiming to have a page it does not have — and a row that goes
 * nowhere is worse than an absent one, because the reader spends a click finding out.
 *
 * This is the same predicate that excludes them from the search index, the sitemap and
 * both export surfaces, and that puts `noindex` on the page itself. One rule, five
 * consumers (ADR 0012).
 *
 * It runs **before** `groupPageTree` and `scopeToDestination`, so a group emptied by it
 * never forms in the first place — otherwise the Language chapter renders as eleven empty
 * collapse triggers, which is worse than the rows it replaced: a chevron promises
 * something is behind it.
 */
function filterChildren(
  children: PageTree.Node[],
  authored: ReadonlySet<string>,
): PageTree.Node[] {
  const kept: PageTree.Node[] = [];

  for (const child of children) {
    if (child.type === 'page') {
      if (authored.has(child.url)) kept.push(child);
      continue;
    }

    if (child.type !== 'folder') {
      // A separator is a label for whatever follows it. Whether it survives depends on
      // whether anything does, so it is decided in the second pass below.
      kept.push(child);
      continue;
    }

    const inner = filterChildren(child.children, authored);
    const indexAuthored = child.index != null && authored.has(child.index.url);

    // A folder with no surviving children and no body of its own has nothing to open.
    if (inner.length === 0 && !indexAuthored) continue;

    // The index is kept as it stands, even when it is itself a stub, whenever the folder
    // survives on its children. `scopeToDestination` selects a destination's areas by
    // `folder.index.url`, so stripping the index off `/docs/standard-library` — whose
    // front door is still unwritten — removes the entire Reference tree from the sidebar.
    // A folder that is on screen needs its own handle; what its front door says is the
    // authored predicate's business on that page, not here.
    kept.push({ ...child, children: inner });
  }

  return dropTrailingSeparators(kept);
}

/**
 * A separator whose entire run was filtered away would render as a heading over nothing.
 * Keep one only when a non-separator node follows it before the next separator.
 */
function dropTrailingSeparators(nodes: PageTree.Node[]): PageTree.Node[] {
  return nodes.filter((node, i) => {
    if (node.type !== 'separator') return true;
    return nodes.slice(i + 1).some((next) => next.type !== 'separator');
  });
}

export function filterUnwritten(
  tree: PageTree.Root,
  authored: ReadonlySet<string>,
): PageTree.Root {
  return {
    ...tree,
    children: filterChildren(tree.children, authored),
  };
}

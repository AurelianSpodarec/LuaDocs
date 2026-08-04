import type * as PageTree from 'fumadocs-core/page-tree';

/**
 * A sidebar group is a labelled, collapsible run of entries with no page behind it
 * (ADR 0006) — MDN's `Static methods`. Fumadocs has no such node: its `separator` is
 * flat and owns nothing, so it cannot collapse. A `folder` with no `index` renders
 * through `SidebarFolderTrigger` as exactly that: a collapse trigger which is not a
 * link. So each separator, and the items following it, become one index-less folder.
 *
 * Labels are left alone. Titles stay fully qualified (`table.insert()` beside
 * `setmetatable()`) because dotted-versus-bare is what tells a reader which rows
 * belong to the section and which are cross-linked globals.
 */
export function groupPageTree<T extends PageTree.Root | PageTree.Folder>(node: T): T {
  const children: PageTree.Node[] = [];
  let group: PageTree.Folder | null = null;

  for (const child of node.children) {
    if (child.type === 'separator') {
      // Open by default: a group exists so a reader can collapse noise, not so we
      // can hide entries from them (ADR 0006).
      group = {
        type: 'folder',
        name: child.name,
        defaultOpen: true,
        children: [],
      } as PageTree.Folder;
      children.push(group);
      continue;
    }

    const next = child.type === 'folder' ? groupPageTree(child) : child;

    if (group) group.children.push(next);
    else children.push(next);
  }

  return { ...node, children };
}

import { Link } from '@tanstack/react-router';
import type * as PageTree from 'fumadocs-core/page-tree';
import { compatNodeFor } from '@/compat/registry';
import { isAvailable } from '@/compat/resolve';
import { useSelectedVersion } from '@/version/SelectedVersionProvider';

/**
 * Option C: entries unavailable in the selected version are dimmed and badged with
 * the version that introduced them — but stay clickable, so a reader can always
 * reach the page and find out why it is greyed out.
 */
export function createSidebarItem(compatByUrl: Record<string, string>) {
  return function SidebarItem({ item }: { item: PageTree.Item }) {
    const { version } = useSelectedVersion();
    const node = compatNodeFor(compatByUrl[item.url]);
    const unavailable = node ? !isAvailable(node, version) : false;
    const addedIn = node?.support.lua.version_added;

    return (
      <Link
        to={item.url}
        data-unavailable={unavailable || undefined}
        className="flex items-center gap-2 rounded px-2 py-1.5 text-sm data-[unavailable]:opacity-50"
      >
        <span>{item.name}</span>
        {unavailable && addedIn !== false && addedIn !== undefined && (
          <span className="rounded border px-1 text-xs">{addedIn}+</span>
        )}
      </Link>
    );
  };
}

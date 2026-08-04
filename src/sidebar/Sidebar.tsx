import { Link, useLocation } from '@tanstack/react-router';
import type * as PageTree from 'fumadocs-core/page-tree';
import {
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
  useFolderDepth,
} from 'fumadocs-ui/components/sidebar/base';
import type { ReactNode } from 'react';
import { compatNodeFor } from '@/compat/registry';
import { isAvailable } from '@/compat/resolve';
import { useSelectedVersion } from '@/version/SelectedVersionProvider';
import { SidebarLabel } from './Label';

/**
 * Modelled on MDN's sidebar, measured from its `Math` page, with one deliberate
 * departure.
 *
 * What is copied: identifiers are mono and structural labels are sans (see `Label`),
 * rows breathe, and each level indents only 8px — MDN leans on type, not on
 * indentation.
 *
 * What is not: MDN sets every row at 16px, because its sidebar is scoped to one
 * built-in object and never shows more than a couple of levels at once. Ours is
 * unscoped and four deep — Area → Section → Group → Entry — so the two levels that
 * are *labels* rather than content take a smaller size, and the Area takes small
 * caps. Each level is then unmistakable on its own, without reading its neighbours.
 */
const row = 'flex items-center gap-2 rounded transition-colors';

/** An Area — `Standard Library`, `Language`. The spine, styled as a header. */
const areaClass = `${row} mt-6 mb-1 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground`;

/** A Section — `math`, `table`. The anchor: the largest, heaviest thing here. */
const sectionClass = `${row} px-2 py-1 text-[0.9375rem] font-semibold leading-6 text-fd-foreground`;

/** A Group — `Functions`, `Related globals`. A label with no page behind it. */
const groupClass = `${row} px-2 py-1 text-xs font-medium text-fd-muted-foreground`;

/**
 * Option C: entries unavailable in the selected version are dimmed and badged with
 * the version that introduced them — but stay clickable, so a reader can always
 * reach the page and find out why it is greyed out.
 */
const itemClassName = `${row} px-2 py-1 text-sm leading-6 text-fd-muted-foreground hover:text-fd-foreground data-[unavailable]:opacity-50 data-[status=active]:bg-fd-accent data-[status=active]:font-medium data-[status=active]:text-fd-accent-foreground`;

export function createSidebarItem(compatByUrl: Record<string, string>) {
  return function SidebarItem({ item }: { item: PageTree.Item }) {
    const { version } = useSelectedVersion();
    const node = compatNodeFor(compatByUrl[item.url]);
    const unavailable = node ? !isAvailable(node, version) : false;
    const addedIn = node?.support.lua.version_added;

    const label = (
      <>
        {item.icon}
        <SidebarLabel name={item.name} />
        {unavailable && addedIn !== false && addedIn !== undefined && (
          <span className="rounded border px-1 text-xs">{addedIn}+</span>
        )}
      </>
    );

    if (item.external) {
      return (
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer noopener"
          data-unavailable={unavailable || undefined}
          className={itemClassName}
        >
          {label}
        </a>
      );
    }

    return (
      <Link
        to={item.url}
        activeOptions={{ exact: true }}
        data-unavailable={unavailable || undefined}
        className={itemClassName}
      >
        {label}
      </Link>
    );
  };
}

/**
 * A folder is one of two things, and they must not look alike:
 *
 * - A **section** (`math`, `table`) has an overview, so its label is the link to it,
 *   set at weight 600 — the heaviest thing in the sidebar.
 * - A **group** (`Functions`, `Related globals`) has no page at all. Its label is a
 *   collapse trigger at weight 400, sans-serif, with the chevron hanging to its left
 *   exactly as MDN's `Static methods` does.
 */
export function SidebarFolderNode({
  item,
  children,
}: {
  item: PageTree.Folder;
  children: ReactNode;
}) {
  const { pathname } = useLocation();
  const depth = useFolderDepth();
  const index = item.index;
  const active = index ? pathname === index.url : false;
  const inPath = index ? pathname.startsWith(index.url) : true;
  // Depth 0 is an Area; anything deeper with an overview is a Section.
  const linkClass = depth === 0 ? areaClass : sectionClass;

  return (
    <SidebarFolder collapsible={item.collapsible} active={inPath} defaultOpen={item.defaultOpen}>
      {index ? (
        <SidebarFolderLink href={index.url} active={active} className={linkClass}>
          {item.icon}
          <SidebarLabel name={item.name} />
        </SidebarFolderLink>
      ) : (
        <SidebarFolderTrigger className={groupClass}>
          {item.icon}
          <SidebarLabel name={item.name} />
        </SidebarFolderTrigger>
      )}
      {/* 8px per level, as MDN indents. It does not need more, because typeface and
          weight are already saying which level you are on. */}
      <SidebarFolderContent className="ps-2">{children}</SidebarFolderContent>
    </SidebarFolder>
  );
}

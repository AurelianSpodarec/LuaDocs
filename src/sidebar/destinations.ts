import type * as PageTree from 'fumadocs-core/page-tree';
import {
  BookOpen,
  FileText,
  GraduationCap,
  MessagesSquare,
  SquareTerminal,
  type LucideIcon,
} from 'lucide-react';
import { gitConfig } from '@/lib/shared';

/**
 * The sidebar's top block: **places, never preferences** (ADR 0007).
 *
 * Copied from the Tailwind CSS docs sidebar rather than from MDN. MDN's top nav
 * answers "which of five reference sites am I in", which is a question LuaDocs does
 * not have; Tailwind's block answers "which part of one product am I in", which is
 * the one it does.
 *
 * `areas` names the top-level tree folders a destination owns, which is what lets the
 * tree below the block belong to whichever destination is active. Learn and Guides
 * own themselves — they left the Area sequence in ADR 0006 precisely so a curated
 * reading order would stop being listed as a peer of `C API`.
 */
export type Destination = {
  name: string;
  url: string;
  icon: LucideIcon;
  /** Tree folders this destination owns, by URL. Absent when the link leaves the site. */
  areas?: string[];
  external?: boolean;
  /**
   * Open in a new tab. Implied by `external`, and set on its own for the destinations
   * that stay on the site but are *tools* rather than reading — you go to them with an
   * entry half-read and want it still there when you come back.
   */
  newTab?: boolean;
};

export const destinations: Destination[] = [
  {
    name: 'Reference',
    url: '/docs',
    icon: BookOpen,
    areas: ['/docs/standard-library', '/docs/language', '/docs/standalone', '/docs/c-api'],
  },
  { name: 'Learn', url: '/docs/learn', icon: GraduationCap, areas: ['/docs/learn'] },
  { name: 'Guides', url: '/docs/guides', icon: FileText, areas: ['/docs/guides'] },
  // Not a docs area — it is the standalone editor — and it sits here anyway, exactly
  // as Tailwind's own Playground does. The route arrives in slice 5.
  // A new tab, though it never leaves the site: the reason to open the playground from
  // inside an entry is to try what the entry just described, and a same-tab jump costs
  // you the entry — and the editor its contents on the way back.
  { name: 'Playground', url: '/playground', icon: SquareTerminal, newTab: true },
  {
    name: 'Community',
    url: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    icon: MessagesSquare,
    external: true,
  },
];

/**
 * Reference is the fallback, so `/docs` itself lands there rather than nowhere. It is
 * also the only destination whose `areas` list is longer than one, which is the whole
 * point of the split: everything lookup-shaped is one place, and the two narrative
 * areas are their own.
 */
export function destinationFor(pathname: string): Destination {
  const match = destinations.find((destination) =>
    destination.areas?.some((area) => pathname === area || pathname.startsWith(`${area}/`)),
  );

  return match ?? destinations[0];
}

/**
 * The area URLs that still have something behind them, read off the filtered tree.
 *
 * `filterUnwritten` drops a top-level folder whose entries are all unwritten, so an area
 * that survives is one with at least one authored entry. Today that is
 * `/docs/standard-library` and nothing else.
 */
export function liveAreaUrls(tree: PageTree.Root): Set<string> {
  const live = new Set<string>();
  for (const child of tree.children) {
    if (child.type === 'folder' && child.index != null) live.add(child.index.url);
  }
  return live;
}

/**
 * Destinations worth offering — the same rule as everything else on this site: do not
 * advertise what is not there (ADR 0012).
 *
 * Learn and Guides own one unwritten area each, so listing them hands the reader a link
 * to an empty tree. A destination with no `areas` at all — Playground, Community — is not
 * a docs area and is always shown.
 *
 * Rows come back the moment the first entry in their area is authored. Nothing here is a
 * hand-maintained list of what is ready.
 */
export function visibleDestinations(live: ReadonlySet<string>): Destination[] {
  return destinations.filter(
    (destination) => !destination.areas || destination.areas.some((area) => live.has(area)),
  );
}

/**
 * Clicking Learn does not scroll you to a distant part of one enormous tree — it
 * replaces the tree with Learn's (ADR 0007).
 *
 * The `$id` must change with the destination. The layout memoises the tree on `$id`
 * alone, so a scoped copy inheriting the original id is silently ignored and whichever
 * tree was built on first load stays on screen. This cost a bug once already.
 */
export function scopeToDestination(tree: PageTree.Root, pathname: string): PageTree.Root {
  const destination = destinationFor(pathname);
  const areas = destination.areas ?? [];

  const children = tree.children.filter(
    (child) => child.type === 'folder' && child.index != null && areas.includes(child.index.url),
  );

  return { ...tree, $id: `${tree.$id ?? 'tree'}|${destination.name}`, children };
}

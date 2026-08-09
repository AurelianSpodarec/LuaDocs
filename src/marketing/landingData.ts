import { source } from '@/lib/source';
import { CONTENT_TREE } from '@/content-tree/manifest';

export interface LibraryCard {
  /** Path after `/docs/`, ready for the `/docs/$` splat. */
  splat: string;
  /** The section's own title, as the sidebar writes it — `string`, `table`. */
  title: string;
  description: string;
  /** Authored entries only. Stubs are not something to advertise. */
  entries: number;
}

/**
 * Whether a page has been written, judged from frontmatter alone.
 *
 * The scaffold writes `description: ""` into every stub
 * (`src/content-tree/scaffold.ts`), and an author fills it in, so a non-empty
 * description is the cheapest true signal that somebody has worked on the page.
 *
 * It is a proxy, not the real predicate. The real one asks whether the body is still
 * `PLACEHOLDER`, which means loading and processing every page — affordable in the
 * build step slice 8 owes the sitemap, not on a route loader. When that predicate
 * exists this should call it instead: the failure mode here is an entry whose body is
 * written but whose description is not, which undercounts and never overstates.
 */
function isAuthored(description: string | undefined): boolean {
  return (description ?? '').trim().length > 0;
}

/**
 * The standard-library sections that have something to read, in sidebar order.
 *
 * Derived, never listed. A hand-written array here would be wrong the day a section
 * lands and nobody remembers this file — and the landing page is the one surface where
 * advertising an empty section costs a reader a wasted click on their first visit.
 */
export function libraryCards(): LibraryCard[] {
  const order = CONTENT_TREE.find((area) => area.slug === 'standard-library')?.sections ?? [];

  const cards = new Map<string, LibraryCard>();
  for (const section of order) {
    cards.set(section.slug, {
      splat: `standard-library/${section.slug}`,
      title: section.title,
      description: '',
      entries: 0,
    });
  }

  for (const page of source.getPages()) {
    const [area, section, entry] = page.slugs;
    if (area !== 'standard-library' || !section) continue;

    const card = cards.get(section);
    if (!card) continue;

    // Two slugs is the section overview, three is an entry inside it.
    if (entry === undefined) {
      card.description = page.data.description ?? '';
    } else if (isAuthored(page.data.description)) {
      card.entries++;
    }
  }

  return [...cards.values()].filter((card) => card.entries > 0);
}

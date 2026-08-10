import { existsSync } from 'node:fs';
import { docsRoute } from '@/lib/shared';

/**
 * The file under `content/docs` that serves a docs URL.
 *
 * Fumadocs maps `<dir>/index.mdx` to the directory's own URL, so a section overview and an
 * entry differ only in whether a directory of that name exists — which is why this checks
 * the filesystem rather than pattern-matching the URL.
 */
export function entryFileFor(url: string): string {
  const rel = url.slice(docsRoute.length).replace(/^\//, '');
  if (rel === '') return 'index.mdx';
  return existsSync(`content/docs/${rel}`) ? `${rel}/index.mdx` : `${rel}.mdx`;
}

/**
 * Whether an entry has been written, given its raw MDX source.
 *
 * Derived rather than flagged. The scaffold gives every unwritten entry an empty
 * `description` and a `{@link https://mdxjs.com | MDX} comment` body, and the two agree on
 * all 294 files in the tree — but only the description is *maintained* by authoring, since
 * an entry cannot be written without one. A `draft: true` flag would be a second thing to
 * remember and would go stale the first time someone forgot it, which is the same reason
 * the ROADMAP gives for deriving version badges rather than hand-writing them.
 *
 * The description is also the cheaper of the two to read: it is frontmatter, so a consumer
 * that already holds the page metadata never has to touch the body.
 */
export function isAuthored(source: string): boolean {
  const description = /^description:\s*(.*)$/m.exec(source)?.[1]?.trim() ?? '';
  return description !== '' && description !== '""' && description !== "''";
}

/**
 * The same question, asked of a loaded page rather than of raw source.
 *
 * The sidebar, the search index, the sitemap and both export surfaces all hold page
 * metadata and never see the file, so this is the form four of the five consumers use.
 */
export function isAuthoredPage(page: { data: { description?: string } }): boolean {
  return (page.data.description ?? '').trim() !== '';
}

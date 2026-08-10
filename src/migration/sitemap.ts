import { siteOrigin, blogRoute } from '@/lib/shared';

/**
 * The routes that are not pages in a content collection.
 *
 * `source.getPages()` covers `content/docs` and `blogSource` covers `content/blog`, so
 * without this the homepage, the playground and the blog index are absent — and a sitemap
 * that omits the homepage is a poor first thing to hand a crawler.
 */
export const STANDALONE_URLS = ['/', '/playground', blogRoute] as const;

/**
 * Assemble the sitemap's URL list from the two content collections.
 *
 * Kept free of `@/lib/source` on purpose: that module calls `defineDocs`, a build-time
 * macro the bundler compiles, so anything importing it is unusable from Vitest. The rule
 * lives here and is unit-tested; the wiring lives in the route and is verified against
 * build output by `scripts/check-build-output.ts`.
 */
export function collectSitemapUrls(docsUrls: string[], blogUrls: string[]): string[] {
  return [...STANDALONE_URLS, ...[...docsUrls].sort(), ...[...blogUrls].sort()];
}

export function renderSitemap(urls: string[]): string {
  const entries = urls
    .map((url) => `  <url>\n    <loc>${siteOrigin}${url}</loc>\n  </url>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

import { readFile } from 'node:fs/promises';
import { describe, it, expect } from 'vitest';
import { listContentFiles } from '@/content-tree/scaffold';
import { isAuthored, isAuthoredPage } from '@/migration/authored';
import { collectSitemapUrls, renderSitemap, STANDALONE_URLS } from '@/migration/sitemap';
import { siteOrigin } from '@/lib/shared';

describe('isAuthored', () => {
  it('rejects a scaffolded stub', () => {
    expect(isAuthored('---\ntitle: os.date()\ndescription: ""\n---\n')).toBe(false);
  });

  it('rejects an absent description', () => {
    expect(isAuthored('---\ntitle: os.date()\n---\n')).toBe(false);
  });

  it('accepts an entry with a description', () => {
    expect(isAuthored('---\ntitle: os.date()\ndescription: Format a time.\n---\n')).toBe(true);
  });
});

describe('isAuthoredPage', () => {
  it('agrees with the source form', () => {
    expect(isAuthoredPage({ data: { description: '' } })).toBe(false);
    expect(isAuthoredPage({ data: {} })).toBe(false);
    expect(isAuthoredPage({ data: { description: 'Format a time.' } })).toBe(true);
  });
});

describe('renderSitemap', () => {
  const xml = renderSitemap(['/docs', '/docs/standard-library/string/format']);

  it('is a urlset', () => {
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
  });

  it('writes absolute URLs on the canonical origin', () => {
    expect(xml).toContain(`<loc>${siteOrigin}/docs/standard-library/string/format</loc>`);
  });

  it('lists one entry per URL', () => {
    expect(xml.match(/<url>/g)).toHaveLength(2);
  });
});

describe('collectSitemapUrls', () => {
  it('leads with the homepage', () => {
    expect(collectSitemapUrls([], [])[0]).toBe('/');
  });

  it('carries the non-docs destinations even with no content', () => {
    expect(collectSitemapUrls([], [])).toEqual([...STANDALONE_URLS]);
  });

  it('sorts each collection without interleaving them', () => {
    expect(collectSitemapUrls(['/docs/b', '/docs/a'], ['/blog/z'])).toEqual([
      ...STANDALONE_URLS,
      '/docs/a',
      '/docs/b',
      '/blog/z',
    ]);
  });
});

/**
 * The corpus the sitemap will actually carry, counted from the filesystem.
 *
 * The route reads `source.getPages()`, which comes from a build-time macro Vitest cannot
 * compile — so this counts the same files the loader would, by the same predicate. The
 * wired result is checked against build output by `scripts/check-build-output.ts`.
 */
async function authoredCount(dir: string): Promise<number> {
  const files = await listContentFiles(dir);
  const mdx = files.filter((rel) => rel.endsWith('.mdx'));
  const sources = await Promise.all(mdx.map((rel) => readFile(`${dir}/${rel}`, 'utf8')));
  return sources.filter(isAuthored).length;
}

describe('the authored corpus', () => {
  it('is 183 of the 292 pages under content/docs', async () => {
    // Moves as content lands. Update it deliberately — a drop is a regression in the
    // predicate, not noise. 182 before the Standard Library front door was written.
    expect(await authoredCount('content/docs')).toBe(183);
  });

  it('is both blog posts', async () => {
    expect(await authoredCount('content/blog')).toBe(2);
  });

  it('totals 188 sitemap URLs with the standalone routes', async () => {
    const docs = await authoredCount('content/docs');
    const blog = await authoredCount('content/blog');
    expect(docs + blog + STANDALONE_URLS.length).toBe(188);
  });
});

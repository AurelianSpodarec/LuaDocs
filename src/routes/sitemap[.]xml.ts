import { createFileRoute } from '@tanstack/react-router';
import { source } from '@/lib/source';
import { blogSource } from '@/blog/source';
import { isAuthoredPage } from '@/migration/authored';
import { collectSitemapUrls, renderSitemap } from '@/migration/sitemap';

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET() {
        // Unwritten entries are excluded by the same fact that hides them from the
        // sidebar: they have nothing to read. Submitting 110 near-empty pages is the
        // fastest way to get a young site classified as thin. See ADR 0012.
        const docs = source.getPages().filter(isAuthoredPage).map((page) => page.url);
        const posts = blogSource.getPages().filter(isAuthoredPage).map((page) => page.url);

        return new Response(renderSitemap(collectSitemapUrls(docs, posts)), {
          headers: { 'Content-Type': 'application/xml' },
        });
      },
    },
  },
});

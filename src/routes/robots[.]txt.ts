import { createFileRoute } from '@tanstack/react-router';
import { siteOrigin } from '@/lib/shared';

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET() {
        // Nothing is disallowed: the site is static, public, and has no private surface.
        // The one thing kept out of the index is unwritten entries, and that is done with
        // `noindex` on the page itself rather than here — a `Disallow` would stop the
        // crawler reading the tag it needs to obey.
        return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${siteOrigin}/sitemap.xml\n`, {
          headers: { 'Content-Type': 'text/plain' },
        });
      },
    },
  },
});

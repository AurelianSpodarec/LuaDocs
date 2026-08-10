import { createFileRoute } from '@tanstack/react-router';
import { source, getLLMText } from '@/lib/source';
import { isAuthoredPage } from '@/migration/authored';

export const Route = createFileRoute('/llms-full.txt')({
  server: {
    handlers: {
      GET: async () => {
        // Authored entries only — the same predicate that hides the other 110 from the
        // sidebar, the search index and the sitemap (ADR 0012). A model asking this file
        // what Lua does is not served by 110 entries that say nothing.
        const scan = source.getPages().filter(isAuthoredPage).map(getLLMText);
        const scanned = await Promise.all(scan);
        return new Response(scanned.join('\n\n'), {
          headers: { 'Content-Type': 'text/plain' },
        });
      },
    },
  },
});

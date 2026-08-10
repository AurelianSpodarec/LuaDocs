import { createFileRoute } from '@tanstack/react-router';
import { source } from '@/lib/source';
import { isAuthoredPage } from '@/migration/authored';
import { createFromSource } from 'fumadocs-core/search/server';

/**
 * The loader, less the entries nobody has written.
 *
 * `createFromSource` indexes whatever `getPages()` returns, so unfiltered it puts all 110
 * scaffolded stubs in the index — searching `while` would return a page with no body.
 * Same predicate as the sidebar, the sitemap and the export surfaces (ADR 0012).
 */
const authoredSource = {
  ...source,
  getPages: (locale?: string) => source.getPages(locale).filter(isAuthoredPage),
};

const server = createFromSource(authoredSource, {
  // https://docs.orama.com/docs/orama-js/supported-languages
  language: 'english',
});

export const Route = createFileRoute('/api/search')({
  server: {
    handlers: {
      GET: () => server.staticGET(),
    },
  },
});

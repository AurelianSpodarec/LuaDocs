import { source } from '@/lib/source';
import { createFileRoute } from '@tanstack/react-router';
import { isAuthoredPage } from '@/migration/authored';
import { llms } from 'fumadocs-core/source';

/** The loader, less the entries nobody has written. Same predicate as everywhere else. */
const authoredSource = {
  ...source,
  getPages: (locale?: string) => source.getPages(locale).filter(isAuthoredPage),
};

export const Route = createFileRoute('/llms.txt')({
  server: {
    handlers: {
      GET() {
        return new Response(llms(authoredSource).index(), {
          headers: { 'Content-Type': 'text/plain' },
        });
      },
    },
  },
});

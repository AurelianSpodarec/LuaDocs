import { loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { pageSchema } from 'fumadocs-core/source/schema';
import { defineDocs } from 'fumadocs-mdx/macro';
import { z } from 'zod';
import { docsRoute } from './shared';
import { exportHeader, resolveExportText } from './exportText';
import { DEFAULT_VERSION } from '@/compat/schema';

// `defineDocs` is a build-time macro, so its arguments must be statically
// analyzable — the schema has to be written inline rather than imported.
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    async: true,
    // Derived from git rather than authored. A hand-written date is wrong the moment
    // someone edits the page and forgets it, which is exactly when a reader is most
    // entitled to distrust it.
    lastModified: true,
    schema: pageSchema.extend({
      /** Key into the compat dataset — the entry's single source of version facts. */
      'lua-compat': z.string().optional(),
      /**
       * Which reference template the entry follows (see docs/research/page-structure.md).
       * Kept in sync with ENTRY_TYPES in src/content-tree/manifest.ts by a test —
       * `defineDocs` is a macro, so this list cannot be imported.
       */
      'entry-type': z
        .enum(['function', 'construct', 'constant', 'overview', 'guide'])
        .optional(),
      /** Attribution link to the manual passage this entry is a rewrite of. */
      source: z.url().optional(),
      /**
       * The date a person read this entry, `YYYY-MM-DD`. Absent means nobody has.
       *
       * Every entry is written against the reference manual, reviewed, and has its
       * examples executed on each build — none of which is a person having read it. The
       * two are worth telling apart, and only the reader can decide what that is worth.
       */
      reviewed: z.iso.date().optional(),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
});

export const source = loader({
  source: docs.toFumadocsSource(),
  baseUrl: docsRoute,
  plugins: [lucideIconsPlugin()],
});

/**
 * An entry as text, for `llms.txt`, `llms-full.txt` and the `.md` route.
 *
 * The processed markdown is passed through `resolveExportText` rather than served raw.
 * Raw, it carries both halves of every `<Only>` pair adjacent and unlabelled — so an
 * entry states a version-specific fact and then states its opposite — and it carries every
 * example as an entity-escaped JSX attribute. See `src/lib/exportText.ts`.
 */
export async function getLLMText(page: (typeof source)['$inferPage']) {
  const header = exportHeader(page.data.title, page.url, DEFAULT_VERSION);

  // An unwritten entry has no body to resolve. Say so, and point at the manual passage
  // the scaffold already recorded, rather than exporting a `Not yet written` comment.
  if ((page.data.description ?? '').trim() === '') {
    const manual = page.data.source ? `\n\nThe reference manual documents it at ${page.data.source}.` : '';
    return `# ${page.data.title} (${page.url})\n\nThis entry has not been written yet.${manual}`;
  }

  const processed = await page.data.getText('processed');

  return `${header}\n\n${resolveExportText(processed, DEFAULT_VERSION)}`;
}

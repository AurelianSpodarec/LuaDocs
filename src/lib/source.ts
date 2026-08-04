import { loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { pageSchema } from 'fumadocs-core/source/schema';
import { defineDocs } from 'fumadocs-mdx/macro';
import { z } from 'zod';
import { docsRoute } from './shared';

// `defineDocs` is a build-time macro, so its arguments must be statically
// analyzable — the schema has to be written inline rather than imported.
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    async: true,
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

export async function getLLMText(page: (typeof source)['$inferPage']) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title} (${page.url})

${processed}`;
}

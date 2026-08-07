import { loader } from 'fumadocs-core/source';
import { pageSchema } from 'fumadocs-core/source/schema';
import { defineCollections } from 'fumadocs-mdx/macro';
import { z } from 'zod';
import { blogRoute } from '@/lib/shared';

/**
 * The blog's own collection, separate from the `defineDocs` call in `src/lib/source.ts`.
 *
 * Kept eager — no `async: true` — unlike the docs collection. That one is 292 entries
 * and has to load bodies on demand, which is why its route has to `preload()` before
 * rendering. This is a handful of posts, so the compiled body is simply there. Revisit
 * if the blog passes roughly thirty posts.
 *
 * `defineCollections` is a build-time macro, so its arguments must be statically
 * analyzable — the schema is written inline rather than imported, exactly as the docs
 * collection does.
 */
export const blog = defineCollections({
  type: 'doc',
  dir: 'content/blog',
  schema: pageSchema.extend({
    /** Publication date, `YYYY-MM-DD`. Required — an undated post cannot be ordered. */
    date: z.iso.date(),
    author: z.string().optional(),
  }),
});

export const blogSource = loader({
  source: blog.toFumadocsSource(),
  baseUrl: blogRoute,
});

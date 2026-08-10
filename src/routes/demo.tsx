import { createFileRoute } from '@tanstack/react-router';
import { EntryBodyDemo } from '@/demo/EntryBodyDemo';

/**
 * `/demo` — the internal proving surface. Not a reader-facing page.
 *
 * It exists so a proposal about how entries render can be *looked at* before 292 of them
 * are rewritten to match it. The alternative is judging a rendering change from an MDX
 * diff, which is how the parameter lists reached three spellings of "format string" in the
 * first place.
 *
 * Kept out of the index three ways, because one is not enough: `noindex` here, absence from
 * `STANDALONE_URLS` in `src/migration/sitemap.ts`, and no link to it from any page in the
 * site. `robots.txt` deliberately does *not* disallow it — a `Disallow` would stop a crawler
 * reading the `noindex` it needs to obey, which is the same reasoning unwritten entries use.
 *
 * It ships to production. Excluding it from the build would mean it is only ever seen on a
 * machine that already has the branch checked out, and the point of a page like this is to
 * be sent to someone as a link.
 */
export const Route = createFileRoute('/demo')({
  component: EntryBodyDemo,
  head: () => ({
    meta: [
      { title: 'Entry body demo — LuaDocs internal' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
});

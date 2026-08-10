import { createFileRoute } from '@tanstack/react-router';
import { DemoIndex } from '@/demo/Shell';
import { demoHead } from '@/demo/head';

/**
 * `/demo` — the internal proving surface, per ADR 0015.
 *
 * It exists so a decision about rendered output can be *looked at* before content is
 * rewritten to match it. Every refinement in `docs/research/page-structure.md` came from
 * building a page rather than from deciding in prose, and the surface that produced them
 * (`prototype/`) was deleted — so the lesson was learned twice and lost once.
 *
 * Kept out of the index three ways, because one is not enough: `noindex` on every page here
 * (`demoHead`), absence from `STANDALONE_URLS` in `src/migration/sitemap.ts`, and no link to
 * it from anywhere in the site. `robots.txt` deliberately does *not* disallow it — a
 * `Disallow` would stop a crawler reading the `noindex` it needs to obey, which is the same
 * reasoning unwritten entries use.
 */
export const Route = createFileRoute('/demo/')({
  component: DemoIndex,
  head: () => demoHead('Proving surface'),
});

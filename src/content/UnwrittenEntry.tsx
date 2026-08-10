import { DocsBody, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/notebook/page';
import { entryTitleClass } from '@/entry/pageToc';

/**
 * What an entry nobody has written yet says for itself.
 *
 * 110 of the 292 pages under `content/docs` are scaffolded stubs. They are hidden from
 * the sidebar, the search index, the sitemap and both export surfaces, and they carry
 * `noindex` — but a reader can still arrive on one, from a `## See also` link, an old
 * bookmark, or a search result crawled before the tag landed. Before this, that reader
 * got a title over an empty page.
 *
 * Not prerendering them at all was the alternative. It was refused for two reasons: the
 * standard-library entries cross-link heavily into not-yet-written targets, so 404ing them
 * would turn every one of those links into a hard error belonging to a future content
 * slice rather than to this one; and it throws away the one useful thing the stub already
 * holds.
 *
 * Because every stub carries a `source:` field pointing at the exact manual anchor, this
 * page can send the reader somewhere that actually answers them. That is worth more than
 * an apology, and it is why the link is the point of the page rather than a footnote on
 * it.
 */
export function UnwrittenEntry({ title, sourceUrl }: { title: string; sourceUrl: string | null }) {
  return (
    <DocsPage footer={{ enabled: false }} breadcrumb={{ enabled: false }} toc={[]}>
      <DocsTitle className={entryTitleClass}>{title}</DocsTitle>
      <DocsBody>
        <p>
          This entry has not been written yet. LuaDocs is being written one section at a
          time, and the standard library came first.
        </p>
        {sourceUrl ? (
          <p>
            In the meantime, the official reference manual documents it:{' '}
            <a href={sourceUrl} target="_blank" rel="noreferrer noopener">
              {sourceUrl}
            </a>
          </p>
        ) : null}
      </DocsBody>
    </DocsPage>
  );
}

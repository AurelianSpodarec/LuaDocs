import { gitConfig } from '@/lib/shared';

/**
 * When the entry's file last changed, taken from git at build time.
 *
 * Not a frontmatter field: an authored date is wrong from the moment someone edits the
 * page and forgets to touch it, which is precisely when a reader is most entitled to
 * distrust it. Git cannot forget.
 *
 * It answers a different question from the review status above it — *how old* rather
 * than *how vetted* — and a reader weighing a page usually wants both. A recent date on
 * an unreviewed page and an old date on a reviewed one mean quite different things.
 *
 * **The date links to the file's history when it can.** MDN's equivalent line names an
 * actor — "by MDN contributors" — which is warmer than ours and tells a reader nothing
 * checkable. Since this date is derived from git rather than authored, the commits
 * behind it are a real page a reader can open, and *what changed* is the question the
 * date actually raises. An unverifiable byline is the weaker half of that trade.
 */
export function LastUpdated({ at, path }: { at?: Date | string | null; path?: string }) {
  if (!at) return null;

  const date = at instanceof Date ? at : new Date(at);
  if (Number.isNaN(date.getTime())) return null;

  const history = path
    ? `https://github.com/${gitConfig.user}/${gitConfig.repo}/commits/${gitConfig.branch}/content/docs/${path}`
    : null;

  const stamp = (
    <time dateTime={date.toISOString()}>
      {/*
        Spelled out, as MDN spells it: `03/08/2026` is two different days
        depending on which side of the Atlantic reads it, and a stamp whose whole
        job is to say how old a page is cannot afford to be ambiguous about it.
        The month name costs a few characters and removes the question.

        Not the ordinal form — `Intl` will not produce "6th", so it would mean
        carrying a suffix table for a line of metadata.
      */}
      {date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      })}
    </time>
  );

  return (
    <p data-last-updated={date.toISOString().slice(0, 10)} className="text-fd-muted-foreground">
      Last updated on{' '}
      {history ? (
        <a
          href={history}
          target="_blank"
          rel="noreferrer noopener"
          className="underline decoration-fd-muted-foreground/40 underline-offset-2 hover:text-fd-primary"
        >
          {stamp}
        </a>
      ) : (
        stamp
      )}
      .
    </p>
  );
}

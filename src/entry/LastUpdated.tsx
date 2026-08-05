/**
 * When the entry's file last changed, taken from git at build time.
 *
 * Not a frontmatter field: an authored date is wrong from the moment someone edits the
 * page and forgets to touch it, which is precisely when a reader is most entitled to
 * distrust it. Git cannot forget.
 *
 * It answers a different question from the review status beside it — *how old* rather
 * than *how vetted* — and a reader weighing a page usually wants both. A recent date on
 * an unreviewed page and an old date on a reviewed one mean quite different things.
 */
export function LastUpdated({ at }: { at?: Date | string | null }) {
  if (!at) return null;

  const date = at instanceof Date ? at : new Date(at);
  if (Number.isNaN(date.getTime())) return null;

  return (
    <p data-last-updated={date.toISOString().slice(0, 10)} className="ms-auto text-sm text-fd-muted-foreground">
      Last updated on{' '}
      <time dateTime={date.toISOString()}>
        {date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          timeZone: 'UTC',
        })}
      </time>
    </p>
  );
}

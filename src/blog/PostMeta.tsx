import { formatPostDate } from './posts';

/**
 * The dateline, shared by the index and the post page so the two cannot drift.
 *
 * The `<time dateTime>` carries the raw `YYYY-MM-DD` alongside the spelled-out form:
 * the person reading needs the month named, and anything parsing the page needs the
 * unambiguous original.
 */
export function PostMeta({ date, author }: { date: string; author?: string }) {
  return (
    <p className="text-sm text-fd-muted-foreground">
      <time dateTime={date}>{formatPostDate(date)}</time>
      {author ? ` · ${author}` : null}
    </p>
  );
}

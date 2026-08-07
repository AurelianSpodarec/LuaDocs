/**
 * Pure helpers for the blog, with no `fumadocs-mdx` macro in sight.
 *
 * `vitest.config.ts` does not load the `fumadocsMdx()` plugin, so a module that calls
 * `defineCollections` cannot be imported from a test. Keeping ordering and formatting
 * here is what makes them testable at all — `src/blog/source.ts` next door is the part
 * only the routes can import.
 */
export interface PostFrontmatter {
  title: string;
  description?: string;
  /** Publication date, `YYYY-MM-DD`. Authored, not derived from git — see below. */
  date: string;
  author?: string;
}

/**
 * Newest first.
 *
 * `YYYY-MM-DD` sorts correctly as a string, so no `Date` is constructed: parsing a bare
 * date string is timezone-dependent in ways that can reorder two posts a day apart
 * depending on where the build runs.
 *
 * Same-day posts fall back to title, because a stable order matters more than which of
 * the two wins — an unstable sort would reshuffle the index between builds.
 */
export function sortPostsByDate<T extends { date: string; title: string }>(posts: T[]): T[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}

/**
 * The index, grouped into years, newest first.
 *
 * Year headings are what let the index stay one page as the archive grows: they give an
 * unfamiliar reader somewhere to stop, without hiding posts behind pagination that costs
 * a click and keeps them out of a crawler's reach.
 *
 * The year is sliced off the ISO string rather than read from a `Date`, for the same
 * timezone reason `sortPostsByDate` avoids one — near midnight on 31 December a parsed
 * date can land in the wrong year.
 */
export function groupPostsByYear<T extends { date: string; title: string }>(
  posts: T[],
): { year: string; posts: T[] }[] {
  const groups: { year: string; posts: T[] }[] = [];

  for (const post of sortPostsByDate(posts)) {
    const year = post.date.slice(0, 4);
    const current = groups.at(-1);

    if (current?.year === year) current.posts.push(post);
    else groups.push({ year, posts: [post] });
  }

  return groups;
}

/**
 * `7 August 2026`. Matches how `LastUpdated` renders a date, and for the same reason:
 * `03/08/2026` is two different days depending on which side of the Atlantic reads it.
 *
 * **A post's date is authored frontmatter, where an entry's is derived from git.**
 * `src/entry/LastUpdated.tsx` refuses an authored date because "last updated" rots the
 * moment somebody edits a page and forgets to touch it. Publication is a different fact:
 * it describes when the post went out, not when the file last moved, and it must *not*
 * change when a typo is fixed. Git would be actively wrong here.
 */
export function formatPostDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

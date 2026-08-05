import { CircleCheck, CircleDashed } from 'lucide-react';
import { gitConfig } from '@/lib/shared';

/** `2026-08-05` → `5 August 2026`. Parsed as UTC so the date cannot slip a day. */
function readable(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

const linkClass =
  'underline decoration-fd-muted-foreground/40 underline-offset-2 hover:text-fd-primary';

/**
 * Whether a person has read this entry, said plainly at the foot of it, with the two
 * ways to act on the answer.
 *
 * Every entry here is written from the Lua reference manual, reviewed, and has its
 * examples executed on every build. None of that is a person having read it, and a
 * reader deciding how far to trust a page deserves to know which of the two they are
 * looking at. Claiming "reviewed" without qualification would be the dishonest option;
 * saying nothing leaves the reader to assume the better one.
 *
 * The unreviewed wording names a stage rather than a deficiency — "awaiting" rather than
 * "not checked" — because on a site where every page starts here, a warning on every page
 * is noise a reader learns to skip, and what it says is true of the process, not a fault
 * in the entry.
 *
 * The label carries the honesty on its own, so the sentence after it says what *has* been
 * done rather than restating what has not. Spelling out the absence twice was what made
 * an accurate line read as an apology.
 *
 * The links are the other half. An unchecked page is worth more when the reader who
 * spots the problem can fix it or report it without leaving the page they found it on.
 */
export function ReviewStatus({ date, path }: { date?: string | null; path: string }) {
  const repo = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;
  const file = `content/docs/${path}`;

  const editUrl = `${repo}/edit/${gitConfig.branch}/${file}`;
  const issueUrl =
    `${repo}/issues/new?` +
    new URLSearchParams({
      title: `Problem in ${path}`,
      body: `**Entry:** \`${file}\`\n\n**What is wrong:**\n\n`,
    }).toString();

  const checked = Boolean(date);
  const Icon = checked ? CircleCheck : CircleDashed;

  return (
    <div data-reviewed={checked ? 'yes' : 'no'} className="not-prose mt-3 text-sm">
      <p className="flex items-start gap-2 text-fd-muted-foreground">
        <Icon
          aria-hidden
          className={`mt-0.5 size-4 shrink-0 ${
            checked ? 'text-emerald-600 dark:text-emerald-400' : 'text-fd-muted-foreground/70'
          }`}
        />
        <span>
          <strong className="text-fd-foreground">
            {checked ? 'Human reviewed' : 'Awaiting human review'}
          </strong>
          {' — '}
          {checked ? (
            <>a person read this entry on {readable(date as string)}.</>
          ) : (
            <>checked against the reference manual, and by running every example.</>
          )}{' '}
          <a href={editUrl} target="_blank" rel="noreferrer noopener" className={linkClass}>
            Improve this page
          </a>{' '}
          or{' '}
          <a href={issueUrl} target="_blank" rel="noreferrer noopener" className={linkClass}>
            report a problem
          </a>
          .
        </span>
      </p>
    </div>
  );
}

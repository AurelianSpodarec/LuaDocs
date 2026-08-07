import { CircleCheck, CircleDashed } from 'lucide-react';

/** `2026-08-05` → `5 August 2026`. Parsed as UTC so the date cannot slip a day. */
function readable(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * Whether a person has read this entry, said plainly at the foot of it.
 *
 * Every entry here is written from the Lua reference manual, reviewed, and has its
 * examples executed on every build. None of that is a person having read it, and a
 * reader deciding how far to trust a page deserves to know which of the two they are
 * looking at. Claiming "reviewed" without qualification would be the dishonest option;
 * saying nothing leaves the reader to assume the better one.
 *
 * This is the one thing on the page MDN's equivalent panel does not say at all, and on
 * a reference written the way this one is, it is the most load-bearing sentence at the
 * foot of an entry. It leads the panel for that reason (ADR 0011).
 *
 * The unreviewed wording names a stage rather than a deficiency — "awaiting" rather than
 * "not checked" — because on a site where every page starts here, a warning on every page
 * is noise a reader learns to skip, and what it says is true of the process, not a fault
 * in the entry.
 *
 * The label says "Reviewed", not "Human reviewed". Who did the reading is carried by the
 * sentence, which names a person and a date; putting it in the badge foregrounds a
 * human-versus-machine contrast the reader did not come here for.
 *
 * The label carries the honesty on its own, so the sentence after it says what *has* been
 * done rather than restating what has not. Spelling out the absence twice was what made
 * an accurate line read as an apology.
 *
 * **The two contribution links used to end this sentence and now sit below it.** Their
 * reasoning is unchanged — an unchecked page is worth more when the reader who spots
 * the problem can act without leaving it — but appending them made one sentence do
 * three jobs, so the ask arrived as a subordinate clause of a status report.
 * `EntryProvenance` gives them their own line, one tier down.
 */
export function ReviewStatus({ date }: { date?: string | null }) {
  const checked = Boolean(date);
  const Icon = checked ? CircleCheck : CircleDashed;

  return (
    <p
      data-reviewed={checked ? 'yes' : 'no'}
      className="flex items-start gap-2 text-fd-muted-foreground"
    >
      <Icon
        aria-hidden
        className={`mt-0.5 size-4 shrink-0 ${
          checked ? 'text-emerald-600 dark:text-emerald-400' : 'text-fd-muted-foreground/70'
        }`}
      />
      <span>
        <strong className="text-fd-foreground">{checked ? 'Reviewed' : 'Awaiting review'}</strong>
        {' — '}
        {checked ? (
          <>a person read this entry on {readable(date as string)}.</>
        ) : (
          <>checked against the reference manual, and by running every example.</>
        )}
      </span>
    </p>
  );
}

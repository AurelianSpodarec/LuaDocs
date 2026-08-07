import { ExternalLink } from 'lucide-react';
import { gitConfig } from '@/lib/shared';
import { ReviewStatus } from './ReviewStatus';
import { LastUpdated } from './LastUpdated';

const linkClass =
  'inline-flex items-center gap-1 underline decoration-fd-muted-foreground/40 underline-offset-2 hover:text-fd-primary';

/**
 * The panel at the very foot of an entry: how vetted, how old, and how to fix it
 * (ADR 0011).
 *
 * Modelled on MDN's "Help improve MDN" box, with its three jobs pulled apart first.
 * MDN's border is earned by an interactive survey widget; ours is not building one
 * ([ADR 0004](../../docs/adr/0004-self-hosted-on-github-no-third-parties.md) parked the
 * sentiment metric), so the border has to be earned by something else, and it is: with
 * previous/next gone the page had no terminal anchor and simply stopped on a grey line.
 * A panel ends a page without inventing a sequence to do it.
 *
 * **It is deliberately not a `## ` section and is not in the right rail.** The `Source`
 * citation above it is a fact about the subject matter — this entry documents that
 * passage of that manual — and is a licensing obligation
 * ([ADR 0003](../../docs/adr/0003-dual-license-prose-and-code.md)), so it stays an
 * addressable section. What is in here is a fact about this site's *copy*: who has
 * checked it, when it last moved, where to complain. MDN draws the same line, keeping
 * Specifications as a section and leaving the box outside the article's contents.
 *
 * **Two tiers, because the old single sentence did three jobs.** Status led, and the
 * two calls to action arrived as a trailing clause of it — "…and by running every
 * example. Improve this page or report a problem." — which is the sentence equivalent
 * of hiding a button. Status is what a reader needs first; the ask gets its own line.
 */
export function EntryProvenance({
  reviewed,
  path,
  lastModified,
}: {
  reviewed?: string | null;
  path: string;
  lastModified?: Date | string | null;
}) {
  const repo = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;
  const file = `content/docs/${path}`;

  const editUrl = `${repo}/edit/${gitConfig.branch}/${file}`;
  const issueUrl =
    `${repo}/issues/new?` +
    new URLSearchParams({
      title: `Problem in ${path}`,
      body: `**Entry:** \`${file}\`\n\n**What is wrong:**\n\n`,
    }).toString();

  return (
    <section
      aria-label="About this page"
      className="not-prose mt-8 rounded-xl border bg-fd-card p-4 text-sm"
    >
      <ReviewStatus date={reviewed} />
      {/* Indented to the status text's column rather than the icon's, so the tiers
          read as one block. `ps-6` is the icon's `size-4` plus the `gap-2` beside it. */}
      <div className="mt-4 space-y-1 ps-6">
        <LastUpdated at={lastModified} path={path} />
        <p className="flex flex-wrap items-center gap-x-2 text-fd-muted-foreground">
          <a href={editUrl} target="_blank" rel="noreferrer noopener" className={linkClass}>
            Improve this page
            <ExternalLink aria-hidden className="size-3" />
          </a>
          {/* MDN's separator. A middot rather than "or", because these are two
              equivalent exits, not a choice the sentence is asking the reader to make. */}
          <span aria-hidden className="text-fd-muted-foreground/50">
            ·
          </span>
          <a href={issueUrl} target="_blank" rel="noreferrer noopener" className={linkClass}>
            Report a problem
            <ExternalLink aria-hidden className="size-3" />
          </a>
        </p>
      </div>
    </section>
  );
}

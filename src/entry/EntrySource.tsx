import { citationFor, parseManualUrl } from './manualSource';
import { sectionHeadingClass } from './pageToc';

/**
 * The attribution line at the foot of an entry (ADR 0003).
 *
 * No verb. Under a heading that already reads "Source", naming the passage says
 * everything the line needs to: this is where the entry came from. "Rewritten from"
 * asserted a transformation of the manual's text — a stronger claim than the process
 * supports, and one review has repeatedly flagged phrase-level residue against. A
 * citation should say where, not argue about how. `LICENSE` carries the manual's own
 * copyright and licence notice; this line carries the reference.
 *
 * It names the manual version deliberately. Section numbers are not stable across
 * versions: 5.5 added §6.1 and pushed String Manipulation from §6.4 to §6.5, so
 * "§6.5.1" is only true of the manual it was read from.
 */
export function EntrySource({ url }: { url: string }) {
  const ref = parseManualUrl(url);
  if (!ref) return null;

  return (
    <section id="source" className="not-prose mt-12 border-t pt-6">
      <h2 className={sectionHeadingClass}>Source</h2>
      {/*
        One link over the whole citation, because it is one destination: `url` already
        carries the anchor, so the manual name and the passage name point at the same
        place. Splitting them made the generic half clickable and left the specific
        half — the part a reader is actually reaching for — as dead text beside it.

        "The" and the full stop stay outside. They are sentence, not citation, and a
        link that swallows its own punctuation reads as a typo.
      */}
      <p className="text-sm text-fd-muted-foreground">
        The{' '}
        <a
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          className="underline decoration-fd-muted-foreground/40 underline-offset-2 hover:text-fd-primary"
        >
          Lua {ref.version} reference manual
          {' — '}
          <span className="font-mono text-xs">{citationFor(ref.anchor)}</span>
        </a>
        .
      </p>
    </section>
  );
}

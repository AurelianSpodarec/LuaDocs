import { citationFor, parseManualUrl } from './manualSource';
import { sectionHeadingClass } from './pageToc';

/**
 * The attribution line at the foot of an entry (ADR 0003).
 *
 * "Written from", not "rewritten from". The entry is the site's own prose, worked out
 * from the passage named — but "rewritten" asserts a transformation of the manual's
 * text, which is a stronger claim than the process makes and than review has confirmed
 * on every entry. `LICENSE` carries the manual's own notice; this line carries the
 * citation.
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
      <p className="text-sm text-fd-muted-foreground">
        Written from the{' '}
        <a
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          className="underline decoration-fd-muted-foreground/40 underline-offset-2 hover:text-fd-primary"
        >
          Lua {ref.version} reference manual
        </a>
        {' — '}
        <span className="font-mono text-xs">{citationFor(ref.anchor)}</span>.
      </p>
    </section>
  );
}

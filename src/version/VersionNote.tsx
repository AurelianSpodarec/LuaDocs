import { changeNoteFor, isAvailable, unavailableIn, type Unavailable } from '@/compat/resolve';
import type { CompatNode, LuaVersion } from '@/compat/schema';
import { Callout } from '@/entry/Callout';
import { renderChangeNote } from './changeNote';
import { useSelectedVersion } from './SelectedVersionProvider';

/**
 * The two inline deltas are split because they are not the same kind of fact.
 *
 * A change note *qualifies* the entry: everything below it still applies, with one
 * detail different. "Not in Lua 5.1" *invalidates* it — the syntax, the parameters, the
 * examples and the gotchas below all describe something the reader cannot call. So the
 * first belongs beside the version strip it elaborates, and the second belongs above
 * everything, before the reader has invested in reading.
 *
 * `data-note` is what `tests/e2e/string-format.test.tsx` queries; both keep theirs.
 */

/**
 * What the callout says after "Not in Lua X" — one sentence per shape of absence.
 *
 * The single branch this replaced ended every one of them with "Everything below
 * describes it as it exists from then on", which is true only of an entry the reader is
 * *early* for. On a removed one it promised a present tense the symbol does not have,
 * and the removal itself went unmentioned — the matrix at the foot of the page carried
 * it alone, as rows of "Not available" with no "removed in" anywhere.
 *
 * Every version named here comes from the dataset (ADR 0009).
 */
export function unavailableText(reason: Unavailable): string {
  switch (reason.kind) {
    case 'never':
      return 'Not part of any documented Lua version.';
    case 'not-yet':
      return `Introduced in Lua ${reason.addedIn}. Everything below describes it as it exists from then on.`;
    case 'removed':
      return `Introduced in Lua ${reason.addedIn} and removed in Lua ${reason.removedIn}. Everything below describes it as it was, up to Lua ${reason.lastAvailable}.`;
    case 'restored':
      return `Introduced in Lua ${reason.addedIn}, removed in Lua ${reason.removedIn}, and back in Lua ${reason.restoredIn}. Everything below describes it as it exists there.`;
  }
}

/**
 * The version the prose below is actually written about — the callout's own promise,
 * as a value.
 *
 * Each sentence in `unavailableText` ends by naming what the body describes, and this
 * returns exactly that version, which is what makes the two impossible to drift apart:
 * "as it exists from then on" is `addedIn`, "as it was, up to Lua X" is `lastAvailable`,
 * and "as it exists there" is `restoredIn`. A symbol no version documents has no such
 * version, and gets no offer.
 *
 * **`restored` resolves forward, not back.** A reader in the gap could be sent either
 * way, and the body settles it: it is written about the version the symbol came back in,
 * so sending them to `lastAvailable` would hand them prose describing a different one.
 */
export function targetVersion(reason: Unavailable): LuaVersion | null {
  switch (reason.kind) {
    case 'never':
      return null;
    case 'not-yet':
      return reason.addedIn;
    case 'removed':
      return reason.lastAvailable;
    case 'restored':
      return reason.restoredIn;
  }
}

/** Renders only when the entry does not exist in the selected version. */
export function VersionUnavailable({ node }: { node: CompatNode }) {
  const { version, setVersion } = useSelectedVersion();
  const reason = unavailableIn(node, version);
  if (!reason) return null;

  const target = targetVersion(reason);

  return (
    /* Sticky, not merely first. Moving it to the top only helps a reader who has not
       scrolled — and an entry a reader cannot use is a fact that stays true all the way
       down, past the syntax, the parameters and every example. Pinned under the header,
       it cannot be read once and left behind.
       `bg-fd-background` is load-bearing: a translucent callout would let the entry
       scroll visibly through the thing contradicting it. */
    <div className="sticky top-(--fd-header-height) z-10 -mx-1 bg-fd-background px-1">
      <Callout kind="unavailable">
        <span data-note="unavailable">
          {/* Subject-free on purpose. Building the sentence from the entry's title read
              "Format strings for pack and unpack was introduced in Lua 5.3" — the verb
              cannot agree with a title it does not know the number of, and the title is
              directly above the callout anyway. */}
          <strong>Not in Lua {version}.</strong> {unavailableText(reason)}
        </span>
        {/* The way out, next to the sentence that creates the need for one.
            A reader arriving here from a search engine is on the wrong version by
            accident, and everything they came for is one click away behind a control
            in the header they have no reason to have noticed.

            A button rather than linkified version names: the sentence names the
            version the symbol *left* as well as the one it works in — "removed in Lua
            5.2" — so making version names clickable would offer the one place worth
            not going. And an explicit label states the destination, which
            "5.1" inside a sentence does not.

            The support strip above is deliberately not clickable for the mirror-image
            reason: only its available chips could lead anywhere useful, and five
            identical pills where one is a control is worse than none. */}
        {target && (
          <button
            type="button"
            onClick={() => setVersion(target)}
            className="mt-2 inline-flex items-center rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-700 transition-colors hover:bg-amber-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring dark:text-amber-300"
          >
            View as Lua {target}
          </button>
        )}
      </Callout>
    </div>
  );
}

/** Renders only when the entry exists here but behaves differently. */
export function VersionChangeNote({ node }: { node: CompatNode }) {
  const { version } = useSelectedVersion();
  if (!isAvailable(node, version)) return null;

  const note = changeNoteFor(node, version);
  if (!note) return null;

  return (
    <Callout kind="changed">
      <span data-note="changed">
        <strong>Changed in Lua {version}:</strong> {renderChangeNote(note)}
      </span>
    </Callout>
  );
}

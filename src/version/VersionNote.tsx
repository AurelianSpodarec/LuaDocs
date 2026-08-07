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
 * The bold opening. Normally the reader's own version, since that is the fact that
 * brought the callout on screen.
 *
 * `never` is the exception: "Not in Lua 5.5. Not part of any documented Lua version."
 * says the second thing twice, the first being a special case of it. There is no
 * selected version worth naming for a symbol no version has.
 */
export function unavailableLead(reason: Unavailable, version: LuaVersion): string {
  return reason.kind === 'never'
    ? 'Not part of any documented Lua version.'
    : `Not in Lua ${version}.`;
}

/**
 * The version the prose below is actually written about.
 *
 * **`restored` resolves forward, not back.** A reader in the gap could be pointed either
 * way, and the body settles it: it is written about the version the symbol came back in,
 * so naming `lastAvailable` would advertise prose describing a different one.
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

/** Why that version is the one the body describes — the clause after the comma. */
const because: Record<Unavailable['kind'], string> = {
  never: '',
  'not-yet': 'where it was introduced',
  removed: 'the last version that had it',
  restored: 'where it returns after a gap',
};

/**
 * What follows the lead — one sentence, naming the version the prose below is written
 * about and why it is that one. Empty for `never`, where the lead has said everything.
 *
 * **It states where the entry *is*, not its whole history.** The version this replaced
 * read "Introduced in Lua 5.1 and removed in Lua 5.2. Everything below describes it as
 * it was, up to Lua 5.1" — four version numbers carrying two facts, with the reader's
 * own version repeated from the lead and the target named twice. All of that history is
 * one row below in the support strip, in colour and clickable, and again in the matrix
 * at the foot. The callout's job is not to restate it but to say which version the words
 * underneath belong to.
 *
 * "The last version that had it" is what now carries the removal, and it carries it
 * where a reader can use it — attached to the version they should be reading instead,
 * rather than as a date in a history they did not ask for.
 *
 * Built from `targetVersion` rather than from the reason's own fields, so the sentence
 * cannot name one version while anything else derived from it names another.
 *
 * Every version named here comes from the dataset (ADR 0009).
 */
export function unavailableText(reason: Unavailable): string {
  const target = targetVersion(reason);
  return target ? `Everything below describes Lua ${target}, ${because[reason.kind]}.` : '';
}

/** Renders only when the entry does not exist in the selected version. */
export function VersionUnavailable({ node }: { node: CompatNode }) {
  const { version } = useSelectedVersion();
  const reason = unavailableIn(node, version);
  if (!reason) return null;

  return (
    /* Sticky, not merely first. Moving it to the top only helps a reader who has not
       scrolled — and an entry a reader cannot use is a fact that stays true all the way
       down, past the syntax, the parameters and every example. Pinned under the header,
       it cannot be read once and left behind.
       `bg-fd-background` is load-bearing: a translucent callout would let the entry
       scroll visibly through the thing contradicting it. */
    <div className="sticky top-(--fd-header-height) z-10 -mx-1 bg-fd-background px-1">
      <Callout kind="unavailable">
        {/* No button here, and there was one briefly.
            It read "View as Lua 5.1" directly under a sentence ending "…up to Lua 5.1",
            which named the version three times in two lines. It existed because the
            support strip was inert; now that every chip in the strip selects a version,
            the callout's job is to say *which* version to want, and the strip one row
            below is where you act on it. */}
        <span data-note="unavailable">
          {/* Subject-free on purpose. Building the sentence from the entry's title read
              "Format strings for pack and unpack was introduced in Lua 5.3" — the verb
              cannot agree with a title it does not know the number of, and the title is
              directly above the callout anyway. */}
          <strong>{unavailableLead(reason, version)}</strong> {unavailableText(reason)}
        </span>
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

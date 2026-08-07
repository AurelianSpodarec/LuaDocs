import type { Unavailable } from '@/compat/resolve';
import type { LuaVersion } from '@/compat/schema';

/**
 * The words an absence gets. `VersionPanel` is what renders them.
 *
 * The two inline deltas remain different kinds of fact, which is why the panel gives
 * them different tones rather than one shared "notice" treatment. A change note
 * *qualifies* the entry: everything below it still applies, with one detail different.
 * "Not in Lua 5.1" *invalidates* it — the syntax, the parameters, the examples and the
 * gotchas below all describe something the reader cannot call. Only the second is worth
 * pinning to the top of the viewport.
 *
 * `data-note` is what `tests/e2e/string-format.test.tsx` queries.
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

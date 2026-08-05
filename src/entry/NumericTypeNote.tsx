import { useSelectedVersionOrNull } from '@/version/SelectedVersionProvider';

/** Versions with no integer subtype — every number in them is a float. */
const NO_INTEGER_SUBTYPE = ['5.1', '5.2'];

/**
 * The one anachronism in an entry's type names, disclosed once per page instead of
 * three hundred times in prose ([ADR 0009](../../docs/adr/0009-type-names-across-versions.md)).
 *
 * Lua 5.3 introduced the integer subtype. `integer` in a Parameters or Return values
 * list is exact for 5.3 onward and an anachronism before it — but that is a fact about
 * Lua's numeric model, not about the entry, and it reads identically on every entry
 * returning a count, a length, an index or a byte. CONTEXT.md's delta model cannot
 * express it either: nothing about `string.len` changed, so a change note there would
 * be false.
 *
 * So the renderer says it, and only to the reader it concerns — the one who has 5.1 or
 * 5.2 selected right now.
 */
export function NumericTypeNote() {
  const version = useSelectedVersionOrNull();
  if (!version || !NO_INTEGER_SUBTYPE.includes(version)) return null;

  return (
    <p data-numeric-note className="mt-1 text-xs text-fd-muted-foreground">
      Lua {version} has no integer subtype — every{' '}
      {/* A plain anchor, as `EntrySource` uses: this renders inside MDX bodies and in
          tests that have no router above them, and a full navigation to a docs page
          costs nothing a reader would notice. */}
      <a
        href="/docs/language/values-and-types/number"
        className="underline decoration-fd-muted-foreground/40 underline-offset-2 hover:text-fd-primary"
      >
        number
      </a>{' '}
      is a float. Read <span className="font-mono">integer</span> below as a number with
      no fractional part.
    </p>
  );
}

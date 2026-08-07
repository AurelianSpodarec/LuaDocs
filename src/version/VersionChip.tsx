import type { LuaVersion } from '@/compat/schema';

/**
 * `since` is the errors list's pill — "this error only happens from 5.3" — and is
 * deliberately neutral. The other three carry the support strip's meaning, where
 * colour is the signal and `title` plus the strikethrough are what carry it when
 * colour does not reach the reader.
 */
export type ChipState = 'yes' | 'changed' | 'no' | 'since';

/**
 * Blue for `changed`, not amber, so the site spends each colour on one meaning.
 *
 * Amber was saying two opposite things about forty pixels apart: "available, with
 * changes" on this chip, and "not available at all" on the unavailable callout beside
 * it. Blue is what the *changed* callout already uses, so aligning the chip to it leaves
 * amber meaning absence and blue meaning "here, but different", in both the pills and
 * the callouts.
 */
const chipClass: Record<ChipState, string> = {
  yes: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  changed: 'border-blue-500/35 bg-blue-500/10 text-blue-700 dark:text-blue-400',
  no: 'border-fd-border bg-fd-muted text-fd-muted-foreground/70 line-through decoration-1',
  since: 'border-fd-border bg-fd-muted text-fd-muted-foreground',
};

const chipTitle: Record<ChipState, string> = {
  yes: 'Available',
  changed: 'Available, with changes',
  no: 'Not available',
  since: 'From this version onward',
};

const base = 'rounded-md border px-2 py-0.5 text-xs font-medium tabular-nums';

export function VersionChip({
  version,
  state,
  label,
  onSelect,
  current,
}: {
  version: LuaVersion;
  state: ChipState;
  /** Overrides the pill's text. The version stays the accessible fallback. */
  label?: string;
  /**
   * Makes the chip a control that selects this version. Absent, it stays the plain
   * `span` it has always been — which is what the errors list's `5.3+` marker and the
   * version matrix's rows need. A marker inside a sentence is not a button, and the
   * matrix exists to compare all five *without* leaving the one you are on.
   */
  onSelect?: (version: LuaVersion) => void;
  /** The version currently selected. Only meaningful where the chips are controls. */
  current?: boolean;
}) {
  const text = label ?? version;

  if (!onSelect) {
    return (
      <span data-state={state} title={chipTitle[state]} className={`${base} ${chipClass[state]}`}>
        {text}
      </span>
    );
  }

  return (
    <button
      type="button"
      data-state={state}
      aria-current={current ? 'true' : undefined}
      onClick={() => onSelect(version)}
      /*
        "Switch to", not "view as". The selected version is site-wide and persisted, so
        clicking a chip says "I work in 5.3" rather than "show me this entry in 5.3" —
        which is the whole reason the unavailable chips are controls too. A reader who
        needs to move to a version this entry never had is not asking about this entry,
        and the nearest control should not refuse them over a page they are leaving.
      */
      title={`${chipTitle[state]} — switch to Lua ${version}`}
      /*
        The ring, not the colour, marks the selected one. Each state already owns a
        colour, so tinting the current chip would collide with whatever it is saying
        about availability — and the chip a reader most needs marked is the struck-through
        one, which is exactly where a colour change would read as a state change.
      */
      className={`${base} ${chipClass[state]} cursor-pointer transition-colors hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring ${
        current ? 'ring-2 ring-fd-primary/60' : ''
      }`}
    >
      {text}
    </button>
  );
}

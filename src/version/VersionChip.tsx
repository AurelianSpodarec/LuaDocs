import type { LuaVersion } from '@/compat/schema';

/**
 * `since` is the errors list's pill — "this error only happens from 5.3" — and is
 * deliberately neutral. The other three carry the support strip's meaning, where
 * colour is the signal and `title` plus the strikethrough are what carry it when
 * colour does not reach the reader.
 */
export type ChipState = 'yes' | 'changed' | 'no' | 'since';

const chipClass: Record<ChipState, string> = {
  yes: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  changed: 'border-amber-500/35 bg-amber-500/10 text-amber-700 dark:text-amber-400',
  no: 'border-fd-border bg-fd-muted text-fd-muted-foreground/70 line-through decoration-1',
  since: 'border-fd-border bg-fd-muted text-fd-muted-foreground',
};

const chipTitle: Record<ChipState, string> = {
  yes: 'Available',
  changed: 'Available, with changes',
  no: 'Not available',
  since: 'From this version onward',
};

export function VersionChip({
  version,
  state,
  label,
}: {
  version: LuaVersion;
  state: ChipState;
  /** Overrides the pill's text. The version stays the accessible fallback. */
  label?: string;
}) {
  return (
    <span
      data-state={state}
      title={chipTitle[state]}
      className={`rounded-md border px-2 py-0.5 text-xs font-medium tabular-nums ${chipClass[state]}`}
    >
      {label ?? version}
    </span>
  );
}

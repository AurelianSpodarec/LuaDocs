import { supportRow } from '@/compat/resolve';
import type { CompatNode } from '@/compat/schema';

/**
 * Colour carries the state, and the word behind it carries the meaning for anyone
 * the colour does not reach: each chip has a `title`, and the strikethrough on an
 * unavailable version is a second, non-colour signal.
 */
const chipClass = {
  yes: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  changed: 'border-amber-500/35 bg-amber-500/10 text-amber-700 dark:text-amber-400',
  no: 'border-fd-border bg-fd-muted text-fd-muted-foreground/70 line-through decoration-1',
} as const;

const chipTitle = {
  yes: 'Available',
  changed: 'Available, with changes',
  no: 'Not available',
} as const;

export function VersionSupportStrip({ node }: { node: CompatNode }) {
  return (
    <div className="not-prose flex flex-wrap gap-1.5" aria-label="Version support">
      {supportRow(node).map(({ version, state }) => (
        <span
          key={version}
          data-state={state}
          title={chipTitle[state]}
          className={`rounded-md border px-2 py-0.5 text-xs font-medium tabular-nums ${chipClass[state]}`}
        >
          {version}
        </span>
      ))}
    </div>
  );
}

import { CircleAlert, CircleCheck, Info } from 'lucide-react';
import { availabilityRanges, changeNoteFor, unavailableIn, varies } from '@/compat/resolve';
import { LUA_VERSIONS, type CompatNode } from '@/compat/schema';
import { VersionSupportStrip } from './VersionSupportStrip';
import { renderChangeNote } from './changeNote';
import { unavailableLead, unavailableText } from './VersionNote';
import { useSelectedVersion } from './SelectedVersionProvider';

const FIRST = LUA_VERSIONS[0];
const LAST = LUA_VERSIONS[LUA_VERSIONS.length - 1];

/**
 * The status line for an entry the selected version has, and has unchanged.
 *
 * It reads off `availabilityRanges` rather than the bounds, so the two-run case — a
 * symbol that left and came back — states both runs instead of flattening them into a
 * span that includes the gap.
 *
 * "Available in every documented version" is the sentence worth having most. On a
 * versioned reference the useful thing to tell a reader is often that there is nothing
 * to think about here, and that is exactly what no callout at all used to say — which
 * is to say, nothing.
 */
export function availabilityLead(node: CompatNode): string {
  const ranges = availabilityRanges(node);

  const span = ({ from, to }: { from: string; to: string }) =>
    from === to ? `Lua ${from}` : `Lua ${from}–${to}`;

  if (ranges.length !== 1) {
    return `Available in ${ranges.map(span).join(' and ')}.`;
  }

  const [{ from, to }] = ranges;
  if (from === FIRST && to === LAST) return 'Available in every documented version.';
  if (to === LAST) return `Available in Lua ${from} and later.`;
  if (from === FIRST) return `Available up to Lua ${to}.`;
  return `Available in ${span({ from, to })}.`;
}

type Tone = 'available' | 'changed' | 'unavailable';

const toneClass: Record<Tone, string> = {
  available: 'border-emerald-500/25 bg-emerald-500/8',
  changed: 'border-blue-500/25 bg-blue-500/8',
  unavailable: 'border-amber-500/30 bg-amber-500/8',
};

const toneIcon = {
  available: CircleCheck,
  changed: Info,
  unavailable: CircleAlert,
} as const;

const toneIconClass: Record<Tone, string> = {
  available: 'text-emerald-600 dark:text-emerald-400',
  changed: 'text-blue-600 dark:text-blue-400',
  unavailable: 'text-amber-600 dark:text-amber-400',
};

/**
 * Everything the entry's compat data says, as one object under the description.
 *
 * Modelled on MDN's Baseline panel, which is one bordered block holding a verdict, a
 * sentence, the per-target detail and a way to the full data. Ours was three separate
 * floating bands — an alert stripe, an unlabelled row of pills, and sometimes a second
 * stripe for a change note — none of which said it was about the same subject as the
 * others. Four things were wrong with that, and the panel fixes them together:
 *
 * - **The chips had no label.** `5.1 5.2 5.3 5.4 5.5` under a heading tells a
 *   first-time reader nothing about what it is or that it can be clicked. MDN's browser
 *   icons are legible because the panel says "Baseline Widely available" above them.
 * - **A status appeared only when something was wrong**, so the amber box read as an
 *   error banner rather than as this page's version summary. Baseline is on every MDN
 *   page, which is why it reads as information. So there is always a status line here,
 *   and on most entries it is the green one.
 * - **The weight was inverted**: the loudest element on the page was also the thinnest,
 *   a full-bleed stripe carrying one small sentence.
 * - **The matrix was orphaned.** The detailed table sits at the foot with nothing at the
 *   top pointing to it; MDN's "See full compatibility" is inside the panel.
 *
 * Two things are deliberately not copied. The browser icons do not map — versions are
 * not products, and the chips do more, since they are also the control. And there is no
 * collapse chevron: Baseline needs one because its prose is three lines, and ours is one.
 */
export function VersionPanel({ node }: { node: CompatNode }) {
  const { version } = useSelectedVersion();

  const reason = unavailableIn(node, version);
  const note = reason ? null : changeNoteFor(node, version);
  const tone: Tone = reason ? 'unavailable' : note ? 'changed' : 'available';

  const Icon = toneIcon[tone];

  const panel = (
    <section
      aria-label="Version support"
      data-tone={tone}
      className={`not-prose rounded-xl border p-4 text-sm ${toneClass[tone]}`}
    >
      <p className="flex items-start gap-2 text-fd-muted-foreground">
        <Icon aria-hidden className={`mt-0.5 size-4 shrink-0 ${toneIconClass[tone]}`} />
        {reason ? (
          <span data-note="unavailable">
            <strong className="text-fd-foreground">{unavailableLead(reason, version)}</strong>{' '}
            {unavailableText(reason)}
          </span>
        ) : note ? (
          <span data-note="changed">
            <strong className="text-fd-foreground">Changed in Lua {version}:</strong>{' '}
            {renderChangeNote(note)}
          </span>
        ) : (
          <span data-note="available">
            <strong className="text-fd-foreground">{availabilityLead(node)}</strong>
          </span>
        )}
      </p>
      {/* Indented to the status text's column, not the icon's — `ps-6` is the icon's
          `size-4` plus the `gap-2` beside it. */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 ps-6">
        <VersionSupportStrip node={node} />
        {/* Only where the matrix renders. It is suppressed on an entry no version
            differs on, and a link to a section that is not there is worse than none. */}
        {varies(node) && (
          <a
            href="#version-support"
            className="text-xs text-fd-muted-foreground underline decoration-fd-muted-foreground/40 underline-offset-2 hover:text-fd-primary"
          >
            See full version support
          </a>
        )}
      </div>
    </section>
  );

  if (!reason) return panel;

  /* Sticky only when the entry is absent, and for the reason the callout it replaces
     was: that fact stays true all the way down, past the syntax, the parameters and
     every example, so it cannot be read once and left behind. An available entry's
     panel has nothing that keeps mattering after you have read it.
     `bg-fd-background` is load-bearing — the panel's own tint is translucent, so
     without it the entry would scroll visibly through the thing contradicting it. */
  return (
    <div className="sticky top-(--fd-header-height) z-10 -mx-1 bg-fd-background px-1 py-1">
      {panel}
    </div>
  );
}

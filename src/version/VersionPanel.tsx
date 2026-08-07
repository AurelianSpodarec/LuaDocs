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
      {/*
        Status left, chips right, on one row — which is how MDN's panel uses its width,
        and the reason theirs looks composed where a stacked version does not. Everything
        on the left leaves the right half of a full-width box empty, and the wider the
        window the emptier it gets.

        `justify-between` with `flex-wrap`, so the chips drop under the status on a narrow
        column instead of squeezing it.
      */}
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        {/* `basis-64` is what makes the wrap actually happen. With `flex-1` alone the
            status block just shrinks — on a 375px screen it collapsed to 90px of
            three-word lines beside 195px of chips. Given a 16rem basis it cannot fit
            alongside them in a narrow column, so the chips drop to their own row. */}
        <div
          data-note={tone}
          className="flex min-w-0 flex-1 basis-64 items-start gap-2 text-fd-muted-foreground"
        >
          <Icon aria-hidden className={`mt-0.5 size-4 shrink-0 ${toneIconClass[tone]}`} />
          <div>
            <strong className="text-fd-foreground">
              {reason
                ? unavailableLead(reason, version)
                : note
                  ? `Changed in Lua ${version}:`
                  : availabilityLead(node)}
            </strong>
            {/* The second line only exists where there is something more to say. An
                entry available everywhere gets a one-row panel, which is the shape the
                majority of pages should have. */}
            {reason ? (
              <p className="mt-1">{unavailableText(reason)}</p>
            ) : note ? (
              <p className="mt-1">{renderChangeNote(note)}</p>
            ) : null}
          </div>
        </div>
        {/* The link rides with the chips rather than sitting on a row of its own at the
            bottom. Alone under the sentence it read as a stray — one small underlined
            thing with nothing beside it, after the block had already closed. Here it is
            part of the right-hand group, where "the short version" and "the long
            version" of the same fact belong together.

            It renders only where the matrix does: `VersionMatrix` suppresses itself when
            no version differs, and a link to a section that is not on the page is worse
            than no link. */}
        <div className="flex items-center gap-x-3">
          {varies(node) && (
            <>
              <a
                href="#version-support"
                className="text-xs text-fd-muted-foreground underline decoration-fd-muted-foreground/40 underline-offset-2 hover:text-fd-primary"
              >
                See full version support
              </a>
              {/* The same middot `EntryProvenance` separates its two exits with. Without
                  it the link sits close enough to the pills to read as their label
                  rather than as a peer of them. */}
              <span aria-hidden className="text-fd-muted-foreground/50">
                ·
              </span>
            </>
          )}
          {/* This group does not wrap, so the separator can never end up dangling at the
              end of a line with nothing after it. The strip wraps internally instead —
              five pills over two rows is fine, an orphaned middot is not. */}
          <VersionSupportStrip node={node} />
        </div>
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

import { changeNoteFor, supportRow, varies } from '@/compat/resolve';
import type { CompatNode } from '@/compat/schema';
import { sectionHeadingClass } from '@/entry/pageToc';
import { VersionChip, type ChipState } from './VersionChip';
import { renderChangeNote } from './changeNote';

/** The word behind the colour. A row that only differs by hue says nothing. */
const statusText: Record<Exclude<ChipState, 'since'>, string> = {
  yes: 'Available',
  changed: 'Changed',
  no: 'Not available',
};

/**
 * The fuller per-version breakdown, at the foot of an entry — the low half of MDN's
 * split, where the strip at the top is the glanceable half.
 *
 * It renders only when a version actually differs. On an unchanged entry it would
 * restate the strip five times, which is prototype finding #2 in `page-structure.md`.
 */
export function VersionMatrix({ node }: { node: CompatNode }) {
  if (!varies(node)) return null;

  return (
    <section id="version-support" className="not-prose mt-12">
      <h2 className={sectionHeadingClass}>Version support</h2>
      <div className="overflow-x-auto rounded-xl border bg-fd-card">
        <table className="w-full text-sm">
          <thead className="border-b bg-fd-muted/50 text-fd-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-2 text-start font-medium">Version</th>
              <th scope="col" className="px-4 py-2 text-start font-medium">Status</th>
              <th scope="col" className="px-4 py-2 text-start font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {supportRow(node).map(({ version, state }) => (
              <tr key={version} className="border-b last:border-b-0">
                <td className="px-4 py-2">
                  <VersionChip version={version} state={state} />
                </td>
                <td className="px-4 py-2 text-fd-foreground">{statusText[state]}</td>
                <td className="px-4 py-2 text-fd-muted-foreground">
                  {(() => {
                    const note = changeNoteFor(node, version);
                    return note ? renderChangeNote(note) : '—';
                  })()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

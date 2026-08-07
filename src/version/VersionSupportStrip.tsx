import { supportRow } from '@/compat/resolve';
import type { CompatNode } from '@/compat/schema';
import { VersionChip } from './VersionChip';
import { useSelectedVersion } from './SelectedVersionProvider';

/**
 * The five versions and this entry's state in each — and the site's most legible way
 * to change the selected version.
 *
 * **Every chip is a control, including the struck-through ones.** The half-measure —
 * only the available chips clickable — is what makes this a bad idea: five identical
 * pills of which some are buttons, with nothing saying which, is worse than none. Made
 * uniform it is fine, because clicking an unavailable version is not a dead end. It
 * lands on the "Not in Lua X" callout, which names what happened and offers the way
 * back (`VersionNote`), so the reader who wanted to know what `setfenv()` looks like on
 * 5.3 gets an answer rather than nothing.
 *
 * It earns its place beside the header switcher rather than duplicating it. The header
 * is a `select` showing one version at a time; this shows all five *with their state*,
 * so "which version should I be on to read this" is answered and actionable in the same
 * glance. On an entry with a `changed` chip, clicking it is the whole question a
 * versioned reference exists to answer.
 *
 * The selected version had to become visible here as a consequence: a row of five
 * buttons with no current one marked is a control that will not say what it is set to.
 */
export function VersionSupportStrip({ node }: { node: CompatNode }) {
  const { version: selected, setVersion } = useSelectedVersion();

  return (
    <div className="not-prose flex flex-wrap gap-1.5" aria-label="Version support">
      {supportRow(node).map(({ version, state }) => (
        <VersionChip
          key={version}
          version={version}
          state={state}
          onSelect={setVersion}
          current={version === selected}
        />
      ))}
    </div>
  );
}

import { supportRow } from '@/compat/resolve';
import type { CompatNode } from '@/compat/schema';
import { VersionChip } from './VersionChip';

export function VersionSupportStrip({ node }: { node: CompatNode }) {
  return (
    <div className="not-prose flex flex-wrap gap-1.5" aria-label="Version support">
      {supportRow(node).map(({ version, state }) => (
        <VersionChip key={version} version={version} state={state} />
      ))}
    </div>
  );
}

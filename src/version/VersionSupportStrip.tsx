import { supportRow } from '@/compat/resolve';
import type { CompatNode } from '@/compat/schema';

export function VersionSupportStrip({ node }: { node: CompatNode }) {
  return (
    <div className="flex gap-2 text-sm" aria-label="Version support">
      {supportRow(node).map(({ version, state }) => (
        <span key={version} data-state={state} className="rounded px-2 py-0.5 border">
          {version}
        </span>
      ))}
    </div>
  );
}

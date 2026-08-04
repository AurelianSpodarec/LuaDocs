import { LUA_VERSIONS } from '@/compat/schema';
import { useSelectedVersion } from './SelectedVersionProvider';

export function VersionSwitcher() {
  const { version, setVersion } = useSelectedVersion();
  return (
    // `v5.4`, as Tailwind's `v4.3` chip does — the `v` carries the meaning and the
    // words did not. The name stays on the control for screen readers, where "5.4"
    // alone would be meaningless.
    <select
      aria-label="Lua version"
      className="cursor-pointer rounded-md border bg-fd-secondary px-1.5 py-1 text-xs font-medium text-fd-secondary-foreground tabular-nums transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring"
      value={version}
      onChange={(e) => setVersion(e.target.value as (typeof LUA_VERSIONS)[number])}
    >
      {LUA_VERSIONS.map((v) => (
        <option key={v} value={v}>
          v{v}
        </option>
      ))}
    </select>
  );
}

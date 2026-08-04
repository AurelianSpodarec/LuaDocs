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
      className="text-sm"
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

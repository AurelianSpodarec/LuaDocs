import { LUA_VERSIONS } from '@/compat/schema';
import { useSelectedVersion } from './SelectedVersionProvider';

export function VersionSwitcher() {
  const { version, setVersion } = useSelectedVersion();
  return (
    <label className="text-sm">
      Lua version{' '}
      <select value={version} onChange={(e) => setVersion(e.target.value as (typeof LUA_VERSIONS)[number])}>
        {LUA_VERSIONS.map((v) => (
          <option key={v} value={v}>{v}</option>
        ))}
      </select>
    </label>
  );
}

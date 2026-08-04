import { createContext, useContext, useCallback, useState, type ReactNode } from 'react';
import { LUA_VERSIONS, type LuaVersion } from '@/compat/schema';

const DEFAULT: LuaVersion = '5.5';
const KEY = 'luadocs.version';

function isLuaVersion(v: string | null): v is LuaVersion {
  return !!v && (LUA_VERSIONS as readonly string[]).includes(v);
}

function initialVersion(): LuaVersion {
  if (typeof window === 'undefined') return DEFAULT;
  const url = new URLSearchParams(window.location.search).get('v');
  if (isLuaVersion(url)) return url;
  const stored = localStorage.getItem(KEY);
  return isLuaVersion(stored) ? stored : DEFAULT;
}

type Ctx = { version: LuaVersion; setVersion: (v: LuaVersion) => void };
const SelectedVersion = createContext<Ctx | null>(null);

export function SelectedVersionProvider({ children }: { children: ReactNode }) {
  const [version, setVersionState] = useState<LuaVersion>(initialVersion);

  const setVersion = useCallback((v: LuaVersion) => {
    setVersionState(v);
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEY, v);
    const url = new URL(window.location.href);
    if (v === DEFAULT) url.searchParams.delete('v');
    else url.searchParams.set('v', v);
    window.history.replaceState({}, '', url);
  }, []);

  return <SelectedVersion.Provider value={{ version, setVersion }}>{children}</SelectedVersion.Provider>;
}

export function useSelectedVersion(): Ctx {
  const ctx = useContext(SelectedVersion);
  if (!ctx) throw new Error('useSelectedVersion must be used within SelectedVersionProvider');
  return ctx;
}

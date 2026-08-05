import { createContext, useContext, useCallback, useEffect, useState, type ReactNode } from 'react';
import { LUA_VERSIONS, DEFAULT_VERSION as DEFAULT, type LuaVersion } from '@/compat/schema';

const KEY = 'luadocs.version';

function isLuaVersion(v: string | null): v is LuaVersion {
  return !!v && (LUA_VERSIONS as readonly string[]).includes(v);
}

function initialVersion(): LuaVersion {
  if (typeof window === 'undefined') return DEFAULT;
  const url = new URLSearchParams(window.location.search).get('v');
  if (isLuaVersion(url)) return url;
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(KEY);
  } catch {
    // Storage access can throw (Safari private mode, storage-blocked embeds).
    // Degrade to the default version rather than breaking the whole page.
  }
  return isLuaVersion(stored) ? stored : DEFAULT;
}

type Ctx = { version: LuaVersion; setVersion: (v: LuaVersion) => void };
const SelectedVersion = createContext<Ctx | null>(null);

export function SelectedVersionProvider({ children }: { children: ReactNode }) {
  // Always render the default on the initial pass (prerender and the
  // hydrating client render must match). The real value — from ?v= or
  // localStorage — is resolved after mount, once we're client-only.
  const [version, setVersionState] = useState<LuaVersion>(DEFAULT);

  useEffect(() => {
    setVersionState(initialVersion());
  }, []);

  const setVersion = useCallback((v: LuaVersion) => {
    setVersionState(v);
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(KEY, v);
    } catch {
      // Storage access can throw (Safari private mode, storage-blocked embeds).
      // The in-memory version still updates; persistence is best-effort only.
    }
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

/**
 * The selected version where one is knowable, `null` where it is not.
 *
 * For components that *enhance* a page with version-aware detail rather than depend on
 * it — the numeric-type disclosure (ADR 0009) is the first. Throwing there would mean a
 * `<Returns>` list could crash a page for want of an aside, and would make every test
 * rendering an entry component mount a provider it has no interest in. Silence is the
 * right failure: with no selected version there is nothing truthful to disclose.
 */
export function useSelectedVersionOrNull(): LuaVersion | null {
  return useContext(SelectedVersion)?.version ?? null;
}

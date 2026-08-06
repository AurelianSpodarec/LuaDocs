import { createContext, useContext, type ReactNode } from 'react';
import { isAvailable } from '@/compat/resolve';
import type { CompatNode, LuaVersion } from '@/compat/schema';
import { useSelectedVersion } from './SelectedVersionProvider';

/**
 * The compat data of the entry a component sits inside.
 *
 * The callout at the top says whether the entry exists here, but a reader scrolls, and
 * everything below it looks like an ordinary working entry — most of all a runnable
 * example, which auto-runs and prints real output. On `string.pack` at 5.1 that output
 * is produced by a runtime that *does* have the function, demonstrating something the
 * reader cannot call. A notice that can be scrolled past is not a match for a
 * demonstration that contradicts it.
 *
 * The node itself travels rather than the one boolean derived from it, because the
 * runner needs a second reading of the same dataset: whether the *runtime* has the
 * entry, which is what decides which way its badge should point.
 *
 * `null` where nothing provides it — an entry with no compat data, or a component
 * rendered outside an entry. Callers treat that as "no reason to think otherwise".
 */
const EntryCompat = createContext<CompatNode | null>(null);

export function EntryAvailabilityProvider({
  node,
  children,
}: {
  node: CompatNode | null;
  children: ReactNode;
}) {
  return <EntryCompat.Provider value={node}>{children}</EntryCompat.Provider>;
}

/** The surrounding entry's compat data, or `null` outside an entry that has any. */
export function useEntryNode(): CompatNode | null {
  return useContext(EntryCompat);
}

/** `true` only when the surrounding entry is known not to exist in `version`. */
export function useEntryUnavailableIn(version: LuaVersion): boolean {
  const node = useEntryNode();
  return node ? !isAvailable(node, version) : false;
}

/** `true` only when the surrounding entry is known not to exist in the selected version. */
export function useEntryUnavailable(): boolean {
  const { version } = useSelectedVersion();
  return useEntryUnavailableIn(version);
}

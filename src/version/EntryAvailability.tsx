import { createContext, useContext, type ReactNode } from 'react';
import { isAvailable } from '@/compat/resolve';
import type { CompatNode } from '@/compat/schema';
import { useSelectedVersion } from './SelectedVersionProvider';

/**
 * Whether the entry a component sits inside exists in the selected version.
 *
 * The callout at the top says so, but a reader scrolls, and everything below it looks
 * like an ordinary working entry — most of all a runnable example, which auto-runs and
 * prints real output. On `string.pack` at 5.1 that output is produced by a runtime that
 * *does* have the function, demonstrating something the reader cannot call. A notice
 * that can be scrolled past is not a match for a demonstration that contradicts it.
 *
 * `null` where nothing provides it — an entry with no compat data, or a component
 * rendered outside an entry. Callers treat that as "no reason to think otherwise".
 */
const EntryAvailability = createContext<boolean | null>(null);

export function EntryAvailabilityProvider({
  node,
  children,
}: {
  node: CompatNode | null;
  children: ReactNode;
}) {
  const { version } = useSelectedVersion();
  const available = node ? isAvailable(node, version) : null;

  return <EntryAvailability.Provider value={available}>{children}</EntryAvailability.Provider>;
}

/** `false` only when the surrounding entry is known not to exist here. */
export function useEntryUnavailable(): boolean {
  return useContext(EntryAvailability) === false;
}

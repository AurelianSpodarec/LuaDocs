import type { ReactNode } from 'react';
import { useSelectedVersionOrNull } from '@/version/SelectedVersionProvider';
import { inScope } from './Only';

/** Shared by `Parameters` and `Returns` — the same shape, a different heading. */
export const termListClass = 'my-3 grid gap-y-2';
export const termClass = 'font-mono text-sm text-fd-foreground';
export const descriptionClass = 'ms-0 ps-4 text-sm text-fd-muted-foreground';
export const subheadingClass = 'mt-6 mb-1 text-base font-semibold text-fd-foreground';

export function Parameters({ children }: { children: ReactNode }) {
  const version = useSelectedVersionOrNull();
  // A heading over an empty list is a claim of its own — "this call takes parameters" —
  // and it is the claim that is false on the version that scoped every one of them away.
  //
  // Two shapes reach this branch. One is a `<Parameters>` whose every `<Param>` is scoped
  // out by `<Only>` on the selected version, which is what this was written for. The other
  // is a `<Parameters>` an author wrote *empty*, because the call takes no arguments on any
  // version — `coroutine.running()` is the first. That is deliberate and is the shape every
  // zero-argument function entry takes: `entry-anatomy.test.ts` requires the element on
  // every function entry, and rendering nothing is the honest answer for a call with
  // nothing to list.
  if (inScope(children, version).length === 0) return null;

  return (
    <>
      <h3 className={subheadingClass}>Parameters</h3>
      <dl className={termListClass}>{children}</dl>
    </>
  );
}

export function Param({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div>
      <dt className={termClass}>{name}</dt>
      <dd className={descriptionClass}>{children}</dd>
    </div>
  );
}

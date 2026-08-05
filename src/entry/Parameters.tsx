import type { ReactNode } from 'react';

/** Shared by `Parameters` and `Returns` — the same shape, a different heading. */
export const termListClass = 'my-3 grid gap-y-2';
export const termClass = 'font-mono text-sm text-fd-foreground';
export const descriptionClass = 'ms-0 ps-4 text-sm text-fd-muted-foreground';
export const subheadingClass = 'mt-6 mb-1 text-base font-semibold text-fd-foreground';

export function Parameters({ children }: { children: ReactNode }) {
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

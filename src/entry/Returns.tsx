import type { ReactNode } from 'react';
import { descriptionClass, subheadingClass, termClass, termListClass } from './Parameters';

/**
 * "Return values", plural, always. A Lua function returning two values is ordinary,
 * which is what makes this section richer than MDN's single "Return value".
 */
export function Returns({ children }: { children: ReactNode }) {
  return (
    <>
      <h3 className={subheadingClass}>Return values</h3>
      <dl className={termListClass}>{children}</dl>
    </>
  );
}

export function Return({ type, children }: { type: string; children: ReactNode }) {
  return (
    <div>
      <dt className={termClass}>{type}</dt>
      <dd className={descriptionClass}>{children}</dd>
    </div>
  );
}

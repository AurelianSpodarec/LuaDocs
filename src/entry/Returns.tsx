import type { ReactNode } from 'react';
import { useSelectedVersionOrNull } from '@/version/SelectedVersionProvider';
import { descriptionClass, subheadingClass, termClass, termListClass } from './Parameters';
import { NumericTypeNote } from './NumericTypeNote';
import { inScope } from './Only';

/**
 * "Return values", plural, always. A Lua function returning two values is ordinary,
 * which is what makes this section richer than MDN's single "Return value".
 *
 * Both of the things placed around the list — the heading and the numeric-type
 * disclosure — are decided from the returns that survive version scoping, not from the
 * returns the author wrote. The disclosure sits *above* the list and presupposes it, so
 * on an entry whose returns arrived in a later version it would otherwise explain how to
 * read an `integer` that is not on the page (ADR 0009); and the heading alone, with the
 * list under it empty, states that the call returns something.
 *
 * `<Return type>` is the only place on an entry where a type is declared as data rather
 * than written into prose, which is what lets the disclosure place itself without an
 * author doing anything. A list of strings and tables gets no note.
 */
export function Returns({ children }: { children: ReactNode }) {
  const version = useSelectedVersionOrNull();
  const returns = inScope(children, version);
  if (returns.length === 0) return null;

  const namesAnInteger = returns.some((child) => {
    const { type } = child.props as { type?: string };
    return typeof type === 'string' && type.includes('integer');
  });

  return (
    <>
      <h3 className={subheadingClass}>Return values</h3>
      {namesAnInteger && <NumericTypeNote />}
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

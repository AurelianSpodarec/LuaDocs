import { Children, Fragment, isValidElement, type ReactNode } from 'react';
import { descriptionClass, subheadingClass, termClass, termListClass } from './Parameters';
import { NumericTypeNote } from './NumericTypeNote';

/**
 * Does any return in this list name the integer subtype?
 *
 * `<Return type>` is the only place on an entry where a type is declared as data rather
 * than written into prose, which is what lets the disclosure below place itself without
 * an author doing anything (ADR 0009). A list of strings and tables gets no note.
 */
function namesAnInteger(children: ReactNode): boolean {
  return Children.toArray(children).some((child) => {
    if (!isValidElement(child)) return false;

    // MDX hands the returns over as a flat array, but a fragment is a shape an author
    // can write and a test does write — and `Children.toArray` counts one as a single
    // child rather than flattening it, so recurse rather than miss what is inside.
    const props = child.props as { type?: string; children?: ReactNode };
    if (child.type === Fragment) return namesAnInteger(props.children);

    return typeof props.type === 'string' && props.type.includes('integer');
  });
}

/**
 * "Return values", plural, always. A Lua function returning two values is ordinary,
 * which is what makes this section richer than MDN's single "Return value".
 */
export function Returns({ children }: { children: ReactNode }) {
  return (
    <>
      <h3 className={subheadingClass}>Return values</h3>
      {namesAnInteger(children) && <NumericTypeNote />}
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

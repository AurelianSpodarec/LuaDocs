import type { ReactNode } from 'react';
import { descriptionClass, subheadingClass, termListClass } from '@/entry/Parameters';

/**
 * The **proposed** Parameters and Return values lists — ADR 0013, as amended.
 *
 * Deliberately a copy rather than an edit of `src/entry/Parameters.tsx`. Nothing on
 * `/demo` may change how the 292 real entries render, and a proposal that has already
 * modified the thing it proposes cannot be compared against it. When ADR 0013's Phase 1
 * lands, these move into `src/entry/` and this file goes away.
 *
 * Two consequences of being a copy. It borrows the real list's class constants, so the two
 * columns on `/demo` share their typography and only the structure differs — which is the
 * whole point of the page. And it will drift from the real components the moment anyone
 * touches them, which is acceptable for a surface whose job is to be looked at once and
 * argued about.
 */

/** The two lists share a term row; only the heading and the term's contents differ. */
function TermRow({ term, children }: { term: ReactNode; children: ReactNode }) {
  return (
    <div>
      <dt className="flex flex-wrap items-baseline gap-x-2 gap-y-1">{term}</dt>
      <dd className={descriptionClass}>{children}</dd>
    </div>
  );
}

const nameClass = 'font-mono text-sm text-fd-foreground';
const typeClass = 'font-mono text-xs text-fd-muted-foreground';

/**
 * `optional` and its default sit in the term row rather than in the description, because
 * being scannable down the column is the entire reason they were pulled out of the prose.
 * The old site spelled both as a type union (`string|nil`) and ADR 0013 rejects that: a
 * separator is not "a string or nil", it is absent, and on `table.insert` — which
 * dispatches on arity — an explicit `nil` raises rather than taking the default.
 */
function OptionalMark({ default: fallback }: { default?: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="rounded border border-fd-border px-1.5 py-px text-[0.6875rem] font-medium uppercase tracking-wide text-fd-muted-foreground">
        optional
      </span>
      {fallback && (
        <span className="text-xs text-fd-muted-foreground">
          default <code className="font-mono text-fd-foreground">{fallback}</code>
        </span>
      )}
    </span>
  );
}

export function ProposedParameters({ children }: { children: ReactNode }) {
  return (
    <>
      <h3 className={subheadingClass}>Parameters</h3>
      <dl className={termListClass}>{children}</dl>
    </>
  );
}

export function ProposedParam({
  name,
  type,
  optional,
  default: fallback,
  children,
}: {
  name: string;
  type: string;
  optional?: boolean;
  default?: string;
  children: ReactNode;
}) {
  return (
    <TermRow
      term={
        <>
          <span className={nameClass}>{name}</span>
          <span className={typeClass}>{type}</span>
          {optional && <OptionalMark default={fallback} />}
        </>
      }
    >
      {children}
    </TermRow>
  );
}

export function ProposedReturns({ children }: { children: ReactNode }) {
  return (
    <>
      <h3 className={subheadingClass}>Return values</h3>
      <dl className={termListClass}>{children}</dl>
    </>
  );
}

/**
 * `name` is optional here, matching ADR 0013's amended rule 4: required where an entry
 * returns two or more values, permitted where it returns one. 85 of 152 function entries
 * return exactly one value, and a one-row list has no sibling to be confused with.
 */
export function ProposedReturn({
  name,
  type,
  children,
}: {
  name?: string;
  type: string;
  children: ReactNode;
}) {
  return (
    <TermRow
      term={
        <>
          {name && <span className={nameClass}>{name}</span>}
          <span className={name ? typeClass : nameClass}>{type}</span>
        </>
      }
    >
      {children}
    </TermRow>
  );
}

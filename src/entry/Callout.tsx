import { CircleAlert, Info, Lightbulb, TriangleAlert } from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';

/**
 * Five kinds, and the list is closed.
 *
 * Three are authored — `page-structure.md` allows Note, Warning and Gotcha and no
 * more, because MDN's lesson is that callout types multiply until none of them carry
 * weight. Two are derived, drawn by `VersionNote` from the compat dataset; they live
 * here so the site has one callout rather than two families that drift apart.
 */
export type CalloutKind = 'note' | 'warning' | 'gotcha' | 'changed' | 'unavailable';

const kindClass: Record<CalloutKind, string> = {
  note: 'border-fd-border border-s-fd-muted-foreground/50 bg-fd-muted/40',
  warning: 'border-red-500/30 border-s-red-500 bg-red-500/8',
  gotcha: 'border-violet-500/30 border-s-violet-500 bg-violet-500/8',
  changed: 'border-blue-500/30 border-s-blue-500 bg-blue-500/8',
  unavailable: 'border-amber-500/30 border-s-amber-500 bg-amber-500/8',
};

const kindIconClass: Record<CalloutKind, string> = {
  note: 'text-fd-muted-foreground',
  warning: 'text-red-600 dark:text-red-400',
  gotcha: 'text-violet-600 dark:text-violet-400',
  changed: 'text-blue-600 dark:text-blue-400',
  unavailable: 'text-amber-600 dark:text-amber-400',
};

const kindIcon: Record<CalloutKind, ComponentType<{ className?: string }>> = {
  note: Info,
  warning: TriangleAlert,
  gotcha: Lightbulb,
  changed: Info,
  unavailable: CircleAlert,
};

/**
 * `not-prose` on the shell is what keeps a callout compact — without it every authored
 * paragraph inside one carries prose's `1em` top and bottom margins and the box grows
 * to twice its height. It was harmless when the only children were the plain strings
 * `VersionNote` builds from the compat dataset; it is not harmless now that Note,
 * Warning and Gotcha wrap authored MDX, because it also switches off prose's link and
 * inline-code rules, leaving a link inside a callout indistinguishable from the text
 * around it.
 *
 * So the block margins stay suppressed and the two inline treatments are put back by
 * hand, on the callout's own content only. The values mirror
 * `@fumadocs/tailwind`'s typography plugin — `a:not([data-card])` and `code` — so a
 * link or a code chip reads the same inside a callout as it does in body prose.
 */
const bodyClass = [
  '[&_a]:font-medium [&_a]:underline [&_a]:decoration-fd-primary',
  '[&_a]:decoration-[1.5px] [&_a]:underline-offset-[3.5px]',
  '[&_a]:transition-opacity [&_a:hover]:opacity-80',
  '[&_code]:rounded-[5px] [&_code]:border [&_code]:bg-fd-muted',
  '[&_code]:p-[3px] [&_code]:text-[0.8125rem] [&_code]:font-normal',
  // Prose gives a code chip inside a link the link's colour rather than its own.
  '[&_a_code]:text-inherit',
].join(' ');

export function Callout({
  kind,
  title,
  children,
}: {
  kind: CalloutKind;
  /** Omitted by the derived kinds, which put their own heading in `children`. */
  title?: string;
  children: ReactNode;
}) {
  const Icon = kindIcon[kind];

  return (
    <div
      role="note"
      data-callout={kind}
      className={`not-prose my-4 flex items-start gap-2.5 rounded-lg border border-s-4 px-3.5 py-2.5 text-sm leading-6 ${kindClass[kind]}`}
    >
      <Icon aria-hidden className={`mt-0.5 size-4 shrink-0 ${kindIconClass[kind]}`} />
      <div className={bodyClass}>
        {title && <strong className="me-1 text-fd-foreground">{title}</strong>}
        {children}
      </div>
    </div>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <Callout kind="note" title="Note">
      {children}
    </Callout>
  );
}

export function Warning({ children }: { children: ReactNode }) {
  return (
    <Callout kind="warning" title="Warning">
      {children}
    </Callout>
  );
}

/**
 * The site's signature callout: surprising-but-not-dangerous semantics — 1-based
 * indexing, `nil` holes, only `nil` and `false` being falsy. A gotcha that looked like
 * a Note would be a Note, so it takes its own colour and always carries a subject.
 */
export function Gotcha({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Callout kind="gotcha" title={`Gotcha: ${title}`}>
      {children}
    </Callout>
  );
}

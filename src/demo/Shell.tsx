import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { VersionSwitcher } from '@/version/VersionSwitcher';

/**
 * Chrome shared by every page under `/demo`.
 *
 * Deliberately not the docs shell. A proving page that looked like an entry would invite
 * the one mistake this surface exists to prevent — reading a proposal as though it had
 * shipped. The banner says what this is on every page, because these get sent as links and
 * a link arrives without the conversation around it.
 */

const PAGES = [
  { to: '/demo/entry-body', title: 'Entry body: now vs proposed', note: 'ADR 0013 — types on parameters, names on returns' },
  { to: '/demo/entry-length', title: 'How long is an entry?', note: 'ADR 0013 rule 6 — the same entry at three lengths' },
  { to: '/demo/kitchen-sink', title: 'Kitchen sink', note: 'Every entry component firing at once' },
  { to: '/demo/example-label', title: 'The example card’s label', note: 'Unresolved — `example.lua` vs an invitation' },
] as const;

export function DemoShell({
  title,
  standfirst,
  children,
}: {
  title: string;
  standfirst: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <div className="border-b bg-fd-muted/40">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2 sm:px-6">
          <Link to="/demo" className="text-xs font-semibold uppercase tracking-wider text-fd-foreground">
            Internal
          </Link>
          <span className="text-xs text-fd-muted-foreground">
            Proposals, not the site. Not linked, not in the sitemap, <code>noindex</code>.
          </span>
          {/* The switcher is here because half of what these pages prove is version
              scoping — a `<Only>` around a parameter, a `<Since>` inside Errors, the
              numeric disclosure that only fires below 5.3. The docs shell carries one and
              this shell deliberately is not the docs shell, so without this the kitchen
              sink would ask a reader to change something they cannot reach. */}
          <div className="ms-auto flex items-center gap-4">
            <VersionSwitcher />
            <Link to="/docs/$" params={{ _splat: '' }} className="text-xs text-fd-primary underline">
              Back to the docs
            </Link>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        <h1 className="text-3xl font-semibold tracking-tight text-fd-foreground">{title}</h1>
        <div className="mt-3 max-w-3xl text-fd-muted-foreground">{standfirst}</div>
        {children}
      </main>
    </div>
  );
}

export function DemoIndex() {
  return (
    <DemoShell
      title="Proving surface"
      standfirst={
        <>
          <p>
            Somewhere to look at a decision about rendered output before rewriting 292 entries
            to match it. Every refinement in <code>docs/research/page-structure.md</code> came
            from building a page rather than from deciding in prose — and the surface that
            produced them, <code>prototype/</code>, was deleted, so the lesson had to be
            learned again. This is that surface, kept.
          </p>
          <p className="mt-3">
            The rule these pages exist to serve is in{' '}
            <code>docs/adr/0015-rendered-before-ratified.md</code>.
          </p>
        </>
      }
    >
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {PAGES.map((page) => (
          <li key={page.to}>
            <Link
              to={page.to}
              className="block rounded-xl border bg-fd-card p-4 transition-colors hover:border-fd-primary/40 hover:bg-fd-accent/30"
            >
              <span className="block font-medium text-fd-foreground">{page.title}</span>
              <span className="mt-1 block text-sm text-fd-muted-foreground">{page.note}</span>
            </Link>
          </li>
        ))}
      </ul>
    </DemoShell>
  );
}

/** Shared by the comparison pages — a labelled column, one tone per side. */
export function Column({
  label,
  tone,
  children,
}: {
  label: string;
  tone: 'now' | 'proposed' | 'neutral';
  children: ReactNode;
}) {
  const toneClass =
    tone === 'now'
      ? 'bg-fd-muted text-fd-muted-foreground'
      : tone === 'proposed'
        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
        : 'bg-fd-primary/10 text-fd-primary';

  return (
    <div className="min-w-0 rounded-xl border bg-fd-card p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className={`rounded px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wider ${toneClass}`}
        >
          {tone === 'now' ? 'Now' : tone === 'proposed' ? 'Proposed' : 'Variant'}
        </span>
        <span className="text-sm text-fd-muted-foreground">{label}</span>
      </div>
      {children}
    </div>
  );
}

/** Two columns on desktop, stacked below `lg` — a phone cannot show a side-by-side. */
export function Comparison({ children }: { children: ReactNode }) {
  return <div className="my-5 grid gap-4 lg:grid-cols-2">{children}</div>;
}

export function Delta({ children }: { children: ReactNode }) {
  return (
    <div className="my-5 rounded-lg border-s-2 border-s-fd-primary bg-fd-muted/30 px-4 py-3 text-sm text-fd-muted-foreground">
      {children}
    </div>
  );
}

export function DemoHeading({ children }: { children: ReactNode }) {
  return <h2 className="mt-12 mb-1 text-xl font-semibold text-fd-foreground">{children}</h2>;
}

export function Syntax({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border bg-fd-muted/40 px-4 py-2.5 font-mono text-[0.8125rem] text-fd-foreground">
      {children}
    </pre>
  );
}

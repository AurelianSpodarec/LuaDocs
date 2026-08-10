import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { Param, Parameters } from '@/entry/Parameters';
import { Return, Returns } from '@/entry/Returns';
import {
  ProposedParam,
  ProposedParameters,
  ProposedReturn,
  ProposedReturns,
} from './ProposedLists';

/**
 * Side-by-side of the shipping entry lists against ADR 0013's proposal.
 *
 * The left column imports the **real** components, so it is not a mock-up of what ships —
 * it is what ships, rendering here because `SelectedVersionProvider` wraps the whole app
 * from `__root.tsx`. The right column is `./ProposedLists.tsx`. Anything that looks
 * different between the columns is a real difference.
 *
 * Two subjects, chosen for coverage rather than variety: `string.find` carries the defect
 * that motivated the ADR (two indistinguishable `integer` rows, and prose naming
 * identifiers the page does not have), and `table.concat` carries three optional
 * parameters with three different kinds of default, including one that is an expression.
 */

function Syntax({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border bg-fd-muted/40 px-4 py-2.5 font-mono text-[0.8125rem] text-fd-foreground">
      {children}
    </pre>
  );
}

function Column({
  label,
  tone,
  children,
}: {
  label: string;
  tone: 'now' | 'proposed';
  children: ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-xl border bg-fd-card p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <span
          className={`rounded px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wider ${
            tone === 'now'
              ? 'bg-fd-muted text-fd-muted-foreground'
              : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
          }`}
        >
          {tone === 'now' ? 'Now' : 'Proposed'}
        </span>
        <span className="text-sm text-fd-muted-foreground">{label}</span>
      </div>
      {children}
    </div>
  );
}

function Comparison({ children }: { children: ReactNode }) {
  return <div className="my-5 grid gap-4 lg:grid-cols-2">{children}</div>;
}

function Delta({ children }: { children: ReactNode }) {
  return (
    <div className="my-5 rounded-lg border-s-2 border-s-fd-primary bg-fd-muted/30 px-4 py-3 text-sm text-fd-muted-foreground">
      {children}
    </div>
  );
}

function Heading({ children }: { children: ReactNode }) {
  return <h2 className="mt-12 mb-1 text-xl font-semibold text-fd-foreground">{children}</h2>;
}

/** ADR 0009's disclosure, drawn rather than imported — see the note beside it on the page. */
function IllustrativeNumericNote() {
  return (
    <div className="my-2 rounded-md border border-dashed bg-fd-muted/30 px-3 py-2 text-xs text-fd-muted-foreground">
      <span className="font-medium text-fd-foreground">ⓘ</span> Lua 5.1 and 5.2 have no
      integer subtype — every number there is a float.{' '}
      <span className="italic">
        (Drawn, not the real <code>NumericTypeNote</code>: it only fires on 5.1 or 5.2, and
        this page has no version switcher.)
      </span>
    </div>
  );
}

export function EntryBodyDemo() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground">
        Internal — not linked from the site, not in the sitemap, <code>noindex</code>
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-fd-foreground">
        Entry body: now vs proposed
      </h1>
      <p className="mt-3 max-w-3xl text-fd-muted-foreground">
        ADR 0013 gives parameters a type and return values a name. The left column below is
        the live renderer — the same components 292 entries use — so every difference you can
        see is a real one. Written up in <code>docs/adr/0013-the-body-of-a-reference-entry.md</code>{' '}
        and <code>docs/plans/2026-08-10-entry-body-demo.md</code>.
      </p>

      <Heading>
        1. <code>string.find</code> — the defect that started it
      </Heading>
      <p className="max-w-3xl text-sm text-fd-muted-foreground">
        Compare the two Return values lists first. On the left, the first two rows are both
        the bare word <code>integer</code> with nothing to tell them apart — and the second
        row's description refers to <code>start_index</code> and <code>end_index</code>,
        identifiers that appear nowhere else on the entry.
      </p>

      <Comparison>
        <Column tone="now" label="string.find">
          <Syntax>string.find(s, pattern [, init [, plain]])</Syntax>
          <Parameters>
            <Param name="s">The string to search.</Param>
            <Param name="pattern">
              The pattern to look for — or, with <code>plain</code> switched on, literal text.
            </Param>
            <Param name="init">
              The position to start searching from. Omitted, the search starts at the first
              byte.
            </Param>
            <Param name="plain">
              <code>true</code> turns pattern matching off, making this a search for{' '}
              <code>pattern</code> as it stands.
            </Param>
          </Parameters>
          <Returns>
            <Return type="integer">
              Where the match starts. A search that finds nothing returns <code>nil</code> on
              its own, with nothing after it.
            </Return>
            <Return type="integer">
              Where the match ends. That byte belongs to it, so{' '}
              <code>string.sub(s, start_index, end_index)</code> is the text that matched.
            </Return>
            <Return type="string or integer">
              Then one value per capture the pattern has, in the order the captures open.
            </Return>
          </Returns>
        </Column>

        <Column tone="proposed" label="string.find">
          <Syntax>string.find(subject, pattern [, start_position [, plain]])</Syntax>
          <IllustrativeNumericNote />
          <ProposedParameters>
            <ProposedParam name="subject" type="string">
              The string to search.
            </ProposedParam>
            <ProposedParam name="pattern" type="string">
              The pattern to look for — or, with <code>plain</code> switched on, literal text.
            </ProposedParam>
            <ProposedParam name="start_position" type="integer" optional default="1">
              The position to start searching from. Omitted, the search starts at the first
              byte.
            </ProposedParam>
            <ProposedParam name="plain" type="boolean" optional default="false">
              <code>true</code> turns pattern matching off, making this a search for{' '}
              <code>pattern</code> as it stands.
            </ProposedParam>
          </ProposedParameters>
          <ProposedReturns>
            <ProposedReturn name="start_index" type="integer">
              Where the match starts. A search that finds nothing returns <code>nil</code> on
              its own, with nothing after it.
            </ProposedReturn>
            <ProposedReturn name="end_index" type="integer">
              Where the match ends. That byte belongs to it, so{' '}
              <code>string.sub(subject, start_index, end_index)</code> is the text that
              matched.
            </ProposedReturn>
            <ProposedReturn name="captures" type="string or integer">
              Then one value per capture the pattern has, in the order the captures open.
            </ProposedReturn>
          </ProposedReturns>
        </Column>
      </Comparison>

      <Delta>
        <strong className="text-fd-foreground">The names were not invented.</strong> This
        entry's own examples already destructure the call as{' '}
        <code>local start_index, end_index = string.find(log_line, "WARN")</code>. The prose
        used those identifiers because it had to; the list could not declare them. So the
        migration reads an entry's examples first and adopts what they already say, rather
        than choosing fresh labels — which would put a third vocabulary on the page.
      </Delta>

      <Heading>
        2. <code>table.concat</code> — optional, and three kinds of default
      </Heading>
      <p className="max-w-3xl text-sm text-fd-muted-foreground">
        Here the interesting column is Parameters. On the left, whether an argument may be
        omitted is recoverable only from the brackets in the Syntax line and from a sentence
        in each description. Nothing is scannable, and the default values are prose.
      </p>

      <Comparison>
        <Column tone="now" label="table.concat">
          <Syntax>table.concat(list [, sep [, i [, j]]])</Syntax>
          <Parameters>
            <Param name="list">The list to read the elements from.</Param>
            <Param name="sep">
              What goes between one element and the next. Omitted, nothing does and the pieces
              run together.
            </Param>
            <Param name="i">
              The position to start at. Omitted, it is <code>1</code>.
            </Param>
            <Param name="j">
              The last position to include. Omitted, it is <code>#list</code>.
            </Param>
          </Parameters>
          <Returns>
            <Return type="string">
              The elements from <code>i</code> to <code>j</code>, written out in order with{' '}
              <code>sep</code> between neighbours.
            </Return>
          </Returns>
        </Column>

        <Column tone="proposed" label="table.concat">
          <Syntax>table.concat(list [, separator [, first [, last]]])</Syntax>
          <ProposedParameters>
            <ProposedParam name="list" type="table">
              The list to read the elements from.
            </ProposedParam>
            <ProposedParam name="separator" type="string" optional default='""'>
              What goes between one element and the next.
            </ProposedParam>
            <ProposedParam name="first" type="integer" optional default="1">
              The position to start at.
            </ProposedParam>
            <ProposedParam name="last" type="integer" optional default="#list">
              The last position to include.
            </ProposedParam>
          </ProposedParameters>
          <ProposedReturns>
            <ProposedReturn type="string">
              The elements from <code>first</code> to <code>last</code>, written out in order
              with <code>separator</code> between neighbours.
            </ProposedReturn>
          </ProposedReturns>
        </Column>
      </Comparison>

      <Delta>
        <strong className="text-fd-foreground">Two things to judge here.</strong> The
        descriptions got shorter — "Omitted, it is <code>1</code>" is now the default column's
        job, which is rule 6 paying for itself. And the single return value carries{' '}
        <em>no</em> name: amended rule 4 requires one only where an entry returns two or more
        values, because a one-row list has no sibling to be confused with. 85 of 152 function
        entries are in that position.
        <br />
        <br />
        Note what is <em>not</em> here: <code>separator</code> is typed{' '}
        <code>string</code>, not <code>string|nil</code>. Optionality is not a type, and on{' '}
        <code>table.insert</code> — which dispatches on how many arguments it got — an
        explicit <code>nil</code> raises rather than taking a default, so a union would be a
        documented lie.
      </Delta>

      <Heading>Still undecided</Heading>
      <p className="max-w-3xl text-sm text-fd-muted-foreground">
        <code>string.find</code>'s <code>init</code> above is rendered as{' '}
        <code>start_position</code>, and that is a guess, not a decision.{' '}
        <code>table.concat</code>'s pair became <code>first</code>/<code>last</code>, but a
        lone starting point has no partner and <code>first</code> without a <code>last</code>{' '}
        reads as half of something. That puts <code>position</code>, <code>first</code>/
        <code>last</code> and <code>start_position</code> in play as three spellings of one
        idea — the same drift the naming rule exists to prevent. It affects{' '}
        <code>string.find</code>, <code>match</code>, <code>gmatch</code>, <code>gsub</code>,{' '}
        <code>io.file-seek</code> and <code>utf8</code>.
      </p>

      <p className="mt-10 text-sm text-fd-muted-foreground">
        The live entries for comparison:{' '}
        <Link
          to="/docs/$"
          params={{ _splat: 'standard-library/string/find' }}
          className="text-fd-primary underline"
        >
          string.find
        </Link>{' '}
        and{' '}
        <Link
          to="/docs/$"
          params={{ _splat: 'standard-library/table/concat' }}
          className="text-fd-primary underline"
        >
          table.concat
        </Link>
        .
      </p>
    </main>
  );
}

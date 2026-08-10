import type { ReactNode } from 'react';
import { Gotcha, Note } from '@/entry/Callout';
import { Errors } from '@/entry/Errors';
import { Param, Parameters } from '@/entry/Parameters';
import { Return, Returns } from '@/entry/Returns';
import { RunnableExample } from '@/runner/RunnableExample';
import { Column, DemoHeading, DemoShell, Delta, Syntax } from './Shell';

/**
 * `table.concat` at three lengths, so ADR 0013 rule 6 can be judged instead of argued.
 *
 * Rule 6 — "a paragraph earns its place or goes" — is the only rule in that ADR with no
 * test behind it and no way to look at it. The measurement that motivated it (963 prose
 * words for a four-argument call, against ~210 on the old luadocs.com) is invisible in a
 * component diff: a two-list comparison cannot show that a page is exhausting.
 *
 * **Every word in all three columns is deletion-only.** The Full column is the shipped
 * entry; Trimmed and Minimal are the same sentences with sentences removed, never reworded
 * and never added to. That is what keeps this page inside ADR 0010 with no manual on disk —
 * cutting redundancy makes no new factual claim, whereas rewriting a sentence about
 * behaviour does.
 */

const JOIN_EXAMPLE = `local shopping_list = {"cocoa", "flour", "sugar"}
print(table.concat(shopping_list, ", "))
-- Expected output: cocoa, flour, sugar`;

function Prose({ children }: { children: ReactNode }) {
  return <p className="my-3 text-sm leading-6 text-fd-foreground">{children}</p>;
}

function WordCount({ words, verdict }: { words: number; verdict: string }) {
  return (
    <p className="mt-4 border-t pt-3 text-xs text-fd-muted-foreground">
      <span className="font-mono font-medium text-fd-foreground">{words} words</span> — {verdict}
    </p>
  );
}

export function EntryLength() {
  return (
    <DemoShell
      title="How long is an entry?"
      standfirst={
        <>
          <p>
            The same entry — <code>table.concat</code> — at three lengths. The left column is
            what ships today: 963 prose words for a four-argument call, against roughly 210 on
            the old luadocs.com. ADR 0013 rule 6 says a paragraph earns its place or goes, and
            it is the only rule in that ADR with nothing to test it and nothing to look at.
            This is the looking.
          </p>
          <p className="mt-3">
            <strong className="text-fd-foreground">All three columns are deletion-only.</strong>{' '}
            Nothing is reworded and nothing is added — Trimmed and Minimal are the shipped
            sentences with sentences removed. That is deliberate: with no manual on disk, cutting
            redundancy makes no new factual claim, and rewriting a sentence about behaviour
            would.
          </p>
        </>
      }
    >
      <DemoHeading>Description, three ways</DemoHeading>
      <p className="max-w-3xl text-sm text-fd-muted-foreground">
        Parameters, Errors and the examples are identical in all three and are shown once,
        below. Only the Description differs — which is where the length is.
      </p>

      <div className="my-5 grid gap-4 lg:grid-cols-3">
        <Column tone="now" label="Full — as shipped">
          <Prose>
            The separator goes <em>between</em> neighbours and nowhere else, so a run of three
            elements carries two separators and none at either end. A run of one comes back on
            its own, with no separator anywhere in it, and that stays true whatever{' '}
            <code>sep</code> says.
          </Prose>
          <Prose>
            <code>i</code> and <code>j</code> mark the run, and both ends are included. Left out
            they are <code>1</code> and <code>#list</code>, which is the whole list, so the
            everyday call names only the separator. When <code>i</code> sits past <code>j</code>{' '}
            the run is empty and the answer is the empty string. An empty list is that same case
            arriving on its own: <code>#list</code> is <code>0</code> there, <code>1</code> is
            already past it, and the call answers with an empty string rather than raising — so a
            list that may have nothing in it needs no guard before joining.
          </Prose>
          <Prose>
            The run is read exactly as it is given and is never trimmed to fit the list. A{' '}
            <code>j</code> beyond the last element does not stop early at the end; it goes on
            reading positions that hold nothing, and nothing is not something this function can
            write out. Everything in the run has to be a string or a number, and a number is
            written the way printing it would write it. Nothing else is converted — a{' '}
            <code>true</code> or a nested list is refused rather than described.
          </Prose>
          <Prose>
            What falls outside the run is not read at all. That is what makes the two position
            arguments worth more than slicing: a list whose tail holds values{' '}
            <code>table.concat()</code> could not join still joins cleanly, as long as{' '}
            <code>j</code> stops before them.
          </Prose>
          <Prose>
            Only numbered positions take part. Named fields stored beside them are passed over, so
            a list that doubles as a record joins its list half and leaves the record half alone.
            The reads go through the table’s metamethods rather than around them, so a table
            standing in for another is joined like any other.
          </Prose>
          <Prose>
            The default <code>j</code> is measured with <code>#list</code>, which leaves a call
            that names no end position only as dependable as that length is. On a list whose
            elements sit at <code>1</code> through <code>#list</code> with no gaps there is one
            obvious answer; on a list with a gap in it there is not, and every caveat of the
            length operator applies here in full — a gap inside the run is a position holding
            nothing, which is exactly the case that raises.
          </Prose>
          <WordCount
            words={963}
            verdict="six paragraphs. The first restates the summary; the fifth and sixth are each one fact wearing a paragraph."
          />
        </Column>

        <Column tone="neutral" label="Trimmed">
          <Prose>
            <code>i</code> and <code>j</code> mark the run, and both ends are included. Left out
            they are <code>1</code> and <code>#list</code>. When <code>i</code> sits past{' '}
            <code>j</code> the run is empty and the answer is the empty string — which is also
            what an empty list gives, so a list that may have nothing in it needs no guard before
            joining.
          </Prose>
          <Prose>
            The run is read exactly as it is given and is never trimmed to fit the list. A{' '}
            <code>j</code> beyond the last element goes on reading positions that hold nothing,
            and nothing is not something this function can write out. Everything in the run has to
            be a string or a number; nothing else is converted.
          </Prose>
          <Prose>
            What falls outside the run is not read at all — so a list whose tail holds values{' '}
            <code>table.concat()</code> could not join still joins cleanly, as long as{' '}
            <code>j</code> stops before them. Only numbered positions take part, and the reads go
            through the table’s metamethods rather than around them.
          </Prose>
          <Prose>
            The default <code>j</code> is measured with <code>#list</code>, so a call naming no end
            position is only as dependable as that length is: every caveat of the length operator
            applies here in full.
          </Prose>
          <WordCount
            words={214}
            verdict="four paragraphs. The summary is not restated, and the two one-fact paragraphs are folded into their neighbours."
          />
        </Column>

        <Column tone="neutral" label="Minimal">
          <Prose>
            <code>i</code> and <code>j</code> mark the run and both ends are included; left out
            they are <code>1</code> and <code>#list</code>. An empty run gives the empty string
            rather than raising.
          </Prose>
          <Prose>
            The run is never trimmed to fit the list: a <code>j</code> past the last element reads
            positions holding nothing, which raises. Everything in the run has to be a string or a
            number.
          </Prose>
          <WordCount
            words={62}
            verdict="two paragraphs. Correct, and it has dropped the metamethod behaviour, the named-fields rule and the length-operator caveat — three things a reader can be bitten by."
          />
        </Column>
      </div>

      <Delta>
        <strong className="text-fd-foreground">What the three lengths actually show.</strong>{' '}
        Minimal is too short, and it is worth seeing <em>why</em>: it reads well and it silently
        drops three facts that cost a reader real time. So the answer to rule 6 is not "be
        shorter". Full’s defect is specific — the first paragraph restates the summary, and two
        later paragraphs each carry one fact at paragraph length. Trimmed keeps every fact and
        loses 78% of the words.
        <br />
        <br />
        That suggests rule 6 wants sharpening into something checkable by a person:{' '}
        <em>the Description does not restate the summary, and a paragraph carrying one fact
        joins its neighbour.</em> Both are things a reviewer can point at, which "earns its
        place" is not.
      </Delta>

      <DemoHeading>Identical in all three</DemoHeading>
      <p className="max-w-3xl text-sm text-fd-muted-foreground">
        Shown once, because none of it is what makes the entry long. Rendered with the real
        components.
      </p>

      <div className="my-5 rounded-xl border bg-fd-card p-4 sm:p-5">
        <Syntax>table.concat(list [, sep [, i [, j]]])</Syntax>
        <Parameters>
          <Param name="list">The list to read the elements from.</Param>
          <Param name="sep">
            What goes between one element and the next. Omitted, nothing does and the pieces run
            together.
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
        <Errors>
          <ul>
            <li>
              Raises when <code>list</code> is not a table.
            </li>
            <li>
              Raises when a position in the run holds anything other than a string or a number.
            </li>
            <li>
              Raises when <code>sep</code> is given and is neither a string nor a number.
            </li>
          </ul>
        </Errors>
        <div className="mt-4">
          <RunnableExample code={JOIN_EXAMPLE} />
        </div>
        <Note>
          Collecting the pieces into a list and joining them once is the usual way to build a long
          string in Lua. Strings are immutable, so appending with <code>..</code> inside a loop
          cannot extend one in place.
        </Note>
        <Gotcha title="The run is not clamped to the list">
          <code>j</code> is a position to read, not a limit to stop at, so asking for more than the
          list holds does not quietly give back what there is.
        </Gotcha>
      </div>
    </DemoShell>
  );
}

import { Callout, Gotcha, Note, Warning } from '@/entry/Callout';
import { Errors, Since } from '@/entry/Errors';
import { Only } from '@/entry/Only';
import { Param, Parameters } from '@/entry/Parameters';
import { Return, Returns } from '@/entry/Returns';
import { EntryProvenance } from '@/entry/EntryProvenance';
import { EntrySource } from '@/entry/EntrySource';
import { RunnableExample } from '@/runner/RunnableExample';
import { DemoHeading, DemoShell, Delta, Syntax } from './Shell';

/**
 * Every entry component on one page, firing at once.
 *
 * The subject is deliberately fictional — `demo.everything()` is not a Lua function and
 * cannot be mistaken for one, which is the only safe way to build a page like this. A real
 * symbol here would be a documentation page outside `content/docs`, unreachable by the
 * content guards and free to drift into being wrong.
 *
 * What it is for: no single real entry exercises every component, so nothing catches how
 * they interact — a `<Gotcha>` immediately after a `<Note>`, a version-scoped parameter
 * next to an unscoped one, `<Since>` inside `<Errors>`, the provenance panel under a
 * runnable card. Those seams are where spacing and rhythm defects live, and they are
 * invisible one entry at a time.
 *
 * Every component here is the real one, imported from `src/entry/` and `src/runner/`.
 */

const RUNNABLE = `local pieces = {"one", "two", "three"}
print(#pieces, table.concat(pieces, "+"))
-- Expected output: 3\tone+two+three`;

const FAILING = `print(("x"):rep(3))
-- Expected output: xxx`;

export function KitchenSink() {
  return (
    <DemoShell
      title="Kitchen sink"
      standfirst={
        <>
          <p>
            Every entry component on one page. The subject, <code>demo.everything()</code>, is
            fictional on purpose — a real symbol here would be a documentation page living
            outside <code>content/docs</code>, invisible to the content guards and free to
            drift into being wrong.
          </p>
          <p className="mt-3">
            No real entry fires all of these, so nothing catches how they interact: a Gotcha
            straight after a Note, a version-scoped parameter beside an unscoped one, a{' '}
            <code>Since</code> marker inside Errors, the provenance panel under a runnable
            card. Those seams are where spacing and rhythm defects live.
          </p>
        </>
      }
    >
      <Delta>
        Switch the version in the header while this page is open. The scoped parameter, the
        scoped return and the <code>Since</code> markers should all change together — and the
        Parameters heading should vanish entirely on a version that scopes every parameter
        away, which is the branch <code>Parameters.tsx</code> exists to handle.
      </Delta>

      <div className="my-6 rounded-xl border bg-fd-card p-4 sm:p-6">
        <h2 className="text-2xl font-semibold text-fd-foreground">demo.everything()</h2>
        <p className="mt-2 text-sm leading-6 text-fd-foreground">
          A fictional call that exists to exercise every component an entry can carry. It takes
          a required argument, an optional one, and one that only some versions have.
        </p>

        <RunnableExample code={RUNNABLE} />

        <DemoHeading>Syntax</DemoHeading>
        <Syntax>demo.everything(subject [, mode [, strict]])</Syntax>

        <Parameters>
          <Param name="subject">The value to work on. Present on every version.</Param>
          <Param name="mode">
            How to work on it. Omitted, it is <code>"default"</code>.
          </Param>
          <Only since="5.4">
            <Param name="strict">
              Only documented from 5.4 — this row should disappear below that version.
            </Param>
          </Only>
        </Parameters>

        <Returns>
          <Return type="integer">
            How many things were done. Names <code>integer</code>, so on 5.1 and 5.2 the numeric
            disclosure should appear above this list.
          </Return>
          <Only since="5.3">
            <Return type="boolean">
              A second return that only exists from 5.3, to check that a scoped return does not
              leave the heading behind on the versions that lack it.
            </Return>
          </Only>
        </Returns>

        <Errors>
          <ul>
            <li>
              Raises when <code>subject</code> is of a kind this call cannot take.
            </li>
            <li>
              <Since v="5.4" /> Raises when <code>strict</code> is given and is not a boolean.
            </li>
          </ul>
        </Errors>

        <DemoHeading>Description</DemoHeading>
        <p className="my-3 text-sm leading-6 text-fd-foreground">
          One paragraph, so the callouts below sit against prose rather than against each other.
          The interesting part of this page is what follows.
        </p>

        <Note>
          A <code>Note</code>, carrying neutral supplementary information. It is the quietest of
          the three and should read as an aside rather than as an interruption.
        </Note>

        <Warning>
          A <code>Warning</code>, for a real hazard — undefined behaviour, a crash, data loss.
          Directly under a Note on purpose: two callouts touching is the seam most likely to
          look wrong.
        </Warning>

        <Gotcha title="A Gotcha, immediately after a Warning">
          Surprising-but-not-dangerous semantics, and the site’s signature callout. Three
          callouts in a row is not a shape any real entry should have, which is exactly why it
          belongs here — if the spacing survives this, it survives anything.
        </Gotcha>

        <Callout kind="note" title="A Callout with an explicit title">
          The base component, rendering a kind the derived three do not cover on their own.
        </Callout>

        <Only before="5.4">
          <Note>
            A whole callout inside <code>&lt;Only before="5.4"&gt;</code>. It should be present
            on 5.1 to 5.3 and gone from 5.4 and 5.5.
          </Note>
        </Only>

        <DemoHeading>A second example, static rather than runnable</DemoHeading>
        <p className="my-3 text-sm leading-6 text-fd-foreground">
          Two example cards in one entry, to check the rhythm between them.
        </p>
        <RunnableExample code={FAILING} usesEntry={false} />

        <div className="mt-8">
          <EntrySource url="https://www.lua.org/manual/5.5/manual.html#pdf-table.concat" />
          <EntryProvenance
            reviewed={null}
            path="standard-library/table/concat.mdx"
            lastModified="2026-08-10"
          />
        </div>
      </div>

      <Delta>
        <strong className="text-fd-foreground">Known imperfection.</strong> The provenance panel
        and source citation above are wired to a real entry’s path, because they build GitHub
        edit and issue links from it and a fictional path would produce two dead links. So those
        two blocks describe <code>table/concat.mdx</code> while everything above them describes
        a function that does not exist. Better than dead links, worth knowing before reading
        them as part of the demo.
      </Delta>
    </DemoShell>
  );
}

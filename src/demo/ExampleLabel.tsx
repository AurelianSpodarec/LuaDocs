import { RunnableExample } from '@/runner/RunnableExample';
import { Column, DemoHeading, DemoShell, Delta } from './Shell';

/**
 * The example card's header label — `example.lua` against something that invites an edit.
 *
 * Recorded as unresolved in `docs/research/old-site-content.md`: our card exceeds MDN's
 * Try It in capability (editable, Run, Reset, output, a `ran in N ms` marker, a version
 * badge, and Open in Playground carrying the reader's own edits) and loses to it on the one
 * thing MDN spends the space on — saying that the box is interactive.
 *
 * No ADR claims this. The page exists so the question can be looked at rather than
 * described, and the variants are drawn as static headers rather than by forking
 * `RunnableExample`, because the whole argument is about a strip of text 30 pixels tall and
 * forking the component to compare it would be the more expensive way to learn nothing.
 */

const EXAMPLE = `local shopping_list = {"cocoa", "flour", "sugar"}
print(table.concat(shopping_list, ", "))
-- Expected output: cocoa, flour, sugar`;

/** The header strip as it renders today, and as three alternatives would. */
function HeaderStrip({ children, muted = true }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <div className="overflow-hidden rounded-t-xl border border-b-0 bg-fd-muted/50 px-4 py-2">
      <span
        className={`font-mono text-xs ${muted ? 'text-fd-muted-foreground' : 'text-fd-foreground'}`}
      >
        {children}
      </span>
    </div>
  );
}

function StripOnly({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="my-3">
      <p className="mb-1 text-xs text-fd-muted-foreground">{label}</p>
      {children}
      <div className="rounded-b-xl border border-t-0 bg-fd-card px-4 py-3 font-mono text-[0.8125rem] text-fd-muted-foreground">
        local shopping_list = …
      </div>
    </div>
  );
}

export function ExampleLabel() {
  return (
    <DemoShell
      title="The example card’s label"
      standfirst={
        <>
          <p>
            Our example card does more than MDN’s Try It — editable, Run, Reset, an output pane,
            a <code>ran in N ms</code> marker, a version-mismatch badge, and Open in Playground
            carrying the reader’s own edits. MDN’s does four of those and spends its header on
            the words <em>Try it</em>.
          </p>
          <p className="mt-3">
            Ours says <code>example.lua</code>: a filename, for a file that does not exist,
            identical on the lead example and on every example further down. So the card
            announces <em>here is code</em> rather than <em>you can edit this</em>, and the lead
            example is indistinguishable from the others despite doing a different job.
          </p>
        </>
      }
    >
      <DemoHeading>The real card, as it ships</DemoHeading>
      <p className="max-w-3xl text-sm text-fd-muted-foreground">
        The actual component. Everything below the header is what the alternatives keep.
      </p>
      <div className="my-5 max-w-2xl">
        <RunnableExample code={EXAMPLE} />
      </div>

      <Delta>
        Worth noticing before judging the label: <strong className="text-fd-foreground">Run
        and Reset are already visible</strong>, so the card is not undiscoverable. The question
        is narrower than "can a reader tell" — it is whether the header is spending its space on
        the most useful thing available, and <code>example.lua</code> is a fiction that tells a
        reader nothing.
      </Delta>

      <DemoHeading>Four headers</DemoHeading>
      <p className="max-w-3xl text-sm text-fd-muted-foreground">
        Drawn as static strips rather than by forking the component — the whole argument is
        about 30 pixels of text, and forking to compare it would be the expensive way to learn
        nothing.
      </p>

      <div className="my-5 grid gap-4 lg:grid-cols-2">
        <Column tone="now" label="As shipped">
          <StripOnly label="A filename for a file that does not exist.">
            <HeaderStrip>example.lua</HeaderStrip>
          </StripOnly>
        </Column>

        <Column tone="proposed" label="MDN’s move">
          <StripOnly label="Says what the box is. Loses the language.">
            <HeaderStrip muted={false}>Try it</HeaderStrip>
          </StripOnly>
        </Column>

        <Column tone="proposed" label="Both">
          <StripOnly label="Keeps the language, adds the invitation. Busiest of the four.">
            <HeaderStrip muted={false}>
              Try it{' '}
              <span className="font-normal text-fd-muted-foreground">· Lua — editable</span>
            </HeaderStrip>
          </StripOnly>
        </Column>

        <Column tone="proposed" label="Lead only">
          <StripOnly label="Only the first example is an invitation; later ones stay plain.">
            <HeaderStrip muted={false}>Try it</HeaderStrip>
          </StripOnly>
        </Column>
      </div>

      <Delta>
        <strong className="text-fd-foreground">The fourth is the interesting one.</strong> The
        lead example and the ones under <code>## Examples</code> do different jobs — one orients
        a reader who has just arrived, the others demonstrate specific behaviour — and today
        they are labelled identically. Distinguishing only the lead costs one prop
        (<code>RunnableExample</code> already takes <code>usesEntry</code>, so the precedent for
        a per-card flag exists) and it is the only variant that fixes the second half of the
        problem rather than just the first.
        <br />
        <br />
        Against it: an author now has to remember which card is the lead. That is the kind of
        thing that goes wrong on entry 200, and it argues for the renderer deciding — the first
        card in an entry is the lead by position, with no prop at all.
      </Delta>
    </DemoShell>
  );
}

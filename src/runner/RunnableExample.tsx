import { useEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Check, Play, RotateCcw, SquareTerminal, Terminal } from 'lucide-react';
import { hashForProgram } from '@/playground/shareUrl';
import { runLua, RUNTIME_LUA_VERSION } from './runLua';
import { highlightLua, type LuaToken } from './highlightLua';
import { useSelectedVersion } from '@/version/SelectedVersionProvider';
import { useEntryUnavailable, useEntryUnavailableIn } from '@/version/EntryAvailability';

// Re-exported because it was defined here first and is imported from here in tests and
// in content. It belongs to the runner: the playground has to disclose the same fact.
export { RUNTIME_LUA_VERSION };

/** Shared by the two layers below — they only line up while these stay identical. */
const codeLayer = 'px-4 py-3 font-mono text-[0.8125rem] leading-6 whitespace-pre-wrap break-words';

/**
 * One card, three stacked panes: the editor, the toolbar, and the output. Each pane
 * is separated by a rule rather than by a gap, so the example reads as a single
 * object in the flow of prose rather than as three loose controls.
 *
 * The editor is the standard two-layer trick — a highlighted `<pre>` painted behind a
 * transparent `<textarea>` — because there is no way to colour text inside a textarea.
 * The two layers must agree on every metric that moves a glyph (font, size, leading,
 * padding, wrapping), which is why those live in one shared constant rather than being
 * written out twice. The textarea still owns the height, so `rows` drives both.
 */
export function RunnableExample({
  code,
  usesEntry = true,
}: {
  code: string;
  /**
   * Whether this example's code uses the symbol its entry documents. Default `true`,
   * because that is what an example normally is.
   *
   * It exists for the fork where it is not. An entry for a symbol Lua has *removed*
   * shows the replacement in every example — `#list` on `table.getn()`, `pairs` on
   * `table.foreach()` — so the code runs, and is precisely what a reader arriving at the
   * default version came for. Suppression keyed on the entry hid all four of `getn`'s
   * cards from everyone on 5.5, captioned "Not in Lua 5.5", attached to
   * `print(#shipping_labels)`.
   *
   * Declared per example rather than inferred by looking for the entry's own name in the
   * code: the entry's prose names the removed call in a comment beside the replacement,
   * so a scan would go on suppressing exactly the examples this frees, and would do it
   * silently. An author says which it is; the renderer does not guess.
   */
  usesEntry?: boolean;
}) {
  const { version } = useSelectedVersion();
  const entryUnavailable = useEntryUnavailable();
  // An example that does not touch the symbol is not a demonstration of it, so nothing
  // about the entry's availability makes its output misleading.
  const unavailable = entryUnavailable && usesEntry;
  // The second reading of the same dataset: whether the Lua that actually executes has
  // the entry. It is what makes the badge below able to say something true in both
  // directions — the reader's version can sit either side of the runtime's.
  const missingFromRuntime = useEntryUnavailableIn(RUNTIME_LUA_VERSION);
  const [source, setSource] = useState(code);
  const [output, setOutput] = useState('');
  const [failed, setFailed] = useState(false);
  const [running, setRunning] = useState(false);
  /**
   * The last completed run, and whether it belongs to the code on screen.
   *
   * The output pane alone cannot say whether anything executed: examples run on mount,
   * and ADR 0008 puts the expected output in the code as a comment, so a reader arriving
   * cold sees text that could equally be an echo of that comment. `null` after an edit,
   * because output from the previous source is exactly what a reader must not mistake
   * for a result.
   *
   * `ms` is the chunk's own time, measured inside the worker. A caller that does not
   * report one still gets the marker — that it ran is the point; how fast is the detail.
   */
  const [ran, setRan] = useState<{ ms?: number } | null>(null);
  const [highlighted, setHighlighted] = useState<LuaToken[][] | null>(null);
  const pre = useRef<HTMLPreElement>(null);
  /**
   * Which run the displayed output belongs to.
   *
   * A run is asynchronous and the selected version arrives after mount, so the run
   * started at the default version can resolve *after* the reader turns out not to have
   * this entry — putting its output back on a page that has just cleared it. Results
   * from a superseded run are dropped rather than shown.
   */
  const runId = useRef(0);

  function show(text: string, isError: boolean) {
    setOutput(text);
    setFailed(isError);
  }

  async function run(input: string) {
    const id = ++runId.current;
    const current = () => runId.current === id;

    setRunning(true);
    try {
      const r = await runLua(input);
      if (!current()) return;
      show(r.error ? `error: ${r.error}` : r.output, Boolean(r.error));
      setRan({ ms: r.ms });
    } catch (err) {
      if (!current()) return;
      show(`error: ${err instanceof Error ? err.message : String(err)}`, true);
      setRan({});
    } finally {
      if (current()) setRunning(false);
    }
  }

  // An example whose output you have to ask for is a screenshot with extra steps: the
  // result is part of what the entry documents, so it is there when the entry is. Only
  // on mount, and only for the authored code — after that, running is the reader's
  // call, because their edit may be halfway through a thought.
  useEffect(() => {
    // Not where the reader's version does not have what this example uses. Running would
    // print a result for a function they cannot call, and an unasked-for demonstration
    // outweighs a notice further up the page. The Run button still works — this withholds
    // the claim, it does not withhold the tool.
    //
    // `unavailable` is the example's fact, not the entry's: an example on a removed entry
    // that shows the replacement runs like any other, because nothing in it is missing.
    //
    // Clearing rather than merely skipping, because the selected version is not known
    // on the first pass: `SelectedVersionProvider` renders the default so the prerender
    // and the hydrating client agree, and resolves the reader's real version after
    // mount. So an example on a 5.3-only entry has already run and printed by the time
    // a 5.1 reader's version arrives, and skipping the *next* run would leave that
    // output sitting there as though it were theirs.
    if (unavailable) {
      runId.current += 1; // Supersedes a run still in flight from the default version.
      show('', false);
      setRan(null);
      setRunning(false);
      return;
    }
    void run(code);
  }, [code, unavailable]);

  // Highlighting is asynchronous (shiki loads on demand), so the `<pre>` paints the
  // raw text until the first pass lands. That is also what the prerendered HTML holds,
  // which is why it must be legible on its own rather than a blank placeholder.
  useEffect(() => {
    let current = true;
    highlightLua(source).then(
      (lines) => {
        if (current) setHighlighted(lines);
      },
      () => {
        // Losing colour is not worth losing the editor over.
      },
    );
    return () => {
      current = false;
    };
  }, [source]);

  // The textarea grows with the code rather than sitting at a fixed four rows, so a
  // one-line example is not three-quarters empty box.
  const rows = Math.min(20, Math.max(2, source.split('\n').length));

  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border bg-fd-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b bg-fd-muted/50 px-4 py-2">
        <span className="font-mono text-xs text-fd-muted-foreground">example.lua</span>
        {unavailable ? (
          <span
            role="note"
            aria-label="Runtime version"
            data-example-unavailable
            className="text-xs text-amber-700 dark:text-amber-400"
          >
            {/* The claim this replaced was "Running this uses a newer Lua than you have
                selected", which is a guess about a direction rather than a fact: the
                runtime is one fixed version, so the sentence was false for every reader
                above it — including at the site's own default, where 5.4 is the older
                Lua. What a reader needs is not which way the gap points but whether the
                thing they are being kept from running exists over there, and the dataset
                answers that outright. */}
            Not in Lua {version}. Running this uses Lua {RUNTIME_LUA_VERSION}, which{' '}
            {missingFromRuntime ? 'does not have it either' : 'does have it'}.
          </span>
        ) : (
          version !== RUNTIME_LUA_VERSION && (
            <span role="note" aria-label="Runtime version" className="text-xs text-fd-muted-foreground">
              Runs Lua {RUNTIME_LUA_VERSION}; output may differ from {version}.
            </span>
          )
        )}
      </div>

      <div className="relative">
        <pre
          ref={pre}
          aria-hidden
          data-lua-code
          className={`pointer-events-none absolute inset-0 overflow-hidden text-fd-foreground ${codeLayer}`}
        >
          {highlighted
            ? highlighted.map((line, i) => (
                <span key={i}>
                  {line.map((token, j) => (
                    <span key={j} style={token.style}>
                      {token.content}
                    </span>
                  ))}
                  {'\n'}
                </span>
              ))
            : source}
        </pre>
        <textarea
          value={source}
          onChange={(e) => {
            setSource(e.target.value);
            setRan(null);
          }}
          // The layers scroll as one: the textarea is the only one the reader can
          // scroll, so it drags the `<pre>` along by hand.
          onScroll={(e) => {
            if (!pre.current) return;
            pre.current.scrollTop = e.currentTarget.scrollTop;
            pre.current.scrollLeft = e.currentTarget.scrollLeft;
          }}
          aria-label="Editable example"
          spellCheck={false}
          rows={rows}
          className={`relative block w-full resize-y bg-transparent text-transparent caret-fd-foreground outline-none focus-visible:bg-fd-accent/20 ${codeLayer}`}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t bg-fd-muted/30 px-3 py-2">
        <button
          onClick={() => void run(source)}
          disabled={running}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-fd-primary px-3 py-1.5 text-xs font-medium text-fd-primary-foreground transition-opacity hover:opacity-85 disabled:cursor-default disabled:opacity-60"
        >
          <Play aria-hidden className="size-3.5" />
          {running ? 'Running…' : 'Run'}
        </button>
        <button
          onClick={() => {
            setSource(code);
            void run(code);
          }}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
        >
          <RotateCcw aria-hidden className="size-3.5" />
          Reset
        </button>

        {/* The seam between an entry and the playground, and the reason the playground
            is worth having: a reader who has outgrown four lines in a card leaves with
            their own edits, not with the authored example. The program travels in the
            link (`shareUrl.ts`), so there is nothing to hand over and nothing to store. */}
        <Link
          to="/playground"
          hash={hashForProgram(source)}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
        >
          <SquareTerminal aria-hidden className="size-3.5" />
          Open in Playground
        </Link>

        {/* Proof that something executed, here, just now. Without it the output pane is
            indistinguishable from the expected-output comment sitting in the code above
            it, and an edited example still showing the old result reads as a fresh one. */}
        {ran && !running && (
          <span
            data-ran
            className="ms-auto inline-flex items-center gap-1.5 font-mono text-xs text-fd-muted-foreground"
          >
            <Check aria-hidden className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            {ran.ms === undefined
              ? 'ran'
              : `ran in ${ran.ms < 1 ? ran.ms.toFixed(2) : Math.round(ran.ms)} ms`}
          </span>
        )}
      </div>

      {output && (
        <div className="border-t">
          <div className="flex items-center gap-1.5 border-b bg-fd-muted/30 px-4 py-1.5 text-[0.6875rem] font-medium uppercase tracking-wider text-fd-muted-foreground">
            <Terminal aria-hidden className="size-3" />
            Output
          </div>
          <pre
            aria-label="output"
            data-error={failed || undefined}
            className="overflow-x-auto px-4 py-3 font-mono text-[0.8125rem] leading-6 text-fd-foreground data-[error]:text-fd-error"
          >
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}

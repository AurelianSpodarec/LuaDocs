import { useEffect, useRef, useState } from 'react';
import { Check, Play, RotateCcw, Terminal } from 'lucide-react';
import { runLua } from './runLua';
import { highlightLua, type LuaToken } from './highlightLua';
import { useSelectedVersion } from '@/version/SelectedVersionProvider';

/**
 * The Lua version the runtime actually executes. Wasmoon ships a single Lua, so
 * examples run this version whatever the reader has selected — see
 * `docs/plans/2026-08-04-per-version-lua-spike.md`. Until per-version runtimes
 * exist, the mismatch is disclosed rather than hidden.
 */
export const RUNTIME_LUA_VERSION = '5.4';

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
export function RunnableExample({ code }: { code: string }) {
  const { version } = useSelectedVersion();
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

  function show(text: string, isError: boolean) {
    setOutput(text);
    setFailed(isError);
  }

  async function run(input: string) {
    setRunning(true);
    try {
      const r = await runLua(input);
      show(r.error ? `error: ${r.error}` : r.output, Boolean(r.error));
      setRan({ ms: r.ms });
    } catch (err) {
      show(`error: ${err instanceof Error ? err.message : String(err)}`, true);
      setRan({});
    } finally {
      setRunning(false);
    }
  }

  // An example whose output you have to ask for is a screenshot with extra steps: the
  // result is part of what the entry documents, so it is there when the entry is. Only
  // on mount, and only for the authored code — after that, running is the reader's
  // call, because their edit may be halfway through a thought.
  useEffect(() => {
    void run(code);
  }, [code]);

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
        {version !== RUNTIME_LUA_VERSION && (
          <span role="note" aria-label="Runtime version" className="text-xs text-fd-muted-foreground">
            Runs Lua {RUNTIME_LUA_VERSION}; output may differ from {version}.
          </span>
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

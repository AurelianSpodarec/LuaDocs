import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  Check,
  Code,
  Columns2,
  IndentIncrease,
  Link as LinkIcon,
  Maximize2,
  Play,
  RotateCcw,
  Rows2,
  Terminal,
} from 'lucide-react';
import { DEFAULT_VERSION, LUA_VERSIONS } from '@/compat/schema';
import { runLua, RUNTIME_LUA_VERSION } from '@/runner/runLua';
import { Editor } from './Editor';
import { errorLine as lineOfError } from './errorLine';
import { SEED_PROGRAM } from './seed';
import { canShare, hashForProgram, programFromHash } from './shareUrl';
import { tidy } from './tidy';

/**
 * Longer than the three seconds an inline example gets. An example is four lines the
 * author already knows terminate; a playground is where somebody writes a loop over a
 * million iterations to see how long it takes, and being cut off at three seconds would
 * read as the runtime being broken rather than as a guard.
 */
const TIMEOUT_MS = 5000;

const LAYOUT_KEY = 'luadocs.playground.layout';
const SPLIT_KEY = 'luadocs.playground.split';

type LayoutMode = 'split-vertical' | 'split-horizontal' | 'editor';

/**
 * What the status line is currently saying.
 *
 * Shared by Share and Tidy, because both are actions whose entire outcome is a sentence:
 * one puts something on a clipboard the reader cannot see, the other may correctly change
 * nothing at all. Silence is not an acceptable answer to either.
 */
type Notice = 'idle' | 'link-copied' | 'link-in-url' | 'link-too-long' | 'tidied' | 'tidy-undone';

const NOTICES: Record<Exclude<Notice, 'idle'>, string> = {
  'link-copied': 'Link copied — it carries the whole program.',
  'link-in-url': 'Link is in the address bar — copying it needs clipboard permission.',
  'link-too-long': 'This program is too long to fit in a link. Shorten it, or share it as a file.',
  tidied: 'Re-indented. Only whitespace changed.',
  'tidy-undone': 'Back to how you had it.',
};

const LAYOUTS: { mode: LayoutMode; label: string; icon: typeof Columns2 }[] = [
  { mode: 'split-vertical', label: 'Editor and output side by side', icon: Columns2 },
  { mode: 'split-horizontal', label: 'Editor above output', icon: Rows2 },
  { mode: 'editor', label: 'Editor only', icon: Maximize2 },
];

/**
 * Both pane headers, from one constant, so Input and Output cannot drift apart.
 *
 * The height is fixed rather than left to `py-*`. Each header was previously sized by
 * whatever sat in it — Output by the `ran in 5 ms` marker at 16px, Input by the Tidy
 * button at 20.5px — so they came out 29.5px and 33.5px, and the two panes started at
 * different heights. Anything that grows a control would have done it again.
 *
 * `shrink-0` because the header sits above a `min-h-0` scrolling pane, which will
 * otherwise take its space back the moment the output is long.
 *
 * `pt-px` centres the row on the header's *visual* box rather than its content box. The
 * `border-b` is part of the height but not part of what `items-center` centres within,
 * so everything in the row sat half a pixel high. The remaining quarter-pixel is the
 * label itself: `INPUT` and `OUTPUT` have no descenders, and flex centres the line box
 * including the descender space the font reserves and the glyphs never use.
 *
 * `pe-2` against `ps-4`: the trailing control is a button whose own padding reads as
 * space, so matching the leading inset put the word twice as far from the edge as it
 * looked. Asymmetric on purpose.
 */
const PANE_HEADER =
  'flex h-8 shrink-0 items-center gap-1.5 border-b bg-fd-muted/30 ps-4 pe-2 pt-px text-[0.6875rem] font-medium uppercase tracking-wider text-fd-muted-foreground';

/** Neither pane may be squeezed to nothing, however hard the divider is dragged. */
const MIN_FRACTION = 0.15;
const MAX_FRACTION = 0.85;

const clamp = (value: number) => Math.min(MAX_FRACTION, Math.max(MIN_FRACTION, value));

/**
 * The standalone editor.
 *
 * Its job is not to be a second product alongside the docs — it is the escape hatch from
 * an inline example. A reader hits the ceiling of a four-line snippet on an entry, clicks
 * through, and arrives here with that program already loaded and already run.
 *
 * Three things Tailwind Play does are deliberately not copied. Its 50/50 split is earned
 * by a rendered page; Lua output is a transcript that is three lines or thirty, so the
 * divider moves and remembers where it was put. It has no Run button because CSS
 * compilation always terminates, and `while true do end` does not. And its version
 * control swaps the compiler, where ours cannot yet — so the switcher ships inert and
 * says so, rather than implying a fidelity the runtime has not got.
 */
export function Playground() {
  const [source, setSource] = useState(SEED_PROGRAM);
  const [output, setOutput] = useState('');
  const [failed, setFailed] = useState(false);
  const [running, setRunning] = useState(false);
  const [ran, setRan] = useState<{ ms?: number } | null>(null);
  const [errorAt, setErrorAt] = useState<number | null>(null);

  /** The source as it was before Tidy, so Tidy can be taken back. Cleared by any edit. */
  const [beforeTidy, setBeforeTidy] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice>('idle');

  const [layout, setLayout] = useState<LayoutMode>('split-vertical');
  const [fraction, setFraction] = useState(0.5);

  const run = useCallback(async (input: string) => {
    setRunning(true);
    try {
      const result = await runLua(input, { timeoutMs: TIMEOUT_MS });
      setOutput(result.error ? `error: ${result.error}` : result.output);
      setFailed(Boolean(result.error));
      setRan({ ms: result.ms });
      setErrorAt(result.error ? lineOfError(result.error, input.split('\n').length) : null);
    } catch (thrown) {
      setOutput(`error: ${thrown instanceof Error ? thrown.message : String(thrown)}`);
      setFailed(true);
      setRan({});
      setErrorAt(null);
    } finally {
      setRunning(false);
    }
  }, []);

  // `run` in a ref so the mount effect below can call it without listing it as a
  // dependency and re-running the whole arrival sequence.
  const runRef = useRef(run);
  runRef.current = run;

  /**
   * Arrival. The initial render is always the starter program so that prerender and
   * hydration agree — the same reason `SelectedVersionProvider` defers to an effect —
   * and a shared program replaces it once we are client-side.
   *
   * It runs on arrival for the same reason an inline example does: a playground whose
   * output pane is empty until you press something has not shown you it works.
   */
  useEffect(() => {
    const fromLink = programFromHash(window.location.hash);
    if (fromLink) setSource(fromLink);
    void runRef.current(fromLink ?? SEED_PROGRAM);
  }, []);

  // Layout preferences, read after mount for the same hydration reason.
  useEffect(() => {
    try {
      const storedLayout = localStorage.getItem(LAYOUT_KEY);
      if (LAYOUTS.some((option) => option.mode === storedLayout)) {
        setLayout(storedLayout as LayoutMode);
      }
      const storedSplit = Number(localStorage.getItem(SPLIT_KEY));
      if (Number.isFinite(storedSplit) && storedSplit > 0) setFraction(clamp(storedSplit));
    } catch {
      // Storage access can throw (Safari private mode, storage-blocked embeds).
      // The defaults are perfectly usable; persistence is best-effort only.
    }
  }, []);

  const remember = useCallback((key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // As above — a preference that fails to persist is not worth an error.
    }
  }, []);

  const edit = useCallback((next: string) => {
    setSource(next);
    // Output belonging to code no longer on screen is the one thing a reader must not
    // mistake for a result — the same rule the inline example follows.
    setRan(null);
    setBeforeTidy(null);
    setNotice('idle');
    setErrorAt(null);
  }, []);

  const tidied = useMemo(() => tidy(source), [source]);

  /**
   * Tidy is never disabled — it was, and a greyed control that does nothing when pressed
   * reads as a broken one however correct it is.
   *
   * It says what it changed when it changes something. Re-indenting a program that is
   * already indented says nothing at all: there is no news in it, and a line of prose
   * announcing that nothing happened is worse than the quiet.
   */
  const toggleTidy = useCallback(() => {
    if (beforeTidy !== null) {
      setSource(beforeTidy);
      setBeforeTidy(null);
      setNotice('tidy-undone');
      return;
    }
    // Clear rather than leave: a stale "Re-indented" above a buffer that was not
    // re-indented is the one wrong thing this could say.
    if (tidied === source) {
      setNotice('idle');
      return;
    }
    setBeforeTidy(source);
    setSource(tidied);
    setNotice('tidied');
  }, [beforeTidy, source, tidied]);

  const share = useCallback(async () => {
    if (!canShare(source)) {
      setNotice('link-too-long');
      return;
    }

    // Built from the current URL rather than from scratch, so the `?v=` the version
    // switcher maintains travels with the program instead of being dropped.
    const url = new URL(window.location.href);
    url.hash = hashForProgram(source);
    window.history.replaceState({}, '', url);

    try {
      await navigator.clipboard.writeText(url.toString());
      setNotice('link-copied');
    } catch {
      // Clipboard access is refused over plain HTTP and in some embeds. The link is in
      // the address bar either way, which is a working answer rather than a dead end.
      setNotice('link-in-url');
    }
  }, [source]);

  return (
    // `data-playground` is what `app.css` looks for to stand the page's reserved
    // scrollbar gutter down. This page is exactly viewport-high and never scrolls the
    // document, so the reserved strip is empty on every screen it is drawn on.
    <div data-playground className="flex h-dvh flex-col overflow-hidden bg-fd-background">
      <header className="flex flex-wrap items-center gap-x-2 gap-y-1 border-b bg-fd-card px-3 py-2">
        {/* A wordmark, and only a wordmark — Tailwind Play's pattern. Not a back button
            and a breadcrumb: most readers arrive on a shared link and were never in the
            docs, so "back" named a direction they had not come from.

            It does not link anywhere either. A title that navigates is a control wearing
            a label's clothes, and the one place it could go — some arbitrary entry — is
            not where any particular reader was. The way into the docs is the same as the
            way into the playground: the sidebar destinations block (ADR 0007). */}
        {/* `cursor-default`, because the browser's default over text is an I-beam, and an
            I-beam says "this is content you are about to select". A wordmark is neither
            that nor a control; it should feel like part of the chrome, and the chrome
            carries an arrow. */}
        <h1 className="flex cursor-default items-baseline gap-1.5 px-1.5 py-1 text-sm">
          <span className="font-semibold">LuaDocs</span>
          <span className="font-light uppercase tracking-[0.2em] text-fd-muted-foreground">
            Playground
          </span>
        </h1>

        {/* Left, beside the title, rather than out with the actions on the right. The
            version is a statement about what you are looking at — the same thing the
            title says — and the disclosure only reads as a caveat on it while it is
            next to it. Over on the right it sat among Tidy, Share and Run, where a
            sentence about the runtime looks like a control that failed to render. */}
        <div className="me-auto flex items-center gap-1.5">
          <RuntimeVersion />

          {/* Against the **latest** Lua, not against a selected version.

              The playground has no selected version: it documents nothing, so there is
              no content for a version to choose, and the control beside this one is
              pinned shut for exactly that reason. Comparing against whatever the reader
              last picked in the docs made the same page say "differ from 5.1" to one
              person and "differ from 5.5" to another, about output that is identical in
              both cases. The fact is fixed — this runs 5.4, the current line is 5.5 —
              so the sentence is fixed too. */}
          {DEFAULT_VERSION !== RUNTIME_LUA_VERSION && (
            <span
              role="note"
              aria-label="Runtime version"
              className="hidden text-xs text-fd-muted-foreground sm:inline"
            >
              Runs Lua {RUNTIME_LUA_VERSION}; output may differ from {DEFAULT_VERSION}.
            </span>
          )}
        </div>

        <div role="group" aria-label="Layout" className="ms-2 flex items-center gap-0.5">
          {LAYOUTS.map(({ mode, label, icon: Icon }) => (
            <button
              key={mode}
              type="button"
              aria-label={label}
              aria-pressed={layout === mode}
              onClick={() => {
                setLayout(mode);
                remember(LAYOUT_KEY, mode);
              }}
              className="cursor-pointer rounded-md p-1.5 text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground aria-pressed:bg-fd-accent aria-pressed:text-fd-accent-foreground"
            >
              <Icon aria-hidden className="size-4" />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => void share()}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
          >
            <LinkIcon aria-hidden className="size-3.5" />
            Share
          </button>

          {/* Share and Reset are opposites — one keeps the reader's program, the other
              throws it away — and they sat flush against each other as identical grey
              text, which is how a misclick happens. `aria-hidden`: the grouping is
              already carried by the reset button's own wording for anyone not seeing it. */}
          {/* `fd-border` is tuned to separate large surfaces, and at 1×16px it all but
              vanished. A divider whose whole job is to be noticed has to be drawn like
              the text it sits between, not like the edge of a panel. */}
          <span
            aria-hidden
            data-action-divider
            className="mx-1 h-5 w-px shrink-0 self-center bg-fd-muted-foreground"
          />

          <button
            type="button"
            onClick={() => {
              setSource(SEED_PROGRAM);
              setBeforeTidy(null);
              void run(SEED_PROGRAM);
            }}
            // Reset is the one control here that can lose work. It is recoverable —
            // CodeMirror's history covers it, because Reset reaches the document as an
            // ordinary edit — and saying so is cheaper than a confirmation dialog for
            // something a reader may well press deliberately twenty times.
            title="Restore the starter program. Ctrl+Z brings yours back."
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
          >
            <RotateCcw aria-hidden className="size-3.5" />
            Reset
          </button>

          <button
            type="button"
            onClick={() => void run(source)}
            disabled={running}
            title="Run (Ctrl+Enter)"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-fd-primary px-3 py-1.5 text-xs font-medium text-fd-primary-foreground transition-opacity hover:opacity-85 disabled:cursor-default disabled:opacity-60"
          >
            <Play aria-hidden className="size-3.5" />
            {running ? 'Running…' : 'Run'}
          </button>
        </div>
      </header>

      {/* Live, because Share's whole outcome is a sentence — a reader who cannot see the
          clipboard has no other way to learn whether it worked. */}
      <p
        role="status"
        aria-live="polite"
        data-notice={notice}
        className={`border-b px-3 py-1.5 text-xs ${notice === 'idle' ? 'sr-only' : notice === 'link-too-long' ? 'text-fd-error' : 'text-fd-muted-foreground'}`}
      >
        {notice !== 'idle' && NOTICES[notice]}
      </p>

      <Panes
        layout={layout}
        fraction={fraction}
        onFraction={(next) => {
          setFraction(next);
          remember(SPLIT_KEY, String(next));
        }}
        editor={
          /* A header on the editor pane to match the one the output pane already had —
             Tailwind Play's arrangement, filename on the left and Tidy on the right.

             Tidy belongs here rather than out with Share, Reset and Run. Those three act
             on the session; Tidy acts on the buffer directly below it, and sitting in the
             same row as the filename says so. It also means Tidy survives editor-only
             mode, where the global header's actions are the only ones left. */
          <section aria-label="Input" className="flex h-full min-h-0 flex-col">
            {/* Input against Output, in the same small-caps as the pane opposite. A
                filename said less and matched nothing: there is one buffer, it is never
                saved, and `main.lua` implied a project that does not exist. */}
            <div data-pane-header className={PANE_HEADER}>
              <Code aria-hidden className="size-3" />
              Input
              <button
                type="button"
                onClick={toggleTidy}
                title="Re-indent the program. Only whitespace changes."
                // `-me-1` cancels the button's own right padding, so the word "Tidy"
                // ends level with "ran in 4 ms" in the pane opposite instead of being
                // pushed in by padding nested inside padding. The padding itself stays,
                // for the hover background to sit on.
                className="-me-1 ms-auto inline-flex cursor-pointer items-center gap-1.5 rounded px-1 py-0.5 font-medium normal-case tracking-normal text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
              >
                <IndentIncrease aria-hidden className="size-3" />
                {beforeTidy === null ? 'Tidy' : 'Undo tidy'}
              </button>
            </div>
            <div className="min-h-0 flex-1">
              <Editor
                value={source}
                onChange={edit}
                onRun={() => void run(source)}
                errorLine={errorAt}
              />
            </div>
          </section>
        }
        outputPane={
          <section aria-label="Output" className="flex h-full min-h-0 flex-col">
            <div data-pane-header className={PANE_HEADER}>
              <Terminal aria-hidden className="size-3" />
              Output
              {ran && !running && (
                <span
                  data-ran
                  className="ms-auto inline-flex items-center gap-1.5 font-mono text-xs normal-case tracking-normal"
                >
                  <Check aria-hidden className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  {ran.ms === undefined
                    ? 'ran'
                    : `ran in ${ran.ms < 1 ? ran.ms.toFixed(2) : Math.round(ran.ms)} ms`}
                </span>
              )}
            </div>
            <pre
              aria-label="output"
              data-error={failed || undefined}
              className="min-h-0 flex-1 overflow-auto px-4 py-3 font-mono text-[0.8125rem] leading-6 text-fd-foreground data-[error]:text-fd-error"
            >
              {output}
            </pre>
          </section>
        }
      />
    </div>
  );
}

/**
 * The version the playground runs, which is 5.4 and is not the reader's to choose.
 *
 * Deliberately **not** the `VersionSwitcher` the docs use. That control sets the
 * selected version, and the selected version decides which *content* you see — a real
 * choice, on every entry. Here it would have decided nothing: wasmoon ships one Lua, so
 * picking 5.1 changed a label and not a single byte of what executed. Offering the
 * choice and then disclaiming it is worse than not offering it, because the reader has
 * to take an action before the site admits the action did nothing.
 *
 * So it states a fact instead, and is disabled because the fact is not negotiable yet.
 * It stays a `<select>` rather than becoming a chip because roadmap slice 6 turns it
 * back into a live control, and the shape of what is coming is worth showing.
 *
 * It does not read or write `SelectedVersionProvider`. The reader's selected version
 * still belongs to the docs, is what the disclosure beside this compares against, and
 * is what a shared link carries in `?v=`.
 */
function RuntimeVersion() {
  return (
    <select
      aria-label="Lua version"
      disabled
      // Controlled, not `defaultValue`: React then re-asserts the runtime version on
      // every render, so nothing can leave the control showing a version that is not
      // the one executing. No `onChange` is needed, and React does not ask for one on a
      // disabled field.
      value={RUNTIME_LUA_VERSION}
      title={`The playground runs Lua ${RUNTIME_LUA_VERSION}. Per-version runtimes are not built yet.`}
      className="cursor-not-allowed rounded-md border bg-fd-secondary px-1.5 py-1 text-xs font-medium text-fd-secondary-foreground tabular-nums opacity-70"
    >
      {LUA_VERSIONS.map((luaVersion) => (
        <option key={luaVersion} value={luaVersion}>
          v{luaVersion}
        </option>
      ))}
    </select>
  );
}

/**
 * The two panes and the divider between them.
 *
 * The divider's axis is read off the container's computed `flex-direction` rather than
 * inferred from `layout`, because the two disagree: below `md` the side-by-side layout
 * renders stacked so the panes are not two useless columns on a phone. Reading the
 * rendered value means the drag maths cannot fall out of step with the breakpoint.
 */
function Panes({
  layout,
  fraction,
  onFraction,
  editor,
  outputPane,
}: {
  layout: LayoutMode;
  fraction: number;
  onFraction: (next: number) => void;
  editor: ReactNode;
  outputPane: ReactNode;
}) {
  const container = useRef<HTMLDivElement>(null);

  const dragTo = useCallback(
    (clientX: number, clientY: number) => {
      const node = container.current;
      if (!node) return;

      const box = node.getBoundingClientRect();
      const vertical = getComputedStyle(node).flexDirection.startsWith('column');
      const next = vertical
        ? (clientY - box.top) / box.height
        : (clientX - box.left) / box.width;

      if (Number.isFinite(next)) onFraction(clamp(next));
    },
    [onFraction],
  );

  if (layout === 'editor') {
    return <main className="min-h-0 flex-1">{editor}</main>;
  }

  const row = layout === 'split-vertical';

  return (
    <main
      ref={container}
      className={`flex min-h-0 flex-1 flex-col ${row ? 'md:flex-row' : ''}`}
    >
      <div className="min-h-0 min-w-0 overflow-hidden" style={{ flex: `${fraction} 1 0%` }}>
        {editor}
      </div>

      <div
        role="separator"
        aria-orientation={row ? 'vertical' : 'horizontal'}
        aria-label="Resize the output pane"
        aria-valuenow={Math.round(fraction * 100)}
        aria-valuemin={Math.round(MIN_FRACTION * 100)}
        aria-valuemax={Math.round(MAX_FRACTION * 100)}
        tabIndex={0}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
          dragTo(event.clientX, event.clientY);
        }}
        onPointerUp={(event) => {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        // The divider is reachable and movable from the keyboard, because a control
        // only a mouse can operate is one a keyboard reader simply does not have.
        onKeyDown={(event) => {
          const step =
            event.key === 'ArrowLeft' || event.key === 'ArrowUp'
              ? -0.02
              : event.key === 'ArrowRight' || event.key === 'ArrowDown'
                ? 0.02
                : 0;
          if (!step) return;
          event.preventDefault();
          onFraction(clamp(fraction + step));
        }}
        className={`shrink-0 touch-none bg-fd-border transition-colors hover:bg-fd-primary focus-visible:bg-fd-primary focus-visible:outline-none ${
          row ? 'h-1 cursor-row-resize md:h-auto md:w-1 md:cursor-col-resize' : 'h-1 cursor-row-resize'
        }`}
      />

      <div className="min-h-0 min-w-0 overflow-hidden" style={{ flex: `${1 - fraction} 1 0%` }}>
        {outputPane}
      </div>
    </main>
  );
}

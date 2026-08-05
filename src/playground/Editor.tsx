import { useEffect, useRef } from 'react';
import type { EditorView } from '@codemirror/view';
import type { Compartment, Extension } from '@codemirror/state';

export interface EditorProps {
  value: string;
  onChange: (next: string) => void;
  /** Ctrl/Cmd+Enter. The playground's Run button calls the same thing. */
  onRun: () => void;
  /** 1-based line the last run failed on, or `null`. Marked in the gutter and the body. */
  errorLine?: number | null;
}

/** What `load()` hands back — enough to drive the view without re-importing CodeMirror. */
interface Mounted {
  view: EditorView;
  errors: Compartment;
  markError: (line: number | null) => Extension;
}

/**
 * CodeMirror 6, wrapped thinly.
 *
 * Every CodeMirror package is imported *inside* the mount effect, exactly as
 * `highlightLua.ts` loads shiki and for the same two reasons: the module stays
 * synchronous and safe to evaluate during prerender, and the editor's weight is
 * code-split onto the one route that wants it rather than onto every reference entry.
 *
 * The two-layer `<textarea>` in `RunnableExample` stays where it is. It is the right
 * shape for a four-line snippet in the flow of prose, and it cannot do the three things
 * a full-page editor has to: line numbers, an error the reader can see rather than
 * count to, and an undo history that survives pressing Tidy.
 */
export function Editor({ value, onChange, onRun, errorLine = null }: EditorProps) {
  const host = useRef<HTMLDivElement>(null);
  const mounted = useRef<Mounted | null>(null);

  /**
   * The current props, readable from code that outlives the render it was written in.
   *
   * The keymap and the update listener live as long as the view and would otherwise
   * close over the first render's callbacks forever. `value` and `errorLine` are here
   * for a sharper reason: the view is built *after* an `await`, so the document it opens
   * on must be the one that is current when it is finally created, not the one that was
   * current when the import started. A shared link arrives in exactly that window — the
   * page sets the program from the hash while CodeMirror is still loading — and reading
   * the captured value opened the editor on the starter program while running the
   * shared one.
   */
  const latest = useRef({ onChange, onRun, value, errorLine });
  latest.current = { onChange, onRun, value, errorLine };

  // Set while we push a new document in ourselves. Without it the update listener
  // reports our own write back to the parent as if the reader had typed it, and Tidy
  // would land as a user edit — clearing the run marker on a change that cannot alter
  // what the program prints.
  const applying = useRef(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const [view, state, commands, language, luaMode, highlight] = await Promise.all([
        import('@codemirror/view'),
        import('@codemirror/state'),
        import('@codemirror/commands'),
        import('@codemirror/language'),
        import('@codemirror/legacy-modes/mode/lua'),
        import('@lezer/highlight'),
      ]);

      if (cancelled || !host.current) return;

      const { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, Decoration } = view;
      const { EditorState, Compartment } = state;
      const { tags } = highlight;

      /**
       * Colours are CSS custom properties, not literals, so the editor follows the
       * theme toggle with no reconfiguration — and so `app.css` holds the one copy of
       * the palette that inline examples and the playground both read from.
       */
      const luaHighlight = language.HighlightStyle.define([
        { tag: tags.keyword, color: 'var(--lua-keyword)' },
        { tag: tags.controlKeyword, color: 'var(--lua-keyword)' },
        { tag: tags.operatorKeyword, color: 'var(--lua-keyword)' },
        { tag: tags.atom, color: 'var(--lua-number)' },
        { tag: tags.bool, color: 'var(--lua-number)' },
        { tag: tags.number, color: 'var(--lua-number)' },
        { tag: tags.string, color: 'var(--lua-string)' },
        { tag: tags.comment, color: 'var(--lua-comment)', fontStyle: 'italic' },
        { tag: tags.operator, color: 'var(--lua-keyword)' },
        { tag: tags.standard(tags.variableName), color: 'var(--lua-function)' },
        { tag: tags.special(tags.variableName), color: 'var(--lua-function)' },
        { tag: tags.invalid, color: 'var(--color-fd-error)' },
      ]);

      const markError = (line: number | null): Extension => {
        if (line === null) return [];
        return EditorView.decorations.compute(['doc'], (docState) => {
          // The document can shrink under a marker that is still configured — an edit
          // arrives before the next run clears it. A decoration past the end throws.
          if (line < 1 || line > docState.doc.lines) return Decoration.none;
          return Decoration.set([
            Decoration.line({ class: 'cm-luaErrorLine' }).range(docState.doc.line(line).from),
          ]);
        });
      };

      const errors = new Compartment();

      const created = new EditorView({
        parent: host.current,
        state: EditorState.create({
          doc: latest.current.value,
          extensions: [
            lineNumbers(),
            highlightActiveLine(),
            highlightActiveLineGutter(),
            language.bracketMatching(),
            language.indentUnit.of('  '),
            commands.history(),
            language.StreamLanguage.define(luaMode.lua),
            language.syntaxHighlighting(luaHighlight),
            EditorView.lineWrapping,
            // The run binding goes in front of the defaults, which bind Mod-Enter to
            // inserting a blank line.
            keymap.of([
              {
                key: 'Mod-Enter',
                run: () => {
                  latest.current.onRun();
                  return true;
                },
              },
              // Tab indents rather than leaving the editor. A full-page editor is a
              // place people stay, so the keyboard trap is the lesser problem — and
              // Escape then Tab still gets out.
              commands.indentWithTab,
              ...commands.defaultKeymap,
              ...commands.historyKeymap,
            ]),
            errors.of(markError(latest.current.errorLine)),
            EditorView.contentAttributes.of({ 'aria-label': 'Lua program' }),
            EditorView.updateListener.of((update) => {
              if (!update.docChanged || applying.current) return;
              latest.current.onChange(update.state.doc.toString());
            }),
            EditorView.theme({
              '&': {
                height: '100%',
                fontSize: '0.8125rem',
                backgroundColor: 'transparent',
                color: 'var(--color-fd-foreground)',
              },
              '&.cm-focused': { outline: 'none' },
              '.cm-scroller': {
                fontFamily: 'var(--font-mono, ui-monospace, monospace)',
                lineHeight: '1.5rem',
              },
              '.cm-content': {
                padding: '0.75rem 0',
                /**
                 * The caret, which was invisible.
                 *
                 * CodeMirror ships a light base theme and a dark one and chooses between
                 * them from a flag fixed when the theme is built. This site switches
                 * theme at runtime with a class on `<html>`, so that flag is wrong half
                 * the time by construction — it resolved to the light theme's
                 * `caret-color: black`, painted on a near-black editor.
                 *
                 * Naming the colour here beats both base themes with one value that
                 * follows the class, so it is right in either theme and stays right
                 * when the reader toggles.
                 */
                caretColor: 'var(--color-fd-foreground)',
              },
              '.cm-gutters': {
                backgroundColor: 'transparent',
                border: 'none',
                color: 'var(--color-fd-muted-foreground)',
              },
              '.cm-activeLine': { backgroundColor: 'var(--color-fd-accent)' },
              '.cm-activeLineGutter': { backgroundColor: 'transparent' },
              '.cm-luaErrorLine': {
                backgroundColor: 'color-mix(in oklab, var(--color-fd-error) 14%, transparent)',
                boxShadow: 'inset 2px 0 0 0 var(--color-fd-error)',
              },
              // The native selection, for the same reason as the caret above: the base
              // themes style it per-theme and only one of them is ever live. There is no
              // `.cm-cursor` or `.cm-selectionBackground` to style — those belong to
              // `drawSelection()`, which is not loaded, so the browser draws both.
              '.cm-line::selection, .cm-line ::selection': {
                backgroundColor: 'color-mix(in oklab, var(--color-fd-primary) 30%, transparent)',
              },
            }),
          ],
        }),
      });

      mounted.current = { view: created, errors, markError };
    })();

    return () => {
      cancelled = true;
      mounted.current?.view.destroy();
      mounted.current = null;
    };
    // Mount only. `value` and `errorLine` are seeded from the first render and kept in
    // step by the two effects below; rebuilding the view on either would throw away the
    // reader's undo history and cursor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tidy, Reset, and a shared link arriving all push a document in from outside.
  useEffect(() => {
    const current = mounted.current;
    if (!current) return;

    const doc = current.view.state.doc.toString();
    if (doc === value) return;

    applying.current = true;
    try {
      current.view.dispatch({ changes: { from: 0, to: doc.length, insert: value } });
    } finally {
      applying.current = false;
    }
  }, [value]);

  useEffect(() => {
    const current = mounted.current;
    if (!current) return;
    current.view.dispatch({ effects: current.errors.reconfigure(current.markError(errorLine)) });
  }, [errorLine]);

  // `<pre>` until CodeMirror lands, so the prerendered HTML and the first paint both
  // hold the program as legible text rather than an empty box.
  return (
    <div className="relative h-full overflow-auto">
      <div ref={host} className="h-full [&_.cm-editor]:h-full" />
      <noscript>
        <pre className="px-4 py-3 font-mono text-[0.8125rem] leading-6">{value}</pre>
      </noscript>
    </div>
  );
}

import { describe, it, expect, vi } from 'vitest';
import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Editor } from '@/playground/Editor';

/** The document CodeMirror is actually showing. */
const shown = () => document.querySelector('.cm-content')?.textContent ?? null;

/**
 * The real CodeMirror, not the stub `playground.test.tsx` uses.
 *
 * It renders in jsdom well enough to answer the one question a stub cannot: the view is
 * built after an `await`, so which document does it open on when the value changed while
 * the import was still in flight? Nothing here touches layout or measurement, which is
 * where jsdom and CodeMirror actually part company.
 */
describe('the editor', () => {
  it('shows the program it was given', async () => {
    render(<Editor value="print(1)" onChange={vi.fn()} onRun={vi.fn()} />);
    await waitFor(() => expect(shown()).toBe('print(1)'));
  });

  it('names a caret colour that follows the theme', async () => {
    // The caret was invisible in dark mode. CodeMirror ships a light base theme and a
    // dark one and picks between them from a flag fixed when the theme is built, so on
    // a site that toggles theme with a class at runtime it is wrong half the time — it
    // resolved to the light theme's `caret-color: black` on a near-black editor.
    render(<Editor value="print(1)" onChange={vi.fn()} onRun={vi.fn()} />);
    await waitFor(() => expect(shown()).toBe('print(1)'));

    const rules = [...document.styleSheets].flatMap((sheet) => {
      try {
        return [...sheet.cssRules].map((rule) => rule.cssText);
      } catch {
        return [];
      }
    });
    const caret = rules.filter((text) => /\.cm-content[^{]*\{[^}]*caret-color/.test(text));

    expect(caret.length).toBeGreaterThan(0);
    // A variable, not a literal: a literal is a colour that cannot follow the toggle.
    expect(caret.some((text) => /caret-color:\s*var\(--color-fd-foreground\)/.test(text))).toBe(
      true,
    );
  });

  it('opens on the value current when it finished loading, not when it started', async () => {
    // The regression this exists for. CodeMirror is built after an `await`, and a shared
    // link lands in exactly that window: the page reads the program out of the hash and
    // sets it while the editor is still being imported. Opening on the captured value
    // showed the starter program while the output pane showed the result of running the
    // shared one.
    //
    // The re-render is synchronous, so it is guaranteed to happen before the import can
    // resolve — a microtask cannot run while this test still holds the stack. Racing it
    // with a timer instead looked like a passing test and pinned nothing.
    const { rerender } = render(
      <Editor value="the starter program" onChange={vi.fn()} onRun={vi.fn()} />,
    );
    rerender(<Editor value='print("from the link")' onChange={vi.fn()} onRun={vi.fn()} />);

    await waitFor(() => expect(shown()).toBe('print("from the link")'));
  });

  it('follows the value it is given afterwards, as Tidy and Reset need it to', async () => {
    function Controlled() {
      const [value, setValue] = useState('do\nprint(1)\nend');
      return (
        <>
          <button onClick={() => setValue('do\n  print(1)\nend')}>tidy</button>
          <Editor value={value} onChange={vi.fn()} onRun={vi.fn()} />
        </>
      );
    }

    render(<Controlled />);
    await waitFor(() => expect(shown()).toBe('do' + 'print(1)' + 'end'));

    screen.getByRole('button', { name: 'tidy' }).click();

    await waitFor(() => expect(shown()).toBe('do' + '  print(1)' + 'end'));
  });

  it('does not report a document it was handed back as a reader edit', async () => {
    // Tidy would otherwise land as a user edit and clear the run marker — on a change
    // that cannot alter what the program prints.
    const onChange = vi.fn();

    function Controlled() {
      const [value, setValue] = useState('print(1)');
      return (
        <>
          <button onClick={() => setValue('print(2)')}>set</button>
          <Editor value={value} onChange={onChange} onRun={vi.fn()} />
        </>
      );
    }

    render(<Controlled />);
    await waitFor(() => expect(shown()).toBe('print(1)'));

    screen.getByRole('button', { name: 'set' }).click();
    await waitFor(() => expect(shown()).toBe('print(2)'));

    expect(onChange).not.toHaveBeenCalled();
  });
});

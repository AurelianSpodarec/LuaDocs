import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { Playground } from '@/playground/Playground';
import { runLua } from '@/runner/runLua';
import { SelectedVersionProvider } from '@/version/SelectedVersionProvider';
import { SEED_PROGRAM } from '@/playground/seed';
import { hashForProgram, programFromHash } from '@/playground/shareUrl';

vi.mock('@/runner/runLua', () => ({
  runLua: vi.fn(),
  RUNTIME_LUA_VERSION: '5.4',
}));

/**
 * CodeMirror is stubbed as a plain textarea.
 *
 * It is a third-party editor loaded by dynamic import and it does not lay out in jsdom —
 * it needs ranges and box metrics jsdom does not implement. What is worth testing here
 * is the page around it: what runs, what Tidy does, what a shared link carries. The stub
 * keeps the same contract the real `Editor` has (`value`, `onChange`, `onRun`,
 * `errorLine`), so a change to that contract still breaks these tests.
 */
vi.mock('@/playground/Editor', () => ({
  Editor: ({
    value,
    onChange,
    onRun,
    errorLine,
  }: {
    value: string;
    onChange: (next: string) => void;
    onRun: () => void;
    errorLine?: number | null;
  }) => (
    <textarea
      aria-label="Lua program"
      data-error-line={errorLine ?? ''}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) onRun();
      }}
    />
  ),
}));

const mockRunLua = vi.mocked(runLua);
const writeText = vi.fn<(text: string) => Promise<void>>();

/**
 * No switcher of its own: the playground carries one in its header, and a second would
 * make `getByLabelText(/lua version/i)` ambiguous — as it briefly did.
 */
function renderPlayground() {
  render(
    <SelectedVersionProvider>
      <Playground />
    </SelectedVersionProvider>,
  );
}

const editor = () => screen.getByLabelText('Lua program') as HTMLTextAreaElement;

beforeEach(() => {
  mockRunLua.mockReset();
  mockRunLua.mockResolvedValue({ output: '', error: null });
  writeText.mockReset();
  writeText.mockResolvedValue(undefined);

  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  });

  window.history.replaceState({}, '', '/playground');
  localStorage.clear();
});

afterEach(() => {
  window.history.replaceState({}, '', '/playground');
});

describe('arriving at the playground', () => {
  it('opens on the starter program', () => {
    renderPlayground();
    expect(editor().value).toBe(SEED_PROGRAM);
  });

  it('runs it without being asked, so the output pane is not empty on arrival', async () => {
    mockRunLua.mockResolvedValue({ output: '1. cocoa     4.25\n', error: null, ms: 0.4 });
    renderPlayground();

    await waitFor(() => expect(screen.getByLabelText('output')).toHaveTextContent('cocoa'));
    expect(mockRunLua).toHaveBeenCalledWith(SEED_PROGRAM, expect.anything());
  });

  it('opens on the program a shared link carries, not the starter', async () => {
    window.history.replaceState({}, '', `/playground#${hashForProgram('print("shared")')}`);
    renderPlayground();

    await waitFor(() => expect(editor().value).toBe('print("shared")'));
    expect(mockRunLua).toHaveBeenCalledWith('print("shared")', expect.anything());
  });

  it('falls back to the starter program when the link is mangled', async () => {
    window.history.replaceState({}, '', '/playground#p=!!!not base64!!!');
    renderPlayground();

    // A broken link is a recoverable disappointment; a blank editor is not.
    await waitFor(() => expect(mockRunLua).toHaveBeenCalled());
    expect(editor().value).toBe(SEED_PROGRAM);
  });
});

describe('running', () => {
  it('runs the current buffer when Run is clicked', async () => {
    renderPlayground();
    await waitFor(() => expect(mockRunLua).toHaveBeenCalled());

    fireEvent.change(editor(), { target: { value: 'print("edited")' } });
    mockRunLua.mockResolvedValue({ output: 'edited\n', error: null, ms: 1 });
    fireEvent.click(screen.getByRole('button', { name: /^run$/i }));

    await waitFor(() => expect(screen.getByLabelText('output')).toHaveTextContent('edited'));
  });

  it('runs on Ctrl+Enter', async () => {
    renderPlayground();
    await waitFor(() => expect(mockRunLua).toHaveBeenCalled());

    fireEvent.change(editor(), { target: { value: 'print("keyboard")' } });
    fireEvent.keyDown(editor(), { key: 'Enter', ctrlKey: true });

    await waitFor(() =>
      expect(mockRunLua).toHaveBeenCalledWith('print("keyboard")', expect.anything()),
    );
  });

  it('gives a program longer than an inline example to finish in', async () => {
    renderPlayground();
    await waitFor(() => expect(mockRunLua).toHaveBeenCalled());
    // A playground is where somebody writes a long loop. Being cut off at the inline
    // example's three seconds would read as a broken runtime rather than as a guard.
    expect(mockRunLua.mock.calls[0][1]).toMatchObject({ timeoutMs: 5000 });
  });

  it('shows an error instead of output, and points the editor at the line', async () => {
    mockRunLua.mockResolvedValue({
      output: '',
      error: "input:2: attempt to call a nil value (global 'prnt')",
      ms: 0.2,
    });
    renderPlayground();

    await waitFor(() => expect(screen.getByLabelText('output')).toHaveTextContent('attempt to'));
    expect(screen.getByLabelText('output')).toHaveAttribute('data-error');
    expect(editor()).toHaveAttribute('data-error-line', '2');
  });

  it('clears the marker and the error line as soon as the program is edited', async () => {
    mockRunLua.mockResolvedValue({ output: 'x\n', error: 'input:1: boom', ms: 0.2 });
    renderPlayground();
    await waitFor(() => expect(document.querySelector('[data-ran]')).not.toBeNull());

    fireEvent.change(editor(), { target: { value: 'print("new")' } });

    // Output belonging to code no longer on screen is what a reader must not mistake
    // for a result — the same rule the inline example follows.
    expect(document.querySelector('[data-ran]')).toBeNull();
    expect(editor()).toHaveAttribute('data-error-line', '');
  });

  it('reports the chunk time once a run finishes', async () => {
    mockRunLua.mockResolvedValue({ output: 'x\n', error: null, ms: 0.5 });
    renderPlayground();

    await waitFor(() => expect(document.querySelector('[data-ran]')).not.toBeNull());
    expect(document.querySelector('[data-ran]')).toHaveTextContent('ran in 0.50 ms');
  });
});

describe('Tidy', () => {
  it('re-indents the program, and gives the original back', async () => {
    renderPlayground();
    await waitFor(() => expect(mockRunLua).toHaveBeenCalled());

    const messy = 'do\nprint(1)\nend';
    fireEvent.change(editor(), { target: { value: messy } });

    fireEvent.click(screen.getByRole('button', { name: /^tidy$/i }));
    expect(editor().value).toBe('do\n  print(1)\nend');

    fireEvent.click(screen.getByRole('button', { name: /undo tidy/i }));
    expect(editor().value).toBe(messy);
  });

  it('stays enabled but says nothing when there is nothing to re-indent', async () => {
    renderPlayground();
    await waitFor(() => expect(mockRunLua).toHaveBeenCalled());

    // Enabled, because a greyed control that does nothing when pressed reads as broken.
    // Silent, because announcing that nothing happened is worse than the quiet.
    fireEvent.click(screen.getByRole('button', { name: /^tidy$/i }));

    expect(screen.getByRole('button', { name: /^tidy$/i })).not.toBeDisabled();
    expect(editor().value).toBe(SEED_PROGRAM);
    expect(screen.getByRole('status')).toHaveTextContent('');
  });

  it('clears a stale notice instead of leaving it over a buffer it does not describe', async () => {
    renderPlayground();
    await waitFor(() => expect(mockRunLua).toHaveBeenCalled());

    fireEvent.change(editor(), { target: { value: 'do\nprint(1)\nend' } });
    fireEvent.click(screen.getByRole('button', { name: /^tidy$/i }));
    expect(screen.getByRole('status')).toHaveTextContent(/only whitespace changed/i);

    // Pressing it again on the now-tidy result must not leave "Re-indented" standing.
    fireEvent.click(screen.getByRole('button', { name: /undo tidy/i }));
    fireEvent.change(editor(), { target: { value: 'print(1)' } });
    fireEvent.click(screen.getByRole('button', { name: /^tidy$/i }));

    expect(screen.getByRole('status')).toHaveTextContent('');
  });

  it('says what it did when it did something, and when it undid it', async () => {
    renderPlayground();
    await waitFor(() => expect(mockRunLua).toHaveBeenCalled());

    fireEvent.change(editor(), { target: { value: 'do\nprint(1)\nend' } });

    fireEvent.click(screen.getByRole('button', { name: /^tidy$/i }));
    expect(screen.getByRole('status')).toHaveTextContent(/only whitespace changed/i);

    fireEvent.click(screen.getByRole('button', { name: /undo tidy/i }));
    expect(screen.getByRole('status')).toHaveTextContent(/back to how you had it/i);
  });

  it('leaves the two pane headers exactly the same height', async () => {
    renderPlayground();
    await waitFor(() => expect(mockRunLua).toHaveBeenCalled());

    // They were 33.5px and 29.5px, because each was sized by whatever sat in it — Output
    // by the run marker, Input by the taller Tidy button — so the panes began at
    // different heights. jsdom does not lay out, so the invariant pinned here is the one
    // that produced the bug: both headers must come from the same class.
    const headers = [...document.querySelectorAll('[data-pane-header]')];
    expect(headers).toHaveLength(2);
    expect(headers[0].className).toBe(headers[1].className);
    expect(headers[0].className).toMatch(/\bh-8\b/);
  });

  it('sits in the Input pane header, opposite Output', async () => {
    renderPlayground();
    await waitFor(() => expect(mockRunLua).toHaveBeenCalled());

    // Share, Reset and Run act on the session; Tidy acts on the buffer right below it.
    const pane = screen.getByRole('region', { name: 'Input' });
    expect(pane).toHaveTextContent(/input/i);
    expect(pane).not.toHaveTextContent(/main\.lua/i);
    expect(within(pane).getByRole('button', { name: /tidy/i })).toBeInTheDocument();
  });

  it('stays reachable in editor-only mode', async () => {
    renderPlayground();
    await waitFor(() => expect(mockRunLua).toHaveBeenCalled());

    fireEvent.click(screen.getByRole('button', { name: /editor only/i }));

    expect(screen.getByRole('button', { name: /^tidy$/i })).toBeInTheDocument();
  });

  it('does not clear the run marker — whitespace cannot change what a program prints', async () => {
    mockRunLua.mockResolvedValue({ output: '1\n', error: null, ms: 0.3 });
    renderPlayground();
    await waitFor(() => expect(mockRunLua).toHaveBeenCalled());

    fireEvent.change(editor(), { target: { value: 'do\nprint(1)\nend' } });
    fireEvent.click(screen.getByRole('button', { name: /^run$/i }));
    await waitFor(() => expect(document.querySelector('[data-ran]')).not.toBeNull());

    fireEvent.click(screen.getByRole('button', { name: /^tidy$/i }));

    expect(document.querySelector('[data-ran]')).not.toBeNull();
  });
});

describe('Share', () => {
  it('copies a link carrying the whole program', async () => {
    renderPlayground();
    await waitFor(() => expect(mockRunLua).toHaveBeenCalled());

    fireEvent.change(editor(), { target: { value: 'print("share me")' } });
    fireEvent.click(screen.getByRole('button', { name: /share/i }));

    await waitFor(() => expect(writeText).toHaveBeenCalled());
    expect(programFromHash(new URL(writeText.mock.calls[0][0]).hash)).toBe('print("share me")');
    expect(screen.getByRole('status')).toHaveTextContent(/copied/i);
  });

  it('keeps the selected version in the link alongside the program', async () => {
    window.history.replaceState({}, '', '/playground?v=5.1');
    renderPlayground();
    await waitFor(() => expect(mockRunLua).toHaveBeenCalled());

    fireEvent.click(screen.getByRole('button', { name: /share/i }));

    // A shared link that drops the version sends the reader to a page documenting a
    // different Lua from the one the sender was looking at.
    await waitFor(() => expect(writeText).toHaveBeenCalled());
    expect(new URL(writeText.mock.calls[0][0]).searchParams.get('v')).toBe('5.1');
  });

  it('puts the link in the address bar even when the clipboard refuses', async () => {
    writeText.mockRejectedValue(new Error('denied'));
    renderPlayground();
    await waitFor(() => expect(mockRunLua).toHaveBeenCalled());

    fireEvent.change(editor(), { target: { value: 'print("no clipboard")' } });
    fireEvent.click(screen.getByRole('button', { name: /share/i }));

    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/address bar/i));
    expect(programFromHash(window.location.hash)).toBe('print("no clipboard")');
  });

  it('refuses a program too long to make a dependable link', async () => {
    renderPlayground();
    await waitFor(() => expect(mockRunLua).toHaveBeenCalled());

    fireEvent.change(editor(), { target: { value: 'print("x")\n'.repeat(2000) } });
    fireEvent.click(screen.getByRole('button', { name: /share/i }));

    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/too long/i));
    expect(writeText).not.toHaveBeenCalled();
  });
});

describe('the runtime version', () => {
  const control = () => screen.getByLabelText(/lua version/i) as HTMLSelectElement;

  it('shows the version that actually runs, not the one the reader selected', async () => {
    // The selected version is 5.5 by default. The control states 5.4 regardless, because
    // 5.4 is what wasmoon executes and this control describes the runtime.
    renderPlayground();
    await waitFor(() => expect(mockRunLua).toHaveBeenCalled());

    expect(control().value).toBe('5.4');
  });

  it('cannot be changed, because changing it would change nothing', async () => {
    // Offering the choice and then disclaiming it is worse than not offering it: the
    // reader has to act before the site admits the act did nothing. Live in slice 6.
    renderPlayground();
    await waitFor(() => expect(mockRunLua).toHaveBeenCalled());

    expect(control()).toBeDisabled();
  });

  it('discloses the gap against the latest Lua', async () => {
    renderPlayground();
    await waitFor(() => expect(mockRunLua).toHaveBeenCalled());

    expect(screen.getByRole('note', { name: /runtime version/i })).toHaveTextContent(
      /runs Lua 5\.4; output may differ from 5\.5/i,
    );
  });

  it('says the same thing whatever the reader last selected in the docs', async () => {
    // The playground documents nothing, so no version chooses any content here and the
    // reader's docs selection has no bearing on what runs. Reading it made one page say
    // "differ from 5.1" to one person and "differ from 5.5" to another, about output
    // that is byte-for-byte identical in both cases.
    localStorage.setItem('luadocs.version', '5.1');
    renderPlayground();
    await waitFor(() => expect(mockRunLua).toHaveBeenCalled());

    expect(screen.getByRole('note', { name: /runtime version/i })).toHaveTextContent(
      /may differ from 5\.5/i,
    );
  });

  it('leaves the docs selection untouched', async () => {
    localStorage.setItem('luadocs.version', '5.1');
    renderPlayground();
    await waitFor(() => expect(mockRunLua).toHaveBeenCalled());

    // Visiting the playground must not silently rewrite what the reader chose to read.
    expect(localStorage.getItem('luadocs.version')).toBe('5.1');
  });
});

describe('Reset', () => {
  it('is fenced off from Share by a divider', async () => {
    renderPlayground();
    await waitFor(() => expect(mockRunLua).toHaveBeenCalled());

    // Share keeps the reader's program; Reset throws it away. They were adjacent and
    // identically styled, which is how somebody reaching for one hits the other.
    const divider = document.querySelector('[data-action-divider]');
    expect(divider).not.toBeNull();

    const share = screen.getByRole('button', { name: /share/i });
    const reset = screen.getByRole('button', { name: /reset/i });
    expect(share.compareDocumentPosition(divider!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(divider!.compareDocumentPosition(reset) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('says the reader can get their program back', async () => {
    renderPlayground();
    await waitFor(() => expect(mockRunLua).toHaveBeenCalled());

    // True because Reset reaches the document as an ordinary edit, so CodeMirror's
    // history covers it. If Reset ever stops going through the editor, this is wrong.
    expect(screen.getByRole('button', { name: /reset/i })).toHaveAttribute(
      'title',
      expect.stringMatching(/ctrl\+z/i),
    );
  });

  it('restores the starter program and runs it', async () => {
    renderPlayground();
    await waitFor(() => expect(mockRunLua).toHaveBeenCalled());

    fireEvent.change(editor(), { target: { value: 'print("mine")' } });
    mockRunLua.mockClear();
    fireEvent.click(screen.getByRole('button', { name: /reset/i }));

    expect(editor().value).toBe(SEED_PROGRAM);
    await waitFor(() => expect(mockRunLua).toHaveBeenCalledWith(SEED_PROGRAM, expect.anything()));
  });
});

describe('the header', () => {
  it('is a wordmark, not a back button', async () => {
    renderPlayground();
    await waitFor(() => expect(mockRunLua).toHaveBeenCalled());

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/LuaDocs\s*Playground/i);
  });

  it('does not navigate — a title is not a control', async () => {
    // Most readers arriving on a shared link were never in the docs, so a "back" out of
    // here pointed somewhere they had not been. The route into the docs is the sidebar
    // destinations block, the same way in as the playground's own (ADR 0007).
    renderPlayground();
    await waitFor(() => expect(mockRunLua).toHaveBeenCalled());

    const heading = screen.getByRole('heading', { level: 1 });
    expect(within(heading).queryByRole('link')).toBeNull();
    expect(heading.querySelector('a')).toBeNull();
  });
});

describe('layout', () => {
  it('starts side by side, with the divider between the panes', async () => {
    renderPlayground();
    await waitFor(() => expect(mockRunLua).toHaveBeenCalled());

    expect(
      screen.getByRole('button', { name: /side by side/i }),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('stacks the panes, and remembers that it was asked to', async () => {
    renderPlayground();
    await waitFor(() => expect(mockRunLua).toHaveBeenCalled());

    fireEvent.click(screen.getByRole('button', { name: /editor above output/i }));

    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');
    expect(localStorage.getItem('luadocs.playground.layout')).toBe('split-horizontal');
  });

  it('hides the output pane and the divider in editor-only mode', async () => {
    renderPlayground();
    await waitFor(() => expect(mockRunLua).toHaveBeenCalled());

    fireEvent.click(screen.getByRole('button', { name: /editor only/i }));

    expect(screen.queryByRole('separator')).toBeNull();
    expect(screen.queryByLabelText('output')).toBeNull();
  });

  it('moves the divider from the keyboard and remembers where it was put', async () => {
    renderPlayground();
    await waitFor(() => expect(mockRunLua).toHaveBeenCalled());

    const divider = screen.getByRole('separator');
    expect(divider).toHaveAttribute('aria-valuenow', '50');

    // A divider only a mouse can move is one a keyboard reader simply does not have.
    fireEvent.keyDown(divider, { key: 'ArrowRight' });

    expect(divider).toHaveAttribute('aria-valuenow', '52');
    expect(Number(localStorage.getItem('luadocs.playground.split'))).toBeCloseTo(0.52);
  });

  it('will not squeeze a pane to nothing', async () => {
    renderPlayground();
    await waitFor(() => expect(mockRunLua).toHaveBeenCalled());

    const divider = screen.getByRole('separator');
    for (let press = 0; press < 60; press++) {
      fireEvent.keyDown(divider, { key: 'ArrowLeft' });
    }

    expect(divider).toHaveAttribute('aria-valuenow', '15');
  });

  it('restores the layout it was left in', async () => {
    localStorage.setItem('luadocs.playground.layout', 'split-horizontal');
    localStorage.setItem('luadocs.playground.split', '0.7');
    renderPlayground();

    await waitFor(() =>
      expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal'),
    );
    expect(screen.getByRole('separator')).toHaveAttribute('aria-valuenow', '70');
  });
});

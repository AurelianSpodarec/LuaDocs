import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ReactNode } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RunnableExample, RUNTIME_LUA_VERSION } from '@/runner/RunnableExample';
import { runLua } from '@/runner/runLua';
import { SelectedVersionProvider } from '@/version/SelectedVersionProvider';
import { VersionSwitcher } from '@/version/VersionSwitcher';
import { programFromHash } from '@/playground/shareUrl';
import type { LuaVersion } from '@/compat/schema';

// `RUNTIME_LUA_VERSION` moved into `runLua` when the playground began sharing the
// runtime, and `RunnableExample` now re-exports it from there — so a mock replacing the
// whole module has to carry it too, or every test importing it through the component
// fails on an export the mock does not define.
vi.mock('@/runner/runLua', () => ({
  runLua: vi.fn(),
  RUNTIME_LUA_VERSION: '5.4',
}));

// The card gained an "Open in Playground" link, so it now needs router context to
// render at all. These are unit tests of the example card, not of routing: standing a
// memory router up around each one would make every assertion asynchronous to prove
// something none of them is about. The link renders as the anchor it becomes.
vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, hash, children, ...rest }: Record<string, unknown> & { children?: ReactNode }) => (
    <a href={`${String(to)}${hash ? `#${String(hash)}` : ''}`} {...rest}>
      {children}
    </a>
  ),
}));

const mockRunLua = vi.mocked(runLua);

/**
 * `RunnableExample` reads the selected version to disclose the runtime mismatch, so
 * it always needs the provider — in the app it is always under the root one.
 */
function renderExample(code: string) {
  render(
    <SelectedVersionProvider>
      <RunnableExample code={code} />
    </SelectedVersionProvider>,
  );
}

/** Renders the example with `version` selected, driving the real switcher. */
function renderWithVersion(version: LuaVersion) {
  render(
    <SelectedVersionProvider>
      <VersionSwitcher />
      <RunnableExample code="print(1)" />
    </SelectedVersionProvider>,
  );
  fireEvent.change(screen.getByLabelText(/lua version/i), { target: { value: version } });
}

describe('RunnableExample', () => {
  beforeEach(() => {
    mockRunLua.mockReset();
    // Every example runs itself on mount, so a test that does not care about the run
    // still needs a result for it — otherwise the mount run resolves `undefined` and
    // the component reports a TypeError as the example's output.
    mockRunLua.mockResolvedValue({ output: '', error: null });
  });

  it('runs the authored example on mount, without being asked', async () => {
    mockRunLua.mockResolvedValue({ output: '42\n', error: null });
    renderExample('print(42)');

    await waitFor(() => {
      expect(screen.getByLabelText('output')).toHaveTextContent('42');
    });
    expect(mockRunLua).toHaveBeenCalledWith('print(42)');
  });

  it('runs the authored code on mount, not whatever was typed before', async () => {
    renderExample('print(1)');
    await waitFor(() => expect(mockRunLua).toHaveBeenCalledWith('print(1)'));

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'print(2)' } });

    // Editing alone must not re-run: a half-typed line is not a thing to execute.
    expect(mockRunLua).toHaveBeenCalledTimes(1);
  });

  it('renders the returned output in the output panel after clicking Run', async () => {
    mockRunLua.mockResolvedValue({ output: 'hello\n', error: null });
    renderExample("print('hello')");

    fireEvent.click(screen.getByRole('button', { name: /run/i }));

    await waitFor(() => {
      expect(screen.getByLabelText('output')).toHaveTextContent('hello');
    });
    expect(mockRunLua).toHaveBeenCalledWith("print('hello')");
  });

  it('shows the error instead of output when the result carries an error', async () => {
    mockRunLua.mockResolvedValue({ output: '', error: 'boom' });
    renderExample("error('boom')");

    fireEvent.click(screen.getByRole('button', { name: /run/i }));

    await waitFor(() => {
      expect(screen.getByLabelText('output')).toHaveTextContent('error: boom');
    });
  });

  it('returns the button to idle and shows an error when runLua rejects', async () => {
    mockRunLua.mockRejectedValue(new Error('worker construction failed'));
    renderExample('print(1)');

    fireEvent.click(screen.getByRole('button', { name: /run/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^run$/i })).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /^run$/i })).not.toBeDisabled();
    expect(screen.getByLabelText('output')).toHaveTextContent('error: worker construction failed');
  });

  it('discloses the runtime version when another version is selected', () => {
    renderWithVersion('5.1');
    expect(screen.getByRole('note', { name: /runtime version/i })).toHaveTextContent(
      new RegExp(`runs Lua ${RUNTIME_LUA_VERSION.replace('.', '\\.')}`, 'i'),
    );
  });

  it('shows no disclosure when the selected version is what actually runs', () => {
    renderWithVersion(RUNTIME_LUA_VERSION);
    expect(screen.queryByRole('note', { name: /runtime version/i })).toBeNull();
  });

  it('restores the original code when Reset is clicked after editing', () => {
    renderExample('print(1)');

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'print(2)' } });
    expect(textarea.value).toBe('print(2)');

    fireEvent.click(screen.getByRole('button', { name: /reset/i }));

    expect(textarea.value).toBe('print(1)');
  });
});

describe('the handoff to the playground', () => {
  beforeEach(() => {
    mockRunLua.mockReset();
    mockRunLua.mockResolvedValue({ output: '', error: null });
  });

  /** The program a link hands over, read back out of its href. */
  const handedOver = (link: HTMLElement) =>
    programFromHash(new URL(link.getAttribute('href')!, 'https://luadocs.test').hash);

  it('links to the playground carrying the authored program', () => {
    renderExample('print(42)');

    const link = screen.getByRole('link', { name: /open in playground/i });
    expect(link.getAttribute('href')).toContain('/playground');
    expect(handedOver(link)).toBe('print(42)');
  });

  it("carries the reader's edits, not the authored example", () => {
    // The whole point of the seam. Somebody who has changed the example and wants more
    // room must not lose the change on the way there.
    renderExample('print(1)');

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'print(1 + 1)' } });

    expect(handedOver(screen.getByRole('link', { name: /open in playground/i }))).toBe(
      'print(1 + 1)',
    );
  });
});

describe('the run marker', () => {
  it('appears once a run finishes, as proof something executed', async () => {
    mockRunLua.mockResolvedValue({ output: 'hello\n', error: null });
    renderExample("print('hello')");

    await waitFor(() => {
      expect(document.querySelector('[data-ran]')).not.toBeNull();
    });
    // The mock reports no duration, so the marker says only that it ran — which is the
    // load-bearing half. The timed form is covered below.
    expect(document.querySelector('[data-ran]')).toHaveTextContent('ran');
  });

  it('reports the chunk time when the runner measured one', async () => {
    mockRunLua.mockResolvedValue({ output: 'hello\n', error: null, ms: 0.5 });
    renderExample("print('hello')");

    await waitFor(() => {
      expect(document.querySelector('[data-ran]')).not.toBeNull();
    });
    // Sub-millisecond runs keep their decimals — rounding a real 0.5 ms to `0 ms` would
    // read as a broken measurement rather than a fast one.
    expect(document.querySelector('[data-ran]')).toHaveTextContent('ran in 0.50 ms');
  });

  it('clears when the code is edited, so stale output cannot read as fresh', async () => {
    mockRunLua.mockResolvedValue({ output: 'hello\n', error: null });
    renderExample("print('hello')");
    await waitFor(() => expect(document.querySelector('[data-ran]')).not.toBeNull());

    fireEvent.change(screen.getByRole('textbox'), { target: { value: "print('bye')" } });

    // The output pane still shows the previous result — which is exactly why the marker
    // must go. Output that belongs to code no longer on screen is the thing a reader
    // must not mistake for a result.
    expect(screen.getByLabelText('output')).toHaveTextContent('hello');
    expect(document.querySelector('[data-ran]')).toBeNull();
  });

  it('comes back after running the edited code', async () => {
    mockRunLua.mockResolvedValue({ output: 'hello\n', error: null });
    renderExample("print('hello')");
    await waitFor(() => expect(document.querySelector('[data-ran]')).not.toBeNull());

    fireEvent.change(screen.getByRole('textbox'), { target: { value: "print('bye')" } });
    mockRunLua.mockResolvedValue({ output: 'bye\n', error: null });
    fireEvent.click(screen.getByRole('button', { name: /^run$/i }));

    await waitFor(() => {
      expect(screen.getByLabelText('output')).toHaveTextContent('bye');
    });
    expect(document.querySelector('[data-ran]')).not.toBeNull();
  });

  it('marks a failed run too — it still ran', async () => {
    mockRunLua.mockResolvedValue({ output: '', error: 'boom' });
    renderExample("error('boom')");

    await waitFor(() => {
      expect(screen.getByLabelText('output')).toHaveTextContent('error: boom');
    });
    expect(document.querySelector('[data-ran]')).not.toBeNull();
  });
});

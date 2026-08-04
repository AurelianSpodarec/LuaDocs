import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RunnableExample, RUNTIME_LUA_VERSION } from '@/runner/RunnableExample';
import { runLua } from '@/runner/runLua';
import { SelectedVersionProvider } from '@/version/SelectedVersionProvider';
import { VersionSwitcher } from '@/version/VersionSwitcher';
import type { LuaVersion } from '@/compat/schema';

vi.mock('@/runner/runLua', () => ({
  runLua: vi.fn(),
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

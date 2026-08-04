import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RunnableExample } from '@/runner/RunnableExample';
import { runLua } from '@/runner/runLua';

vi.mock('@/runner/runLua', () => ({
  runLua: vi.fn(),
}));

const mockRunLua = vi.mocked(runLua);

describe('RunnableExample', () => {
  beforeEach(() => {
    mockRunLua.mockReset();
  });

  it('renders the returned output in the output panel after clicking Run', async () => {
    mockRunLua.mockResolvedValue({ output: 'hello\n', error: null });
    render(<RunnableExample code="print('hello')" />);

    fireEvent.click(screen.getByRole('button', { name: /run/i }));

    await waitFor(() => {
      expect(screen.getByLabelText('output')).toHaveTextContent('hello');
    });
    expect(mockRunLua).toHaveBeenCalledWith("print('hello')");
  });

  it('shows the error instead of output when the result carries an error', async () => {
    mockRunLua.mockResolvedValue({ output: '', error: 'boom' });
    render(<RunnableExample code="error('boom')" />);

    fireEvent.click(screen.getByRole('button', { name: /run/i }));

    await waitFor(() => {
      expect(screen.getByLabelText('output')).toHaveTextContent('error: boom');
    });
  });

  it('returns the button to idle and shows an error when runLua rejects', async () => {
    mockRunLua.mockRejectedValue(new Error('worker construction failed'));
    render(<RunnableExample code="print(1)" />);

    fireEvent.click(screen.getByRole('button', { name: /run/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^run$/i })).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /^run$/i })).not.toBeDisabled();
    expect(screen.getByLabelText('output')).toHaveTextContent('error: worker construction failed');
  });

  it('restores the original code when Reset is clicked after editing', () => {
    render(<RunnableExample code="print(1)" />);

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'print(2)' } });
    expect(textarea.value).toBe('print(2)');

    fireEvent.click(screen.getByRole('button', { name: /reset/i }));

    expect(textarea.value).toBe('print(1)');
  });
});

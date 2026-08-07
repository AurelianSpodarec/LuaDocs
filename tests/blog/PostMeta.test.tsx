import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PostMeta } from '@/blog/PostMeta';

describe('PostMeta', () => {
  it('renders the date in a machine-readable time element', () => {
    render(<PostMeta date="2026-08-07" />);

    const time = screen.getByText('7 August 2026');
    expect(time.tagName).toBe('TIME');
    expect(time).toHaveAttribute('dateTime', '2026-08-07');
  });

  it('names the author when there is one', () => {
    render(<PostMeta date="2026-08-07" author="Aurelian" />);

    expect(screen.getByText(/Aurelian/)).toBeInTheDocument();
  });

  it('omits the author separator when there is no author', () => {
    const { container } = render(<PostMeta date="2026-08-07" />);

    expect(container.textContent).toBe('7 August 2026');
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EntrySource } from '@/entry/EntrySource';

describe('EntrySource', () => {
  it('names the manual version it is citing, not just the link', () => {
    render(<EntrySource url="https://www.lua.org/manual/5.5/manual.html#pdf-string.format" />);
    expect(screen.getByRole('link', { name: /Lua 5\.5 reference manual/i })).toHaveAttribute(
      'href',
      'https://www.lua.org/manual/5.5/manual.html#pdf-string.format',
    );
  });

  it('cites a symbol by name', () => {
    render(<EntrySource url="https://www.lua.org/manual/5.5/manual.html#pdf-string.format" />);
    expect(screen.getByText('string.format')).toBeInTheDocument();
  });

  it('cites a section by number', () => {
    render(<EntrySource url="https://www.lua.org/manual/5.5/manual.html#6.5.1" />);
    expect(screen.getByText('§6.5.1')).toBeInTheDocument();
  });

  it('renders nothing when the URL is not a manual URL', () => {
    const { container } = render(<EntrySource url="https://example.com/x" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('carries a heading the table of contents can link to', () => {
    const { container } = render(
      <EntrySource url="https://www.lua.org/manual/5.5/manual.html#6.5.1" />,
    );
    expect(container.querySelector('#source')).not.toBeNull();
  });
});

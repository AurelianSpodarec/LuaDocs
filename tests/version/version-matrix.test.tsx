import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VersionMatrix } from '@/version/VersionMatrix';
import type { CompatNode } from '@/compat/schema';

const unchanged: CompatNode = { support: { lua: { version_added: '5.1' } } };
const changed: CompatNode = {
  support: { lua: { version_added: '5.3' } },
  changed_in: { '5.4': 'Tightened coercion.' },
};

describe('VersionMatrix', () => {
  it('renders nothing when no version differs', () => {
    const { container } = render(<VersionMatrix node={unchanged} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders one row per version when something differs', () => {
    render(<VersionMatrix node={changed} />);
    expect(screen.getAllByRole('row')).toHaveLength(6); // header + five versions
  });

  it('states the status of each version in words, not only in colour', () => {
    render(<VersionMatrix node={changed} />);
    expect(screen.getByRole('row', { name: /5\.1/ })).toHaveTextContent('Not available');
    expect(screen.getByRole('row', { name: /5\.3/ })).toHaveTextContent('Available');
    expect(screen.getByRole('row', { name: /5\.4/ })).toHaveTextContent('Changed');
  });

  it('puts the change note on its own version, and an em dash on the rest', () => {
    render(<VersionMatrix node={changed} />);
    expect(screen.getByRole('row', { name: /5\.4/ })).toHaveTextContent('Tightened coercion.');
    expect(screen.getByRole('row', { name: /5\.5/ })).toHaveTextContent('—');
  });

  it('carries a heading the table of contents can link to', () => {
    const { container } = render(<VersionMatrix node={changed} />);
    expect(container.querySelector('#version-support')).not.toBeNull();
  });
});

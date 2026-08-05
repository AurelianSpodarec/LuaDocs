import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VersionSupportStrip } from '@/version/VersionSupportStrip';
import type { CompatNode } from '@/compat/schema';
import { VersionChip } from '@/version/VersionChip';

const node: CompatNode = { support: { lua: { version_added: '5.3' } }, changed_in: { '5.4': 'x' } };

describe('VersionSupportStrip', () => {
  it('shows a chip per version with state labels', () => {
    render(<VersionSupportStrip node={node} />);
    expect(screen.getByText('5.1')).toHaveAttribute('data-state', 'no');
    expect(screen.getByText('5.3')).toHaveAttribute('data-state', 'yes');
    expect(screen.getByText('5.4')).toHaveAttribute('data-state', 'changed');
  });
});

describe('VersionChip', () => {
  it('shows the version as its own text, with the state on the element', () => {
    render(<VersionChip version="5.3" state="yes" />);
    const chip = screen.getByText('5.3');
    expect(chip).toHaveAttribute('data-state', 'yes');
    expect(chip).toHaveAttribute('title', 'Available');
  });

  it('takes a label when the version alone would not read', () => {
    render(<VersionChip version="5.3" state="since" label="5.3+" />);
    expect(screen.getByText('5.3+')).toHaveAttribute('data-state', 'since');
  });
});

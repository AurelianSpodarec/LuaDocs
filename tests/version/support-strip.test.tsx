import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VersionSupportStrip } from '@/version/VersionSupportStrip';
import type { CompatNode } from '@/compat/schema';

const node: CompatNode = { support: { lua: { version_added: '5.3' } }, changed_in: { '5.4': 'x' } };

describe('VersionSupportStrip', () => {
  it('shows a chip per version with state labels', () => {
    render(<VersionSupportStrip node={node} />);
    expect(screen.getByText('5.1')).toHaveAttribute('data-state', 'no');
    expect(screen.getByText('5.3')).toHaveAttribute('data-state', 'yes');
    expect(screen.getByText('5.4')).toHaveAttribute('data-state', 'changed');
  });
});

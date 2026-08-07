import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VersionSupportStrip } from '@/version/VersionSupportStrip';
import type { CompatNode } from '@/compat/schema';
import { VersionChip } from '@/version/VersionChip';
import { SelectedVersionProvider } from '@/version/SelectedVersionProvider';
import { VersionSwitcher } from '@/version/VersionSwitcher';

const node: CompatNode = { support: { lua: { version_added: '5.3' } }, changed_in: { '5.4': 'x' } };

/** The strip is a control now, so it only exists inside the provider it drives. */
function renderStrip(compat: CompatNode = node) {
  render(
    <SelectedVersionProvider>
      <VersionSwitcher />
      <VersionSupportStrip node={compat} />
    </SelectedVersionProvider>,
  );
}

const switcher = () => screen.getByLabelText(/lua version/i);
const chip = (v: string) => screen.getByRole('button', { name: new RegExp(`^${v}$`) });

describe('VersionSupportStrip', () => {
  it('shows a chip per version with state labels', () => {
    renderStrip();
    expect(screen.getByText('5.1')).toHaveAttribute('data-state', 'no');
    expect(screen.getByText('5.3')).toHaveAttribute('data-state', 'yes');
    expect(screen.getByText('5.4')).toHaveAttribute('data-state', 'changed');
  });

  it('selects a version when its chip is clicked', () => {
    renderStrip();
    fireEvent.click(chip('5.4'));
    expect(switcher()).toHaveValue('5.4');
  });

  it('makes the unavailable chips controls too', () => {
    // The half-measure this rejects: only available chips clickable, so some of five
    // identical pills are buttons and nothing says which. Clicking an unavailable one
    // is not a dead end — `VersionNote` explains the absence and offers the way back.
    renderStrip();
    fireEvent.click(chip('5.1'));
    expect(switcher()).toHaveValue('5.1');
    expect(chip('5.1')).toHaveAttribute('data-state', 'no');
  });

  it('marks which version is selected, and moves the mark', () => {
    // A row of five buttons with no current one marked cannot say what it is set to.
    renderStrip();
    fireEvent.click(chip('5.3'));
    expect(chip('5.3')).toHaveAttribute('aria-current', 'true');
    expect(chip('5.5')).not.toHaveAttribute('aria-current');

    fireEvent.click(chip('5.5'));
    expect(chip('5.5')).toHaveAttribute('aria-current', 'true');
    expect(chip('5.3')).not.toHaveAttribute('aria-current');
  });

  it('agrees with the header switcher in both directions', () => {
    renderStrip();
    fireEvent.change(switcher(), { target: { value: '5.2' } });
    expect(chip('5.2')).toHaveAttribute('aria-current', 'true');
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

  it('stays a plain span with no way to select it', () => {
    // What the errors list's `5.3+` marker and the version matrix's rows both need. A
    // marker inside a sentence is not a button, and the matrix exists to compare all
    // five without leaving the version you are on.
    const { container } = render(<VersionChip version="5.3" state="since" label="5.3+" />);
    expect(container.querySelector('button')).toBeNull();
    expect(container.querySelector('span')).not.toBeNull();
  });

  it('becomes a button only when given a way to select', () => {
    const picked: string[] = [];
    render(<VersionChip version="5.4" state="changed" onSelect={(v) => picked.push(v)} />);
    fireEvent.click(screen.getByRole('button', { name: '5.4' }));
    expect(picked).toEqual(['5.4']);
  });
});

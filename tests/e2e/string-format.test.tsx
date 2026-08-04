import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { SelectedVersionProvider } from '@/version/SelectedVersionProvider';
import { VersionSwitcher } from '@/version/VersionSwitcher';
import { VersionSupportStrip } from '@/version/VersionSupportStrip';
import { VersionNote } from '@/version/VersionNote';
import { compatNodeFor } from '@/compat/registry';

const node = compatNodeFor('string.format')!;

function Entry() {
  return (
    <SelectedVersionProvider>
      <VersionSwitcher />
      <VersionSupportStrip node={node} />
      <VersionNote node={node} name="string.format" />
    </SelectedVersionProvider>
  );
}

function selectVersion(version: string) {
  fireEvent.change(screen.getByLabelText(/lua version/i), { target: { value: version } });
}

/** The strip and the switcher both render every version number — scope to the strip. */
function chip(version: string) {
  return within(screen.getByLabelText('Version support')).getByText(version);
}

describe('the assembled string.format entry', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('resolves its compat node from the registry', () => {
    expect(node).not.toBeNull();
    expect(node.support.lua.version_added).toBe('5.1');
  });

  it('shows no delta at the default version', () => {
    render(<Entry />);
    expect(chip('5.5')).toHaveAttribute('data-state', 'yes');
    expect(document.querySelector('[data-note]')).toBeNull();
  });

  it('surfaces the change note for the selected version', () => {
    render(<Entry />);
    selectVersion('5.3');

    const note = document.querySelector('[data-note="changed"]');
    expect(note).not.toBeNull();
    expect(note).toHaveTextContent(/Changed in Lua 5\.3/);
    expect(note).toHaveTextContent(/integer representation/i);
  });

  it('swaps the note when the selected version changes again', () => {
    render(<Entry />);
    selectVersion('5.3');
    expect(document.querySelector('[data-note="changed"]')).toHaveTextContent(
      /integer representation/i,
    );

    selectVersion('5.4');
    expect(document.querySelector('[data-note="changed"]')).toHaveTextContent(/%q/);
  });

  it('marks a version the entry predates as unavailable, with an availability note', () => {
    // string.format exists in every documented version, so use a node that does not.
    const introducedIn53 = {
      support: { lua: { version_added: '5.3' } },
      changed_in: { '5.4': 'Tightened coercion.' },
    } as const;

    render(
      <SelectedVersionProvider>
        <VersionSwitcher />
        <VersionSupportStrip node={introducedIn53} />
        <VersionNote node={introducedIn53} name="math.tointeger" />
      </SelectedVersionProvider>,
    );

    selectVersion('5.1');
    expect(chip('5.1')).toHaveAttribute('data-state', 'no');

    const note = document.querySelector('[data-note="unavailable"]');
    expect(note).toHaveTextContent(/Not in Lua 5\.1/);
    expect(note).toHaveTextContent(/introduced in Lua 5\.3/);
  });
});

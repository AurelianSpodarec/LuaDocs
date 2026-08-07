import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SelectedVersionProvider } from '@/version/SelectedVersionProvider';
import { VersionSwitcher } from '@/version/VersionSwitcher';
import { VersionPanel, availabilityLead } from '@/version/VersionPanel';
import type { CompatNode, LuaVersion } from '@/compat/schema';

const everywhere: CompatNode = { support: { lua: { version_added: '5.1' } } };
const from53: CompatNode = { support: { lua: { version_added: '5.3' } } };
const changedIn54: CompatNode = {
  support: { lua: { version_added: '5.1' } },
  changed_in: { '5.4': 'Tightened coercion.' },
};
const removed: CompatNode = { support: { lua: { version_added: '5.1', version_removed: '5.2' } } };
const cameBack: CompatNode = {
  support: { lua: { version_added: '5.1', version_removed: '5.3', version_restored: '5.5' } },
};

function renderAt(node: CompatNode, version?: LuaVersion) {
  render(
    <SelectedVersionProvider>
      <VersionSwitcher />
      <VersionPanel node={node} />
    </SelectedVersionProvider>,
  );
  if (version) {
    fireEvent.change(screen.getByLabelText(/lua version/i), { target: { value: version } });
  }
}

const panel = () => screen.getByLabelText('Version support');

describe('VersionPanel', () => {
  it('always carries a status, including the good one', () => {
    // The defect it fixes: a status appeared only when something was wrong, so the
    // amber box read as an error banner rather than as this page's version summary.
    renderAt(everywhere);
    expect(panel()).toHaveAttribute('data-tone', 'available');
    expect(panel()).toHaveTextContent('Available in every documented version.');
  });

  it('holds the chips, so they are never an unlabelled row of pills', () => {
    renderAt(everywhere);
    expect(screen.getByLabelText('Choose a version')).toBeInTheDocument();
    expect(panel()).toContainElement(screen.getByLabelText('Choose a version'));
  });

  it('takes the tone of whatever it is reporting', () => {
    renderAt(changedIn54, '5.4');
    expect(panel()).toHaveAttribute('data-tone', 'changed');
    expect(panel()).toHaveTextContent('Changed in Lua 5.4');
  });

  it('reports absence in its own tone', () => {
    renderAt(removed, '5.5');
    expect(panel()).toHaveAttribute('data-tone', 'unavailable');
    expect(panel()).toHaveTextContent('Not in Lua 5.5');
  });

  it('points at the matrix only where the matrix renders', () => {
    // `VersionMatrix` suppresses itself when no version differs, and a link to a
    // section that is not on the page is worse than no link.
    renderAt(from53);
    expect(screen.getByRole('link', { name: /full version support/i })).toHaveAttribute(
      'href',
      '#version-support',
    );

    screen.getByRole('link', { name: /full version support/i }).remove();
    render(
      <SelectedVersionProvider>
        <VersionPanel node={everywhere} />
      </SelectedVersionProvider>,
    );
    expect(screen.queryByRole('link', { name: /full version support/i })).toBeNull();
  });
});

describe('the availability sentence', () => {
  it('says there is nothing to think about, where there is not', () => {
    expect(availabilityLead(everywhere)).toBe('Available in every documented version.');
  });

  it('names an open-ended run by where it starts', () => {
    expect(availabilityLead(from53)).toBe('Available in Lua 5.3 and later.');
  });

  it('names a closed run by where it ends', () => {
    expect(availabilityLead(removed)).toBe('Available up to Lua 5.1.');
  });

  it('states both runs of an entry that came back, rather than spanning the gap', () => {
    // `Lua 5.1–5.5` would be false about the two versions in the middle.
    expect(availabilityLead(cameBack)).toBe('Available in Lua 5.1–5.2 and Lua 5.5.');
  });
});

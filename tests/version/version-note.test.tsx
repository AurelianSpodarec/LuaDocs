import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SelectedVersionProvider } from '@/version/SelectedVersionProvider';
import { VersionSwitcher } from '@/version/VersionSwitcher';
import { unavailableText, VersionUnavailable } from '@/version/VersionNote';
import type { CompatNode, LuaVersion } from '@/compat/schema';

/** The four shapes of absence. Only the first had a branch of its own. */
const notYetAdded: CompatNode = { support: { lua: { version_added: '5.2' } } };
const removed: CompatNode = { support: { lua: { version_added: '5.1', version_removed: '5.2' } } };
const never: CompatNode = { support: { lua: { version_added: false } } };

/** Renders the callout with `version` selected, driving the real switcher. */
function renderAt(node: CompatNode, version: LuaVersion) {
  render(
    <SelectedVersionProvider>
      <VersionSwitcher />
      <VersionUnavailable node={node} />
    </SelectedVersionProvider>,
  );
  fireEvent.change(screen.getByLabelText(/lua version/i), { target: { value: version } });
}

const note = () => document.querySelector('[data-note="unavailable"]');

describe('the unavailable callout', () => {
  it('renders nothing where the entry exists', () => {
    renderAt(removed, '5.1');
    expect(note()).toBeNull();
  });

  it('tells a reader below version_added when it arrives', () => {
    // The case that already worked. It must keep reading exactly this.
    renderAt(notYetAdded, '5.1');
    expect(note()).toHaveTextContent(
      'Not in Lua 5.1. Introduced in Lua 5.2. Everything below describes it as it exists from then on.',
    );
  });

  it('says a removed entry was removed, and when', () => {
    renderAt(removed, '5.5');
    expect(note()).toHaveTextContent('removed in Lua 5.2');
  });

  it('never promises a removed entry survives into the reader’s version', () => {
    // The defect: every unavailable entry closed with "as it exists from then on",
    // which on a removed one asserts a present tense the symbol does not have.
    renderAt(removed, '5.5');
    expect(note()).not.toHaveTextContent('from then on');
    expect(note()).toHaveTextContent('as it was, up to Lua 5.1');
  });

  it('states the whole span from the dataset, not from version_added alone', () => {
    renderAt(removed, '5.5');
    expect(note()).toHaveTextContent(
      'Not in Lua 5.5. Introduced in Lua 5.1 and removed in Lua 5.2.',
    );
  });

  it('claims nothing about a symbol no documented version has', () => {
    renderAt(never, '5.5');
    expect(note()).toHaveTextContent('Not in Lua 5.5. Not part of any documented Lua version.');
    // The same trailing clause used to be appended here too, describing an existence
    // the sentence before it had just denied.
    expect(note()).not.toHaveTextContent('from then on');
  });
});

describe('the sentence each shape of absence gets', () => {
  it('distinguishes all four, including the one no dataset can reach yet', () => {
    // `math.frexp` and `math.ldexp` are documented in 5.1 and 5.2, absent from 5.3 and
    // 5.4, and documented again in 5.5. `src/compat/schema.ts` cannot say that — one
    // `version_removed` cannot be reopened — so no `CompatNode` produces `restored`, and
    // the branch is pinned here on the shape instead of through a node that cannot exist.
    expect(unavailableText({ kind: 'never' })).toBe('Not part of any documented Lua version.');

    expect(unavailableText({ kind: 'not-yet', addedIn: '5.2' })).toContain(
      'Introduced in Lua 5.2',
    );

    expect(
      unavailableText({
        kind: 'removed',
        addedIn: '5.1',
        removedIn: '5.2',
        lastAvailable: '5.1',
      }),
    ).toBe(
      'Introduced in Lua 5.1 and removed in Lua 5.2. Everything below describes it as it was, up to Lua 5.1.',
    );

    expect(
      unavailableText({
        kind: 'restored',
        addedIn: '5.1',
        removedIn: '5.3',
        lastAvailable: '5.2',
        restoredIn: '5.5',
      }),
    ).toBe(
      'Introduced in Lua 5.1, removed in Lua 5.3, and back in Lua 5.5. Everything below describes it as it exists there.',
    );
  });
});

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
/** `math.frexp` and `math.ldexp` — in 5.1 and 5.2, gone from 5.3 and 5.4, back in 5.5. */
const cameBack: CompatNode = {
  support: { lua: { version_added: '5.1', version_removed: '5.3', version_restored: '5.5' } },
};

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

  it('tells a reader inside the gap that the entry comes back, and when', () => {
    // The branch that had no dataset able to reach it until `version_restored` existed.
    // It is driven here through the real switcher and a real node, which is the whole
    // proof that the schema and the renderer now meet.
    renderAt(cameBack, '5.4');
    expect(note()).toHaveTextContent(
      'Not in Lua 5.4. Introduced in Lua 5.1, removed in Lua 5.3, and back in Lua 5.5.',
    );
  });

  it('renders nothing on either side of the gap', () => {
    renderAt(cameBack, '5.5');
    expect(note()).toBeNull();
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
  it('distinguishes all four', () => {
    // Kept as a direct test of the four shapes even though every one of them is now
    // reachable from a node: these are the exact strings, and the callout tests above
    // assert substrings of them.
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

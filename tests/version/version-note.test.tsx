import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SelectedVersionProvider } from '@/version/SelectedVersionProvider';
import { VersionSwitcher } from '@/version/VersionSwitcher';
import { targetVersion, unavailableLead, unavailableText } from '@/version/VersionNote';
import { VersionPanel } from '@/version/VersionPanel';
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
      <VersionPanel node={node} />
    </SelectedVersionProvider>,
  );
  fireEvent.change(screen.getByLabelText(/lua version/i), { target: { value: version } });
}

const note = () => document.querySelector('[data-note="unavailable"]');
/** The lead and the sentence are separate lines in the panel, so assert them apart. */
const says = (lead: string, rest: string) => {
  expect(note()).toHaveTextContent(lead);
  expect(note()).toHaveTextContent(rest);
};

describe('the unavailable callout', () => {
  it('renders nothing where the entry exists', () => {
    renderAt(removed, '5.1');
    expect(note()).toBeNull();
  });

  it('tells a reader below version_added which version to want', () => {
    renderAt(notYetAdded, '5.1');
    says('Not in Lua 5.1.', 'Everything below describes Lua 5.2, where it was introduced.');
  });

  it('points a reader past a removed entry at the last version that had it', () => {
    renderAt(removed, '5.5');
    says('Not in Lua 5.5.', 'Everything below describes Lua 5.1, the last version that had it.');
  });

  it('never promises a removed entry survives into the reader’s version', () => {
    // The original defect: every unavailable entry closed with "as it exists from then
    // on", which on a removed one asserts a present tense the symbol does not have.
    renderAt(removed, '5.5');
    expect(note()).not.toHaveTextContent('from then on');
  });

  it('names each version once', () => {
    // What replaced "Introduced in Lua 5.1 and removed in Lua 5.2. Everything below
    // describes it as it was, up to Lua 5.1" — four numbers carrying two facts, with
    // the reader's version repeated from the lead and the target named twice. The
    // support strip below carries the history, in colour and clickable.
    renderAt(removed, '5.2');
    const text = note()!.textContent!;
    expect(text.match(/5\.2/g)).toHaveLength(1);
    expect(text.match(/5\.1/g)).toHaveLength(1);
  });

  it('tells a reader inside the gap that the entry comes back, and where', () => {
    // The branch that had no dataset able to reach it until `version_restored` existed.
    renderAt(cameBack, '5.4');
    says('Not in Lua 5.4.', 'Everything below describes Lua 5.5, where it returns after a gap.');
  });

  it('renders nothing on either side of the gap', () => {
    renderAt(cameBack, '5.5');
    expect(note()).toBeNull();
  });

  it('claims nothing about a symbol no documented version has', () => {
    renderAt(never, '5.5');
    // No "Not in Lua 5.5" lead: it is a special case of what the sentence already says,
    // and there is no version worth naming for a symbol no version has.
    expect(note()).toHaveTextContent('Not part of any documented Lua version.');
    expect(note()).not.toHaveTextContent('Not in Lua 5.5');
    expect(note()).not.toHaveTextContent('Everything below');
  });

  it('offers no button — the support strip is where a version is chosen', () => {
    // There was one, briefly. It read "View as Lua 5.1" under a sentence already
    // ending in 5.1, and the strip below now selects any version directly.
    renderAt(removed, '5.5');
    expect(screen.queryByRole('button', { name: /lua 5\.1/i })).toBeNull();
  });
});

describe('the sentence each shape of absence gets', () => {
  const gone = { kind: 'removed', addedIn: '5.1', removedIn: '5.2', lastAvailable: '5.1' } as const;
  const gap = {
    kind: 'restored',
    addedIn: '5.1',
    removedIn: '5.3',
    lastAvailable: '5.2',
    restoredIn: '5.5',
  } as const;

  it('distinguishes all four', () => {
    expect(unavailableText({ kind: 'never' })).toBe('');
    expect(unavailableText({ kind: 'not-yet', addedIn: '5.2' })).toBe(
      'Everything below describes Lua 5.2, where it was introduced.',
    );
    expect(unavailableText(gone)).toBe(
      'Everything below describes Lua 5.1, the last version that had it.',
    );
    expect(unavailableText(gap)).toBe(
      'Everything below describes Lua 5.5, where it returns after a gap.',
    );
  });

  it('leads with the reader’s version, except where that says nothing', () => {
    expect(unavailableLead(gone, '5.4')).toBe('Not in Lua 5.4.');
    expect(unavailableLead({ kind: 'never' }, '5.4')).toBe(
      'Not part of any documented Lua version.',
    );
  });

  it('names the version `targetVersion` resolves, never another', () => {
    // The sentence is built from `targetVersion`, so the two cannot disagree. `restored`
    // is the case where they could: either side of the gap is defensible from
    // availability alone, and the body is written about the version it came back in.
    expect(targetVersion(gap)).toBe('5.5');
    expect(unavailableText(gap)).toContain('Lua 5.5');
    expect(unavailableText(gap)).not.toContain('5.2');

    expect(targetVersion(gone)).toBe('5.1');
    expect(unavailableText(gone)).toContain('Lua 5.1');
    expect(targetVersion({ kind: 'never' })).toBeNull();
  });
});

import { describe, it, expect } from 'vitest';
import {
  availabilityRanges,
  isAvailable,
  changeNoteFor,
  supportRow,
  unavailableIn,
  varies,
} from '@/compat/resolve';
import { LUA_VERSIONS, type CompatNode } from '@/compat/schema';

const node: CompatNode = {
  support: { lua: { version_added: '5.3' } },
  changed_in: { '5.4': 'Tightened coercion.' },
};

const neverAddedNode: CompatNode = {
  support: { lua: { version_added: false } },
};

const removedNode: CompatNode = {
  support: { lua: { version_added: '5.2', version_removed: '5.4' } },
};

const removedAndChangedNode: CompatNode = {
  support: { lua: { version_added: '5.1', version_removed: '5.3' } },
  changed_in: { '5.3': 'Removed here, but also has a change note.' },
};

describe('isAvailable', () => {
  it('false before version_added', () => expect(isAvailable(node, '5.1')).toBe(false));
  it('true from version_added onward', () => expect(isAvailable(node, '5.3')).toBe(true));

  it('is false for every version when version_added is false', () => {
    for (const v of LUA_VERSIONS) {
      expect(isAvailable(neverAddedNode, v)).toBe(false);
    }
  });

  it('is true up to but excluding version_removed', () => {
    expect(isAvailable(removedNode, '5.3')).toBe(true);
  });

  it('excludes the version_removed version itself', () => {
    expect(isAvailable(removedNode, '5.4')).toBe(false);
  });

  it('stays false for versions after version_removed', () => {
    expect(isAvailable(removedNode, '5.5')).toBe(false);
  });
});

describe('changeNoteFor', () => {
  it('returns the note for a changed version', () =>
    expect(changeNoteFor(node, '5.4')).toBe('Tightened coercion.'));
  it('returns null when unchanged', () => expect(changeNoteFor(node, '5.5')).toBeNull());
});

describe('supportRow', () => {
  it('marks unavailable, available, and changed states', () => {
    expect(supportRow(node)).toEqual([
      { version: '5.1', state: 'no' },
      { version: '5.2', state: 'no' },
      { version: '5.3', state: 'yes' },
      { version: '5.4', state: 'changed' },
      { version: '5.5', state: 'yes' },
    ]);
  });

  it('gives every version "no" when version_added is false', () => {
    expect(supportRow(neverAddedNode)).toEqual(
      LUA_VERSIONS.map((version) => ({ version, state: 'no' })),
    );
  });

  it('"no" beats "changed" when a removed version also has a changed_in entry', () => {
    const row = supportRow(removedAndChangedNode);
    expect(row.find((r) => r.version === '5.3')).toEqual({ version: '5.3', state: 'no' });
  });
});

describe('unavailableIn', () => {
  it('is null where the entry exists, so it doubles as the render guard', () => {
    expect(unavailableIn(removedNode, '5.3')).toBeNull();
  });

  it('reads a version below version_added as not yet added', () => {
    expect(unavailableIn(node, '5.1')).toEqual({ kind: 'not-yet', addedIn: '5.3' });
  });

  it('reads a version at or above version_removed as removed', () => {
    // The distinction the callout and the sidebar badge were both missing: on `5.5`
    // this used to be indistinguishable from the case above.
    expect(unavailableIn(removedNode, '5.5')).toEqual({
      kind: 'removed',
      addedIn: '5.2',
      removedIn: '5.4',
      lastAvailable: '5.3',
    });
  });

  it('names the removal version itself, not merely the last one that had it', () => {
    expect(unavailableIn(removedNode, '5.4')).toMatchObject({
      removedIn: '5.4',
      lastAvailable: '5.3',
    });
  });

  it('has a shape for a symbol in no documented version', () => {
    expect(unavailableIn(neverAddedNode, '5.3')).toEqual({ kind: 'never' });
  });
});

describe('availabilityRanges', () => {
  it('gives one run for an entry that arrived and stayed', () => {
    expect(availabilityRanges(node)).toEqual([{ from: '5.3', to: '5.5' }]);
  });

  it('closes the run at the last version that has it', () => {
    expect(availabilityRanges(removedNode)).toEqual([{ from: '5.2', to: '5.3' }]);
  });

  it('is empty for a symbol no documented version has', () => {
    expect(availabilityRanges(neverAddedNode)).toEqual([]);
  });
});

describe('varies', () => {
  it('is false for an entry present since 5.1 and never changed', () => {
    expect(varies({ support: { lua: { version_added: '5.1' } } })).toBe(false);
  });

  it('is false when changed_in is present but empty', () => {
    expect(varies({ support: { lua: { version_added: '5.1' } }, changed_in: {} })).toBe(false);
  });

  it('is true when the entry arrived later than 5.1', () => {
    expect(varies({ support: { lua: { version_added: '5.3' } } })).toBe(true);
  });

  it('is true when the entry was removed', () => {
    expect(
      varies({ support: { lua: { version_added: '5.1', version_removed: '5.4' } } }),
    ).toBe(true);
  });

  it('is true when any version carries a change note', () => {
    expect(
      varies({ support: { lua: { version_added: '5.1' } }, changed_in: { '5.3': 'x' } }),
    ).toBe(true);
  });

  it('is true for a symbol in no documented version', () => {
    expect(varies({ support: { lua: { version_added: false } } })).toBe(true);
  });
});

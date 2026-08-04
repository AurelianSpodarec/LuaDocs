import { describe, it, expect } from 'vitest';
import { isAvailable, changeNoteFor, supportRow } from '@/compat/resolve';
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

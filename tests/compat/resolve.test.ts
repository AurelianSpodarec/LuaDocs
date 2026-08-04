import { describe, it, expect } from 'vitest';
import { isAvailable, changeNoteFor, supportRow } from '@/compat/resolve';
import type { CompatNode } from '@/compat/schema';

const node: CompatNode = {
  support: { lua: { version_added: '5.3' } },
  changed_in: { '5.4': 'Tightened coercion.' },
};

describe('isAvailable', () => {
  it('false before version_added', () => expect(isAvailable(node, '5.1')).toBe(false));
  it('true from version_added onward', () => expect(isAvailable(node, '5.3')).toBe(true));
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
});

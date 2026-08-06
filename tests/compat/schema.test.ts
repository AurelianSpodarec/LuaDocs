import { describe, it, expect } from 'vitest';
import { compatNodeSchema } from '@/compat/schema';
import { compatNodes } from '@/compat/registry';

const valid = {
  support: {
    lua: { version_added: '5.1' },
  },
  changed_in: { '5.3': 'Integer directives now require an integer representation.' },
};

describe('compatNodeSchema', () => {
  it('accepts a valid compat node', () => {
    expect(() => compatNodeSchema.parse(valid)).not.toThrow();
  });

  it('rejects an unknown version key in changed_in', () => {
    const bad = { support: { lua: { version_added: '5.1' } }, changed_in: { '4.0': 'nope' } };
    expect(() => compatNodeSchema.parse(bad)).toThrow();
  });

  it('rejects an unknown key instead of silently stripping it', () => {
    const typo = { support: { lua: { version_added: '5.1', version_remved: '5.3' } } };
    expect(() => compatNodeSchema.parse(typo)).toThrow();
  });
});

/**
 * The removed-then-restored shape — `math.frexp` and `math.ldexp`, documented in 5.1 and
 * 5.2, absent from 5.3 and 5.4, documented again in 5.5.
 *
 * `.strict()` catches a misspelled key; these catch a well-spelled key carrying a version
 * that cannot be true. The failure this schema exists to prevent is a dataset that parses
 * and then renders four surfaces' worth of confident nonsense, and a transposed pair of
 * bounds does exactly that.
 */
describe('an entry that left and came back', () => {
  const restored = (lua: Record<string, unknown>) => () =>
    compatNodeSchema.parse({ support: { lua } });

  it('accepts the shape neither bound could express', () => {
    expect(
      restored({ version_added: '5.1', version_removed: '5.3', version_restored: '5.5' }),
    ).not.toThrow();
  });

  it('leaves every existing dataset spelling untouched', () => {
    // The other ~54 files in `data/` say nothing new, and must keep parsing byte for byte.
    expect(restored({ version_added: '5.1' })).not.toThrow();
    expect(restored({ version_added: '5.1', version_removed: '5.2' })).not.toThrow();
    expect(restored({ version_added: false })).not.toThrow();
  });

  it('rejects a restoration with nothing to reopen', () => {
    expect(restored({ version_added: '5.1', version_restored: '5.5' })).toThrow(
      /version_restored without version_removed/,
    );
  });

  it('rejects the two transposed', () => {
    // `removed: '5.5', restored: '5.3'` is the mistake the field newly makes possible,
    // and it would otherwise parse: an entry gone from 5.5 and back in 5.3 reads as
    // available everywhere, which is the exact silent-wrongness `.strict()` exists for.
    expect(
      restored({ version_added: '5.1', version_removed: '5.5', version_restored: '5.3' }),
    ).toThrow(/must be after version_removed/);
  });

  it('rejects a removal at or before the version that added it', () => {
    expect(restored({ version_added: '5.3', version_removed: '5.3' })).toThrow(
      /must be after version_added/,
    );
    expect(restored({ version_added: '5.3', version_removed: '5.1' })).toThrow(
      /must be after version_added/,
    );
  });

  it('rejects a bound on a symbol no documented version has', () => {
    expect(restored({ version_added: false, version_removed: '5.3' })).toThrow();
    expect(restored({ version_added: false, version_restored: '5.5' })).toThrow();
  });

  it('rejects a misspelling of the new key as readily as of the old one', () => {
    expect(
      restored({ version_added: '5.1', version_removed: '5.3', version_restred: '5.5' }),
    ).toThrow();
  });
});

describe('the registered datasets', () => {
  it('carries a node for every symbol the string pilot documents', () => {
    for (const key of ['string.format', 'string.len', 'string.gsub', 'string.patterns']) {
      expect(compatNodes[key], key).toBeDefined();
    }
  });

  it('records string.len as present since 5.1 and never changed', () => {
    const node = compatNodes['string.len'];
    expect(node.support.lua.version_added).toBe('5.1');
    expect(node.support.lua.version_removed).toBeUndefined();
    expect(node.changed_in ?? {}).toEqual({});
  });
});

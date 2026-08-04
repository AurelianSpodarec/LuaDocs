import { describe, it, expect } from 'vitest';
import { compatNodeSchema } from '@/compat/schema';

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

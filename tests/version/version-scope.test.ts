import { describe, it, expect } from 'vitest';
import { appliesTo, assertScope } from '@/version/versionScope';
import { LUA_VERSIONS, type LuaVersion } from '@/compat/schema';

/** Which of the five a scope covers — the whole answer in one line per case. */
const covered = (scope: Parameters<typeof appliesTo>[0]) =>
  LUA_VERSIONS.filter((version) => appliesTo(scope, version));

describe('appliesTo', () => {
  it('takes `since` as inclusive', () => {
    expect(covered({ since: '5.4' })).toEqual(['5.4', '5.5']);
  });

  it('takes `before` as exclusive', () => {
    expect(covered({ before: '5.4' })).toEqual(['5.1', '5.2', '5.3']);
  });

  it('makes the two exact complements — no version in both, none in neither', () => {
    // The property the pair exists for: a change is two blocks and every reader gets
    // exactly one of them. An inclusive/exclusive "until" cannot promise this.
    for (const boundary of LUA_VERSIONS) {
      const early = covered({ before: boundary });
      const late = covered({ since: boundary });
      expect([...early, ...late]).toEqual([...LUA_VERSIONS]);
    }
  });

  it('bounds a single run when both are given', () => {
    expect(covered({ since: '5.2', before: '5.4' })).toEqual(['5.2', '5.3']);
    expect(covered({ since: '5.4', before: '5.5' })).toEqual(['5.4']);
  });

  it('answers for the default version when no version is selected', () => {
    // No provider above, and the prerender pass before `?v=` resolves. Base content is
    // written against the default, so that is what the rest of the page is showing.
    expect(appliesTo({ since: '5.4' }, null)).toBe(true);
    expect(appliesTo({ before: '5.4' }, null)).toBe(false);
  });
});

describe('assertScope', () => {
  it('reads a scope off well-formed props', () => {
    expect(assertScope({ since: '5.4', children: 'x' })).toEqual({
      since: '5.4',
      before: undefined,
    });
  });

  it('refuses an attribute that is neither of the two', () => {
    // The characteristic typo. Ignored, it leaves the block rendering on every version
    // with nothing anywhere to say the marker did not take.
    expect(() => assertScope({ sinse: '5.4', children: 'x' })).toThrow(/`sinse`/);
  });

  it('refuses a value that is not a documented version', () => {
    expect(() => assertScope({ since: '5.40' })).toThrow(/not a version this site documents/);
    expect(() => assertScope({ before: 5.4 as unknown as LuaVersion })).toThrow(
      /not a version this site documents/,
    );
  });

  it('refuses a marker that scopes nothing', () => {
    expect(() => assertScope({ children: 'x' })).toThrow(/needs `since`, `before`, or both/);
  });

  it('refuses the two transposed, which would apply to no version', () => {
    // The same mistake `version_removed`/`version_restored` is refused for in the
    // dataset: it parses, and then means nothing anybody wrote.
    expect(() => assertScope({ since: '5.4', before: '5.2' })).toThrow(/applies to no version/);
    expect(() => assertScope({ since: '5.4', before: '5.4' })).toThrow(/applies to no version/);
  });
});

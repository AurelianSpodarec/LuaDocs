import { describe, it, expect } from 'vitest';
import { citationFor, parseManualUrl } from '@/entry/manualSource';
import { CONTENT_TREE } from '@/content-tree/manifest';
import { sourceUrl, type Section } from '@/content-tree/manifest';

describe('parseManualUrl', () => {
  it('splits a manual URL into its version and anchor', () => {
    expect(parseManualUrl('https://www.lua.org/manual/5.5/manual.html#pdf-string.format')).toEqual(
      { version: '5.5', anchor: 'pdf-string.format' },
    );
  });

  it('reads a section anchor as readily as a symbol anchor', () => {
    expect(parseManualUrl('https://www.lua.org/manual/5.4/manual.html#6.4.1')).toEqual({
      version: '5.4',
      anchor: '6.4.1',
    });
  });

  it('returns null for anything that is not a manual URL', () => {
    expect(parseManualUrl('https://example.com/whatever')).toBeNull();
    expect(parseManualUrl('https://www.lua.org/manual/5.5/manual.html')).toBeNull();
  });

  // The parser is the manifest generator run backwards. Nothing links the two at
  // runtime — importing the manifest into a component would pull 292 entries into the
  // bundle — so this is what keeps them from drifting apart.
  it('round-trips every source the manifest generates', () => {
    const sources = (function collect(sections: Section[]): Section['source'][] {
      return sections.flatMap((s) => [
        s.source,
        ...s.entries.map((e) => e.source),
        ...collect(s.sections),
      ]);
    })(CONTENT_TREE);

    expect(sources.length).toBeGreaterThan(200);
    for (const source of sources) {
      expect(parseManualUrl(sourceUrl(source))).toEqual({
        version: source.version,
        anchor: source.anchor,
      });
    }
  });
});

describe('citationFor', () => {
  it('reads a symbol anchor as the symbol', () => {
    expect(citationFor('pdf-string.format')).toBe('string.format');
  });

  it('reads a numeric anchor as a section', () => {
    expect(citationFor('6.5.1')).toBe('§6.5.1');
  });
});

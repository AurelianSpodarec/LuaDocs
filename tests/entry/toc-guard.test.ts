import { describe, it, expect } from 'vitest';
import { parseManualUrl } from '@/entry/manualSource';

/**
 * The route's TOC append for the Source heading (`src/routes/docs/$.tsx`) guards on
 * `parseManualUrl(sourceUrl)` — the same predicate `EntrySource` uses to decide whether
 * to render at all. This pins that shared predicate against the two inputs that matter,
 * so the TOC entry and the section it points at can never disagree.
 */
describe('the predicate shared by the Source TOC entry and EntrySource', () => {
  it('parses a real manual URL — so the TOC entry is appended and EntrySource renders', () => {
    expect(
      parseManualUrl('https://www.lua.org/manual/5.5/manual.html#pdf-string.format'),
    ).not.toBeNull();
  });

  it('rejects a well-formed non-manual URL — so neither happens', () => {
    expect(parseManualUrl('https://example.com/lua/string-format')).toBeNull();
  });
});

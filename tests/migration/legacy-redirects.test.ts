import { existsSync, readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import { LEGACY_REDIRECTS } from '@/migration/legacyRedirects';
import { entryFileFor, isAuthored } from '@/migration/authored';

describe('the legacy redirect map', () => {
  it('has one entry per live URL on the old site', () => {
    // 70 live old URLs, less the homepage, which does not move. See ADR 0012.
    expect(LEGACY_REDIRECTS).toHaveLength(69);
  });

  it('never lists a source twice', () => {
    const seen = new Map<string, number>();
    for (const { from } of LEGACY_REDIRECTS) seen.set(from, (seen.get(from) ?? 0) + 1);
    expect([...seen].filter(([, n]) => n > 1).map(([from]) => from)).toEqual([]);
  });

  it('never chains one redirect into another', () => {
    // A target that is also a source costs every reader on that path an extra hop,
    // and Google discounts a chain it has to follow.
    const sources = new Set(LEGACY_REDIRECTS.map((r) => r.from));
    expect(LEGACY_REDIRECTS.filter((r) => sources.has(r.to)).map((r) => r.from)).toEqual([]);
  });

  it('never redirects a path to itself', () => {
    expect(LEGACY_REDIRECTS.filter((r) => r.from === r.to)).toEqual([]);
  });

  it('uses absolute, same-origin, slash-free paths at both ends', () => {
    const bad = LEGACY_REDIRECTS.filter(
      ({ from, to }) =>
        !from.startsWith('/docs/') ||
        !to.startsWith('/docs') ||
        from.endsWith('/') ||
        to.endsWith('/'),
    );
    expect(bad).toEqual([]);
  });
});

/**
 * Empty, and it stays empty. A redirect target without a body turns an indexed 200 on the
 * old site into a page that says nothing — worse than the 404 it was avoiding.
 *
 * This started as a four-item ratchet holding the `io`, `os`, `package` and `debug`
 * overviews. All four were authored in slice 2.6.2, so it starts empty and nothing may be
 * added to it.
 */
const KNOWN_STUB_TARGETS: string[] = [];

const targets = [...new Set(LEGACY_REDIRECTS.map((r) => r.to))].sort();

describe('every redirect target', () => {
  it('resolves to sixty-six distinct pages', () => {
    // Sixty-nine redirects, but the four prose pages share `/docs`.
    expect(targets).toHaveLength(66);
  });

  it('is a file in the content tree', () => {
    const missing = targets.filter((to) => !existsSync(`content/docs/${entryFileFor(to)}`));
    expect(missing).toEqual([]);
  });

  it('has a body — every one of them', () => {
    const stubs = targets.filter(
      (to) => !isAuthored(readFileSync(`content/docs/${entryFileFor(to)}`, 'utf8')),
    );
    // Fails both ways on purpose: a new stub target is a regression, and clearing one is a
    // prompt to delete it from KNOWN_STUB_TARGETS rather than leave the list lying.
    expect(stubs).toEqual(KNOWN_STUB_TARGETS);
  });
});

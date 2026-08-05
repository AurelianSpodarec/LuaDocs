import { describe, it, expect } from 'vitest';
import { buildFullToc } from '@/entry/pageToc';

/**
 * The right rail is specified as flat, H2-only (`docs/research/page-structure.md`),
 * but the page-anatomy template puts an entry's Examples under real `###`
 * subheadings. This pins `buildFullToc` — the function that reconciles the two — so
 * an H3 never sneaks back into the rail.
 */
describe('buildFullToc', () => {
  const h2h3Toc = [
    { title: 'Syntax', url: '#syntax', depth: 2 },
    { title: 'Description', url: '#description', depth: 2 },
    { title: 'Examples', url: '#examples', depth: 2 },
    { title: 'Basic use', url: '#basic-use', depth: 3 },
    { title: 'Edge cases', url: '#edge-cases', depth: 3 },
    { title: 'Gotchas', url: '#gotchas', depth: 2 },
    { title: 'See also', url: '#see-also', depth: 2 },
  ];

  it('drops H3 entries', () => {
    const result = buildFullToc(h2h3Toc, { showVersionSupport: false, showSource: false });

    expect(result.some((item) => item.depth === 3)).toBe(false);
  });

  it('keeps H2 entries in their original order', () => {
    const result = buildFullToc(h2h3Toc, { showVersionSupport: false, showSource: false });

    expect(result.map((item) => item.title)).toEqual([
      'Syntax',
      'Description',
      'Examples',
      'Gotchas',
      'See also',
    ]);
  });

  it('appends Version support only when the matrix will render', () => {
    const withMatrix = buildFullToc(h2h3Toc, { showVersionSupport: true, showSource: false });
    const withoutMatrix = buildFullToc(h2h3Toc, { showVersionSupport: false, showSource: false });

    expect(withMatrix.map((item) => item.title)).toContain('Version support');
    expect(withoutMatrix.map((item) => item.title)).not.toContain('Version support');
  });

  it('appends Source only when the citation will render', () => {
    const withSource = buildFullToc(h2h3Toc, { showVersionSupport: false, showSource: true });
    const withoutSource = buildFullToc(h2h3Toc, { showVersionSupport: false, showSource: false });

    expect(withSource.map((item) => item.title)).toContain('Source');
    expect(withoutSource.map((item) => item.title)).not.toContain('Source');
  });

  it('lands both synthetic entries after the MDX ones, in order', () => {
    const result = buildFullToc(h2h3Toc, { showVersionSupport: true, showSource: true });

    expect(result.map((item) => item.title)).toEqual([
      'Syntax',
      'Description',
      'Examples',
      'Gotchas',
      'See also',
      'Version support',
      'Source',
    ]);
    expect(result.every((item) => item.depth === 2)).toBe(true);
  });
});

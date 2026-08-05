import type { TableOfContents } from 'fumadocs-core/toc';

/**
 * Assembles the right-rail "In this article" TOC for an entry page.
 *
 * The rail is specified as flat, H2-only (`docs/research/page-structure.md`). The
 * page-anatomy template deliberately puts each entry's Examples under real `###`
 * subheadings rather than components ("Examples — always plural, each under its own
 * heading"), so the MDX-derived TOC that Fumadocs hands back is not itself flat. It
 * is filtered down to depth 2 here rather than by asking authors to stop writing the
 * subheadings the template requires.
 *
 * The matrix and the citation are rendered by the route, not the MDX body, so neither
 * heading is in the MDX-derived TOC to begin with. `showVersionSupport`/`showSource`
 * mirror the same conditions those sections render under, so the rail never claims a
 * section is there when the route decided not to render it.
 */
export function buildFullToc(
  toc: TableOfContents,
  { showVersionSupport, showSource }: { showVersionSupport: boolean; showSource: boolean },
): TableOfContents {
  return [
    ...toc.filter((item) => item.depth === 2),
    ...(showVersionSupport
      ? [{ title: 'Version support', url: '#version-support', depth: 2 }]
      : []),
    ...(showSource ? [{ title: 'Source', url: '#source', depth: 2 }] : []),
  ];
}

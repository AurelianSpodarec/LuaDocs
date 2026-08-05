import type { TableOfContents } from 'fumadocs-core/toc';

/**
 * How the two route-rendered section headings are set.
 *
 * "Version support" and "Source" are appended to the rail below at depth 2, alongside
 * the authored `## Syntax`, `## Description` and `## See also` — the rail makes all
 * five the same kind of thing. They were three different sizes on the page (24px, 20px
 * and 14px) while the rail said otherwise, which is not a difference a reader can read
 * as deliberate. They match the authored H2s instead, which is also how MDN sets
 * "Specifications" and "Browser compatibility": a full heading over small, quiet
 * content. What keeps Source from shouting is its own chrome — the rule above it and
 * the muted single line beneath — not a smaller heading.
 *
 * Shared rather than repeated so the two cannot drift apart again.
 */
export const sectionHeadingClass = 'mb-3 text-2xl font-semibold text-fd-foreground';

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
